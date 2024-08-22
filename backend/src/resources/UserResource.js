const Resource = require("resources.js");

class UserResource extends Resource {
  toArray() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phone_number: this.phone_number,
      password: this.password,
      created_at: this.created_at,
      updated_at: this.updated_at,
      role: this.Role
        ? {
            id: this.Role.id,
            name: this.Role.name,
          }
        : null,
    };
  }
}

module.exports = UserResource;
