
export class BotController {

  botToken: string;
  webClient;

  constructor(botToken: string, webClient) {
    this.botToken = botToken;
    this.webClient = webClient;
  }

  process(request, response) {
    if (this.isValidTokenFor(request)) {
      if (this.isChallenge(request)) {
        this.handleChallenge(request, response);
      } else if (this.isAppMention(request)) {
        this.handleAppMention(request, response);
      } else {
        this.handleUnknown(request, response);
      }
    } else {
      this.handleUnauthorized(request, response);
    }
  }

  isValidTokenFor(request) {
    return this.botToken == request.body.token;
  }

  isChallenge(request) {
    return request.body.type == "url_verification";
  }
  
  handleChallenge(request, response) {
    response.json({"challenge": request.body.challenge});
  }

  isAppMention(request) {
    return request.body.type == "event_callback" && request.body.event.type == "app_mention";
  }

  handleAppMention(request, response) {
    const echoRegexp = /echo (.*)/i;
    const match = echoRegexp.exec(request.body.event.text);
    if (match) {
      this.webClient.chat.postMessage(request.body.event.channel, match[1], (err, res) => {
        if (err) {
          console.error(err);
          response.status(500).send(err);
        } else {
          response.status(200).send("OK");
        }
      });
    }
  }

  handleUnknown(request, response) {
    response.status(200).send("OK");
  }

  handleUnauthorized(request, response) {
    response.status(401).send("incorrect bot token");
  }


}
