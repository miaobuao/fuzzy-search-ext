type NotNull<T extends any[]> = T['length'] extends 0
	? []
	: T extends [infer First, ...infer Tails]
		? First extends null | undefined
			? NotNull<Tails>
			: [First, ...NotNull<Tails>]
		: T extends (undefined | null | infer U)[]
			? U[]
			: never
