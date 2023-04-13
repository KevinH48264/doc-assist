import { check } from "./contentScript/check";
import React from "react";
import ReactDOM from "react-dom";
import Main from "./contentScript/components/Main";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.action) {
    case "check":
      check();
      break;
    case "tab-updated":
      const container = document.createElement("div");
      document.body.appendChild(container);
      const pdfText = request.arguments["message"];
      // const namespace = request.arguments["message"]["namespace"];
      console.log("request", request);
      // !! Add request namespace
      ReactDOM.render(
        <Main
          pdfText={pdfText ? request.arguments["message"]["text"] : null}
        />,
        container
      );
      break;
  }

  sendResponse({ result: "success" });
});
