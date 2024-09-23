const { Role, Permission } = require("../../models");
const errResponse = require("../../utils/error/errResponse");

const authorization = (permission) => {
  return async (req, res, next) => {
    try {
      const { user } = req;

      const role = await Role.findByPk(user.role_id, { include: Permission });
      if (!role) {
        throw errResponse("Role not found", 404, "role");
      }

      const userPermissions = role.Permissions.map((p) => p.name);

      const hasPermission = permission.every((p) =>
        userPermissions.includes(p)
      );

      if (hasPermission) {
        return next();
      } else {
        throw errResponse(
          "You don't have permission for this",
          403,
          "permission"
        );
      }
    } catch (err) {
      throw errResponse(err.message);
    }
  };
};

module.exports = {
  authorization,
};
