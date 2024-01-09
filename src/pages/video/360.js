import Layout from "@/components/Layout/Layout";
import FormInput from "@/components/Forms/FormInput";
import FormContainer from "@/components/Forms/FormContainer";
import { useRouter } from "next/router";
import { useRef } from "react";

export default function Video360() {
    const emailRef = useRef(null);
    const nameRef = useRef(null);
    const resXRef = useRef(null);
    const resYRef = useRef(null);
    const shutterRef = useRef(null);
    const isoRef = useRef(null);
    const router = useRouter();

    function submit(e) {
        e.preventDefault();

        let url = "/process?method=360&";
        url += `name=${nameRef.current.value}&`;
        url += `email=${emailRef.current.value}&`;
        url += `x=${resXRef.current.value}&`;
        url += `y=${resYRef.current.value}&`;
        url += `shutter=${shutterRef.current.value}&`;
        url += `iso=${isoRef.current.value}`;

        router.push(url);
    }
    return (
        <Layout title={"Bullet Time | 360 Degree Video"} navbar={true}>
            <div className="w-full h-full p-10 flex justify-center items-center overflow-auto">
                <form onSubmit={submit} className="w-full max-w-3xl h-full">
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
                            defaultValue={"1920"}
                            name={"resX"}
                            label={"Resolution (X)"}
                        />
                        <FormInput
                            inputRef={resYRef}
                            type="text"
                            placeholder={"1080"}
                            defaultValue={"1080"}
                            name={"resY"}
                            label={"Resolution (Y)"}
                        />
                        <FormInput
                            inputRef={shutterRef}
                            type="text"
                            placeholder={"1000"}
                            defaultValue={"1000"}
                            name={"shutter"}
                            label={"Shutter Speed"}
                        />
                        <FormInput
                            inputRef={isoRef}
                            type="text"
                            placeholder={"100"}
                            defaultValue={"100"}
                            name={"iso"}
                            label={"Iso"}
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
        </Layout>
    );
}
