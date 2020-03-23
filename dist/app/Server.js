"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const updateFile_1 = __importDefault(require("./updateFile"));
class Server {
    constructor(app) {
        this.app = app;
        app.use(express_1.default.static('dist'));
        app.all('*', function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "http://10.107.22.173:3000");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.header("Access-Control-Allow-Methods", "PUT,POST,GET");
            next();
        });
        this.app.get("/api", (req, res) => {
            res.send("You have reached the API!");
        });
        this.app.post("/api/updateFile", (req, res) => updateFile_1.default.update(req, res));
        // this.app.get("/StoreWordFiles", (req: Request, res: Response): void => {
        //     res.send("You have reached the API!");
        // });
    }
    start(port) {
        this.app.listen(port, () => console.log(`Server listening on port ${port}!`));
    }
}
exports.Server = Server;
