/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/contentScript/check.ts":
/*!************************************!*\
  !*** ./src/contentScript/check.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.check = void 0;
const popover_1 = __webpack_require__(/*! ./popover */ "./src/contentScript/popover.ts");
const check = () => {
    const selection = window.getSelection();
    const selectionString = selection === null || selection === void 0 ? void 0 : selection.toString();
    if (!selectionString)
        return;
    const p = document.getElementById("chatcheck-popover");
    if (!p) {
        let popover = (0, popover_1.getPopover)(selectionString, null);
        document.body.style.marginRight = "250px";
        document.body.appendChild(popover);
    }
    else {
        p.style.visibility = "visible";
        (0, popover_1.updatePopover)(null, selectionString);
    }
    const urlParts = new URL(document.URL).hostname.split('.');
    const root_URL = urlParts
        .slice(0)
        .slice(-(urlParts.length === 4 ? 3 : 2))
        .join('.');
    // run the fact check
    // Get the threshold score from local storage
    chrome.storage.local.get("thresholdScore", function (data) {
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
            .then((data) => {
            console.log(data);
            (0, popover_1.updatePopover)(data);
        });
    });
};
exports.check = check;


/***/ }),

/***/ "./src/contentScript/components/exit.ts":
/*!**********************************************!*\
  !*** ./src/contentScript/components/exit.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.exitComponent = void 0;
const exitComponent = (headerEl) => {
    const xEl = document.createElement("div");
    xEl.innerHTML = "X";
    xEl.style.cursor = "pointer";
    xEl.onclick = function () {
        const ele = document.getElementById("chatcheck-popover");
        if (ele) {
            document.body.style.marginRight = "0px";
            ele.style.visibility = "hidden";
        }
    };
    headerEl.appendChild(xEl);
};
exports.exitComponent = exitComponent;


/***/ }),

/***/ "./src/contentScript/components/helpMinimumConfidence.ts":
/*!***************************************************************!*\
  !*** ./src/contentScript/components/helpMinimumConfidence.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.helpMinimumConfidence = void 0;
const helpTemp = __webpack_require__(/*! ../../images/help.png */ "./src/images/help.png");
const helpImg = chrome.runtime.getURL("../js/images/help.png");
const helpMinimumConfidence = (body, popover) => {
    const helpEl = document.createElement("img");
    helpEl.style.width = "24px";
    helpEl.style.height = "24px";
    helpEl.style.display = "inline-block";
    helpEl.src = helpImg;
    helpEl.style.marginLeft = "3px";
    helpEl.id = "trigger";
    var helpPopupInfo = "<p>How confident should GPTCheck be when searching through articles? </p>";
    const helpPopupScoreExplanation = "<br /> <p> Recommended: 0.5-0.7. Lower values will make GPTCheck respond faster, but also more likely to match incorrectly. </p>";
    const helpPopupFeedback = "<br /> Updated confidence is automatically used the next time GPTCheck searches.</p>";
    const helpPopupEl = document.createElement("div");
    helpPopupEl.style.width = "450px";
    helpPopupEl.style.height = "auto";
    helpPopupEl.style.backgroundColor = "rgb(32,33,35)";
    helpPopupEl.style.right = "115px";
    helpPopupEl.style.top = "110px";
    helpPopupEl.style.zIndex = "10000";
    helpPopupEl.style.outline = "1px solid grey";
    helpPopupEl.classList.add("popup");
    helpPopupInfo = "<div>" + helpPopupInfo + helpPopupScoreExplanation + helpPopupFeedback + "</div>";
    helpPopupEl.innerHTML = helpPopupInfo;
    helpPopupEl.style.marginTop = "50px";
    helpPopupEl.style.position = "absolute";
    helpPopupEl.style.padding = "15px";
    helpPopupEl.style.borderRadius = ".375rem";
    helpPopupEl.style.visibility = "hidden";
    var clickedForPopup = false;
    var hovering = false;
    // implement it so that you can click for the popup to show
    helpEl.addEventListener("click", function () {
        if (hovering || helpPopupEl.style.visibility == "hidden") {
            helpPopupEl.style.visibility = "visible";
            clickedForPopup = true;
        }
        else if (helpPopupEl.style.visibility == "visible") {
            helpPopupEl.style.visibility = "hidden";
            clickedForPopup = false;
        }
    });
    popover.addEventListener("click", function () {
        if (helpPopupEl.style.visibility == "visible" && !hovering) {
            helpPopupEl.style.visibility = "hidden";
            clickedForPopup = false;
        }
    });
    helpEl.addEventListener("mouseover", function () {
        document.body.style.cursor = "pointer";
        if (!clickedForPopup) {
            helpPopupEl.style.visibility = "visible";
            hovering = true;
        }
    });
    helpEl.addEventListener("mouseout", function () {
        document.body.style.cursor = "default";
        if (!clickedForPopup) {
            helpPopupEl.style.visibility = "hidden";
        }
        hovering = false;
    });
    console.log("append");
    body.appendChild(helpEl);
    console.log("append2");
    popover.appendChild(helpPopupEl);
};
exports.helpMinimumConfidence = helpMinimumConfidence;


/***/ }),

/***/ "./src/contentScript/components/helpPopover.ts":
/*!*****************************************************!*\
  !*** ./src/contentScript/components/helpPopover.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.helpPopover = void 0;
const helpTemp = __webpack_require__(/*! ../../images/help.png */ "./src/images/help.png");
const helpImg = chrome.runtime.getURL("../js/images/help.png");
const helpPopover = (subHeaderEl, popover) => {
    const helpEl = document.createElement("img");
    helpEl.style.width = "24px";
    helpEl.style.height = "24px";
    helpEl.src = helpImg;
    helpEl.style.marginLeft = "3px";
    helpEl.id = "trigger";
    var helpPopupInfo = "<p>GPTCheck searches through Google with your highlighted sentence. Then, it takes the top website results and finds the sentences that are most similar. </p>";
    const helpPopupScoreExplanation = "<br /> <p> The confidence score uses the cosine similarity score, which measures how much the general gist of two sentences are similar, so higher = better. It measures this by using another machine learning language model to turn sentences into numbers and then calculates the correlation between the two numbers. </p>";
    const helpPopupFeedback = "<br /> <p> Send us feedback <b><a href='https://tinyurl.com/chatcheck-feedback'>here</a></b></p>";
    const helpPopupEl = document.createElement("div");
    helpPopupEl.style.width = "450px";
    helpPopupEl.style.height = "auto";
    helpPopupEl.style.zIndex = "10";
    helpPopupEl.style.backgroundColor = "rgb(32,33,35)";
    helpPopupEl.style.right = "115px";
    helpPopupEl.style.zIndex = "10000";
    helpPopupEl.style.outline = "1px solid grey";
    helpPopupEl.classList.add("popup");
    helpPopupInfo = "<div>" + helpPopupInfo + helpPopupScoreExplanation + helpPopupFeedback + "</div>";
    helpPopupEl.innerHTML = helpPopupInfo;
    helpPopupEl.style.marginTop = "50px";
    helpPopupEl.style.position = "absolute";
    helpPopupEl.style.padding = "15px";
    helpPopupEl.style.borderRadius = ".375rem";
    helpPopupEl.style.visibility = "hidden";
    var clickedForPopup = false;
    var hovering = false;
    // implement it so that you can click for the popup to show
    helpEl.addEventListener("click", function () {
        if (hovering || helpPopupEl.style.visibility == "hidden") {
            helpPopupEl.style.visibility = "visible";
            clickedForPopup = true;
        }
        else if (helpPopupEl.style.visibility == "visible") {
            helpPopupEl.style.visibility = "hidden";
            clickedForPopup = false;
        }
    });
    popover.addEventListener("click", function () {
        if (helpPopupEl.style.visibility == "visible" && !hovering) {
            helpPopupEl.style.visibility = "hidden";
            clickedForPopup = false;
        }
    });
    helpEl.addEventListener("mouseover", function () {
        document.body.style.cursor = "pointer";
        if (!clickedForPopup) {
            helpPopupEl.style.visibility = "visible";
            hovering = true;
        }
    });
    helpEl.addEventListener("mouseout", function () {
        document.body.style.cursor = "default";
        if (!clickedForPopup) {
            helpPopupEl.style.visibility = "hidden";
        }
        hovering = false;
    });
    subHeaderEl.appendChild(helpEl);
    popover.appendChild(helpPopupEl);
};
exports.helpPopover = helpPopover;


/***/ }),

