const { tables } = require('../src/common/constants');
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {

    return knex.schema.createTable(tables.users, function(table) {
        table.uuid('id').primary();
        table.string('first_name');
        table.string('last_name');
        table.string('gender');
        table.string('email');
        table.string('phone_number').notNullable().unique();
        table.timestamp('date_of_birth');
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
    return knex.schema.dropTable(tables.users);
};