<script setup lang="ts">
import { Globe } from 'lucide-vue-next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const { url, title } = defineProps<{
	url: string
	title?: string
}>()

function getFavoriteIcon(url: string) {
	const urlObj = new URL(url)
	return `${urlObj.origin}/favicon.ico`
}
</script>

<template>
	<Avatar v-bind="$attrs">
		<AvatarImage :src="getFavoriteIcon(url)" loading="lazy" />
		<AvatarFallback>
			<template v-if="title?.length">
				{{ title.slice(0, 1).toUpperCase() }}
			</template>
			<Globe v-else />
		</AvatarFallback>
	</Avatar>
</template>
