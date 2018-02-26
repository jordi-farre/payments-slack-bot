import { WebClient } from "@slack/client";
import { Event } from "./Event";
import { Command } from "./Command";

export class EchoCommand implements Command {

  echoRegexp = /echo (.*)/i;
  webClient: WebClient;

  constructor(webClient: WebClient) {
    this.webClient = webClient;
  }

  canHandle(event: Event): boolean {
    return event.type == "event_callback" && event.eventType == "app_mention" && this.echoRegexp.test(event.text);
  }

  handle(event: Event, callback) {
    const match = this.echoRegexp.exec(event.text);
    this.webClient.chat.postMessage(event.channel, match[1], (err, res) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, res);
      }
    });
  }

}
