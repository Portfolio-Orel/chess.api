/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    // return knex.schema.table('events', function(table) {
    //     table.dropColumn('invoice_id');
    // });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.table('events', function(table) {
        table.string('invoice_id').notNullable();
    });
};