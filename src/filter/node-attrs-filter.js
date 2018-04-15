

const Snapshot = require('../snapshot-core');

"use strict";

/**
    属性过滤器 
    
*/
var filter = new function() {
    this.name = "node-attrs-filter";
    
    this.filter = function(args, filterChain) {
        var node = args[0];
        var note = filterChain.filter.apply(filterChain, args);

        //find all attrs start with "s-"
        $.each( node.attributes, function ( index, attribute ) {
            if(attribute.name.startsWith("s-")){
                note.ctx.data(attribute.name, attribute.value);
            }           
        } );

        return note;
    };
}

Snapshot.cache(filter);

