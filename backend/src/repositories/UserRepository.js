const { User, Role } = require("../models");
const errResponse = require("../utils/error/errResponse");

class UserRepository {
  async getAllUsers() {
    try {
      const users = await User.findAll();
      return users;
    } catch (err) {
      throw errResponse(
        err.message || "Failed to fetch users",
        err.status || 500,
        "user"
      );
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await User.findOne({ where: { email } });

      if (!user) throw errResponse("User not found", 404, "user");

      return user;
    } catch (err) {
      throw errResponse(
        err.message || "Failed to fetch user",
        err.status || 500,
        "user"
      );
    }
  }

  async getUserByIdWithAssociation() {
    try {
      const user = await User.findByPk(id, { include: Role });
      if (!user) {
        throw errResponse("User not found", 404, "user");
      }

      return user;
    } catch (err) {
      throw errResponse(
        err.message || "Failed to fetch user",
        err.status || 500,
        "user"
      );
    }
  }

  async getUserById(id) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw errResponse("User not found", 404, "user");
      }

      return user;
    } catch (err) {
      throw errResponse(
        err.message || "Failed to fetch user",
        err.status || 500,
        "user"
      );
    }
  }

  async createUser(data) {
    try {
      const user = await User.create(data);
      return user;
    } catch (err) {
      throw errResponse(
        err.message || "Failed to create user",
        err.status || 500,
        "user"
      );
    }
  }

  async updateUser(id, data) {
    try {
      const user = await User.findByPk(id);

      if (!user) throw errResponse("User not found", 404, "user");

      await user.update(data);
      return user;
    } catch (err) {
      throw errResponse(
        err.message || "Failed to update user",
        err.status || 500,
        "user"
      );
    }
  }

  async deleteUser(id) {
    try {
      const user = await User.findByPk(id);

      if (!user) throw errResponse("User not found", 404, "user");

      await user.destroy();

      return true;
    } catch (err) {
      throw errResponse(
        err.message || "Failed to delete user",
        err.status || 500,
        "user"
      );
    }
  }

  async restoreUserFromDelete(id) {
    try {
      const user = await User.findByPk(id, { paranoid: false });

      if (!user) throw errResponse("User not found", 404, "user");

      return await user.restore();
    } catch (err) {
      throw errResponse(
        err.message || "Failed to restore user from deleted record",
        err.status || 500,
        "user"
      );
    }
  }
}

module.exports = new UserRepository();
