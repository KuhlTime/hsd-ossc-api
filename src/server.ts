import colors from 'colors'
import app from './app'

// start server
const port = process.env.PORT || 3000

const server = app.listen(port, () => {
	console.log(colors.blue(`App is running at http://localhost:${port} in ${app.get('env')} mode`))
	console.log('Press CTRL-C to stop\n')
})

export default server
