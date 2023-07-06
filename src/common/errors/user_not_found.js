class UserNotFoundError extends Error {
    constructor(message) {
      super(message);
      this.name = "UserNotFoundError";
      this.code = 403;
    }
  }

 module.exports = UserNotFoundError;