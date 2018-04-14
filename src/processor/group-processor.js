

"use strict";

const Snapshot = require('../snapshot-core');

//TEXT~GROUP
//GROUP:TEXT~GROUP:GROUP
var pr = new function(){
    this.name = "group-processor";

    this.beforeScan = function(node, note, ctx){
        //s-tabs
        //s-ztree
        //
        if(note.ctx.data("s-type") == "group"){
            note.assign = this.name;
        }
        //return false 完全接管，不会进行扫描
    }

    this.afterScan = function(node, note, ctx){

    }

    this.matchNode = function(node, note, ctx){
        if(note.ctx.data("s-type") == "group"){
            note.assign = this.name;
        }
    }

    this.process= function(node, note, ctx){
        return note;
    };

    this.convert = function(note){
        //tab
        //group
    }
}

Snapshot.cache(pr);

