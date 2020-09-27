export default class ExamScore {
	grades: GradeInfo[]
	avarage: number

	constructor(grades: GradeInfo[], avarage: number) {
		this.grades = grades
		this.avarage = avarage
	}

	attendes(): number {
		return this.grades.map((x) => x.count).reduce((a, b) => a + b)
	}
}

interface GradeInfo {
	range: Range
	count: number
}
