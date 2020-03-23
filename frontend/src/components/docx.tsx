import React, { Component } from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Document, Packer, Paragraph, TextRun, DoubleUnderline, Table, TableRow, TableCell } from 'docx';
import './docx.css';

interface DOCX_STATE {
    curFileContent: any;
}
const mammoth: any = require('mammoth');

const toBuffer: any = require('blob-to-buffer');

class DocxEditor extends Component {
    state: DOCX_STATE
    constructor(props: any) {
        super(props);
        this.state = {
            curFileContent: ""
        };
    }

    scanHTMLToDoc(htmlStr: string) {
        const doc = new Document();
        const supportTags = ['TABLE', 'TR', 'TD', 'STRONG', 'P', 'A', 'OL', 'UL', 'LI',]
        const a = document.createElement('div');
        a.innerHTML = htmlStr;
        const d = a.childNodes as NodeListOf<HTMLElement>;
        const childrens: Array<any> = [];
        d.forEach((domE: HTMLElement) => {
            const childrenNodes = [];
            if (supportTags.indexOf(domE.tagName) >= 0) {
                switch (domE.tagName) {
                    case 'TABLE':
                        const tableRows: TableRow[] = [];
                        domE.querySelectorAll('tr').forEach((tr: HTMLElement) => {
                            const tds: TableCell[] = [];
                            tr.querySelectorAll('td').forEach((td: HTMLElement) => {
                                const cts: TextRun[] = [];
                                const contents = td.childNodes as NodeListOf<HTMLElement>;
                                let _index = 0;
                                contents.forEach((EL: HTMLElement) => {
                                    if (EL.tagName === 'BR') {
                                        _index++;
                                    } else {
                                        cts[_index] = new TextRun({
                                            text: EL.innerText,
                                            bold: EL.innerHTML.includes('<strong>') ? true : undefined,
                                        });
                                    }
                                });
                                tds.push(new TableCell({
                                    children: [new Paragraph({ children: cts })]
                                }))
                            });
                            tableRows.push(new TableRow({
                                children: tds
                            }));
                        });
                        childrens.push(new Table({
                            rows: tableRows
                        }));
                        break;
                    case 'P':
                        const EL_P = new Paragraph({
                            children: [new TextRun({
                                text: domE.innerText,
                                bold: domE.innerHTML.includes('<strong>') ? true : undefined
                            })]
                        });
                        childrens.push(EL_P);
                        break;
                    // case 'A':
                    //     break;
                    // case 'OL':
                    //     const OL
                    //     break;
                    // case 'UL':
                    //     break;
                    // case 'LI':
                    //     break;

                }
                doc.addSection({
                    children: childrens
                })
                // case "TABLE":
            }
        });
        return doc;
        //console.log(a.childNodes);
    }

    componentDidMount() {
        const item = document.querySelector('#testLink') as HTMLElement;
        const self = this;

        item.addEventListener('click', () => {
            const req = new XMLHttpRequest();
            req.responseType = "blob";
            req.onreadystatechange = function () {
                if (this.readyState === 4) {
                    if (this.status === 200) {
                        console.log(this.response);
                        const file = new Blob([this.response], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
                        console.log('------------------->blob<-----------------');
                        console.log(file);
                        const reader = new FileReader();
                        reader.readAsArrayBuffer(file);
                        reader.onloadend = function (event) {
                            console.log(reader.result);
                            console.log(mammoth);
                            mammoth.convertToHtml({ arrayBuffer: reader.result })
                                .then(function (result: any) {
                                    // var html = result.value; // The generated HTML
                                    console.log(result.value);
                                    console.log(typeof result.value);
                                    self.setState({ 'curFileContent': result.value });
                                    // var messages = result.messages; // Any messages, such as warnings during conversion
                                })
                                .done();
                        }
                    } else {
                        console.error('Something Wrong!!!');
                    }
                }
            };
            req.open("GET", './StoreWordFiles/wechat_login_cases.docx', true);
            req.send();
        });

        const saveBtn = document.getElementById('saveBtn') as HTMLElement;
        saveBtn.addEventListener('click', () => {
            const result = this.scanHTMLToDoc(self.state.curFileContent);
            const t = new Document();
            t.addSection({
                properties: {},
                children: [
                    new Paragraph({
                        children: [
                            new TextRun("Hello World"),
                            new TextRun({
                                text: "Foo Bar",
                                bold: true,
                            }),
                            new TextRun({
                                text: "\tGithub is the best",
                                bold: true,
                            }),
                        ],
                    }),
                ],
            });
            Packer.toBuffer(t).then((buffer) => {
                const req = new XMLHttpRequest();
                req.onreadystatechange = function () {
                    if (this.readyState === 4) {
                        if (this.status === 200) {

                        } else {
                            console.error("Something Wrong!");
                        }
                    }
                };
                // const buffer =  

                // toBuffer(new Blob([self.state.curFileContent], { type: 'application/octet-binary' }), function (err, buffer) {
                //   if (err) throw err

                //   buffer[0] // => 1
                //   buffer.readUInt8(1) // => 2
                // })np
                req.open('POST', '/api/updateFile', true);
                req.setRequestHeader('Content-Type', 'application/json');
                req.send(JSON.stringify({ blob: self.state.curFileContent, filename: 'wechat_login_cases.docx' }));
            });
            // console.log(---);
            console.log(result);

        });
    }

    render() {
        const { curFileContent } = this.state;
        return (
            <div className="CKEditor-con">
                <ul className="CKEditor-list">
                    <li>
                        <span id="testLink">wechat_login_cases.docx</span>
                    </li>
                </ul>
                <span id="saveBtn" className='saveBtn'>Save</span>
                <div className="CKEditor-main-con">
                    <CKEditor
                        editor={ClassicEditor}
                        data={curFileContent}
                        onInit={(editor: any) => {
                            // You can store the "editor" and use when it is needed.
                            console.log('Editor is ready to use!', editor);
                        }}
                        onChange={(event: Event, editor: any) => {
                            // const data = editor.getData();
                            this.setState({
                                'curFileContent': editor.getData()
                            })
                            //console.log({ event, editor, data });
                        }}
                        onBlur={(event: Event, editor: any) => {
                            console.log('Blur.', editor);
                        }}
                        onFocus={(event: Event, editor: any) => {
                            console.log('Focus.', editor);
                        }}
                    />
                </div>
            </div>
        );
    }
}

export default DocxEditor;