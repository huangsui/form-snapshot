
( function( global ) {

    "use strict";

    function Parser(){
        
        this.attrs2html = function(attrs){
            var attrString = " ";
            for (var name in attrs) {
                attrString += (name + "='" + attrs[name]+"' ");
            }
            return attrString;
        }

    };

    global.Parser = new Parser();

} )( typeof window !== "undefined" ? window : this );

