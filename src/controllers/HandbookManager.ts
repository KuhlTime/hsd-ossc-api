import axios from 'axios'

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

		for (const degreeId of Object.keys(data)) {
			const newHandbook = {
				id: degreeId,
				...data[degreeId]
			} as Handbook

			this.handbooks.push(newHandbook)
		}

		console.log(`Downloaded Handbooks: ${this.handbooks.length}`)
	}
}
