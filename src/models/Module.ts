import { WorkExperience, Exam } from '.'
import { Expose } from 'class-transformer'
import { TableCell } from '../utilities/TableParser'
import HandbookManager from '../controllers/HandbookManager'

const handbookManager = HandbookManager.shared

export default class Module {
	id: number
	name: string
	passed: boolean
	creditPoints: number
	exams: Exam[] = []
	workExperiences: WorkExperience[] = []
	grade: number | undefined

	constructor(row: Record<string, TableCell>) {
		this.id = parseInt(row['PNr.'].value)
		this.name = row['Prüfung'].value
		this.passed = row['Status'].value === 'bestanden'
		this.creditPoints = parseInt(row['Bonus'].value)

		const grade = parseFloat(row['Note'].value)
		this.grade = isNaN(grade) ? undefined : grade
	}

	add(item: Exam | WorkExperience) {
		switch (item.constructor) {
			case Exam:
				this.exams.push(item as Exam)
				break
			case WorkExperience:
				this.workExperiences.push(item as WorkExperience)
				break
			default:
				console.error('Unknown type to add to module!')
		}
	}

	@Expose()
	get attempts(): { exams: number; workExperiences: number } {
		return {
			exams: this.exams.length,
			workExperiences: this.workExperiences.length
		}
	}

	get handbookModule() {
		return handbookManager.getEnrichedModuleByExamId(this.exams.first()?.id || -1)
	}

	@Expose()
	get factor(): number | undefined {
		return this.handbookModule?.factor
	}

	@Expose()
	get specialization(): string | undefined {
		return this.handbookModule?.specialization
	}
}
