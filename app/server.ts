
import express, { Express, Request, Response } from "express";
import path from 'path';
import updateFile from './updateFile';

export class Server {

    private app: Express;

    constructor(app: Express) {
        this.app = app;
        app.use(express.static('../dist'));
        app.all('*', function (req, res, next) {
            // res.header("Access-Control-Allow-Origin", "http://192.168.0.168:4500");
            res.header("Access-Control-Allow-Origin", "http://10.193.17.26:3000");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.header("Access-Control-Allow-Methods", "PUT,POST,GET");
            next();
        });
        this.app.get("/api", (req: Request, res: Response): void => {
            res.send("You have reached the API!");
        });
        this.app.post("/api/updateFile", (req, res) => updateFile.update(req, res))
        // this.app.get("/StoreWordFiles", (req: Request, res: Response): void => {
        //     res.send("You have reached the API!");
        // });
    }

    public start(port: number): void {
        this.app.listen(port, () => console.log(`Server listening on port ${port}!`));
    }

}