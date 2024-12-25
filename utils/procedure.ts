import { defineProxyService } from '@webext-core/proxy-service'
import Fuse from 'fuse.js'
import { isNil } from 'lodash-es'
import { History } from 'wxt/browser'
import { getAllHistories } from './get-all-history'

export interface HistoryItem extends History.HistoryItem {}
const keys: Array<keyof HistoryItem> = ['title', 'url']

export const [registerProcedure, useProcedure] = defineProxyService(
	'procedure',
	() => {
		let fuse: Fuse<HistoryItem>
		return {
			async initFuseIndexing() {
				const histories = await getAllHistories()
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
		}
	},
)
