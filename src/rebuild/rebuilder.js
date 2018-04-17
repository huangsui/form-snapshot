

"use strict";

const Cache = require('./../common/cache.js');

/*重建者：通过Note记录重建Html*/
var Rebuilder = function(){

    var cvts = new Cache();
    this.registerConvertor=function(){
        cvts.cache.apply(cvts, arguments);
        if(arguments.length==1){
            cvts.cache(arguments[0].name).builder = this;
        }else if(arguments.length==2){
            cvts.cache(arguments[0]).builder = this;
        }
        
    };

    this.work = function(note){
        var result = "";
        if(note.assign){
            var cvt = cvts.cache(note.assign);
            result = cvt.convert(note);
        }else if(note.subNotes){
            for (var i = 0; i < note.subNotes.length; i++) {
                var subNote = note.subNotes[i];
                result += this.work(subNote);
            }
        }
        return result;
    };
};

module.exports = Rebuilder;

