import { Table, TableParser } from '../utilities/TableParser'
import { Expose, Exclude } from 'class-transformer'
import Exam from './Exam'
import Semester from './Semester'
import moment from 'moment'

export default class Score {
	id: number
	name: string
	semester: Semester
	grades: number[] = []
	avarage = 0
	examinationDate: Date | undefined
	updated: Date

	constructor(body: string) {
		const tables = TableParser.parse(body)

		const moduleTable = tables[1]
		const scoreTable = tables[2]

		// set id
		// FIXME: Assuming that the module id is always one less then the exam id
		this.id = parseInt(moduleTable.rows[0]['PNr.'].value) - 1

		// set name
		this.name = moduleTable.rows[0]['Prüfung'].value

		// set semester
		this.semester = new Semester(moduleTable.rows[0]['Semester'].value)

		// set date
		this.examinationDate = moment(moduleTable.rows[0]['Prüfungsdatum'].value, 'DD.MM.YYYY').utc().toDate()

		// Set all grades
		for (let i = 3; i <= 7; i++) {
			const value = parseInt(scoreTable.rows[i].undefined.value)
			this.grades.push(value)
		}

		// Set avarage grade
		this.avarage = parseFloat(scoreTable.rows[9].undefined.value)

		// set updated date
		this.updated = new Date()
	}

	@Expose()
	get attendes(): { total: number; passed: number; failed: number } {
		const total = this.grades.sum()
		const failed = this.grades[4]

		return {
			total: total,
			passed: total - failed,
			failed: failed
		}
	}
}
