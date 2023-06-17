class CONSTS {
  static POINTS_FOR_GAME_AGAINST_UNRATED_PLAYER = 2;

  static MAX_RATING_FOR_GAME_BONUS = 2300;
  static DEFAULT_BONUS_DIVIDER = 2000;

  static MAX_RATING_DIFF_1 = 375;
  static MAX_RATING_DIFF_VALUE_1 = 375;
  static MAX_RATING_DIFF_2 = 750;
  static MAX_RATING_DIFF_VALUE_2 = 400;

  static SMALL_NUM_GAMES_K_MULTIPLIER = 1.5;
  static SMALL_NUM_GAMES_FOR_K = 15;

  static GAME_DIFF_CONSTANT_DIVIDER = 400;

  static MIN_NUM_GAMES_FOR_INITIAL_RATING = 5;
  static MIN_NUM_GAMES_FOR_INITIAL_RATING_ANYWAY = 9;
  static NUM_MONTHS_FOR_INITIAL_RATING = 18;

  static RATING_UPDATE_SET_NAME_PREFIX = "עדכון ";
  static RATING_UPDATE_SET_MANUAL_NAME_PREFIX = "תיקון ";

  static RATING_CALCULATIONS_NUMBER_OF_TOURNAMENT_ENTRIES_IN_SET = 10;
  static RATING_CALCULATIONS_NUMBER_OF_PLAYERS_ENTRIES_IN_SET = 10;
  static RATING_CALCULATIONS_NUMBER_OF_GAMES_IN_SET = 10;

  static UNRATED_LOCALLY = "מדורג מתחיל";
  static UNRATED_INTERNATIONALLY = "אין דרגה בינלאומית";

  static RATING_MAX_VALUE = 9999;

  static DEFAULT_PLAYER_RATING_TYPE = 1;
  static RATING_TYPE_FIDE_STANDARD = 2;
  static RATING_TYPE_FIDE_RAPID = 3;
  static RATING_TYPE_FIDE_BLITZ = 5;

  static NUM_IMPROVING_PLAYERS_IN_DEFAULT_PAGE = 3;
  static MIN_RATING_TO_BE_IN_IMPROVING_PLAYERS = 1400;

  static MIN_RATING_FOR_WATING_PLAYER = 1300;
  static MIN_RATING_FOR_ADULT_PLAYER = 1400;
  static MIN_RATING_FOR_GOING_DOWN = 1400;
  static MIN_RATING_GLOBAL = 1200;
  static MIN_AGE_ADULT_PLAYER = 14;
  static MIN_NUM_GAMES_FOR_RANK = 15;
}

class Player {}

class Game {}

function GetKValueByParameters() {
  return 10;
}

function GameBonus(Ro, time_control) {
  let B = 0;

  if (Ro >= CONSTS.MAX_RATING_FOR_GAME_BONUS) {
    B = 0;
  } else {
    if (time_control === "blitz" || time_control === "rapid") {
      B = (CONSTS.MAX_RATING_FOR_GAME_BONUS - Ro) / 1000;
    } else if (time_control === "classical" || time_control === "classical") {
      B = (CONSTS.MAX_RATING_FOR_GAME_BONUS - Ro) / 2000;
    }
  }
  return B;
}

function ratingDiff(Ro, Ry) {
  const MAX_RATING_DIFF_1 = CONSTS.MAX_RATING_DIFF_1;
  const MAX_RATING_DIFF_2 = CONSTS.MAX_RATING_DIFF_2;
  const MAX_RATING_DIFF_VALUE_1 = CONSTS.MAX_RATING_DIFF_VALUE_1;
  const MAX_RATING_DIFF_VALUE_2 = CONSTS.MAX_RATING_DIFF_VALUE_2;

  if (Ro < Ry + MAX_RATING_DIFF_1 && Ro + MAX_RATING_DIFF_1 > Ry) {
    // Rating difference within normal
    return Ry - Ro;
  } else if (Ro >= Ry + MAX_RATING_DIFF_2) {
    // difference is bigger than diff 2 in Ro favour
    return -MAX_RATING_DIFF_VALUE_2;
  } else if (Ro >= Ry + MAX_RATING_DIFF_1) {
    // diff between max 1 and max 2 in Ro favour
    return -MAX_RATING_DIFF_VALUE_1;
  } else if (Ro <= Ry - MAX_RATING_DIFF_2) {
    // diff bigger than Max2 in Ry favour
    return MAX_RATING_DIFF_VALUE_2;
  } else if (Ro <= Ry - MAX_RATING_DIFF_VALUE_1) {
    // diff between max 1 and max 2 in Ry favour
    return MAX_RATING_DIFF_1;
  }
  // should not be here
  return 0;
}

// Returns new rating of a player
async function calculateRating(player, games) {
  let rating_change = 0;
  let number_of_games = games.length;

  for (let i = 0; i < number_of_games; i++) {
    const current_game = games[i];

    let K = GetKValueByParameters();
    let B = GameBonus(current_game.opponentRating, current_game.time_control);
    let D = ratingDiff(player.rating, current_game.opponentRating);

    // No GameResultMultiplier as we can reach Game result easily from Game class
    let P = 1 - current_game.opponentPoints; // for getting player's result

    let change =
      K * (P * 2 - 1) + (K * D) / CONSTS.GAME_DIFF_CONSTANT_DIVIDER + B;
    rating_change += change;
  }

  return Math.floor(player.rating + rating_change); // round it
}

module.exports = {
  calculateRating,
};
