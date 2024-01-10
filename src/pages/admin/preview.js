import Layout from "@/components/Layout/Layout";
import { useWebSocket } from "@/utils/WebSocketContext";
import { useEffect, useRef } from "react";
import nodes from "@/nodes";

function _arrayBufferToBase64(buffer) {
    var binary = "";
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

function PreviewWindow({ addr }) {
    const node = useWebSocket(addr);
    console.log(addr, node);

    const streamStopTime = new Date();
    streamStopTime.setMinutes(streamStopTime.getMinutes() + 5);

    // Configure live stream
    useEffect(() => {
        if (node.connected) {
            node.emit("START_STREAM", {
                resolution: {
                    x: 1280,
                    y: 720,
                },
                iso: 1000,
                // shutter_speed: 10000,
                time: streamStopTime.toUTCString(),
            });
        } else {
            node.on("CONNECT", () => {
                node.emit("START_STREAM", {
                    resolution: {
                        x: 1280,
                        y: 720,
                    },
                    iso: 1000,
                    // shutter_speed: 10000,
                    time: streamStopTime.toUTCString(),
                });
            });
        }

        // When video frame is received, update the stream
        node.on("VIDEO_FRAME", (data) => {
            // Update the image source with the base64 data
            if (liveRef.current) {
                liveRef.current.src = `data:image/jpeg;base64,${_arrayBufferToBase64(
                    data.frame_data
                )}`;
            }
        });

        return () => {
            node.emit("STOP_STREAM");
        };
    }, []);

    // Define live ref
    const liveRef = useRef(null);

    return (
        <div className="relative bg-[#101018] w-[calc(100%/4)] h-auto border-solid border-white border">
            <img
                ref={liveRef}
                className="opacity-70 z-0 w-full h-auto object-center object-cover"
            />
            <p className="absolute bottom-2 right-2">{addr}</p>
        </div>
    );
}

function PreviewPage({ addr }) {
    return (
        <Layout title={"Previewing Node"} links={true} navbar={true}>
            <div className={"w-full flex flex-row flex-wrap overflow-auto"}>
                {nodes.map((node) => (
                    <PreviewWindow addr={node} />
                ))}
            </div>
        </Layout>
    );
}

export function getServerSideProps(context) {
    const { query } = context;
    const addr = query.addr || null;

    return {
        props: { addr },
    };
}

export default PreviewPage;
