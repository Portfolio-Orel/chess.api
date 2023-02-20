const { tables } = require('../src/common/constants');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable(tables.events, function(table) {
        table.string('id').primary();
        table.string('name');
        table.string('description');
        table.string('businessId');
        table.timestamp('date');
        table.float('price');
        table.integer('min_age');
        table.integer('min_rating');
        table.integer('max_rating');
        table.enum('currency', ['ILS', 'USD', 'EUR']);
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