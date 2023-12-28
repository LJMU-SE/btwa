import Layout from "@/components/Layout/Layout";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import Modal from "@/components/Modal";

// Function to query the captures table by capture ID and return capture information
async function getCaptureInfoById(captureId) {
    return new Promise((resolve, reject) => {
        const sqlite3 = require("sqlite3").verbose();
        const db = new sqlite3.Database("./db/main.db");
        db.get(
            `SELECT captures.capture_id, captures.capture_date, captures.shared_twitter, captures.shared_instagram, captures.shared_YouTube, captures.type, captures.size, users.email, users.first_name
             FROM captures
             JOIN users ON captures.user_id = users.user_id
             WHERE captures.capture_id = ?`,
            [captureId],
            (err, row) => {
                if (err) {
                    console.error(err);
                    reject(err);
                    return;
                }

                resolve(row);
            }
        );

        // Close the database connection
        db.close();
    });
}

function getType(type) {
    switch (type) {
        case "360":
            return "360 Video";
        default:
            return "Other";
    }
}

function View({ captureInfo }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const videoRef = useRef();

    const [fname, setFname] = useState("Loading...");
    const [email, setEmail] = useState("Loading...");
    const [size, setSize] = useState("Loading...");
    const [type, setType] = useState("Loading...");
    const [captureID, setCaptureID] = useState("Loading...");

    const [sharedInsta, setSharedInsta] = useState(false);
    const [sharedTwitter, setSharedTwitter] = useState(false);
    const [sharedYouTube, setSharedYouTube] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    useEffect(() => {
        videoRef.current.src = `/api/video/${searchParams.get("videoID")}`;

        setCaptureID(searchParams.get("videoID"));
        setFname(captureInfo.first_name);
        setEmail(captureInfo.email);
        setSize(captureInfo.size);
        setType(getType(captureInfo.type));

        setSharedInsta(captureInfo.shared_instagram);
        setSharedTwitter(captureInfo.shared_twitter);
        setSharedYouTube(captureInfo.shared_YouTube);
    }, [router.query]);

    // Function to redirect back to the capture screen
    async function redirectBack() {
        router.push("/capturing/360-video");
    }

    return (
        <Layout title={"Bullet Time | Captured Output"} navbar={true}>
            <div className="w-full h-[calc(100vh-80px)] flex-col lg:flex-row flex flex-nowrap overflow-x-hidden">
                <div className="w-full lg:w-[50%] p-10">
                    <h1 className="pb-5 font-semibold text-3xl">
                        Video Preview
                    </h1>
                    <video
                        className={"w-full"}
                        src={""}
                        ref={videoRef}
                        autoPlay
                        loop
                        controls
                    />
                </div>
                <div className="w-full lg:w-[50%] p-10">
                    <h1 className="pb-5 font-semibold text-3xl">
                        Video Information
                    </h1>
                    <h2 className=" py-1">
                        <b className="opacity-70">Your Name:</b> {fname}
                    </h2>
                    <h2 className=" py-1">
                        <b className="opacity-70">Your Email:</b> {email}
                    </h2>
                    <h2 className=" py-1">
                        <b className="opacity-70">Video Resolution:</b> {size}
                    </h2>
                    <h2 className=" py-1">
                        <b className="opacity-70">Video Type:</b> {type}
                    </h2>
                    <h2 className=" py-1">
                        <b className="opacity-70">Capture ID:</b> {captureID}
                    </h2>

                    <h1 className="mt-10 pb-5 font-semibold text-3xl">
                        Sharing Status
                    </h1>
                    <h2 className="py-1">
                        <b className="opacity-70">Shared to Instagram:</b>{" "}
                        {sharedInsta ? "Yes" : "No"}
                    </h2>
                    <h2 className=" py-1">
                        <b className="opacity-70">Shared to X/Twitter:</b>{" "}
                        {sharedTwitter ? "Yes" : "No"}
                    </h2>
                    <h2 className=" py-1">
                        <b className="opacity-70">Shared to YouTube:</b>{" "}
                        {sharedYouTube ? "Yes" : "No"}
                    </h2>

                    <button
                        onClick={openModal}
                        className="mt-10 px-5 py-3 w-full lg:w-max text-white bg-ljmu hover:bg-ljmu/80 dark:bg-white/80 dark:hover:bg-white/50 dark:hover:text-white dark:text-ljmu transition-all rounded-lg"
                    >
                        Share Video
                    </button>

                    <Modal isOpen={isModalOpen} onClose={closeModal}>
                        <h2 className="text-xl font-bold mb-4">
                            This is your Tailwind-styled modal content!
                        </h2>
                        <p className="text-gray-700">
                            Tailwind makes styling a breeze!
                        </p>
                    </Modal>
                </div>
            </div>
        </Layout>
    );
}

export async function getServerSideProps(context) {
    const { query } = context;
    const captureId = query.videoID;

    try {
        const captureInfo = await getCaptureInfoById(captureId);
        return {
            props: { captureInfo },
        };
    } catch (error) {
        console.error("Error fetching capture information:", error);
        return {
            notFound: true,
        };
    }
}

export default View;
