import * as admin from 'firebase-admin'
import { firebaseServiceAccount } from './env'
import { Module, Score } from '../models'
import { plainToClass, classToPlain } from 'class-transformer'

const app = admin.initializeApp({
	credential: admin.credential.cert(firebaseServiceAccount),
	databaseURL: 'https://node-ossc-1.firebaseio.com'
} as admin.AppOptions)

const db = app.firestore()
const scoresDB = db.collection('scores')

async function fetchScoresForModule(module: Module) {
	for (let i = 0; i < module.exams.length; i++) {
		const exam = module.exams[i]
		const semester = exam.semester

		// FIXME: Using the module id + 1
		const snapshot = await scoresDB
			.where('id', '==', module.id)
			.where('semester.winter', '==', semester.winter)
			.where('semester.year', '==', semester.year)
			.get()

		const doc = snapshot.docs[0]

		if (doc !== undefined) {
			const score = doc.data() as Score

			// Convert firebase timestamp to js date format
			score.examinationDate = doc.data().examinationDate.toDate()
			score.updated = doc.data().updated.toDate()

			exam.score = score
		}
	}
}

async function storeScore(score: Score) {
	// TODO: Override if allready available
	const snapshot = await scoresDB
		.where('id', '==', score.id)
		.where('semester.winter', '==', score.semester.winter)
		.where('semester.year', '==', score.semester.year)
		.get()

	if (snapshot.docs.length > 1) {
		console.error('Found multiple entries for score: ' + score.name + ' ' + score.semester)
	} else if (snapshot.docs.length === 1) {
		const doc = snapshot.docs[0]
		doc.ref.update(classToPlain(score))
		console.log('Update score in firebase')
	} else {
		// There is no need to wait for the document to be stored
		scoresDB.add(classToPlain(score))
		console.log('Stored a new score to firebase')
	}
}

export { db, fetchScoresForModule, storeScore }
