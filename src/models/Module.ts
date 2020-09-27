import Exam from './Exam'
import WorkExperience from './WorkExperience'

export default interface Module {
	id: number
	name: string
	passed: boolean
	creditPoints: number
	exams: Exam[]
	workExperiences: WorkExperience[]
}
