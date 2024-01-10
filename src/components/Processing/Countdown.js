import Spinner from "@/components/Loaders/Spinner";
import { useEffect } from "react";

// Countdown Component
export default function Countdown({ count, setCount, onEnd }) {
    useEffect(() => {
        setTimeout(() => {
            onEnd();
        }, count * 1000);

        const timer = setInterval(() => {
            setCount((prevCount) =>
                prevCount > 0 ? prevCount - 1 : prevCount
            );

            if (count === 0) {
                clearInterval(timer);
            }
        }, 1000);
    }, []);

    return (
        <div className="relative z-10">
            {count > 0 ? (
                <h1 className="text-9xl text-white font-black">{count}</h1>
            ) : (
                <Spinner />
            )}
        </div>
    );
}
