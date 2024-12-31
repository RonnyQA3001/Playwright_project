export class Selectorsproducts {
    private page;

    constructor(page) {
        this.page = page;
    }

    // Método dinámico para construir el selector
    
    getItemLocator(dataAsin: string) {
        
        return this.page.locator(`xpath=//div[@data-asin="${dataAsin}"]/div/div/span/div/div/div/div/div/div/div/span/div/span/span/button`);

        
    }

    getItemLocatorDelete(dataDelete: string) {
        
        return this.page.locator(`xpath=//div[@data-asin="${dataDelete}"]/div[@class="sc-list-item-content"]/div/div/div[@class="a-row sc-action-links"]/span[@data-feature-id="delete"]/span/input[@data-action="delete"]`);

        
    }
}
