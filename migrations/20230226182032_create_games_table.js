const { tables } = require('../src/common/constants');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable(tables.games, function(table) {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.integer('time_start_min').defaultTo(1).notNullable();
        table.integer('increment_before_time_control_sec').defaultTo(0);
        table.integer('moves_num_to_time_control').defaultTo(0);
        table.integer('time_bump_after_time_control_min').defaultTo(0);
        table.integer('increment_after_time_control_sec').defaultTo(0);
        table.string('type', ['bullet', 'blitz', 'rapid', 'classical']).notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable(tables.games);
};