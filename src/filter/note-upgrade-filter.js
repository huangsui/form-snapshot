
"use strict";

const Snapshot = require('../snapshot-core');

var filter = new function(){
    this.name = "note-upgrade-filter";
    
    this.filter= function(args, filterChain){

    	var resultNote = filterChain.filter.apply(filterChain, args);

        if(resultNote && resultNote.subNotes && resultNote.subNotes.length == 1){
            //console.log("剥离空壳: "+result.nodeName);            
            return resultNote.subNotes[0];
        }

    	return resultNote;            
    };      
}

Snapshot.cache(filter);


