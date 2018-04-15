

"use strict";

const Snapshot = require('./../snapshot-core');
const nodeRule = require('./../core/node-rule.js');

var pr = new function(){
    this.name = "default-panel-processor";

    this.afterScan = function(note, node, ctx){
        return note.summary = nodeRule.PANEL;
    }

    this.process= function(note, node, ctx){
        note.assign = this.name;
        return note;
    };
}

Snapshot.cache(pr);

