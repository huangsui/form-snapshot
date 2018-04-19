

"use strict";

const Snapshot = require('./../../snapshot');
const nodeRule = require('./../../note/note-rule.js');

var pr = new function(){
    this.name = "bank-item-processor";

    this.afterScan = function(note, node, ctx){
        return /^TEXT~INPUTS$/g.test(note.manifest) || /^INPUTS~TEXT$/g.test(note.manifest);
    }

    this.process= function(note, node, ctx){
        note.assign = this.name;
        note.manifest = "ITEM";

        var itemClass = note.ctx.closesd("s-item-class");
        if(itemClass){
            note.itemClass = itemClass;
        }

        return note;
    };

    this.convert = function(note) {

        var subNote1 = note.subNotes[0];
        var subNote2 = note.subNotes[1];

        note.itemClass = note.itemClass || "col-xs-12 col-md-6";

        var html = "";
        if (subNote1.type == "checkbox" || subNote1.type == "radio") {
            html = "<div class=\"form-group "+note.itemClass+"\" style=\"display:inline-block;\">";
            
            html += "<input onclick='return false;' type='"+subNote1.type+"' "+((subNote1.checked)?" checked='checked' ":"")+"/> ";
            html += '<label for="input">';
            html += subNote2.value;
            html += '</label>';

            html += "</div>";
        }else if(subNote2.assign == "bank-checkboxgroup-processor"){
            html += '<div class="form-group tbsp-form-item col-xs-12 col-md-12" style="">';
            html += '<label class="col-xs-12 col-md-2 control-label pl-0 pr-5">'+subNote1.value+'</label>';
            html += '<div class="col-xs-12 col-md-10 pl-0 ">';
            //html = "<div class=\"col-sm-offset-1 form-group\" style=\"display:inline-block;\">";
            html += this.builder.work(subNote2);
            html += "</div>";
            html += "</div>";

        }else{
            html = "<div class=\"form-group "+note.itemClass+"\">";
            html += "<label for='' class='col-md-4'>" + subNote1.value + "</label>";
            html += "<div class='col-md-8'>";

            if(subNote2.type=="select"){
                html += '<select readonly="readonly"><option value="'+subNote2.value+'">'+subNote2.textValue+'</option></select>';
            }else if(subNote2.type=="textarea"){
                html += '<textarea readonly="readonly" class="form-control" '+((subNote2.rows)?(' rows="'+subNote2.rows+'" '):'')+'>'+subNote2.textValue+'</textarea>';
            }else{
                html += '<input readonly="readonly" class="form-control" type="'+subNote2.type+'" value="'+subNote2.value+'" >';
            }

            html += "</div></div>";
        }

        return html;
    };
}

Snapshot.cache(pr);

