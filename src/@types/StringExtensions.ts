/**
 * This method cleans up the string
 */
String.prototype.clean = function () {
	return this.trim().replace(/\t/gm, '').replace(/  +/gm, '').replace(/\n/gm, ' ')
}
