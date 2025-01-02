import { createI18n } from 'vue-i18n'
import en from './lang/en'
import zh from './lang/zh'

export const i18n = createI18n({
	locale: 'en',
	legacy: false,
	fallbackLocale: 'en',
	messages: {
		// @ts-ignore
		en,
		zh,
	},
})

export function useI18n() {
	return i18n.global
}
