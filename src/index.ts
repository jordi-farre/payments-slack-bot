import * as serverless from "serverless-http";
import * as express from "express";
import * as bodyParser from "body-parser";
import { BotController } from "./BotController"
import { WebClient } from "@slack/client";
import { ChallengeCommand } from "./ChallengeCommand";

const app = express();
app.use(bodyParser.json({ strict: false }));

const token = process.env.BOT_TOKEN;
const oauthToken = process.env.OAUTH_TOKEN;
const webClient = new WebClient(oauthToken);
const challengeCommand = new ChallengeCommand();
const botController = new BotController(token, webClient, challengeCommand);

app.post('/', (request, response) => {
  botController.process(request, response);
});

exports.handler = serverless(app);
exports.app = app;
exports.webClient = webClient;
