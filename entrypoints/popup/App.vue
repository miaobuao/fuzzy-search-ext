<script setup lang="ts">
import { useFocus } from '@vueuse/core'
import DarkModeAdaptor from '@/components/DarkModeAdaptor.vue'
import { Input } from '@/components/ui/input'
import { HistoryItem, useProcedure } from '@/utils/procedure'
import { debounce } from 'lodash-es'
import SearchResultList from '@/components/SearchResultList.vue'
import { Loader2 } from 'lucide-vue-next'

const searchInput = ref<HTMLInputElement | null>(null)
const { focused: searchInputFocused } = useFocus(searchInput)
const searchString = ref('')
const histories = ref<HistoryItem[]>([])
const procedure = useProcedure()
const loadingSearchResult = ref(false)

onMounted(async () => {
	searchInputFocused.value = true
	histories.value = await procedure.getAllHistories()
})

const search = debounce(async function () {
	loadingSearchResult.value = true
	try {
		if (!searchString.value) {
			histories.value = await procedure.getAllHistories()
			return
		}
		if (!(await procedure.hasIndex())) {
			await procedure.initFuseIndexing()
		}
		const res = await procedure.search(searchString.value)
		histories.value = res.map((d) => d.item)
	} finally {
		loadingSearchResult.value = false
	}
}, 300)
</script>

<template>
	<DarkModeAdaptor />
	<div class="flex flex-col w-72 h-96">
		<div class="flex items-center p-2">
			<Input ref="searchInput" v-model="searchString" @keydown="search" />
		</div>
		<div
			v-if="loadingSearchResult"
			class="flex-1 flex justify-center items-center"
		>
			<Loader2 class="size-8 animate-spin" />
		</div>
		<SearchResultList v-else class="flex-1 p-1" :items="histories" />
	</div>
</template>
