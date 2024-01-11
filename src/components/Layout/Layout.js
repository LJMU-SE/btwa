import Head from "next/head";
import Navbar from "./Navigation/Navbar";
import APIStatus from "./APIStatus";
import AdminNavbar from "./Navigation/AdminNavbar";

function Layout({
    title = "LJMU Bullet-Time Project",
    description = "This project, proposed by Dr Daniel Doolan, aims to create a bullet-motion effect similar to that shown in The Matrix using an array of Raspberry Pis and the post-processing and image manipulation tool FFMPEG.",
    navbar = false,
    links = true,
    showNodes = true,
    isAdmin = false,
    children,
}) {
    return (
        <>
            <APIStatus showNodes={showNodes} />
            <Head>
                {/* <!-- Primary Meta Tags --> */}
                <title>LJMU Bullet-Time Project</title>
                <meta name="title" content={title} />
                <meta name="description" content={description} />

                {/* <!-- Open Graph / Facebook --> */}
                <meta property="og:type" content="website" />
                <meta
                    property="og:url"
                    content="http://bullet-time.beantech.uk"
                />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta
                    property="og:image"
                    content="http://bullet-time.beantech.uk/img/meta/meta.png"
                />

                {/* <!-- Twitter --> */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta
                    property="twitter:url"
                    content="http://bullet-time.beantech.uk"
                />
                <meta property="twitter:title" content={title} />
                <meta property="twitter:description" content={description} />
                <meta
                    property="twitter:image"
                    content="http://bullet-time.beantech.uk/img/meta/meta.png"
                />

                {/* <!-- Meta Tags Generated with https://metatags.io --> */}
            </Head>
            {navbar ? (
                isAdmin ? (
                    <AdminNavbar links={links} />
                ) : (
                    <Navbar links={links} />
                )
            ) : null}
            <main className={navbar ? "h-[calc(100vh-80px)]" : "h-screen"}>
                {children}
            </main>
        </>
    );
}

export default Layout;
