const { runRequest } = require("../common/request_wrapper");
const { tables } = require("../common/constants");
const { knex } = require("../common/request_wrapper");
const { now } = require("../utils/date");

const getEventParticipants = async(req, context) => runRequest(req, context, async(_, __) => {
    const { event_id } = req.params;
    const { page, page_size } = req.query;
    const eventParticipants = await knex(tables.events_participants)
        .select("*")
        .where({ event_id })
        .limit(page_size)
        .offset((page - 1) * page_size);
    return eventParticipants;
});

const getAllEventsParticipants = async(req, context) => runRequest(req, context, async(_, __) => {
    const { page, page_size } = req.query;
    const eventParticipants = await knex(tables.events_participants)
        .select("*")
        .limit(page_size)
        .offset((page - 1) * page_size);
    return eventParticipants;
});

const addEventParticipants = async(req, context) => runRequest(req, context, async(_, __) => {
    const { event_id } = req.params;
    const { user_ids } = req.body;
    // Add all users to the event   
    const eventParticipant = await knex(tables.events_participants)
        .insert(user_ids.map(user_id => ({
            event_id,
            user_id,
            created_at: now(),
            updated_at: now(),
            is_active: true
        })));
    return eventParticipant;
});

const deleteEventParticipant = async(req, context) => runRequest(req, context, async(_, __) => {
    const { event_id, user_id } = req.params;
    const eventParticipant = await knex(tables.events_participants)
        .update({ is_active: false })
        .where({ event_id, user_id })
    return eventParticipant;
});

module.exports = {
    getEventParticipants,
    addEventParticipants,
    deleteEventParticipant,
    getAllEventsParticipants
}