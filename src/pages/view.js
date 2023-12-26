import Layout from "@/components/Layout/Layout";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

// Function to query the captures table by capture ID and return capture information
async function getCaptureInfoById(captureId) {
    return new Promise((resolve, reject) => {
        const sqlite3 = require("sqlite3").verbose();
        const db = new sqlite3.Database("./db/main.db");
        db.get(
            `SELECT captures.capture_id, captures.capture_date, users.email, users.first_name
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

function View({ captureInfo }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const videoRef = useRef();

    useEffect(() => {
        videoRef.current.src = `/api/video/${searchParams.get("videoID")}`;
    }, [router.query]);

    async function redirectBack() {
        router.push("/capturing/360-video");
    }

    return (
        <Layout title={"Bullet Time | Captured Output"} navbar={true}>
            {/** <div className="h-[calc(100vh-80px)] overflow-hidden flex flex-col justify-center items-center">
                <h1 className="p-5 font-semibold text-3xl">Your Video</h1>
                <button
                    className="px-5 py-3 bg-ljmu hover:bg-ljmu/80 rounded-md transition-all my-5 text-white disabled:bg-ljmu/80"
                    onClick={redirectBack}
                >
                    Capture Another
                </button>
    </div> **/}
            <div className="w-full h-[calc(100vh-80px)] flex-col md:flex-row flex flex-nowrap overflow-x-hidden">
                <div className="w-full md:w-[50%] p-10">
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
                <div className="w-full md:w-[50%] p-10">
                    <h1 className="pb-5 font-semibold text-3xl">
                        Video Information
                    </h1>
                    <h1>Your Video Preview</h1>
                    <h2>Your Name</h2>
                    <h2>Your Email</h2>
                    <h2>Capture ID</h2>
                    <h2>Shared to Instagram:</h2>
                    <h2>Shared to X/Twitter:</h2>
                    <h2>Shared to YouTube:</h2>
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
