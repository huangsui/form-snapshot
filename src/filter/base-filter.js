
/**
 * 基础过滤器
 * 
 * 辅助快照核心组件完成节点筛选
 *  
 */
const Snapshot = require('../snapshot-core');

"use strict";

var filter = new function(){
    this.name = "base-filter";
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

        //换行符、空节点 直接跳过
    	if(node.nodeType==3 && /(^\s*$)/.test(node.nodeValue)){
            return;
        }

    	var result = filterChain.filter.apply(filterChain, args);

        if(!result){
            return result;
        }
        
        //已委派
        if(result.assign){
            return result;
        }
        
        //无货单，也无委派，进行丢弃
        if(!result.manifest){            
            //console.log("无效节点: "+result.nodeName);
            return null;
        }

        //剥离空壳
        if(result.manifest.startsWith("!") 
            && result.subNotes.length == 1){
            //console.log("剥离空壳: "+result.nodeName);            
            return result.subNotes[0];
        }

        //未委派，但是有正常货单的情况，直接返回
    	return result;            
    };      
}

Snapshot.register(filter);


