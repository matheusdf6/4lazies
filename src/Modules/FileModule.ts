import * as _ from 'lodash';
import * as fs from 'fs';
import * as jsdom from "jsdom"
import { ActionResult, getMessage, Tuple }  from '../message';
import { isNull } from 'util';

abstract class FileModule {
    public static read = (path : string) => {
        let tuple : Tuple = [ActionResult.NOTSET , null];
        try {
            let data = fs.readFileSync(path);
            return [ActionResult.OK, data];
        }
        catch(error) {
            return [ActionResult.ERROR, error];
        }
    }
    public static parse = (value : Tuple) => {
        const { status, data } = getMessage(value);

        switch(status) {
            case ActionResult.OK: {
                const html = new jsdom.JSDOM(data);
                return  (html.window.document.querySelector("html")) ? 
                    [ActionResult.OK, html.window.document.querySelector("html")] :
                    [ActionResult.ERROR, new Error("The document is not a HTML file")];
            }
            case ActionResult.ERROR: {
                return data;
            }
            default: {
                return [ActionResult.ERROR, new Error("An unespected error occured")];
            }
        }
    }

    private static generateTree = (element: Element, tabLevel : number) => {
        let final : string = '';
        let tabs : string = '';
        for(let i = 0; i < tabLevel; i++) {
            tabs += "\t";
        }
        final += tabs;
        final += element.localName;
        final += (_.isEmpty(element.id)) ? '' : '#' + element.id;
        _.forEach(element.classList, (e) => {
            final += "." + e  
        });
        final += "{\n\n";
        if(element.children.length > 0) {
            _.forEach(element.children, (e) => {
                if( e.localName == 'script' ||
                    e.localName == 'meta'   ||
                    e.localName == 'svg'    ||
                    e.localName == 'head'   ||
                    e.localName == 'link'     ) {
                        return;
                }
                final += FileModule.generateTree(e, tabLevel + 1);
            })
        }
        final += tabs;
        final += "}\n\n";
        return final
    }
    public static write = (value : Tuple, path : string) => {
        const { status, data } = getMessage(value);

        switch(status) {
            case ActionResult.OK: {
                fs.writeFileSync(path, data);
                break;
            }
            case ActionResult.ERROR: {
                break;
            }
            default: {
                return [ActionResult.ERROR, new Error("An unespected error occured")];
            }
        }
        return value;
    }
}


export default FileModule;
