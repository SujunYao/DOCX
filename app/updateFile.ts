import { Response, Request } from "express";
import fs from 'fs';
import path from 'path';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import htmlDocx from 'html-docx-js';

interface REQ_DATA {
    blob: string;
    filename: string;
}

const scanHTMLToDoc = (blob: string): Document => {
    const result = new Document();
    console.log(result);
        // var a = document.createElement("div");
    // a.innerHTML = blob;
    // console.log(a.childNodes);
    // blob.split('')
    // console.log(blob);
    // const header = "<!DOCTYPE html><html><head><meta charset='utf-8'></head><body>";
    // const footer = "</body></html>";
    // htmlDocx.asBlob(header + blob + footer);
    // // console.log(Buffer.from(blob, 'utf8'));
    // // console.log(new ArrayBuffer(blob));
    // console.log(htmlDocx.asBlob(header + blob + footer));
    return result;
}

export default {
    update: (req: Request, res: Response) => {
        let str = "";
        const self = this;
        req.on("data", function (chunk: string) {
            str += chunk
        });
        req.on("end", function () {
            const reqData: REQ_DATA = JSON.parse(str);
            // console.log("----------------------->" + str);
            console.log(path.join(__dirname, `../dist/StoreWordFiles/${reqData.filename}`));
            // const file = new Blob([reqData.blob], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
            // Packer.toBuffer(reqData.blob).then((buffer) => {
            //     // saveAs from FileSaver will download the file
            //     saveAs(blob, "example.docx");
            // });
            // const resA = scanHTMLToDoc(reqData.blob);
            console.log(reqData.blob);
            const doc = new Document();
            doc.addSection({
                properties: {},
                children: [
                    new Paragraph({
                        children: [
                            new TextRun("NEW content has overwrite the original content "),
                            new TextRun({
                                text: "Foo Bar",
                                bold: true,
                            }),
                            new TextRun({
                                text: "\tVoxelcloud Retina GO GO",
                                bold: true,
                            }),
                        ],
                    }),
                ],
            });
            Packer.toBuffer(doc).then((buffer) => {
                fs.writeFileSync(path.join(__dirname, `../dist/StoreWordFiles/${reqData.filename}`), buffer);
                return res.json({
                    state: 200
                });
            });
            // fs.writeFileSync(path.join(__dirname, `../dist/StoreWordFiles/${reqData.filename}`), reqData.blob);
            // fs.writeFileSync(path.join(__dirname, `../dist/StoreWordFiles/${reqData.filename}`), reqData.blob);
            // fs.readFile(path.join(__dirname, `StoreWordFiles/${reqData.filename}`), (a)=>{console.log('----------------'+a);});

        });
    }

};