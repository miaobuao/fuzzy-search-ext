<script setup lang="ts">
import { Globe } from 'lucide-vue-next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const props = defineProps<{
	url: string
	title?: string
}>()

const favicon = computed(() => {
	try {
		const urlObj = new URL(props.url)
		return `${urlObj.origin}/favicon.ico`
	} catch (error) {
		console.error('Invalid URL:', error)
		return ''
	}
})
</script>

<template>
	<Avatar v-bind="$attrs">
		<template v-if="favicon">
			<AvatarImage :src="favicon" loading="lazy" />
			<AvatarFallback>
				<template v-if="props.title?.length">
					{{ props.title.slice(0, 1).toUpperCase() }}
				</template>
				<Globe v-else />
			</AvatarFallback>
		</template>
		<Globe v-else />
	</Avatar>
</template>
