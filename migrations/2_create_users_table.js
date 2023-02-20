/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('users', function(table) {
        table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
        table.string('first_name');
        table.string('last_name');
        table.string('gender');
        table.string('email');
        table.string('phone_number')
        table.string('player_number');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('users');
};