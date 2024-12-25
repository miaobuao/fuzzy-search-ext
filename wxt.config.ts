import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
import { defineConfig } from 'wxt'

// See https://wxt.dev/api/config.html
export default defineConfig({
	extensionApi: 'chrome',
	modules: ['@wxt-dev/module-vue'],
	manifest: {
		name: 'Fuzzy Search',
		description: 'Fuzzy Search',
		permissions: ['history', 'tabs'],
	},
	vite: () => ({
		css: {
			postcss: {
				plugins: [tailwindcss(), autoprefixer()],
			},
		},
	}),
})
