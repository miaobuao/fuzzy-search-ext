import { defineProxyService } from '@webext-core/proxy-service'
import Fuse from 'fuse.js'
import { isNil } from 'lodash-es'
import { History } from 'wxt/browser'
import { getAllHistories, getHistoriesAfter } from './get-all-history'

export interface HistoryItem extends History.HistoryItem {}
const keys: Array<keyof HistoryItem> = ['title', 'url']

export const [registerProcedure, useProcedure] = defineProxyService(
	'procedure',
	() => {
		let fuse: Fuse<HistoryItem>
		let histories: History.HistoryItem[]
		return {
			async initFuseIndexing() {
				histories = await getAllHistories()
				const index = Fuse.createIndex(keys, histories)
				fuse = new Fuse(histories, { keys }, index)
			},
			hasIndex() {
				return !isNil(fuse)
			},
			addHistory(history: HistoryItem) {
				fuse.add(history)
			},
			search(query: string) {
				return fuse.search(query)
			},
			async updateFuseIndex() {
				if (isNil(histories) || histories.length === 0) {
					await this.initFuseIndexing()
				} else {
					let lastHistory = histories[0]
					console.log(histories, lastHistory)

					for (const history of histories) {
						if (isNil(history.lastVisitTime)) {
							continue
						}
						if (history.lastVisitTime > (lastHistory.lastVisitTime ?? 0)) {
							lastHistory = history
						}
					}
					const newHistories = await getHistoriesAfter(lastHistory)
					const newHistoriesIds: Record<string, true> = {}
					const lastHistoriesIds: Record<string, true> = {}
					histories.forEach((h) => {
						lastHistoriesIds[h.id] = true
					})
					newHistories.forEach((h) => {
						newHistoriesIds[h.id] = true
						if (!lastHistoriesIds[h.id]) {
							this.addHistory(h)
						}
					})
					histories = [
						...histories.filter((h) => !newHistoriesIds[h.id]),
						...newHistories,
					]
				}
			},
		}
	},
)
