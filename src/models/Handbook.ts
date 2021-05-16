export default interface Handbook {
	id: number
	version: string
	name: string
	relationships: Record<string, unknown>[]
	specializations: Specialization[]
	modules: Module[]
}

interface Specialization {
	id: string
	name: string
	factor: number
	'1:n': boolean
	requiredCreditPoints: number
}

interface Module {
	name: string
	id: number
	specialization: string
	specializationModuleNumber: number
	creditPoints: number
	lectures: number
	excercises: number
	internship: number
	seminar: number
	semesterNumber: number[]
	lecturer: string[]
}
