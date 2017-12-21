
( function( global ) {

    "use strict";

    var checkboxParser = new function(){
        
        this.name = "checkbox_parser";

        this.preJudge=function (desc, node) {
            if(desc.assign)return;

            if(node.nodeName == "EM" && $(node).hasClass("radio")){
                
                desc.type="INPUTS";
                desc.manifest="INPUTS";
                desc.nodeName="INPUT";
                desc.value=node.value;
                desc.inputType="radio";
                desc.level=1;
                desc.assign=this.name;
                return desc;
            }
        }

    };

    global.checkboxParser = checkboxParser;

} )( typeof window !== "undefined" ? window : this );

