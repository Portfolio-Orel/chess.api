const { knex } = require("../common/request_wrapper");
const { runRequest } = require("../common/request_wrapper");
const { calculateRating } = require("../common/rating_calculator");
const { toDate } = require("../utils/date");
const { tables } = require("../common/constants");

const PlayerNumberNotFoundError = require("../common/errors/player_number_not_found");
const UserNotFound = require("../common/errors/user_not_found");

const axios = require("axios");
const cheerio = require("cheerio");

require("dotenv").config();

const fetchRating = async (player_number) => {
  const chess_rating_url = process.env.CHESS_RATING_URL;
  const player_details = {};
  const chess_rating_result = await axios.get(
    `${chess_rating_url}${player_number}`
  );
  const html = chess_rating_result.data;
  const data = extractDataFromHTML(html);
  if (!data.rating_israel) {
    throw new PlayerNumberNotFoundError();
  }
  if (data.rating_fide && data.rating_fide.length > 0) {
    player_details.rating_fide = data.rating_fide[0];
  }
  if (data.rating_israel && data.rating_israel.length > 0) {
    player_details.rating_israel = data.rating_israel[0];
  }
  if (data.rating_fide_rapid && data.rating_fide_rapid.length > 0) {
    player_details.rating_fide_rapid = data.rating_fide_rapid[0];
  }
  if (data.rating_fide_blitz && data.rating_fide_blitz.length > 0) {
    player_details.rating_fide_blitz = data.rating_fide_blitz[0];
  }
  if (data.year_of_birth && data.year_of_birth.length > 0) {
    player_details.year_of_birth = data.year_of_birth[0];
  }
  if (data.club_name) {
    player_details.club_name = data.club_name;
  }
  if (data.fide_player_id) {
    player_details.fide_player_id = data.fide_player_id;
  }
  if (data.profile_expiration_date) {
    const [day, month, year] = data.profile_expiration_date.split("/");
    const date = new Date(`${year}-${month}-${day}`);
    player_details.profile_expiration_date = toDate(date.getTime());
  }
  if (data.full_name) {
    player_details.full_name = data.full_name;
    const { firstName, lastName } = extractFirstAndLastName(data.full_name);
    player_details.first_name = firstName;
    player_details.last_name = lastName;
  }
  if (data.title) {
    player_details.title = data.title;
  }

  return player_details;
};

const extractFirstAndLastName = (fullName) => {
  const trimmedFullName = fullName.trim();
  const nameParts = trimmedFullName.split(" ");

  const firstName = nameParts[0];
  const lastName = nameParts[nameParts.length - 1];

  return {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
  };
};

const extractDataFromHTML = (html) => {
  const $ = cheerio.load(html);
  const club_name = $("div.full-block b").next("a").text();
  const fide_player_id = $("div.full-block li:nth-child(2) a").text();
  const rating_israel = $(
    '.full-profile .full-block ul li:contains("מד כושר ישראלי")'
  )
    .find("span")
    .text()
    .trim()
    .match(/\d+/);
  const rating_fide = $('li:contains("מד כושר FIDE סטנדרטי")')
    .find("span")
    .text()
    .trim()
    .match(/\d+/);
  const rating_fide_rapid = $('li:contains("מד כושר FIDE מהיר")')
    .find("span")
    .text()
    .trim()
    .match(/\d+/);
  const rating_fide_blitz = $('li:contains("מד כושר FIDE בזק")')
    .find("span")
    .text()
    .trim()
    .match(/\d+/);
  const title = $('li:contains("דרגה בינלאומית")').find("span").text().trim();
  const year_of_birth = $('li:contains("שנת לידה")').text().trim().match(/\d+/);
  const profile_expiration_date = $('li:contains("תוקף כרטיס שחמטאי")')
    .text()
    .trim()
    .replace(/[^\d/]/g, "");
  const full_name = $(".player-name h2").text().trim();
  return {
    club_name,
    fide_player_id,
    rating_israel,
    rating_fide,
    rating_fide_rapid,
    rating_fide_blitz,
    year_of_birth,
    profile_expiration_date,
    full_name,
    title,
  };
};

const calculateNewRating = async (req, context) =>
  runRequest(req, context, async (_, user_id) => {
    const { games } = req.body;
    const user_rating = await knex(tables.chess_user_data)
      .where({ user_id })
      .select(["rating_expected", "rating_israel"])
      .first();

    if (!user_rating) {
      throw new UserNotFound(`User ${user_id} was not found`);
    }

    const player = {
      rating: user_rating.rating_expected ?? user_rating.rating_israel,
    };
    const new_rating = await calculateRating(player, games);
    await knex.transaction(async (trx) => {
      await trx(tables.calculation_history).insert({
        user_id,
        previous_rating: player.rating,
        new_rating,
      });

      await trx(tables.chess_user_data).where({ user_id }).update({
        rating_expected: new_rating,
      });
    });

    return new_rating;
  });

const undoLatestCalculation = (req, context) =>
  runRequest(req, context, async (_, user_id) => {
    let latest_calculation_history = await knex.transaction(async (trx) => {
      const latest_calculation_history = await trx(tables.calculation_history)
        .where({ user_id })
        .orderBy("created_at", "desc")
        .where({ is_active: true })
        .first();

      if (!latest_calculation_history) {
        return null;
      }

      await trx(tables.calculation_history)
        .where({ id: latest_calculation_history.id })
        .update({ is_active: false });

      await trx(tables.chess_user_data).where({ user_id }).update({
        rating_expected: latest_calculation_history.previous_rating,
      });

      return latest_calculation_history;
    });

    const previous_rating = latest_calculation_history.previous_rating;
    return previous_rating;
  });

const resetExpectedRating = (req, context) =>
  runRequest(req, context, async (_, user_id) => {
    return await knex.transaction(async (trx) => {
      const user_rating = await trx(tables.chess_user_data)
        .where({ user_id })
        .select(["rating_israel", "rating_expected"])
        .first();

      await trx(tables.chess_user_data)
        .where({ user_id })
        .update({ rating_expected: user_rating.rating_israel });

      await trx(tables.calculation_history).insert({
        user_id,
        previous_rating: user_rating.rating_expected,
        new_rating: user_rating.rating_israel,
      });
      return user_rating.rating_israel;
    });
  });

module.exports = {
  calculateNewRating,
  fetchRating,
  undoLatestCalculation,
  resetExpectedRating,
};
