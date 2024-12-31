<script setup lang="ts">
import { useFocus } from '@vueuse/core'
import DarkModeAdaptor from '@/components/DarkModeAdaptor.vue'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { HistoryItem, useProcedure } from '@/utils/procedure'
import { debounce } from 'lodash-es'
import HistoryItemComponent from '@/components/HistoryItem.vue'

const searchInput = ref<HTMLInputElement | null>(null)
const { focused: searchInputFocused } = useFocus(searchInput)
const searchString = ref('')
const histories = ref<HistoryItem[]>([])
const procedure = useProcedure()

onMounted(() => {
	searchInputFocused.value = true
})

const search = debounce(async function () {
	if (!(await procedure.hasIndex())) {
		await procedure.initFuseIndexing()
	}
	const res = await procedure.search(searchString.value)
	histories.value = res.map((d) => d.item)
}, 300)

function open(url: string) {
	browser.tabs.create({ url })
}
</script>

<template>
	<DarkModeAdaptor />
	<div class="flex flex-col w-72 p-2 gap-2">
		<div class="flex items-center gap-2">
			<Input ref="searchInput" v-model="searchString" @keydown="search" />
		</div>
		<DynamicScroller class="h-72 px-1" :items="histories" :min-item-size="50">
			<template v-slot="{ item, index, active }">
				<DynamicScrollerItem
					:item="item"
					:active="active"
					:size-dependencies="[item.message]"
					:data-index="index"
				>
					<div class="cursor-pointer py-2" @click="open(item.url!)">
						<HistoryItemComponent :history="item" />
					</div>
					<Separator />
				</DynamicScrollerItem>
			</template>
		</DynamicScroller>
	</div>
</template>
