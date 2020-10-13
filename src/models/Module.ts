import { WorkExperience, Exam } from '.'
import { Expose } from 'class-transformer'

export default class Module {
	id: number
	name: string
	passed: boolean
	creditPoints: number
	exams: Exam[] = []
	workExperiences: WorkExperience[] = []
	grade: number | undefined

	constructor(row: Record<string, string>) {
		this.id = parseInt(row['PNr.'])
		this.name = row['Prüfung']
		this.passed = row['Status'] === 'bestanden'
		this.creditPoints = parseInt(row['Bonus'])

		const grade = parseFloat(row['Note'])
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
}
