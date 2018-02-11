
export class BotController {

  process(request, response) {
    response.json({"challenge": request.body.challenge});
  }

}
