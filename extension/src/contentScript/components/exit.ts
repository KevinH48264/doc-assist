export const exitComponent = (headerEl: any) => {
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
}

