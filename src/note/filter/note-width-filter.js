

const Snapshot = require('./../../snapshot');
const Util = require('./../../common/util.js');

"use strict";

var filter = new function(){
    this.name = "note-width-filter";
    
    this.filter= function(args, filterChain){
    	var node = args[0];

    	var resultNote = filterChain.filter.apply(filterChain, args);

        if(Util.isElement(node)){//元素节点
            resultNote.layout = resultNote.layout || {};
            resultNote.layout.width = $(node).width();
        }

    	return resultNote;            
    };      
}

Snapshot.cache(filter);


