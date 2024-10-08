const { Currency } = require("../../models");
const errResponse = require("../../utils/error/errResponse");
const removeFilePath = require("../../utils/upload/removeFilePath");

const path = require("path");

class CurrencyService {
  async getAllCurrencies() {
    const currencies = await Currency.findAll();
    return currencies;
  }

  async createCurrency(data) {
    const currency = await Currency.create(data);
    return currency;
  }

  async updateCurrency(id, data) {
    const currency = await Currency.findByPk(id);

    if (!currency) {
      throw errResponse("Currency not found", 404, "currency");
    }

    console.log("data image: ", data.image);

    if (data.image) {
      const path = `${__dirname}/../../public/images/currencies/${currency.image}`;
      await removeFilePath(path);
    }

    await currency.update(data);

    return currency;
  }

  async deleteCurrency(id) {
    const currency = await Currency.findByPk(id);

    if (!currency) throw errResponse("Currency not found", 404, "currency");
    await currency.destroy();
    await removeFilePath(
      `${__dirname}/../../public/images/currencies/${currency.image}`
    );
    return true;
  }
}

module.exports = new CurrencyService();
