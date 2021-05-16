import colors from 'colors'
import app from './config/express'
import './config/firebase'
import HandbookManager from './controllers/HandbookManager'

import { port } from './config/env'

async function main() {
	// Get handbook from GitHub
	await HandbookManager.shared.request()

	// Start express server
	const server = app.listen(port, () => {
		console.log(colors.blue(`App is running at http://localhost:${port} in ${app.get('env')} mode`))
		console.log('Press CTRL-C to stop\n')
	})
}

main()
