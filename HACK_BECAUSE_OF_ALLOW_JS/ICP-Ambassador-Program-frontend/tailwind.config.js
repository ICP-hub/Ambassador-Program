"use strict";
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}", // Include all files in the src directory
    ],
    theme: {
        extend: {
            fontFamily: {
                poppins: ['Poppins', 'sans-serif'],
            },
        },
        screens: {
            sm: '340px',
            md: '600px',
            lg: '1024px',
        },
    },
    plugins: [],
};
