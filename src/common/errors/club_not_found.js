// This error is thrown when the user is not found
class ClubNotFound extends Error {
    constructor(message) {
      super(message);
      this.name = "ClubNotFoundError";
      this.code = 403;
    }
  }
  module.exports = ClubNotFound;
  