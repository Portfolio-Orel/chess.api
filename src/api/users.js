const { runRequest } = require('../common/request_wrapper');
const { tables } = require('../common/constants');
const { knex } = require('../common/request_wrapper');
const { v4 } = require('uuid');

const getUser = async(req, context) => runRequest(req, context, async(_, __) => {
    const { user_id } = req.pathParameters;

    const result =  await knex(tables.users)
        .select(
            'users.*',
            'roles.name as role'
        )
        .join('users_roles', 'users.id', 'users_roles.user_id')
        .join('roles', 'users_roles.role_id', 'roles.id')
        .where('users.id', user_id)
        .where('users.is_active', true)
        .first();
    
    return result ? {
        id: result.id,
        first_name: result.first_name,
        last_name: result.last_name,
        gender: result.gender,
        email: result.email,
        phone_number: result.phone_number,
        player_number: result.player_number,
        date_of_birth: result.date_of_birth,
        role: result.role,
    } : null;
}, false);

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

const createUser = (req, context) => runRequest(req, context, async(req, user_id) => {
    const { first_name, last_name, gender, email, phone_number } = req.body;
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