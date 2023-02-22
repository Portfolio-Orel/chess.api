/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = (knex) => {
    return knex.schema.createTable(tables.chess_user_data, function(table) {
        table.uuid('user_id').references('id').inTable(tables.users).primary();
        table.integer('rating');
        table.boolean('is_profile_active').notNullable().defaultTo(false);
        table.boolean('is_active').defaultTo(true);
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = function(knex) {

};

module.exports = {
    up,
    down
}