import { BotController } from "../src/BotController";
const mockRes = require('jest-mock-express').response;
import { WebClient } from "@slack/client";

it('should return the challenge received when the token is correct and the type is url_verification', ()=> {
  const botController = new BotController("12345");
  const response = mockRes();

  botController.process({"body": {"token": "12345", "challenge": "challenge_to_be_returned", "type": "url_verification"}}, response);

  expect(response.json).toHaveBeenCalledWith({"challenge": "challenge_to_be_returned"});
}

it("should return an authentication error when received token is incorrect", () => {
  const botController = new BotController("12345");
  const response = mockRes();

  botController.process({"body": {"token": "incorrect_token", "challenge": "challenge_to_be_returned", "type": "url_verification"}}, response);

  expect(response.status).toHaveBeenCalledWith(401);
}

it('should send and echo message when app is mentioned with echo command', ()=> {
  const webClient = new WebClient("123456");
  const postMessageMock = jest.fn();
  webClient.chat.postMessage = postMessageMock;
  const botController = new BotController("12345", webClient);
  const response = mockRes();

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

  expect(response.status).toHaveBeenCalledWith(200);
  expect(postMessageMock).toHaveBeenCalledWith("C0LAN2Q64", "hello bot");
}
