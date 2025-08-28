
import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { primary: '#16a34a', dark: '#0f172a', light: '#eafff2' },
      },
      boxShadow: {
        glass: '0 8px 30px rgba(15,23,42,.06)'
      }
    }
  },
  plugins: [],
}
export default config
