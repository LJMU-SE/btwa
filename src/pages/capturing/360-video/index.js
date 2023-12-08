import CaptureForm360 from "@/components/Forms/360CaptureForm";
import Layout from "@/components/Layout/Layout";

export default function Video360() {
    return (
        <Layout title={"Bullet Time | 360 Degree Video"} navbar={true}>
            <CaptureForm360 />
        </Layout>
    );
}
