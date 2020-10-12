import { Table } from '../utilities/TableParser'
import moment from 'moment'

export default class Stundent {
	name: string
	registration: number
	birthday: Date | undefined
	cityOfBirth: string | undefined
	degree: string
	faculty: string
	address: string

	constructor(table: Table) {
		const row = table.rows[0]

		this.name = row['Name des Studierenden']
		this.registration = parseInt(row['Matrikelnummer'])
		this.birthday = moment(row['Geburtsdatum und -ort'].match(/\d+.\d+.\d+/)?.[0], 'DD.MM.YYYY')
			.utc()
			.toDate()
		this.cityOfBirth = row['Geburtsdatum und -ort'].match(/(?<=in )\w+/)?.[0]
		this.degree = row['(angestrebter) Abschluss']
		this.faculty = row['Fach']
		this.address = row['Anschrift']
	}
}
