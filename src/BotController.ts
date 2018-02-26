import { Request, Response } from "express";
import { WebClient } from "@slack/client";
import { ChallengeCommand } from "./ChallengeCommand";
import { EchoCommand } from "./EchoCommand";
import { Event } from "./Event";

export class BotController {

  botToken: string;
  challengeCommand: ChallengeCommand;
  echoCommand: EchoCommand;

  constructor(botToken: string, challengeCommand: ChallengeCommand, echoCommand: EchoCommand) {
    this.botToken = botToken;
    this.challengeCommand = challengeCommand;
    this.echoCommand = echoCommand;
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
    if (this.echoCommand.canHandle(this.getEventFrom(request))) {
      this.echoCommand.handle(this.getEventFrom(request), (err, res) => {
        if (err) {
          response.status(500).send(err);
        } else {
          response.status(200).send(res);
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
    var event =  { "type": request.body.type, "challenge": request.body.challenge };
    if (request.body.event) {
      event.eventType = request.body.event.type;
      event.text = request.body.event.text;
      event.channel = request.body.event.channel;
    }
    return event;
  }

}
