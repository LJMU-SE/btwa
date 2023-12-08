import { useEffect, useState } from "react";
import nodes from "@/nodes.json";
import io from "socket.io-client";
import toast from "react-hot-toast";
import Spinner from "../Loaders/Spinner";

function NodeCount() {
    const [count, setCount] = useState(0);
    const [updating, setUpdating] = useState(false);

    // Define an array of sockets
    let sockets = [];

    useEffect(() => {
        // Loop through the nodes
        nodes.forEach((address) => {
            // Connect to socket
            const socket = io(`http://${address}:8080`);

            // Create event to listen for connection
            socket.on("connect", () => {
                setCount((prevCount) => prevCount + 1);
            });

            // Create event to listen for disconnects
            socket.on("disconnect", () => {
                setCount((prevCount) => prevCount - 1);
            });

            // Add socket to array
            sockets.push(socket);
        });

        // Clean up the socket connection when the component unmounts
        return () => {
            for (let socket of sockets) {
                socket.disconnect();
            }
        };
    }, []);

    function update(e) {
        setUpdating(true);
        e.preventDefault();
        toast
            .promise(updateAll(nodes), {
                loading: `Updating Nodes`,
                success: `All Connected Nodes Updated`,
                error: `Some Node Updates Failed`,
            })
            .finally(() => {
                setUpdating(false);
            });
    }

    function updateAll(nodes) {
        // Promise function to process the image
        return new Promise((resolve, reject) => {
            fetch("/api/update", {
                method: "POST",
                body: JSON.stringify({ nodes }),
            }).then(async (response) => {
                if (response.ok) {
                    const data = await response.json();
                    console.log(`🟢 | ${data.message}`);
                    resolve();
                } else {
                    const data = await response.json();
                    console.log(`🔴 | ${data.message}`);
                    console.log(
                        `The following nodes updated successfully: \n    - ${data.successes.join(
                            "\n    - "
                        )}`
                    );
                    console.log(
                        `The following nodes failed to update: \n    - ${data.failures.join(
                            "\n    - "
                        )}`
                    );
                    reject();
                }
            });
        });
    }

    return (
        <div className="w-full h-46 flex flex-col p-10 items-center justify-center relative">
            <h1 className={"text-5xl font-semibold mb-5"}>{count}</h1>
            <p className={"text-xl"}>Of {nodes.length} nodes online</p>
            <button
                onClick={update}
                className={
                    updating
                        ? "flex justify-center items-center mt-5 px-2 py-2 w-12 rounded-full bg-ljmu dark:bg-white/80 text-white dark:text-ljmu transition-all"
                        : "flex justify-center items-center mt-5 px-2 py-2 w-32 rounded-md bg-ljmu hover:bg-ljmu/80 dark:bg-white/80 dark:hover:bg-white/50 dark:hover:text-white dark:text-ljmu text-white transition-all"
                }
                disabled={updating ? true : false}
            >
                {updating ? <Spinner /> : "Update Nodes"}
            </button>
        </div>
    );
}

export default NodeCount;
