import auth from 'basic-auth'
import { Request, Response, NextFunction } from 'express'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const authGuard = (req: any, res: Response, next: NextFunction) => {
	const user = auth(req)

	if (user) {
		req.user = user
		next()
	} else {
		res.status(401).send({
			type: 'error',
			message: 'Could not extract username and password.',
			tip: 'Set the authorization header as described in the README'
		})
	}
}

export default authGuard
