const { runRequest } = require("../common/request_wrapper");
const { tables } = require("../common/constants");
const { knex } = require("../common/request_wrapper");
const { now } = require("../utils/date");

const getUserChessData = async(req, context) => runRequest(req, context, async (_, user_id) => {
    const { user_id } = req.params;
    const chessData = await knex(tables.chess_user_data)
        .select("*")
        .where({ user_id });
    return chessData;
});

const createChessUserData = async(req, context) => runRequest(req, context, async (_, user_id) => {
    const { user_id, rating } = req.body;
    const chessData = await knex(tables.chess_user_data)
        .insert({ user_id, rating, created_at: now(), updated_at: now(), is_active: true })
        .returning("*");
    return chessData;
});

const updateChessUserData = async(req, context) => runRequest(req, context, async (_, user_id) => {
    const { user_id } = req.params;
    const { rating } = req.body;
    const chessData = await knex(tables.chess_user_data)
        .update({ rating, updated_at: now() })
        .where({ user_id })
    return chessData;
});

module.exports = {
    getUserChessData,
    createChessUserData,
    updateChessUserData
}