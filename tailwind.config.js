/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                ljmu: "#07193f",
            },
            keyframes: {
                "bounce-load": {
                    "0%": { transform: "translateY(0)" },
                    "10%": { transform: "translateY(-10px)" },
                    "20%": { transform: "translateY(5px)" },
                    "30%": { transform: "translateY(0px)" },
                },
            },
            animation: {
                "bounce-load": "bounce-load 3s ease-in-out infinite",
            },
        },
    },
    plugins: [],
};
