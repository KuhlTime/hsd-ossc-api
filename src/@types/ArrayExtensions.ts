Array.prototype.last = function () {
	return this[this.length - 1]
}

Array.prototype.first = function () {
	return this[0]
}

Array.prototype.merge = function (): Record<string, unknown> {
	return this.reduce((a, b) => {
		return { ...a, ...b }
	})
}
