import { expect, Locator, Page, selectors } from "@playwright/test";
import data from '../data/items.json'
import { parse } from "path";
import { Selectorsproducts } from "./selectorsproducts";
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



    async login(username:string, password:string) {
        await this.usernametxt.fill(credentials.username)
        await this.continuebtn.click()
        await this.passwordtxt.fill(credentials.password)
        await this.accessbtn.click()

    }

    async searchitem() {
        const selectorsproducts = new Selectorsproducts(this.page);

        for (const item of data.items) {
            const itemlocator = selectorsproducts.getItemLocator(item)
            await this.search_field.fill(item);
            await this.search_button.click();
            await this.page.waitForTimeout(2000);
            await itemlocator.scrollIntoViewIfNeeded();
            await expect(itemlocator).toBeVisible();
            await itemlocator.dblclick();
            await this.page.waitForTimeout(2000);
            await expect(this.item_added).toBeVisible();

            console.log(`Item "${item}" añadido correctamente`);
        }
    }

    async obtenerNumeroElemento(page, xpath) {
        const elemento = page.locator(xpath);
        await expect(elemento).toBeVisible();
        const texto = await elemento.textContent();
        console.log(`Texto recuperado: '${texto}'`);

        //.trim() Elimina espacios innecesarios o repetidos
        if (texto && texto.trim() !== '') {
            const numeroLimpio = texto.replace(/[^\d.,-]/g, '');
            const numero = parseFloat(numeroLimpio);
            //isNaN intenta convertir el parámetro pasado a un número
            if (!isNaN(numero)) {
                return numero;
            } else {
                console.error('Error al convertir el texto a un número.');
                return 0;
            }
        } else {
            console.error('No se recuperó texto o el texto está vacío.');
            return 0;
        }
    }


    async shoppingcart(page) {
        await expect(this.cart).toBeVisible();
        console.log('carrito visible')
        await this.cart.scrollIntoViewIfNeeded();
        await this.cart.click();
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

        // Inicializar una variable para acumular la suma total
        let sumaTotal = 0;

        for (const xpath of xpaths) {
            const numero = await this.obtenerNumeroElemento(page, xpath);
            sumaTotal += numero;
        }

        console.log(`Suma total: ${sumaTotal}`);

        // XPath del elemento que muestra el valor de referencia

        const xpathValorReferencia = '//span[@id="sc-subtotal-amount-buybox"]//span[@class="a-size-medium a-color-base sc-price sc-white-space-nowrap"]';
        const elementoValorReferencia = page.locator(xpathValorReferencia);
        await expect(elementoValorReferencia).toBeVisible();

        const textoValorReferencia = await elementoValorReferencia.textContent();
        console.log(`Texto del valor de referencia: '${textoValorReferencia}'`);

        if (textoValorReferencia && textoValorReferencia.trim() !== '') {
            const numeroValorReferenciaLimpio = textoValorReferencia.replace(/[^\d.,-]/g, '');
            const numeroValorReferencia = parseFloat(numeroValorReferenciaLimpio);

            //isNaN intenta convertir el parámetro pasado a un número
            if (!isNaN(numeroValorReferencia)) {
                console.log(`Número del valor de referencia: ${numeroValorReferencia}`);

                // Comparar la suma total con el valor de referencia
                if (Math.abs(sumaTotal - numeroValorReferencia) < 0.01) { // Usando una tolerancia para errores de precisión
                    console.log('La suma total coincide con el valor de referencia.');
                } else {
                    console.log('La suma total no coincide con el valor de referencia.');
                }
            } else {
                console.error('Error al convertir el valor de referencia a un número.');
            }
        } else {
            console.error('No se recuperó el texto del valor de referencia o está vacío.');
        }
    }

    async deleteitems() {
        const selectorsproducts = new Selectorsproducts(this.page);

        for (const item of data.items) {
            const itemlocatordelete = selectorsproducts.getItemLocatorDelete(item)
            
            // Eliminar el producto
            await itemlocatordelete.scrollIntoViewIfNeeded();
            await expect(itemlocatordelete).toBeVisible();
            await itemlocatordelete.waitFor({ state: 'visible' });
            await itemlocatordelete.click();
            await this.page.waitForTimeout(3000);
            console.log('producto eliminado')

            console.log(`Item "${item}" eliminado correctamente`);
        }
    }

    }
