import moment from 'moment'
import Score from './Score'
import { Exclude, Expose } from 'class-transformer'
import { TableCell } from '../utilities/TableParser'
import url from 'url'

export default class Exam {
	semester: string
	grade: number
	passed: boolean
	examinationDate: Date | undefined
	score: Score | undefined

	@Exclude()
	scoreLink: URL | undefined

	constructor(row: Record<string, TableCell>) {
		this.semester = row['Semester'].value
		this.grade = parseFloat(row['Note'].value.replace(',', '.'))
		this.passed = row['Status'].value === 'bestanden'
		this.examinationDate = moment(row['Prüfungsdatum'].value, 'DD.MM.YYYY').utc().toDate()

		if (row['Note'].link) {
			const decoded = row['Note'].link.replace(/&amp;/g, '&')
			this.scoreLink = new URL(decoded)
		}

		// Check if firestore has score

		// Else download score
	}
}
