// https://nuxt.com/docs/api/configuration/nuxt-config
import genSitemap from './scripts/gen-sitemap';
import { genCSVDefsSet } from './scripts/gen-csv-defs-set';
import { locales } from './assets/data/locales';

// 公開時のドメイン（末尾スラッシュなし）
const baseUrl = 'https://sekigae.app';

export default defineNuxtConfig({
    compatibilityDate: '2024-09-26',
    runtimeConfig: {
        locales,
        public: {
            baseUrl,
        },
    },
    css: [
        "@/assets/css/scrollbar.css",
    ],
    modules: [
        '@nuxt/ui',
        '@nuxtjs/i18n'
    ],
    ui: {
        global: true,
    },
    vite: {
        build: {
            rollupOptions: {
                output: {
                    manualChunks: {
                        sekigae: ['./lib/sekigae.ts'],
                    }
                }
            }
        }
    },
    i18n: {
		baseUrl,
		vueI18n: './i18n.config.ts',
		locales,
		defaultLocale: 'ja',
		strategy: 'prefix_and_default',
        trailingSlash: true,
        lazy: true,
        langDir: './../locales',
    },
    nitro: {
		hooks: {
			'compiled': genSitemap,
		},
		prerender: {
			routes: [
				"/404.html"
			],
			// 【一時対応】とりあえずビルドできるようにする
			failOnError: false,
		},
        plugins: [
            '@/server/plugins/i18nRedirector.ts',
        ]
    },
    experimental: {
        componentIslands: true,
		payloadExtraction: true,
	},
    features: {
        inlineStyles: false,
    },
    hooks: {
        'build:before': async () => {
            await genCSVDefsSet();
        },
    },
})
