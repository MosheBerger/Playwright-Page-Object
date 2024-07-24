## pomify

### Introduction

`pomify` is a TypeScript library that simplifies creating and maintaining tests using the Playwright testing framework and the Page Object Pattern. It provides a clean structure for organizing UI element locators and interactions, enhancing test readability and maintainability.

### Installation

```bash
npm install pomify
```

### Usage

`pomify` utilizes a base class (`BasePage`) to define core functionalities for page objects. You extend this class to create specific page objects for different pages in your application.

#### Defining Page Objects

1. Create a class extending `BasePage`.
2. Implement the abstract `$` property by assigning specific locators for your page elements. Utilize methods from `is` (e.g., `this.is.Button('#login')`) to create element locators.

**Example:**

```typescript
// login.page.ts

import { BasePage } from 'pomify';

export class LoginPage extends BasePage {

  $ = {
    usernameInput: this.is.Input('#username'),
    passwordInput: this.is.Input('#password'),
    loginBtn: this.is.Button('#login'),
    errorMsgDiv: this.is.Typography('#alert')
  }

  async goto(){
    //...
  }

  async login(username: string, password: string) {
    await this.$.usernameInput.fill(username);
    await this.$.passwordInput.fill(password);
    await this.$.loginBtn.click();
  }
}
```

#### Using Page Objects

- Create an instance of your page object class with a Playwright `Page` object.
- Access element locators and interact with them using methods provided by the page object or the underlying locators (e.g., `await loginPage.$.username.fill('test')`).

**Example:**

```typescript
// login.spec.ts

import { expect, test } from '@playwright/test'
import LoginPage from '../pages/login/login.page';

test.describe('LOGIN TESTS', () => {

    test('login and go to the home page', async ({ page }) => {
        const login = new LoginPage(page);
        
        await login.goto()
        await login.login()
        await page.waitForURL('home')

        expect(page.url()).toContain('home')
    })

    test('error message please insert password', async ({ page }) => {
        const login = new LoginPage(page)

        await login.goto()
        await login.$.usernameInput.fill('Moshe');
        await login.$.loginBtn.click()

        expect(await login.$.errorMsgDiv.innerText()).toContain('Please insert password')
    })

})
```

### API Reference

#### BaseLocator

* **Properties:**
  * `page` (protected, Playwright `Page` object)
  * `$` (public, Playwright `Locator` object)
* **Constructor:**
  * `BaseLocator(page: Page, locator: Locator | string, options?: LocatorOptions)`
    * `page`: The Playwright `Page` object
    * `locator`: A string selector or a Playwright `Locator` object
    * `options` (optional): Options for refining the locator
      * `parent`: A string selector or a Playwright `Locator` object representing the parent element
      * `position`: String ('first', 'last') or number (nth) to filter by position

#### ButtonLocator (Extends BaseLocator)

* **click:** Clicks the button (bound to the underlying locator's `click` method)

#### LinkLocator (Extends ButtonLocator)

* **Properties:**
  * `nextPage`: Optional class for creating the next page object when the link is clicked.
  * `toUrl`: Optional URL to wait for after clicking the link (as string or RegExp).
* **Methods:**
  * `navigate`: Clicks the link, waits for the target URL (if provided) and creates a new page object (if `nextPageClass` is provided).

#### InputLocator (Extends BaseLocator)

* **Methods:**
  * `click`: Clicks the input element (bound to the underlying locator's `click` method)
  * `clear`: Clears the input element (bound to the underlying locator's `clear` method)
  * `fill`: Fills the input element with a value (bound to the underlying locator's `fill` method)
  * `getInputValue`: Retrieves the current value of the input element (bound to the underlying locator's `inputValue` method)
  * `specialFill`: Fills the input element with additional options (clear, click, multipleValueBy, force, timeout, noWaitAfter)

#### CheckboxLocator (Extends BaseLocator)

* **Methods:**
  * `check`: Checks the checkbox (bound to the underlying locator's `check` method)
  * `uncheck`: Unchecks the checkbox (bound to the underlying locator's `uncheck` method)
  * `isChecked`: Checks if the checkbox is currently checked (bound to the underlying locator's `isChecked` method)
  * `setChecked`: Sets the checkbox to a specific checked state (bound to the underlying locator's `setChecked` method)
  * `getInputValue`: Retrieves the current value of the checkbox (bound to the underlying locator's `inputValue` method)

#### RadioLocator (Extends BaseLocator)

* **Properties:**
  * `values`: Array containing possible radio button values (defined in the constructor).
* **Methods:**
  * `getInputValue`: Retrieves the current value of the radio button (bound to the underlying locator's `inputValue` method) (under development)
  * `getRadioByValue`: Finds a radio button locator based on its value.
  * `whichIsChecked`: Returns the checked radio button locator (if any).
  * `check`: Checks a radio button by its value.

#### TypographyLocator

* **Methods:**
  * `innerText`: Retrieves the inner text of the element (bound to the underlying locator's `innerText` method)

