import { useEffect, useRef, useState } from "react";
import nodes from "@/nodes.json";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import Layout from "@/components/Layout/Layout";
import Spinner from "@/components/Loaders/Spinner";
import { useWebSocket } from "@/utils/WebSocketContext";

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
                <h1 className="text-9xl text-white font-black">{count}</h1>
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

    // Sunctions to handle and process the image
    async function handleImageData(data) {
        // If no image data, return to the homescreen
        if (!data.image_data) {
            toast.error("No Image Data Received");
            return router.back();
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

        console.log(images.current, connectedSocketCount);

        // If number of images matches number of connected sockets, process the images
        if (images.current.length == connectedSocketCount) {
            processImage();
        }
    }

    function processImage() {
        // Get the email, name, and dimensions from the request query
        const { email, name, x, y } = router.query;
        let processingURL = "";

        switch (router.query.method) {
            default:
                processingURL = "/api/processing/360";
                break;
        }

        return new Promise((resolve, reject) => {
            fetch(processingURL, {
                method: "POST",
                body: JSON.stringify({
                    images: images.current,
                    email,
                    name,
                    x,
                    y,
                    type: router.query.method || "360",
                }),
                headers: {
                    "Content-Type": "application/json",
                },
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
    const liveSocket = useWebSocket(nodes[4]);

    // Set live preview stop time
    let streamStopTime = new Date();
    streamStopTime.setSeconds(streamStopTime.getSeconds() + 9);

    // Get all sockets
    const allSockets = useWebSocket();

    // Set params based on capture type
    let params = {
        resolution: {
            x: parseInt(router.query.x),
            y: parseInt(router.query.y),
        },
        shutter_speed: parseInt(router.query.shutter),
        iso: parseInt(router.query.iso),
    };

    // Process all images
    useEffect(() => {
        switch (router.query.method) {
            case "360":
                // Define capture time
                let captureTime = new Date();
                captureTime.setSeconds(captureTime.getSeconds() + 10);

                params.time = captureTime.toUTCString();
                break;
            default:
                break;
        }

        // Loop through the nodes
        allSockets.forEach((socket) => {
            // Capture an image
            socket.emit("CAPTURE_IMAGE", params);

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

        return () => {
            liveSocket.off("VIDEO_FRAME");
        };
    }, []);

    return (
        <Layout title={"Capturing Video"} links={false} navbar={false}>
            <div
                className={
                    "fixed w-full h-screen flex flex-col justify-center items-center"
                }
            >
                <div className="bg-[#101018] fixed w-screen h-screen z-0">
                    <img
                        ref={liveRef}
                        className="opacity-70 z-0 fixed w-screen h-screen object-center object-cover"
                    />
                </div>
                {count > 0 ? (
                    <h2
                        className={
                            "text-4xl text-white z-10 font-semibold mb-20"
                        }
                    >
                        Get Ready!
                    </h2>
                ) : (
                    <h2
                        className={
                            "text-4xl text-white z-10 font-semibold mb-20"
                        }
                    >
                        Processing Your Video...
                    </h2>
                )}
                <Countdown count={count} setCount={setCount} />
            </div>
        </Layout>
    );
}

export default Capture;
