import { expect, test } from 'bun:test'
import pinyin from '..'

test('emoji test', () => {
	expect(pinyin('我爱你❤️')).toStrictEqual([['wo'], ['ai'], ['ni'], ['❤️']])
	expect(pinyin('万俟')).toStrictEqual([
		['wan', 'mo'],
		['qi', 'si'],
	])
})
