import BasePage from "./Base.page";


export class ExamplePage extends BasePage {

    $ = {
        locatorName: this.page.locator('Div#locatorName'),
        
    }
} 