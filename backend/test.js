// transfer test

const {
  addTransactionToAccountBalance,
  updateTransactionToAccountBalance,
} = require("./src/utils/account/updateAccountBalance");

async function test() {
  // const result = await addTransactionToAccountBalance({
  //   account_id: 5,
  //   transfer_account_id: 6,
  //   transaction_type: "transfer",
  //   convertedAmount: 2000,
  // });
  // console.log("result form test of transfer: ", result);

  const result = await addTransactionToAccountBalance({
    account_id: 5,
    transfer_account_id: 6,
    transaction_type: "transfer",
    convertedAmount: 4000,
    transaction_id: 66,
  });

  console.log("final result: ", result);
}

console.log(test());
