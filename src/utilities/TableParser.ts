import cheerio from 'cheerio'
import '../@types/ArrayExtensions'
import '../@types/StringExtensions'

class Table {
	headers: Array<string> = []
	rows: Array<Record<string, string>> = []

	length(): number {
		return this.rows.length
	}
}

class TableParser {
	/**
	 * Parses a html string into an array of tables
	 * @param body Uses the complete html string as input
	 */
	public static parse(body: string) {
		const $ = cheerio.load(body)
		const $tables = $('table')

		// console.log('Found: ' + $tables.length + ' tables')

		/**
		 * The array of table data objects that get returned by the function
		 */
		const tables: Array<Table> = []

		$tables.each((_, table) => {
			/**
			 * All the data that is returned for each individual table
			 */
			const tableData = new Table()

			const $rows = $(table).find('tr')

			let isHorizontal = false

			$rows.each((_, row) => {
				const $row = $(row)

				const $headerCells = $row.find('th').each((_, header) => {
					tableData.headers.push($(header).text().clean())
				})

				const $cells = $row.find('td')

				/**
				 * An object with each value assigned to its header key
				 */
				const rowData: Record<string, string> = {}

				// when both th and td are in the same row it can be assumed the table is horizontal
				if ($headerCells.length !== 0 && $cells.length !== 0) {
					/**
					 * HORIZONTALLY alligned tables
					 * where the table head is in the same row as the value
					 */
					const key: string = tableData.headers.last() || ''
					rowData[key] = $cells.first().text().clean()

					isHorizontal = true
				} else if ($headerCells.length === 0) {
					/**
					 * VERTICALLY alligned table
					 * where the table head is at the top and the content follows in the rows below
					 * normal table
					 */
					$cells.each((i, cell) => {
						const key: string = tableData.headers[i]
						const value = $(cell).text().clean()

						rowData[key] = value
					})
				} else if ($headerCells.length !== 0) {
				} else {
					/**
					 * Unsupported table format
					 */
					// console.log('Unsupported Row Format: ' + $row.text())
					throw Error('Detected unsupported Row Format')
				}

				// Only append row if there is actually a content to be added
				if ($cells.length !== 0) {
					tableData.rows.push(rowData)
				}
			})

			if (isHorizontal) {
				tableData.rows = [tableData.rows.merge() as Record<string, string>]
			}

			tables.push(tableData)
		})

		return tables
	}
}

export { TableParser, Table }
