import * as dotenv from 'dotenv-safe'
import path from 'path'

dotenv.config({
	path: path.join(__dirname, '../../.env'),
	sample: path.join(__dirname, '../../.env.example')
})

const env = process.env.NODE_ENV
const port = process.env.PORT
const logLevel = process.env.LOG_LEVEL || env === 'production' ? 'info' : 'debug'
const morganFormat = env === 'production' ? 'short' : 'dev'
const sentryDsn = process.env.SENTRY_DSN
const logRocketKey = process.env.LOG_ROCKET_KEY

export { env, port, logLevel, sentryDsn, morganFormat, logRocketKey }
