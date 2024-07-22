import { test, expect } from '@playwright/test';
import { TableLocator } from '../src/explicitLocators';
import { mapArray } from '../src/utils';


test('table locator class', async ({ page }) => {

    await page.goto('http://172.18.192.1:5500/tests/test.html')

    const columnsNames = ['Person', 'Most interest in', 'Age'] as const
    const table = new TableLocator(page, 'table', columnsNames, { removeFooterRows: 1 })

    // console.log('table', table);
    

    // table.findRowByText ✅
    const row = await table.findRowByText('performance', 'Most interest in')
    console.log('findRowByText', await row?.textContent());


    // table.getListByColumn ✅
    const column = await table.getListByColumn('Age')
    const allTextContent = await mapArray(column, async (el) => await el.textContent())
    console.log('getListByColumn', allTextContent)


    // table.columnsCount ✅
    expect(table.columnsCount).toBe(3)


    // table.getRowByIndex ✅
    const rowByIndex = await table.getRowByIndex(2)
    console.log('rowByIndex', await rowByIndex.textContent());


    // table.columnsNames ✅
    expect(table.columnsNames).toEqual(columnsNames)


    console.log('FINISHED');
    // await page.waitForTimeout(30000)
})