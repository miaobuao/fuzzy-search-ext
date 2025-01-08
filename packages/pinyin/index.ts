import hanziToneTable from './data/hanzi-no-tone-pinyin-table.json'

export default function pinyin(word: string) {
	const segmenter = new Intl.Segmenter('zh', { granularity: 'grapheme' })
	return Array.from(segmenter.segment(word), (segment) => segment.segment).map(
		(char) => {
			if (char in hanziToneTable) {
				return (hanziToneTable as any)[char] as string[]
			}
			return [char]
		},
	)
}
