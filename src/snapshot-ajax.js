
( function( global, snapshot ) {

    "use strict";

    var proxyAjax:function() {
        var _ajax_ = $.ajax;
        $.ajax = function () {

            var options = (typeof arguments[0] == "string")?arguments[1]:arguments[0];
            //wd:"#form1"
            //wd:{mode:"table_delete", el:""}
            if(options.wdJson){
                //wdJson:"#abcTable form";
                //wdJson:{"operation":"TABLE:DELETE", event:event};
                //TODO:解析上面两种模式
                var node = $(options.wdJson)[0];//第一种模式
                try{
                    var assembler = Snapshot.load(node);
                    var wdJson = assembler.desc2Json();
                    //options.data
                    options.data = options.data || {};
                    if(typeof options.data == "string"){
                        options.data += "&wdJson="+wdJson;
                    }else{
                        options.data.wdJson = wdJson;
                    }
                }catch(e){
                    console.log(e);
                    throw e;
                }

            }
            delete arguments.wdOpts;
            _ajax_.apply($, arguments);
        }
    }

    global.buttonParser = buttonParser;

} )( typeof window !== "undefined" ? window : this, snapshot );


