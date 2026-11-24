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
        ivory: {
          DEFAULT: "#F6F2E9",
          50: "#FAF8F3",
          100: "#F6F2E9",
          200: "#EDE6D7",
          300: "#E3D9C3",
        },
        sage: {
          DEFAULT: "#879681",
          50: "#F4F6F3",
          100: "#E6EAE4",
          200: "#CCD5C9",
          300: "#A9B9A4",
          400: "#879681",
          500: "#6F7E69",
          600: "#576453",
          700: "#414C3E",
        },
        terracotta: {
          DEFAULT: "#C4775A",
          50: "#FBF3F0",
          100: "#F5E4DE",
          200: "#EBC7BB",
          300: "#DFA795",
          400: "#D3886E",
          500: "#C4775A",
          600: "#AE5F42",
          700: "#8E4A32",
        },
        charcoal: {
          DEFAULT: "#353A32",
          50: "#F6F6F6",
          100: "#E5E6E5",
          200: "#C4C6C3",
          300: "#999D97",
          400: "#676C64",
          500: "#353A32",
          600: "#2A2E28",
          700: "#1F221D",
        },
        warmgrey: {
          DEFAULT: "#A29B8E",
          100: "#F0EFEB",
          200: "#DDD9D2",
          300: "#C1BBB0",
          400: "#A29B8E",
          500: "#857E71",
        },
        softborder: {
          DEFAULT: "#E5DED2",
          light: "#EFEBE3",
          dark: "#D6CCBD",
        },
        purewhite: "#FFFFFF",
      },
      fontFamily: {
        serif: ["'Playfair Display'", "Georgia", "serif"],
        sans: ["'DM Sans'", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        accent: ["'Cormorant Garamond'", "Georgia", "serif"],
      },
      boxShadow: {
        subtle: "0 2px 10px rgba(53, 58, 50, 0.04)",
        card: "0 4px 20px rgba(53, 58, 50, 0.06)",
        hover: "0 10px 30px rgba(53, 58, 50, 0.10)",
      },
    },
  },
  plugins: [],
};
export default config;
