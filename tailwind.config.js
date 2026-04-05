/** @type {import('tailwindcss').Config} */
export default {
  // Tailwind will scan all these files for its utility classes
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // We can define custom brand colors for the Chandigarh Portal here
        chd: {
          blue: '#004C8F',
          light: '#E6F0FA',
          accent: '#FFB300',
          dark: '#1F2937'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}