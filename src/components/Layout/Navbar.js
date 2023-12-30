import Link from "next/link";

function Navlink({ href, children }) {
    return (
        <Link href={href} className=" relative w-auto px-4">
            {children}
        </Link>
    );
}

function Navbar({ links = true }) {
    return (
        <nav className="w-full h-20 px-6 py-1 flex justify-evenly items-center border-b-[1px] border-solid border-black/25 dark:border-white/25">
            <Navlink href={"/"}>
                <img
                    alt="LJMU Banner"
                    src="/img/banners/ljmu_banner_white.webp"
                    className="hidden dark:block h-20 w-auto"
                />
                <img
                    alt="LJMU Banner"
                    src="/img/banners/ljmu_banner.webp"
                    className="block dark:hidden h-20 w-auto"
                />
            </Navlink>
            {links ? (
                <div>
                    <Navlink href={"/"}>Home</Navlink>
                    <Navlink href={"/admin/search"}>Search</Navlink>
                    <Navlink href={"/admin/nodes"}>Nodes</Navlink>
                </div>
            ) : null}
        </nav>
    );
}

export default Navbar;
