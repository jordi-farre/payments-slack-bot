import * as serverless from "serverless-http";
import * as express from "express";
import * as bodyParser from "body-parser";
import { BotController } from "./BotController"

const app = express();
app.use(bodyParser.json({ strict: false }));

const token = process.env.botToken;
const botController = new BotController(token);

app.post('/', (request, response) => {
  botController.process(request, response);
});

exports.handler = serverless(app);
exports.app = app;

