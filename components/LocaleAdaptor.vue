<script setup lang="ts">
import { usePreferredLanguages } from '@vueuse/core'
import { useI18n } from '@/i18n'

const preferredLanguages = usePreferredLanguages()
const i18n = useI18n()

watch(
	preferredLanguages,
	([lang]) => {
		const [locale] = lang.toLowerCase().split('-')
		switch (locale) {
			case 'zh':
			case 'en':
				i18n.locale.value = locale
				break
			default:
				i18n.locale.value = 'en'
				break
		}
	},
	{
		immediate: true,
	},
)
</script>
