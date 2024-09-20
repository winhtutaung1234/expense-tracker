const currencyConverter = require("../utils/currency/currencyConverter");

async function testForMyanmar() {
  const result = await currencyConverter(2, 1, 1);
  console.log(result);
}

async function testForUs() {
  const result = await currencyConverter(5, 6, 2000);
  console.log(result);
}

testForUs();
