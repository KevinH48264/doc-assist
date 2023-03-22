import { getCurrentTab, sendMessageInCurrentTab } from "../utils";

export async function initializeTabEventListeners() {
  chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
    if (changeInfo.status == "complete") {
  
      const tab = await getCurrentTab();    
      let body = null;
      if (tab.url?.endsWith(".pdf")) {
        const options = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: tab.url,
          }),
        };
        const response = await fetch("http://0.0.0.0:8080/pdf2text", options);
        body = await response.json();
      }

      console.log("complete", body);
      await sendMessageInCurrentTab({
        action: "tab-updated",
        arguments: {
          message: body,
        },
      });
    }
  });
}
