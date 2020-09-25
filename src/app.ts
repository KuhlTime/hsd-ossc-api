import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import swagger from './routes/swagger'

// create server
const app = express()

// setup middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(swagger)

// setup routes
app.get('/', (req, res) => {
	console.log('Recived Request')
	res.send({ message: 'Hello World!' })
})

export default app
