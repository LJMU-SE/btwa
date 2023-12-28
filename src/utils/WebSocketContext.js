import React, { createContext, useContext, useEffect, useState } from "react";
import nodes from "@/nodes";
import { io } from "socket.io-client";
const WebSocketContext = createContext();

export const useWebSocket = (address) => {
    const sockets = useContext(WebSocketContext);

    if (!sockets) {
        throw new Error("useWebSocket must be used within a WebSocketProvider");
    }

    if (address === undefined) {
        return sockets;
    }

    const matchedSocket = sockets.find(
        (socket) => socket._opts.hostname === address
    );

    if (!matchedSocket) {
        throw new Error(`No socket found for address: ${address}`);
    }

    return matchedSocket;
};

export const WebSocketProvider = ({ children }) => {
    const [sockets, setSockets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Loop through the nodes
        nodes.forEach((address) => {
            // Connect to socket
            const socket = io(`http://${address}:8080`, {
                connect_timeout: 4000,
                reconnection: true,
                transports: ["websocket", "polling", "flashsocket"],
            });

            // Add socket to array
            setSockets((oldSockets) => [...oldSockets, socket]);

            // Create event to listen for connection
            socket.on("connect", () => {
                console.log(`🟢 | Connected to node ${address}`);
            });

            // Create event to listen for disconnects
            socket.on("disconnect", () => {
                console.log(`🔴 | Disconnected from node ${address}`);
            });
        });

        // Cleanup function
        return () => {
            sockets.forEach((socket) => {
                socket.close();
            });
        };
    }, []);

    useEffect(() => {
        // Check if the required number of sockets is reached
        if (sockets.length >= nodes.length) {
            setIsLoading(false);
        }
    }, [sockets]);

    if (isLoading) {
        // Return a loading indicator or null if you don't want to render anything
        return <p>Loading...</p>;
    }

    return (
        <WebSocketContext.Provider value={sockets}>
            {children}
        </WebSocketContext.Provider>
    );
};
