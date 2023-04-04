const { runRequest } = require("../common/request_wrapper");
const { tables } = require("../common/constants");
const { knex } = require("../common/request_wrapper");
const { toDate } = require("../utils/date");

const getUser = async (req, context) =>
  runRequest(
    req,
    context,
    async (_, __) => {
      const { user_id } = req.pathParameters;

      const result = await knex(tables.users)
        .select("users.*", "roles.name as role")
        .join("users_roles", "users.id", "users_roles.user_id")
        .join("roles", "users_roles.role_id", "roles.id")
        .where("users.id", user_id)
        .where("users.is_active", true)
        .first();

      return result
        ? {
            id: result.id,
            first_name: result.first_name,
            last_name: result.last_name,
            gender: result.gender,
            email: result.email,
            phone_number: result.phone_number,
            player_number: result.player_number,
            date_of_birth: result.date_of_birth,
            role: result.role,
          }
        : null;
    },
    false
  );

const createUser = (req, context) =>
  runRequest(req, context, async (req, user_id) => {
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
      .onConflict(["id"])
      .ignore();
    return { user_id };
  });

const updateUser = (req, context) =>
  runRequest(req, context, async (req, user_id) => {
    let { first_name, last_name, date_of_birth, gender } = req.body;
    date_of_birth = toDate(date_of_birth);
    await knex(tables.users)
      .update({
        first_name,
        last_name,
        date_of_birth,
        gender,
      })
      .where("id", user_id);
  });

const completeRegistration = (req, context) =>
  runRequest(req, context, async (req, user_id) => {
    let { first_name, last_name, date_of_birth, gender } = req.body;
    date_of_birth = toDate(date_of_birth);
    await knex(tables.users)
      .update({
        first_name,
        last_name,
        date_of_birth,
        gender,
        is_registration_completed: true,
      })
      .where("id", user_id);
  });

const isRegistrationCompleted = (req, context) =>
  runRequest(req, context, async (_, __) => {
    try {
      const { user_id } = req.pathParameters;
      const result = await knex(tables.users)
        .select("is_registration_completed")
        .where("id", user_id)
        .first();
      return {
        is_registration_completed: result.is_registration_completed,
      };
    } catch (error) {
      return false;
    }
  });

module.exports = {
  getUser,
  createUser,
  isRegistrationCompleted,
  updateUser,
  completeRegistration,
};
