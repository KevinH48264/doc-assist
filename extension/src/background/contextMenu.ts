import { sendMessageInCurrentTab } from "../utils";

export const contextMenu = () => {
  chrome.runtime.onInstalled.addListener(async () => {
    chrome.contextMenus.removeAll();

    chrome.contextMenus.create({
      title: "GPTCheck",
      id: "check",
      contexts: ["selection"],
    });
  });

  chrome.contextMenus.onClicked.addListener(
    async ({ selectionText, pageUrl }) => {
      if (!selectionText) {
        // console.log("no text selected");
        return;
      }
      // console.log("clicked");
      sendMessageInCurrentTab(
        {
          action: "check",
          command: "append",
        },
        function (response) {
          // console.log("response", response);
        }
      );
      setTimeout(() => {}, 1000);
    }
  );
};
