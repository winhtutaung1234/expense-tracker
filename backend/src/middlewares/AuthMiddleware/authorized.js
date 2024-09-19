const { Role, Permission } = require("../../models");

const authorization = (permission) => {
  return async (req, res, next) => {
    try {
      const { user } = req;

      const role = await Role.findByPk(user.role_id, { include: Permission });
      if (!role) {
        return res.status(404).json({ msg: "Role not found" });
      }

      const userPermissions = role.Permissions.map((p) => p.name);

      const hasPermission = permission.every((p) =>
        userPermissions.includes(p)
      );

      if (hasPermission) {
        return next();
      } else {
        return res
          .status(403)
          .json({ msg: "You don't have the permission for this" });
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  };
};

module.exports = {
  authorization,
};
