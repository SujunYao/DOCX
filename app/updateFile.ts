import { Response, Request } from "express";
import fs from 'fs';
import path from 'path';

interface REQ_DATA {
    blob: string;
    filename: string;
}

export default {
    update: (req: Request, res: Response) => {
        let str = "";
        req.on("data", function (chunk: string) {
            str += chunk
        });
        req.on("end", function () {
            const reqData: REQ_DATA = JSON.parse(str);
            console.log("----------------------->" + str);
            console.log(path.join(__dirname, `./StoreWordFiles/${reqData.filename}`));
            //fs.writeFileSync(path.join(__dirname, `./StoreWordFiles/${reqData.filename}`), reqData.blob);
            return res.json({
                state: 200
            });
        });
    }
};