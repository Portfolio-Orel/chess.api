const { runRequest } = require("../common/request_wrapper");
const { tables } = require("../common/constants");

const { knex } = require("../common/request_wrapper");

const getAllClubs = async (req, context) =>
  runRequest(req, context, async (_, user_id) => {
    const clubs = await knex(tables.clubs).select("*");
    return clubs;
  });

const getClub = async (req, context) =>
  runRequest(req, context, async (_, user_id_) => {
    const { club_id } = req.params;
    const result = await knex(tables.clubs)
      .select("*")
      .where("id", club_id)
      .first();
    return result ? result : {};
  });

module.exports = {
  getAllClubs,
  getClub,
};
