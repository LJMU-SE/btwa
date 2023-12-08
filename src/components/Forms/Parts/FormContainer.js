function FormContainer({ title, children }) {
    return (
        <div className="flex flex-col p-3">
            <h1 className="text-3xl font-semibold">{title}</h1>
            {children}
        </div>
    );
}

export default FormContainer;
