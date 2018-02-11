import { app } from "../src/index.ts"
import * as request from "supertest";

it('should return the challenge received when the token is correct and the type is url_verification', (done)=> {
  request(app)
    .post("/")
    .send({"token": "12345", "challenge": "challenge_received", "type": "url_verification"})
    .expect(200, {"challenge":"challenge_received"}, done);
});
