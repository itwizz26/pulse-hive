/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        // Or if you are using a src/ directory structure:
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
        // You can explicitly map your CSS variables here if you want to use them as Tailwind utilities!
        colors: {
            pulsePrimary: 'var(--primary-color)',
            pulseSecondary: 'var(--secondary-color)',
        }
        },
    },
    plugins: [],
}
