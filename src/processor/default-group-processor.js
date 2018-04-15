

"use strict";

const Snapshot = require('./../snapshot-core');
const nodeRule = require('./../core/node-rule.js');

var pr = new function(){
    this.name = "default-group-processor";

    this.afterScan = function(note, node, ctx){
        return note.summary = nodeRule.GROUP;
    }

    this.process= function(note, node, ctx){
        note.assign = this.name;
        return note;
    };
}

Snapshot.cache(pr);

