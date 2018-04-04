/**
 * Created by wubo22544 on 2018/1/18.
 */


const Snapshot = require('../snapshot-core');

"use strict";

var pr = new function(){
    this.name = "corp-processor";
    this.init = function(config){

    };

    this.matchNode = function(node, note, ctx){
        if(node.nodeName == 'SELECT'){
            console.log("matchNode", node, note, ctx, node.innerHTML)
            note.attrs = {value:$(node).find("option:selected").html()};
            return true
        }
        return false;
    };

    this.matchManifest = function(node, note, ctx){
        // if(/^!*TEXT~+INPUTS(\:TEXT)?(~+TEXT)*$/g.test(note.manifest) ){
        //     return true;
        // }
        // if(/^!*(~*INPUTS\:(CHECKBOX|RADIO)~+TEXT)+$/g.test(note.manifest) ){
        //     return true;
        // }
        return false;
    }

    this.process= function(node, note, ctx){
        note.assign = this.name;
        // if选择框节点
        // console.log("process", node.nodeName, note)
        return note;
    };
}

Snapshot.register(pr);

