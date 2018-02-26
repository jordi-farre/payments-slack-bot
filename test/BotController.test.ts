import { BotController } from "../src/BotController";
const mockRes = require('jest-mock-express').response;
import { ChallengeCommand } from "../src/ChallengeCommand";
jest.mock("../src/ChallengeCommand");
const challengeCommand = new ChallengeCommand();
import { EchoCommand } from "../src/EchoCommand"
jest.mock("../src/EchoCommand");
const echoCommand = new EchoCommand();
const botController = new BotController("12345", challengeCommand, echoCommand);
const response = mockRes();

it('should return the challenge received when the token is correct and the type is url_verification', ()=> {
  challengeCommand.canHandle.mockReturnValue(true);
  const event = {"challenge": "challenge_to_be_returned", "type": "url_verification"};

  botController.process({"body": {"token": "12345", "challenge": "challenge_to_be_returned", "type": "url_verification"}}, response);

  challengeCommand.handle.mock.calls[0][1](null, {"challenge": "challenge_to_be_returned"});

  expect(challengeCommand.canHandle).toHaveBeenCalledWith(event);
  expect(challengeCommand.handle).toHaveBeenCalledWith(event, expect.anything());
  expect(response.send).toHaveBeenCalledWith({"challenge": "challenge_to_be_returned"});
}

it("should return an authentication error when received token is incorrect", () => {
  botController.process({"body": {"token": "incorrect_token", "challenge": "challenge_to_be_returned", "type": "url_verification"}}, response);

  expect(response.status).toHaveBeenCalledWith(401);
}

it('should send and echo message when app is mentioned with echo command', ()=> {
  echoCommand.canHandle.mockReturnValue(true);
  const event = {"type": "event_callback", "eventType": "app_mention", "text": "<@U0LAN0Z89> echo hello bot", "channel": "C0LAN2Q64" };

  botController.process({"body":{
    	"token": "12345",
    	"team_id": "T061EG9R6",
    	"api_app_id": "A0MDYCDME",
    	"event": {
        	"type": "app_mention",
        	"user": "U061F7AUR",
        	"text": "<@U0LAN0Z89> echo hello bot",
        	"ts": "1515449438.000011",
        	"channel": "C0LAN2Q64",
        	"event_ts": "1515449438000011"
    	},
    	"type": "event_callback",
    	"event_id": "Ev0MDYGDKJ",
    	"event_time": 1515449438000011,
    	"authed_users": [
        	"U0LAN0Z89"
    	]
	}}, response);

  echoCommand.handle.mock.calls[0][1](null, "OK");

  expect(response.status).toHaveBeenCalledWith(200);
  expect(echoCommand.canHandle).toHaveBeenCalledWith(event);
  expect(echoCommand.handle).toHaveBeenCalledWith(event, expect.anything());
}
