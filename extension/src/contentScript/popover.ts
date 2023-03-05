import { DataType } from "../types";
import { decimalToColor } from "../utils";
import { exitComponent } from "./components/exit";
import { helpMinimumConfidence } from "./components/helpMinimumConfidence";
import { helpPopover } from "./components/helpPopover";
const logoTemp = require("../images/logo.png") 
const searchTemp = require("../images/search.png") 
const logoImg = chrome.runtime.getURL("js/images/logo.png");
const searchImg = chrome.runtime.getURL("js/images/search.png");

export const getPopover = (selectionString: string, req: DataType | null) => {
  // Popover element
  const popover = document.createElement("div");
  popover.style.width = "300px";
  popover.style.height = "100vh";
  popover.style.zIndex = "10000";
  popover.style.backgroundColor = "rgb(32,33,35)";
  popover.style.position = "fixed";

  popover.style.right = "0";
  popover.style.top = "0";
  popover.style.fontFamily = "Verdana,sans-serif";
  popover.style.color = "rgb(210, 214, 218)";
  popover.id = "chatcheck-popover";

  // search bar borders
  const hr1 = document.createElement("hr");
  hr1.style.opacity = "40%";
  hr1.style.margin = "0px";
  const hr2 = document.createElement("hr");
  hr2.style.opacity = "40%";
  hr2.style.margin = "0px";

  
  const headerEl = document.createElement("div");
  headerEl.style.display = "flex";
  headerEl.style.justifyContent = "space-between";
  headerEl.style.paddingRight = "16px";
  headerEl.style.paddingLeft = "8px";
  headerEl.style.alignItems = "center";
  headerEl.style.height = "65px";

  const subHeaderEl = document.createElement("div");
  subHeaderEl.style.display = "flex";
  subHeaderEl.style.alignItems = "center";

  // Title
  const title = "<b><p>GPTCheck</p></b>";
  const titleEl = document.createElement("div");
  
  titleEl.innerHTML = title;
  titleEl.style.marginLeft = "8px";
  titleEl.style.fontSize = "16px";

  const img = document.createElement("img");
  img.style.width = "48px";
  img.style.height = "48px";
  img.src = logoImg;

  subHeaderEl.appendChild(img);
  subHeaderEl.appendChild(titleEl);

  // for the help function
  helpPopover(subHeaderEl, popover)

  // exit
  headerEl.appendChild(subHeaderEl);
  exitComponent(headerEl)

  // for the search bar display
  const mag = document.createElement("img");
  mag.src = searchImg;
  mag.style.width = "24px";
  mag.style.height = "24px";
  mag.style.marginLeft = "8px";
  const selectionFlex = document.createElement("div");
  selectionFlex.style.display = "flex";
  selectionFlex.style.alignItems = "center";
  selectionFlex.style.height = "56px";

  const selection = `${selectionString}`;
  const selectionEl = document.createElement("p");
  selectionEl.innerHTML = selection;
  selectionEl.style.paddingBlock = "16px";
  selectionEl.style.paddingRight = "16px";
  selectionEl.style.paddingLeft = "8px";
  selectionEl.style.maxHeight = "56px";
  selectionEl.style.overflow = "hidden";
  selectionEl.style.fontSize = "13px";
  selectionEl.style.textOverflow = "ellipsis";
  selectionEl.style.whiteSpace = "nowrap";
  selectionEl.id = "selectionText";
  selectionFlex.appendChild(mag);
  selectionFlex.appendChild(selectionEl);

  // for setting your similarity score threshold
  const similarity_score_setting = document.createElement("div");

  // Get the threshold score from local storage
  chrome.storage.local.get("thresholdScore", function(data) {
    // Set the default value of the input element to the threshold score
    var threshold_score = 50

    if (data.thresholdScore) {
      threshold_score = parseInt(data.thresholdScore)
    } else {
      chrome.storage.local.set({thresholdScore: 50})
    }

    // callback function from input
    const saveThresholdScore = (new_score: number) => {
      chrome.storage.local.set({thresholdScore: new_score})
    }

    // style="display: inline-block;"
    similarity_score_setting.innerHTML = `
      <form style="padding-top: 10px; padding-left: 10px;font-size: 13px; ">
        <div>
          <label style="display: inline-block;" id="label" for="score">Minimum confidence</label>
          <span style="display: inline-block;" id="help-icon"></span>
        </div>
        <input type="range" id="input_threshold_score" name="score" min="25" max="90" step="1" value="${threshold_score}" oninput="output.value = score.value + '%'" style="margin-top: 5px;">
        <output for="score" id="output">${threshold_score}%</output>
      </form>
    `;

    const helpIcon = document.getElementById("help-icon");
    if (helpIcon) {
      console.log("there is a help icon")
      helpMinimumConfidence(helpIcon, popover)
    }
    
    const inputElement = document.getElementById("input_threshold_score") as HTMLInputElement;
    inputElement?.addEventListener("input", function() {
      saveThresholdScore(parseInt(inputElement.value as string));
    });
  });

  // for the search result display
  const googleInfoEl = document.createElement("div");
  googleInfoEl.style.margin = "8px";
  googleInfoEl.style.backgroundColor = "rgb(52,53,64)";
  googleInfoEl.style.borderRadius = ".375rem";

  const d = document.createElement("div");
  d.style.overflow = "hidden";
  const googleTextEl = document.createElement("p");
  googleTextEl.style.padding= "16px";
  googleTextEl.style.margin = "0px";
  googleTextEl.style.fontSize = "13px";
  googleTextEl.style.color = "rgb(210,214,218)";
  googleTextEl.id = "paragraph";
  googleTextEl.style.maxHeight = "500px";
  // googleTextEl.style.overflow = "scroll";

  if (!req) {
    googleTextEl.innerHTML = "Searching...";
    d.appendChild(googleTextEl);
    googleInfoEl.appendChild(d);
  } else {
    googleTextEl.innerHTML = req.extracted_paragraph;
  }
  

  const simScoreReport = document.createElement("p");
  const simScore = document.createElement("p");
  simScore.id = "similarity";
  simScore.style.fontSize = "13px";
  simScore.style.paddingInline = "16px";

  if (!req) {
    simScore.innerHTML = "";
  } else {
    // simScore.innerHTML = "Similarity score: " + req?.similarity_score;
    simScore.innerHTML = req?.similarity_score;
    simScore.style.color = decimalToColor(parseFloat(req?.similarity_score));
  }
  simScoreReport.append(simScore)

  const googleTitleEl = document.createElement("a");
  const googleTitleDiv = document.createElement("div");
  googleTitleEl.id = "title";
  if (!req) {
    googleTitleEl.innerHTML = "";
    googleTitleEl.href = "";
  } else {
    googleTitleEl.innerHTML = req.title;
    googleTitleEl.href = req.URL;
    googleTitleEl.target = "_blank";
  }
  googleTitleDiv.style.color = "rgb(147,179,242)";
  googleTitleDiv.style.fontSize = "15px";
  googleTitleDiv.style.paddingInline = "16px";
  googleTitleDiv.style.paddingBottom = "16px";
  googleTitleDiv.appendChild(googleTitleEl);

  const googleUrlEl = document.createElement("a");
  const googleUrlDiv = document.createElement("div");
  googleUrlEl.id = "url";
  if (!req) {
    googleUrlEl.innerHTML = "";
    googleUrlEl.href = "";
  } else {
    googleUrlEl.innerHTML = req.URL;
    googleUrlEl.href = req.URL;
    googleUrlEl.target = "_blank";
  }

  googleUrlDiv.style.overflow = "hidden";
  // googleUrlDiv.style.height = "14px";
  googleUrlDiv.style.textOverflow = "ellipsis";
  googleUrlDiv.style.fontSize = "13px";
  // googleUrlDiv.style.padding = "16px";
  googleUrlDiv.style.paddingInline = "16px";
  googleUrlDiv.style.paddingBlock = "8px";
  googleUrlDiv.style.color = "rgb(190,193,197)";
  googleUrlDiv.style.whiteSpace = "nowrap";
  googleUrlDiv.appendChild(googleUrlEl);

  googleInfoEl.appendChild(simScoreReport);
  googleInfoEl.appendChild(googleUrlDiv);
  googleInfoEl.appendChild(googleTitleDiv);

  // add everything to popover
  popover.appendChild(headerEl);
  popover.appendChild(hr1);
  popover.appendChild(selectionFlex);
  popover.appendChild(hr2);
  popover.appendChild(similarity_score_setting);
  popover.appendChild(googleInfoEl);

  colorLinks("rgb(190,193,197)");
  return popover;
};

