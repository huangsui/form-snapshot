
const Snapshot = require('./../../snapshot');

"use strict";

var pr = new function(){
    this.name = "bank-select2-processor";

    this.beforeScan = function(note, node, ctx){        
        if($(node).children(".select2.select2-container").length>0){  //代理select2下拉框
            note.isFactor = true;
            note.manifest = "INPUTS";
            note.nodeName = "INPUT";
            note.type = "text";
            note.value = $(node).find(".select2-selection__rendered").text();

            note.orign = "select2";
        }
        return note;
    };
}

Snapshot.cache(pr);

