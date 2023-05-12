const { tables } = require("../src/common/constants");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  // an event_participants table that includes a foreign key to the events table and the users table which are also the primary keys of their respective tables
  return knex.schema.createTable(tables.clubs, function (table) {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.string("name").unique().notNullable();
    table.string("address").unique().notNullable();
    table.string("phone_number").unique();
    table.string("email").unique();
    table.string("website").unique();
    table.string("facebook").unique();
    table.string("instagram").unique();
    table.string("twitter").unique();
    table.boolean("is_active").defaultTo(true);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable(tables.club_details);
};
