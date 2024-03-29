const { tables } = require("../src/common/constants");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(tables.chess_user_data, function (table) {
    table.uuid("user_id").references("id").inTable(tables.users).primary();
    table.integer("year_of_birth").notNullable();
    table.string("title").nullable();
    table.string("player_number").unique().notNullable();
    table.integer("rating_israel").notNullable();
    table.integer("rating_expected").notNullable();
    table.integer("rating_fide").defaultTo(0);
    table.string("player_number_fide").unique();
    table.boolean("is_active").defaultTo(true);
    table.timestamp("profile_expiration_date").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable(tables.chess_user_data);
};
