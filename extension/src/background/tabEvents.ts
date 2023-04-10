import { getCurrentTab, sendMessageInCurrentTab } from "../utils";
// const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");
// const pdfjs = require('pdfjs-dist');
// const pdfjsWorker = require('pdfjs-dist/build/pdf.worker.entry');
// import pdfjs from 'pdfjs-dist';
// import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";

// import { Document, Page, pdfjs } from "react-pdf";
import * as pdfjs from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";


export async function initializeTabEventListeners() {
  chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
    if (changeInfo.status == "complete") {
      const tab = await getCurrentTab();   
      console.log("tab", tab.url) 
      
      let body = null;
      if (tab.url?.endsWith(".pdf")) {
        console.log("DETECTED PDF")
        var url = tab.url

        // defining the worker to access the pdf
        pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

        // // having the worker access the pdf from url
        console.log("space")
        pdfjs.getDocument({
          url: url,
          cMapPacked: true,
          cMapUrl: "./cmaps/",
          // httpHeaders: {
          //   "Access-Control-Allow-Origin": "*",
          //   "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
          //   "Access-Control-Allow-Headers": "Content-Type",
          // },
        }).promise.then((pdfDocument: any) => { console.log("success?") })
        console.log("end space")



        // var url = decodeURIComponent(location.href.split('?url=')[1]);
        console.log("url", url)

        // var params = {
        //   cMapPacked: true,
        //   cMapUrl: "pdfjs/cmaps/",
        //   disableAutoFetch: false,
        //   disableCreateObjectURL: false,
        //   disableFontFace: false,
        //   disableRange: false,
        //   disableStream: false,
        //   docBaseUrl: url,
        //   isEvalSupported: true,
        //   maxImageSize: -1,
        //   pdfBug: false,
        //   postMessageTransfers: true,
        //   url: url,
        //   verbosity: 1
        // };

        // pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs/pdf.worker.js';

        // var loadingTask = pdfjsLib.getDocument(url);
        // loadingTask.promise.then((pdfDocument: any) => {console.log("THIS IS THE RESULT: ", pdfDocument)})

        // console.log("space")
        // pdfjs.getDocument(url).promise.then((pdfDocument: any) => { console.log(pdfDocument) })
        // console.log("end space")

        // const options = {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({
        //     url: tab.url,
        //   }),
        // };
        // // const response = await fetch("https://opendoc-conirvxfeq-uc.a.run.app/pdf2text", options);
        // const response = await fetch("http://localhost:8080/pdf2text", options);
        // body = await response.json();
      }

      // console.log("complete", body);
      // await sendMessageInCurrentTab({
      //   action: "tab-updated",
      //   arguments: {
      //     message: body,
      //   },
      // });
    }
  });
}
