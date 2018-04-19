
const Snapshot = require('../../snapshot');

"use strict";

var pr = new function(){
    this.name = "bank-checkboxgroup-processor";

    this.beforeScan = function(note, node, ctx){
        if(note.ctx.data("s-type")=="checkbox-group"){
            var itemClass = note.ctx.data("s-item-class");
            note.itemClass = itemClass || "col-xs-12 col-md-6";

            note.assign = this.name;
            note.manifest = "INPUTS";
            note.subNotes = note.subNotes || [];
            for (var i = 0; i < node.childNodes.length; i++) {
                var cnode = node.childNodes[i];
                var cnote = note.noter.takeNote(cnode);
                if(cnote){
                    note.subNotes.push(cnote);
                }
            }
        }
        return note;
    };

    this.convert= function(note,ctx){
        var html = "";
        for(var i=0;i<note.subNotes.length;i++){
            //html += this.builder.work(note.subNotes[i]);

            var subNote = note.subNotes[i];
            var labelNote = subNote.subNotes[1];
            var inputNote = subNote.subNotes[0];

            html += "<div class=\"form-group "+note.itemClass+"\" style=\"display:inline-block;\">";
            
            html += "<input onclick='return false;' type='"+inputNote.type+"' "+((inputNote.checked)?" checked='checked' ":"")+"/> ";
            html += '<label for="input">';
            html += labelNote.value;
            html += '</label>';

            html += "</div>";
        }
        return html;
    };

}

Snapshot.cache(pr);

