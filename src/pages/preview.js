import Layout from "@/components/Layout/Layout";
import { useWebSocket } from "@/utils/WebSocketContext";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

function _arrayBufferToBase64(buffer) {
    var binary = "";
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

function PreviewPage({ addr }) {
    const node = useWebSocket(addr);

    const streamStopTime = new Date();
    streamStopTime.setHours(streamStopTime.getHours() + 1);

    // Configure live stream
    useEffect(() => {
        node.emit("START_STREAM", {
            resolution: {
                x: 1920,
                y: 1080,
            },
            time: streamStopTime.toUTCString(),
        });

        // When video frame is received, update the stream
        node.on("VIDEO_FRAME", (data) => {
            // Update the image source with the base64 data
            if (liveRef.current) {
                liveRef.current.src = `data:image/jpeg;base64,${_arrayBufferToBase64(
                    data.frame_data
                )}`;
            }
        });
    }, []);

    // Define live ref
    const liveRef = useRef(null);

    return (
        <Layout title={"Previewing Node"} links={false} navbar={false}>
            <div
                className={
                    "fixed w-full h-screen flex flex-col justify-center items-center"
                }
            >
                <div className="bg-[#101018] fixed w-screen h-screen z-0">
                    <img
                        ref={liveRef}
                        className="opacity-70 z-0 fixed w-screen h-screen object-center object-cover"
                    />
                </div>
            </div>
        </Layout>
    );
}

export function getServerSideProps(context) {
    const { query } = context;
    const addr = query.addr;

    return {
        props: { addr },
    };
}

export default PreviewPage;
