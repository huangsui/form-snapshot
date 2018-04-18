

"use strict";

const Snapshot = require('./../../snapshot');
const Util = require('./../../common/util.js');

var filter = new function(){
    this.name = "node-asterisk-filter";
    
    this.filter= function(args, filterChain){
        var node = args[0];

        //过滤*号
        if(node.nodeName=="#text" && Util.trim(node.nodeValue)=="*"){
            return;
        }

    	return filterChain.filter.apply(filterChain, args);        
    };      
}

Snapshot.cache(filter);


