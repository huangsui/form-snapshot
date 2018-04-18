
const Snapshot = require('../../snapshot');

"use strict";

var pr = new function(){
    this.name = "bank-checkboxgroup-processor";

    this.beforeScan = function(note, node, ctx){
        if(note.ctx.data("s-type")=="checkbox-group"){
            note.assign = this.name;
            note.manifest = "INPUTS";
            note.subNotes = note.subNotes || [];
            for (var i = 0; i < node.childNodes.length; i++) {
                var cnode = node.childNodes[i];
                var cnote = note.noter.takeNote(cnode);
                cnote.stype = "display: inline-block;";
                note.subNotes.push(cnote);
            }
        }
        return note;
    };

    this.convert= function(note,ctx){
        var html = "";
        for(var i=0;i<note.subNotes.length;i++){
            html += note.noter.takeNote(note.subNotes[i]);
        }
        return html;
    };

}

Snapshot.cache(pr);

