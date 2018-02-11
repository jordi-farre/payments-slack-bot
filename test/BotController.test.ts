import { BotController } from "../src/BotController";
const mockRes = require('jest-mock-express').response;

it('should return the challenge received when the token is correct and the type is url_verification', ()=> {
  const botController = new BotController();
  const response = mockRes();

  botController.process({"body": {"token": "12345", "challenge": "challenge_to_be_returned", "type": "url_verification"}}, response);

  expect(response.json).toHaveBeenCalledWith({"challenge": "challenge_to_be_returned"});
}
