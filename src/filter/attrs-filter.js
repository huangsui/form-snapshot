

const Snapshot = require('../snapshot-core');

"use strict";

/**
    属性过滤器 
    
*/
var filter = new function() {
    this.name = "attrs-filter";
    
    this.filter = function(args, filterChain) {
        var node = args[0];
        var note = args[1];
        var ctx = args[2];

        //find all attrs start with "s-"
	    $.each( node.attributes, function ( index, attribute ) {
	    	if(attribute.name.startsWith("s-")){
	    		note.ctx.data(attribute.name, attribute.value);
	    	}	        
	    } );

        return filterChain.filter.apply(filterChain, args);
    };
}

Snapshot.cache(filter);

