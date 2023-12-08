function BounceLoader() {
    return (
        <div className="flex gap-2">
            <div className="w-5 h-5 rounded-full animate-bounce-load bg-ljmu dark:bg-white"></div>
            <div
                style={{ animationDelay: ".2s" }}
                className="w-5 h-5 rounded-full animate-bounce-load bg-ljmu dark:bg-white"
            ></div>
            <div
                style={{ animationDelay: ".4s" }}
                className="w-5 h-5 rounded-full animate-bounce-load bg-ljmu dark:bg-white"
            ></div>
        </div>
    );
}

export default BounceLoader;
