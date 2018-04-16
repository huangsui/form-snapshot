
const Snapshot = require('../snapshot');

"use strict";

var pr = new function(){
    this.name = "default-tab-processor";


    this.beforeScan = function(note, node, ctx){
        if(note.ctx.data("s-type") == "tab"){
            note.assign = this.name;
            note.manifest = "GROUP";

            var tabNames = [];
            var contents = [];

            $(node).find("a").each(function(idx, el){
                tabNames.push($(el).text());
            });

            note.tabNames = tabNames;

            $(node).find(".tab-pane").each(function(idx, el){
                var contentNode = note.noter.takeNote(el);
                contents.push(contentNode);//考虑空节点
            }); 
            note.contents = contents;
        }

        return note;
    }

    this.convert=function(note){
        var html = "";
        html += '<div class="nav nav-tabs" id="nav-tab" role="tablist">'
        for (var i = 0; i < note.tabNames.length; i++) {
            var tabName = note.tabNames[i];
            html += '<a class="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">'+tabName+'</a>'
        }
        html += '</div>'

        for (var i = 0; i < note.contents.length; i++) {
            var contentNote = note.contents[i];
            html += '<div class="tab-pane fade active show in" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">';
            html += this.builder.work(contentNote);
            html += '</div>';
        }
        
        return html;
    }
}

Snapshot.cache(pr);

