const { tables } = require('../src/common/constants');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    // an event_participants table that includes a foreign key to the events table and the users table which are also the primary keys of their respective tables
    return knex.schema.createTable(tables.events_participants, function(table) {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('event_id').references('id').inTable(tables.events);
        table.uuid('user_id').references('id').inTable(tables.users);
        table.unique(['event_id', 'user_id']);
        table.boolean('is_active').defaultTo(true);
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());

    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable(tables.events_participants);
};