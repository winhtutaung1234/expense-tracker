const { User, Account, Transaction } = require("../../models");

const errResponse = require("../../utils/error/errResponse");

function isOwner(type) {
  return async (req, res, next) => {
    try {
      const { user } = req;
      const { id } = req.params;

      const userExists = await User.findByPk(user.id);

      if (!userExists) {
        throw errResponse("User not found", 404, "user");
      }

      if (type === "account") {
        const account = await Account.findByPk(id);

        if (!account) {
          throw errResponse("Account not found", 404, "account");
        }

        if (account.user_id === user.id) {
          return next();
        }
      }

      if (type === "transaction") {
        const transaction = await Transaction.findByPk(id, {
          include: [{ model: Account, attributes: ["user_id"] }],
        });

        if (!transaction)
          throw errResponse("Transaction not found", 404, "transaction");

        if (transaction.Account.user_id === user.id) {
          return next();
        }
      }

      throw errResponse("Unauthorized", 403, "isOnwer");
    } catch (err) {
      return next(err);
    }
  };
}

module.exports = isOwner;
