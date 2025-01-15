import type { Locator, Page } from "playwright-core";
import { BaseLocator } from "../base";
import type { LocatorOptions, TableColumnLocator, ExpLocatorType, TextToExplicitLocator, TupleToObj } from "../types";
import { convertor } from "../utils/convertor";


type TableLocatorOptions = LocatorOptions & {
    rowSelector?: string
    cellSelector?: string
    removeFooterRows?: number
}

type ColumnObject = TableColumnLocator<ExpLocatorType, string>[]
type ColumnNames<T extends ColumnObject> = { [k in keyof T]: T[k]['name'] }
type ColumnLocators<T extends ColumnObject> = { [k in keyof T]: TextToExplicitLocator<T[k]['locator']> }
type ColumnTextLocators<T extends ColumnObject> = { [k in keyof T]: T[k]['locator'] }


export class TableLocator<T extends ColumnObject> extends BaseLocator {


    public readonly columnsCount: number
    public readonly columnsNames: ColumnNames<T>
    public readonly columnsLocators: ColumnLocators<T>
    private readonly columnsTextLocators: ColumnTextLocators<T>

    private rowSelector = 'tr' // default selector for rows
    private cellSelector = '> *' // default selector for cells

    private rowLocator: Locator
    private cellLocator = (row: Locator) => row.locator(`${this.cellSelector}`)
    private footerRowsCount = 0


    constructor(
        page: Page,
        locator: Locator | string,
        columns: T,
        options?: TableLocatorOptions
    ) {
        super(page, locator, options)

        this.columnsNames = columns.map(c => c.name) as ColumnNames<T>
        this.columnsLocators = columns.map(c => c.locator) as ColumnLocators<T> 
        //TODO!👆 columnsLocators check for convertor
        this.columnsTextLocators = columns.map(c => c.locator) as ColumnTextLocators<T>
        this.columnsCount = columns.length

        if (options) {
            const { rowSelector, cellSelector, removeFooterRows } = options

            if (rowSelector) { this.rowSelector = rowSelector }
            if (cellSelector) { this.cellSelector = cellSelector }
            if (removeFooterRows) { this.footerRowsCount = removeFooterRows }
        }

        this.rowLocator = this.page.locator(this.rowSelector)
    }

    async getRowByIndex(index: number) {
        const rowLocator = this.rowLocator.nth(index)
        const rowAsObject =  this.rowToLocator(rowLocator)
        return rowAsObject
    }

    async findRowByText(text: string, inColumn: typeof this.columnsNames[number]) {

        const columnIndex = this.columnsNames.indexOf(inColumn)
        const allRows = await this.getAllRowsAsBasicLocators()
        
        // const row = await Promise.all(allRows.filter(
        //     async (row) => (await this.cellLocator(row).nth(columnIndex).innerText()).includes(text)
        // ))

        // return row[0]
        // TODO i'm here 
        for (const row of allRows) {
            const cellText = await this.cellLocator(row).nth(columnIndex).innerText()
            if (cellText.includes(text)) {
                return this.rowToLocator(row)
            }
        }
    }

    private async getAllRowsAsBasicLocators() {
        const allRows = await this.rowLocator.all()
        const allRowsWithoutFoot = this.removeFooterRows(allRows)
        return allRowsWithoutFoot
    }

    async getAllRows() {
        const allRows = await this.getAllRowsAsBasicLocators()
        const allRowsAsRowObjects = allRows.map(row => this.rowToLocator(row))
        return allRowsAsRowObjects
    }

    //TODO
    async getListByColumn(column: typeof this.columnsNames[number]) {
        const columnIndex = this.columnsNames.indexOf(column)

        const fullColumnLocators = this.page.locator(`${this.rowSelector} ${this.cellSelector}:nth-child(${columnIndex + 1})`)
        const list = await fullColumnLocators.all()

        return this.removeFooterRows(list)
    }

    private removeFooterRows<V>(allRows: V[]) {
        return allRows.slice(0, allRows.length - this.footerRowsCount)
    }


    private rowToLocator(row: Locator) {

        let rowObject = {} as Record<string, BaseLocator>

        for (let i = 0; i < this.columnsCount; i++) {

            const locator = this.cellLocator(row).nth(i)
            const key = this.columnsNames[i]
            const type = this.columnsTextLocators[i]
            rowObject[key] = convertor(this.page, locator,{type})
        }

        return rowObject as ReturnType<typeof TupleToObj<T>>
    }
}


// class TableRow<ColumnsNames extends string> extends BaseLocator {

//     constructor(page: Page, locator: Locator | string, columnsNames: readonly ColumnsNames[], columnsElements: elocatorss[], options?: TableLocatorOptions) {
//         super(page, locator, options as LocatorOptions)

// 
//     }
// }


// type cell = {
//     name: string
//     type: elocatorss
// }

// const a:cell = {
//     name: 'a',
//     type: 'ButtonLocator'
// }


// if (a.type === 'InputLocator' || a.type === 'ButtonLocator') {
//     const b = new elocators[a.type]({}as Page, '')
// }


