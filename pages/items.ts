import { expect, Locator, Page, selectors } from "@playwright/test";
import data from '../data/items.json'
import { parse } from "path";
import { Selectorsproducts } from "./selectorsproducts";

//Crendials have the username and password necessary to log into the amazon login.
const credentials = JSON.parse(JSON.stringify(require("../credentials.json")))

export class itemsPage {

    private page: Page;
    private usernametxt: Locator;
    private passwordtxt: Locator;
    private continuebtn: Locator;
    private accessbtn: Locator;
    private search_field: Locator;
    private search_button: Locator;
    private item_added: Locator;
    private cart: Locator;
    private cart_product1: Locator;



    constructor(page: Page) {
        this.page = page;
        this.usernametxt = page.locator("#ap_email")
        this.passwordtxt = page.locator("#ap_password")
        this.continuebtn = page.locator('xpath=//input[@id="continue"]')
        this.accessbtn = page.getByLabel('Sign in')
        this.search_field = page.locator("#twotabsearchtextbox")
        this.search_button = page.locator("#nav-search-submit-button")
        this.item_added = page.locator('xpath=//span[normalize-space()="1 en el carrito"]')
        this.cart = page.locator('xpath=//span[@class="nav-cart-icon nav-sprite"]')
        this.cart_product1 = page.locator('xpath=//div[@data-asin="B001PQPD8C"]/div[@class="sc-list-item-content"]/div/div/ul/div/div/span[@class="aok-align-center a-text-bold"]')
    }


    //We fill in the blanks to be able to access the page
    async login(username:string, password:string) {
        await this.usernametxt.fill(credentials.username)
        await this.continuebtn.click()
        await this.passwordtxt.fill(credentials.password)
        await this.accessbtn.click()

    }

    //With search item we will be able to search for each item correctly and add it to the shopping cart. 
    async searchitem() {
        const selectorsproducts = new Selectorsproducts(this.page);
        // For each item do each of the steps that are in the cycle "FOR".
        for (const item of data.items) {
            const itemlocator = selectorsproducts.getItemLocator(item)
            //Fill the blank with the "ASIN" identification code given by amazon
            await this.search_field.fill(item);
            //Click the search button
            await this.search_button.click();
            await this.page.waitForTimeout(2000);
            //Addresses the searched item
            await itemlocator.scrollIntoViewIfNeeded();
            //Verify if the item is visible
            await expect(itemlocator).toBeVisible();
            //Double-click to add the item to the shopping cart.
            await itemlocator.dblclick();
            await this.page.waitForTimeout(2000);
            //We verify that the correct amount has been added.
            await expect(this.item_added).toBeVisible();
            console.log(`Item "${item}" added successfully`);
        }
    }

    async GetElementNumber(page: Page, xpath:string): Promise<number> {
        const element = page.locator(xpath);
        await expect(element).toBeVisible();
        const text = await element.textContent();
        console.log(`Text retrieved: '${text}'`);

        //.trim() Eliminate unnecessary or repeated spaces
        if (text && text.trim() !== '') {
            const validNumber = text.replace(/[^\d.,-]/g, '');
            const number = parseFloat(validNumber);
            //isNaN attempts to convert the parameter passed to a number
            if (!isNaN(number)) {
                return number;
            } else {
                console.error('Error converting text to a number');
                return 0;
            }
        } else {
            console.error('No text retrieved or text is empty');
            return 0;
        }
    }

    //Shopping Cart section 
    async shoppingcart(page: Page) {
        //expect that the cart item is visible
        await expect(this.cart).toBeVisible();
        console.log('visible shopping cart')
        await this.cart.scrollIntoViewIfNeeded();
        await this.cart.click();
        //Check that the product is visible in the shopping cart section.
        await expect(this.cart_product1).toBeEnabled();
        await this.cart_product1.waitFor({ state: 'visible' })
        await this.cart_product1.scrollIntoViewIfNeeded();
        await expect(this.cart_product1).toBeVisible();


        const xpaths = [
            '//div[@data-asin="B001PQPD8C"]/div[@class="sc-list-item-content"]/div/div/ul/div/div/span[@class="aok-align-center a-text-bold"]',
            '//div[@data-asin="B0CWL6MDVL"]/div[@class="sc-list-item-content"]/div/div/ul/div/div/span[@class="aok-align-center a-text-bold"]',
            '//div[@data-asin="B09TTFM6H1"]/div[@class="sc-list-item-content"]/div/div/ul/div/div/span[@class="aok-align-center a-text-bold"]',
            '//div[@data-asin="B00BH4LKDY"]/div[@class="sc-list-item-content"]/div/div/ul/div/div/span[@class="aok-align-center a-text-bold"]',
            '//div[@data-asin="B0DBRCXG51"]/div[@class="sc-list-item-content"]/div/div/ul/div/div/span[@class="aok-align-center a-text-bold"]',
            '//div[@data-asin="B072WCC7HB"]/div[@class="sc-list-item-content"]/div/div/ul/div/div/span[@class="aok-align-center a-text-bold"]',

        ];

        // Initialising a variable to accumulate the sum total
        let sumTotal = 0;

        for (const xpath of xpaths) {
            const number = await this.GetElementNumber(page, xpath);
            sumTotal += number;
        }

        console.log(`Suma total: ${sumTotal}`);

        // XPath of the element displaying the reference value

        const xpathValueReference = '//span[@id="sc-subtotal-amount-buybox"]//span[@class="a-size-medium a-color-base sc-price sc-white-space-nowrap"]';
        const elementValueReference = page.locator(xpathValueReference);
        await expect(elementValueReference).toBeVisible();

        const textValueReference = await elementValueReference.textContent();
        console.log(`Texto del valor de referencia: '${textValueReference}'`);

        if (textValueReference && textValueReference.trim() !== '') {
            const cleanReferenceValueNumber = textValueReference.replace(/[^\d.,-]/g, '');
            const referenceValueNumber = parseFloat(cleanReferenceValueNumber);

            //isNaN tries to convert the parameter passed to a number
            if (!isNaN(referenceValueNumber)) {
                console.log(`Número del valor de referencia: ${referenceValueNumber}`);

                // Compare the total sum with the reference value
                if (Math.abs(sumTotal - referenceValueNumber) < 0.01) { // Using a tolerance for precision errors
                    console.log('The total sum coincides with the reference value.');
                } else {
                    console.log('The total sum does not match the reference value.');
                }
            } else {
                console.error('Error converting the reference value to a number.');
            }
        } else {
            console.error('The reference value text was not retrieved or is empty.');
        }
    }

    async deleteitems() {
        const selectorsproducts = new Selectorsproducts(this.page);

        for (const item of data.items) {
            const itemlocatordelete = selectorsproducts.getItemLocatorDelete(item)
            
            // Delete product
            await itemlocatordelete.scrollIntoViewIfNeeded();
            await expect(itemlocatordelete).toBeVisible();
            await itemlocatordelete.waitFor({ state: 'visible' });
            await itemlocatordelete.click();
            await this.page.waitForTimeout(3000);
            console.log('product deleted')

            console.log(`Item "${item}" deleted correctly`);
        }
    }

    }
