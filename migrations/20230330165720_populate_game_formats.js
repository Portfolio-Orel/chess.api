const { tables } = require("../src/common/constants");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  // add the following game formats:
  // 'swiss', 'scheveningen', 'group_duel', 'weinstein', 'levin'
  // No description is needed for now
  // is_active should be true
  // created_at and updated_at should be the current time
  // uuid should be generated using uuid_generate_v4()
  // name should be one of the following: 'swiss', 'scheveningen', 'group_duel', 'weinstein', 'levin'
  // Assume the table exists
  return knex(tables.game_formats).insert([
    {
      id: knex.raw("uuid_generate_v4()"),
      name: "Swiss",
      description: null,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: knex.raw("uuid_generate_v4()"),
      name: "Scheveningen",
      description: null,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: knex.raw("uuid_generate_v4()"),
      name: "Group Duel",
      description: null,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: knex.raw("uuid_generate_v4()"),
      name: "Weinstein",
      description: null,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: knex.raw("uuid_generate_v4()"),
      name: "Levin",
      description: null,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex(tables.game_formats)
    .where("name", "in", [
      "Swiss",
      "Scheveningen",
      "Group Duel",
      "Weinstein",
      "Levin",
    ])
    .del();
};
