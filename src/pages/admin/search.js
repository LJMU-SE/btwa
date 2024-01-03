import Layout from "@/components/Layout/Layout";
import getCaptureType from "@/utils/GetCaptureType";
import { useRef, useState } from "react";
import moment from "moment";
import { useRouter } from "next/router";

function SearchResult({ result, router }) {
    function Spacer() {
        return <p className="mx-4">|</p>;
    }
    return (
        <div
            onClick={() => {
                router.push(`/view?videoID=${result.capture.capture_id}`);
            }}
            className="w-full p-4 mb-4 bg-[#f8f8f8] rounded-md dark:bg-white/5 cursor-pointer hover:scale-[1.02] transition-all shadow-md overflow-hidden"
        >
            <div className="flex flex-col justify-center mb-3">
                <h2 className="text-2xl font-semibold">
                    {result.user.name}'s {getCaptureType(result.capture.type)}{" "}
                    Capture
                </h2>
                <p className="opacity-40">
                    {moment(result.capture.capture_date).format(
                        "MMMM Do YYYY [at] h:mm:ss a"
                    )}
                </p>
            </div>
            <div className="flex items-center justify-left">
                <p>{result.user.email}</p>
                <Spacer />
                <p>{result.capture.size}</p>
            </div>
        </div>
    );
}

function SearchPage() {
    const searchRef = useRef(null);
    const [results, setResults] = useState([]);
    const router = useRouter();

    function search(email) {
        fetch(`/api/admin/search?email=${email}`).then(async (res) => {
            const data = await res.json();
            console.log(data);
            setResults(data.results);
        });
    }

    return (
        <Layout title="Bullet Time | Search" navbar={true} showNodes={true}>
            <div className="search">
                <div className="max-w-full w-[700px] mx-auto mb-4 px-4 py-5">
                    <div className="w-full my-3">
                        <input
                            className="w-full px-3 py-2 mt-2 border-solid border-black/50 border-[1px] rounded-md dark:bg-white/5 dark:border-white/25"
                            ref={searchRef}
                            name={"search"}
                            id={"search-box"}
                            type={"text"}
                            placeholder={"Your Email Address"}
                            autoComplete="off"
                            onChange={() => {
                                search(searchRef.current.value);
                            }}
                        />
                    </div>
                </div>
                <div className="max-w-full w-[700px] mx-auto mb-4 px-4 py-5">
                    {results.length > 0
                        ? results.map((result) => (
                              <SearchResult
                                  key={result.capture.capture_id}
                                  result={result}
                                  router={router}
                              />
                          ))
                        : null}
                </div>
            </div>
        </Layout>
    );
}

export default SearchPage;
