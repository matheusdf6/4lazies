import FileModule from "./Modules/FileModule";
import { CoreModule, TreeConfig } from "./Modules/CoreModule";
import { getMessage }  from './message';
import * as _ from "lodash";
import { ActionResult, Tuple } from "./message";

const generateTreeFromFile = (pathInput : string, pathOutput : string , config : TreeConfig) => {
    const gen = _.flow([ FileModule.read, FileModule.parse]);
}

let gen = 

const { data } = getMessage(gen("./example.txt"));
let tree = CoreModule.generateTree(data, { useClassPriotiry: true });
const { data: scss } = getMessage(tree);

FileModule.write(tree, "./result.less");
