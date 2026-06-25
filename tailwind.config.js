/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Cyberpunk 2077 night-city base — near-black with a cool cast
        base: "#07080c",
        panel: "#0e1016",
        panel2: "#14171f",
        ink: "#eef1f6",
        muted: "#8a909e",
        // Disciplined CP2077 accent set — yellow leads, cyan supports,
        // magenta is the rare highlight. (Token names kept stable.)
        amber: "#fcee0a", // electric yellow — PRIMARY accent
        neon: "#00e5ff", // cyan/teal — secondary
        magenta: "#ff2e88", // hot magenta — sparing tertiary
        lime: "#19e6c1", // muted teal-green
        violet: "#9b8cff", // soft violet
      },
      fontFamily: {
        display: ["'Baloo 2'", "'Nunito'", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["'Nunito'", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        // Restrained — a hairline edge plus a faint halo, not a loud glow
        neon: "0 0 0 1px rgba(0,229,255,0.22), 0 8px 30px rgba(0,0,0,0.5)",
        magenta: "0 0 0 1px rgba(255,46,136,0.22), 0 8px 30px rgba(0,0,0,0.5)",
        amber: "0 0 0 1px rgba(252,238,10,0.22), 0 8px 30px rgba(0,0,0,0.5)",
      },
      keyframes: {
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
      animation: {
        blink: "blink 1s step-end infinite",
        float: "float 6s ease-in-out infinite",
        scan: "scan 6s linear infinite",
      },
    },
  },
  plugins: [],
};
