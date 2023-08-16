import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme';

export default <Partial<Config>>{
    content: [
        './components/**/*.{js,vue,ts}',
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./nuxt.config.{js,ts}",
        "./app.vue",
        "./error.vue",
    ],
    theme: {
        fontFamily: {
            'sans': ['Inter', 'Noto Sans JP', ...defaultTheme.fontFamily.sans],
        },
    },
}
