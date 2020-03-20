import React, { Component } from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './docx.css';

interface DOCX_STATE {
    curFileContent: any;
}
const mammoth: any = require('mammoth');


class DocxEditor extends Component {
    state: DOCX_STATE
    constructor(props: any) {
        super(props);
        this.state = {
            curFileContent: ""
        };
    }

    componentDidMount() {
        const item = document.querySelector('#testLink') as HTMLElement;
        const self = this;
        item.addEventListener('click', () => {
            const req = new XMLHttpRequest();
            req.responseType = "blob";
            req.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        console.log(this.response);
                        const file = new Blob([this.response], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
                        console.log(file);
                        const reader = new FileReader();
                        reader.readAsArrayBuffer(file);
                        reader.onloadend = function (event) {
                            mammoth.convertToHtml({ arrayBuffer: reader.result })
                                .then(function (result: any) {
                                    var html = result.value; // The generated HTML
                                    console.log(result.value);
                                    console.log(typeof result.value);
                                    self.setState({ 'curFileContent': result.value });
                                    var messages = result.messages; // Any messages, such as warnings during conversion
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
            console.log(self.state.curFileContent);
            const req = new XMLHttpRequest();
            req.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) {

                    } else {
                        console.error("Something Wrong!");
                    }
                }
            };
            req.open('POST', '/api/updateFile', true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.send(JSON.stringify({ blob: self.state.curFileContent, filename: 'wechat_login_cases.docx' }));
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
                            const data = editor.getData();
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