import _ from 'lodash'
import { Table } from '../utilities/TableParser'
import { Module, Exam, WorkExperience } from './'
import { Expose } from 'class-transformer'

/**
 * A `ModuleExtract` keeps information about each and every module found on
 * the scraped web page.
 */
export default class ModuleExtract {
	modules: Module[] = []

	/**
	 * The constructor parses the provided 'html' table
	 * to individual modules.
	 * @param table A representitive of the html table.
	 */
	constructor(table: Table) {
		/**
		 * Filtered array of all module rows.
		 * > For each module there might be multiple
		 * Exams and Practical Exercises. A module can be identified if its id is 5
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

	/**
	 * Returns an array of grades. One grade for each successfully closed module.
	 */
	private get gradesArray() {
		const a = this.modules
			.filter(m => m.grade !== undefined)
			.map(m => {
				// console.log(`${m.factor} x ${m.grade} - ${m.name}`)

				// In case the factor could not be found the link to the specialization is
				// not defined.
				if (m.grade && !m.factor) {
					console.warn(`Could not find factor for module ${m.name} (${m.id})!`)
				}

				let wmnFactor: number | undefined

				if (m.name.toLowerCase().includes('wmnt') || m.name.toLowerCase().includes('wmt')) {
					wmnFactor = 2
					console.log('Factor set')
				}

				return {
					factor: m.factor || wmnFactor || 1,
					grade: m.grade || 0
				}
			})
		return a
	}

	/**
	 * Returns the total credit points the student has scored.
	 */
	@Expose()
	get totalCreditPoints(): number {
		return this.modules.map(module => module.creditPoints).sum()
	}

	/**
	 * Returns the avarage grade calculated by the sum of all grades
	 * devided by the number of completed modules.
	 */
	// TODO: Modules are weight differently. Take this into account.
	@Expose()
	get avgGrade(): number | undefined {
		const a = this.gradesArray.flatMap(o => Array(o.factor).fill(o.grade))
		const b = a.avg()?.toPrecision(3)
		return b ? parseFloat(b) : undefined
	}
}
