const { tables } = require('../src/common/constants');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    // rename column event_format to game_format and change it to uuid and add foreign key
    return knex.schema.table(tables.events, function(table) {
        table.renameColumn('event_format', 'game_format_id');
        table.uuid('game_format').references('id').inTable(tables.game_formats);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.table(tables.events, function(table) {
        // drop foreign key, change column type to string and rename it to event_format
        table.dropForeign('game_format');
        table.string('game_format');
        table.renameColumn('game_format', 'event_format');
    });
};
