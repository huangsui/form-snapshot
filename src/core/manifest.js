
"use strict";

var ManifestFactory = function(){

    var nodeNameMapping = {"TEXTAREA":"INPUTS"};
    var nodeTypeMapping = {"":""};
    this.create = function(note){
        var manifest = null;
        var high = 0;
        if(!note.subNotes || note.subNotes.length == 0){
            manifest = note.nodeType;
            high = 1;
            return manifest;
        }

        if(node.nodeName == "TEXTAREA"){
            manifest = "INPUTS";
        }

        if(!manifest){
            for(var i=0;i<note.subNotes.length;i++){
                var subNote = note.subNotes[i];
                high = Math.max(subNote.high+1, high);
                if(subNote.assign){
                    manifest = "GROUP";//MANY
                    break;
                }else{
                    manifest = (manifest?manifest+"||":"!")+subNote.manifest; 
                }                                   
            }
        }            

        var idx = Math.min(high, 5)-2;
        manifest = manifest.replace(/\|\|/g,["~","~~","~~~","~~~~","~~~~~"][idx]);

        return manifest;
    }

};

module.exports = ManifestFactory;

