const Snapshot = require('../snapshot-core');

"use strict";

/**
    不可见元素过滤器 
    过滤所有不可见元素，如果部分不可见元素需要正常加载，那么请添加“s-reborn”属性
*/
var filter = new function() {
    this.name = "invisible-filter";
    this.init = function(config) {

    };
    /*
        http://www.w3school.com.cn/jsref/prop_node_nodetype.asp
        nodeType 属性返回以数字值返回指定节点的节点类型。
        如果节点是元素节点，则 nodeType 属性将返回 1。
        如果节点是Text节点，则 nodeType 属性将返回 3。
    */
    this.filter = function(args, filterChain) {
        var node = args[0];
        var note = args[1];
        var ctx = args[2];

        if (node.nodeType == 1 && !$(node).is(":visible")) {
            if(!$(node).attr("s-reborn")){
                return;
            }
        }

        return filterChain.filter.apply(filterChain, args);
    };
}

Snapshot.cache(filter);

