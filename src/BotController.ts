
export class BotController {

  botToken: string;
  webClient;

  constructor(botToken: string, webClient) {
    this.botToken = botToken;
    this.webClient = webClient;
  }

  process(request, response) {
    if (this.botToken == request.body.token) {
      if (request.body.type == "url_verification") {
          response.json({"challenge": request.body.challenge});
      } else if (request.body.type == "event_callback" && request.body.event.type == "app_mention") {
          const echoRegexp = /echo (.*)/i;
          const match = echoRegexp.exec(request.body.event.text);
	  if (match) {
            this.webClient.chat.postMessage(request.body.event.channel, match[1]);
	  }
          response.status(200).send("OK");
      } else {
          response.status(200).send("OK");
      }
    } else {
      response.status(401).send("incorrect bot token");
    }
  }

}
