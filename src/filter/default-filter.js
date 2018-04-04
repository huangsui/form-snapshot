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

        //过滤不可见节点
        if (!ctx.opts || ctx.opts.visible !== false) {
            if (node.nodeType == 1 && !$(node).is(":visible")) {
                //console.log("过滤不可见节点: "+node.nodeName);
                return;
            }
        }

        if ($(node).data("ss-ignore")) {
            console.log("过滤ignore节点: " + node.nodeName);
            return;
        }

        var result = filterChain.filter.apply(filterChain, args);

        return result;
    };
}

Snapshot.cache(filter);