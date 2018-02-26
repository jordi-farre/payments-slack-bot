import { Event } from "./Event";
import { Command } from "./Command";

export class ChallengeCommand implements Command {

  canHandle(event: Event): boolean {
    return event.type == "url_verification";
  }

  handle(event: Event, callback) {
    callback(null, { "challenge": event.challenge });
  }

}
