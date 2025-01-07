import pinyin from 'pinyin'

export function toPinyin(word: string) {
	return pinyin(word, {
		heteronym: true,
		style: pinyin.STYLE_NORMAL,
	})
}

export function toPinyinString(word: string) {
	return toPinyin(word).flat().join(' ')
}
