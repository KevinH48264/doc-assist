import {
  getDocument,
  GlobalWorkerOptions,
  version,
  PDFWorker,
} from "pdfjs-dist";
// import {
//   getDocument,
//   GlobalWorkerOptions,
//   version,
// } from "pdfjs-dist/legacy/build/pdf.js";
// const PDFJS = require("pdfjs-dist/legacy/build/pdf.js ");
export async function getPdfText(pdfUrl: string) {
  // GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.js`;
  GlobalWorkerOptions.workerSrc = "./pdf.worker.js";
  // !! Try this again
  const pdf = getDocument({
    url: pdfUrl,
    // httpHeaders: {
    //   "Access-Control-Allow-Origin": "*",
    //   "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    //   "Access-Control-Allow-Headers": "Content-Type",
    // },
  });
  console.log(pdf);
}
