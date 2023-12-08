import Head from "next/head";

function Layout({ title, description, children }) {
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <main>{children}</main>
        </>
    );
}

export default Layout;
