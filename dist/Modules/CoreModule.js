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
var message_1 = require("../message");
var CoreModule = /** @class */ (function () {
    function CoreModule() {
    }
    CoreModule.defaultConfig = {
        alwaysShowTagName: true,
        useIdPriority: false,
        useClassPriotiry: false,
        multipleLines: true
    };
    CoreModule.generateTree = function (element, config) {
        if (config === void 0) { config = CoreModule.defaultConfig; }
        if (config.useClassPriotiry == true && config.useIdPriority) {
            return [message_1.ActionResult.ERROR, new Error("Inconsistent config: it is not possible to use two priority rules")];
        }
        if (config.useClassPriotiry)
            return [message_1.ActionResult.OK, CoreModule._generateClassPriorityTree(element, config, 0)];
        if (config.useIdPriority)
            return [message_1.ActionResult.OK, CoreModule._generateIdPriorityTree(element, config, 0)];
        return [message_1.ActionResult.OK, CoreModule._generateTree(element, config, 0)];
    };
    CoreModule._generateClassPriorityTree = function (element, config, tabLevel) {
        var final = '';
        var tabs = '';
        for (var i = 0; i < tabLevel; i++) {
            tabs += "\t";
        }
        final += tabs;
        if (element.classList.length > 0) {
            final += (config.alwaysShowTagName) ? element.localName : '';
            _.forEach(element.classList, function (e) {
                final += "." + e;
            });
        }
        else if (element.id.length > 0) {
            final += (config.alwaysShowTagName) ? element.localName : '';
            final += '#' + element.id;
        }
        else {
            final += element.localName;
        }
        final += "{\n" + (config.multipleLines ? "\n" : "");
        if (element.children.length > 0) {
            _.forEach(element.children, function (e) {
                if (CoreModule._checkExcludedTags(e)) {
                    return;
                }
                final += CoreModule._generateClassPriorityTree(e, config, tabLevel + 1);
            });
        }
        final += tabs;
        final += "}\n" + (config.multipleLines ? "\n" : "");
        return final;
    };
    CoreModule._generateIdPriorityTree = function (element, config, tabLevel) {
        var final = '';
        var tabs = '';
        for (var i = 0; i < tabLevel; i++) {
            tabs += "\t";
        }
        final += tabs;
        if (element.id.length > 0) {
            final += (config.alwaysShowTagName) ? element.localName : '';
            final += '#' + element.id;
        }
        else if (element.classList.length > 0) {
            final += (config.alwaysShowTagName) ? element.localName : '';
            _.forEach(element.classList, function (e) {
                final += "." + e;
            });
        }
        else {
            final += element.localName;
        }
        final += "{\n" + (config.multipleLines ? "\n" : "");
        if (element.children.length > 0) {
            _.forEach(element.children, function (e) {
                if (CoreModule._checkExcludedTags(e)) {
                    return;
                }
                final += CoreModule._generateClassPriorityTree(e, config, tabLevel + 1);
            });
        }
        final += tabs;
        final += "}\n" + (config.multipleLines ? "\n" : "");
        return final;
    };
    CoreModule._generateTree = function (element, config, tabLevel) {
        var final = '';
        var tabs = '';
        for (var i = 0; i < tabLevel; i++) {
            tabs += "\t";
        }
        final += tabs;
        final += element.localName;
        final += (_.isEmpty(element.id)) ? '' : '#' + element.id;
        _.forEach(element.classList, function (e) { final += "." + e; });
        final += "{\n" + (config.multipleLines ? "\n" : "");
        if (element.children.length > 0) {
            _.forEach(element.children, function (e) {
                if (CoreModule._checkExcludedTags(e))
                    return;
                final += CoreModule._generateTree(e, config, tabLevel + 1);
            });
        }
        final += tabs;
        final += "}\n\n";
        return final;
    };
    CoreModule._checkExcludedTags = function (e) {
        if (e.localName == 'script' ||
            e.localName == 'meta' ||
            e.localName == 'svg' ||
            e.localName == 'head' ||
            e.localName == 'link') {
            return true;
        }
        return false;
    };
    return CoreModule;
}());
exports.CoreModule = CoreModule;
