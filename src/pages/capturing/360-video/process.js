import { useEffect, useRef, useState } from "react";
import nodes from "@/nodes.json";
import io from "socket.io-client";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import Layout from "@/components/Layout/Layout";
import Spinner from "@/components/Loaders/Spinner";
import { useWebSocket } from "@/WebSocketContext";

function _arrayBufferToBase64(buffer) {
    var binary = "";
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

const Countdown = ({ count, setCount, onEnd }) => {
    useEffect(() => {
        const timer = setInterval(() => {
            setCount((prevCount) =>
                prevCount > 0 ? prevCount - 1 : prevCount
            );
        }, 1000);

        // Clear the interval when the component is unmounted
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative z-10">
            {count > 0 ? (
                <h1 className="text-9xl font-black">{count}</h1>
            ) : (
                <Spinner />
            )}
        </div>
    );
};

function Capture() {
    // Define the router
    const router = useRouter();

    // Define an array of sockets and images
    const images = useRef([]);

    // Define Counter
    const [count, setCount] = useState(10);

    // Define live ref
    const liveRef = useRef(null);

    // Define capture time
    let captureTime = new Date();
    captureTime.setSeconds(captureTime.getSeconds() + 10);

    let streamStopTime = new Date();
    streamStopTime.setSeconds(streamStopTime.getSeconds() + 9);

    // Sunctions to handle and process the image
    async function handleImageData(data) {
        console.log("HERE");
        // If no image data, return to the homescreen
        if (!data.image_data) {
            toast.error("No Image Data Received");
            return router.push("/capturing/360-video");
        }

        // Parse image data as a buffer string
        const imgData = Buffer.from(data.image_data).toString("base64");

        // Make capture data
        const captureData = {
            imgData,
            node: data.node_name,
        };

        // If the image is not already in the array, add it
        if (!images.current.includes(captureData)) {
            images.current = [...images.current, captureData];
        }

        // Get Number of Connected Sockets
        const connectedSocketCount = allSockets.filter((x) => {
            return x.connected;
        }).length;

        // If number of images matches number of connected sockets, process the images
        if (images.current.length == connectedSocketCount) {
            processImage();
        }
    }

    function processImage() {
        console.log("Processing image");
        const { email, name, x, y } = router.query;

        return new Promise((resolve, reject) => {
            fetch("/api/process/video-360", {
                method: "POST",
                body: JSON.stringify({
                    images: images.current,
                    email,
                    name,
                    x,
                    y,
                }),
            }).then(async (response) => {
                const data = await response.json();

                if (response.ok) {
                    console.log(`🟢 | ${data.message}`);
                    router.push(`/view?videoID=${data.id}`);
                    resolve(data.message);
                } else {
                    reject(data.message);
                }
            });
        });
    }

    // Get Live Preview Socket
    const liveSocket = useWebSocket(nodes[0]);
    const [live, setLive] = useState(true);

    // Get all sockets
    const allSockets = useWebSocket();

    // Process all images
    useEffect(() => {
        // Loop through the nodes
        allSockets.forEach((socket) => {
            // Capture an image
            socket.emit("CAPTURE_IMAGE", {
                resolution: {
                    x: parseInt(router.query.x),
                    y: parseInt(router.query.y),
                },
                time: captureTime.toUTCString(),
            });

            // Create event to listen for image data
            socket.on("IMAGE_DATA", handleImageData);
        });
    }, []);

    // Configure live stream
    useEffect(() => {
        liveSocket.emit("START_STREAM", {
            resolution: {
                x: parseInt(router.query.x),
                y: parseInt(router.query.y),
            },
            time: streamStopTime.toUTCString(),
        });

        // When video frame is received, update the stream
        liveSocket.on("VIDEO_FRAME", (data) => {
            // Update the image source with the base64 data
            if (liveRef.current) {
                liveRef.current.src = `data:image/jpeg;base64,${_arrayBufferToBase64(
                    data.frame_data
                )}`;
            }
        });
    }, []);

    return (
        <Layout title={"Capturing Video"} links={false} navbar={false}>
            {live ? (
                <div
                    className={
                        "fixed w-full h-screen flex flex-col justify-center items-center"
                    }
                >
                    <img
                        ref={liveRef}
                        className="opacity-70 z-0 fixed w-screen h-screen object-center object-cover"
                    />
                    {count > 0 ? (
                        <h2 className={"text-4xl z-10 font-semibold mb-20"}>
                            Get Ready!
                        </h2>
                    ) : (
                        <h2 className={"text-4xl z-10 font-semibold mb-20"}>
                            Processing Your Video...
                        </h2>
                    )}
                    <Countdown count={count} setCount={setCount} />
                </div>
            ) : null}
        </Layout>
    );
}

export default Capture;
