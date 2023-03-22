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
      ReactDOM.render(
        <Main pdfText={request.arguments["message"]["text"]} />,
        container
      );
      break;
  }

  sendResponse({ result: "success" });
});
