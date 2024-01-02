import { WebSocketProvider } from "@/utils/WebSocketContext";
import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";
import APIStatus from "@/components/Layout/APIStatus";

export default function App({ Component, pageProps }) {
    return (
        <>
            <Toaster
                position="bottom-right"
                toastOptions={{
                    // Define default options
                    style: {
                        background: "#363636",
                        color: "#fff",
                    },
                }}
            />
            <WebSocketProvider>
                <Component {...pageProps} />
            </WebSocketProvider>
        </>
    );
}
