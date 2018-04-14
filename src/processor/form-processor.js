

"use strict";

const Snapshot = require('../snapshot-core');

var pr = new function(){
    this.name = "form-processor";

    this.beforeProcess = function(node, note, ctx){

    }

    this.afterProcess = function(node, note, ctx){

    }

    this.matchNode = function(node, note, ctx){
        return false;
    }

    this.matchManifest = function(node, note, ctx){
        if(/^!*TEXT~+INPUTS(\:TEXT|\:EMAIL|\:PASSWORD)?(~+TEXT)*$/g.test(note.manifest) ){
            note.textValue = $(node).find("input").val();
            return true;
        }
        if(/^!*TEXT~+INPUTS\:SELECT(~+TEXT)*$/g.test(note.manifest) ){
            note.textValue = $(node).find("select").find("option:selected").text();
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

Snapshot.cache(pr);

