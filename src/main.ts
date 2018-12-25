import {
  FormidableMiddleware,
  FormidableMiddlewareRequest,
} from "@jginsburgn/formidable-middleware";
import express, {
  Express,
  Handler,
  Response,
} from "express";
import fs from "fs";
import { Server } from "http";
import HttpStatusCodes from "http-status-codes";
import os from "os";
import path from "path";
import process from "process";

const app: Express = express();

const homeDir: string = os.homedir();
let targetDir: string = path.join(homeDir, "uploads");

// Test for existence of targetDir, create if not existent
try {
  fs.accessSync(homeDir, fs.constants.W_OK);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, 0o744);
  }
}
catch (error) {
  process.exit(1);
}

// Receive posted file
app.post("/", FormidableMiddleware({ maxFileSize: 10 * 1024 ** 3 }), (req: FormidableMiddlewareRequest, res: Response) => {
  res.set("Content-Type", "text/plain");
  for (const file of req.body.files) {
    console.log(file.file.lastModifiedDate);
    const currentPath: string = file.file.path;
    fs.renameSync(currentPath, path.join(targetDir, file.file.name));
    res.write(`${file.file.name} successfully received.\n`);
  }
  res.status(HttpStatusCodes.OK).end();
});

// Create and mount static middleware
const staticMiddleware: Handler = express.static("static");
app.use("/", staticMiddleware);

const server: Server = app.listen(3000, "0.0.0.0", () => {
  console.log(server.address());
});