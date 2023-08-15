// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    css: [
        "@/assets/css/scrollbar.css",
    ],
    modules: [
        '@nuxthq/ui',
    ],
    ui: {
        global: true,
    },
})
