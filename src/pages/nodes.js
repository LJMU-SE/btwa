import Layout from "@/components/Layout/Layout";
import nodes from "@/nodes.json";
import NodeCount from "@/components/Nodes/NodeCount";
import NodeStatus from "@/components/Nodes/NodeStatus";

function AdminPage() {
    return (
        <Layout title={"Bullet Time | Node Manager"} navbar={true}>
            <div className="w-full overflow-hidden">
                <NodeCount />
                <div className="w-full flex flex-row absolute bottom-0 flex-wrap max-h-[calc(100vh-316px)] overflow-auto border-[0.5px] border-solid dark:border-white/25">
                    {nodes.map((node) => (
                        <NodeStatus key={node} address={node} />
                    ))}
                </div>
            </div>
        </Layout>
    );
}

export default AdminPage;
