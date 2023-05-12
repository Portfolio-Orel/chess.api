const { runRequest } = require("../common/request_wrapper");
const {
  tables,
  DEFAULT_PAGE_SIZE_EVENTS_PARTICIPANTS,
  DEFAULT_PAGE,
  MAX_PAGE_SIZE_EVENTS_PARTICIPANTS,
} = require("../common/constants");
const { knex } = require("../common/request_wrapper");
const { now } = require("../utils/date");
const { v4 } = require("uuid");

const validatePage = (page) => {
  if (page === undefined) {
    return DEFAULT_PAGE;
  }
  if (isNaN(page) || page < 1) {
    return DEFAULT_PAGE;
  }
  return page;
};

const validatePageSize = (page_size) => {
  if (page_size === undefined) {
    return DEFAULT_PAGE_SIZE_EVENTS_PARTICIPANTS;
  }
  if (isNaN(page_size) || page_size < 1) {
    return DEFAULT_PAGE_SIZE_EVENTS_PARTICIPANTS;
  }
  if (page_size > MAX_PAGE_SIZE_EVENTS_PARTICIPANTS) {
    return MAX_PAGE_SIZE_EVENTS_PARTICIPANTS;
  }
  return page_size;
};

const getRelatedEvents = async (event_id) => {
  const event_details = await knex(tables.events)
    .select("*")
    .where({ id: event_id, is_active: true });
  if (event_details.length === 0) {
    throw new Error("No related events found");
  }
  const related_events = await knex(tables.events)
    .select("*")
    .where({ name: event_details[0].name, is_active: true });
  return related_events;
};

const getEventParticipant = async (req, context) =>
  runRequest(req, context, async (_, user_id) => {
    const { event_id, participant_id } = req.pathParameters;

    const eventParticipants = await knex(tables.events_participants)
      .select("*")
      .where({ event_id, participant_id })
      .first();

    return eventParticipants;
  });

const getEventParticipants = async (req, context) =>
  runRequest(req, context, async (_, user_id) => {
    const { event_id } = req.pathParameters;
    const { page, page_size } = req.pathParameters;

    page = validatePage(page);
    page_size = validatePageSize(page_size);

    const eventParticipants = await knex(tables.events_participants)
      .select("*")
      .where({ event_id })
      .limit(page_size)
      .offset((page - 1) * page_size);
    return eventParticipants;
  });

const getAllEventsParticipants = async (req, context) =>
  runRequest(req, context, async (_, user_id) => {
    const { ids } = req.queryStringParameters;
    const event_ids_array = ids.split(",");
    const eventParticipants = await knex(tables.events_participants)
      .select("*")
      .where({ is_active: true })
      .whereIn("event_id", event_ids_array);
    return eventParticipants;
  });

const getEventParticipantsByUserId = async (req, context) =>
  runRequest(req, context, async (_, user_id) => {
    const result = await knex(tables.events_participants)
      .select("*")
      .where({ user_id });
    return result ? result : {};
  });

const addEventParticipants = async (req, context) =>
  runRequest(req, context, async (_, user_id) => {
    const { event_id } = req.pathParameters;
    let participants = req.body;
    if (Array.isArray(participants) === false) {
      participants = [participants];
    }
    if (participants.length === 0) {
      return [];
    }

    const unique_participants = participants.filter(
      (participant, index, self) =>
        index === self.findIndex((t) => t.user_id === participant.user_id)
    );

    const related_events = await getRelatedEvents(event_id);

    const new_participants = [];
    for (let i = 0; i < related_events.length; i++) {
      for (let j = 0; j < unique_participants.length; j++) {
        new_participants.push({
          id: v4(),
          event_id: related_events[i].id,
          user_id: participants[j].user_id,
          is_paid: participants[j].is_paid,
          paid_at: participants[j].paid_at,
          payment_type: participants[j].payment_type,
          is_active: true,
          created_at: now(),
          updated_at: now(),
        });
      }
    }

    const event_participants = await knex(tables.events_participants)
      .insert(new_participants)
      .onConflict(["event_id", "user_id"])
      .merge({ is_active: true })
      .returning("*");

    return event_participants;
  });

const deleteEventParticipants = async (req, context) =>
  runRequest(req, context, async (_, user_id) => {
    const { ids } = req.queryStringParameters;
    const { event_id } = req.pathParameters;
    const event_participants_ids_array = ids.split(",");
    const related_events = await getRelatedEvents(event_id);

    const eventParticipants = await knex(tables.events_participants)
      .update({ is_active: false, updated_at: now() })
      .whereIn(
        "event_id",
        related_events.map((event) => event.id)
      )
      .whereIn("user_id", event_participants_ids_array)
      .returning("*");
    return eventParticipants;
  });

module.exports = {
  getEventParticipant,
  getEventParticipants,
  getAllEventsParticipants,
  addEventParticipants,
  deleteEventParticipants,
  getEventParticipantsByUserId,
};
