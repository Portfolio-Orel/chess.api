const { runRequest } = require("../common/request_wrapper");
const { calculateRating } = require("../common/rating_calculator");
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

  const chess_rating_result = await axios.get(
    `${chess_rating_url}${player_number}`
  );
  const html = chess_rating_result.data;
  const $ = cheerio.load(html);
  const rating_israel_element = $(
    '.full-profile .full-block ul li:contains("מד כושר ישראלי")'
  );
  if (rating_israel_element.length === 0) {
    throw new PlayerNumberNotFoundError();
  }
  const rating_israel_text = rating_israel_element.find("span").text().trim();
  const rating_israel = rating_israel_text.match(/\d+/)[0];
  const rating_fide_element = $('li:contains("מד כושר FIDE סטנדרטי")');
  const rating_fide_text = rating_fide_element.find("span").text().trim();
  if (!rating_fide_text) {
    return { rating_israel };
  }
  let rating_fide = rating_fide_text.match(/\d+/);
  if (!rating_fide || !rating_fide[0]) {
    rating_fide = 0;
  } else {
    rating_fide = rating_fide[0];
  }
  return { rating_israel, rating_fide };
};

module.exports = {
  calculateNewRating,
  fetchRating,
};
