
( function( global, Snapshot ) {

    "use strict";

    var convertor = new function(){
        this.name = "root-convertor";
        this.init = function(config){

        };

        this.match = function(note){
        }

        this.convert= function(note, convertFactory){
            var html = "<ul class='form-list clearfix'>";
            html += convertFactory.convert(note.subNotes);
            html +="</ul>";
            return html;
        };
        
    }

    Snapshot.register(convertor);

} )( typeof window !== "undefined" ? window : this, Snapshot );

