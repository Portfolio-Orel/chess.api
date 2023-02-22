const { tables } = require('../src/common/constants');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    // an event_participants table that includes a foreign key to the events table and the users table which are also the primary keys of their respective tables
    return knex.schema.createTable(tables.club_details, function(table) {
        table.uuid('id').primary();
        table.string('address');
        table.string('phone_number');
        table.string('email');
        table.string('website');
        table.string('facebook');
        table.string('instagram');
        table.string('twitter');
        table.boolean('is_active').defaultTo(true);

    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable(tables.club_details);
};