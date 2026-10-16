import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mcoa: {
          midnight: "#211747",  // Midnight Royal Purple (Primary)
          amethyst: "#50458F",  // Royal Amethyst (Secondary)
          lavender: "#9B85D3",  // Signature Lavender (Highlight)
          gold: "#D8AC55",      // Champagne Gold (Premium accent)
          pearl: "#F6F3FC",     // Pearl Lavender (Light surface)
          slate: "#333044",     // Deep Slate (Body text)
        },
      },
      fontFamily: {
        cinzel: ["var(--font-cinzel)", "serif"],
        montserrat: ["var(--font-montserrat)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        gold: "0 4px 20px -2px rgba(216, 172, 85, 0.25)",
        royal: "0 10px 30px -5px rgba(33, 23, 71, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
