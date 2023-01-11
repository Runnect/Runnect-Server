import express, { NextFunction, Request, Response } from "express";
import router from "./router";
import config from "./config";

const app = express();

app.use(express.json());

app.use("/api", router);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("~~~~~서버서버서버~~~~~");
});

app.listen(config.port, () => {
  console.log(`*****************************************
     ${config.port}번 포트에서 듣고 있는 중~~*
    ********************************************`);
});

export default app;
