const { runRequest } = require("../common/request_wrapper");
const { tables } = require("../common/constants");
const { knex } = require("../common/request_wrapper");
const { toDate, now } = require("../utils/date");
const axios = require("axios");
require('dotenv').config()

const getGames = async(req, context) =>
    runRequest(req, context, async(_, __) => await knex
        .select()
        .from(tables.games)
        .where({ is_active: true }));

const createGame = (req, context) =>
    runRequest(req, context, async(req, _) => {
        let {
            time_start_min,
            increment_before_time_control_sec,
            moves_num_to_time_control,
            time_bump_after_time_control_min,
            increment_after_time_control_sec,
            type
        } = req.body;
        const result = await knex.insert({
            time_start_min,
            increment_before_time_control_sec,
            moves_num_to_time_control,
            time_bump_after_time_control_min,
            increment_after_time_control_sec,
            type
        }).into(tables.games);
        return result;
    });

const deleteGame = (req, context) =>
    runRequest(req, context, async(req, _) => {
        const result = await knex(tables.games)
            .where({ id: req.pathParameters.game_id })
            .update({ is_active: false });
        return result;
    });


module.exports = {
    getGames,
    createGame,
    deleteGame
};