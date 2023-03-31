const { runRequest } = require("../common/request_wrapper");
const { tables } = require("../common/constants");
const { knex } = require("../common/request_wrapper");
require('dotenv').config()

const getIntervals = async (req, context) => runRequest(req, context, async (_, __) => {
  const result = await knex
    .select()
    .from(tables.intervals)
    .where({ is_active: true });
  return result;
});

const createInterval = (req, context) =>
  runRequest(req, context, async (req, _) => {
    let { name, value, description } = req.body;
    const result = await knex.insert({
      name,
      value,
      description,
    }).into(tables.intervals);
    return result;
  });

const updateInterval = (req, context) =>
  runRequest(req, context, async (req, _) => {
    let { name, value, description } = req.body;
    const result = await knex(tables.intervals)
      .where({ uuid: req.pathParameters.uuid })
      .update({
        name,
        value,
        description,
        updated_at: knex.fn.now(),
      });
    return result;
  });

const deleteInterval = (req, context) =>
  runRequest(req, context, async (req, _) => {
    const result = await knex(tables.intervals)
      .where({ uuid: req.pathParameters.uuid })
      .update({ is_active: false });
    return result;
  });

module.exports = {
  getIntervals,
  createInterval,
  updateInterval,
  deleteInterval,
};
