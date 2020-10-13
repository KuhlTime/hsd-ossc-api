import LogRocket from 'logrocket'
import colors from 'colors'
import * as Sentry from '@sentry/node'

import { logRocketKey, sentryDsn } from './env'

// Instantiate LogRocket
if (logRocketKey) {
	LogRocket.init(logRocketKey)
	console.info(colors.green('[LogRocket] ') + 'Enabled')

	if (sentryDsn) {
		LogRocket.getSessionURL(sessionURL => {
			Sentry.configureScope(scope => {
				scope.setExtra('sessionURL', sessionURL)
				console.info(colors.green('[LogRocket + Sentry] ') + 'Enabled')
			})
		})
	}
}
