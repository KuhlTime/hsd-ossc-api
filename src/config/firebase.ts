import * as admin from 'firebase-admin'
import { firebaseServiceAccount } from './env'

const app = admin.initializeApp({
	credentials: admin.credential.cert(firebaseServiceAccount),
	databaseURL: 'https://node-ossc-1.firebaseio.com'
} as admin.AppOptions)

const db = app.firestore()
const scoresDB = db.collection('scores')

export { db }
