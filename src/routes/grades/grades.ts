import { Router, Request, Response } from 'express'
import auth from 'basic-auth'

// setup router
const router = Router()

// set routes
router.get('/grades', (req: Request, res: Response) => {
	const user = auth(req)
	res.send(user)
})

// export
export default router
