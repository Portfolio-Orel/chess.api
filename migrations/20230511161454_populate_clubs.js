const { tables } = require("../src/common/constants");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    // insert this:
  // id - uuid auto generated
// address - בן זכאי 9
// phone_number - ""
// email - ""
// website - ""
// facebook - ""
// instagram - ""
// twitter - ""
// is_active - true
// name - ירושחמט
// created_at - now
// updated_at - now
      
    return knex(tables.clubs).insert({
        id: knex.raw("uuid_generate_v4()"),
        address: "בן זכאי 9",
        phone_number: "",
        email: "",
        website: "",
        facebook: "",
        instagram: "",
        twitter: "",
        is_active: true,
        name: "ירושחמט",
        created_at: knex.fn.now(),
        updated_at: knex.fn.now(),
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(_) {};
    