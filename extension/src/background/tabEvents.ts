import { getCurrentTab, sendMessageInCurrentTab } from "../utils";

export async function initializeTabEventListeners() {
  chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
    if (changeInfo.status == "complete") {
      const tab = await getCurrentTab();
      console.log("tab", tab.url);

      let body = null;
      if (tab.url?.endsWith(".pdf")) {
        console.log("PDF");
        const options = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: tab.url,
          }),
        };
        // const response = await fetch("https://opendoc-conirvxfeq-uc.a.run.app/pdf2text", options);
        // const response = await fetch("http://127.0.0.1:8081/pdf2text", options);
        const response = await fetch(
          // "http://127.0.0.1:8081/pdf2text2",
          "https://opendoc-conirvxfeq-uc.a.run.app/pdf2text2",
          options
        );

        body = await response.json();
      }

      await sendMessageInCurrentTab({
        action: "tab-updated",
        arguments: {
          message: { ...body, namespace: tab.url },
        },
      });
    }
  });
}
