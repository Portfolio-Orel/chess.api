const { tables } = require('../src/common/constants');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable(tables.events, function(table) {
        table.string('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.timestamp('date').primary().notNullable();
        table.string('name').notNullable();
        table.string('description').nullable();
        table.string('invoice_id').notNullable();
        table.float('price').notNullable();
        table.uuid('game_id').references('id').inTable(tables.games);
        table.enum('currency', ['ILS', 'USD', 'EUR']).defaultTo('ILS');
        table.integer('round_number').nullable();
        table.string('event_type', ['tournament', 'single']).nullable();
        table.string('event_format', ['swiss', 'scheveningen', 'group_duel', 'weinstein', 'levin']).nullable();
        table.boolean('is_rating_israel').nullable();
        table.boolean('is_rating_fide').nullable();
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
    return knex.schema.dropTable(tables.events);
};