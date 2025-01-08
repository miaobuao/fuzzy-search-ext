import pinyin from 'pinyin'

export function toPinyinString(word: string) {
	return pinyin(word).flat().join(' ')
}
