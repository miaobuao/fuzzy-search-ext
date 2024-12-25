<script setup lang="ts">
import { useFocus } from '@vueuse/core'
import DarkModeAdaptor from '@/components/DarkModeAdaptor.vue'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { HistoryItem, useProcedure } from '@/utils/procedure'
import ScrollArea from '@/components/ui/scroll-area/ScrollArea.vue'
import { debounce } from 'lodash-es'

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
	<div class="flex flex-col w-72 pt-2 px-2 gap-2">
		<div class="flex items-center gap-2">
			<Input ref="searchInput" v-model="searchString" @keydown="search" />
		</div>
		<ScrollArea class="h-72 p-1">
			<template v-for="item in histories" :key="item.id">
				<a class="cursor-pointer" @click="open(item.url!)">
					<div class="flex my-2">
						<div class="truncate">
							<p class="truncate">
								{{ item.title }}
							</p>
							<p class="truncate text-xs opacity-80">
								{{ item.url }}
							</p>
						</div>
					</div>
				</a>
				<Separator />
			</template>
		</ScrollArea>
	</div>
</template>
