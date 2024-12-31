<script setup lang="ts">
import SiteAvatar from './SiteAvatar.vue'
import { History } from 'wxt/browser'

defineProps<{
	history: History.HistoryItem
}>()
</script>

<template>
	<div class="flex items-center gap-2">
		<SiteAvatar :url="history.url!" :title="history.title" class="size-6" />
		<div class="truncate">
			<p class="truncate">
				{{ history.title }}
			</p>
			<p class="truncate text-xs opacity-80">
				{{ history.url }}
			</p>
		</div>
	</div>
</template>
