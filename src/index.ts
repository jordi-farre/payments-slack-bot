import * as serverless from "serverless-http";
import * as express from "express";
import * as bodyParser from "body-parser";
import { BotController } from "./BotController"

const app = express();
app.use(bodyParser.json({ strict: false }));

const botController = new BotController();

app.post('/', botController.process);

exports.handler = serverless(app);
exports.app = app;

