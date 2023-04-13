import { getCurrentTab, sendMessageInCurrentTab } from "../utils";

export async function initializeTabEventListeners() {
  chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
    if (changeInfo.status == "complete") {
      const tab = await getCurrentTab();   
      console.log("tab", tab.url) 
      
      let body = null;
      if (tab.url?.endsWith(".pdf")) {
        const options = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: tab.url,
          }),
        };
        // const response = await fetch("https://opendoc-conirvxfeq-uc.a.run.app/pdf2text", options);
        const response = await fetch("http://localhost:8080/pdf2text", options);
        body = await response.json();
      }
      console.log("HELLOOO", { ...body, namespace: tab.url });

      console.log("complete", body);
      await sendMessageInCurrentTab({
        action: "tab-updated",
        arguments: {
          message: { ...body, namespace: tab.url },
        },
      });
    }
  });
}
