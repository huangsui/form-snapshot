

"use strict";

const Snapshot = require('./../../snapshot');
const Util = require('./../../common/util.js');

var filter = new function(){
    this.name = "node-asterisk-filter";
    
    /*
		http://www.w3school.com.cn/jsref/prop_node_nodetype.asp
		nodeType 属性返回以数字值返回指定节点的节点类型。
		如果节点是元素节点，则 nodeType 属性将返回 1。
		如果节点是Text节点，则 nodeType 属性将返回 3。
	*/
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


