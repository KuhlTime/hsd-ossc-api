import { Router, Request, Response } from 'express'
import auth from 'basic-auth'
import OsscConnectionManager from '../../controllers/OsscConnectionManager'

// setup router
const router = Router()

// set routes
router.get('/', (req: Request, res: Response) => {
	const user = auth(req)

	console.log('Recived request /')

	if (user?.name && user?.pass) {
		OsscConnectionManager.requestGrades(user.name, user.pass)
			.then(data => res.send({ type: 'success', data: data }))
			.catch(err => res.status(500).send({ type: 'error', message: err.message }))
	} else {
		res.status(401).send({ message: 'Unauthorized or invalid.' })
	}
})

// export
export default router
