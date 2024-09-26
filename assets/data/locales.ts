import type { LocaleObject } from '@nuxtjs/i18n';

export const localesConst = [
	{ code: 'ja', language: 'ja-JP', name: '日本語', files: [ 'ja.json' ] },
	{ code: 'en', language: 'en-US', name: 'English', files: [ 'en.json' ] },
] as const satisfies LocaleObject[];

export type LocaleCodes = typeof localesConst[number]['code'];

export const locales = localesConst;
