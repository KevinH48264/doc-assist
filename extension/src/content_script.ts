import { check } from "./contentScript/check";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // console.log("HERE");

  switch (request.action) {
    case "check":
      // console.log("in check");
      check();
      break;
  }

  sendResponse({ result: "success" });
});
