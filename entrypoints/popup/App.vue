<script setup lang="ts">
import { useFocus } from '@vueuse/core'
import DarkModeAdaptor from '@/components/DarkModeAdaptor.vue'
import { Input } from '@/components/ui/input'
import { HistoryItem, useProcedure } from '@/utils/procedure'
import { debounce } from 'lodash-es'
import SearchResultList from '@/components/SearchResultList.vue'
import { Loader2 } from 'lucide-vue-next'
import {
	TabsContent,
	TabsIndicator,
	TabsList,
	TabsRoot,
	TabsTrigger,
} from 'radix-vue'
import LocaleAdapter from '@/components/LocaleAdaptor.vue'

const searchInput = ref<HTMLInputElement | null>(null)
const { focused: searchInputFocused } = useFocus(searchInput)
const searchString = ref('')
const histories = ref<HistoryItem[]>([])
const recentlyClosedHistories = ref<HistoryItem[]>([])
const procedure = useProcedure()
const loadingSearchResult = ref(false)
const tab = ref<'all-history' | 'recent-close'>('all-history')

onMounted(async () => {
	searchInputFocused.value = true
	histories.value = await procedure.getAllHistories()
	recentlyClosedHistories.value = await procedure.getAllRecentlyClosed()
})

async function searchAllHistory(searchString: string) {
	if (!searchString) {
		histories.value = await procedure.getAllHistories()
		return
	}
	if (!(await procedure.hasIndex())) {
		await procedure.initFuseIndexing()
	}
	const res = await procedure.search(searchString)
	histories.value = res.map((d) => d.item)
}

async function searchRecentlyClosed(searchString: string) {
	if (!searchString) {
		recentlyClosedHistories.value = await procedure.getAllRecentlyClosed()
		return
	}
	recentlyClosedHistories.value =
		await procedure.searchRecentlyClosed(searchString)
}

const search = debounce(async () => {
	loadingSearchResult.value = true
	try {
		await Promise.all([
			searchAllHistory(searchString.value),
			searchRecentlyClosed(searchString.value),
		])
	} finally {
		loadingSearchResult.value = false
	}
}, 300)
</script>

<template>
	<DarkModeAdaptor />
	<LocaleAdapter />
	<div class="flex flex-col w-80 h-[600px] px-2 pt-2 gap-2">
		<Input
			class="mx-auto"
			ref="searchInput"
			v-model="searchString"
			@keydown="search"
			:placeholder="
				tab === 'all-history' ? $t('searchHistory') : $t('searchRecentlyClosed')
			"
		/>
		<div
			v-if="loadingSearchResult"
			class="flex-1 flex justify-center items-center"
		>
			<Loader2 class="size-8 animate-spin" />
		</div>
		<TabsRoot v-else v-model="tab" as-child>
			<TabsList class="relative flex border-b">
				<TabsIndicator
					class="absolute px-8 left-0 h-0.5 bottom-0 w-[--radix-tabs-indicator-size] translate-x-[--radix-tabs-indicator-position] rounded-full transition-[width,transform] duration-300"
				>
					<div class="bg-foreground w-full h-full" />
				</TabsIndicator>
				<TabsTrigger class="tabs-trigger" value="all-history">
					{{ $t('history') }}
				</TabsTrigger>
				<TabsTrigger class="tabs-trigger" value="recent-close">
					{{ $t('recentlyClosed') }}
				</TabsTrigger>
			</TabsList>
			<TabsContent value="all-history" as-child>
				<SearchResultList class="search-result-list" :items="histories" />
			</TabsContent>
			<TabsContent value="recent-close" as-child>
				<SearchResultList
					class="search-result-list"
					:items="recentlyClosedHistories"
				/>
			</TabsContent>
		</TabsRoot>
	</div>
</template>

<style scoped>
.tabs-trigger {
	@apply px-5 p-2 text-sm flex items-center justify-center leading-none select-none outline-none;
}
.search-result-list {
	@apply flex-1;
}
</style>
