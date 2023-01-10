"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router_1 = __importDefault(require("./router"));
const config_1 = __importDefault(require("./config"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api", router_1.default);
app.get("/", (req, res, next) => {
    res.send("~~~~~서버서버서버~~~~~");
});
app.listen(config_1.default.port, () => {
    console.log(`*****************************************
     ${config_1.default.port}번 포트에서 듣고 있는 중~~*
    ********************************************`);
});
//# sourceMappingURL=index.js.map