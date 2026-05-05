const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ["var(--font-syne)"],
        outfit: ["var(--font-outfit)"],
      },
    }
  },
  plugins: []
};

export default config;