export const updatePopover = (
  data: DataType | null,
  selectionText?: string
) => {
  const para = document.getElementById("paragraph");
  const similarity = document.getElementById("similarity");
  const url = document.getElementById("url");
  const title = document.getElementById("title");
  const _selectionText = document.getElementById("selectionText");

  if (!data && selectionText) {
    (para as HTMLElement).innerHTML = "Searching...";
    (similarity as HTMLElement).innerHTML = "";
    (url as HTMLAnchorElement).innerHTML = "";
    (title as HTMLAnchorElement).innerHTML = "";
    (_selectionText as HTMLAnchorElement).innerHTML = selectionText;
  } else if (data) {
    (similarity as HTMLElement).style.color = decimalToColor(
      parseFloat(data.similarity_score)
    );

    (para as HTMLElement).innerHTML = data.extracted_paragraph;
    (similarity as HTMLElement).innerHTML =
      "<p style='display:inline; color: rgb(210, 214, 218); font-weight: normal' >Confidence: </p>" + data.similarity_score;

    (url as HTMLAnchorElement).innerHTML = data.URL;
    (url as HTMLAnchorElement).href = data.URL;
    (url as HTMLAnchorElement).target = "_blank";

    (title as HTMLAnchorElement).innerHTML = data.title;
    (title as HTMLAnchorElement).href = data.URL;
    (title as HTMLAnchorElement).target = "_blank";
  }
};

function colorLinks(hex: string)
{
    var links = document.getElementsByTagName("a");
    for(var i=0;i<links.length;i++)
    {
        if(links[i].href)
        {
            links[i].style.color = hex;  
        }
    }  
}