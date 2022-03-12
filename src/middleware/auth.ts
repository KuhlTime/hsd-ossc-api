import basicauth from 'basic-auth'
import { Response, NextFunction } from 'express'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const auth = (req: any, res: Response, next: NextFunction) => {
	const user = basicauth(req)

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

export default auth
