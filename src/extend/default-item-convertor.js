

"use strict";

const Snapshot = require('../snapshot');

var convertor = new function() {
    this.name = "default-item-convertor";
    this.bind = "default-item-processor";

    this.convert = function(note, ctx) {
        var i = 6,
            j = 4,
            k = 8;
        if (Number(note.attrs.width * 2) > Number(ctx.root.attrs.width)) {
            i = 12, j = 2, k = 10;
        }

        var html = "";

        if (/^!*TEXT~+INPUTS(\:TEXT|\:EMAIL|\:PASSWORD|\:SELECT)?(~+TEXT)*$/g.test(note.manifest)) {
            html = "<div class=\"form-group col-md-" + i + "\">";
            var item1 = note.subNotes[0],
                item2 = note.subNotes[1];
            html += "<label for='' class='col-md-" + j + "'>" + item1.attrs.value + "</label>";
            html += "<div class='col-md-" + k + "'>";
            switch (item2.nodeName) {
                case "INPUT":
                    html += "<input class='form-control'";
                    if(note.manifest.indexOf("PASSWORD")!=-1){
                        html += " type='password' ";
                    }
                    html += " value=\"" + note.textValue + "\"/>";
                    break;
                case "SELECT":
                    html += "<input class='form-control' value=\"" + note.textValue + "\"/>";
                    break;
                case "TEXTAREA":
                    // html += "<textarea class='form-control' >"+item2.subNotes[0].attrs.value+"</textarea>";
                    if (!!item2.subNotes) {
                        html += "<textarea class='form-control' >" + item2.subNotes[0].attrs.value + "</textarea>";
                    } else {
                        html += "<textarea class='form-control' >" + attrs2html(item2.attrs.value) + "</textarea>";
                    }
                    break;
                default:
                    throw "nodeName is unknown!" + item2.nodeName;
            }
            html += "</div></div>";
        } else if (/^!*(~*INPUTS\:(CHECKBOX|RADIO)~+TEXT)+$/g.test(note.manifest)) {
            html = "<div class=\"col-sm-offset-1 form-group\" style=\"display:inline-block;\">";
            for (var i = 0; i < note.subNotes.length; i++) {
                var subNote = note.subNotes[i];
                switch (subNote.nodeType) {
                    case "TEXT":
                        html += subNote.attrs.value;
                        break;
                    case "INPUTS:CHECKBOX":
                        html += "<input type='checkbox' " + attrs2html(subNote.attrs) + "/> ";
                        break;
                    case "INPUTS:RADIO":
                        html += "<input type='radio' " + attrs2html(subNote.attrs) + " /> ";
                        break;
                    default:
                        throw "nodeType is unknown!" + subNote.nodeType;
                }
            }
            html += "</div>";
        }

        return html;
    };

    function attrs2html(attrs) {
        var attrString = " ";
        for (var name in attrs) {
            attrString += (name + "='" + attrs[name] + "' ");
        }
        return attrString;
    }

}

Snapshot.cache(convertor);
//module.exports = pr;