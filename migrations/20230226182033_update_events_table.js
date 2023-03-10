const { tables } = require('../src/common/constants');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.table(tables.events, function(table) {
        table.foreign('game_id').references('id').inTable(tables.games);
    });
};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.table(tables.events, function(table) {
        table.dropColumn('game_id').foreign('game_id').references('id').inTable(tables.games);
    });
};