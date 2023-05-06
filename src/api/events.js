const { runRequest } = require("../common/request_wrapper");
const { tables } = require("../common/constants");
const { knex } = require("../common/request_wrapper");
const { toDate, now } = require("../utils/date");
require("dotenv").config();

const getAllEvents = async (req, context) =>
  runRequest(req, context, async (_, __) => {
    const result = await knex
      .select()
      .from(tables.events)
      //   .leftJoin(
      //     "events_participants",
      //     "events.id",
      //     "events_participants.event_id"
      //   )
      .where(`${tables.events}.is_active`, true);
    return result ? result : {};
  });

const getEvent = async (req, context) =>
  runRequest(
    req,
    context,
    async (_, __) =>
      await knex
        .select()
        .from(tables.events)
        .where({ id: req.pathParameters.event_id })
  );

const createEvent = (req, context) =>
  // TODO: Make event belong to club
  runRequest(req, context, async (req, _, user_id) => {
    let {
      dates,
      name,
      description,
      price,
      currency,
      game_format_id,
      is_rating_israel,
      is_rating_fide,
      game_id,
    } = req.body;

    if (!Array.isArray(dates)) {
      dates = [dates];
    }

    const user = await knex(tables.users)
      .select("users.*", "roles.name as role")
      .join("users_roles", "users.id", "users_roles.user_id")
      .join("roles", "users_roles.role_id", "roles.id")
      .where("users.id", user_id)
      .where("users.is_active", true)
      .first();

    if (user.role !== "admin" && user.role !== "super_admin") {
      return {
        error: "You are not authorized to create events",
        code: 401,
      };
    }

    let round_number = 1;

    const events = dates.map((date) => ({
      name,
      description,
      price,
      currency,
      game_format_id,
      is_rating_israel,
      is_rating_fide,
      game_id,
      round_number: round_number++,
      date: toDate(date),
      created_at: now(),
      updated_at: now(),
      is_active: true,
    }));
    const result = await knex(tables.events).insert(events).returning("*");
    return result ? result : {};
  });

const updateEvent = (req, context) =>
  runRequest(req, context, async (req, _) => {
    const { event_id } = req.pathParameters;
    const {
      name,
      description,
      price,
      currency,
      min_age,
      min_rating,
      max_rating,
      date,
    } = req.body;

    const result = await knex
      .update({
        name: name ? name : currentEvent.name,
        description: description ? description : currentEvent.description,
        price: price ? price : currentEvent.price,
        currency: currency ? currency : currentEvent.currency,
        date: date ? toDate(date) : currentEvent.date,
        min_age: min_age ? min_age : currentEvent.min_age,
        min_rating: min_rating ? min_rating : currentEvent.min_rating,
        max_rating: max_rating ? max_rating : currentEvent.max_rating,
        updated_at: now(),
      })
      .where({ id: event_id })
      .into(tables.events);

    return result ? result.rows : {};
  });

const deleteEvent = (req, context) =>
  runRequest(req, context, async (req, _) => {
    const { event_id } = req.pathParameters;
    await knex
      .update({
        is_active: false,
        update_at: now(),
      })
      .where({ id: event_id })
      .into(tables.events);
  });

const registerToEvent = (req, context) =>
  runRequest(req, context, async (req, _, user_id) => {
    const { event_id } = req.pathParameters;
    const event_participant = await knex
      .insert({
        user_id,
        event_id,
        created_at: now(),
        updated_at: now(),
      })
      .into(tables.events_participants)
      .returning("*");
    return event_participant ? event_participant[0] : {};
  });

module.exports = {
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getAllEvents,
  registerToEvent,
};
