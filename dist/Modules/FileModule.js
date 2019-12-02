"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = __importStar(require("lodash"));
var fs = __importStar(require("fs"));
var jsdom = __importStar(require("jsdom"));
var message_1 = require("../message");
var FileModule = /** @class */ (function () {
    function FileModule() {
    }
    FileModule.read = function (path) {
        var tuple = [message_1.ActionResult.NOTSET, null];
        try {
            var data = fs.readFileSync(path);
            return [message_1.ActionResult.OK, data];
        }
        catch (error) {
            return [message_1.ActionResult.ERROR, error];
        }
    };
    FileModule.parse = function (value) {
        var _a = message_1.getMessage(value), status = _a.status, data = _a.data;
        switch (status) {
            case message_1.ActionResult.OK: {
                var html = new jsdom.JSDOM(data);
                return (html.window.document.querySelector("html")) ?
                    [message_1.ActionResult.OK, html.window.document.querySelector("html")] :
                    [message_1.ActionResult.ERROR, new Error("The document is not a HTML file")];
            }
            case message_1.ActionResult.ERROR: {
                return data;
            }
            default: {
                return [message_1.ActionResult.ERROR, new Error("An unespected error occured")];
            }
        }
    };
    FileModule.generateTree = function (element, tabLevel) {
        var final = '';
        var tabs = '';
        for (var i = 0; i < tabLevel; i++) {
            tabs += "\t";
        }
        final += tabs;
        final += element.localName;
        final += (_.isEmpty(element.id)) ? '' : '#' + element.id;
        _.forEach(element.classList, function (e) {
            final += "." + e;
        });
        final += "{\n\n";
        if (element.children.length > 0) {
            _.forEach(element.children, function (e) {
                if (e.localName == 'script' ||
                    e.localName == 'meta' ||
                    e.localName == 'svg' ||
                    e.localName == 'head' ||
                    e.localName == 'link') {
                    return;
                }
                final += FileModule.generateTree(e, tabLevel + 1);
            });
        }
        final += tabs;
        final += "}\n\n";
        return final;
    };
    FileModule.write = function (value, path) {
        var _a = message_1.getMessage(value), status = _a.status, data = _a.data;
        switch (status) {
            case message_1.ActionResult.OK: {
                fs.writeFileSync(path, data);
                break;
            }
            case message_1.ActionResult.ERROR: {
                break;
            }
            default: {
                return [message_1.ActionResult.ERROR, new Error("An unespected error occured")];
            }
        }
        return value;
    };
    return FileModule;
}());
exports.default = FileModule;
