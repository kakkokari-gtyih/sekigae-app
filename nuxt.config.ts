// https://nuxt.com/docs/api/configuration/nuxt-config
// 公開時のドメイン（末尾スラッシュなし）
import genSitemap from './scripts/gen-sitemap';

const baseUrl = 'https://misskey-hub.net';

export const locales = [
	{ code: 'ja', iso: 'ja-JP', name: '日本語' },
	{ code: 'en', iso: 'en-US', name: 'English' },
];

export default defineNuxtConfig({
    runtimeConfig: {
        public: {
            baseUrl,
        },
    },
    css: [
        "@/assets/css/scrollbar.css",
    ],
    modules: [
        '@nuxthq/ui',
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
		strategy: 'prefix',
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
    },
    experimental: {
		inlineSSRStyles: false,
		payloadExtraction: true,
	},
})
