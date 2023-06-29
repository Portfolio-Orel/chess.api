const { runRequest } = require("../common/request_wrapper");
const { tables } = require("../common/constants");
const { knex } = require("../common/request_wrapper");
const { fetchRating } = require("./rating");
const { toDate } = require("../utils/date");
const logger = require("../common/logger");
const clubs_mappping = require("../../clubs_map.json");

const UserNotFoundError = require("../common/errors/user_not_found");
const ClubNotFoundError = require("../common/errors/club_not_found");

const getUser = async (req, context) =>
  runRequest(
    req,
    context,
    async (req, __) => {
      const user_id = req.pathParameters.user_id;
      const result = await knex(tables.users)
        .select(`${tables.users}.*`, `${tables.roles}.name as role`)
        .join()
        .join(tables.users_roles, "users.id", `${tables.users_roles}.user_id`)
        .join(tables.roles, "users_roles.role_id", `${tables.roles}.id`)
        .where(`${tables.users}.id`, user_id)
        .where(`${tables.users}.is_active`, true)
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
            rating_israel: result.rating_israel,
            rating_fide: result.rating_fide,
            rating_rapid: result.rating_rapid,
            rating_blitz: result.rating_blitz,
            date_of_birth: result.date_of_birth,
            profile_expiration_date: result.profile_expiration_date,
            role: result.role,
          }
        : null;
      logger.info(`User ${user_id} was fetched`);
      if (!user) {
        throw new UserNotFoundError(`User ${user_id} was not found`);
      }
      return user;
    },
    false
  );

const createUser = (req, context) =>
  runRequest(req, context, async (req, user_id) => {
    const {
      email,
      phone_number,
      player_number,
      gender,
      date_of_birth,
      notification_token,
    } = req.body;

    const gender_lower = gender.toLowerCase();
    const player_details = await fetchRating(player_number);
    logger.info(`Player details: ${JSON.stringify(player_details)}`);
    const club_name_lower = player_details.club_name.toLowerCase();
    if (!clubs_mappping[club_name_lower]) {
      throw new ClubNotFoundError(
        `Club ${player_details.club_name} was not found in mapping file`
      );
    }
    let club_id;
    let club;
    const result_club = await knex(tables.clubs).where(
      "name",
      clubs_mappping[club_name_lower]
    );
    if (result_club && result_club.length > 0) {
      club = result_club[0];
      club_id = result_club[0].id;
    } else {
      throw new ClubNotFoundError(
        `Club ${player_details.club_name} was not found in db`
      );
    }

    await knex.transaction(async (trx) => {
      await trx(tables.users).insert({
        id: user_id,
        first_name: player_details.first_name,
        last_name: player_details.last_name,
        gender: gender_lower,
        email,
        phone_number,
        date_of_birth: toDate(date_of_birth),
        is_registration_completed: true,
        notification_token,
      });
      if (club_id && player_number) {
        await trx(tables.chess_user_data).insert({
          user_id,
          club_id,
          rating_israel: player_details.rating_israel,
          rating_fide: player_details.rating_fide ?? 0,
          rating_fide_blitz: player_details.rating_fide_blitz ?? 0,
          rating_fide_rapid: player_details.rating_fide_rapid ?? 0,
          player_number,
          profile_expiration_date: player_details.profile_expiration_date,
        });
      }
    });
    logger.info(`User ${user_id} was created`);
    return {
      id: user_id,
      gender,
      email,
      phone_number,
      player_number,
      club,
      first_name: player_details.first_name,
      last_name: player_details.last_name,
      rating_israel: player_details.rating_israel,
      rating_fide: player_details.rating_fide,
      rating_fide_rapid: player_details.rating_fide_rapid,
      rating_fide_blitz: player_details.rating_fide_blitz,
      profile_expiration_date: player_details.profile_expiration_date,
      full_name: player_details.full_name,
    };
  });

const updateUser = (req, context) =>
  runRequest(req, context, async (req, user_id) => {
    let { first_name, last_name, date_of_birth, gender, notification_token } =
      req.body;
    date_of_birth = toDate(date_of_birth);
    await knex.transaction(async (trx) => {
      const user = await trx(tables.users).where("id", user_id).first();
      if (!user) {
        throw new UserNotFoundError(`User ${user_id} was not found`);
      }
      await knex(tables.users)
        .update({
          first_name: first_name ?? user.first_name,
          last_name: last_name ?? user.last_name,
          date_of_birth: date_of_birth ?? user.date_of_birth,
          gender: gender ?? user.gender,
          notification_token: notification_token ?? user.notification_token,
        })
        .where("id", user_id);
    });
    logger.info(`User ${user_id} was updated`);
    return {
      id: user_id,
      first_name,
      last_name,
      date_of_birth,
      gender,
      notification_token,
    };
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
