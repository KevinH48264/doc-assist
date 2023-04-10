import { contextMenu } from "./background/contextMenu";
import { initializeTabEventListeners } from "./background/tabEvents";

function execute() {
  // contextMenu();
  initializeTabEventListeners();
  setTimeout(execute, 1000 * 20);
}

execute();
