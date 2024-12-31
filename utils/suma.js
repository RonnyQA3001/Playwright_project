const xpath = '//div[@data-asin="B001PQPD8C"]/div[@class="sc-list-item-content"]/div/div/ul/div/div/span[@class="aok-align-center a-text-bold"]'
const resultado = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE,null);

const elemento = resultado.singleNodeValue;

if(elemento){
    const texto = elemento.textContent;
    const numero = parseFloat(texto);

    console.log(numero)
}else{
    console.log("No se encontro el elemento especificado")
}