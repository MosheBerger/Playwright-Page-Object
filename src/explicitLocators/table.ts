import { BaseLocator } from "../base";
import { Locator, LocatorOptions, Page } from "../types";

type TableLocatorOptions = LocatorOptions & {
    rowSelector?: string
    cellSelector?: string
}

type getRowOptions =
    | {
        by: 'index'
        index: number
    }
    | {
        by: 'text'
        text: string
        ColumnIndex: number
    }



export class TableLocator extends BaseLocator {

    columns: number
    private rowSelector = 'tr' // default selector for rows
    private cellSelector = 'td' // default selector for cells

    constructor(page: Page, locator: Locator | string, columns: number, options?: TableLocator) {
        super(page, locator, options as LocatorOptions)
        this.columns = columns

        if (options) {
            const { rowSelector, cellSelector } = options

            if (rowSelector) this.rowSelector = rowSelector
            if (cellSelector) this.cellSelector = cellSelector
        }
    }

    private rowLocator = this.page.locator(this.rowSelector)
    private cellLocator = (row: Locator) => row.locator(this.cellSelector)

    async getRow(how: getRowOptions) {


        if (how.by === 'index') {
            return this.rowLocator.nth(how.index)
        }

        else {
            const allRows = await this.getAllRows()

            return allRows.filter(async (row) => (
                await this.cellLocator(row).nth(how.ColumnIndex).innerText()).includes(how.text)
            )[0]
        }
    }

    async getAllRows() {
        return await this.rowLocator.all()
    }
}


class TableRow extends BaseLocator {    }