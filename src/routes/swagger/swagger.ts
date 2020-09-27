import { Router } from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerStats from 'swagger-stats'

// setup router
const router = Router()

// load swagger config
import swaggerConfig from './swagger-config.json'

// set routes
router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig))
router.use(
	swaggerStats.getMiddleware({
		swaggerSpec: swaggerConfig,
		uriPath: '/stats'
	})
)

// export
export default router
