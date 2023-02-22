const { runRequest } = require('../common/request_wrapper');
const { tables } = require('../common/constants');
const { knex } = require('../common/request_wrapper');
const { v4 } = require('uuid');

const getUser = async(req, context) => runRequest(req, context, async(_, __) => {
    const { user_id } = req.pathParameters;
    const result = await knex(tables.users)
        .where('id', user_id)
        .where('is_active', true);
    return result;
});

const getUserByEmail = async(req, context) => runRequest(req, context, async(_, __) => {
    const { email } = req.pathParameters;
    const result = await knex(tables.users)
        .where('email', email)
        .where('is_active', true);
    return result;
});

const getUserByPhoneNumber = async(req, context) => runRequest(req, context, async(_, __) => {
    const { phone_number } = req.pathParameters;
    const result = await knex(tables.users)
        .where('phone_number', phone_number)
        .where('is_active', true);
    return result;
});

const createUser = (req, context) => runRequest(req, context, async(req, _) => {
    const { first_name, last_name, gender, email, phone_number } = JSON.parse(req.body);
    const user_id = v4();
    await knex(tables.users)
        .insert({
            id: user_id,
            first_name,
            last_name,
            gender,
            email,
            phone_number,
        })
        .onConflict(['id'])
        .ignore();
    return user_id;
});

module.exports = {
    getUser,
    getUserByEmail,
    getUserByPhoneNumber,
    createUser
}