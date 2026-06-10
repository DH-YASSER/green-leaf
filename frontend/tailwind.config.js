/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#1e4620',
          secondary: '#2d6a4f',
          accent: '#52b788',
          highlight: '#d8f3dc',
          saffron: '#f4c430',
          terracotta: '#d05b2a',
          bg: '#f7f9f6',
        },
        markeat: {
          terracotta: '#d05b2a',
          saffron: '#f4c430',
          'olive-green': '#2d6a4f',
          bg: '#f7f9f6',
        }
      },
      backgroundImage: {
        'zellige-pattern': "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22><path d=%22M30 0 L0 30 L30 60 L60 30 Z%22 fill=%22%23ffffff%22 fill-opacity=%220.05%22/%22><path d=%22M0 30 L30 0 L60 30 L30 60 Z%22 fill=%22%23ffffff%22 fill-opacity=%220.03%22/%22></svg>')",
      }
    },
  },
  plugins: [],
}