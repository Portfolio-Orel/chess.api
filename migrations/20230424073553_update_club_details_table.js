const { tables } = require("../src/common/constants");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  // change club_details to clubs and add name
  return knex.schema
    .renameTable(tables.club_details, tables.clubs)
    .table(tables.clubs, (table) => {
      table.string("name").unique().notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.renameTable(tables.clubs, tables.club_details);
};
