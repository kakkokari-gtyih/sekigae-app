import ja from '@/locales/ja.json';

export default defineI18nConfig(() => ({
	legacy: false,
	locale: 'ja',
	messages: {
		ja,
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