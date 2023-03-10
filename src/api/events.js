const { runRequest } = require("../common/request_wrapper");
const { tables, urls, PAYMENT_FORM_LANGUAGE, PAYMENT_FORM_TYPE, PAYMENT_FORM_VAT_TYPE } = require("../common/constants");
const { knex } = require("../common/request_wrapper");
const { toDate, now } = require("../utils/date");
const axios = require("axios");
require('dotenv').config()

const getHeaders = (token) => {
    if (token) {
        return {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        };
    } else {
        return {
            headers: {
                "Content-Type": "application/json",
            }
        };
    }
}

const getToken = async() => {
    const result = await axios.post(
        urls.get_token, {
            id: process.env.GREEN_INVOICE_API,
            secret: process.env.GREEN_INVOICE_SECRET,
        }, getHeaders()
    );
    const { data } = result;
    return data ? data.token : "";
}

const getAllEvents = async(req, context) =>
    runRequest(req, context, async(_, __) => await (knex
        .select()
        .from(tables.events)
        .where({ is_active: true })));

const getEvent = async(req, context) =>
    runRequest(req, context, async(_, __) => await knex
        .select()
        .from(tables.events)
        .where({ id: req.pathParameters.event_id }));

const createEvent = (req, context) =>
    runRequest(req, context, async(req, _) => {
        let {
            date,
            name,
            description,
            price,
            currency,
            event_type,
            event_format,
            is_rating_israel,
            is_rating_fide,
            game_id
        } = req.body;
        const result = await knex.insert({
                name,
                description,
                price,
                currency,
                date,
                round_number: 1, // TODO: change according to the rounds number when change to createEvents
                event_type,
                event_format,
                is_rating_israel,
                is_rating_fide,
                game_id,
                date: toDate(date),
                created_at: now(),
                updated_at: now(),
            }).into(tables.events)
            .returning('id');
        return result ? result : {};
    });

const updateEvent = (req, context) => runRequest(req, context, async(req, _) => {
    const { event_id } = req.pathParameters;
    const { name, description, price, currency, min_age, min_rating, max_rating, date } = req.body;

    const result = await knex.update({
        name: name ? name : currentEvent.name,
        description: description ? description : currentEvent.description,
        price: price ? price : currentEvent.price,
        currency: currency ? currency : currentEvent.currency,
        date: date ? toDate(date) : currentEvent.date,
        min_age: min_age ? min_age : currentEvent.min_age,
        min_rating: min_rating ? min_rating : currentEvent.min_rating,
        max_rating: max_rating ? max_rating : currentEvent.max_rating,
        updated_at: now()
    }).where({ id: event_id }).into(tables.events);

    return result ? result.rows : {};

});

const deleteEvent = (req, context) => runRequest(req, context, async(req, _) => {
    const { event_id } = req.pathParameters;
    await knex.update({
        is_active: false,
        update_at: now()
    }).where({ id: event_id }).into(tables.events);
});

const registerToEvent = (req, context) => runRequest(req, context, async(req, user_id) => {
    const { event_id } = req.pathParameters;
    await knex.insert({
        user_id,
        event_id,
        created_at: now(),
        updated_at: now(),
    }).into(tables.events_participants);
    return;
});

const getPaymentForm = async(req, context) => runRequest(req, context, async(req, _) => {
    const { event_id } = req.pathParameters;
    const {
        price,
        quantity,
        currency,
        description,
        client_name,
        emails,
        address,
        city,
        zip,
        country,
        phone_number,
        success_url,
        failure_url
    } = req.body;
    const notify_url = ""; // TODO: Make a lambda function to handle the notify url
    const custom_data = { event_id };
    const token = await getToken();
    const request_body = {
        type: PAYMENT_FORM_TYPE,
        lang: PAYMENT_FORM_LANGUAGE,
        vatType: PAYMENT_FORM_VAT_TYPE,
        currency,
        client: {
            id: "", // TODO: add clientId
            name: client_name,
            emails,
            address,
            city,
            zip,
            country,
            mobile: phone_number,
        },
        income: {
            description,
            quantity,
            price,
            currency,
            vatType: PAYMENT_FORM_VAT_TYPE,
        },
        success_url,
        failure_url,
        notify_url,
        custom: custom_data,
    }
    const result = await axios.post(urls.get_event_payment_form, request_body, getHeaders(token));

    return result ? { error_code: result.errorCode, payment_url: result.url } : {};
});

module.exports = {
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    getAllEvents,
    registerToEvent,
    getPaymentForm
};