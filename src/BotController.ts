import { Request, Response } from "express";
import { WebClient } from "@slack/client";
import { Command } from "./Command";
import { Event } from "./Event";

export class BotController {

  botToken: string;
  commands: Command[];

  constructor(botToken: string, ...commands: Command[]) {
    this.botToken = botToken;
    this.commands = commands;
  }

  process(request: Request, response: Response) {
    if (this.isValidTokenFor(request)) {
      const event: Event = this.getEventFrom(request);
      for (let command of this.commands) {
        if (command.canHandle(event)) {
          command.handle(event, (err, res) => {
            if (err) response.status(500).send(err);
            else response.status(200).send(res);
          });
          return;
        }
      }
      this.handleUnknown(request, response);
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
    const event: Event =  { "type": request.body.type, "challenge": request.body.challenge };
    if (request.body.event) {
      event.eventType = request.body.event.type;
      event.text = request.body.event.text;
      event.channel = request.body.event.channel;
    }
    return event;
  }

}
