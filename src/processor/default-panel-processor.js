

"use strict";

const Snapshot = require('./../snapshot-core');
const nodeRule = require('./../core/note-rule.js');

var pr = new function(){
    this.name = "default-panel-processor";

    this.afterScan = function(note, node, ctx){
    	var panel = note.ctx.closesd("s-panel");
    	if(panel){

    	}
        return panel || (note.manifest == nodeRule.PANEL);
    }

    this.process= function(note, node, ctx){
        note.assign = this.name;
        return note;
    };
}

Snapshot.cache(pr);

