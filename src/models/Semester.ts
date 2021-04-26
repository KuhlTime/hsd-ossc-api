export default class Semester {
	winter: boolean
	year: number

	constructor(value: string) {
		// Possible values: "WiSe 17/18", "WS 17/18", "SoSe 20", "SS 20"
		if (value.charAt(0) === 'W') {
			this.winter = true
		} else if (value.charAt(0) === 'S') {
			this.winter = false
		} else {
			throw new Error("Can't process semester value of: " + value)
		}

		this.year = parseInt(value.split(' ')[1])
	}
}
