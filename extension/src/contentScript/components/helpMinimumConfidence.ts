
const helpTemp = require("../../images/help.png") 
const helpImg = chrome.runtime.getURL("../js/images/help.png");

export const helpMinimumConfidence = (body: any, popover: any) => {
    const helpEl = document.createElement("img");
    helpEl.style.width = "24px";
    helpEl.style.height = "24px";
    helpEl.style.display = "inline-block"
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
    
    console.log("append")
    body.appendChild(helpEl)
    console.log("append2")
    popover.appendChild(helpPopupEl)
}