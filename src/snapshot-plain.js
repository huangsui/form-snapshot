( function( global ) {

    "use strict";

    function PlainParser(){//level 2
        
        this.name = "plain_parser";

        this.preJudge=function (desc, node) {
            if(desc.assign)return;
            if($(node).hasClass("btn")){//过滤按钮
                desc.type="OTHER";
            }
        }

        
        this.postJudge=function (desc, node) {
            if(desc.assign)return;
            if(desc.level>3){
                return;
            }
            normalize(desc, node);

            if(desc.manifest=="TEXT~INPUTS" || /^TEXT~+INPUTS~+INPUTS$/.test(desc.manifest) ){
                desc.assign = this.name;
                desc.manifest="formitem";
                desc.level=1;
            }

        }
        
        this.toJson=function (desc) {
            //console.log(desc);
            if(desc.assign != this.name)return;
            var json = {type:"formitem", assign:this.name, items:[]};
            for (var i = 0; i < desc.items.length; i++) {
                var item = desc.items[i];
                var itemJson = {nodeName:item.nodeName, attrs:item.nodeAttrs};
                json.items.push(itemJson);
            }
            return json;
        }

        function normalize(desc, node) {
            if(desc.manifest=="TEXT~TEXT"){
                if(desc.items[0].value=="*"){
                    desc.items[1].required=true;
                    desc.items.shift();
                }
                desc=desc.items[1];
                desc.manifest="TEXT";
            }

        }

        function attrs2html(attrs){
            var attrString = " ";
            for (var name in attrs) {
                attrString += (name + "='" + attrs[name]+"' ");
            }
            return attrString;
        }

        this.toHtml=function(json, callback){
            var html = "<li>";
            var item1 = json.items[0], item2 = json.items[1];
            html += "<label class='item'>"+item1.attrs.value+"</label>";
            switch(item2.nodeName){
                case "INPUT":
                    html += "<input class='form-ipt' "+attrs2html(item2.attrs)+"/>";
                    break;
                case "SELECT":
                    html += "<select class='form-ipt' "+attrs2html(item2.attrs)+"></select>";
                    break;
                case "TEXTAREA":
                    html += "<textarea class='form-ipt'>"+item2.attrs.value+"</textarea>";
                    break;
                default:
                    throw "Exception: nodeName is unknown!" + item2.nodeName;
            }

            html +="</li>";

            return html;
        }


    };

    global.plainParser = new PlainParser();

} )( typeof window !== "undefined" ? window : this );

