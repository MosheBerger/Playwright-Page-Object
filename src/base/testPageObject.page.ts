import { Locator, Page } from "playwright-core";
import { BasePage } from "./base.page";

class somePage extends BasePage {
    $ ={
        a: {} as Locator
    }


}

const some = new somePage({} as Page)
some.$.a