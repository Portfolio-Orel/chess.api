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


const getPaymentForm = async(req, context) => runRequest(req, context, async (req, _) => {
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

// When the payment is successful, trigger the android app to send a notification to the user
const onPaymentSuccess = async(req, context) => runRequest(req, context, async (req, _) => {

});

const onPaymentFailure = async(req, context) => runRequest(req, context, async (req, _) => {});

module.exports = {
    getPaymentForm,
    onPaymentSuccess,
    onPaymentFailure
};