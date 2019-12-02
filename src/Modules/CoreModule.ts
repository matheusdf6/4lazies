import * as _ from 'lodash';
import { ActionResult, Tuple } from '../message';

interface TreeConfig {
    alwaysShowTagName?: boolean,
    useIdPriority?: boolean,
    useClassPriotiry?: boolean,
    multipleLines?: boolean
}

abstract class CoreModule {
    private static defaultConfig : TreeConfig = {
        alwaysShowTagName: true,
        useIdPriority: false,
        useClassPriotiry: false,
        multipleLines: true
    }
    public static generateTree = (element: Element, config: TreeConfig = CoreModule.defaultConfig) : Tuple => {
        
        if(config.useClassPriotiry == true && config.useIdPriority) {
            return [ActionResult.ERROR, new Error("Inconsistent config: it is not possible to use two priority rules")];
        }
        if(config.useClassPriotiry) return [ActionResult.OK, CoreModule._generateClassPriorityTree(element, config, 0)];
        if(config.useIdPriority) return [ActionResult.OK, CoreModule._generateIdPriorityTree(element, config, 0)];
        return [ActionResult.OK, CoreModule._generateTree(element, config, 0)];
    }

    private static _generateClassPriorityTree= (element  : Element     , 
                                                config   : TreeConfig  ,
                                                tabLevel : number       )  => {

        let final : string = '';
        let tabs : string = '';
        for(let i = 0; i < tabLevel; i++) {
            tabs += "\t";
        }
        final += tabs;

        if(element.classList.length > 0) {
            final += (config.alwaysShowTagName) ? element.localName : '';
            _.forEach(element.classList, (e) => {
                final += "." + e  
            });
        } else if(element.id.length > 0){
            final += (config.alwaysShowTagName) ? element.localName : '';
            final += '#' + element.id;
        } else {
            final += element.localName;
        }

        final += "{\n" + (config.multipleLines ? "\n" : "");

        if(element.children.length > 0) {
            _.forEach(element.children, (e) => {
                if(CoreModule._checkExcludedTags(e)) { return; }
                final += CoreModule._generateClassPriorityTree(e, config, tabLevel + 1);
            })
        }

        final += tabs;
        final += "}\n" + (config.multipleLines ? "\n" : "");
        return final;
    }

    private static _generateIdPriorityTree= (element  : Element     , 
                                                config   : TreeConfig  ,
                                                tabLevel : number       )  => {

        let final : string = '';
        let tabs : string = '';
        for(let i = 0; i < tabLevel; i++) {
            tabs += "\t";
        }
        final += tabs;

        if(element.id.length > 0){
            final += (config.alwaysShowTagName) ? element.localName : '';
            final += '#' + element.id;
        } else if(element.classList.length > 0) {
            final += (config.alwaysShowTagName) ? element.localName : '';
            _.forEach(element.classList, (e) => {
                final += "." + e  
            });
        } else {
            final += element.localName;
        }

        final += "{\n" + (config.multipleLines ? "\n" : "");

        if(element.children.length > 0) {
            _.forEach(element.children, (e) => {
                if(CoreModule._checkExcludedTags(e)) { return; }
                final += CoreModule._generateClassPriorityTree(e, config, tabLevel + 1);
            })
        }

        final += tabs;
        final += "}\n" + (config.multipleLines ? "\n" : "");
        return final
    }

    private static _generateTree = (element  : Element     , 
                                    config   : TreeConfig  ,
                                    tabLevel : number       )  => {
        let final : string = '';
        let tabs : string = '';
        for(let i = 0; i < tabLevel; i++) {
            tabs += "\t";
        }
        final += tabs;
        final += element.localName;
        final += (_.isEmpty(element.id)) ? '' : '#' + element.id;
        _.forEach(element.classList, (e) => { final += "." + e  });
        final += "{\n" + (config.multipleLines ? "\n" : "");

        if(element.children.length > 0) {
            _.forEach(element.children, (e) => {
                if(CoreModule._checkExcludedTags(e)) return;
                final += CoreModule._generateTree(e, config, tabLevel + 1);
            })
        }

        final += tabs;
        final += "}\n\n";
        return final;
    }

    private static _checkExcludedTags = (e : Element) => {
        if( e.localName == 'script' ||
            e.localName == 'meta'   ||
            e.localName == 'svg'    ||
            e.localName == 'head'   ||
            e.localName == 'link'     ) {
            return true;
        }
        return false;
    }
}

export { CoreModule, TreeConfig };