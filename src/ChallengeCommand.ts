import { Request } from "./Request";

export class ChallengeCommand {

  canHandle(request: Request): boolean {
    throw new Error("Not implemented");
  }

  handle(request: Request, callback) {
    throw new Error("Not implemented");
  }
