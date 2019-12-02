"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var FileModule_1 = __importDefault(require("./Modules/FileModule"));
var CoreModule_1 = require("./Modules/CoreModule");
var message_1 = require("./message");
var _ = __importStar(require("lodash"));
var gen = _.flow([
    FileModule_1.default.read,
    FileModule_1.default.parse,
]);
var data = message_1.getMessage(gen("./example.txt")).data;
var tree = CoreModule_1.CoreModule.generateTree(data, { useClassPriotiry: true });
var scss = message_1.getMessage(tree).data;
FileModule_1.default.write(tree, "./result.less");
