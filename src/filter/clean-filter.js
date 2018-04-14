
"use strict";

/*
 清理note上无用的数据
*/
var filter = new function() {
    this.name = "clean-filter";

    this.filter = function(args, filterChain) {
        var node = args[0];
        var note = args[1];
        var ctx = args[2];

        var result = filterChain.filter.apply(filterChain, args);

        //todo: clean
        return result;
    };
}

Snapshot.cache(filter);

