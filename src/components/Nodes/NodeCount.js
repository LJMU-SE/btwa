import { useEffect, useState } from "react";
import nodes from "@/nodes.json";
import io from "socket.io-client";
import toast from "react-hot-toast";
import Spinner from "../Loaders/Spinner";

function NodeCount() {
    const [count, setCount] = useState(0);
    const [updating, setUpdating] = useState(true);

    // Define an array of sockets
    let [sockets, setSockets] = useState([]);

    useEffect(() => {
        let connectionAttempts = 0;
        // Loop through the nodes
        nodes.forEach((address, index) => {
            // Connect to socket
            const socket = io(`http://${address}:8080`);

            // Create event to listen for connection
            socket.on("connect", () => {
                setCount((prevCount) => prevCount + 1);
                // connectionAttempts++;
            });

            // Create event to listen for disconnects
            socket.on("disconnect", () => {
                setCount((prevCount) => prevCount - 1);
            });

            // Add socket to array
            sockets.push(socket);
            connectionAttempts++;

            if (connectionAttempts == nodes.length - 1) setUpdating(false);
        });

        // Clean up the socket connection when the component unmounts
        return () => {
            for (let socket of sockets) {
                socket.disconnect();
            }
            setSockets([]);
        };
    }, [sockets]);

    function update(e) {
        setUpdating(true);
        e.preventDefault();
        updateAll();
    }

    function updateAll(nodes) {
        // Promise function to process the image
        console.log(sockets.length);
        sockets.forEach((socket, index) => {
            if (index == sockets.length - 1) setUpdating(true);
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
