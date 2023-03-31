const { tables } = require("../src/common/constants");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  // insert values:
  /**
   * time_start_min: 1, increment_before_time_control_sec: 0, moves_num_to_time_control: 0, time_bump_after_time_control_min: 0, increment_after_time_control_sec: 0, type: 'Bullet'
   * * time_start_min: 1, increment_before_time_control_sec: 1, moves_num_to_time_control: 0, time_bump_after_time_control_min: 0, increment_after_time_control_sec: 0, type: 'Bullet'
   * time_start_min: 3, increment_before_time_control_sec: 0, moves_num_to_time_control: 0, time_bump_after_time_control_min: 0, increment_after_time_control_sec: 0, type: 'Blitz'
   * time_start_min: 5, increment_before_time_control_sec: 0, moves_num_to_time_control: 0, time_bump_after_time_control_min: 0, increment_after_time_control_sec: 0, type: 'Blitz'
   * time_start_min: 10, increment_before_time_control_sec: 0, moves_num_to_time_control: 0, time_bump_after_time_control_min: 0, increment_after_time_control_sec: 0, type: 'Rapid'
   * time_start_min: 3, increment_before_time_control_sec: 2, moves_num_to_time_control: 40, time_bump_after_time_control_min: 0, increment_after_time_control_sec: 0, type: 'Blitz'
   * time_start_min: 5, increment_before_time_control_sec: 3, moves_num_to_time_control: 40, time_bump_after_time_control_min: 0, increment_after_time_control_sec: 0, type: 'Blitz'
   * time_start_min: 10, increment_before_time_control_sec: 5, moves_num_to_time_control: 40, time_bump_after_time_control_min: 0, increment_after_time_control_sec: 0, type: 'Rapid'
   * time_start_min: 60, increment_before_time_control_sec: 30, moves_num_to_time_control: 0, time_bump_after_time_control_min: 0, increment_after_time_control_sec: 0, type: 'classical'
   */
  return knex(tables.games).insert([
    {
      time_start_min: 1,
      increment_before_time_control_sec: 0,
      moves_num_to_time_control: 0,
      time_bump_after_time_control_min: 0,
      increment_after_time_control_sec: 0,
      type: "Bullet",
    },
    {
      time_start_min: 1,
      increment_before_time_control_sec: 1,
      moves_num_to_time_control: 0,
      time_bump_after_time_control_min: 0,
      increment_after_time_control_sec: 0,
      type: "Bullet",
    },
    {
      time_start_min: 3,
      increment_before_time_control_sec: 0,
      moves_num_to_time_control: 0,
      time_bump_after_time_control_min: 0,
      increment_after_time_control_sec: 0,
      type: "Blitz",
    },
    {
      time_start_min: 5,
      increment_before_time_control_sec: 0,
      moves_num_to_time_control: 0,
      time_bump_after_time_control_min: 0,
      increment_after_time_control_sec: 0,
      type: "Blitz",
    },
    {
      time_start_min: 10,
      increment_before_time_control_sec: 0,
      moves_num_to_time_control: 0,
      time_bump_after_time_control_min: 0,
      increment_after_time_control_sec: 0,
      type: "Rapid",
    },
    {
      time_start_min: 3,
      increment_before_time_control_sec: 2,
      moves_num_to_time_control: 40,
      time_bump_after_time_control_min: 0,
      increment_after_time_control_sec: 0,
      type: "Blitz",
    },
    {
      time_start_min: 5,
      increment_before_time_control_sec: 3,
      moves_num_to_time_control: 40,
      time_bump_after_time_control_min: 0,
      increment_after_time_control_sec: 0,
      type: "Blitz",
    },
    {
      time_start_min: 10,
      increment_before_time_control_sec: 5,
      moves_num_to_time_control: 40,
      time_bump_after_time_control_min: 0,
      increment_after_time_control_sec: 0,
      type: "Rapid",
    },
    {
      time_start_min: 60,
      increment_before_time_control_sec: 30,
      moves_num_to_time_control: 0,
      time_bump_after_time_control_min: 0,
      increment_after_time_control_sec: 0,
      type: "Classical",
    },
  ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex(tables.games).del();
};
