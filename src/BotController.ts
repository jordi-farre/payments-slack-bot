import { Request, Response } from "express";
import { WebClient } from "@slack/client";
import { ChallengeCommand } from "./ChallengeCommand";
import { Event } from "./Event";

export class BotController {

  botToken: string;
  webClient: WebClient;
  challengeCommand: ChallengeCommand;

  constructor(botToken: string, webClient: WebClient, challengeCommand: ChallengeCommand) {
    this.botToken = botToken;
    this.webClient = webClient;
    this.challengeCommand = challengeCommand;
  }

  process(request: Request, response: Response) {
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

  isValidTokenFor(request: Request) {
    return this.botToken == request.body.token;
  }

  isChallenge(request: Request) {
    return this.challengeCommand.canHandle(this.getEventFrom(request));
  }
  
  handleChallenge(request: Request, response: Response) {
    this.challengeCommand.handle(this.getEventFrom(request), (err, res) => {
      if (err) {
        response.status(500).send(err);
      } else {
        response.status(200).send(res);
      }
    });
  }

  isAppMention(request: Request) {
    return request.body.type == "event_callback" && request.body.event.type == "app_mention";
  }

  handleAppMention(request: Request, response: Response) {
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

  handleUnknown(request: Request, response: Response) {
    response.status(200).send("OK");
  }

  handleUnauthorized(request: Request, response: Response) {
    response.status(401).send("incorrect bot token");
  }

  getEventFrom(request: Request): Event {
    return { "type": request.body.type, "token": request.body.token, "challenge": request.body.challenge };
  }

}
