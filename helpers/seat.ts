export const isBlockingExpired = (blocked_at: Date): boolean => {
	const now = new Date()
	const diff = now.getTime() - new Date(blocked_at).getTime()
	const tenMinsInMs = 10 * 60 * 1000
	return diff > tenMinsInMs
}
