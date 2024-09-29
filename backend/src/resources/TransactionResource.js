const Resource = require("resources.js");

class TransactionResource extends Resource {
  toArray() {
    return {
      id: this.id,
      account_id: this.account_id,
      category_id: this.category_id,
      transaction_type: this.transaction_type,
      amount: this.amount,
      currency_id: this.currency_id,
      description: this.description,
      exchange_rate: this.exchange_rate,
      created_at: this.created_at,
      updated_at: this.updated_at,
      currency: this.Currency
        ? {
          code: this.Currency.code,
          symbol: this.Currency.symbol,
          symbol_position: this.Currency.symbol_position,
          decimal_places: this.Currency.decimal_places,
        }
        : null,
      category: this.Category
        ? {
          name: this.Category.name,
        }
        : null,
      transfer: this.Transfer
        ? {
          from: this.Transfer.fromAccount?.name,
          to: this.Transfer.toAccount?.name,
        }
        : null,
    };
  }
}

module.exports = TransactionResource;
