const { tables } = require("../src/common/constants");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.table(tables.chess_user_data, (table) => {
    table.string("player_number").unique().notNullable();
    table.uuid("club_id").nullable();
    table.foreign("club_id").references("id").inTable(tables.club_details);
    table.renameColumn("is_profile_active", "is_player_active");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.table(tables.chess_user_data, (table) => {
    table.dropColumn("player_number");
    table.dropColumn("club_id");
    table.dropForeign("club_id");
  });
};
