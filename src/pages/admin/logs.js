import Layout from "@/components/Layout/Layout";
import { useWebSocket } from "@/utils/WebSocketContext";
import { useEffect, useRef, useState } from "react";

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

function NodeLink({ socket, logRef, setCurrent }) {
    const conn = socket;
    const [name, setName] = useState("NODE_NAME");
    const [ver, setVer] = useState("NODE_VERSION");
    const [status, setStatus] = useState(false);

    function getLogs() {
        console.log("Getting Logs");
        conn.emit("GET_LOGS");
    }

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

        conn.on("LOGS", (data) => {
            logRef.current.value = data.logs;
            logRef.current.scrollTop = logRef.current.scrollHeight;
            setCurrent(data.node);
        });

        return () => {
            conn.off("NODE_DATA");
            conn.off("LOGS");
        };
    }, [logRef]);
    return (
        <div
            className="w-full min-h-14 h-max flex justify-between items-center p-2 border-b border-black/50 dark:border-white/50 border-solid cursor-pointer"
            onClick={getLogs}
        >
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
    const [currentNode, setCurrentNode] = useState();
    const logsRef = useRef();

    return (
        <Layout title="Bullet Time | Logs" navbar={true} isAdmin={true}>
            <div className="max-h-[calc(100vh-80px)] flex justify-center items-center">
                <div className="w-72 h-full flex flex-col max-h-[calc(100vh-80px)] overflow-auto scrollbar-hide justify-start items-center border-r dark:border-white/50">
                    {sockets.map((socket) => (
                        <NodeLink
                            socket={socket}
                            logRef={logsRef}
                            setCurrent={setCurrentNode}
                        />
                    ))}
                </div>
                <div className="max-h-[calc(100vh-80px)] w-full flex flex-col justify-center items-center">
                    <div className="w-full border-b border-black/50 dark:border-white/50 border-solid h-12 px-3 flex justify-start items-center font-semibold">
                        <h1>Logs For {currentNode}</h1>
                    </div>
                    <textarea
                        className="max-h-[calc(100vh-128px)] h-screen w-full dark:bg-[#101018] focus:outline-none resize-none p-3"
                        ref={logsRef}
                        spellCheck="false"
                    ></textarea>
                </div>
            </div>
        </Layout>
    );
}
