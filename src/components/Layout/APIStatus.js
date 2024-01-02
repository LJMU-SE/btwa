import { useWebSocket } from "@/utils/WebSocketContext";
import { useEffect, useState } from "react";

function APIStatus({ showNodes = true }) {
    const websockets = useWebSocket();
    const [connectedCount, setConnectedCount] = useState(0);
    const [apiConnected, setApiConnected] = useState(false);

    useEffect(() => {
        setConnectedCount(
            websockets.filter((x) => {
                return x.connected;
            }).length
        );

        for (let socket of websockets) {
            socket.on("connect", () => {
                if (connectedCount + 1 > websockets.length) return;
                setConnectedCount((oldCount) => oldCount + 1);
            });
            socket.on("disconnect", () => {
                if (connectedCount + 1 < 0) return;
                setConnectedCount((oldCount) => oldCount - 1);
            });
        }

        return () => {
            setConnectedCount(0);
        };
    }, [websockets]);

    function checkAPI() {
        fetch("http://127.0.0.1:5328/status")
            .then((res) => {
                if (res.ok) setApiConnected(true);
                else setApiConnected(false);
            })
            .catch((err) => {
                console.error(err);
                setApiConnected(false);
            });
    }

    useEffect(() => {
        checkAPI();
        const interval = setInterval(checkAPI, 5000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    if (!apiConnected)
        return (
            <div className="w-screen h-screen fixed z-50 bg-white dark:bg-[#101018] flex items-center justify-center flex-col p-10">
                <h1 className="text-5xl font-semibold">
                    API Connection Failed
                </h1>
                <p className="opacity-75 mt-5">
                    Please ensure Flask server is running
                </p>
            </div>
        );

    if (showNodes)
        return (
            <div className="w-max fixed bottom-0 right-0 bg-black/50 px-5 py-2 text-white flex items-center z-50">
                {connectedCount} of {websockets.length} Nodes Connected
            </div>
        );

    return null;
}

export default APIStatus;
