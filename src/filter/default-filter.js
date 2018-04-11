const Snapshot = require('../snapshot-core');

"use strict";

var filter = new function() {
    this.name = "default-filter";
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

        if ($(node).attr("s-ignore")) {
            return;
        }

        return filterChain.filter.apply(filterChain, args);
    };
}

Snapshot.cache(filter);
