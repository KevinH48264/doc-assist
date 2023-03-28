import { getDocument, GlobalWorkerOptions, version } from "pdfjs-dist";
import ReactDOM from "react-dom";

export async function getCurrentTab() {
  const queryOptions = { active: true, lastFocusedWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

export async function sendMessageInCurrentTab(
  message: any,
  callback?: ((response: any) => void) | undefined
) {
  const tab = await getCurrentTab();
  if (!tab.id) return;
  return sendMessageInTab(tab.id, message, callback);
}

async function sendMessageInTab(
  tabId: number,
  message: any,
  callback?: ((response: any) => void) | undefined
) {
  chrome.tabs.sendMessage(tabId, message, callback);
}

export function decimalToColor(decimal: number): string {
  const red = Math.round(255 * (1 - decimal));
  const green = Math.round(255 * decimal);
  return `rgb(${red}, ${green}, 0)`;
}

export const render = (
  component:
    | React.FunctionComponentElement<any>
    | React.FunctionComponentElement<any>[],
  container: ReactDOM.Container | null
) => {
  ReactDOM.render(component, container);
};

// helper function to read from stream until done
export async function* streamAsyncIterable(stream: any) {
  const reader = stream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        return;
      }
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}

// !! Not using this
export async function getPdfText(pdfUrl: string) {
  GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.js`;
  const pdf = getDocument({
    url: pdfUrl,
    httpHeaders: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export const extractText = () => {
  console.log("Extracting text from page");
  function isHidden(el: Element) {
    var style = window.getComputedStyle(el);
    return style.display === "none" || style.visibility === "hidden";
  }

  // get the body tag
  let body;
  if (document.querySelector("main") !== null) {
    // <article> tag exists in the DOM
    // your code here
    console.log("main exists");
    body = document.querySelector("main");
  } else {
    body = document.querySelector("body");
  }

  let textContent = "";

  if (body) {
    // get all tags inside body
    var allTags = body.getElementsByTagName("*");

    for (var i = 0, max = allTags.length; i < max; i++) {
      if (isHidden(allTags[i])) {
        // hidden
      } else {
        textContent += allTags[i].textContent;
      }
    }
  }
  return textContent;
};
