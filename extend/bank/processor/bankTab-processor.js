
const Snapshot = require('../snapshot-core');

"use strict";

var pr = new function(){
    this.name = "bankTab-processor";
    this.init = function(config){

    };

    this.matchNode = function(node, note, ctx){
        if(node.className == "nav nav-tabs"||node.className == "panel-heading"){
            return true;
        }
        return false;
    };

    this.matchManifest = function(node, note, ctx){
        return false;
    };

    this.process= function(node, note, ctx){
        if(node.className == "nav nav-tabs"){
            note.nodeName = "#text";
            note.attrs.value = $(node).find("li.active a").text();
            note.nodeType = "TEXT";
            note.manifest = "TEXT";
            note.hierarchy=1;
        }
        if(node.className == "panel-heading"){
            note.nodeName = "#text";
            note.attrs.value =$.trim($(node).find(".panel-title").text());
            note.nodeType = "TEXT";
            note.manifest = "PANEL";
            note.hierarchy=1;
        }
        note.assign = this.name;
        return note;
    };
}

Snapshot.register(pr);

