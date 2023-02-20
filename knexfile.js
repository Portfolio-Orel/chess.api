// Update with your config settings.
require('dotenv').config()

module.exports = {

    development: {
        client: 'postgresql',
        connection: {
            database: process.env.DB_NAME,
            user: process.env.USERNAME,
            password: process.env.PASSWORD,
            host: process.env.HOST,
            port: process.env.PORT,
        },
        migrations: {
            directory: './migrations',
            tableName: 'knex_migrations',
        },
    },

    production: {
        client: 'postgresql',
        connection: {
            database: process.env.DB_NAME,
            user: process.env.USERNAME,
            password: process.env.PASSWORD,
            host: process.env.HOST,
            port: process.env.PORT,
        },
        migrations: {
            directory: './migrations',
            tableName: 'knex_migrations',
        },
        pool: {
            min: 2,
            max: 10,
        },
    },

};