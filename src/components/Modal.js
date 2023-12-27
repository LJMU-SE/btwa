const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-black bg-opacity-50 absolute inset-0"></div>
            <div className="relative bg-white p-4 rounded-md z-10">
                <button
                    className="absolute top-2 right-2 text-gray-600"
                    onClick={onClose}
                >
                    Close
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
