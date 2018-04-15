
"use strict";

var Util = {
    trim:function(x) {
        if(typeof x !== "string"){
            throw x+"is not string";
        }
        return x.replace(/^\s+|\s+$/gm,'');
    },
    /*
		http://www.w3school.com.cn/jsref/prop_node_nodetype.asp
		nodeType 属性返回以数字值返回指定节点的节点类型。
		如果节点是元素节点，则 nodeType 属性将返回 1。
		如果节点是Text节点，则 nodeType 属性将返回 3。
	*/
    isElement:function(node){
    	return node.nodeType==1;
    }
}


module.exports = Util;

