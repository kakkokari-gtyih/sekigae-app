// https://nuxt.com/docs/api/configuration/nuxt-config
import genSitemap from './scripts/gen-sitemap';
import type { LocaleObject } from '@nuxtjs/i18n/dist/runtime/composables';

// 公開時のドメイン（末尾スラッシュなし）
const baseUrl = 'https://sekigae.app';

export const locales: LocaleObject[] = [
	{ code: 'ja', iso: 'ja-JP', name: '日本語' },
	{ code: 'en', iso: 'en-US', name: 'English' },
];

export default defineNuxtConfig({
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
		strategy: 'prefix',
        trailingSlash: true,
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
		inlineSSRStyles: false,
        componentIslands: true,
		payloadExtraction: true,
	},
})
