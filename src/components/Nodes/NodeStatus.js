import { useWebSocket } from "@/utils/WebSocketContext";
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

function NodeStatus({ address, count, setCount }) {
    const [connectionStatus, setConnectionStatus] = useState("Connecting");
    const [hostname, setHostname] = useState("NODE_HOSTNAME");
    const [version, setVersion] = useState("NODE_VERSION");
    const [connectedCount, setConnectedCount] = useState(0);

    const websockets = useWebSocket();

    const socket = useWebSocket(address);

    useEffect(() => {
        // Get Node Data
        socket.emit("GET_NODE_DATA");
        setCount(
            websockets.filter((x) => {
                return x.connected;
            }).length
        );

        socket.on("connect", () => {
            // Get Node Data
            socket.emit("GET_NODE_DATA");
            setConnectionStatus("Connected");

            if (count + 1 > websockets.length) return;
            setCount((oldCount) => oldCount + 1);
        });

        socket.on("disconnect", () => {
            setConnectionStatus("Disconnected");
            if (count + 1 < 0) return;
            setCount((oldCount) => oldCount - 1);
        });

        // When node information is received, update the table
        socket.on("NODE_DATA", (data) => {
            setHostname(data.node);
            setVersion(data.version);
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
