import { registerProcedure } from '@/utils/procedure'
import { debounce } from 'lodash-es'

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
		function onComplete() {
			browser.webRequest.onCompleted.removeListener(onComplete)
			updateIndex()
		}
		browser.webRequest.onCompleted.addListener(onComplete, {
			urls: [history.url],
		})
	})
})
