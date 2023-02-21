const { runRequest } = require("../common/request_wrapper");
const { tables, urls } = require("../common/constants");
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

const getEvent = async(req, context) =>
    runRequest(req, context, async(_, __) => {
        const token = await getToken();
        const { event_id } = req.pathParameters;
        const url = urls.get_event + event_id;
        const result = await axios.get(url, getHeaders());
        const { data } = result;
        return data ? data : {};
    });

const createEvent = (req, context) =>
    runRequest(req, context, async(req, _) => {
        const token = await getToken();
        let {
            name,
            description,
            price,
            currency,
            date,
            min_age,
            min_rating,
            max_rating,
        } = JSON.parse(req.body);

        min_age = min_age ? min_age : 0;
        min_rating = min_rating ? min_rating : 0;
        max_rating = max_rating ? max_rating : 3500;

        const result = await axios.post('https://private-anon-a9934b1f61-greeninvoice.apiary-mock.com/api/v1/items', {
            name,
            description,
            price,
            currency,
        }, getHeaders());
        const { data } = result;
        if (data) {
            await knex(tables.events)
                .insert({
                    id: data.id,
                    businessId: data.businessId,
                    name,
                    description,
                    price,
                    currency,
                    date: toDate(date),
                    min_age,
                    min_rating,
                    max_rating,
                    created_at: toDate(data.creationDate),
                    updated_at: toDate(data.lastUpdateDate),
                });
            data.min_age = min_age;
            data.min_rating = min_rating;
            data.max_rating = max_rating;
            data.date = date;
        }
        return data ? data : {};
    });

const updateEvent = (req, context) => runRequest(req, context, async(req, _) => {
    const token = await getToken();
    const { event_id } = req.pathParameters;
    const { name, description, price, currency, min_age, min_rating, max_rating, date } = JSON.parse(req.body);
    const url = urls.update_event + event_id;
    const body = {
        name,
        description,
        price,
        currency,
    };
    const result = await axios.put(url, body, getHeaders(token));
    const currentEvent = await knex(tables.events).where({ id: event_id }).first();

    await knex.update({
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

    const { data } = result;
    return data ? data : {};

});


const deleteEvent = (req, context) => runRequest(req, context, async(req, _) => {
    const token = await getToken();
    const { event_id } = req.pathParameters;
    const url = urls.delete_event + event_id;
    const result = await axios.delete(url, getHeaders(token));

    await knex.update({
        is_active: false,
    }).where({ id: event_id }).into(tables.events);

    const { data } = result;
    return data ? data : {};
});

module.exports = {
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
};