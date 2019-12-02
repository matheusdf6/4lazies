"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ActionResult;
(function (ActionResult) {
    ActionResult["OK"] = "ok";
    ActionResult["ERROR"] = "error";
    ActionResult["NOTSET"] = "null";
})(ActionResult || (ActionResult = {}));
exports.ActionResult = ActionResult;
var getStatus = function (tuple) { return tuple[0]; };
var getData = function (tuple) { return tuple[1]; };
var getMessage = function (tuple) { return { status: getStatus(tuple), data: getData(tuple) }; };
exports.getMessage = getMessage;
