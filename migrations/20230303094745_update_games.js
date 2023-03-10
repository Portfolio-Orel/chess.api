const { tables } = require('../src/common/constants');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    // add isactive default true
    return knex.schema.table(tables.games, function(table) {
        table.boolean('is_active').defaultTo(true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.table(tables.games, function(table) {
        table.dropColumn('is_active');
    });
};