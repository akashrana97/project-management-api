// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        'fade-slide': 'fadeSlide 0.3s ease-out',
      },
      keyframes: {
        fadeSlide: {
          '0%': { opacity: 0, transform: 'translateY(-10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
