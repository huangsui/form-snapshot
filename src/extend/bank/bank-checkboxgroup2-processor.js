
const Snapshot = require('../../snapshot');

"use strict";

var pr = new function(){
    this.name = "bank-checkboxgroup2-processor";

    this.beforeScan = function(note, node, ctx){
        if(note.ctx.data("s-type")=="checkbox-group"){
            var itemClass = note.ctx.data("s-item-class");
            note.itemClass = itemClass || "col-xs-12 col-md-6";

            note.assign = this.name;
            note.manifest = "INPUTS";
            note.subNotes = note.subNotes || [];
            
            var $checkboxItems = $(node).find(".checkbox-custom");
            for (var j = 0; j < $checkboxItems.length; j++) {
                var item = $checkboxItems[j];
                var $input = $(item).find("input");
                var $label = $(item).find("label");
                cnote = {label:$label.text(), input:{type:$input.attr("type"), checked:$input[0].checked}};
                note.subNotes.push(cnote);
            }
        }
        return note;
    };

    this.convert= function(note,ctx){
        var html = "";
        for(var i=0;i<note.subNotes.length;i++){
            //html += this.builder.work(note.subNotes[i]);

            var subNote = note.subNotes[i];
            var labelText = subNote.label;
            var inputNote = subNote.input;

            html += "<div class=\"form-group "+note.itemClass+"\" style=\"display:inline-block;\">";
            
            html += "<input onclick='return false;' type='"+inputNote.type+"' "+((inputNote.checked)?" checked='checked' ":"")+"/> ";
            html += '<label for="input">';
            html += labelText;
            html += '</label>';

            html += "</div>";
        }
        return html;
    };

}

Snapshot.cache(pr);

