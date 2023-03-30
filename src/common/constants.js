require('dotenv').config()

const PAYMENT_FORM_TYPE = 320;
const PAYMENT_FORM_LANGUAGE = "he";
const PAYMENT_FORM_VAT_TYPE = 0;

const DEFAULT_PAGE_SIZE_EVENTS_PARTICIPANTS = 10;
const MAX_PAGE_SIZE_EVENTS_PARTICIPANTS = 100;
const DEFAULT_PAGE = 1;

const tables = {
    users: 'users',
    events: 'events',
    events_participants: 'events_participants',
    club_details: 'club_details',
    chess_user_data: 'chess_user_data',
    games: 'games',
    game_formats: 'game_formats',
};

const urls = {
    get_token: `${process.env.BASE_URL}/account/token`,
    get_event: `${process.env.BASE_URL}/items/`,
    get_all_events: `${process.env.BASE_URL}/items/`,
    create_event: `${process.env.BASE_URL}/items/`,
    update_event: `${process.env.BASE_URL}/items/`,
    delete_event: `${process.env.BASE_URL}/items/`,
    get_event_payment_form: `${process.env.BASE_URL}/payments/form`,
}

module.exports = {
    tables,
    urls,
    PAYMENT_FORM_TYPE,
    PAYMENT_FORM_LANGUAGE,
    PAYMENT_FORM_VAT_TYPE,
    DEFAULT_PAGE,
    DEFAULT_PAGE_SIZE_EVENTS_PARTICIPANTS,
    MAX_PAGE_SIZE_EVENTS_PARTICIPANTS
}