function YesNoButtons({ label, state, setState }) {
    return (
        <div className="w-full my-3 flex flex-nowrap items-center">
            <label className="mr-4">{label}</label>
            <button
                type="button"
                onClick={() => setState(true)}
                className={
                    state === true
                        ? "py-1 px-2 rounded-l-md border-solid border-black/25 dark:border-white/25 border-[1px] border-r-[0.5px] bg-black/25 text-white dark:bg-white/25"
                        : "py-1 px-2 rounded-l-md border-solid border-black/25 dark:border-white/25 border-[1px] border-r-[0.5px]"
                }
            >
                Yes
            </button>
            <button
                type="button"
                onClick={() => setState(false)}
                className={
                    state === false
                        ? "py-1 px-2 rounded-r-md border-solid border-black/25 dark:border-white/25 border-[1px] border-l-[0.5px] bg-black/25 text-white dark:bg-white/25"
                        : "py-1 px-2 rounded-r-md border-solid border-black/25 dark:border-white/25 border-[1px] border-l-[0.5px]"
                }
            >
                No
            </button>
        </div>
    );
}

export default YesNoButtons;
