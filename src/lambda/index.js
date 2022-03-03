/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');

// TODO: Add 10 facts each containing a four-digit year

const facts = [
    "The field of AI is considered to have its origin in 1950, with publication of British mathematician Alan Turing's paper, Computing Machinery and Intelligence.",
    "The term Artificial Intelligence was coined in 1956 by mathematician and computer scientist John McCarthy, at Dartmouth College, in New Hampshire.",
    "The field of AI picked up after a brief break when IBM's computer, the Deep Blue, beat a chess champion in 1997.",
    "Alan Turing, a British mathematician and computer scientist, developed the Turing Test in 1950, which is a competition that assesses machine intelligence.",
    "The first AI program was called the Logic Theorist, and was first presented at the Dartmouth Summer Research Project on Artificial Intelligence Conference in 1956.",
    "In 1997, Dragon Systems developed the first speech recognition software and it was implemented on Windows.",
    "The most popular programming language for artificial intelligence research is called Lisp, and it was developed by John McCarthy in 1958.",
    "ELIZA, an interactive computer program that could converse with humans, was developed by Joseph Weizenbaum, a computer scientist and professor, in 1965.",
    "In 1986, Mercedes-Benz released the first driverless van.",
    "Cynthia Breazeal, a professor, developed Kismet, a robot that could recognize and mimic emotions, in 2000."
];

const GetNewFactHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
        && request.intent.name === 'GetNewFactIntent';
  },
  handle(handlerInput) {
    const factArr = facts;
    const factIndex = Math.floor(Math.random() * factArr.length);
    const randomFact = factArr[factIndex];
    const speechOutput = GET_FACT_MESSAGE + randomFact;

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(SKILL_NAME, randomFact)
      .getResponse();
  },
};

// TODO: Create a handler for the GetNewYearFactHandler intent
// Use the handler above as a template
// ============================================================

const GetNewYearFactHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest' 
      || (request.type === 'IntentRequest' 
        && request.intent.name === 'GetNewYearFactIntent');

  }, 
  handle(handlerInput) {
    const intent = handlerInput.requestEnvelope.request.intent;
    var returnRandomFact = false;

    if ((typeof intent !== 'undefined') &&
        (typeof intent.slots !== 'undefined')&&
        (typeof intent.slots.FACT_YEAR !== 'undefined')){

          var year = handlerInput.requestEnvelope.request.intent.slots.FACT_YEAR.value

          var yearFacts = searchYearFact(facts, year)
          if (yearFacts.length > 0)
          {

            var randomFact = randomPhrase(yearFacts);

            var speechOutput =  randomFact;
          }
          else
            returnRandomFact = true
    }
    else
      returnRandomFact = true

    if (returnRandomFact){

      var factArr = facts;
      var randomFact = randomPhrase(factArr);
      var speechOutput = randomFact;
    }

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(SKILL_NAME, randomFact)
      .getResponse();
  },
};

// Search for facts with the given year 

function searchYearFact(facts, year){

  var yearsArr = [];
  for (var i = 0; i < facts.length; i++) {

      // Return list of facts for given year 

      var yearFound = grepFourDigitNumber(facts[i], year);

      // Return empty array if no year is found 

      if (yearFound != null) {
          yearsArr.push(yearFound)
      }
  };
  return yearsArr
}

// Search string for given year

function grepFourDigitNumber(myString, year) {

  var txt=new RegExp(year);
    if (txt.test(myString)) {
        return myString;
    }
    else {
        return null
    }
}

// Return random phrase from selection

function randomPhrase(phraseArr) {

  var i = 0;
    i = Math.floor(Math.random() * phraseArr.length);
    return (phraseArr[i]);
};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
      .reprompt(HELP_REPROMPT)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(STOP_MESSAGE)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, an error occurred.')
      .reprompt('Sorry, an error occurred.')
      .getResponse();
  },
};

const SKILL_NAME = 'History Facts';
const GET_FACT_MESSAGE = 'Here\'s your fact: ';
const HELP_MESSAGE = 'You can say tell me a history fact, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';


const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    GetNewFactHandler,
    // TODO: Add the handler you create above to this list of handlers
    GetNewYearFactHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();

exports.facts = facts
