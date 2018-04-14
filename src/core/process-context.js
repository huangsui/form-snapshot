
"use strict";

var Context = new function(){

    this.noteRoot = null;
    this.pnote = null;
    this.curNote = null;
    this.opts = opts;

    this.init = function(){

    };

    this.depth = function(){
        if(this.pnote){
            return this.pnote.depth+1;
        }
        return 1;
    };

    this.appendNote = function(note){
        if(this.noteRoot == null){
            this.noteRoot = note;
        }else{
            this.pnote.appendChild(note);
        }            
    };
    
    this.removeNote = function(note){
        this.pnote.removeChild(note);
    }

};

module.exports = Context;

