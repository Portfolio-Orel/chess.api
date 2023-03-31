const { tables } = require("../src/common/constants");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .table(tables.games, function (table) {
      table.dropColumn("type");
    })
    .then(function () {
      return knex.schema.table(tables.games, function (table) {
        table
          .string("type", ["Bullet", "Blitz", "Rapid", "Classical"])
          .notNullable();
      });
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.table(tables.games, function (table) {
    table.dropColumn("type");
    table
      .string("type", ["bullet", "blitz", "rapid", "classical"])
      .defaultTo("bullet")
      .notNullable();
  });
};
