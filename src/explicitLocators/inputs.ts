import { BaseLocator } from "../base/base.locator"
import { Locator, LocatorOptions, Page } from "../types"

export class InputLocator extends BaseLocator {

    click: Locator['click'] = this.$.click.bind(this.$)

    clear: Locator['clear'] = this.$.clear.bind(this.$)

    fill: Locator['fill'] = this.$.fill.bind(this.$)

    getInputValue: Locator['inputValue'] = this.$.inputValue.bind(this.$)

    specialFill = async (value: string, options?: {
        clear?: boolean,
        click?: boolean,
        multipleValueBy?: number
        force?: boolean,
        timeout?: number,
        noWaitAfter?: boolean,
    }) => {

        if (!options) { options = {} }
        
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

    getInputValue: Locator['inputValue'] = this.$.inputValue.bind(this.$)

}

//TODO?
export class RadioLocator<Values extends string> extends BaseLocator {

    public readonly values: Values[]

    constructor(page: Page, locator: Locator | string, radioValues: Values[], options?: { parent: Locator }) {
        super(page, locator, options as LocatorOptions)

        this.values = radioValues
    }


    getInputValue: Locator['inputValue'] = this.$.inputValue.bind(this.$)


    private getRadioByValue = async (value: Values) => {

        const radioLocatorsList = await this.$.all()

        for (const radio of radioLocatorsList) {
            const radioValue = await radio.getAttribute('value')

            if (radioValue === value) return radio
        }
    }

    // TODO?
    // private getRadioByIndex = async (index: number) => {
    //     return this.$.nth(index)
    // }

    whichIsChecked = async () => {
        const all = await this.$.all()

        for (const radio of all) {
            if (await radio.isChecked()) { return radio }
        }
    }

    check = async (value: Values) => {

        const radio = await this.getRadioByValue(value)
        await radio?.check()
    }
}
