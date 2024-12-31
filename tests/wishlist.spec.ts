import { test, expect } from '@playwright/test';
import { itemsPage } from '../pages/items';
import * as allure from "allure-js-commons";
const credentials = JSON.parse(JSON.stringify (require ("../credentials.json")))
//REQUIRE: Converts the JavaScript into a JSON
//JSON.parse: Converts the JSON into a Object 

const URL = 'https://www.amazon.com/ap/signin?openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.com%2Fref%3Dnav_signin&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=usflex&openid.mode=checkid_setup&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0'
let itemspage: itemsPage;
test.beforeEach(async ({page}) => {
  await page.goto(URL);
  
});

test('Amazon Page', async ({ page }) => {
  itemspage = new itemsPage(page);
  await allure.description("Search products in amazon with the code, add them and delete them");

  await allure.step("Fill the sign-in form", async () => {
    await itemspage.login(credentials.username,credentials.password);
  })

  await allure.step("Search all the products with the specific code", async () => {
    await itemspage.searchitem();
  })
  
  await allure.step("Get access to the cart section", async () => {
    await itemspage.shoppingcart(page)
  })
  
  await allure.step("Delete all the items added before", async () => {
    await itemspage.deleteitems()
  })


  page.pause()



});

