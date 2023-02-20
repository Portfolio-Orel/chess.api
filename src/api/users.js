const { runRequest } = require('../common/request_wrapper');
const { tables } = require('../common/constants');
const { now } = require('../utils/date');
const { knex } = require('../common/request_wrapper');
const { v4 } = require('uuid');

const getUser = async(req, context) => runRequest(req, context, async(_, user_id) => {
    const result = await knex(tables.users)
        .where('id', user_id)
        .where('is_active', )
        .first();
    return result;
});

const createUser = (req, context) => runRequest(req, context, async(req, _) => {
    const { first_name, last_name, gender, email, number } = JSON.parse(req.body);
    const user_id = v4();
    await knex(tables.users)
        .insert({
            id: user_id,
            first_name,
            last_name,
            gender,
            email,
            number,
            created_at: now(),
            is_active: true
        })
        .onConflict(['id'])
        .ignore();
    return user_id;
});

module.exports = {
    getUser,
    createUser
}