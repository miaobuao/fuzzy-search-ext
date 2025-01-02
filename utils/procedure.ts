import { defineProxyService } from '@webext-core/proxy-service'
import Fuse from 'fuse.js'
import { isNil } from 'lodash-es'
import { History } from 'wxt/browser'
import {
	getAllHistories as _getAllHistories,
	getHistoriesAfter,
} from './get-all-history'
import { db } from './indexed-db'

export interface HistoryItem extends History.HistoryItem {}
const keys: Array<keyof HistoryItem> = ['title', 'url']

export const [registerProcedure, useProcedure] = defineProxyService(
	'procedure',
	() => {
		let fuse: Fuse<HistoryItem>
		let histories: History.HistoryItem[]

		function urlToHistoryItem(url: string) {
			return histories.find((h) => h.url === url)
		}

		function getAllHistories() {
			return _getAllHistories()
		}

		async function initFuseIndexing() {
			histories = await getAllHistories()
			const index = Fuse.createIndex(keys, histories)
			fuse = new Fuse(histories, { keys }, index)
		}

		function hasIndex() {
			return !isNil(fuse)
		}

		function addHistory(history: HistoryItem) {
			fuse.add(history)
		}

		function search(query: string) {
			return fuse.search(query)
		}

		async function updateFuseIndex() {
			if (isNil(histories) || histories.length === 0) {
				await initFuseIndexing()
			} else {
				let lastHistory = histories[0]
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
						addHistory(h)
					}
				})
				histories = [
					...histories.filter((h) => !newHistoriesIds[h.id]),
					...newHistories,
				]
			}
		}

		async function getAllRecentlyClosed(range: number = 72 * 60 * 60 * 1000) {
			const now = Date.now()
			const startTime = now - range
			const res = await db.RecentlyClosedHistory.where('ctime')
				.aboveOrEqual(startTime)
				.toArray()
			updateFuseIndex()
			return res
				.map((r) => urlToHistoryItem(r.url))
				.filter(Boolean) as HistoryItem[]
		}

		async function searchRecentlyClosed(
			query: string,
			range: number = 72 * 60 * 60 * 1000,
		) {
			await updateFuseIndex()
			const now = Date.now()
			const startTime = now - range
			const fuse = new Fuse(
				await db.RecentlyClosedHistory.where('ctime')
					.aboveOrEqual(startTime)
					.toArray(),
				{
					keys,
				},
			)
			const searchResults = fuse.search(query)
			return searchResults
				.map((r) => urlToHistoryItem(r.item.url))
				.filter(Boolean) as HistoryItem[]
		}

		return {
			getAllHistories,
			initFuseIndexing,
			hasIndex,
			addHistory,
			search,
			updateFuseIndex,
			getAllRecentlyClosed,
			searchRecentlyClosed,
		}
	},
)
