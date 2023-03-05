import { DataType } from "../types";
import { getPopover, updatePopover } from "./popover";

export const check = () => {
  const selection = window.getSelection();
  const selectionString = selection?.toString();
  if (!selectionString) return;

  const p = document.getElementById("chatcheck-popover");
  if (!p) {
    let popover = getPopover(selectionString, null);
    document.body.style.marginRight = "250px";
    document.body.appendChild(popover);
  } else {
    p.style.visibility = "visible";
    updatePopover(null, selectionString);
  }

  const urlParts = new URL(document.URL).hostname.split('.')
  const root_URL = urlParts
    .slice(0)
    .slice(-(urlParts.length === 4 ? 3 : 2))
    .join('.');
  
  // run the fact check
  // Get the threshold score from local storage

  chrome.storage.local.get("thresholdScore", function(data) {
    // Set the default value of the input element to the threshold score
    const threshold_score = data.thresholdScore / 100 || 0.5;
    
    fetch("https://app-qhj6nxlcmq-uc.a.run.app/fact_check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        highlighted_text: selectionString,
        context_size: 200,
        current_URL: root_URL,
        similarity_score_threshold: threshold_score
      }),
    })
    .then((response) => response.json())
    .then((data: DataType) => {
      console.log(data);
      updatePopover(data);
    });
  });
};
