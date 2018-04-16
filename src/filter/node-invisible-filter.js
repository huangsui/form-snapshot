

"use strict";

const Snapshot = require('../snapshot-core');
const context = require('./../core/snapshot-context.js');

/**
    不可见元素过滤器，
    默认情况过滤所有不可见元素
    如果需要自定义过滤规则，请使用属性“s-visible=false|true”
*/
var filter = new function() {
    this.name = "node-invisible-filter";

    this.filter = function(args, filterChain) {
        var node = args[0];
        var note = args[1];

        var visible = note.ctx.closesd("s-visible");
        switch(visible){
            case "true":
                return filterChain.filter.apply(filterChain, args);
            case "false":
                return;
            default:
                if (node.nodeType == 1 && !$(node).is(":visible")) {
                    return;
                }else{
                    return filterChain.filter.apply(filterChain, args);
                }
        }
        return note;
    };
}

Snapshot.cache(filter);

