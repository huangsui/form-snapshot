

"use strict";

const Snapshot = require('./../snapshot-core');
const nodeRule = require('./../core/note-rule.js');

var pr = new function(){
    this.name = "default-group-processor";

    this.afterScan = function(note, node, ctx){
    	var group = note.ctx.closesd("s-group");
    	if(group){

    	}
        return group || (note.manifest == nodeRule.GROUP);
    }

    this.process= function(note, node, ctx){
        note.assign = this.name;
        return note;
    };
}

Snapshot.cache(pr);

