import * as serverless from "serverless-http";
import * as express from "express";
import * as bodyParser from "body-parser";
import { BotController } from "./BotController"
import { WebClient } from "@slack/client";
import { ChallengeCommand } from "./ChallengeCommand";
import { EchoCommand } from "./EchoCommand";

const app = express();
app.use(bodyParser.json({ strict: false }));

const token = process.env.BOT_TOKEN;
const oauthToken = process.env.OAUTH_TOKEN;
const webClient = new WebClient(oauthToken);
const challengeCommand = new ChallengeCommand();
const echoCommand = new EchoCommand(webClient);
const botController = new BotController(token, webClient, challengeCommand, echoCommand);

app.post('/', (request, response) => {
  botController.process(request, response);
});

exports.handler = serverless(app);
exports.app = app;
exports.webClient = webClient;
