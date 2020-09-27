import { BasicAuthResult } from 'basic-auth'
import https from 'https'
import querystring from 'querystring'

export default class OsscConnectionManager {
	host = 'https://ossc.hs-duesseldorf.de/'
	path = 'qisserver/rds'

	private async authLogin(user: BasicAuthResult) {
		this.login(user.name, user.pass)
	}

	private async login(username: string, password: string): Promise<string> {
		return new Promise((resolve, reject) => {
			const body = {
				asdf: username,
				fdsa: password,
				submit: 'Anmelden'
			}

			const params = {
				state: 'user',
				type: 1,
				category: 'auth.login',
				startpage: 'portal.vm',
				breadCrumbSource: 'portal'
			}

			const requestOptions = {
				hostname: this.host,
				path: this.generatePath(params),
				method: 'POST'
			}

			const request = https.request(requestOptions, res => {
				/**
				 * Example Header
				 * Set-Cookie: JSESSIONID=6F1D9105EE3F280DF69CEEDFEDC10A97.ossc_a; Path=/qisserver; Secure; HttpOnly
				 */
				const setCookieHeader = res.headers['set-cookie']?.find(c => c.includes('JSESSIONID'))

				// TODO: Handle possible undefined state?! Or does it already get captured by request.on('error')
				const cookie = this.unwrap(setCookieHeader?.split(';')[0])
				resolve(cookie)
			})

			// On request error
			request.on('error', e => {
				console.error(e.message)
				reject(e)
			})

			// execute request
			request.write(querystring.stringify(body))
			request.end()
		})
	}

	private async requestAsi(cookie: string): Promise<string> {
		return new Promise((resolve, reject) => {
			const params = {
				state: '0',
				type: '0',
				category: 'menu.browser',
				startpage: 'portal.vm'
			}

			const requestOptions = {
				hostname: this.host,
				path: this.generatePath(params),
				method: 'GET'
			}

			// TODO: Check if I need to use axios `withCredentials: true`
			const request = https.request(requestOptions, res => {
				let body = ''

				res.on('data', chunk => {
					body += chunk
				})

				res.on('end', () => {
					const regex = new RegExp('(?<=asi=)(\\w|\\.|\\$)*')
					const asi = this.unwrap(body.match(regex)?.[0])

					resolve(asi)
				})
			})

			request.on('error', e => {
				console.error(e.message)
				reject(e)
			})

			// execute request
			request.end()
		})
	}

	/**
	 * Generates a string path using the passed query parameters
	 * @param query Object of query parameters
	 */
	private generatePath(query: querystring.ParsedUrlQueryInput): string {
		return this.path + '?' + querystring.stringify(query)
	}

	/**
	 * Unwraps an optional type.
	 * https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator
	 * @param obj The object that should be unwrapped
	 */
	private unwrap<T>(obj: T | undefined): T {
		if (obj) {
			return obj
		} else {
			throw new Error('Object is null or undefined')
		}
	}
}
