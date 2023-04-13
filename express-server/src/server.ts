import express from "express";
import cors from "cors";
import { config } from "./config";
import { getPdfText } from "./utils";

const app = express();

const StartServer = () => {
  // Logging
  app.use((req, res, next) => {
    console.log(
      `Incoming -> Method: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`
    );
    res.on("finish", () => {
      console.log(
        `Incoming -> Method: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`
      );
    });
    next();
  });

  const corsOptions = {
    origin: ["*"],
    credentials: true,
  };
  app.use(cors(corsOptions));

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Rules
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method == "OPTIONS") {
      res.header(
        "Access-Control-Allow-Methods",
        "PUT, POST, PATCH, DELETE, GET"
      );
      return res.status(200).json({});
    }
    next();
  });

  // Healthcheck
  app.get("/ping", (req, res, next) => {
    res.status(200).json({
      message: "pong",
    });
  });

  // init oauth proxies
  app.post("/getPdfText", (req, res, next) => {
    // const { pdfUrl } = req.body;
    console.log("Helooo");
    getPdfText(
      "https://isupportcontent.nuance.com/healthcare/documents/manuals/RadWhere_V3/889579.pdf"
    ).then(
      function (text) {
        console.log(text);
        res.send(200);
      },
      function (reason) {
        console.error(reason);
        res.send(404);
      }
    );
  });

  // Errors
  app.use((req, res, next) => {
    const error = new Error("not found");
    console.log(error);
    return res.status(404).json({
      message: error.message,
    });
  });

  app.listen(config.server.port || 3000, () => {
    console.log(`server is running on port ${config.server.port}`);
  });
};

StartServer();
