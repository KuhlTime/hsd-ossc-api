import moment from 'moment'

export default class Exam {
	semester: string
	grade: number
	passed: boolean
	examinationDate: Date | undefined

	constructor(row: Record<string, string>) {
		this.semester = row['semester']
		this.grade = parseFloat(row['Note'].replace(',', '.'))
		this.passed = row['Status'] === 'bestanden'
		this.examinationDate = moment(row['Prüfungsdatum'], 'DD.MM.YYYY').toDate()
	}
}
