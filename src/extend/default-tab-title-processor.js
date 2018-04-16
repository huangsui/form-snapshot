

const Snapshot = require('../snapshot-core');

"use strict";

var pr = new function(){
    this.name = "default-tab-title-processor";

    this.process= function(note, node, ctx){
        note.manifest = "GROUP";

        return note;
    };

    this.convert= function(){
    	
    }
}

Snapshot.cache(pr);

