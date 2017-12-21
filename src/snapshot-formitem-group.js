( function( global ) {

    "use strict";

    var FormitemGroupParser = function(){//level 2
        
        this.name = "formitem_group_parser";

        this.postJudge=function (desc, node) {
            if(desc.assign)return;
            if(desc.level>2){
                return;
            }

            if(/^[formitem~]*formitem$/.test(desc.manifest) ){
                desc.assign = this.name;
                desc.manifest="formitem-group";
                desc.level=1;
            }

        }
        
        this.toJson=function (desc, callback) {
            //console.log(desc);
            if(desc.assign != this.name)return;
            var json = {type:"formitems", assign:this.name, items:[]};
            for (var i = 0; i < desc.items.length; i++) {
                var item = desc.items[i];
                var itemJson = callback(item);
                json.items.push(itemJson);
            }
            return json;
        }

        this.toHtml=function(json, callback){
            var html = "<ul class='form-list clearfix'>";
            for (var i = 0; i < json.items.length; i++) {
                var item = json.items[i];
                html += callback(item);
            }
            html +="</ul>";
            return html;
        }
    };

    global.formitemGroupParser = new FormitemGroupParser();

} )( typeof window !== "undefined" ? window : this );

