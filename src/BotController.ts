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
      const event: Event = this.getEventFrom(request);
      if (this.challengeCommand.canHandle(event)) {
        this.challengeCommand.handle(event, (err, res) => {
          if (err) {
            response.status(500).send(err);
          } else {
            response.status(200).send(res);
          }
        });
      } else if (this.echoCommand.canHandle(event)) {
        this.echoCommand.handle(event, (err, res) => {
          if (err) {
            response.status(500).send(err);
          } else {
            response.status(200).send(res);
          }
        });
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

  handleUnknown(request: Request, response: Response) {
    response.status(200).send("OK");
  }

  handleUnauthorized(request: Request, response: Response) {
    response.status(401).send("incorrect bot token");
  }

  getEventFrom(request: Request): Event {
    var event: Event =  { "type": request.body.type, "challenge": request.body.challenge };
    if (request.body.event) {
      event.eventType = request.body.event.type;
      event.text = request.body.event.text;
      event.channel = request.body.event.channel;
    }
    return event;
  }

}
