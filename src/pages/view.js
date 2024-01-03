import Layout from "@/components/Layout/Layout";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import Modal from "@/components/Modal";
import FormContainer from "@/components/Forms/FormContainer";
import YesNoButtons from "@/components/Forms/YesNoCheckbox";
import FormInput from "@/components/Forms/FormInput";
import toast from "react-hot-toast";
import moment from "moment";

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
    const [date, setDate] = useState("Loading...");
    const [captureID, setCaptureID] = useState("Loading...");

    // Set sharing variables
    const [sharedInstaStatus, setSharedInstaStatus] = useState(false);
    const [sharedTwitterStatus, setSharedTwitterStatus] = useState(false);
    const [sharedYouTubeStatus, setSharedYouTubeStatus] = useState(false);

    const [isModalOpen, setModalOpen] = useState(false);

    const openModal = () => {
        if (
            sharedInstaStatus == true &&
            sharedTwitterStatus == true &&
            sharedYouTubeStatus == true
        ) {
            toast.error("Video has already been shared to all platforms");
        } else {
            setModalOpen(true);
        }
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    useEffect(() => {
        videoRef.current.src = `/api/video/preview/${searchParams.get(
            "videoID"
        )}`;

        setCaptureID(searchParams.get("videoID"));
        setFname(captureInfo.first_name);
        setEmail(captureInfo.email);
        setSize(captureInfo.size);
        setDate(captureInfo.capture_date);
        setType(getType(captureInfo.type));

        setSharedInstaStatus(captureInfo.shared_instagram);
        setSharedTwitterStatus(captureInfo.shared_twitter);
        setSharedYouTubeStatus(captureInfo.shared_YouTube);
    }, [router.query]);

    const [shareToInsta, setShareToInsta] = useState(false);
    const [shareToTwitter, setShareToTwitter] = useState(false);
    const [shareToYouTube, setShareToYouTube] = useState(false);
    const instaRef = useRef();
    const twitterRef = useRef();

    function countTrue(values) {
        let counter = 0;
        for (let value of values) {
            if (value == true) counter++;
        }
        return counter;
    }

    // Function to publish the media
    async function share(e) {
        e.preventDefault();
        if (!shareToInsta && !shareToTwitter && !shareToYouTube)
            return closeModal();

        // Process Publishing API
        closeModal();
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
                        <b className="opacity-70">Captured On:</b>{" "}
                        {moment(date).format("MMMM Do YYYY [at] h:mm:ss a")}
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
                        {sharedInstaStatus ? "Yes" : "No"}
                    </h2>
                    <h2 className=" py-1">
                        <b className="opacity-70">Shared to X/Twitter:</b>{" "}
                        {sharedTwitterStatus ? "Yes" : "No"}
                    </h2>
                    <h2 className=" py-1">
                        <b className="opacity-70">Shared to YouTube:</b>{" "}
                        {sharedYouTubeStatus ? "Yes" : "No"}
                    </h2>

                    <button
                        onClick={openModal}
                        className="mt-10 px-5 py-3 w-full lg:w-max text-white bg-ljmu hover:bg-ljmu/80 dark:bg-white/80 dark:hover:bg-white/50 dark:hover:text-white dark:text-ljmu transition-all rounded-lg"
                    >
                        Share Video
                    </button>
                </div>
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title="Share Video"
            >
                <form onSubmit={share}>
                    {!sharedYouTubeStatus ? (
                        <FormContainer title={"YouTube"}>
                            <YesNoButtons
                                label={"Share to YouTube?"}
                                setState={setShareToYouTube}
                                state={shareToYouTube}
                            />
                        </FormContainer>
                    ) : null}

                    {!sharedInstaStatus ? (
                        <FormContainer title={"Instagram"}>
                            <YesNoButtons
                                label={"Share to Instagram?"}
                                setState={setShareToInsta}
                                state={shareToInsta}
                            />
                            <FormInput
                                disabled={!shareToInsta}
                                placeholder={
                                    shareToInsta
                                        ? "Instagram Handle"
                                        : "Select Yes Above"
                                }
                                label={"Instagram Handle"}
                                inputRef={instaRef}
                            />
                        </FormContainer>
                    ) : null}
                    {!sharedTwitterStatus ? (
                        <FormContainer title="Twitter/X">
                            <YesNoButtons
                                label={"Share to Twitter/X?"}
                                setState={setShareToTwitter}
                                state={shareToTwitter}
                            />
                            <FormInput
                                disabled={!shareToTwitter}
                                placeholder={
                                    shareToTwitter
                                        ? "Twitter Handle"
                                        : "Select Yes Above"
                                }
                                label={"Twitter Handle"}
                                inputRef={twitterRef}
                            />
                        </FormContainer>
                    ) : null}
                    <button className="mt-10 px-5 py-3 w-full lg:w-max text-white bg-ljmu hover:bg-ljmu/80 dark:bg-white/80 dark:hover:bg-white/50 dark:hover:text-white dark:text-ljmu transition-all rounded-lg">
                        Share To{" "}
                        {countTrue([
                            shareToInsta,
                            shareToTwitter,
                            shareToYouTube,
                        ])}{" "}
                        Platform(s)
                    </button>
                </form>
            </Modal>
        </Layout>
    );
}

export async function getServerSideProps(context) {
    const { query } = context;
    const captureId = query.videoID;

    try {
        const captureInfo = await getCaptureInfoById(captureId);
        if (!captureInfo) {
            console.log(
                `Unable to locate database entry for video with id: ${captureId}`
            );
            return {
                redirect: {
                    permanent: false,
                    destination: "/video/360",
                },
            };
        }

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
