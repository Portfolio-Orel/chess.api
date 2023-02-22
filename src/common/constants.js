require('dotenv').config()

const tables = {
    users: 'users',
    events: 'events',
    events_participants: 'events_participants',
    club_details: 'club_details',
    chess_user_data: 'chess_user_data',
};

const urls = {
    get_token: `${process.env.BASE_URL}/account/token`,
    get_event: `${process.env.BASE_URL}/items/`,
    get_all_events: `${process.env.BASE_URL}/items/`,
    create_event: `${process.env.BASE_URL}/items/`,
    update_event: `${process.env.BASE_URL}/items/`,
    delete_event: `${process.env.BASE_URL}/items/`,
}

module.exports = {
    tables,
    urls
}