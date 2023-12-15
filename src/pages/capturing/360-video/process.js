import { useEffect, useRef, useState } from "react";
import nodes from "@/nodes.json";
import io from "socket.io-client";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import Layout from "@/components/Layout/Layout";
import Spinner from "@/components/Loaders/Spinner";

const Countdown = ({ count, setCount }) => {
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
        <div>
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
    const sockets = useRef([]);

    // Define Counter
    const [count, setCount] = useState(10);

    // Define capture time
    let captureTime = new Date();
    captureTime.setSeconds(captureTime.getSeconds() + 10);

    // Sunctions to handle and process the image
    async function handleImageData(data) {
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
        const connectedSocketCount = sockets.current.filter((x) => {
            return x.connected;
        }).length;

        // If number of images matches number of connected sockets, process the images
        if (images.current.length == connectedSocketCount) {
            processImage();
        }
    }

    function processImage() {
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

    useEffect(() => {
        // Initialize a counter for connected nodes
        let connectedNodeCount = 0;

        // Loop through the nodes
        nodes.forEach((address) => {
            // Connect to socket
            const socket = io(`http://${address}:8080`, {
                connect_timeout: 4000,
                reconnection: false,
                reconnectionAttempts: 0,
                transports: ["websocket", "polling", "flashsocket"],
            });

            // Add socket to array
            sockets.current = [...sockets.current, socket];

            // Create event to listen for connection
            socket.on("connect", () => {
                console.log(`🟢 | Connected to node ${address}`);
                socket.emit("CAPTURE_IMAGE", {
                    resolution: {
                        x: parseInt(router.query.x),
                        y: parseInt(router.query.y),
                    },
                    time: captureTime.toUTCString(),
                });

                // Increment the connected node count
                connectedNodeCount++;
            });

            // Create event to listen for image data
            socket.on("IMAGE_DATA", handleImageData);

            // Create event to listen for disconnects
            socket.on("disconnect", () => {
                console.log(`🔴 | Disconnected from node ${address}`);
            });
        });

        // Check if no nodes are connected after a delay (e.g., 5 seconds)
        const checkNoConnectedNodes = setTimeout(() => {
            if (connectedNodeCount === 0) {
                // No nodes are connected, redirect to the previous page
                toast.error("No Connected Nodes");
                router.back(); // or use router.push('/') to redirect to a specific page
            }
        }, 10000); // 5000 milliseconds (adjust as needed)

        // Clean up the socket connection and timeout when the component unmounts
        return () => {
            for (let socket of sockets.current) {
                socket.disconnect();
            }
            clearTimeout(checkNoConnectedNodes);
            images.current = [];
            sockets.current = [];
        };
    }, []);

    return (
        <Layout title={"Capturing Video"} links={false} navbar={false}>
            <div
                className={
                    "w-full h-[calc(100vh-80px)] flex flex-col justify-center items-center"
                }
            >
                {count > 0 ? (
                    <h2 className={"text-4xl font-semibold mb-20"}>
                        Get Ready!
                    </h2>
                ) : (
                    <h2 className={"text-4xl font-semibold mb-20"}>
                        Processing Your Video...
                    </h2>
                )}
                <Countdown count={count} setCount={setCount} />
            </div>
        </Layout>
    );
}

export default Capture;
