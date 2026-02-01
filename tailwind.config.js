/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
        extend: {
            colors: {
                base: "#F5F7FA",
                ink: "#1A202C",
                accentBlue: "#1E3A8A",
                accentOrange: "#F97316",
                accentGreen: "#16A34A",
            },
            boxShadow: {
                card: "0 10px 30px rgba(15, 23, 42, 0.08)",
            },
        },
    },
    plugins: [],
};
