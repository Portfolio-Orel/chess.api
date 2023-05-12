const { runRequest } = require("../common/request_wrapper");
const { tables } = require("../common/constants");
const { knex } = require("../common/request_wrapper");
require("dotenv").config();

const getGameFormats = async (req, context) =>
  runRequest(req, context, async (_, user_id) => {
    const result = await knex
      .select()
      .from(tables.game_formats)
      .where({ is_active: true });
    return result;
  });

const addGameFormat = (req, context) =>
  runRequest(req, context, async (req, _) => {
    let {
      time_start_min,
      increment_before_time_control_sec,
      moves_num_to_time_control,
      time_bump_after_time_control_min,
      increment_after_time_control_sec,
      type,
    } = req.body;
    const result = await knex
      .insert({
        time_start_min,
        increment_before_time_control_sec,
        moves_num_to_time_control,
        time_bump_after_time_control_min,
        increment_after_time_control_sec,
        type,
      })
      .into(tables.game_formats);
    return result;
  });

const deleteGameFormat = (req, context) =>
  runRequest(req, context, async (req, _) => {
    const result = await knex(tables.game_formats)
      .where({ id: req.pathParameters.game_format_id })
      .update({ is_active: false });
    return result;
  });

const updateGameFormat = (req, context) => {
  runRequest(req, context, async (req, _) => {
    const {
      time_start_min,
      increment_before_time_control_sec,
      moves_num_to_time_control,
      time_bump_after_time_control_min,
      increment_after_time_control_sec,
      type,
    } = req.body;
    const result = await knex(tables.game_formats)
      .where({ id: req.pathParameters.game_format_id })
      .update({
        time_start_min,
        increment_before_time_control_sec,
        moves_num_to_time_control,
        time_bump_after_time_control_min,
        increment_after_time_control_sec,
        type,
      });
    return result;
  });
};

module.exports = {
  getGameFormats,
  addGameFormat,
  deleteGameFormat,
  updateGameFormat,
};
