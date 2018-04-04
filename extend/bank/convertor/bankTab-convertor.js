
const Snapshot = require('../snapshot-core');

"use strict";

var convertor = new function(){
    this.name = "bankTab-convertor";
    this.init = function(config){

    };

    this.match = function(note){
        console.log("bankTab-converter");
        return note.assign == "bankTab-processor";
    };

    this.convert= function(note){
        
        var html = "<div  class=\"form-group col-md-12\">";

        if(note.manifest=="TEXT"){
            html += note.attrs.value;
        }
        if(note.manifest=="PANEL"){
            html +="<h4 class='panel-title'>"+note.attrs.value+"</h4>";
        }

        html +="</div>";

        return html;
    };
}

Snapshot.register(convertor);



