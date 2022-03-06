import { Router, Request, Response } from 'express'
import OsscSession from '../controllers/OsscSession'

import exampleResponse from './example.json'
import authGuard from '../middleware/authGuard'

// setup router
const router = Router()

// set routes
router.get('/', authGuard, (req: any, res: Response) => {
	OsscSession.requestGrades(req.user.name, req.user.pass)
		.then(data => res.send({ type: 'success', data: data }))
		.catch(err => res.status(500).send({ type: 'error', message: err.message }))
})

router.get('/avg', authGuard, (req: any, res: Response) => {
	OsscSession.requestGrades(req.user.name, req.user.pass)
		.then(data => res.status(200).send('' + data.avgGrade))
		.catch(err => res.status(500).send({ type: 'error', message: err.message }))
})

router.get('/test', (req: Request, res: Response) => {
	res.send(exampleResponse)
})

// export
export default router
