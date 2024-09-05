const Resource = require("resources.js");

class AccountResource extends Resource {
  toArray() {
    return {
      id: this.id,
      user_id: this.user_id,
      name: this.name,
      balance: this.balance,
      currency_id: this.currency_id,
      description: this.description,
      currency: this.Currency
        ? {
            id: this.Currency.id,
            name: this.Currency.name,
            code: this.Currency.code,
            symbol: this.Currency.symbol,
            decimal_places: this.Currency.decimal_places,
          }
        : null,
    };
  }
}

module.exports = AccountResource;
