import _ from 'lodash'
import { Table } from '../utilities/TableParser'
import { Module, Exam, WorkExperience } from './'
import { Expose } from 'class-transformer'

export default class ModuleExtract {
	modules: Module[] = []

	constructor(table: Table) {
		/**
		 * Filtered array of all module rows.
		 * > For each module there might be multiple
		 * Exams and Practical Excersizes. A module can be identified if its id is 5
		 * digits long and divisable by 10.
		 */
		const moduleRows = table.rows.filter(row => {
			return row['PNr.'].value.length === 5
		})

		// console.log(moduleRows)

		for (let i = 0; i < moduleRows.length; i++) {
			const row = moduleRows[i]
			const id = parseInt(row['PNr.'].value)

			if (row['PNr.'].value.length === 5 && id % 10 === 0) {
				// Module Header Row
				const module = new Module(row)

				// Exam: XXXX1
				// Work Experience: XXXX2
				while (i + 1 < moduleRows.length && parseInt(moduleRows[i + 1]['PNr.'].value) - id < 9) {
					const nextRow = moduleRows[i + 1]

					switch (parseInt(moduleRows[i + 1]['PNr.'].value) - id) {
						case 1:
							// EXAM
							const exam = new Exam(nextRow)
							module.add(exam)
							break
						case 2:
							// WORKEXPERIENCE
							const workExperience = new WorkExperience(nextRow)
							module.add(workExperience)
							break
						default:
							console.log('Found unknown entry')
					}

					i++
				}

				this.modules.push(module)
			}
		}
	}

	private get gradesArray(): number[] {
		const a = this.modules.filter(module => module.grade !== undefined).map(module => module.grade) as number[]
		return a
	}

	@Expose()
	get totalCreditPoints(): number {
		return this.modules.map(module => module.creditPoints).sum()
	}

	@Expose()
	get avgGrade(): number | undefined {
		return this.gradesArray.avg()
	}

	forExam = (callback: (exam: Exam) => void) => {
		this.modules.forEach(module => {
			module.exams.forEach(exam => {
				callback(exam)
			})
		})
	}
}
