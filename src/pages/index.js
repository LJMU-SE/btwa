import Layout from "@/components/Layout";
import { useRouter } from "next/router";

const links = [
    {
        name: "360 Degree Video",
        href: "/capturing/360-video",
        img: "https://www.newworlddesigns.co.uk/wp-content/uploads/2022/12/48ANGLE-700x410-1.jpg",
    },
    {
        name: "Light Painting Video",
        href: "/capturing/light-painting",
        img: "https://www.newworlddesigns.co.uk/wp-content/uploads/2022/03/Emma-Raducanu-Vodafone-Select-Frame-2.jpg",
    },
    {
        name: "Green Screen Video",
        href: "/capturing/green-screen",
        img: "https://beforesandafters.com/wp-content/uploads/2021/07/Matrix_bullet_time.jpg",
    },
    {
        name: "Slow-Mo Video",
        href: "/capturing/slow-motion",
        img: "https://vmi.tv/wp-content/uploads/sites/3/2020/02/bullet-time.jpg",
    },
];

function HomeLink({ name, href, img }) {
    const router = useRouter();
    return (
        <div
            className={`group w-full h-screen flex justify-center items-center text-center bg-black relative overflow-hidden transition-all cursor-pointer hover:scale-[115%]`}
            onClick={() => {
                router.push(href);
            }}
        >
            <h2 className="z-10 font-semibold text-4xl text-white">{name}</h2>
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
            <div className="flex flex-nowrap justify-start items-center w-full overflow-hidden">
                {links.map((link) => (
                    <HomeLink
                        name={link.name}
                        href={link.href}
                        img={link.img}
                    />
                ))}
            </div>
        </Layout>
    );
}
