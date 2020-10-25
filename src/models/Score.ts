import { Table, TableParser } from '../utilities/TableParser'
import { Expose, Exclude } from 'class-transformer'
import Exam from './Exam'
import moment from 'moment'

export default class Score {
	@Exclude() id: number
	@Exclude() name: string
	grades: number[] = []
	avarage = 0
	@Exclude() examinationDate: Date | undefined

	constructor(body: string) {
		const tables = TableParser.parse(body)

		const moduleTable = tables[1]
		const scoreTable = tables[2]

		// set id
		this.id = parseInt(moduleTable.rows[0]['PNr.'].value)

		// set name
		this.name = moduleTable.rows[0]['Prüfung'].value

		// set date
		this.examinationDate = moment(moduleTable.rows[0]['Prüfungsdatum'].value, 'DD.MM.YYYY').utc().toDate()

		// Set all grades
		for (let i = 3; i <= 7; i++) {
			const value = parseInt(scoreTable.rows[i].undefined.value)
			this.grades.push(value)
		}

		// Set avarage grade
		this.avarage = parseFloat(scoreTable.rows[9].undefined.value)
	}

	@Expose()
	get attendes(): { total: number; passed: number; failed: number } {
		const total = this.grades.sum()
		const failed = this.grades[3]

		return {
			total: total,
			passed: total - failed,
			failed: failed
		}
	}

	// TODO: Simple Index values of each grade enum
}
