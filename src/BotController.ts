
export class BotController {

  botToken: string;

  constructor(botToken: string) {
    this.botToken = botToken;
  }

  process(request, response) {
    if (this.botToken == request.body.token) {
      response.json({"challenge": request.body.challenge});
    } else {
      response.status(401).send("incorrect bot token");
    }
  }

}
