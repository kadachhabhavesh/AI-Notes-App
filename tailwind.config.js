/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Add this line
  ],
  theme: {
    extend: {
      fontFamily: {
        itim: ['Itim', 'sans-serif'],
        playwrite: ['Playwrite DE Grund', 'serif'],
        protest: ['Protest Revolution', 'serif'],
        indie: ['Indie Flower', 'cursive'],
        architects: ['Architects Daughter', 'cursive']
      },
    },
  },
  plugins: [],
}