/***/ "./src/contentScript/popover.ts":
/*!**************************************!*\
  !*** ./src/contentScript/popover.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.updatePopover = exports.getPopover = void 0;
const utils_1 = __webpack_require__(/*! ../utils */ "./src/utils.ts");
const exit_1 = __webpack_require__(/*! ./components/exit */ "./src/contentScript/components/exit.ts");
const helpMinimumConfidence_1 = __webpack_require__(/*! ./components/helpMinimumConfidence */ "./src/contentScript/components/helpMinimumConfidence.ts");
const helpPopover_1 = __webpack_require__(/*! ./components/helpPopover */ "./src/contentScript/components/helpPopover.ts");
const logoTemp = __webpack_require__(/*! ../images/logo.png */ "./src/images/logo.png");
const searchTemp = __webpack_require__(/*! ../images/search.png */ "./src/images/search.png");
const logoImg = chrome.runtime.getURL("js/images/logo.png");
const searchImg = chrome.runtime.getURL("js/images/search.png");
const getPopover = (selectionString, req) => {
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
    (0, helpPopover_1.helpPopover)(subHeaderEl, popover);
    // exit
    headerEl.appendChild(subHeaderEl);
    (0, exit_1.exitComponent)(headerEl);
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
    chrome.storage.local.get("thresholdScore", function (data) {
        // Set the default value of the input element to the threshold score
        var threshold_score = 50;
        if (data.thresholdScore) {
            threshold_score = parseInt(data.thresholdScore);
        }
        else {
            chrome.storage.local.set({ thresholdScore: 50 });
        }
        // callback function from input
        const saveThresholdScore = (new_score) => {
            chrome.storage.local.set({ thresholdScore: new_score });
        };
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
            console.log("there is a help icon");
            (0, helpMinimumConfidence_1.helpMinimumConfidence)(helpIcon, popover);
        }
        const inputElement = document.getElementById("input_threshold_score");
        inputElement === null || inputElement === void 0 ? void 0 : inputElement.addEventListener("input", function () {
            saveThresholdScore(parseInt(inputElement.value));
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
    googleTextEl.style.padding = "16px";
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
    }
    else {
        googleTextEl.innerHTML = req.extracted_paragraph;
    }
    const simScoreReport = document.createElement("p");
    const simScore = document.createElement("p");
    simScore.id = "similarity";
    simScore.style.fontSize = "13px";
    simScore.style.paddingInline = "16px";
    if (!req) {
        simScore.innerHTML = "";
    }
    else {
        // simScore.innerHTML = "Similarity score: " + req?.similarity_score;
        simScore.innerHTML = req === null || req === void 0 ? void 0 : req.similarity_score;
        simScore.style.color = (0, utils_1.decimalToColor)(parseFloat(req === null || req === void 0 ? void 0 : req.similarity_score));
    }
    simScoreReport.append(simScore);
    const googleTitleEl = document.createElement("a");
    const googleTitleDiv = document.createElement("div");
    googleTitleEl.id = "title";
    if (!req) {
        googleTitleEl.innerHTML = "";
        googleTitleEl.href = "";
    }
    else {
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
    }
    else {
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
exports.getPopover = getPopover;
const updatePopover = (data, selectionText) => {
    const para = document.getElementById("paragraph");
    const similarity = document.getElementById("similarity");
    const url = document.getElementById("url");
    const title = document.getElementById("title");
    const _selectionText = document.getElementById("selectionText");
    if (!data && selectionText) {
        para.innerHTML = "Searching...";
        similarity.innerHTML = "";
        url.innerHTML = "";
        title.innerHTML = "";
        _selectionText.innerHTML = selectionText;
    }
    else if (data) {
        similarity.style.color = (0, utils_1.decimalToColor)(parseFloat(data.similarity_score));
        para.innerHTML = data.extracted_paragraph;
        similarity.innerHTML =
            "<p style='display:inline; color: rgb(210, 214, 218); font-weight: normal' >Confidence: </p>" + data.similarity_score;
        url.innerHTML = data.URL;
        url.href = data.URL;
        url.target = "_blank";
        title.innerHTML = data.title;
        title.href = data.URL;
        title.target = "_blank";
    }
};
exports.updatePopover = updatePopover;
function colorLinks(hex) {
    var links = document.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) {
        if (links[i].href) {
            links[i].style.color = hex;
        }
    }
}


/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.decimalToColor = exports.sendMessageInCurrentTab = exports.getCurrentTab = void 0;
function getCurrentTab() {
    return __awaiter(this, void 0, void 0, function* () {
        const queryOptions = { active: true, lastFocusedWindow: true };
        const [tab] = yield chrome.tabs.query(queryOptions);
        return tab;
    });
}
exports.getCurrentTab = getCurrentTab;
function sendMessageInCurrentTab(message, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const tab = yield getCurrentTab();
        if (!tab.id)
            return;
        return sendMessageInTab(tab.id, message, callback);
    });
}
exports.sendMessageInCurrentTab = sendMessageInCurrentTab;
function sendMessageInTab(tabId, message, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        chrome.tabs.sendMessage(tabId, message, callback);
    });
}
function decimalToColor(decimal) {
    const red = Math.round(255 * (1 - decimal));
    const green = Math.round(255 * decimal);
    return `rgb(${red}, ${green}, 0)`;
}
exports.decimalToColor = decimalToColor;


/***/ }),

/***/ "./src/images/help.png":
/*!*****************************!*\
  !*** ./src/images/help.png ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "images/help.png";

/***/ }),

/***/ "./src/images/logo.png":
/*!*****************************!*\
  !*** ./src/images/logo.png ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "images/logo.png";

/***/ }),

