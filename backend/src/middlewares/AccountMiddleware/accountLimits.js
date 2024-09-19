const { Account, Limit } = require("../../models");
const errResponse = require("../../utils/error/errResponse");

const accountLimits = async (req, res, next) => {
  try {
    const { user } = req;

    const roleLimit = await Limit.findOne({
      where: { role_id: user.role_id },
    });

    if (!roleLimit) {
      return res
        .status(404)
        .json({ msg: "Role limits for creating account not found" });
    }

    const accountCount = await Account.count({ where: { user_id: user.id } });

    if (accountCount >= roleLimit.max_accounts) {
      throw errResponse("Account creation limit reached", 403);
    }

    return next();
  } catch (err) {
    next(err);
  }
};

module.exports = accountLimits;
