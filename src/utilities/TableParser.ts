import cheerio from 'cheerio'
import '../@types/ArrayExtensions'
import '../@types/StringExtensions'

/**
 * A `Table` is a simple object that stores information in an array of rows.
 * Each row consists of an object where the key is the header of each coloumn.
 */
class Table {
	/**
	 * An array of header names.
	 */
	headers: Array<string> = []

	/**
	 * An array of rows. Each row being represented by a js object
	 * where the key is the refereing coloumn name and the value is
	 * a `TableCell`
	 */
	rows: Array<Record<string, TableCell>> = []

	/**
	 * Links are only supported for vertical tables for now.
	 */
	links: Array<Record<string, string | undefined>> = []

	length(): number {
		return this.rows.length
	}
}

/**
 * Because the HTML Table maybe includes an url to the exams
 * detail page. The value as well as the link get stored inside
 * a `TableCell` object.
 */
class TableCell {
	/**
	 * The value of the particular cell.
	 */
	value: string

	/**
	 * A url to a subpage, if provided inside the HTML cell.
	 */
	link: string | undefined

	constructor(value: string, link: string | undefined) {
		this.value = value
		this.link = link
	}
}

/**
 * A HTML <table></table> Parser
 */
class TableParser {
	/**
	 * Parses a HTML string into an array of tables
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
				const rowData: Record<string, TableCell> = {}

				// when both th and td are in the same row it can be assumed the table is horizontal
				if ($headerCells.length !== 0 && $cells.length !== 0) {
					/**
					 * HORIZONTALLY alligned tables
					 * where the table head is in the same row as the value
					 */
					const key: string = tableData.headers.last() || ''
					const value: string = $cells.first().text().clean()

					const href = $cells.first().find('a').attr('href')

					rowData[key] = new TableCell(value, href)

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

						const href = $(cell).find('a').attr('href')

						rowData[key] = new TableCell(value, href)
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
				tableData.rows = [tableData.rows.merge() as Record<string, TableCell>]
			}

			tables.push(tableData)
		})

		return tables
	}
}

export { TableParser, TableCell, Table }
