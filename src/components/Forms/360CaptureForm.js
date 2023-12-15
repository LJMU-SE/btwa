import { useRef } from "react";
import { useRouter } from "next/router";
import FormInput from "./Parts/FormInput";
import FormContainer from "./Parts/FormContainer";

function CaptureForm360({}) {
    const emailRef = useRef(null);
    const nameRef = useRef(null);
    const resXRef = useRef(null);
    const resYRef = useRef(null);
    const router = useRouter();

    function submit(e) {
        e.preventDefault();

        router.push(
            `/capturing/360-video/process?name=${nameRef.current.value}&email=${emailRef.current.value}&x=${resXRef.current.value}&y=${resYRef.current.value}`
        );
    }

    return (
        <div className="w-full h-full p-10 flex justify-center items-center">
            <form onSubmit={submit} className="w-full max-w-3xl">
                <FormContainer title={"User Information"}>
                    <FormInput
                        inputRef={nameRef}
                        type={"text"}
                        placeholder={"John"}
                        defaultValue={"Ollie"}
                        name={"name"}
                        label={"First Name"}
                    />
                    <FormInput
                        inputRef={emailRef}
                        type="email"
                        placeholder="hi@example.com"
                        defaultValue={"ollie@beenhamow.co.uk"}
                        name="email"
                        label={"Email"}
                    />
                </FormContainer>
                <FormContainer title={"Camera Setup"}>
                    <FormInput
                        inputRef={resXRef}
                        type={"text"}
                        placeholder={"1920"}
                        defaultValue={"2160"}
                        name={"resX"}
                        label={"Resolution (X)"}
                    />
                    <FormInput
                        inputRef={resYRef}
                        type="text"
                        placeholder={"1080"}
                        defaultValue={"1440"}
                        name={"resY"}
                        label={"Resolution (Y)"}
                    />
                </FormContainer>
                <FormContainer>
                    <button
                        type="submit"
                        id="submitBtn"
                        className="px-5 py-3 w-max text-white bg-ljmu hover:bg-ljmu/80 dark:bg-white/80 dark:hover:bg-white/50 dark:hover:text-white dark:text-ljmu transition-all rounded-md"
                    >
                        Capture Video
                    </button>
                </FormContainer>
            </form>
        </div>
    );
}

export default CaptureForm360;
