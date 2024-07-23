import { test, expect } from '@playwright/test';
import { TableLocator } from '../src/explicitLocators/table';

test('table class', async ({ page }) => {

  await page.goto('http://192.168.17.161:5500/tests/test.html')

  const table = new TableLocator(page, 'table', ['Person', 'Most interest in', 'Age'], { removeFooterRows: 1 })

  // console.log('table', table);
  

  // table.findRowByText
  const row = await table.findRowByText('HTML', 'Most interest in')
  console.log('row', await row?.textContent());
  
  // table.getListByColumn ✅
  console.log('col',await table.getListByColumn('Age'))
  expect(table.columnsCount).toBe(3)

  
  console.log('FINISHED');
  await page.waitForTimeout(30000)
})