import { EchoCommand } from "../src/EchoCommand";
import { WebClient } from "@slack/client";
const event = {"type": "event_callback", "eventType": "app_mention", "text": "<@U0LAN0Z89> echo hello bot", "channel": "C0LA" }; 
const webClient = new WebClient("2323");
webClient.chat.postMessage = jest.fn();
const echoCommand = new EchoCommand(webClient);

it('should return true when is asked if cand handle an echo message', ()=> {
  expect(echoCommand.canHandle(event)).toBe(true);
}

it("should send OK message to callback when echo event is handled and send echo message using webclient", () => {
  const callback = jest.fn();

  echoCommand.handle(event, callback);
  webClient.chat.postMessage.mock.calls[0][2](null, "OK");

  expect(webClient.chat.postMessage).toHaveBeenCalledWith("C0LA", "hello bot", expect.anything());
  expect(callback).toHaveBeenCalledWith(null, "OK");
});
