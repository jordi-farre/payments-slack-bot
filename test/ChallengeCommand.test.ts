import { ChallengeCommand } from "../src/ChallengeCommand";
const challengeCommand = new ChallengeCommand();
const event = {"challenge": "challenge_to_be_returned", "type": "url_verification"};

it('should return true when is asked if cand handle an event of type url_verification', ()=> {
  expect(challengeCommand.canHandle(event)).toBe(true);
}

it("should send challenge json to callback when event is handled", () => {
  const callback = jest.fn();

  challengeCommand.handle(event, callback);

  expect(callback).toHaveBeenCalledWith(null, { "challenge": "challenge_to_be_returned" });
});
