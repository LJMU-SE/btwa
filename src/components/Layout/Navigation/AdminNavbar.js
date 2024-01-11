import Navlink from "./NavLink";

export default function AdminNavbar({ links = true }) {
    return (
        <nav className="bg-white dark:bg-[#101018] w-full h-20 px-6 py-1 flex sm:justify-between justify-center items-center border-b-[1px] border-solid border-black/25 dark:border-white/25 z-10">
            <Navlink href={"/"}>Home</Navlink>
            <div>
                <Navlink href={"/admin/search"}>Search</Navlink>
                <Navlink href={"/admin/status"}>Status</Navlink>
                <Navlink href={"/admin/preview"}>Preview</Navlink>
                <Navlink href={"/admin/logs"}>Logs</Navlink>
            </div>
        </nav>
    );
}
