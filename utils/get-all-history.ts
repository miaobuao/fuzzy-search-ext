import { isNil, last } from 'lodash-es'
import { type History } from 'wxt/browser'

export async function getAllHistories() {
	const res: History.HistoryItem[] = []
	let endTime = Date.now()
	const appearedId = new Map<string, true>()
	while (true) {
		let items = await browser.history.search({
			text: '',
			startTime: 0,
			endTime,
			maxResults: 10000,
		})
		items = items.filter((item) => !appearedId.has(item.id))
		if (!items.length) {
			break
		}
		res.push(...items)
		const { lastVisitTime } = last(items) ?? {}
		if (isNil(lastVisitTime)) {
			break
		}
		endTime = lastVisitTime
		for (const item of items) {
			appearedId.set(item.id, true)
		}
	}
	return res
}

export async function getHistoriesAfter(history: History.HistoryItem) {
	const res: History.HistoryItem[] = []
	let endTime = Number.MAX_SAFE_INTEGER
	const appearedId = new Map<string, true>()
	while (true) {
		let items = await browser.history.search({
			text: '',
			startTime: history.lastVisitTime,
			endTime,
			maxResults: 10000,
		})
		items = items.filter((item) => !appearedId.has(item.id))
		if (!items.length) {
			break
		}
		res.push(...items)
		const { lastVisitTime } = last(items) ?? {}
		if (isNil(lastVisitTime)) {
			break
		}
		endTime = lastVisitTime
		for (const item of items) {
			appearedId.set(item.id, true)
		}
	}
	return res
}
