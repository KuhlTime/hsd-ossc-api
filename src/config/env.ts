import dotenv from 'dotenv'
import path from 'path'

dotenv.config({
	path: path.join(__dirname, '../../.env')
})

const env = process.env.NODE_ENV
const port = process.env.PORT
const logLevel = process.env.LOG_LEVEL || env === 'production' ? 'info' : 'debug'
const sentryDsn = process.env.SENTRY_DSN

if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
	Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('ascii')
} else {
	throw new Error('Could not find FIREBASE_SERVICE_ACCOUNT_BASE64 enviorment variable')
}

const firebaseServiceAccount = JSON.parse(
	Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('ascii')
)

export { env, port, logLevel, sentryDsn, firebaseServiceAccount }
