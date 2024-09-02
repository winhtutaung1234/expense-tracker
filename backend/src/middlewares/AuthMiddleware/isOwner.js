const { User } = require("../../models");
const { Account } = require("../../models");

function isOwner(type) {
  return async (req, res, next) => {
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
      if (account.user_id === user.id) {
        return next();
      }
    }

    return res.status(403).json({ msg: "Unauthorized to delete" });
  };
}

module.exports = isOwner;
