import { Semester } from './'
import { TableCell } from '../utilities/TableParser'

export default class WorkExperience {
	semester: string
	passed: boolean

	constructor(row: Record<string, TableCell>) {
		this.semester = row['Semester'].value
		this.passed = row['Status'].value === 'bestanden'
	}
}
