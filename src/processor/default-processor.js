
const Snapshot = require('../snapshot-core');

"use strict";

var pr = new function(){
    this.name = "default-processor";
    this.init = function(config){

    };

    this.matchNode = function(node, note, ctx){
        return false;
    }

    this.matchManifest = function(node, note, ctx){
        if(/^!*TEXT~+INPUTS(\:TEXT)?(~+TEXT)*$/g.test(note.manifest) ){
            return true;
        }
        if(/^!*(~*INPUTS\:(CHECKBOX|RADIO)~+TEXT)+$/g.test(note.manifest) ){
            return true;
        }
        return false;
    }

    this.process= function(node, note, ctx){
        note.assign = this.name;
        return note;
    };
}

Snapshot.register(pr);

