

"use strict";

const Snapshot = require('../snapshot-core');
const context = require('./../core/process-context.js');

/**
    不可见元素过滤器，
    默认情况过滤所有不可见元素
    如果需要自定义过滤规则，请使用属性“s-visible=false|true”
*/
var filter = new function() {
    this.name = "node-invisible-filter";

    this.filter = function(args, filterChain) {
        var node = args[0];

        //FIXME:待改造
        var parentNote = context.getParent();
        var visible = parentNote && parentNote.ctx.closesd("s-visible");
        var note;
        switch(visible){
            case "true":
                note = filterChain.filter.apply(filterChain, args);
            case "false":
                return;
            default:
                if (node.nodeType == 1 && !$(node).is(":visible")) {
                    return;
                }else{
                    note = filterChain.filter.apply(filterChain, args);
                }
        }

        if(note.ctx.get("s-visible") == "false"){
            note = undefined;
        }

        return note;
    };
}

Snapshot.cache(filter);

