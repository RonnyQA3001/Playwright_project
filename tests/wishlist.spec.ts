import { test, expect } from '@playwright/test';
import { itemsPage } from '../pages/items';
import * as allure from "allure-js-commons";
const credentials = JSON.parse(JSON.stringify (require ("../credentials.json")))
//REQUIRE: Converts the JavaScript into a JSON
//JSON.parse: Converts the JSON into a Object 

//Main URL needed to execute the test
const URL = 'https://www.amazon.com/ap/signin?openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.com%2Fref%3Dnav_signin&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=usflex&openid.mode=checkid_setup&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0'
let itemspage: itemsPage;

//Before each: Is important for the beggining of the test, we start with this step.
test.beforeEach(async ({page}) => {
  await page.goto(URL);
  
});

test('Amazon Page', async ({ page }) => {
  itemspage = new itemsPage(page);
  await allure.description("Search products in amazon with the code, add them and delete them");

  /*Allure step will help us to be able to show this step in the report 
   *This step is for the login, here we enter the credentials
   */
  await allure.step("Fill the sign-in form", async () => {
    await itemspage.login(credentials.username,credentials.password);
  })
  //Here we search all the items with an specific code "ASIN: Identification Number" this code is important to identify all the items.
  await allure.step("Search all the products with the specific code", async () => {
    await itemspage.searchitem();
  })
  //In this step we get access to the cart section and verify the products added.
  await allure.step("Get access to the cart section", async () => {
    await itemspage.shoppingcart(page)
  })
  
  await allure.step("Delete all the items added before", async () => {
    await itemspage.deleteitems()
  })


  page.pause()



});

