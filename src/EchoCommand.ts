import { WebClient } from "@slack/client";

export class EchoCommand {

  const echoRegexp = /echo (.*)/i;

  webClient: WebClient;

  constructor(webClient: WebClient) {
    this.webClient = webClient;
  }

  canHandle(event: Event): boolean {
    return this.echoRegexp.test(event.text);
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
