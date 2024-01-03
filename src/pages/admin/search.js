import Layout from "@/components/Layout/Layout";
import { useRef } from "react";

function SearchPage() {
    const searchRef = useRef(null);

    function search(email) {
        fetch(`/api/admin/search?email=${email}`).then(async (res) => {
            console.log(await res.json());
        });
    }

    return (
        <Layout title="Bullet Time | Search" navbar={true} showNodes={true}>
            <div className="search">
                <input
                    type="text"
                    ref={searchRef}
                    placeholder="Search for a capture"
                />
                <button onClick={() => search(searchRef.current.value)}>
                    Search
                </button>
            </div>
        </Layout>
    );
}

export default SearchPage;
