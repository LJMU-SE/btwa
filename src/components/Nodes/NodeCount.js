import { useEffect, useState, useRef } from "react";
import nodes from "@/nodes.json";
import io from "socket.io-client";
import toast from "react-hot-toast";
import Spinner from "../Loaders/Spinner";

function NodeCount() {
    const [count, setCount] = useState(0);
    const [updating, setUpdating] = useState(false);

    const sockets = useRef([]);

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
            sockets.current = [...sockets.current, socket];
        });

        // Clean up the socket connection when the component unmounts
        return () => {
            for (let socket of sockets.current) {
                socket.disconnect();
            }
            sockets.current = [];
        };
    }, []);

    function update(e) {
        setUpdating(true);
        e.preventDefault();
        updateAll();
    }

    function updateAll(nodes) {
        // Promise function to process the image
        console.log(sockets.current.length);
        sockets.current.forEach((socket, index) => {
            socket.emit("UPDATE", null);
            if (index == sockets.current.length - 1) setUpdating(false);
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
