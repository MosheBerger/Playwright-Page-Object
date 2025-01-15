import { Locator, Page } from "playwright-core";
import { BasePage } from "./base/base.page";

class somePage extends BasePage {
    $ = {
        a: () => { return {} as Locator },
        table: this.is.Table('table', ['Person', 'Most interest in', 'Age'], { removeFooterRows: 1 })
    }


}

const some = new somePage({} as Page)
some.$.table