import { Router, Request, Response } from 'express'
import { getAllData } from '../config/firebase'

// setup router
const router = Router()

// set routes
router.get('/', async (req: Request, res: Response) => {
	res.json(await getAllData())
})

// export
export default router
