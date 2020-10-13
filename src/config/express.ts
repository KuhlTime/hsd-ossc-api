import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'

import { sentryDsn } from './env'

import './logrocket'

import { morganFormat } from './env'

// load router
import swaggerRouter from '../routes/swagger/swagger'
import osscRouter from '../routes/ossc'

// create server
const app = express()

Sentry.init({
	dsn: sentryDsn,
	integrations: [
		// enable HTTP calls tracing
		new Sentry.Integrations.Http({ tracing: true }),
		// enable Express.js middleware tracing
		new Tracing.Integrations.Express({ app })
	],

	// We recommend adjusting this value in production, or using tracesSampler
	// for finer control
	tracesSampleRate: 1.0
})

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler())
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler())

// setup middlewares
app.use(express.json())
app.use(cors())
app.use(morgan(morganFormat))

// use routers
app.use(swaggerRouter)
app.use('/ossc', osscRouter)

// setup routes
app.get('/info', (req, res) => {
	res.send({
		author: 'André Kuhlmann',
		contact: 'akuhltime@gmail.com',
		website: 'https://kuhlti.me',
		twitter: 'https://twitter.com/kuhltime',
		github: 'https://github.com/kuhltime',
		terms: 'Visit http://localhost:3000/terms for the terms of usage'
	})
})

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler())

// Optional fallthrough error handler
app.use((err, req, res, next) => {
	// The error id is attached to `res.sentry` to be returned
	// and optionally displayed to the user for support.
	res.statusCode = 500
	res.end(res.sentry + '\n')
})

export default app
