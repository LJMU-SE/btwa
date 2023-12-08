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

async function sendVideo(name, email, id) {
    const response = await fetch("/api/send-video", {
        method: "POST",
        body: JSON.stringify({
            name,
            email,
            path: `./public/outputs/${id}/output.mp4`,
        }),
    });

    if (response.ok) {
        const data = await response.json();
        console.log(`🟢 | ${data.message}`);
        return data.message;
    } else {
        const data = await response.json();
        console.log(`🔴 | ${data.message}`);
        throw new Error(data.message);
    }
}

function View({ captureInfo }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const videoRef = useRef();
    const [name, setName] = useState(captureInfo.first_name);
    const [email, setEmail] = useState(captureInfo.email);

    console.log(captureInfo);

    useEffect(() => {
        videoRef.current.src = `/outputs/${searchParams.get(
            "videoID"
        )}/output.mp4`;
    }, [router.query]);

    async function sendEmail(e) {
        e.target.disabled = true;
        e.target.innerHTML = "Sending...";

        try {
            await toast.promise(
                sendVideo(name, email, searchParams.get("id")),
                {
                    loading: "Sending Email...",
                    success: <b>Email Sent!</b>,
                    error: <b>Unable to send email!</b>,
                }
            );
            router.push("/");
        } catch (err) {
            e.target.disabled = false;
            e.target.innerHTML = "Send Email";
            console.log(`🔴 | ${err}`);
        }
    }

    return (
        <Layout title={"Bullet Time | Captured Output"} navbar={true}>
            <div className="h-[calc(100vh-80px)] overflow-hidden flex flex-col justify-center items-center">
                <h1 className="p-5 font-semibold text-3xl">Your Video</h1>
                <video
                    className={"max-w-[80%] max-h-[500px] h-auto"}
                    src={""}
                    ref={videoRef}
                    autoPlay
                    loop
                />
                <button
                    className="px-5 py-3 bg-ljmu hover:bg-ljmu/80 rounded-md transition-all my-5 text-white disabled:bg-ljmu/80"
                    onClick={sendEmail}
                >
                    Get Your Copy
                </button>
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
