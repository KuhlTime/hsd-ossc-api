import { Semester } from './'

export default class WorkExperience {
	semester: string
	passed: boolean

	constructor(row: Record<string, string>) {
		this.semester = row['Semester']
		this.passed = row['Status'] === 'bestanden'
	}
}
