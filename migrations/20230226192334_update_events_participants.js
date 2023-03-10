/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.table('events_participants', function(table) {
        table.float('paid_amount').nullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.table('events_participants', function(table) {
        table.dropColumn('paid');
        table.dropColumn('paid_at');
        table.dropColumn('payment_type');
    });
};