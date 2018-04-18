

"use strict";

const Snapshot = require('../../snapshot');

var convertor = new function() {
    this.name = "bank-item-convertor";
    this.bind = "default-item-processor";

    this.convert = function(note) {
        var subNote1 = note.subNotes[0];
        var subNote2 = note.subNotes[1];

        var html = "";
        if (subNote1.type == "checkbox" || subNote1.type == "radio") {
            html = "<div class=\"col-sm-offset-1 form-group\" style=\"display:inline-block;\">";
            
            html += "<input type='"+subNote1.type+"' "+((subNote1.checked)?" checked='checked' ":"")+"/> ";
            html += '<label for="input">';
            html += subNote2.value;
            html += '</label>';

            html += "</div>";
        }else if(subNote2.assign){
            //html = "<div class=\"col-sm-offset-1 form-group\" style=\"display:inline-block;\">";
            html += note.builder.work(subNote2);
            //html += "</div>";
        }else{
            var i=6,j=4,k=8;
            
            html = "<div class=\"form-group col-md-" + i + "\">";
            html += "<label for='' class='col-md-" + j + "'>" + subNote1.value + "</label>";
            html += "<div class='col-md-" + k + "'>";

            if (/^INPUT$/g.test(subNote2.nodeName)) {
                html += '<input class="form-control" type="text" value="'+subNote2.value+'">';
            }else if(/^SELECT$/g.test(subNote2.nodeName)){
                html += '<select><option value="'+subNote2.value+'">'+subNote2.textValue+'</option></select>';
            }else if(/^TEXTAREA$/g.test(subNote2.nodeName)){
                html += '<textarea class="form-control" '+((subNote2.rows)?(' rows="'+subNote2.rows+'" '):'')+'>'+subNote2.textValue+'</textarea>';
            }else{
                html += '<input type="text" value="'+subNote2.value+'">';
            }

            html += "</div></div>";
        }

        return html;
    };

}

Snapshot.cache(convertor);
//module.exports = pr;