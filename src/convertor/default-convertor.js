
( function( global, Snapshot ) {

    "use strict";

    var convertor = new function(){
        this.name = "default-convertor";
        this.init = function(config){

        };

        this.match = function(note){
            return note.assign == "default-processor";
        }

        this.convert= function(note){
            
            var html = "<div  class=\"form-group col-md-12\">";

            if(/^!*TEXT~+INPUTS(\:TEXT)?(~+TEXT)*$/g.test(note.manifest) ){
                var item1 = note.subNotes[0], item2 = note.subNotes[1];
                html += "<label for='' >"+item1.attrs.value+"</label>";
                switch(item2.nodeName){
                    case "INPUT":
                        html += "<input id='' class='form-control' "+attrs2html(item2.attrs)+"/>";
                        break;
                    case "SELECT":
                        html += "<select class='form-control' "+attrs2html(item2.attrs)+"></select>";
                        break;
                    case "TEXTAREA":
                        html += "<textarea class='form-control' >"+item2.subNotes[0].attrs.value+"</textarea>";
                        break;
                    default:
                        throw "nodeName is unknown!" + item2.nodeName;
                }
            }else if(/^!*(~*INPUTS\:(CHECKBOX|RADIO)~+TEXT)+$/g.test(note.manifest) ){
                for (var i = 0; i < note.subNotes.length; i++) {
                    var subNote = note.subNotes[i];
                    switch(subNote.nodeType){
                        case "TEXT":
                            html += subNote.attrs.value;
                            break;
                        case "INPUTS:CHECKBOX":
                            html += "<input type='checkbox' "+attrs2html(subNote.attrs)+"/>";
                            break;
                        case "INPUTS:RADIO":
                            html += "<input type='radio' "+attrs2html(subNote.attrs)+"/>";
                            break;
                        default:
                            throw "nodeType is unknown!" + subNote.nodeType;
                    }                    
                }
            }

            html +="</div>";

            return html;
        };

        function attrs2html(attrs){
            var attrString = " ";
            for (var name in attrs) {
                attrString += (name + "='" + attrs[name]+"' ");
            }
            return attrString;
        }
        
    }

    Snapshot.register(convertor);

} )( typeof window !== "undefined" ? window : this, Snapshot );

