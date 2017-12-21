( function( global, Snapshot ) {

    "use strict";

    var descFactory = Snapshot.descFactory;
	var dkSelectParser = new function(){
        
        this.name = "dkSelect_parser";

        this.preJudge=function (desc, node) {
            if(desc.assign)return;

            if($(node).hasClass("dk_container") && $(node).hasClass("form-sel")){
                
                var selectNode = $(node).find("select")[0];
                desc = descFactory.baseInfo(desc, selectNode);

                desc.type="INPUTS";
                desc.manifest="INPUTS";
                desc.assign=this.name;
                return desc;
            }
        }


       
        this.beforeManifest=function (desc, node) {
            if($(node).hasClass("form-read-sel")){
            	desc.type="INPUTS";
            	desc.manifest="INPUTS";
                desc.assign=this.name;
                desc.nodeName="SELECT";
                desc.readonly=true;
                return desc;
            }

        }

    };

    global.dkSelectParser = dkSelectParser;

} )( typeof window !== "undefined" ? window : this, Snapshot);

