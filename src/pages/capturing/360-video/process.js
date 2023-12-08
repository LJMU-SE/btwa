import { useEffect, useState } from "react";
import nodes from "@/nodes.json";
import io from "socket.io-client";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import Layout from "@/components/Layout/Layout";

function Capture() {
    // Define the router
    const router = useRouter();

    // Define an array of sockets and images
    const [images, setImages] = useState([]);
    const [sockets, setSockets] = useState([]);

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
        if (!images.includes(captureData)) {
            images.push(captureData);
        }

        // Get Number of Connected Sockets
        const connectedSocketCount = sockets.filter((x) => {
            return x.connected;
        }).length;

        // If number of images matches number of connected sockets, process the images
        if (images.length == connectedSocketCount) {
            toast.promise(processImage(), {
                loading: "Capturing Video...",
                success: <b>Video Render Successful!</b>,
                error: <b>Video Render Failed!</b>,
            });
        }
    }

    function processImage() {
        const { email, name, x, y } = router.query;

        return new Promise((resolve, reject) => {
            fetch("/api/process/video-360", {
                method: "POST",
                body: JSON.stringify({ images, email, name, x, y }),
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
            });

            // Add socket to array
            sockets.push(socket);

            // Create event to listen for connection
            socket.on("connect", () => {
                console.log(`🟢 | Connected to node ${address}`);
                socket.emit("CAPTURE_IMAGE", {
                    resolution: {
                        x: parseInt(router.query.x),
                        y: parseInt(router.query.y),
                    },
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
        }, 5000); // 5000 milliseconds (adjust as needed)

        // Clean up the socket connection and timeout when the component unmounts
        return () => {
            for (let socket of sockets) {
                socket.disconnect();
            }
            clearTimeout(checkNoConnectedNodes);
            setImages([]);
            setSockets([]);
        };
    }, []);

    return (
        <Layout title={"Capturing Video"} links={false} navbar={true}>
            <div className="w-full h-[calc(100vh-80px)] flex justify-center items-center">
                <div className="flex gap-2">
                    <div className="w-5 h-5 rounded-full animate-bounce-load bg-ljmu dark:bg-white"></div>
                    <div
                        style={{ animationDelay: ".2s" }}
                        className="w-5 h-5 rounded-full animate-bounce-load bg-ljmu dark:bg-white"
                    ></div>
                    <div
                        style={{ animationDelay: ".4s" }}
                        className="w-5 h-5 rounded-full animate-bounce-load bg-ljmu dark:bg-white"
                    ></div>
                </div>
            </div>
        </Layout>
    );
}

export default Capture;
