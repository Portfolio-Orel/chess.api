const { randomDigits } = require("crypto-secure-random-digit");
const aws = require("aws-sdk");

const ses = new aws.SES({ region: "us-east-1" });
const AWS = require("aws-sdk");

const createAuthChallenge = async (event = {}) => {
  try {
    let secretLoginCode;
    if (!event.request?.session || event.request?.session?.length === 0) {
      var emailAddress = event.request.userAttributes.email;
      secretLoginCode = randomDigits(6).join("");
      await sendEmailviaSES(emailAddress, secretLoginCode);
      console.log("email sent with code: ", secretLoginCode);
    } else {
      const previousChallenge = event.request.session.slice(-1)[0];
      secretLoginCode =
        previousChallenge.challengeMetadata.match(/CODE-(\d*)/)[1];
      console.log("email not sent. code: ", secretLoginCode);
    }
    event.response.publicChallengeParameters = {
      email: event.request.userAttributes.email,
    };
    event.response.challengeMetadata = `CODE-${secretLoginCode}`;
    return event;
  } catch (err) {
    console.log("CreateAuthChallenge Failed with:", err);
    throw err;
  }
};

const sendEmailviaSES = async (emailAddress, secretCode) => {
  const params = {
    Destination: {
      ToAddresses: [emailAddress],
    },
    Message: {
      Body: {
        Text: {
          Data: `Your verification code is ${secretCode}`,
        },
      },
      Subject: {
        Data: "Verification code",
      },
    },
    Source: "thischessapp@gmail.com",
  };
  return ses.sendEmail(params).promise();
};

const defineAuthChallenge = async (event) => {
  try {
    console.log("event: ", event);
    if (
      event.request.session &&
      event.request.session.find(
        (attempt) =>
          attempt.challengeName === "CUSTOM_CHALLENGE" &&
          !attempt.challengeResult
      )
    ) {
      console.log("first if");
      event.response.issueTokens = false;
      event.response.failAuthentication = false;
    } else if (
      event.request.session &&
      event.request.session.length >= 3 &&
      event.request.session.slice(-1)[0].challengeResult === false
    ) {
      console.log("second if");
      event.response.issueTokens = false;
      event.response.failAuthentication = true;
    } else if (
      event.request.session &&
      event.request.session.length &&
      event.request.session.slice(-1)[0].challengeResult === true &&
      event.request.session.slice(-1)[0].challengeName === "CUSTOM_CHALLENGE"
    ) {
      console.log("third if");
      event.response.issueTokens = true;
      event.response.failAuthentication = false;
    } else {
      console.log("else");
      event.response.issueTokens = false;
      event.response.failAuthentication = false;
      event.response.challengeName = "CUSTOM_CHALLENGE";
    }

    return event;
  } catch (err) {
    console.log("DefineAuthChallenge Failed with:", err);
    throw err;
  }
};

const verifyAuthChallengeResponse = async (event) => {
  try {
    const expectedAnswer =
      event.request.privateChallengeParameters.secretLoginCode;
    console.log(
      "expected vs entered: ",
      event.request.privateChallengeParameters.secretLoginCode,
      event.request.challengeAnswer
    );
    if (event.request.challengeAnswer === expectedAnswer) {
      event.response.answerCorrect = true;
    } else {
      event.response.answerCorrect = false;
    }
    return event;
  } catch (err) {
    console.log("VerifyAuthChallengeResponse Failed with:", err);
    throw err;
  }
};

module.exports = {
  createAuthChallenge,
  defineAuthChallenge,
  verifyAuthChallengeResponse,
};
