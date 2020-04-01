"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const rule_1 = __importDefault(require("./rule"));
module.exports = {
    rules: {
        'unnecessary-filename-in-import': rule_1.default,
    },
};
