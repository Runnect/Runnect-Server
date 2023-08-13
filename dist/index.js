"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const router_1 = __importDefault(require("./router"));
const config_1 = __importDefault(require("./config"));
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use("/api", router_1.default);
exports.app.get("/", (req, res, next) => {
    res.send("~~~~~서버서버서버~~~~~");
});
exports.app.listen(config_1.default.port, () => {
    console.log(`*****************************************
     ${config_1.default.port}번 포트에서 듣고 있는 중~~*
    ********************************************`);
});
exports.default = exports.app;
//# sourceMappingURL=index.js.map