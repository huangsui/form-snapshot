

"use strict";

const Snapshot = require('./../../snapshot');
const Util = require('../../common/util.js');

/**
    属性过滤器 
    
*/
var filter = new function() {
    this.name = "node-attrs-filter";
    
    this.filter = function(args, filterChain) {
        var node = args[0];
        var note = args[1];
        
        //find all attrs start with "s-"
        if(Util.isElement(node)){
            $.each( node.attributes, function ( index, attribute ) {
                if(attribute.name.startsWith("s-")){
                    note.ctx.data(attribute.name, attribute.value);
                }           
            } );
        }

        return filterChain.filter.apply(filterChain, args);
    };
}

Snapshot.cache(filter);

