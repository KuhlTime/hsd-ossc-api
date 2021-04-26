import moment from 'moment'
import Score from './Score'
import Semester from './Semester'
import { Exclude } from 'class-transformer'
import { TableCell } from '../utilities/TableParser'

/**
 * A `Exam` represents a single exam the student took.
 * It keeps of the time the student took the specific
 * exam and holds information about the overall score
 * that was achived.
 */
export default class Exam {
	semester: Semester
	grade: number
	passed: boolean
	examinationDate: Date | undefined
	score: Score | undefined

	@Exclude()
	scoreLink: URL | undefined

	constructor(row: Record<string, TableCell>) {
		this.semester = new Semester(row['Semester'].value)
		this.grade = parseFloat(row['Note'].value.replace(',', '.'))
		this.passed = row['Status'].value === 'bestanden'
		this.examinationDate = moment(row['Prüfungsdatum'].value, 'DD.MM.YYYY').utc().toDate()

		if (row['Note'].link) {
			const decoded = row['Note'].link.replace(/&amp;/g, '&')
			this.scoreLink = new URL(decoded)
		}
	}
}
