import Semester from './Semester'

export default interface Exam {
	semester: Semester
	grade: number
	passed: boolean
	examinationDate: Date
}
