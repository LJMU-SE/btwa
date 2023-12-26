import { useWebSocket } from "@/WebSocketContext";
import { useEffect, useState } from "react";
import io from "socket.io-client";

function StatusInfo({ children }) {
    return <div className="w-full text-left px-10">{children}</div>;
}

function Ping({ status }) {
    switch (status) {
        case "Connected":
            return (
                <span className="relative flex h-3 w-3 ml-12">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
            );
        case "Disconnected":
            return (
                <span className="relative flex h-3 w-3 ml-12">
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
            );
        default:
            return (
                <span className="relative flex h-3 w-3 ml-12">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                </span>
            );
    }
}

function NodeStatus({ address, setCount }) {
    const [connectionStatus, setConnectionStatus] = useState("Connecting");
    const [hostname, setHostname] = useState("NODE_HOSTNAME");
    const [version, setVersion] = useState("NODE_VERSION");

    const socket = useWebSocket(address);

    useEffect(() => {
        // Create event to listen for connection
        socket.on("connect", () => {
            setConnectionStatus("Connected");
        });

        // Get Node Data
        socket.emit("GET_NODE_DATA");

        // When node information is received, update the table
        socket.on("NODE_DATA", (data) => {
            setHostname(data.node);
            setVersion(data.version);
            setConnectionStatus("Connected");
            setCount((prevCount) => prevCount + 1);
        });

        // Create event to listen for disconnects
        socket.on("reconnect", () => {
            setCount((prevCount) => prevCount + 1);
            setConnectionStatus("Connected");
            socket.emit("GET_NODE_DATA");
        });

        // Create event to listen for disconnects
        socket.on("disconnect", () => {
            setConnectionStatus("Disconnected");
            setCount((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
        });
    }, []);

    return (
        <div className="w-full sm:w-[50%] md:w-[calc(100%/3)] lg:w-[25%] xl:w-[20%] flex items-center justify-between py-2 h-max border-[0.5px] border-solid dark:border-white/25">
            <Ping status={connectionStatus} />
            <div className="flex flex-col w-full">
                <StatusInfo>
                    {connectionStatus == "Connected" ? hostname : address}
                </StatusInfo>
                <StatusInfo>
                    {connectionStatus == "Connected" ? (
                        `v${version}`
                    ) : (
                        <div className="animate-pulse">
                            <div className="h-3 my-1.5 bg-gray-200 rounded-md"></div>
                        </div>
                    )}
                </StatusInfo>
            </div>
        </div>
    );
}

export default NodeStatus;
