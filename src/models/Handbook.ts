export default class Handbook {
	id: number
	version: string
	name: string
	relationships: Record<string, unknown>[]
	specializations: Specialization[]
	modules: Module[]

	constructor(
		id: number,
		version: string,
		name: string,
		relationships: Record<string, unknown>[],
		specilaizations: Specialization[],
		modules: Module[]
	) {
		this.id = id
		this.version = version
		this.name = name
		this.relationships = relationships
		this.specializations = specilaizations
		this.modules = modules
	}
}

class Specialization {
	id: string
	name: string
	factor: number
	'1:n': boolean
	requiredCreditPoints: number

	constructor(id: string, name: string, factor: number, oneToN: boolean, requiredCreditPoints: number) {
		this.id = id
		this.name = name
		this.factor = factor
		this['1:n'] = oneToN
		this.requiredCreditPoints = requiredCreditPoints
	}
}

class Module {
	name: string

	/**
	 * THIS IS THE EXAM ID, NOT THE MODULE ID
	 */
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

	constructor(
		name: string,
		id: number,
		specialization: string,
		specializationModuleNumber: number,
		creditPoints: number,
		lectures: number,
		excercises: number,
		internship: number,
		seminar: number,
		semesterNumber: number[],
		lecturer: string[]
	) {
		this.name = name
		this.id = id
		this.specialization = specialization
		this.specializationModuleNumber = specializationModuleNumber
		this.creditPoints = creditPoints
		this.lectures = lectures
		this.excercises = excercises
		this.internship = internship
		this.seminar = seminar
		this.semesterNumber = semesterNumber
		this.lecturer = lecturer
	}
}
