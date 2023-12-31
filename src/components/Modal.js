import { IoCloseSharp } from "react-icons/io5";

const Modal = ({ isOpen, onClose, children, title = "Modal Title" }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-black dark:bg-white bg-opacity-50 dark:bg-opacity-20 absolute inset-0"></div>
            <div className="flex flex-col relative bg-white p-4 rounded-md w-[calc(100%-40px)] max-w-[550px] z-10 dark:bg-[#101018] max-h-[calc(100vh-40px)] overflow-hidden">
                <div className="w-full px-5 py-2 flex justify-between">
                    <h1 className="text-3xl font-bold">{title}</h1>
                    <button className="text-gray-500" onClick={onClose}>
                        <IoCloseSharp
                            size={25}
                            className="hover:text-gray-800 dark:hover:text-white transition-all"
                        />
                    </button>
                </div>
                <div className="w-full h-full p-5 overflow-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
