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
        }
      },

      // Konversi Tipografi / Font
      fontFamily: {
        sans: ["ui-sans-serif", "Poppins", "sans-serif"],
        serif: ["Playfair Display", "serif"],
        isyarat: ["MccidFslFont2"],
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
      backgroundImage: {
        'dots': 'radial-gradient(rgba(255,255,255,0.35) 1.5px, transparent 1.5px)',
        'dots-light': 'radial-gradient(rgba(249,115,22,0.2) 1.5px, transparent 1.5px)',
        'dots-dark': 'radial-gradient(rgba(255,255,255,0.25) 1.5px, transparent 1.5px)',
      },

      backgroundSize: {
        'dots': '18px 18px',
      },
      
      // Mendaftarkan class animasi
      animation: {
        'pulse-signal': 'pulse-signal 2s infinite',
      }
    }
  }
}
