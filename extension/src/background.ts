import { contextMenu } from "./background/contextMenu";

function execute() {
  // console.log("executing");
  contextMenu();

  setTimeout(execute, 1000 * 20);
}

execute();
