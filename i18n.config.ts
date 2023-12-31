import ja from '@/locales/ja.json';
import en from '@/locales/en.json';

export default defineI18nConfig(() => ({
	legacy: false,
	locale: 'ja',
	messages: {
		ja,
		en,
	},
	datetimeFormats: {
		'ja-JP': {
			short: {
				year: 'numeric', month: 'short', day: 'numeric'
			},
			long: {
				year: 'numeric', month: 'short', day: 'numeric',
				weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: true
			}
		}
	}
}));
