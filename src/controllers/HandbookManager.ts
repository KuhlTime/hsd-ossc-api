import axios from 'axios'
import { plainToClass } from 'class-transformer'

import { Handbook } from '../models'

export default class HandbookManager {
	private static URL = 'https://raw.githack.com/KuhlTime/hsd-handbook-extractor/main/db.json'

	public static shared = new HandbookManager()

	handbooks: Handbook[] = []

	/**
	 * This function can be run when creating a new HandbookManager.
	 * Execute this function at least once to make sure the handbooks are downloaded.
	 */
	async request() {
		const res = await axios.get(HandbookManager.URL)

		if (res.status !== 200) {
			throw new Error(`None 200 Status Code. Unable to fetch handbooks from: ${HandbookManager.URL}!`)
		}

		const data = res.data
		this.handbooks = plainToClass(Handbook, data)

		console.log(`Downloaded Handbooks: ${this.handbooks.length}`)
	}

	/**
	 * Returns an array of all modules from all handbooks.
	 */
	get allModules() {
		return this.handbooks.flatMap(h => h.modules)
	}

	/**
	 * Returns information about a particular module for a given exam id.
	 */
	getModuleByExamId(id: number | string) {
		const _id = String(id)
		return this.allModules.find(m => String(m.id) === _id)
	}
}
