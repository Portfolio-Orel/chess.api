const { runRequest } = require("../common/request_wrapper");
const { tables } = require("../common/constants");
const { calculateRating } = require("../common/rating_calculator");
const { knex } = require("../common/request_wrapper");

const axios = require("axios");
const cheerio = require("cheerio");

require("dotenv").config();

const calculateNewRating = async (req, context) =>
  runRequest(req, context, async (_, user_id) => {
    const { player, games } = req.body;
    return await calculateRating(player, games);
  });

const getRating = async (req, context) =>
  runRequest(req, context, async (_, user_id) => {
    const chess_rating_url = process.env.CHESS_RATING_URL;
    // const { player_id } = req.pathParameters;
    const result = await knex(tables.users)
    .where({ id: user_id })
    .join(tables.chess_user_data, `${tables.users}.id`, `${tables.chess_user_data}.user_id`)
    .select(`${tables.chess_user_data}.player_number`)
    .first();
    
    if(!result) throw Error("User not found");

    const player_number = result?.player_number;

    const chess_rating_result = await axios.get(`${chess_rating_url}${player_number}`);
    const html = chess_rating_result.data;
    const $ = cheerio.load(html);
    const israeliRatingElement = $(
      '.full-profile .full-block ul li:contains("מד כושר ישראלי")'
    );
    const israeliRatingText = israeliRatingElement.find("span").text().trim();
    const israeliRating = israeliRatingText.match(/\d+/)[0];
    return israeliRating;
  });

module.exports = {
  calculateNewRating,
  getRating,
};
