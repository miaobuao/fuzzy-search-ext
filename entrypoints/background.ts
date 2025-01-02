import { db } from '@/utils/indexed-db'
import { registerProcedure, useProcedure } from '@/utils/procedure'
import { debounce, isNil } from 'lodash-es'

registerProcedure()

export default defineBackground(async () => {
	const procedure = useProcedure()

	if (!(await procedure.hasIndex())) {
		await procedure.initFuseIndexing()
	}

	const updateIndex = debounce(async () => {
		await procedure.updateFuseIndex()
	}, 500)

	browser.history.onVisited.addListener((history) => {
		if (!history.url) {
			return
		}
		function onComplete(responseDetails: { url: string }) {
			if (responseDetails.url !== history.url) {
				return
			}
			browser.webRequest.onCompleted.removeListener(onComplete)
			updateIndex()
		}
		browser.webRequest.onCompleted.addListener(onComplete, {
			urls: [history.url],
		})
	})

	browser.tabs.onUpdated.addListener((id, changeInfo, tab) => {
		let { title, url } = tab
		if (isNil(id) || isNil(url) || changeInfo.status !== 'complete') {
			return
		}
		browser.tabs.onRemoved.addListener(async function onRemoved(tabId: number) {
			if (tabId !== id) {
				return
			}
			browser.tabs.onRemoved.removeListener(onRemoved)
			const history = await db.RecentlyClosedHistory.where({
				url,
				title,
			}).first()
			if (history) {
				await db.RecentlyClosedHistory.update(history.id, {
					title,
					ctime: Date.now(),
				})
				return
			} else {
				db.RecentlyClosedHistory.add({
					title,
					url: url!,
					ctime: Date.now(),
				})
			}
		})
	})
})
