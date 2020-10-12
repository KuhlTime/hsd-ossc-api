import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'

import { morganFormat } from './env'

// load router
import swaggerRouter from '../routes/swagger/swagger'
import osscRouter from '../routes/ossc'

// create server
const app = express()

// setup middlewares
app.use(express.json())
app.use(cors())
app.use(helmet())
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

export default app
