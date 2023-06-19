const { runRequest } = require("../common/request_wrapper");
const { calculateRating } = require("../common/rating_calculator");
const { toDate } = require("../utils/date");
const PlayerNumberNotFoundError = require("../common/errors/player_number_not_found");

const axios = require("axios");
const cheerio = require("cheerio");

require("dotenv").config();

const calculateNewRating = async (req, context) =>
  runRequest(req, context, async (_, user_id) => {
    const { player, games } = req.body;
    return await calculateRating(player, games);
  });

const fetchRating = async (player_number) => {
  const chess_rating_url = process.env.CHESS_RATING_URL;
  const player_details = {};
  const chess_rating_result = await axios.get(`${chess_rating_url}${4169}`);
  const html = chess_rating_result.data;
  const data = extractDataFromHTML(html);
  if (!data.rating_israel) {
    throw new Error("Player number not found.");
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
  if (data.player_card_expire_date) {
    const [day, month, year] = data.player_card_expire_date.split("/");
    const date = new Date(`${year}-${month}-${day}`);
    player_details.player_card_expire_date = toDate(date.getTime());
  }
  if (data.full_name) {
    player_details.full_name = data.full_name;
    const { firstName, lastName } = extractFirstAndLastName(data.full_name);
    player_details.first_name = firstName;
    player_details.last_name = lastName;
  }

  return { player_details };
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
  const year_of_birth = $('li:contains("שנת לידה")').text().trim().match(/\d+/);
  const player_card_expire_date = $('li:contains("תוקף כרטיס שחמטאי")')
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
    player_card_expire_date,
    full_name,
  };
};

module.exports = {
  calculateNewRating,
  fetchRating,
};
