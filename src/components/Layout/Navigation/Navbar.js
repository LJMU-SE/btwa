import Navlink from "./NavLink";

export default function Navbar({ links = true }) {
    return (
        <nav className="bg-white dark:bg-[#101018] w-full h-20 px-6 py-1 flex sm:justify-evenly justify-center items-center border-b-[1px] border-solid border-black/25 dark:border-white/25 z-10">
            <Navlink href={"/"}>
                <img
                    alt="LJMU Banner"
                    src="/img/banners/ljmu_banner_white.webp"
                    className="hidden sm:dark:block h-20 w-auto"
                />
                <img
                    alt="LJMU Banner"
                    src="/img/banners/ljmu_banner.webp"
                    className="hidden sm:block dark:!hidden h-20 w-auto"
                />
            </Navlink>
            {links ? (
                <div>
                    <Navlink href={"/"}>Home</Navlink>
                    <Navlink href={"/admin/status"}>Admin</Navlink>
                </div>
            ) : null}
        </nav>
    );
}
