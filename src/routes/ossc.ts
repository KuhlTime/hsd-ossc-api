import { Router, Request, Response } from 'express'
import auth from 'basic-auth'
import OsscSession from '../controllers/OsscSession'

import exampleResponse from './example.json'

// setup router
const router = Router()

// set routes
router.get('/', (req: Request, res: Response) => {
	const user = auth(req)

	// TODO: Handle unauthorized
	if (user?.name && user?.pass) {
		OsscSession.requestGrades(user.name, user.pass)
			.then(data => res.send({ type: 'success', data: data }))
			.catch(err => res.status(500).send({ type: 'error', message: err.message }))
	} else {
		res.status(401).send({
			type: 'error',
			message: 'Could not extract username and password.',
			tip: 'Set the authorization header as described in the README'
		})
	}
})

router.get('/test', (req: Request, res: Response) => {
	res.send(exampleResponse)
})

// export
export default router
