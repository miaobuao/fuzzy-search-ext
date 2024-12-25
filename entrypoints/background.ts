import { registerProcedure } from '@/utils/procedure'

registerProcedure()

export default defineBackground(async () => {
	const procedure = useProcedure()
	if (!(await procedure.hasIndex())) {
		await procedure.initFuseIndexing()
	}
	console.log('Hello background!', { id: browser.runtime.id })
})
