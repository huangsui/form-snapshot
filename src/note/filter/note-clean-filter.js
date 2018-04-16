
"use strict";

/*
 清理note上无用的数据
*/
var filter = new function() {
    this.name = "note-clean-filter";

    this.filter = function(args, filterChain) {
        var node = args[0];

        var resultNote = filterChain.filter.apply(filterChain, args);

        if(resultNote){
        	delete resultNote.ctx;
        }        
        
        return resultNote;
    };
}

Snapshot.cache(filter);

