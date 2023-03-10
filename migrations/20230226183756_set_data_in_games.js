const { v4 } = require('uuid');
const { tables } = require('../src/common/constants');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.insert([{
            id: v4(),
            time_start_min: 3,
            increment_before_time_control_sec: 2,
            moves_num_to_time_control: null,
            time_bump_after_time_control_min: null,
            increment_after_time_control_sec: null,
            type: 'blitz'
        },
        {
            id: v4(),
            time_start_min: 15,
            increment_before_time_control_sec: 5,
            moves_num_to_time_control: null,
            time_bump_after_time_control_min: null,
            increment_after_time_control_sec: null,
            type: 'rapid'
        },
        {
            id: v4(),
            time_start_min: 50,
            increment_before_time_control_sec: 10,
            moves_num_to_time_control: null,
            time_bump_after_time_control_min: null,
            increment_after_time_control_sec: null,
            type: 'classical'
        },
        {
            id: v4(),
            time_start_min: 60,
            increment_before_time_control_sec: 30,
            moves_num_to_time_control: null,
            time_bump_after_time_control_min: null,
            increment_after_time_control_sec: null,
            type: 'classical'
        },
    ]).into(tables.games);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {

};