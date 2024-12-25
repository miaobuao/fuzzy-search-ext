import { registerProcedure } from '@/utils/procedure'

registerProcedure()

export default defineBackground(async () => {
	const procedure = useProcedure()

	if (!(await procedure.hasIndex())) {
		await procedure.initFuseIndexing()
	}

	browser.history.onVisited.addListener((item) => {
		procedure.addHistory(item)
	})
})
