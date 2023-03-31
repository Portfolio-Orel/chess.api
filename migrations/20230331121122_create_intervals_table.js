const { tables } = require("../src/common/constants");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable(tables.intervals, function (table) {
      table.string("uuid").primary().defaultTo(knex.raw("uuid_generate_v4()"));
      table.string("name").notNullable();
      table.integer("value").notNullable();
      table.string("description").nullable();
      table.boolean("is_active").defaultTo(true);
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
    .then(() => {
      return knex(tables.intervals).insert([
        { name: "Day", value: 1, description: "day" },
        { name: "Week", value: 7, description: "week" },
        { name: "Month", value: 30, description: "month" },
        { name: "Custom", value: -1, description: "custom" },
      ]);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable(tables.intervals);
};
