
const Snapshot = require('../snapshot-core');

"use strict";

var pr = new function(){
    this.name = "default-table-processor";

    this.beforeScan = function(note, node, ctx){
        if(node.nodeName == "TABLE"){
            note.assign = this.name;
        }
        return note;
    }

    this.process= function(note, node, ctx){
        note.manifest = "GROUP";
        var opts = ctx.cfg;
        var rows = [];
        var table = node;

        var thTexts = getRowText($(table).find("tr:first"));
        rows.push(thTexts);

        if(opts && opts.data ){//选择器操作（自定义多选框-selector，自定义行操作-selector/elem）
            var tr=$( node ).find(opts.data).closest("tr");
            if(tr.length == 0){
                throw "cannt find tr";
            }
            rows.push( getRowText(tr) );
        }else if(opts && opts.event && $(node).has(event.target)){//行操作
            var tr = $(event.target).closest("tr");
            if(tr.length == 0){
                throw "cannt find tr";
            }
            rows.push( getRowText(tr) );
        }

        if(rows.length == 1){//常规多选框
            var checkedTrs = $( table ).find("tr").has("input:checked");
            if(checkedTrs){
                for (var i = checkedTrs.length - 1; i >= 0; i--) {
                    var tr = checkedTrs[i];
                    rows.push(getRowText(tr));
                }
            }
        }

        if(rows.length == 1){
            throw "have not got operated table records."
        }

        note.data=rows;
        return note;
    };
}

function getRowText(tr){
    var tds = $(tr).find("td,th");
    var texts = tds.map(function(){
        return $(this).text();
    }).get();

    return texts;
}

Snapshot.cache(pr);

