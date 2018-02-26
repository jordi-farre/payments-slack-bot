import { Event } from "./Event";

export interface Command {

  canHandle(event: Event): boolean;

  handle(event: Event, callback);

}
