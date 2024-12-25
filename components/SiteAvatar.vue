<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const { url, title } = defineProps<{
	url: string
	title: string
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
			{{ title.slice(0, 1).toUpperCase() }}
		</AvatarFallback>
	</Avatar>
</template>
