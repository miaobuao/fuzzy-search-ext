<script setup lang="ts">
import { History } from 'wxt/browser'
import HistoryItem from './HistoryItem.vue'
import Separator from './ui/separator/Separator.vue'

defineProps<{
	items: History.HistoryItem[]
}>()

function open(url: string) {
	browser.tabs.create({ url })
}
</script>

<template>
	<DynamicScroller v-bind="$attrs" :items="items" :min-item-size="50">
		<template v-slot="{ item, index, active }">
			<DynamicScrollerItem
				:item="item"
				:active="active"
				:size-dependencies="[item.message]"
				:data-index="index"
			>
				<div class="cursor-pointer py-2" @click="open(item.url!)">
					<HistoryItem :history="item" />
				</div>
				<Separator v-if="index !== items.length - 1" />
			</DynamicScrollerItem>
		</template>
	</DynamicScroller>
</template>
