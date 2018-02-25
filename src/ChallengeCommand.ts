import { Request } from "./Request";

export class ChallengeCommand {

  canHandle(request: Request): boolean {
    return request.type == "url_verification";
  }

  handle(request: Request, callback) {
    callback(null, { "challenge": request.challenge });
  }
