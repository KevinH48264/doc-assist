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
      // ensure only one gpt container appears

      if (!document.getElementById('gptcard-container')) {
        const container = document.createElement("div");
        container.id = "gptcard-container"
        document.body.appendChild(container);
        const pdfText = request.arguments["message"]
        ReactDOM.render(
          <Main pdfText={pdfText ? request.arguments["message"]["text"] : null} />,
          container
        );
      }      
      break;
  }

  sendResponse({ result: "success" });
});
