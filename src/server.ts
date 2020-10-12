import colors from 'colors'
import app from './config/express'

import { port, env } from './config/env'

// start the server

const server = app.listen(port, () => {
	console.log(colors.blue(`App is running at http://localhost:${port} in ${app.get('env')} mode`))
	console.log('Press CTRL-C to stop\n')
})

export default server
