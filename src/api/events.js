const { runRequest } = require("../common/request_wrapper");
const { tables, urls } = require("../common/constants");
const { knex } = require("../common/request_wrapper");
const { toDate } = require("../utils/date");
const axios = require("axios");

const getEvent = async(req, context) =>
    runRequest(req, context, async(_, __) => {
        const { event_id } = req.pathParameters;
        const url = urls.get_event + event_id;
        const result = await axios.get(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer JWT",
            },
        });
        const { data } = result;
        return data ? data : {};
    });

const createEvent = (req, context) =>
    runRequest(req, context, async(req, _) => {
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
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer JWT'
            },
        });
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
module.exports = {
    getEvent,
    createEvent
};