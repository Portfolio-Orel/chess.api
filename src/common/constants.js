require('dotenv').config()

const tables = {
    users: 'users',
    events: 'events',
};

const urls = {
    get_token: `${process.env.BASE_URL}/account/token`,
    get_event: `${process.env.BASE_URL}/items/`,
    create_event: `${process.env.BASE_URL}/items/`,
    update_event: `${process.env.BASE_URL}/items/`,
    delete_event: `${process.env.BASE_URL}/items/`,
}

module.exports = {
    tables,
    urls
}