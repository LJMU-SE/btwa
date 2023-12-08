import Head from "next/head";
import Navbar from "./Navbar";

function Layout({
    title,
    description,
    navbar = false,
    links = true,
    children,
}) {
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            {navbar ? <Navbar links={links} /> : null}
            <main className={navbar ? "h-[calc(100vh-80px)]" : "h-screen"}>
                {children}
            </main>
        </>
    );
}

export default Layout;
