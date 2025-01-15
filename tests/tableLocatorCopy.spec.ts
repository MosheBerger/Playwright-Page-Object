import { test, expect, Locator } from '@playwright/test';
import { ButtonLocator, InputLocator, TableLocator, TextContainerLocator } from '../src/explicitLocators';
import { mapArray } from '../src/utils';


test('table locator class', async ({ page }) => {

    await page.goto('http://172.18.192.1:5500/tests/test.html')

    // const columnsNames = ['Person', 'Most interest in', 'Age'] as const
    const table = new TableLocator(
        page,
        'table',
        [
            { name: 'a', locator: 'Button' },
            { name: 'b', locator: 'Link' },
            { name: 'c', locator: 'Input' },
            { name: 'mashu', locator: 'TextContainer' }
        ] as const,
    )
    // console.log('table', table);


    const za = table.columnsNames
    //         ^?
    const zb = table.columnsLocators
    //         ^?
    const zc = await table.getAllRows()
    //      ^?
    // table.findRowByText ✅
    const row = await table.findRowByText('performance', 'a')
    console.log('findRowByText', await row?.mashu.innerText());



    // table.getListByColumn ✅
    const column = await table.getListByColumn('a')
    const allTextContent = await mapArray(column, async (el) => await el.textContent())
    console.log('getListByColumn', allTextContent)


    // table.columnsCount ✅
    expect(table.columnsCount).toBe(3)


    // table.getRowByIndex ✅
    const rowByIndex = await table.getRowByIndex(2)
    console.log('rowByIndex', await rowByIndex.mashu.innerText());


    // table.columnsNames ✅
    // expect(table.columnsNames).toEqual(columnsNames)


    console.log('FINISHED');
    // await page.waitForTimeout(30000)
})