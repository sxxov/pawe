export function nameof<const T extends Record<string, any>>(obj: T) {
	return Object.keys(obj)[0] as keyof T;
}
