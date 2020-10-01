Array.prototype.last = function () {
	return this[this.length - 1]
}

Array.prototype.merge = function (): Record<string, unknown> {
	return this.reduce((a, b) => {
		return { ...a, ...b }
	})
}
