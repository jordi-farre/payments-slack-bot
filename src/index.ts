import * as serverless from "serverless-http";
import * as express from "express";

const app = express();

app.get('/', function (req, res) {
  res.send('Hello World!')
});

const handler = serverless(app);
export default handler;
