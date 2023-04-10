import { getCurrentTab, sendMessageInCurrentTab } from "../utils";
// const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");
// const pdfjs = require('pdfjs-dist');
// const pdfjsWorker = require('pdfjs-dist/build/pdf.worker.entry');
// import pdfjs from 'pdfjs-dist';
// import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";

// import { Document, Page, pdfjs } from "react-pdf";
import * as pdfjs from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import * as http from "http"

export async function initializeTabEventListeners() {
  chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
    if (changeInfo.status == "complete") {
      const tab = await getCurrentTab();   
      console.log("tab", tab.url) 
      
      let body = null;
      if (tab.url?.endsWith(".pdf")) {
        console.log("DETECTED PDF")
        // defining the worker to access the pdf
        pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
        var url = tab.url

        // http call doesn't work because you can;t access browser in chrome extension
        console.log("starting http call")
        http.get((url), function(res: any) {
            var data: any = [];
        
            res.on('data', function(chunk: any) {
                data.push(chunk);
            }).on('end', function() {
                //at this point data is an array of Buffers
                //so Buffer.concat() can make us a new Buffer
                //of all of them together
                var buffer = Buffer.concat(data);
                console.log("end http buffer: ", buffer.toString('base64'));
            });
        });
        
        // The array buffer is undefined
        fetch(url)
        .then(response => {response.arrayBuffer(); console.log("url fetch response: ", response)})
        .then(arrayBuffer => {
          console.log("arrayBuffer: ", arrayBuffer)
          // Load the PDF file into pdf.js
          pdfjs.getDocument({ data: arrayBuffer }).promise.then((pdf : any) => {
            console.log("SUCCESS")
            // Load the first page of the PDF file
            // pdf.getPage(1).then((page : any) => {
            //   // Extract the text content of the page
            //   page.getTextContent().then((textContent : any) => {
            //     // Extract the text strings from the content
            //     const textStrings = textContent.items.map((item : any) => item.str);
            //     // Join the text strings into a single string
            //     const text = textStrings.join('');
            //     // Do something with the text (e.g. log it to the console)
            //     console.log("TEXT: ", text);
            //   });
            // });
          });
        });

        console.log("url", url)

        // hard coding the URL
        // url = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf'

        // // having the worker access the pdf from url
        console.log("space")
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
        // console.log("defining loading task")
        // var loadingTask = pdfjs.getDocument(params);
        // console.log("sending promise")
        // loadingTask.promise.then((pdfDocument: any) => {console.log("THIS IS THE RESULT: ", pdfDocument)})
        // console.log("starting pdf reading")
        // pdfjs.getDocument(url).promise.then((pdfDocument: any) => { 
        //   console.log("success?") 
        // }).catch((err: any) => { console.log("error", err) })
        // pdfjs.getDocument({
        //   url: url,
        //   cMapPacked: true,
        //   cMapUrl: "./cmaps/",
        //   // httpHeaders: {
        //   //   "Access-Control-Allow-Origin": "*",
        //   //   "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
        //   //   "Access-Control-Allow-Headers": "Content-Type",
        //   // },
        // }).promise.then((pdfDocument: any) => { console.log("success?") })
        console.log("end pdf reading")



        // var url = decodeURIComponent(location.href.split('?url=')[1]);


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
