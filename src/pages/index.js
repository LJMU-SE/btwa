import Layout from "@/components/Layout/Layout";
import { useRouter } from "next/router";

const links = [
    {
        name: "360 Degree Video",
        href: "/capturing/360-video",
        img: "/img/home/link-1.webp",
    },
    {
        name: "Light Painting Video",
        href: "/capturing/light-painting",
        img: "/img/home/link-2.webp",
    },
    {
        name: "Green Screen Video",
        href: "/capturing/green-screen",
        img: "/img/home/link-3.webp",
    },
    {
        name: "Slow-Mo Video",
        href: "/capturing/slow-motion",
        img: "/img/home/link-4.webp",
    },
];

function HomeLink({ name, href, img }) {
    const router = useRouter();
    return (
        <div
            className={`p-5 group w-full h-full flex justify-center items-center text-center bg-black relative overflow-hidden transition-all cursor-pointer hover:scale-[115%]`}
            onClick={() => {
                router.push(href);
            }}
        >
            <h2 className="z-10 font-semibold text-xl md:text-2xl lg:text-3xl text-white">
                {name}
            </h2>
            <img
                className={
                    "absolute w-full h-full top-0 left-0 z-0 opacity-50 object-cover object-center transition-all group-hover:scale-110 group-hover:opacity-75"
                }
                src={img}
                alt={name}
            />
        </div>
    );
}

export default function Home() {
    return (
        <Layout title={"Bullet Time | Home"}>
            <div className="flex flex-col lg:flex-row flex-nowrap h-full justify-start items-center w-full overflow-hidden">
                {links.map((link) => (
                    <HomeLink
                        key={link.name}
                        name={link.name}
                        href={link.href}
                        img={link.img}
                    />
                ))}
            </div>
        </Layout>
    );
}