/***/ "./src/images/search.png":
/*!*******************************!*\
  !*** ./src/images/search.png ***!
  \*******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "images/search.png";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "C:\\Users\\1kevi\\Desktop\\projects\\Startup\\doc-assist\\extension\\dist\\js\\";
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!*******************************!*\
  !*** ./src/content_script.ts ***!
  \*******************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const check_1 = __webpack_require__(/*! ./contentScript/check */ "./src/contentScript/check.ts");
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // console.log("HERE");
    switch (request.action) {
        case "check":
            // console.log("in check");
            (0, check_1.check)();
            break;
    }
    sendResponse({ result: "success" });
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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OztBQ0FhO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGdCQUFnQixtQkFBTyxDQUFDLDJEQUF1QjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLG1CQUFtQjtBQUN0QyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvLi9zcmMvY29udGVudFNjcmlwdC9jaGVjay50cyIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci8uL3NyYy9jb250ZW50U2NyaXB0L2NvbXBvbmVudHMvZXhpdC50cyIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci8uL3NyYy9jb250ZW50U2NyaXB0L2NvbXBvbmVudHMvaGVscE1pbmltdW1Db25maWRlbmNlLnRzIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyLy4vc3JjL2NvbnRlbnRTY3JpcHQvY29tcG9uZW50cy9oZWxwUG9wb3Zlci50cyIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci8uL3NyYy9jb250ZW50U2NyaXB0L3BvcG92ZXIudHMiLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvLi9zcmMvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvLi9zcmMvY29udGVudF9zY3JpcHQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5jaGVjayA9IHZvaWQgMDtcclxuY29uc3QgcG9wb3Zlcl8xID0gcmVxdWlyZShcIi4vcG9wb3ZlclwiKTtcclxuY29uc3QgY2hlY2sgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBzZWxlY3Rpb24gPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCk7XHJcbiAgICBjb25zdCBzZWxlY3Rpb25TdHJpbmcgPSBzZWxlY3Rpb24gPT09IG51bGwgfHwgc2VsZWN0aW9uID09PSB2b2lkIDAgPyB2b2lkIDAgOiBzZWxlY3Rpb24udG9TdHJpbmcoKTtcclxuICAgIGlmICghc2VsZWN0aW9uU3RyaW5nKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgIGNvbnN0IHAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNoYXRjaGVjay1wb3BvdmVyXCIpO1xyXG4gICAgaWYgKCFwKSB7XHJcbiAgICAgICAgbGV0IHBvcG92ZXIgPSAoMCwgcG9wb3Zlcl8xLmdldFBvcG92ZXIpKHNlbGVjdGlvblN0cmluZywgbnVsbCk7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5tYXJnaW5SaWdodCA9IFwiMjUwcHhcIjtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHBvcG92ZXIpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcC5zdHlsZS52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XHJcbiAgICAgICAgKDAsIHBvcG92ZXJfMS51cGRhdGVQb3BvdmVyKShudWxsLCBzZWxlY3Rpb25TdHJpbmcpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgdXJsUGFydHMgPSBuZXcgVVJMKGRvY3VtZW50LlVSTCkuaG9zdG5hbWUuc3BsaXQoJy4nKTtcclxuICAgIGNvbnN0IHJvb3RfVVJMID0gdXJsUGFydHNcclxuICAgICAgICAuc2xpY2UoMClcclxuICAgICAgICAuc2xpY2UoLSh1cmxQYXJ0cy5sZW5ndGggPT09IDQgPyAzIDogMikpXHJcbiAgICAgICAgLmpvaW4oJy4nKTtcclxuICAgIC8vIHJ1biB0aGUgZmFjdCBjaGVja1xyXG4gICAgLy8gR2V0IHRoZSB0aHJlc2hvbGQgc2NvcmUgZnJvbSBsb2NhbCBzdG9yYWdlXHJcbiAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoXCJ0aHJlc2hvbGRTY29yZVwiLCBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgIC8vIFNldCB0aGUgZGVmYXVsdCB2YWx1ZSBvZiB0aGUgaW5wdXQgZWxlbWVudCB0byB0aGUgdGhyZXNob2xkIHNjb3JlXHJcbiAgICAgICAgY29uc3QgdGhyZXNob2xkX3Njb3JlID0gZGF0YS50aHJlc2hvbGRTY29yZSAvIDEwMCB8fCAwLjU7XHJcbiAgICAgICAgZmV0Y2goXCJodHRwczovL2FwcC1xaGo2bnhsY21xLXVjLmEucnVuLmFwcC9mYWN0X2NoZWNrXCIsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgICAgICAgIGhpZ2hsaWdodGVkX3RleHQ6IHNlbGVjdGlvblN0cmluZyxcclxuICAgICAgICAgICAgICAgIGNvbnRleHRfc2l6ZTogMjAwLFxyXG4gICAgICAgICAgICAgICAgY3VycmVudF9VUkw6IHJvb3RfVVJMLFxyXG4gICAgICAgICAgICAgICAgc2ltaWxhcml0eV9zY29yZV90aHJlc2hvbGQ6IHRocmVzaG9sZF9zY29yZVxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICB9KVxyXG4gICAgICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHJlc3BvbnNlLmpzb24oKSlcclxuICAgICAgICAgICAgLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICgwLCBwb3BvdmVyXzEudXBkYXRlUG9wb3ZlcikoZGF0YSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufTtcclxuZXhwb3J0cy5jaGVjayA9IGNoZWNrO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmV4aXRDb21wb25lbnQgPSB2b2lkIDA7XHJcbmNvbnN0IGV4aXRDb21wb25lbnQgPSAoaGVhZGVyRWwpID0+IHtcclxuICAgIGNvbnN0IHhFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICB4RWwuaW5uZXJIVE1MID0gXCJYXCI7XHJcbiAgICB4RWwuc3R5bGUuY3Vyc29yID0gXCJwb2ludGVyXCI7XHJcbiAgICB4RWwub25jbGljayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBjb25zdCBlbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNoYXRjaGVjay1wb3BvdmVyXCIpO1xyXG4gICAgICAgIGlmIChlbGUpIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5tYXJnaW5SaWdodCA9IFwiMHB4XCI7XHJcbiAgICAgICAgICAgIGVsZS5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgaGVhZGVyRWwuYXBwZW5kQ2hpbGQoeEVsKTtcclxufTtcclxuZXhwb3J0cy5leGl0Q29tcG9uZW50ID0gZXhpdENvbXBvbmVudDtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5oZWxwTWluaW11bUNvbmZpZGVuY2UgPSB2b2lkIDA7XHJcbmNvbnN0IGhlbHBUZW1wID0gcmVxdWlyZShcIi4uLy4uL2ltYWdlcy9oZWxwLnBuZ1wiKTtcclxuY29uc3QgaGVscEltZyA9IGNocm9tZS5ydW50aW1lLmdldFVSTChcIi4uL2pzL2ltYWdlcy9oZWxwLnBuZ1wiKTtcclxuY29uc3QgaGVscE1pbmltdW1Db25maWRlbmNlID0gKGJvZHksIHBvcG92ZXIpID0+IHtcclxuICAgIGNvbnN0IGhlbHBFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgICBoZWxwRWwuc3R5bGUud2lkdGggPSBcIjI0cHhcIjtcclxuICAgIGhlbHBFbC5zdHlsZS5oZWlnaHQgPSBcIjI0cHhcIjtcclxuICAgIGhlbHBFbC5zdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmUtYmxvY2tcIjtcclxuICAgIGhlbHBFbC5zcmMgPSBoZWxwSW1nO1xyXG4gICAgaGVscEVsLnN0eWxlLm1hcmdpbkxlZnQgPSBcIjNweFwiO1xyXG4gICAgaGVscEVsLmlkID0gXCJ0cmlnZ2VyXCI7XHJcbiAgICB2YXIgaGVscFBvcHVwSW5mbyA9IFwiPHA+SG93IGNvbmZpZGVudCBzaG91bGQgR1BUQ2hlY2sgYmUgd2hlbiBzZWFyY2hpbmcgdGhyb3VnaCBhcnRpY2xlcz8gPC9wPlwiO1xyXG4gICAgY29uc3QgaGVscFBvcHVwU2NvcmVFeHBsYW5hdGlvbiA9IFwiPGJyIC8+IDxwPiBSZWNvbW1lbmRlZDogMC41LTAuNy4gTG93ZXIgdmFsdWVzIHdpbGwgbWFrZSBHUFRDaGVjayByZXNwb25kIGZhc3RlciwgYnV0IGFsc28gbW9yZSBsaWtlbHkgdG8gbWF0Y2ggaW5jb3JyZWN0bHkuIDwvcD5cIjtcclxuICAgIGNvbnN0IGhlbHBQb3B1cEZlZWRiYWNrID0gXCI8YnIgLz4gVXBkYXRlZCBjb25maWRlbmNlIGlzIGF1dG9tYXRpY2FsbHkgdXNlZCB0aGUgbmV4dCB0aW1lIEdQVENoZWNrIHNlYXJjaGVzLjwvcD5cIjtcclxuICAgIGNvbnN0IGhlbHBQb3B1cEVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGhlbHBQb3B1cEVsLnN0eWxlLndpZHRoID0gXCI0NTBweFwiO1xyXG4gICAgaGVscFBvcHVwRWwuc3R5bGUuaGVpZ2h0ID0gXCJhdXRvXCI7XHJcbiAgICBoZWxwUG9wdXBFbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcInJnYigzMiwzMywzNSlcIjtcclxuICAgIGhlbHBQb3B1cEVsLnN0eWxlLnJpZ2h0ID0gXCIxMTVweFwiO1xyXG4gICAgaGVscFBvcHVwRWwuc3R5bGUudG9wID0gXCIxMTBweFwiO1xyXG4gICAgaGVscFBvcHVwRWwuc3R5bGUuekluZGV4ID0gXCIxMDAwMFwiO1xyXG4gICAgaGVscFBvcHVwRWwuc3R5bGUub3V0bGluZSA9IFwiMXB4IHNvbGlkIGdyZXlcIjtcclxuICAgIGhlbHBQb3B1cEVsLmNsYXNzTGlzdC5hZGQoXCJwb3B1cFwiKTtcclxuICAgIGhlbHBQb3B1cEluZm8gPSBcIjxkaXY+XCIgKyBoZWxwUG9wdXBJbmZvICsgaGVscFBvcHVwU2NvcmVFeHBsYW5hdGlvbiArIGhlbHBQb3B1cEZlZWRiYWNrICsgXCI8L2Rpdj5cIjtcclxuICAgIGhlbHBQb3B1cEVsLmlubmVySFRNTCA9IGhlbHBQb3B1cEluZm87XHJcbiAgICBoZWxwUG9wdXBFbC5zdHlsZS5tYXJnaW5Ub3AgPSBcIjUwcHhcIjtcclxuICAgIGhlbHBQb3B1cEVsLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xyXG4gICAgaGVscFBvcHVwRWwuc3R5bGUucGFkZGluZyA9IFwiMTVweFwiO1xyXG4gICAgaGVscFBvcHVwRWwuc3R5bGUuYm9yZGVyUmFkaXVzID0gXCIuMzc1cmVtXCI7XHJcbiAgICBoZWxwUG9wdXBFbC5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcclxuICAgIHZhciBjbGlja2VkRm9yUG9wdXAgPSBmYWxzZTtcclxuICAgIHZhciBob3ZlcmluZyA9IGZhbHNlO1xyXG4gICAgLy8gaW1wbGVtZW50IGl0IHNvIHRoYXQgeW91IGNhbiBjbGljayBmb3IgdGhlIHBvcHVwIHRvIHNob3dcclxuICAgIGhlbHBFbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmIChob3ZlcmluZyB8fCBoZWxwUG9wdXBFbC5zdHlsZS52aXNpYmlsaXR5ID09IFwiaGlkZGVuXCIpIHtcclxuICAgICAgICAgICAgaGVscFBvcHVwRWwuc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xyXG4gICAgICAgICAgICBjbGlja2VkRm9yUG9wdXAgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChoZWxwUG9wdXBFbC5zdHlsZS52aXNpYmlsaXR5ID09IFwidmlzaWJsZVwiKSB7XHJcbiAgICAgICAgICAgIGhlbHBQb3B1cEVsLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xyXG4gICAgICAgICAgICBjbGlja2VkRm9yUG9wdXAgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIHBvcG92ZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoaGVscFBvcHVwRWwuc3R5bGUudmlzaWJpbGl0eSA9PSBcInZpc2libGVcIiAmJiAhaG92ZXJpbmcpIHtcclxuICAgICAgICAgICAgaGVscFBvcHVwRWwuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XHJcbiAgICAgICAgICAgIGNsaWNrZWRGb3JQb3B1cCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgaGVscEVsLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW92ZXJcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuY3Vyc29yID0gXCJwb2ludGVyXCI7XHJcbiAgICAgICAgaWYgKCFjbGlja2VkRm9yUG9wdXApIHtcclxuICAgICAgICAgICAgaGVscFBvcHVwRWwuc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xyXG4gICAgICAgICAgICBob3ZlcmluZyA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBoZWxwRWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3V0XCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLmN1cnNvciA9IFwiZGVmYXVsdFwiO1xyXG4gICAgICAgIGlmICghY2xpY2tlZEZvclBvcHVwKSB7XHJcbiAgICAgICAgICAgIGhlbHBQb3B1cEVsLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBob3ZlcmluZyA9IGZhbHNlO1xyXG4gICAgfSk7XHJcbiAgICBjb25zb2xlLmxvZyhcImFwcGVuZFwiKTtcclxuICAgIGJvZHkuYXBwZW5kQ2hpbGQoaGVscEVsKTtcclxuICAgIGNvbnNvbGUubG9nKFwiYXBwZW5kMlwiKTtcclxuICAgIHBvcG92ZXIuYXBwZW5kQ2hpbGQoaGVscFBvcHVwRWwpO1xyXG59O1xyXG5leHBvcnRzLmhlbHBNaW5pbXVtQ29uZmlkZW5jZSA9IGhlbHBNaW5pbXVtQ29uZmlkZW5jZTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5oZWxwUG9wb3ZlciA9IHZvaWQgMDtcclxuY29uc3QgaGVscFRlbXAgPSByZXF1aXJlKFwiLi4vLi4vaW1hZ2VzL2hlbHAucG5nXCIpO1xyXG5jb25zdCBoZWxwSW1nID0gY2hyb21lLnJ1bnRpbWUuZ2V0VVJMKFwiLi4vanMvaW1hZ2VzL2hlbHAucG5nXCIpO1xyXG5jb25zdCBoZWxwUG9wb3ZlciA9IChzdWJIZWFkZXJFbCwgcG9wb3ZlcikgPT4ge1xyXG4gICAgY29uc3QgaGVscEVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcclxuICAgIGhlbHBFbC5zdHlsZS53aWR0aCA9IFwiMjRweFwiO1xyXG4gICAgaGVscEVsLnN0eWxlLmhlaWdodCA9IFwiMjRweFwiO1xyXG4gICAgaGVscEVsLnNyYyA9IGhlbHBJbWc7XHJcbiAgICBoZWxwRWwuc3R5bGUubWFyZ2luTGVmdCA9IFwiM3B4XCI7XHJcbiAgICBoZWxwRWwuaWQgPSBcInRyaWdnZXJcIjtcclxuICAgIHZhciBoZWxwUG9wdXBJbmZvID0gXCI8cD5HUFRDaGVjayBzZWFyY2hlcyB0aHJvdWdoIEdvb2dsZSB3aXRoIHlvdXIgaGlnaGxpZ2h0ZWQgc2VudGVuY2UuIFRoZW4sIGl0IHRha2VzIHRoZSB0b3Agd2Vic2l0ZSByZXN1bHRzIGFuZCBmaW5kcyB0aGUgc2VudGVuY2VzIHRoYXQgYXJlIG1vc3Qgc2ltaWxhci4gPC9wPlwiO1xyXG4gICAgY29uc3QgaGVscFBvcHVwU2NvcmVFeHBsYW5hdGlvbiA9IFwiPGJyIC8+IDxwPiBUaGUgY29uZmlkZW5jZSBzY29yZSB1c2VzIHRoZSBjb3NpbmUgc2ltaWxhcml0eSBzY29yZSwgd2hpY2ggbWVhc3VyZXMgaG93IG11Y2ggdGhlIGdlbmVyYWwgZ2lzdCBvZiB0d28gc2VudGVuY2VzIGFyZSBzaW1pbGFyLCBzbyBoaWdoZXIgPSBiZXR0ZXIuIEl0IG1lYXN1cmVzIHRoaXMgYnkgdXNpbmcgYW5vdGhlciBtYWNoaW5lIGxlYXJuaW5nIGxhbmd1YWdlIG1vZGVsIHRvIHR1cm4gc2VudGVuY2VzIGludG8gbnVtYmVycyBhbmQgdGhlbiBjYWxjdWxhdGVzIHRoZSBjb3JyZWxhdGlvbiBiZXR3ZWVuIHRoZSB0d28gbnVtYmVycy4gPC9wPlwiO1xyXG4gICAgY29uc3QgaGVscFBvcHVwRmVlZGJhY2sgPSBcIjxiciAvPiA8cD4gU2VuZCB1cyBmZWVkYmFjayA8Yj48YSBocmVmPSdodHRwczovL3Rpbnl1cmwuY29tL2NoYXRjaGVjay1mZWVkYmFjayc+aGVyZTwvYT48L2I+PC9wPlwiO1xyXG4gICAgY29uc3QgaGVscFBvcHVwRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgaGVscFBvcHVwRWwuc3R5bGUud2lkdGggPSBcIjQ1MHB4XCI7XHJcbiAgICBoZWxwUG9wdXBFbC5zdHlsZS5oZWlnaHQgPSBcImF1dG9cIjtcclxuICAgIGhlbHBQb3B1cEVsLnN0eWxlLnpJbmRleCA9IFwiMTBcIjtcclxuICAgIGhlbHBQb3B1cEVsLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwicmdiKDMyLDMzLDM1KVwiO1xyXG4gICAgaGVscFBvcHVwRWwuc3R5bGUucmlnaHQgPSBcIjExNXB4XCI7XHJcbiAgICBoZWxwUG9wdXBFbC5zdHlsZS56SW5kZXggPSBcIjEwMDAwXCI7XHJcbiAgICBoZWxwUG9wdXBFbC5zdHlsZS5vdXRsaW5lID0gXCIxcHggc29saWQgZ3JleVwiO1xyXG4gICAgaGVscFBvcHVwRWwuY2xhc3NMaXN0LmFkZChcInBvcHVwXCIpO1xyXG4gICAgaGVscFBvcHVwSW5mbyA9IFwiPGRpdj5cIiArIGhlbHBQb3B1cEluZm8gKyBoZWxwUG9wdXBTY29yZUV4cGxhbmF0aW9uICsgaGVscFBvcHVwRmVlZGJhY2sgKyBcIjwvZGl2PlwiO1xyXG4gICAgaGVscFBvcHVwRWwuaW5uZXJIVE1MID0gaGVscFBvcHVwSW5mbztcclxuICAgIGhlbHBQb3B1cEVsLnN0eWxlLm1hcmdpblRvcCA9IFwiNTBweFwiO1xyXG4gICAgaGVscFBvcHVwRWwuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XHJcbiAgICBoZWxwUG9wdXBFbC5zdHlsZS5wYWRkaW5nID0gXCIxNXB4XCI7XHJcbiAgICBoZWxwUG9wdXBFbC5zdHlsZS5ib3JkZXJSYWRpdXMgPSBcIi4zNzVyZW1cIjtcclxuICAgIGhlbHBQb3B1cEVsLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xyXG4gICAgdmFyIGNsaWNrZWRGb3JQb3B1cCA9IGZhbHNlO1xyXG4gICAgdmFyIGhvdmVyaW5nID0gZmFsc2U7XHJcbiAgICAvLyBpbXBsZW1lbnQgaXQgc28gdGhhdCB5b3UgY2FuIGNsaWNrIGZvciB0aGUgcG9wdXAgdG8gc2hvd1xyXG4gICAgaGVscEVsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKGhvdmVyaW5nIHx8IGhlbHBQb3B1cEVsLnN0eWxlLnZpc2liaWxpdHkgPT0gXCJoaWRkZW5cIikge1xyXG4gICAgICAgICAgICBoZWxwUG9wdXBFbC5zdHlsZS52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XHJcbiAgICAgICAgICAgIGNsaWNrZWRGb3JQb3B1cCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGhlbHBQb3B1cEVsLnN0eWxlLnZpc2liaWxpdHkgPT0gXCJ2aXNpYmxlXCIpIHtcclxuICAgICAgICAgICAgaGVscFBvcHVwRWwuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XHJcbiAgICAgICAgICAgIGNsaWNrZWRGb3JQb3B1cCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcG9wb3Zlci5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmIChoZWxwUG9wdXBFbC5zdHlsZS52aXNpYmlsaXR5ID09IFwidmlzaWJsZVwiICYmICFob3ZlcmluZykge1xyXG4gICAgICAgICAgICBoZWxwUG9wdXBFbC5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcclxuICAgICAgICAgICAgY2xpY2tlZEZvclBvcHVwID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBoZWxwRWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3ZlclwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5jdXJzb3IgPSBcInBvaW50ZXJcIjtcclxuICAgICAgICBpZiAoIWNsaWNrZWRGb3JQb3B1cCkge1xyXG4gICAgICAgICAgICBoZWxwUG9wdXBFbC5zdHlsZS52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XHJcbiAgICAgICAgICAgIGhvdmVyaW5nID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIGhlbHBFbC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdXRcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuY3Vyc29yID0gXCJkZWZhdWx0XCI7XHJcbiAgICAgICAgaWYgKCFjbGlja2VkRm9yUG9wdXApIHtcclxuICAgICAgICAgICAgaGVscFBvcHVwRWwuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGhvdmVyaW5nID0gZmFsc2U7XHJcbiAgICB9KTtcclxuICAgIHN1YkhlYWRlckVsLmFwcGVuZENoaWxkKGhlbHBFbCk7XHJcbiAgICBwb3BvdmVyLmFwcGVuZENoaWxkKGhlbHBQb3B1cEVsKTtcclxufTtcclxuZXhwb3J0cy5oZWxwUG9wb3ZlciA9IGhlbHBQb3BvdmVyO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLnVwZGF0ZVBvcG92ZXIgPSBleHBvcnRzLmdldFBvcG92ZXIgPSB2b2lkIDA7XHJcbmNvbnN0IHV0aWxzXzEgPSByZXF1aXJlKFwiLi4vdXRpbHNcIik7XHJcbmNvbnN0IGV4aXRfMSA9IHJlcXVpcmUoXCIuL2NvbXBvbmVudHMvZXhpdFwiKTtcclxuY29uc3QgaGVscE1pbmltdW1Db25maWRlbmNlXzEgPSByZXF1aXJlKFwiLi9jb21wb25lbnRzL2hlbHBNaW5pbXVtQ29uZmlkZW5jZVwiKTtcclxuY29uc3QgaGVscFBvcG92ZXJfMSA9IHJlcXVpcmUoXCIuL2NvbXBvbmVudHMvaGVscFBvcG92ZXJcIik7XHJcbmNvbnN0IGxvZ29UZW1wID0gcmVxdWlyZShcIi4uL2ltYWdlcy9sb2dvLnBuZ1wiKTtcclxuY29uc3Qgc2VhcmNoVGVtcCA9IHJlcXVpcmUoXCIuLi9pbWFnZXMvc2VhcmNoLnBuZ1wiKTtcclxuY29uc3QgbG9nb0ltZyA9IGNocm9tZS5ydW50aW1lLmdldFVSTChcImpzL2ltYWdlcy9sb2dvLnBuZ1wiKTtcclxuY29uc3Qgc2VhcmNoSW1nID0gY2hyb21lLnJ1bnRpbWUuZ2V0VVJMKFwianMvaW1hZ2VzL3NlYXJjaC5wbmdcIik7XHJcbmNvbnN0IGdldFBvcG92ZXIgPSAoc2VsZWN0aW9uU3RyaW5nLCByZXEpID0+IHtcclxuICAgIC8vIFBvcG92ZXIgZWxlbWVudFxyXG4gICAgY29uc3QgcG9wb3ZlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBwb3BvdmVyLnN0eWxlLndpZHRoID0gXCIzMDBweFwiO1xyXG4gICAgcG9wb3Zlci5zdHlsZS5oZWlnaHQgPSBcIjEwMHZoXCI7XHJcbiAgICBwb3BvdmVyLnN0eWxlLnpJbmRleCA9IFwiMTAwMDBcIjtcclxuICAgIHBvcG92ZXIuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJyZ2IoMzIsMzMsMzUpXCI7XHJcbiAgICBwb3BvdmVyLnN0eWxlLnBvc2l0aW9uID0gXCJmaXhlZFwiO1xyXG4gICAgcG9wb3Zlci5zdHlsZS5yaWdodCA9IFwiMFwiO1xyXG4gICAgcG9wb3Zlci5zdHlsZS50b3AgPSBcIjBcIjtcclxuICAgIHBvcG92ZXIuc3R5bGUuZm9udEZhbWlseSA9IFwiVmVyZGFuYSxzYW5zLXNlcmlmXCI7XHJcbiAgICBwb3BvdmVyLnN0eWxlLmNvbG9yID0gXCJyZ2IoMjEwLCAyMTQsIDIxOClcIjtcclxuICAgIHBvcG92ZXIuaWQgPSBcImNoYXRjaGVjay1wb3BvdmVyXCI7XHJcbiAgICAvLyBzZWFyY2ggYmFyIGJvcmRlcnNcclxuICAgIGNvbnN0IGhyMSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoclwiKTtcclxuICAgIGhyMS5zdHlsZS5vcGFjaXR5ID0gXCI0MCVcIjtcclxuICAgIGhyMS5zdHlsZS5tYXJnaW4gPSBcIjBweFwiO1xyXG4gICAgY29uc3QgaHIyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImhyXCIpO1xyXG4gICAgaHIyLnN0eWxlLm9wYWNpdHkgPSBcIjQwJVwiO1xyXG4gICAgaHIyLnN0eWxlLm1hcmdpbiA9IFwiMHB4XCI7XHJcbiAgICBjb25zdCBoZWFkZXJFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBoZWFkZXJFbC5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XHJcbiAgICBoZWFkZXJFbC5zdHlsZS5qdXN0aWZ5Q29udGVudCA9IFwic3BhY2UtYmV0d2VlblwiO1xyXG4gICAgaGVhZGVyRWwuc3R5bGUucGFkZGluZ1JpZ2h0ID0gXCIxNnB4XCI7XHJcbiAgICBoZWFkZXJFbC5zdHlsZS5wYWRkaW5nTGVmdCA9IFwiOHB4XCI7XHJcbiAgICBoZWFkZXJFbC5zdHlsZS5hbGlnbkl0ZW1zID0gXCJjZW50ZXJcIjtcclxuICAgIGhlYWRlckVsLnN0eWxlLmhlaWdodCA9IFwiNjVweFwiO1xyXG4gICAgY29uc3Qgc3ViSGVhZGVyRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgc3ViSGVhZGVyRWwuc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xyXG4gICAgc3ViSGVhZGVyRWwuc3R5bGUuYWxpZ25JdGVtcyA9IFwiY2VudGVyXCI7XHJcbiAgICAvLyBUaXRsZVxyXG4gICAgY29uc3QgdGl0bGUgPSBcIjxiPjxwPkdQVENoZWNrPC9wPjwvYj5cIjtcclxuICAgIGNvbnN0IHRpdGxlRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgdGl0bGVFbC5pbm5lckhUTUwgPSB0aXRsZTtcclxuICAgIHRpdGxlRWwuc3R5bGUubWFyZ2luTGVmdCA9IFwiOHB4XCI7XHJcbiAgICB0aXRsZUVsLnN0eWxlLmZvbnRTaXplID0gXCIxNnB4XCI7XHJcbiAgICBjb25zdCBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgaW1nLnN0eWxlLndpZHRoID0gXCI0OHB4XCI7XHJcbiAgICBpbWcuc3R5bGUuaGVpZ2h0ID0gXCI0OHB4XCI7XHJcbiAgICBpbWcuc3JjID0gbG9nb0ltZztcclxuICAgIHN1YkhlYWRlckVsLmFwcGVuZENoaWxkKGltZyk7XHJcbiAgICBzdWJIZWFkZXJFbC5hcHBlbmRDaGlsZCh0aXRsZUVsKTtcclxuICAgIC8vIGZvciB0aGUgaGVscCBmdW5jdGlvblxyXG4gICAgKDAsIGhlbHBQb3BvdmVyXzEuaGVscFBvcG92ZXIpKHN1YkhlYWRlckVsLCBwb3BvdmVyKTtcclxuICAgIC8vIGV4aXRcclxuICAgIGhlYWRlckVsLmFwcGVuZENoaWxkKHN1YkhlYWRlckVsKTtcclxuICAgICgwLCBleGl0XzEuZXhpdENvbXBvbmVudCkoaGVhZGVyRWwpO1xyXG4gICAgLy8gZm9yIHRoZSBzZWFyY2ggYmFyIGRpc3BsYXlcclxuICAgIGNvbnN0IG1hZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgICBtYWcuc3JjID0gc2VhcmNoSW1nO1xyXG4gICAgbWFnLnN0eWxlLndpZHRoID0gXCIyNHB4XCI7XHJcbiAgICBtYWcuc3R5bGUuaGVpZ2h0ID0gXCIyNHB4XCI7XHJcbiAgICBtYWcuc3R5bGUubWFyZ2luTGVmdCA9IFwiOHB4XCI7XHJcbiAgICBjb25zdCBzZWxlY3Rpb25GbGV4ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIHNlbGVjdGlvbkZsZXguc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xyXG4gICAgc2VsZWN0aW9uRmxleC5zdHlsZS5hbGlnbkl0ZW1zID0gXCJjZW50ZXJcIjtcclxuICAgIHNlbGVjdGlvbkZsZXguc3R5bGUuaGVpZ2h0ID0gXCI1NnB4XCI7XHJcbiAgICBjb25zdCBzZWxlY3Rpb24gPSBgJHtzZWxlY3Rpb25TdHJpbmd9YDtcclxuICAgIGNvbnN0IHNlbGVjdGlvbkVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XHJcbiAgICBzZWxlY3Rpb25FbC5pbm5lckhUTUwgPSBzZWxlY3Rpb247XHJcbiAgICBzZWxlY3Rpb25FbC5zdHlsZS5wYWRkaW5nQmxvY2sgPSBcIjE2cHhcIjtcclxuICAgIHNlbGVjdGlvbkVsLnN0eWxlLnBhZGRpbmdSaWdodCA9IFwiMTZweFwiO1xyXG4gICAgc2VsZWN0aW9uRWwuc3R5bGUucGFkZGluZ0xlZnQgPSBcIjhweFwiO1xyXG4gICAgc2VsZWN0aW9uRWwuc3R5bGUubWF4SGVpZ2h0ID0gXCI1NnB4XCI7XHJcbiAgICBzZWxlY3Rpb25FbC5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCI7XHJcbiAgICBzZWxlY3Rpb25FbC5zdHlsZS5mb250U2l6ZSA9IFwiMTNweFwiO1xyXG4gICAgc2VsZWN0aW9uRWwuc3R5bGUudGV4dE92ZXJmbG93ID0gXCJlbGxpcHNpc1wiO1xyXG4gICAgc2VsZWN0aW9uRWwuc3R5bGUud2hpdGVTcGFjZSA9IFwibm93cmFwXCI7XHJcbiAgICBzZWxlY3Rpb25FbC5pZCA9IFwic2VsZWN0aW9uVGV4dFwiO1xyXG4gICAgc2VsZWN0aW9uRmxleC5hcHBlbmRDaGlsZChtYWcpO1xyXG4gICAgc2VsZWN0aW9uRmxleC5hcHBlbmRDaGlsZChzZWxlY3Rpb25FbCk7XHJcbiAgICAvLyBmb3Igc2V0dGluZyB5b3VyIHNpbWlsYXJpdHkgc2NvcmUgdGhyZXNob2xkXHJcbiAgICBjb25zdCBzaW1pbGFyaXR5X3Njb3JlX3NldHRpbmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgLy8gR2V0IHRoZSB0aHJlc2hvbGQgc2NvcmUgZnJvbSBsb2NhbCBzdG9yYWdlXHJcbiAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoXCJ0aHJlc2hvbGRTY29yZVwiLCBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgIC8vIFNldCB0aGUgZGVmYXVsdCB2YWx1ZSBvZiB0aGUgaW5wdXQgZWxlbWVudCB0byB0aGUgdGhyZXNob2xkIHNjb3JlXHJcbiAgICAgICAgdmFyIHRocmVzaG9sZF9zY29yZSA9IDUwO1xyXG4gICAgICAgIGlmIChkYXRhLnRocmVzaG9sZFNjb3JlKSB7XHJcbiAgICAgICAgICAgIHRocmVzaG9sZF9zY29yZSA9IHBhcnNlSW50KGRhdGEudGhyZXNob2xkU2NvcmUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgdGhyZXNob2xkU2NvcmU6IDUwIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjYWxsYmFjayBmdW5jdGlvbiBmcm9tIGlucHV0XHJcbiAgICAgICAgY29uc3Qgc2F2ZVRocmVzaG9sZFNjb3JlID0gKG5ld19zY29yZSkgPT4ge1xyXG4gICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyB0aHJlc2hvbGRTY29yZTogbmV3X3Njb3JlIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgLy8gc3R5bGU9XCJkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XCJcclxuICAgICAgICBzaW1pbGFyaXR5X3Njb3JlX3NldHRpbmcuaW5uZXJIVE1MID0gYFxyXG4gICAgICA8Zm9ybSBzdHlsZT1cInBhZGRpbmctdG9wOiAxMHB4OyBwYWRkaW5nLWxlZnQ6IDEwcHg7Zm9udC1zaXplOiAxM3B4OyBcIj5cclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgPGxhYmVsIHN0eWxlPVwiZGlzcGxheTogaW5saW5lLWJsb2NrO1wiIGlkPVwibGFiZWxcIiBmb3I9XCJzY29yZVwiPk1pbmltdW0gY29uZmlkZW5jZTwvbGFiZWw+XHJcbiAgICAgICAgICA8c3BhbiBzdHlsZT1cImRpc3BsYXk6IGlubGluZS1ibG9jaztcIiBpZD1cImhlbHAtaWNvblwiPjwvc3Bhbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8aW5wdXQgdHlwZT1cInJhbmdlXCIgaWQ9XCJpbnB1dF90aHJlc2hvbGRfc2NvcmVcIiBuYW1lPVwic2NvcmVcIiBtaW49XCIyNVwiIG1heD1cIjkwXCIgc3RlcD1cIjFcIiB2YWx1ZT1cIiR7dGhyZXNob2xkX3Njb3JlfVwiIG9uaW5wdXQ9XCJvdXRwdXQudmFsdWUgPSBzY29yZS52YWx1ZSArICclJ1wiIHN0eWxlPVwibWFyZ2luLXRvcDogNXB4O1wiPlxyXG4gICAgICAgIDxvdXRwdXQgZm9yPVwic2NvcmVcIiBpZD1cIm91dHB1dFwiPiR7dGhyZXNob2xkX3Njb3JlfSU8L291dHB1dD5cclxuICAgICAgPC9mb3JtPlxyXG4gICAgYDtcclxuICAgICAgICBjb25zdCBoZWxwSWNvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaGVscC1pY29uXCIpO1xyXG4gICAgICAgIGlmIChoZWxwSWNvbikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInRoZXJlIGlzIGEgaGVscCBpY29uXCIpO1xyXG4gICAgICAgICAgICAoMCwgaGVscE1pbmltdW1Db25maWRlbmNlXzEuaGVscE1pbmltdW1Db25maWRlbmNlKShoZWxwSWNvbiwgcG9wb3Zlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGlucHV0RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5wdXRfdGhyZXNob2xkX3Njb3JlXCIpO1xyXG4gICAgICAgIGlucHV0RWxlbWVudCA9PT0gbnVsbCB8fCBpbnB1dEVsZW1lbnQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGlucHV0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBzYXZlVGhyZXNob2xkU2NvcmUocGFyc2VJbnQoaW5wdXRFbGVtZW50LnZhbHVlKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIC8vIGZvciB0aGUgc2VhcmNoIHJlc3VsdCBkaXNwbGF5XHJcbiAgICBjb25zdCBnb29nbGVJbmZvRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgZ29vZ2xlSW5mb0VsLnN0eWxlLm1hcmdpbiA9IFwiOHB4XCI7XHJcbiAgICBnb29nbGVJbmZvRWwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJyZ2IoNTIsNTMsNjQpXCI7XHJcbiAgICBnb29nbGVJbmZvRWwuc3R5bGUuYm9yZGVyUmFkaXVzID0gXCIuMzc1cmVtXCI7XHJcbiAgICBjb25zdCBkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGQuc3R5bGUub3ZlcmZsb3cgPSBcImhpZGRlblwiO1xyXG4gICAgY29uc3QgZ29vZ2xlVGV4dEVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XHJcbiAgICBnb29nbGVUZXh0RWwuc3R5bGUucGFkZGluZyA9IFwiMTZweFwiO1xyXG4gICAgZ29vZ2xlVGV4dEVsLnN0eWxlLm1hcmdpbiA9IFwiMHB4XCI7XHJcbiAgICBnb29nbGVUZXh0RWwuc3R5bGUuZm9udFNpemUgPSBcIjEzcHhcIjtcclxuICAgIGdvb2dsZVRleHRFbC5zdHlsZS5jb2xvciA9IFwicmdiKDIxMCwyMTQsMjE4KVwiO1xyXG4gICAgZ29vZ2xlVGV4dEVsLmlkID0gXCJwYXJhZ3JhcGhcIjtcclxuICAgIGdvb2dsZVRleHRFbC5zdHlsZS5tYXhIZWlnaHQgPSBcIjUwMHB4XCI7XHJcbiAgICAvLyBnb29nbGVUZXh0RWwuc3R5bGUub3ZlcmZsb3cgPSBcInNjcm9sbFwiO1xyXG4gICAgaWYgKCFyZXEpIHtcclxuICAgICAgICBnb29nbGVUZXh0RWwuaW5uZXJIVE1MID0gXCJTZWFyY2hpbmcuLi5cIjtcclxuICAgICAgICBkLmFwcGVuZENoaWxkKGdvb2dsZVRleHRFbCk7XHJcbiAgICAgICAgZ29vZ2xlSW5mb0VsLmFwcGVuZENoaWxkKGQpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZ29vZ2xlVGV4dEVsLmlubmVySFRNTCA9IHJlcS5leHRyYWN0ZWRfcGFyYWdyYXBoO1xyXG4gICAgfVxyXG4gICAgY29uc3Qgc2ltU2NvcmVSZXBvcnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcclxuICAgIGNvbnN0IHNpbVNjb3JlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XHJcbiAgICBzaW1TY29yZS5pZCA9IFwic2ltaWxhcml0eVwiO1xyXG4gICAgc2ltU2NvcmUuc3R5bGUuZm9udFNpemUgPSBcIjEzcHhcIjtcclxuICAgIHNpbVNjb3JlLnN0eWxlLnBhZGRpbmdJbmxpbmUgPSBcIjE2cHhcIjtcclxuICAgIGlmICghcmVxKSB7XHJcbiAgICAgICAgc2ltU2NvcmUuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIC8vIHNpbVNjb3JlLmlubmVySFRNTCA9IFwiU2ltaWxhcml0eSBzY29yZTogXCIgKyByZXE/LnNpbWlsYXJpdHlfc2NvcmU7XHJcbiAgICAgICAgc2ltU2NvcmUuaW5uZXJIVE1MID0gcmVxID09PSBudWxsIHx8IHJlcSA9PT0gdm9pZCAwID8gdm9pZCAwIDogcmVxLnNpbWlsYXJpdHlfc2NvcmU7XHJcbiAgICAgICAgc2ltU2NvcmUuc3R5bGUuY29sb3IgPSAoMCwgdXRpbHNfMS5kZWNpbWFsVG9Db2xvcikocGFyc2VGbG9hdChyZXEgPT09IG51bGwgfHwgcmVxID09PSB2b2lkIDAgPyB2b2lkIDAgOiByZXEuc2ltaWxhcml0eV9zY29yZSkpO1xyXG4gICAgfVxyXG4gICAgc2ltU2NvcmVSZXBvcnQuYXBwZW5kKHNpbVNjb3JlKTtcclxuICAgIGNvbnN0IGdvb2dsZVRpdGxlRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcclxuICAgIGNvbnN0IGdvb2dsZVRpdGxlRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGdvb2dsZVRpdGxlRWwuaWQgPSBcInRpdGxlXCI7XHJcbiAgICBpZiAoIXJlcSkge1xyXG4gICAgICAgIGdvb2dsZVRpdGxlRWwuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICBnb29nbGVUaXRsZUVsLmhyZWYgPSBcIlwiO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZ29vZ2xlVGl0bGVFbC5pbm5lckhUTUwgPSByZXEudGl0bGU7XHJcbiAgICAgICAgZ29vZ2xlVGl0bGVFbC5ocmVmID0gcmVxLlVSTDtcclxuICAgICAgICBnb29nbGVUaXRsZUVsLnRhcmdldCA9IFwiX2JsYW5rXCI7XHJcbiAgICB9XHJcbiAgICBnb29nbGVUaXRsZURpdi5zdHlsZS5jb2xvciA9IFwicmdiKDE0NywxNzksMjQyKVwiO1xyXG4gICAgZ29vZ2xlVGl0bGVEaXYuc3R5bGUuZm9udFNpemUgPSBcIjE1cHhcIjtcclxuICAgIGdvb2dsZVRpdGxlRGl2LnN0eWxlLnBhZGRpbmdJbmxpbmUgPSBcIjE2cHhcIjtcclxuICAgIGdvb2dsZVRpdGxlRGl2LnN0eWxlLnBhZGRpbmdCb3R0b20gPSBcIjE2cHhcIjtcclxuICAgIGdvb2dsZVRpdGxlRGl2LmFwcGVuZENoaWxkKGdvb2dsZVRpdGxlRWwpO1xyXG4gICAgY29uc3QgZ29vZ2xlVXJsRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcclxuICAgIGNvbnN0IGdvb2dsZVVybERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBnb29nbGVVcmxFbC5pZCA9IFwidXJsXCI7XHJcbiAgICBpZiAoIXJlcSkge1xyXG4gICAgICAgIGdvb2dsZVVybEVsLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgZ29vZ2xlVXJsRWwuaHJlZiA9IFwiXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBnb29nbGVVcmxFbC5pbm5lckhUTUwgPSByZXEuVVJMO1xyXG4gICAgICAgIGdvb2dsZVVybEVsLmhyZWYgPSByZXEuVVJMO1xyXG4gICAgICAgIGdvb2dsZVVybEVsLnRhcmdldCA9IFwiX2JsYW5rXCI7XHJcbiAgICB9XHJcbiAgICBnb29nbGVVcmxEaXYuc3R5bGUub3ZlcmZsb3cgPSBcImhpZGRlblwiO1xyXG4gICAgLy8gZ29vZ2xlVXJsRGl2LnN0eWxlLmhlaWdodCA9IFwiMTRweFwiO1xyXG4gICAgZ29vZ2xlVXJsRGl2LnN0eWxlLnRleHRPdmVyZmxvdyA9IFwiZWxsaXBzaXNcIjtcclxuICAgIGdvb2dsZVVybERpdi5zdHlsZS5mb250U2l6ZSA9IFwiMTNweFwiO1xyXG4gICAgLy8gZ29vZ2xlVXJsRGl2LnN0eWxlLnBhZGRpbmcgPSBcIjE2cHhcIjtcclxuICAgIGdvb2dsZVVybERpdi5zdHlsZS5wYWRkaW5nSW5saW5lID0gXCIxNnB4XCI7XHJcbiAgICBnb29nbGVVcmxEaXYuc3R5bGUucGFkZGluZ0Jsb2NrID0gXCI4cHhcIjtcclxuICAgIGdvb2dsZVVybERpdi5zdHlsZS5jb2xvciA9IFwicmdiKDE5MCwxOTMsMTk3KVwiO1xyXG4gICAgZ29vZ2xlVXJsRGl2LnN0eWxlLndoaXRlU3BhY2UgPSBcIm5vd3JhcFwiO1xyXG4gICAgZ29vZ2xlVXJsRGl2LmFwcGVuZENoaWxkKGdvb2dsZVVybEVsKTtcclxuICAgIGdvb2dsZUluZm9FbC5hcHBlbmRDaGlsZChzaW1TY29yZVJlcG9ydCk7XHJcbiAgICBnb29nbGVJbmZvRWwuYXBwZW5kQ2hpbGQoZ29vZ2xlVXJsRGl2KTtcclxuICAgIGdvb2dsZUluZm9FbC5hcHBlbmRDaGlsZChnb29nbGVUaXRsZURpdik7XHJcbiAgICAvLyBhZGQgZXZlcnl0aGluZyB0byBwb3BvdmVyXHJcbiAgICBwb3BvdmVyLmFwcGVuZENoaWxkKGhlYWRlckVsKTtcclxuICAgIHBvcG92ZXIuYXBwZW5kQ2hpbGQoaHIxKTtcclxuICAgIHBvcG92ZXIuYXBwZW5kQ2hpbGQoc2VsZWN0aW9uRmxleCk7XHJcbiAgICBwb3BvdmVyLmFwcGVuZENoaWxkKGhyMik7XHJcbiAgICBwb3BvdmVyLmFwcGVuZENoaWxkKHNpbWlsYXJpdHlfc2NvcmVfc2V0dGluZyk7XHJcbiAgICBwb3BvdmVyLmFwcGVuZENoaWxkKGdvb2dsZUluZm9FbCk7XHJcbiAgICBjb2xvckxpbmtzKFwicmdiKDE5MCwxOTMsMTk3KVwiKTtcclxuICAgIHJldHVybiBwb3BvdmVyO1xyXG59O1xyXG5leHBvcnRzLmdldFBvcG92ZXIgPSBnZXRQb3BvdmVyO1xyXG5jb25zdCB1cGRhdGVQb3BvdmVyID0gKGRhdGEsIHNlbGVjdGlvblRleHQpID0+IHtcclxuICAgIGNvbnN0IHBhcmEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBhcmFncmFwaFwiKTtcclxuICAgIGNvbnN0IHNpbWlsYXJpdHkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNpbWlsYXJpdHlcIik7XHJcbiAgICBjb25zdCB1cmwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVybFwiKTtcclxuICAgIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0aXRsZVwiKTtcclxuICAgIGNvbnN0IF9zZWxlY3Rpb25UZXh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3Rpb25UZXh0XCIpO1xyXG4gICAgaWYgKCFkYXRhICYmIHNlbGVjdGlvblRleHQpIHtcclxuICAgICAgICBwYXJhLmlubmVySFRNTCA9IFwiU2VhcmNoaW5nLi4uXCI7XHJcbiAgICAgICAgc2ltaWxhcml0eS5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgIHVybC5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgIHRpdGxlLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgX3NlbGVjdGlvblRleHQuaW5uZXJIVE1MID0gc2VsZWN0aW9uVGV4dDtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGRhdGEpIHtcclxuICAgICAgICBzaW1pbGFyaXR5LnN0eWxlLmNvbG9yID0gKDAsIHV0aWxzXzEuZGVjaW1hbFRvQ29sb3IpKHBhcnNlRmxvYXQoZGF0YS5zaW1pbGFyaXR5X3Njb3JlKSk7XHJcbiAgICAgICAgcGFyYS5pbm5lckhUTUwgPSBkYXRhLmV4dHJhY3RlZF9wYXJhZ3JhcGg7XHJcbiAgICAgICAgc2ltaWxhcml0eS5pbm5lckhUTUwgPVxyXG4gICAgICAgICAgICBcIjxwIHN0eWxlPSdkaXNwbGF5OmlubGluZTsgY29sb3I6IHJnYigyMTAsIDIxNCwgMjE4KTsgZm9udC13ZWlnaHQ6IG5vcm1hbCcgPkNvbmZpZGVuY2U6IDwvcD5cIiArIGRhdGEuc2ltaWxhcml0eV9zY29yZTtcclxuICAgICAgICB1cmwuaW5uZXJIVE1MID0gZGF0YS5VUkw7XHJcbiAgICAgICAgdXJsLmhyZWYgPSBkYXRhLlVSTDtcclxuICAgICAgICB1cmwudGFyZ2V0ID0gXCJfYmxhbmtcIjtcclxuICAgICAgICB0aXRsZS5pbm5lckhUTUwgPSBkYXRhLnRpdGxlO1xyXG4gICAgICAgIHRpdGxlLmhyZWYgPSBkYXRhLlVSTDtcclxuICAgICAgICB0aXRsZS50YXJnZXQgPSBcIl9ibGFua1wiO1xyXG4gICAgfVxyXG59O1xyXG5leHBvcnRzLnVwZGF0ZVBvcG92ZXIgPSB1cGRhdGVQb3BvdmVyO1xyXG5mdW5jdGlvbiBjb2xvckxpbmtzKGhleCkge1xyXG4gICAgdmFyIGxpbmtzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJhXCIpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaW5rcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChsaW5rc1tpXS5ocmVmKSB7XHJcbiAgICAgICAgICAgIGxpbmtzW2ldLnN0eWxlLmNvbG9yID0gaGV4O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuZGVjaW1hbFRvQ29sb3IgPSBleHBvcnRzLnNlbmRNZXNzYWdlSW5DdXJyZW50VGFiID0gZXhwb3J0cy5nZXRDdXJyZW50VGFiID0gdm9pZCAwO1xyXG5mdW5jdGlvbiBnZXRDdXJyZW50VGFiKCkge1xyXG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICBjb25zdCBxdWVyeU9wdGlvbnMgPSB7IGFjdGl2ZTogdHJ1ZSwgbGFzdEZvY3VzZWRXaW5kb3c6IHRydWUgfTtcclxuICAgICAgICBjb25zdCBbdGFiXSA9IHlpZWxkIGNocm9tZS50YWJzLnF1ZXJ5KHF1ZXJ5T3B0aW9ucyk7XHJcbiAgICAgICAgcmV0dXJuIHRhYjtcclxuICAgIH0pO1xyXG59XHJcbmV4cG9ydHMuZ2V0Q3VycmVudFRhYiA9IGdldEN1cnJlbnRUYWI7XHJcbmZ1bmN0aW9uIHNlbmRNZXNzYWdlSW5DdXJyZW50VGFiKG1lc3NhZ2UsIGNhbGxiYWNrKSB7XHJcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgIGNvbnN0IHRhYiA9IHlpZWxkIGdldEN1cnJlbnRUYWIoKTtcclxuICAgICAgICBpZiAoIXRhYi5pZClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHJldHVybiBzZW5kTWVzc2FnZUluVGFiKHRhYi5pZCwgbWVzc2FnZSwgY2FsbGJhY2spO1xyXG4gICAgfSk7XHJcbn1cclxuZXhwb3J0cy5zZW5kTWVzc2FnZUluQ3VycmVudFRhYiA9IHNlbmRNZXNzYWdlSW5DdXJyZW50VGFiO1xyXG5mdW5jdGlvbiBzZW5kTWVzc2FnZUluVGFiKHRhYklkLCBtZXNzYWdlLCBjYWxsYmFjaykge1xyXG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICBjaHJvbWUudGFicy5zZW5kTWVzc2FnZSh0YWJJZCwgbWVzc2FnZSwgY2FsbGJhY2spO1xyXG4gICAgfSk7XHJcbn1cclxuZnVuY3Rpb24gZGVjaW1hbFRvQ29sb3IoZGVjaW1hbCkge1xyXG4gICAgY29uc3QgcmVkID0gTWF0aC5yb3VuZCgyNTUgKiAoMSAtIGRlY2ltYWwpKTtcclxuICAgIGNvbnN0IGdyZWVuID0gTWF0aC5yb3VuZCgyNTUgKiBkZWNpbWFsKTtcclxuICAgIHJldHVybiBgcmdiKCR7cmVkfSwgJHtncmVlbn0sIDApYDtcclxufVxyXG5leHBvcnRzLmRlY2ltYWxUb0NvbG9yID0gZGVjaW1hbFRvQ29sb3I7XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIkM6XFxcXFVzZXJzXFxcXDFrZXZpXFxcXERlc2t0b3BcXFxccHJvamVjdHNcXFxcU3RhcnR1cFxcXFxkb2MtYXNzaXN0XFxcXGV4dGVuc2lvblxcXFxkaXN0XFxcXGpzXFxcXFwiOyIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IGNoZWNrXzEgPSByZXF1aXJlKFwiLi9jb250ZW50U2NyaXB0L2NoZWNrXCIpO1xyXG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoZnVuY3Rpb24gKHJlcXVlc3QsIHNlbmRlciwgc2VuZFJlc3BvbnNlKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhcIkhFUkVcIik7XHJcbiAgICBzd2l0Y2ggKHJlcXVlc3QuYWN0aW9uKSB7XHJcbiAgICAgICAgY2FzZSBcImNoZWNrXCI6XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiaW4gY2hlY2tcIik7XHJcbiAgICAgICAgICAgICgwLCBjaGVja18xLmNoZWNrKSgpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgIH1cclxuICAgIHNlbmRSZXNwb25zZSh7IHJlc3VsdDogXCJzdWNjZXNzXCIgfSk7XHJcbn0pO1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=