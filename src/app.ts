import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

// load router
import swaggerRouter from './routes/swagger/swagger'
import gradesRouter from './routes/grades/grades'

// create server
const app = express()

// setup middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

// use routers
app.use(swaggerRouter)
app.use(gradesRouter)

// setup routes
app.get('/', (req, res) => {
	console.log('Recived Request')
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
