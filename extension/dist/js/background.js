/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/background/contextMenu.ts":
/*!***************************************!*\
  !*** ./src/background/contextMenu.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
exports.contextMenu = void 0;
const utils_1 = __webpack_require__(/*! ../utils */ "./src/utils.ts");
const contextMenu = () => {
    chrome.runtime.onInstalled.addListener(() => __awaiter(void 0, void 0, void 0, function* () {
        chrome.contextMenus.removeAll();
        chrome.contextMenus.create({
            title: "GPTCheck",
            id: "check",
            contexts: ["selection"],
        });
    }));
    chrome.contextMenus.onClicked.addListener(({ selectionText, pageUrl }) => __awaiter(void 0, void 0, void 0, function* () {
        if (!selectionText) {
            // console.log("no text selected");
            return;
        }
        // console.log("clicked");
        (0, utils_1.sendMessageInCurrentTab)({
            action: "check",
            command: "append",
        }, function (response) {
            // console.log("response", response);
        });
        setTimeout(() => { }, 1000);
    }));
};
exports.contextMenu = contextMenu;


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
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!***************************!*\
  !*** ./src/background.ts ***!
  \***************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const contextMenu_1 = __webpack_require__(/*! ./background/contextMenu */ "./src/background/contextMenu.ts");
function execute() {
    // console.log("executing");
    (0, contextMenu_1.contextMenu)();
    setTimeout(execute, 1000 * 20);
}
execute();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQWE7QUFDYjtBQUNBLDRCQUE0QiwrREFBK0QsaUJBQWlCO0FBQzVHO0FBQ0Esb0NBQW9DLE1BQU0sK0JBQStCLFlBQVk7QUFDckYsbUNBQW1DLE1BQU0sbUNBQW1DLFlBQVk7QUFDeEYsZ0NBQWdDO0FBQ2hDO0FBQ0EsS0FBSztBQUNMO0FBQ0EsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELG1CQUFtQjtBQUNuQixnQkFBZ0IsbUJBQU8sQ0FBQyxnQ0FBVTtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0wsaURBQWlELHdCQUF3QjtBQUN6RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsU0FBUztBQUNULDRCQUE0QjtBQUM1QixLQUFLO0FBQ0w7QUFDQSxtQkFBbUI7Ozs7Ozs7Ozs7O0FDckNOO0FBQ2I7QUFDQSw0QkFBNEIsK0RBQStELGlCQUFpQjtBQUM1RztBQUNBLG9DQUFvQyxNQUFNLCtCQUErQixZQUFZO0FBQ3JGLG1DQUFtQyxNQUFNLG1DQUFtQyxZQUFZO0FBQ3hGLGdDQUFnQztBQUNoQztBQUNBLEtBQUs7QUFDTDtBQUNBLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxzQkFBc0IsR0FBRywrQkFBK0IsR0FBRyxxQkFBcUI7QUFDaEY7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsSUFBSSxJQUFJLE1BQU07QUFDaEM7QUFDQSxzQkFBc0I7Ozs7Ozs7VUN2Q3RCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7Ozs7Ozs7QUN0QmE7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0Qsc0JBQXNCLG1CQUFPLENBQUMsaUVBQTBCO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyLy4vc3JjL2JhY2tncm91bmQvY29udGV4dE1lbnUudHMiLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvLi9zcmMvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvLi9zcmMvYmFja2dyb3VuZC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuY29udGV4dE1lbnUgPSB2b2lkIDA7XHJcbmNvbnN0IHV0aWxzXzEgPSByZXF1aXJlKFwiLi4vdXRpbHNcIik7XHJcbmNvbnN0IGNvbnRleHRNZW51ID0gKCkgPT4ge1xyXG4gICAgY2hyb21lLnJ1bnRpbWUub25JbnN0YWxsZWQuYWRkTGlzdGVuZXIoKCkgPT4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgY2hyb21lLmNvbnRleHRNZW51cy5yZW1vdmVBbGwoKTtcclxuICAgICAgICBjaHJvbWUuY29udGV4dE1lbnVzLmNyZWF0ZSh7XHJcbiAgICAgICAgICAgIHRpdGxlOiBcIkdQVENoZWNrXCIsXHJcbiAgICAgICAgICAgIGlkOiBcImNoZWNrXCIsXHJcbiAgICAgICAgICAgIGNvbnRleHRzOiBbXCJzZWxlY3Rpb25cIl0sXHJcbiAgICAgICAgfSk7XHJcbiAgICB9KSk7XHJcbiAgICBjaHJvbWUuY29udGV4dE1lbnVzLm9uQ2xpY2tlZC5hZGRMaXN0ZW5lcigoeyBzZWxlY3Rpb25UZXh0LCBwYWdlVXJsIH0pID0+IF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgIGlmICghc2VsZWN0aW9uVGV4dCkge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIm5vIHRleHQgc2VsZWN0ZWRcIik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJjbGlja2VkXCIpO1xyXG4gICAgICAgICgwLCB1dGlsc18xLnNlbmRNZXNzYWdlSW5DdXJyZW50VGFiKSh7XHJcbiAgICAgICAgICAgIGFjdGlvbjogXCJjaGVja1wiLFxyXG4gICAgICAgICAgICBjb21tYW5kOiBcImFwcGVuZFwiLFxyXG4gICAgICAgIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInJlc3BvbnNlXCIsIHJlc3BvbnNlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsgfSwgMTAwMCk7XHJcbiAgICB9KSk7XHJcbn07XHJcbmV4cG9ydHMuY29udGV4dE1lbnUgPSBjb250ZXh0TWVudTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmRlY2ltYWxUb0NvbG9yID0gZXhwb3J0cy5zZW5kTWVzc2FnZUluQ3VycmVudFRhYiA9IGV4cG9ydHMuZ2V0Q3VycmVudFRhYiA9IHZvaWQgMDtcclxuZnVuY3Rpb24gZ2V0Q3VycmVudFRhYigpIHtcclxuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgY29uc3QgcXVlcnlPcHRpb25zID0geyBhY3RpdmU6IHRydWUsIGxhc3RGb2N1c2VkV2luZG93OiB0cnVlIH07XHJcbiAgICAgICAgY29uc3QgW3RhYl0gPSB5aWVsZCBjaHJvbWUudGFicy5xdWVyeShxdWVyeU9wdGlvbnMpO1xyXG4gICAgICAgIHJldHVybiB0YWI7XHJcbiAgICB9KTtcclxufVxyXG5leHBvcnRzLmdldEN1cnJlbnRUYWIgPSBnZXRDdXJyZW50VGFiO1xyXG5mdW5jdGlvbiBzZW5kTWVzc2FnZUluQ3VycmVudFRhYihtZXNzYWdlLCBjYWxsYmFjaykge1xyXG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICBjb25zdCB0YWIgPSB5aWVsZCBnZXRDdXJyZW50VGFiKCk7XHJcbiAgICAgICAgaWYgKCF0YWIuaWQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICByZXR1cm4gc2VuZE1lc3NhZ2VJblRhYih0YWIuaWQsIG1lc3NhZ2UsIGNhbGxiYWNrKTtcclxuICAgIH0pO1xyXG59XHJcbmV4cG9ydHMuc2VuZE1lc3NhZ2VJbkN1cnJlbnRUYWIgPSBzZW5kTWVzc2FnZUluQ3VycmVudFRhYjtcclxuZnVuY3Rpb24gc2VuZE1lc3NhZ2VJblRhYih0YWJJZCwgbWVzc2FnZSwgY2FsbGJhY2spIHtcclxuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGFiSWQsIG1lc3NhZ2UsIGNhbGxiYWNrKTtcclxuICAgIH0pO1xyXG59XHJcbmZ1bmN0aW9uIGRlY2ltYWxUb0NvbG9yKGRlY2ltYWwpIHtcclxuICAgIGNvbnN0IHJlZCA9IE1hdGgucm91bmQoMjU1ICogKDEgLSBkZWNpbWFsKSk7XHJcbiAgICBjb25zdCBncmVlbiA9IE1hdGgucm91bmQoMjU1ICogZGVjaW1hbCk7XHJcbiAgICByZXR1cm4gYHJnYigke3JlZH0sICR7Z3JlZW59LCAwKWA7XHJcbn1cclxuZXhwb3J0cy5kZWNpbWFsVG9Db2xvciA9IGRlY2ltYWxUb0NvbG9yO1xyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgY29udGV4dE1lbnVfMSA9IHJlcXVpcmUoXCIuL2JhY2tncm91bmQvY29udGV4dE1lbnVcIik7XHJcbmZ1bmN0aW9uIGV4ZWN1dGUoKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhcImV4ZWN1dGluZ1wiKTtcclxuICAgICgwLCBjb250ZXh0TWVudV8xLmNvbnRleHRNZW51KSgpO1xyXG4gICAgc2V0VGltZW91dChleGVjdXRlLCAxMDAwICogMjApO1xyXG59XHJcbmV4ZWN1dGUoKTtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9