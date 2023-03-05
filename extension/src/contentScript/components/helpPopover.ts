
const helpTemp = require("../../images/help.png") 
const helpImg = chrome.runtime.getURL("../js/images/help.png");

export const helpPopover = (subHeaderEl: any, popover: any) => {
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
    helpEl.addEventListener("click", function() {
        if (hovering || helpPopupEl.style.visibility == "hidden") {
        helpPopupEl.style.visibility = "visible";
        clickedForPopup = true;
        } else if (helpPopupEl.style.visibility == "visible") {
        helpPopupEl.style.visibility = "hidden";
        clickedForPopup = false;
        }
    });

    popover.addEventListener("click", function() {
        if (helpPopupEl.style.visibility == "visible" && !hovering) {
        helpPopupEl.style.visibility = "hidden";
        clickedForPopup = false;
        }
    });

    helpEl.addEventListener("mouseover", function() {
        document.body.style.cursor = "pointer";
        if (!clickedForPopup) {
        helpPopupEl.style.visibility = "visible";
        hovering = true;
        }
    });

    helpEl.addEventListener("mouseout", function() {
        document.body.style.cursor = "default";
        if (!clickedForPopup) {
        helpPopupEl.style.visibility = "hidden";
        }
        hovering = false;
    });
    subHeaderEl.appendChild(helpEl)
    popover.appendChild(helpPopupEl)
}