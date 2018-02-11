import * as serverless from "serverless-http";
import * as express from "express";
import * as bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json({ strict: false }));

app.post('/', function (req, res) {
  console.log(req.body);
  res.json({message : "test"})
});

exports.handler = serverless(app);
exports.app = app;

