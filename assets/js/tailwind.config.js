tailwind.config = {
  theme: {
    extend: {
      // Konversi Variabel Warna
      colors: {
        primary: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
        cream: '#FDFCF0',
        orange_primary: '#e37b3c',
        'cream-bg': '#fffbf0',
        'signal-orange': '#e37b3c',
        'orange-dark': '#b35d2d',
        'gray-text': '#71717a',
      },

      // Konversi Tipografi / Font
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },

      // Konversi Animasi Keyframes
      keyframes: {
        'pulse-signal': {
          '0%': {
            boxShadow: '0 0 0 0 rgba(227, 123, 60, 0.7)'
          },
          '70%': {
            boxShadow: '0 0 0 15px rgba(227, 123, 60, 0)'
          },
          '100%': {
            boxShadow: '0 0 0 0 rgba(227, 123, 60, 0)'
          },
        }
      },

      // Mendaftarkan class animasi
      animation: {
        'pulse-signal': 'pulse-signal 2s infinite',
      }
    }
  }
}
