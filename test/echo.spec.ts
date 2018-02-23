process.env.BOT_TOKEN = "12345";
process.env.OAUTH_TOKEN = "123456";

import { app, webClient } from "../src/index.ts"
import * as request from "supertest";

it('should send and echo message when bot was mentioned', (done)=> {
  const postMessageMock = jest.fn();
  webClient.chat.postMessage = postMessageMock;
  request(app)
    .post("/")
    .send({"token": "12345",
           "team_id": "T061EG9R6",
           "api_app_id": "A0MDYCDME",
           "event": {
             "type": "app_mention",
             "user": "U061F7AUR",
             "text": "<@U0LAN0Z89> echo is it everything a river should be?",
             "ts": "1515449438.000011",
             "channel": "C0LAN2Q65",
             "event_ts": "1515449438000011"
           },
           "type": "event_callback",
           "event_id": "Ev0MDYGDKJ",
           "event_time": 1515449438000011,
           "authed_users": [
             "U0LAN0Z89"
           ]
         })
    .then((response) => {
      expect(postMessageMock).toHaveBeenCalledWith("C0LAN2Q65", "is it everything a river should be?");
      expect(response.statusCode).toBe(200);
      done();
     });
});
