
const Snapshot = require('../../snapshot');

"use strict";

var pr = new function(){
    this.name = "bankTab-processor";

    this.beforeScan = function(note, node, ctx){
        if(node.className == "nav nav-tabs"||node.className == "panel-heading"){
            note.assign = this.name;
            note.manifest = "GROUP";
        }
        return note;
    };

    this.process= function(note, node, ctx){
        if(node.className == "nav nav-tabs"){
            note.nodeName = "#text";
            note.value = $(node).find("li.active a").text();
            note.nodeType = "TEXT";
            note.manifest = "TEXT";
            note.hierarchy=1;
        }
        if(node.className == "panel-heading"){
            note.nodeName = "#text";
            note.value =$.trim($(node).find(".panel-title").text());
            note.nodeType = "TEXT";
            note.manifest = "TABPANEL";
            note.hierarchy=1;
        }
        return note;
    };

    this.convert= function(note){
        
        var html = "<div  class=\"form-group col-md-12\">";

        if(note.manifest=="TEXT"){
            html += note.value;
        }
        if(note.manifest=="TABPANEL"){
            html +="<h4 class='panel-title'>"+note.value+"</h4>";
        }

        html +="</div>";

        return html;
    };
}

Snapshot.register(pr);

