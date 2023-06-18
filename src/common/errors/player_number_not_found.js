// This error is thrown when the user is not found
class PlayerNumberNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "PlayerNumberNotFoundError";
    this.code = 403;
  }
}
module.exports = PlayerNumberNotFoundError;
