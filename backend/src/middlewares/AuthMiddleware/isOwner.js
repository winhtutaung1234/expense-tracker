const { User } = require("../../models");
const { Account } = require("../../models");

const errResponse = require("../../utils/error/errResponse");

function isOwner(type) {
  return async (req, res, next) => {
    try {
      const { user } = req;
      const { id } = req.params;

      const userExists = await User.findByPk(user.id);

      if (!userExists) {
        return res.status(404).json({
          msg: `User with id ${id} not found`,
        });
      }

      if (type === "account") {
        const account = await Account.findByPk(id);

        if (!account) {
          throw errResponse("Account not found", 404);
        }

        if (account.user_id === user.id) {
          return next();
        }
      }

      return res.status(403).json({ msg: "Unauthorized" });
    } catch (err) {
      return next(err);
    }
  };
}

module.exports = isOwner;
