export function average(...values: number[]) {
	return values.length > 0 ?
			values.reduce((a, b) => a + b, 0) / values.length
		:	0;
}
