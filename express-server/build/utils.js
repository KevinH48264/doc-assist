"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPdfText = void 0;
const pdfjs_dist_1 = require("pdfjs-dist");
// import {
//   getDocument,
//   GlobalWorkerOptions,
//   version,
// } from "pdfjs-dist/legacy/build/pdf.js";
// const PDFJS = require("pdfjs-dist/legacy/build/pdf.js ");
function getPdfText(pdfUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        // GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.js`;
        pdfjs_dist_1.GlobalWorkerOptions.workerSrc = "./pdf.worker.js";
        const pdf = (0, pdfjs_dist_1.getDocument)({
            url: pdfUrl,
            // httpHeaders: {
            //   "Access-Control-Allow-Origin": "*",
            //   "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
            //   "Access-Control-Allow-Headers": "Content-Type",
            // },
        });
        console.log(pdf);
    });
}
exports.getPdfText = getPdfText;
