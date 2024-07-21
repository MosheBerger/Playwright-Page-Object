import { BaseLocator } from "../base/base.locator";
import { Locator } from "../types";


export class TypographyLocator extends BaseLocator {
    innerText: Locator['innerText'] = this.$.innerText.bind(this.$)
}