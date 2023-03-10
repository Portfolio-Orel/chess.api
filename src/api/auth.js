const aws = require('aws-sdk');
const { runRequest } = require('../common/request_wrapper');
import { randomDigits } from 'crypto-secure-random-digit';

const sns = new aws.SNS({ region: 'us-east-1' });

const createAuthChallenge = async(req, context) => runRequest(req, context, async(_, __) => {
    const { phone_number } = req.body;
    const message = `Your verification code is ${randomDigits(6).join('')}.`;
    const params = {
        Message: message,
        PhoneNumber: phone_number,
    };
    const result = await sns.publish(params).promise();
    console.log("result: ", result);
    return result;
}, false);

const defineAuthChallenge = async(event) => {
    const singleSessionLengthAndSRP = event.request.session.length === 1 &&
        event.request.session[0].challengeName === 'SRP_A';
    const secondSessionCustomChallenge = event.request.session.length === 2 &&
        event.request.session[1].challengeName === 'CUSTOM_CHALLENGE' &&
        event.request.session[1].challengeResult === true

    if (singleSessionLengthAndSRP) {
        event.response.issueTokens = false;
        event.response.failAuthentication = false;
        event.response.challengeName = 'CUSTOM_CHALLENGE';
    } else if (secondSessionCustomChallenge) {
        event.response.issueTokens = true;
        event.response.failAuthentication = false;
        event.response.challengeName = 'CUSTOM_CHALLENGE';
    } else {
        event.response.issueTokens = false;
        event.response.failAuthentication = true;
    }
};

const verifyAuthChallengeResponse = async(event) => {
    if (
        event.request.privateChallengeParameters.answer ===
        event.request.challengeAnswer
    ) {
        event.response.answerCorrect = true;
    } else {
        event.response.answerCorrect = false;
    }
}

module.exports = {
    createAuthChallenge,
    defineAuthChallenge,
    verifyAuthChallengeResponses
};