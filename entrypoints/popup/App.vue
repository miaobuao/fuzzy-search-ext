<script setup lang="ts">
import { useFocus } from '@vueuse/core'
import DarkModeAdaptor from '@/components/DarkModeAdaptor.vue'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { HistoryItem, useProcedure } from '@/utils/procedure'
import { debounce } from 'lodash-es'
import HistoryItemComponent from '@/components/HistoryItem.vue'
import { Loader2 } from 'lucide-vue-next'

const searchInput = ref<HTMLInputElement | null>(null)
const { focused: searchInputFocused } = useFocus(searchInput)
const searchString = ref('')
const histories = ref<HistoryItem[]>([])
const procedure = useProcedure()
const loadingSearchResult = ref(false)

onMounted(() => {
	searchInputFocused.value = true
})

const search = debounce(async function () {
	loadingSearchResult.value = true
	try {
		if (!(await procedure.hasIndex())) {
			await procedure.initFuseIndexing()
		}
		const res = await procedure.search(searchString.value)
		histories.value = res.map((d) => d.item)
	} finally {
		loadingSearchResult.value = false
	}
}, 300)

function open(url: string) {
	browser.tabs.create({ url })
}
</script>

<template>
	<DarkModeAdaptor />
	<div class="flex flex-col w-72 h-96 px-2 pt-2 gap-2">
		<div class="flex items-center gap-2">
			<Input ref="searchInput" v-model="searchString" @keydown="search" />
		</div>
		<div
			v-show="loadingSearchResult"
			class="flex-1 flex justify-center items-center"
		>
			<Loader2 class="size-8 animate-spin" />
		</div>
		<DynamicScroller
			v-show="!loadingSearchResult"
			class="flex-1 px-1"
			:items="histories"
			:min-item-size="50"
		>
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
					<Separator v-if="index !== histories.length - 1" />
				</DynamicScrollerItem>
			</template>
		</DynamicScroller>
	</div>
</template>
