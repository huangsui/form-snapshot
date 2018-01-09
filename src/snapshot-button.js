
( function( global ) {

    "use strict";

    var buttonParser = new function(){
        
        this.name = "button_parser";

        this.preJudge=function (desc, node) {

            if(desc.assign)return;

            if(node.nodeName=="INPUT" && $(node).attr("type")=="button"){
                desc.assign=this.name;
                desc.type="OTHER";
                return desc;
            }

            if($(node).hasClass("btn")){
                desc.assign=this.name;
                desc.type="OTHER";
                return desc;
            }
        }
    };

    global.buttonParser = buttonParser;

} )( typeof window !== "undefined" ? window : this );
