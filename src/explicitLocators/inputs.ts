import { BaseLocator } from "../base/base.locator"
import { Locator } from "../types"

export class InputLocator extends BaseLocator {

    click: Locator['click'] = this.$.click.bind(this.$)

    clear: Locator['clear'] = this.$.clear.bind(this.$)

    fill: Locator['fill'] = this.$.fill.bind(this.$)

    specialFill = async (value: string, options: {
        clear?: boolean,
        click?: boolean,
        multipleValueBy?:number
        force?: boolean,
        timeout?: number,
        noWaitAfter?: boolean,
    }) => {

        const { clear, click, multipleValueBy, force, timeout, noWaitAfter } = options

        if (clear) {
            await this.clear()
        }
        if (click) {
            await this.click()
        }
        if (multipleValueBy) {
            value = value.repeat(multipleValueBy)
        }

        await this.fill(value, { force, timeout, noWaitAfter })
    }

}


export class CheckboxLocator extends BaseLocator {

    check: Locator['check'] = this.$.check.bind(this.$)

    uncheck: Locator['uncheck'] = this.$.uncheck.bind(this.$)

    isChecked: Locator['isChecked'] = this.$.isChecked.bind(this.$)

    setChecked: Locator['setChecked'] = this.$.setChecked.bind(this.$)
}

//TODO?
// export class RadioLocator extends CheckboxLocator {

// }
