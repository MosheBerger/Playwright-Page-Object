import { Locator } from "playwright-core";
import { BaseLocator } from "../base/base.locator";


export class TextContainerLocator extends BaseLocator {
    innerText: Locator['innerText'] = this.$.innerText.bind(this.$)
}