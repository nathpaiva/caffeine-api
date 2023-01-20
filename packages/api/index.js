"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("./config/express"));
const db_1 = __importDefault(require("./models/db"));
db_1.default.connection();
const port = process.env.PORT || 3000; // used to create, sign, and verify tokens
(0, express_1.default)().listen(port, () => {
    console.log('====================================');
    console.log('Magic happens at http://localhost:' + port);
    console.log('====================================');
});
