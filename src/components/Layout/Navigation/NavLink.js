import Link from "next/link";

export default function Navlink({ href, children }) {
    return (
        <Link href={href} className=" relative w-auto px-4">
            {children}
        </Link>
    );
}
