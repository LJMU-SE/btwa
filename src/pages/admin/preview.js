import Layout from "@/components/Layout/Layout";
import { useWebSocket } from "@/utils/WebSocketContext";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";

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
    let websockets = useWebSocket();

    let node =
        websockets[websockets.map((x) => x._opts.hostname).indexOf(addr)];

    const streamStopTime = new Date();
    streamStopTime.setMinutes(streamStopTime.getMinutes() + 5);

    // Get the router
    const router = useRouter();

    // Configure live stream
    useEffect(() => {
        node.emit("START_STREAM", {
            resolution: {
                x: 1280,
                y: 720,
            },
            // iso: 1000,
            // shutter_speed: 10000,
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

        return () => {
            node.emit("STOP_STREAM");
        };
    }, [router]);

    // Define live ref
    const liveRef = useRef(null);

    function getNextAndPrevious(addr) {
        const nextIndex =
            websockets.map((x) => x._opts.hostname).indexOf(addr) + 1;
        const prevIndex =
            websockets.map((x) => x._opts.hostname).indexOf(addr) - 1;

        let nextSocket =
            nextIndex > websockets.length - 1
                ? websockets[0]
                : websockets[nextIndex];

        let prevSocket =
            prevIndex < 0
                ? websockets[websockets.length - 1]
                : websockets[prevIndex];

        return {
            next: nextSocket,
            previous: prevSocket,
        };
    }

    function goNext() {
        node.emit("STOP_STREAM");
        const { next } = getNextAndPrevious(node._opts.hostname);
        router.push(`/admin/preview?addr=${next._opts.hostname}`);
    }

    function goPrevious() {
        node.emit("STOP_STREAM");
        const { previous } = getNextAndPrevious(node._opts.hostname);
        router.push(`/admin/preview?addr=${previous._opts.hostname}`);
    }

    return (
        <div className="relative bg-[#101018] w-full h-[calc(100vh-80px)]">
            <img
                ref={liveRef}
                className="opacity-70 z-0 w-full h-[calc(100vh-80px)] object-center object-cover "
            />
            <p className="absolute top-2 left-2">{addr}</p>
            <button
                onClick={goPrevious}
                className="absolute top-[calc((100vh-80px)/2)] left-5"
            >
                <FaAngleLeft />
            </button>
            <button
                onClick={goNext}
                className="absolute top-[calc((100vh-80px)/2)] right-5"
            >
                <FaAngleRight />
            </button>
        </div>
    );
}

function PreviewPage({ addr }) {
    return (
        <Layout title={"Previewing Node"} links={true} navbar={true}>
            <div className={"w-full flex flex-row flex-wrap overflow-auto"}>
                <PreviewWindow addr={addr} />
            </div>
        </Layout>
    );
}

export function getServerSideProps(context) {
    const { query } = context;
    const addr = query.addr || "10.0.0.101";

    return {
        props: { addr },
    };
}

export default PreviewPage;
