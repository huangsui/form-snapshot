

const Snapshot = require('../snapshot-core');

"use strict";

var filter = new function(){
    this.name = "default-filter";
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
    	
        //标记不可见节点，分组
    	/*if(node.nodeType==1 && !$(node).is(":visible")){
            console.log("过滤不可见节点: "+node.nodeName)
            return;
        }*/

        //过滤*号
        if(node.nodeName=="#text" && node.nodeValue=="*"){
            return;
        }

    	if(node.nodeType==3 && /(^\s*$)/.test(node.nodeValue)){//换行符，空节点
            return;
        }

    	if( $(node).data("snp-ignore") ){
    		console.log("过滤ignore节点: "+node.nodeName);
    		return;
    	}

    	var result = filterChain.filter.apply(filterChain, args);

        if(result.assign){
            return result;
        }
        
        if(!result.manifest){
            //无货单，也无委派，移除该便签
            console.log("无效节点: "+result.nodeName);
            result = null;
        }else if(result.manifest.startsWith("!") 
            && result.subNotes.length == 1){//剥离空壳
            result = result.subNotes[0];
            console.log("剥离空壳: "+result.nodeName);
        }

    	return result;            
    };      
}

Snapshot.register(filter);


