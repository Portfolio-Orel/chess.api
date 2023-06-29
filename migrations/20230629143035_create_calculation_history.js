const { tables } = require("../src/common/constants");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(tables.calculation_history, function (table) {
    table.id = table.increments("id").primary();
    table.previous_rating = table.integer("previous_rating").notNullable();
    table.new_rating = table.integer("new_rating").notNullable();
    table.user_id = table.uuid("user_id").notNullable();
    table.created_at = table.timestamp("created_at").defaultTo(knex.fn.now());
    table.is_active = table.boolean("is_active").defaultTo(true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  knex.schema.dropTable(tables.calculation_history);
};
