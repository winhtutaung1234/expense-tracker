const { Account, Limit } = require("../../models");

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
      return res.status(403).json({ msg: "Account creation limit reached" });
    }

    return next();
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

module.exports = accountLimits;
