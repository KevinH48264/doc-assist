import { contextMenu } from "./background/contextMenu";
import { initializeTabEventListeners } from "./background/tabEvents";

function execute() {
  // console.log("executing");
  contextMenu();
  initializeTabEventListeners();

  setTimeout(execute, 1000 * 20);
}

execute();
