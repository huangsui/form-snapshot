

const Snapshot = require('../snapshot-core');

"use strict";

var filter = new function(){
    this.name = "form-filter";
    this.init = function(config){

    };
    /*
		http://www.w3school.com.cn/jsref/prop_node_nodetype.asp
		nodeType 属性返回以数字值返回指定节点的节点类型。
		如果节点是元素节点，则 nodeType 属性将返回 1。
		如果节点是Text节点，则 nodeType 属性将返回 3。
	*/
    this.filter= function(args, filterChain){
    	var node = args[0];
    	var note = args[1];
    	var ctx = args[2];

        if(node.nodeType==1){//元素节点
            note.attrs = note.attrs || {};
            note.attrs.width = $(node).width();
        }

        //过滤*号
        if(node.nodeName=="#text" && typeof node.nodeValue=="string" && $.trim(node.nodeValue)=="*"){
            return;
        }

    	var result = filterChain.filter.apply(filterChain, args);

        if(node.nodeName=="INPUT" && node.getAttribute("type").toUpperCase() == "PASSWORD"){
            note.attrs = note.attrs || {};
            note.textValue = "********";
        }

        //空壳继承宽度
        if(result.subNotes && result.subNotes.length == 1){           
            result.subNotes[0].attrs.width = note.attrs.width;
            return result;
        }
    	return result;            
    };      
}

Snapshot.cache(filter);


