import { useState, useRef } from "react";
import toast from "react-hot-toast";
import Spinner from "../Loaders/Spinner";
import nodes from "@/nodes";

function NodeCount({ count }) {
    const [updating, setUpdating] = useState(false);
    const btnRef = useRef(null);

    function update(e) {
        setUpdating(true);
        e.preventDefault();
        toast
            .promise(updateAll(nodes), {
                loading: `Updating Nodes`,
                success: `All Connected Nodes Updated`,
                error: `Some Node Updates Failed`,
            })
            .finally(() => {
                btnRef.current.remove();
            });
    }

    function updateAll(nodes) {
        // Promise function to process the image
        return new Promise((resolve, reject) => {
            fetch("/api/admin/update", {
                method: "POST",
                body: JSON.stringify({ nodes }),
            }).then(async (response) => {
                if (response.ok) {
                    const data = await response.json();
                    console.log(`🟢 | ${data.message}`);
                    resolve();
                } else {
                    reject();
                }
            });
        });
    }

    return (
        <div className="w-full h-60 flex flex-col p-10 items-center justify-center relative">
            <h1 className={"text-5xl font-semibold mb-5"}>{count}</h1>
            <p className={"text-xl"}>Of {nodes.length} nodes online</p>
            <button
                onClick={update}
                className={
                    updating
                        ? "flex justify-center items-center mt-5 px-2 py-2 w-12 rounded-full bg-ljmu dark:bg-white/80 text-white dark:text-ljmu transition-all"
                        : "flex justify-center items-center mt-5 px-2 py-2 w-32 rounded-md bg-ljmu hover:bg-ljmu/80 dark:bg-white/80 dark:hover:bg-white/50 dark:hover:text-white dark:text-ljmu text-white transition-all"
                }
                disabled={updating ? true : false}
                ref={btnRef}
            >
                {updating ? <Spinner /> : "Update Nodes"}
            </button>
        </div>
    );
}

export default NodeCount;
