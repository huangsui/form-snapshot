( function( global ) {

    "use strict";

    var RootParser = function(){//level 2
        
        this.name = "root_parser";

        this.toHtml=function(json, recurseCallback){
            var html ="<div class='form-inline' style='overflow:auto;'>";
            for (var i = 0; i < json.items.length; i++) {
                var item = json.items[i];
                html += recurseCallback(item);
            }
            html +="</div>";
            
            return html;
        }
    };

    global.rootParser = new RootParser();

} )( typeof window !== "undefined" ? window : this );

