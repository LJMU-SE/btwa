function FormInput({
    name,
    type = "text",
    inputRef,
    placeholder,
    label,
    defaultValue,
    disabled = false,
}) {
    return (
        <div className="w-full my-3">
            <label htmlFor={name}>{label}</label>
            <input
                className="w-full px-3 py-2 mt-2 border-solid border-black/50 border-[1px] rounded-md dark:bg-white/5 dark:border-white/25"
                ref={inputRef}
                name={name}
                id={name}
                type={type}
                placeholder={placeholder}
                defaultValue={defaultValue}
                required
                autoComplete="off"
                disabled={disabled}
            />
        </div>
    );
}

export default FormInput;
