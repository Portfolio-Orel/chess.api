const { runRequest } = require("../common/request_wrapper");
const { tables } = require("../common/constants");
const { knex } = require("../common/request_wrapper");
const { toDate } = require("../utils/date");
const logger = require("../common/logger");

const getUser = async (req, context) =>
  runRequest(
    req,
    context,
    async (req, __) => {
      const user_id = req.pathParameters.user_id;
      const result = await knex(tables.users)
        .select("users.*", "roles.name as role")
        .join("users_roles", "users.id", "users_roles.user_id")
        .join("roles", "users_roles.role_id", "roles.id")
        .where("users.id", user_id)
        .where("users.is_active", true)
        .first();

      const user = result
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

      logger.info(`User ${user_id} was fetched`);
      return user;
    },
    false
  );

const createUser = (req, context) =>
  runRequest(req, context, async (req, _, __) => {
    const {
      user_id,
      first_name,
      last_name,
      gender,
      email,
      phone_number,
      club_id,
      player_number,
    } = req.body;
    await knex.transaction(async (trx) => {
      await trx(tables.users).insert({
        id: user_id,
        first_name,
        last_name,
        gender,
        email,
        phone_number,
      });
      if (club_id && player_number) {
        await trx(tables.chess_user_data).insert({
          user_id,
          club_id,
          player_number,
        });
      }
    });
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
    let { first_name, last_name, player_number, club_id } = req.body;
    await knex.transaction(async (trx) => {
      await trx(tables.users)
        .update({
          first_name,
          last_name,
          is_registration_completed: true,
        })
        .where({ id: user_id });
      await trx(tables.chess_user_data).insert({
        user_id,
        player_number,
        club_id,
      });
    });
    logger.info(`User ${user_id} completed registration`);
  });

const isRegistrationCompleted = (req, context) =>
  runRequest(req, context, async (_, user_id) => {
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
