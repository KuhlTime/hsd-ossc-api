// NOTE: 👻 Checkout proxy rotation
// NOTE: Checkout APIFY - https://docs.apify.com/web-scraping-101/anti-scraping-techniques#ip-address-based-blocking
// TODO: Cleanup request and make them more reusable
// TODO: Capture degree, regulation, topic in object
// TODO: Add more comments

import https from 'https'
import { URL } from 'url'
import { IncomingMessage } from 'http'
import querystring from 'querystring'
import { TableParser, Table } from '../utilities/TableParser'
import { ModuleExtract, Student, Score } from '../models'
import colors from 'colors'
import { classToPlain } from 'class-transformer'
import { storeScore, fetchScoresForModule } from '../config/firebase'

/**
 * An `OSSCSession` is used to handle the connection to the OSSC website.
 * In different methods relevant data gets extracted.
 */
export default class OsscSession {
	static host = 'ossc.hs-duesseldorf.de'
	static path = '/qisserver/rds'

	/**
	 * Given valid username and password the function returns the authentication cookie.
	 * @param username The username registerd inside the OSSC
	 * @param password The password used to log into the account
	 */
	private static async getCookie(username: string, password: string): Promise<string> {
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
				method: 'POST',
				port: 443,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
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

			// on request error
			request.on('error', e => {
				reject(e)
			})

			// execute request
			request.write(querystring.stringify(body))
			request.end()
		})
	}

	/**
	 * Get a required value called asi. Most likly this is some server parameter.
	 */
	private static async getAsi(cookie: string): Promise<string> {
		return new Promise((resolve, reject) => {
			const params = {
				state: 'user',
				type: '0',
				category: 'menu.browse',
				startpage: 'portal.vm'
			}

			const requestOptions = this.generateGetRequestOptions(cookie, params)

			// TODO: Check if I need to use axios `withCredentials: true`
			const request = https.request(requestOptions, res => {
				this.getBody(res).then(body => {
					const regex = new RegExp('(?<=asi=)(\\w|\\.|\\$)*')
					const asi = this.unwrap(body.match(regex)?.[0])

					resolve(asi)
				})
			})

			// on request error
			request.on('error', e => {
				console.error(e.message)
				reject(e)
			})

			// execute request
			request.end()
		})
	}

	// TODO: Return Degree Name
	/**
	 * In order to access the grades webpage the degree id is required.
	 */
	private static async getDegreeId(cookie: string, asi: string): Promise<string> {
		return new Promise((resolve, reject) => {
			const params = {
				state: 'notenspiegelStudent',
				next: 'tree.vm',
				nextdir: 'qispos/notenspiegel/student',
				menuid: 'notenspiegelStudent',
				breadcrumb: 'notenspiegel',
				breadCrumbSource: 'menu',
				asi: asi
			}

			const requestOptions = this.generateGetRequestOptions(cookie, params)

			const request = https.request(requestOptions, res => {
				this.getBody(res).then(body => {
					const regex = new RegExp('(?<=Abschluss )(\\d+)')

					// TODO: Handle mutliple degress
					const degreeId = this.unwrap(body.match(regex)?.[0])
					resolve(degreeId)
				})
			})

			// on request error
			request.on('error', e => {
				console.error(e.message)
				reject(e)
			})

			// execute request
			request.end()
		})
	}

	/**
	 * Recieve the Regulation ID and the Topic ID
	 */
	private static async getRegulationAndTopicId(
		cookie: string,
		asi: string,
		degreeId: string
	): Promise<{ regulationId: string; topicId: string }> {
		return new Promise((resolve, reject) => {
			const params = {
				state: 'notenspiegelStudent',
				struct: 'auswahlBaum',
				navigation: 'Y',
				next: 'tree.vm',
				nextdir: 'qispos/notenspiegel/student',
				nodeID: `auswahlBaum|abschluss:abschl=${degreeId}`,
				expand: 0,
				menuid: 'notenspiegelStudent',
				breadcrumb: 'notenspiegel',
				breadCrumbSource: 'menu',
				asi: asi
			}

			const requestOptions = this.generateGetRequestOptions(cookie, params)

			const request = https.request(requestOptions, res => {
				this.getBody(res).then(body => {
					const topicRegex = new RegExp('(?<=stg%3D)(\\d+)')
					const regulationRegex = new RegExp('(?<=pversion%3D)(\\d+)')

					// TODO: Handle mutliple degress
					const topcId = this.unwrap(body.match(topicRegex)?.[0])
					const regulationId = this.unwrap(body.match(regulationRegex)?.[0])

					resolve({ topicId: topcId, regulationId: regulationId })
				})
			})

			// on request error
			request.on('error', e => {
				console.error(e.message)
				reject(e)
			})

			// execute request
			request.end()
		})
	}

	/**
	 * Get the students grade page providing the information recieved beforehand.
	 * @returns Returns an array of `Table`s. One table for each <table> html element that was found on the page.
	 */
	private static async getGrades(
		cookie: string,
		asi: string,
		degree: string,
		topic: string,
		regulation: string
	): Promise<Table[]> {
		return new Promise((resolve, reject) => {
			const params = {
				state: 'notenspiegelStudent',
				next: 'list.vm',
				nextdir: 'qispos/notenspiegel/student',
				createInfos: 'Y',
				struct: 'auswahlBaum',
				nodeID: `auswahlBaum|abschluss:abschl=${degree}|studiengang:stg=${topic},pversion=${regulation}`,
				asi
			}

			const requestOptions = this.generateGetRequestOptions(cookie, params)

			const request = https.request(requestOptions, res => {
				this.getBody(res).then(body => {
					const tables = TableParser.parse(body)
					resolve(tables)
				})
			})

			// on request error
			request.on('error', e => {
				console.error(e.message)
				reject(e)
			})

			// execute request
			request.end()
		})
	}

	/**
	 * Scrape a single exam score page.
	 * @param url The url of the exam.
	 * @param cookie The session cookie.
	 * @returns Returns a `Score` object.
	 */
	private static async getScore(url: URL, cookie: string): Promise<Score> {
		return new Promise((resolve, reject) => {
			const requestOptions = {
				hostname: this.host,
				path: this.path + url.search,
				method: 'GET',
				headers: {
					Cookie: cookie
				}
			}

			const request = https.request(requestOptions, res => {
				this.getBody(res).then(body => {
					const score = new Score(body)
					resolve(score)
				})
			})

			// on request error
			request.on('error', e => {
				console.error(e.message)
				reject(e)
			})

			// execute request
			request.end()
		})
	}

	/**
	 * Logs out the user and invalidates the session cookie.
	 * @param cookie
	 */
	private static logout(cookie: string) {
		return new Promise<void>((resolve, reject) => {
			const params = {
				state: 'user',
				type: '4',
				category: 'auth.logout',
				menuid: 'logout'
			}

			const requestOptions = this.generateGetRequestOptions(cookie, params)
			const request = https.request(requestOptions, _ => {
				resolve()
			})

			// on request error
			request.on('error', e => {
				console.error(e.message)
				reject(e)
			})

			// execute request
			request.end()
		})
	}

	/**
	 * This handles each exam page inside the `ModuleExtract`.
	 * Each `Score` gets scraped and then uploaded to firebase.
	 * If the particular `Score` has already been uploaded to firebase
	 * it gets sckipped.
	 * @param extract
	 * @param cookie The session cookie.
	 */
	private static async getAllScores(extract: ModuleExtract, cookie: string) {
		for (const module of extract.modules) {
			// Tries to find the scores inside the firebase db
			await fetchScoresForModule(module)

			for (const exam of module.exams) {
				// If there are any scores that have not been stored on firebase,
				// crawl them and store them to firebase.
				if (exam.score === undefined && exam.scoreLink !== undefined && cookie !== undefined) {
					console.log(`No score found for ${module.name} on the ${exam.examinationDate?.toDateString()}`)
					exam.score = await this.getScore(exam.scoreLink, cookie)
					storeScore(exam.score)
				}
			}
		}
	}

	/**
	 * Returns the final JSON object containing all the scraped information
	 * for the logged in user.
	 * @param username The username of the student.
	 * @param password The password of the student.
	 * @returns The scraped information in form of a JSON object.
	 */
	public static async requestGrades(username: string, password: string): Promise<Record<string, unknown>> {
		const start = Date.now()
		let cookie: string | undefined

		try {
			cookie = await this.getCookie(username, password)
			this.userLog(username, 'Recived Cookie')

			const asi = await this.getAsi(cookie)
			this.userLog(username, 'Recieved ASI')

			const degreeId = await this.getDegreeId(cookie, asi)
			this.userLog(username, 'Recived Degree ID')

			const a = await this.getRegulationAndTopicId(cookie, asi, degreeId)
			this.userLog(username, 'Recieved Regulation and Topic ID')

			const tables = await this.getGrades(cookie, asi, degreeId, a.topicId, a.regulationId)

			const student = new Student(tables[0])
			const extract = new ModuleExtract(tables[1])
			this.userLog(username, 'Recieved and Parsed Results')

			await this.getAllScores(extract, cookie)

			const duration = Date.now() - start
			// this.userLog(username, 'Request duration: ' + duration + 'ms')

			this.logout(cookie).then(() => {
				this.userLog(username, 'Logged Out')
			})

			const response = classToPlain({
				duration,
				student,
				totalCreditPoints: extract.totalCreditPoints,
				avgGrade: extract.avgGrade,
				modules: extract.modules
			})

			// Response data
			return Promise.resolve(response)
		} catch (e) {
			// In case the user has already been logged in when the error occurred. -> Logout
			if (cookie) {
				this.logout(cookie).then(() => {
					this.userLog(username, 'Logged Out')
				})
			}

			console.error(e)
			this.userErrorLog(username, e)

			return Promise.reject(e)
		}
	}

	/**
	 * Generates a string path using the passed query parameters
	 * @param query Object of query parameters
	 */
	private static generatePath(query: querystring.ParsedUrlQueryInput): string {
		return this.path + '?' + querystring.stringify(query)
	}

	/**
	 * Generates all the options that are needed to make an http GET request to the server
	 * @param cookie To authenticate a valid JSESSIONID Cookie has to be provided
	 * @param params The query parameters that should be set on the url
	 */
	private static generateGetRequestOptions(cookie: string, params: querystring.ParsedUrlQueryInput) {
		return {
			hostname: this.host,
			path: this.generatePath(params),
			method: 'GET',
			headers: {
				Cookie: cookie
			}
		}
	}

	/**
	 * Unwraps an optional type.
	 * https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator
	 * @param obj The object that should be unwrapped
	 */
	private static unwrap<T>(obj: T | undefined): T {
		if (obj) {
			return obj
		} else {
			throw new Error('Object is null or undefined')
		}
	}

	/**
	 * A asynchronous function that gets resolved once the body of the provided
	 * request has been completly transmitted.
	 * @param res The response object which the body should be recieved from.
	 * @returns The response body.
	 */
	private static getBody(res: IncomingMessage): Promise<string> {
		return new Promise((resolve, _) => {
			let body = ''

			res.setEncoding('utf8')

			res.on('data', chunk => {
				body += chunk
			})

			res.on('end', () => {
				resolve(body)
			})
		})
	}

	/**
	 * Helper function to log a message for a particular user.
	 */
	private static userLog(user: string, message: string) {
		console.log(colors.blue(`[${user}]`) + ': ' + message)
	}

	/**
	 * Helper function to log an error message for a particular user.
	 */
	private static userErrorLog(user: string, error: Error) {
		console.error(colors.red(`[${user}]`) + ': ' + colors.bgRed(error.message))
	}
}
