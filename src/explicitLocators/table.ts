import { BaseLocator } from "../base";
import { Locator, LocatorOptions, Page } from "../types";

type TableLocatorOptions = LocatorOptions & {
    rowSelector?: string
    cellSelector?: string
    removeFooterRows?: number
}


export class TableLocator<ColumnsNames extends string> extends BaseLocator {

    public readonly columnsCount: number
    public readonly columnsNames: readonly ColumnsNames[]

    private rowSelector = 'tr' // default selector for rows
    private cellSelector = '*' // default selector for cells

    private rowLocator: Locator
    private cellLocator = (row: Locator) => row.locator(` > ${this.cellSelector}`)
    private footerRowsCount = 0


    constructor(page: Page, locator: Locator | string, columnsNames: readonly ColumnsNames[], options?: TableLocatorOptions) {
        super(page, locator, options as LocatorOptions)

        this.columnsNames = columnsNames
        this.columnsCount = columnsNames.length

        if (options) {
            const { rowSelector, cellSelector, removeFooterRows } = options

            if (rowSelector) { this.rowSelector = rowSelector }
            if (cellSelector) { this.cellSelector = cellSelector }
            if (removeFooterRows) { this.footerRowsCount = removeFooterRows }
        }

        this.rowLocator = this.page.locator(this.rowSelector)
    }

    async getRowByIndex(index: number) {
        return this.rowLocator.nth(index)
    }

    async findRowByText(text: string, inColumn: ColumnsNames) {

        const columnIndex = this.columnsNames.indexOf(inColumn)
        const allRows = await this.getAllRows()

        // const row = await Promise.all(allRows.filter(
        //     async (row) => (await this.cellLocator(row).nth(columnIndex).innerText()).includes(text)
        // ))

        // return row[0]

        for (const row of allRows) {
            const cellText = await this.cellLocator(row).nth(columnIndex).innerText()
            if (cellText.includes(text)) {
                return row
            }
        }
    }

    async getAllRows() {
        const allRows = await this.rowLocator.all()
        const allRowsWithoutFoot = this.removeFooterRows(allRows)
        return allRowsWithoutFoot
    }

    a() {
        type a1 = Record<ColumnsNames, string>
        const a = {} as a1

        for (const column of this.columnsNames) {
            a[column] = '1'
        }

        return a
    }

    async getListByColumn(column: ColumnsNames) {
        const columnIndex = this.columnsNames.indexOf(column)

        const fullColumnLocators = this.page.locator(`${this.rowSelector} ${this.cellSelector}:nth-child(${columnIndex + 1})`)
        const list = await fullColumnLocators.all()

        return this.removeFooterRows(list)
    }

    private async removeFooterRows<V>(allRows: V[]) {
        return allRows.slice(0, allRows.length - this.footerRowsCount)
    }
}


// class TableRow extends BaseLocator { }