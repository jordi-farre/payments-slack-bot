import * as serverless from "serverless-http";
import * as express from "express";
import * as bodyParser from "body-parser";

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  console.log(req);
  res.json({message : "test"})
});

exports.handler = serverless(app);

