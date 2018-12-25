import
  express,
  {
    Express,
    Request,
    Response,
  }
from "express";
import
  * as httpStatusCodes
from "http-status-codes";

const app: Express = express();

app.use("/static", express.static("static"));

app.get("/", (req: Request, res: Response) => {
  res.status(httpStatusCodes.ACCEPTED).send();
});

app.listen(3000, "0.0.0.0");