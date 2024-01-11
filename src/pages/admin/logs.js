import Layout from "@/components/Layout/Layout";
import { useWebSocket } from "@/utils/WebSocketContext";
import { useEffect, useState } from "react";

function Ping({ status }) {
    switch (status) {
        case true:
            return (
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
            );
        case false:
            return (
                <span className="relative flex h-3 w-3">
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
            );
    }
}

function NodeLink(socket) {
    const conn = socket.socket;
    const [name, setName] = useState("NODE_NAME");
    const [ver, setVer] = useState("NODE_VERSION");
    const [status, setStatus] = useState(false);

    useEffect(() => {
        console.log(conn.connected);
        if (conn.connected) setStatus(true);
        else setStatus(false);
    }, [conn]);

    useEffect(() => {
        // Get Node Data
        conn.emit("GET_NODE_DATA");

        conn.on("NODE_DATA", (data) => {
            setName(data.node);
            setVer(data.version);
            setStatus(true);
        });

        conn.on("DISCONNECT", () => {
            setStatus(false);
        });

        conn.on("CONNECT", () => {
            conn.emit("GET_NODE_DATA");
        });

        return () => {
            conn.off("NODE_DATA");
        };
    }, []);
    return (
        <div className="w-full min-h-14 h-max flex justify-between items-center p-2 border-b border-black/50 dark:border-white/50 border-solid">
            <div className="w-12 flex justify-center items-center">
                <Ping status={status} />
            </div>
            <div className="flex flex-col w-full h-full">
                <h2>{name}</h2>
                <p>{ver}</p>
            </div>
        </div>
    );
}

export default function LogPage() {
    const sockets = useWebSocket();
    return (
        <Layout title="Bullet Time | Logs" navbar={true} isAdmin={true}>
            <div className="max-h-[calc(100vh-80px)] flex justify-center items-center">
                <div className="w-72 h-full flex flex-col max-h-[calc(100vh-80px)] overflow-auto scrollbar-hide justify-start items-center border-r dark:border-white/50">
                    {sockets.map((socket) => (
                        <NodeLink socket={socket} />
                    ))}
                </div>
                <div className="w-full h-full p-6"></div>
            </div>
        </Layout>
    );
}
