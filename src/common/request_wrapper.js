require("dotenv").config();

const knex = require("knex")({
  client: "pg",
  connection: {
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
  migrations: {
    tableName: "migrations",
  },
});

const runRequest = async (req, context, request, check_club_id = false) => {
  let result = {};
  try {
    let club_id = null;
    if (check_club_id) {
      club_id = resolveClubId(req);
    }
    const user_id = resolveUserId(req);
    console.log(user_id);
    context.callbackWaitsForEmptyEventLoop = false;
    req.body = JSON.parse(req.body ? req.body : "{}");

    result = await request(req, club_id, user_id);

    console.log(result);
    return {
      statusCode: result?.code ?? 200,
      body: JSON.stringify(result ? result : {}),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: error.code ?? 500,
      body: JSON.stringify({
        body: result ? result : {},
      }),
      error: "Request failed.",
    };
  }
};

const runRequestCallback = async (req, context, request) => {
  try {
    const club_id = resolveClubId(req);
    await request(req, club_id, callback, callbackError);
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        body: result ? result : {},
      }),
      error: "Request failed.",
    };
  }
};

const resolveClubId = (req) => {
  const { club_id } = req.headers;
  // if (!club_id) {
  //     throw Error('Did you add club_id to the headers?');
  // }
  const regexExpUUID =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
  if (regexExpUUID.test(club_id)) {
    return club_id;
  } else {
    throw Error("club_id is not a uuid.");
  }
};

const resolveUserId = (req) => {
  const { UserId } = req.headers;
  const { userid } = req.headers;
  // if (!UserId && !userid) {
  //   throw Error("Did you add UserId to the headers?");
  // }
  const regexExpUUID =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
  return UserId ? UserId : userid;
  // if (regexExpUUID.test(UserId)) {
  //   return UserId;
  // } else if (regexExpUUID.test(userid)) {
  //   return userid;
  // } else {
  //   throw Error("userId is not a uuid.");
  // }
};

const callbackError = (res, error) => {
  console.log(error);
  return {
    statusCode: 200,
    body: JSON.stringify({
      body: result ? result : {},
    }),
  };
};

const callback = (result) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      body: result ? result : {},
    }),
  };
};

/* Knex Debugging */

// function isTransactionStart(querySpec) {
//   return querySpec.sql === 'BEGIN;';
// }

// function isTransactionEnd(querySpec) {
//   return querySpec.sql === 'COMMIT;' || querySpec.sql === 'ROLLBACK;';
// }

// const transactionDurations = {};

// knex.on('query', querySpec => {
//   console.log('On query', querySpec);

//   if (isTransactionStart(querySpec)) {
//     if (transactionDurations[querySpec.__knexUid]) {
//       console.error('New transaction started, before earlier was ended');
//       return;
//     }
//     transactionDurations[querySpec.__knexUid] = new Date().getTime();
//   }

//   if (isTransactionEnd(querySpec)) {
//     const startTime = transactionDurations[querySpec.__knexUid];
//     if (!startTime) {
//       console.error('Transaction end detected, but start time not found');
//     }
//     const endTime = new Date().getTime();
//     transactionDurations[querySpec.__knexUid] = null;
//     console.log('TRANSACTION DURATION', endTime - startTime);
//   }
// });

// // just as an example of other available events to show when they are called
// knex.on('query-response', (res, querySpec) => {
//   console.log('On query response', res, querySpec);
// });

// knex.on('query-error', (err, querySpec) => {
//   console.log('On query error', err, querySpec);
// });
/* Knex Debugging */

module.exports = {
  runRequest,
  knex,
  runRequestCallback,
};
