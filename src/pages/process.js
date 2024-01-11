import { useEffect, useRef, useState } from "react";
import nodes from "@/nodes.json";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import Layout from "@/components/Layout/Layout";
import { useWebSocket } from "@/utils/WebSocketContext";
import Countdown from "@/components/Processing/Countdown";

function Capture() {
    // Define the router
    const router = useRouter();

    // Get all sockets
    const allSockets = useWebSocket();

    // Define an array of sockets and images
    const images = useRef([]);

    // Define Counter
    const [count, setCount] = useState(5);

    // Set base params based on capture type
    let params = {
        resolution: {
            x: parseInt(router.query.x),
            y: parseInt(router.query.y),
        },
        shutter_speed: parseInt(router.query.shutter),
        iso: parseInt(router.query.iso),
    };

    // Add optional params if necessary
    switch (router.query.method) {
        case "360":
            // Define capture time
            let captureTime = new Date();
            captureTime.setSeconds(captureTime.getSeconds() + 5);

            params.time = captureTime.toUTCString();
            break;
        default:
            break;
    }

    // Function to get the current number of connected nodes
    function getConnectedNodeCount() {
        return allSockets.filter((x) => {
            return x.connected;
        }).length;
    }

    // Add event listeners to the sockets
    useEffect(() => {
        // Loop through the nodes
        allSockets.forEach((socket) => {
            // Create event to listen for image data
            socket.on("IMAGE_DATA", (data) => {
                // If no image data, return to the homescreen
                if (!data.image_data) {
                    toast.error("No Image Data Received");
                    return router.back();
                }

                // Log image data received
                console.log(
                    `📷 | Image data received from ${data.node_name} (${
                        images.current.length + 1
                    }/${getConnectedNodeCount()})`
                );

                // Parse image data as a buffer string
                const imgData = Buffer.from(data.image_data).toString("base64");

                // Make capture data
                const captureData = {
                    node: data.node_name,
                    imgData,
                };

                // If the image is not already in the array, add it
                if (!images.current.includes(captureData)) {
                    images.current = [...images.current, captureData];
                }

                // If number of images is greater or equal to the number of connected nodes, process the images
                if (images.current.length >= getConnectedNodeCount()) {
                    console.log("🟠 | All images received, processing...");
                    processImages();
                }
            });
        });

        return () => {
            allSockets.forEach((socket) => {
                socket.off("IMAGE_DATA");
                images.current = [];
            });
        };
    }, []);

    // Function to send capture request
    function captureImages() {
        allSockets.forEach((socket) => {
            console.log(
                `🟠 | Sending capture request to ${socket._opts.hostname}`
            );
            socket.emit("CAPTURE_IMAGE", params);
        });
    }

    // Function to process images
    function processImages() {
        // Get the email, name, and dimensions from the request query
        const { email, name, x, y } = router.query;
        let processingURL = "";

        switch (router.query.method) {
            default:
                processingURL = "/api/processing/360";
                break;
        }

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
            } else {
                console.log(`🔴 | ${data.message}: ${data.error}`);
                router.back();
            }
        });
    }

    return (
        <Layout title={"Capturing Video"} links={false} navbar={false}>
            <div
                className={
                    "fixed w-full h-screen flex flex-col justify-center items-center"
                }
            >
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
                        Say Cheese!
                    </h2>
                )}
                <Countdown
                    count={count}
                    setCount={setCount}
                    onEnd={captureImages}
                />
            </div>
        </Layout>
    );
}

export default Capture;
