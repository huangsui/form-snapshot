

"use strict";

const Group = require('./../common/group.js');
const context = require('./process-context.js');
const Note = require('./note-factory.js');
const NoteContext = require('./process-context.js');
const FilterChain = require('./filter-chain.js');

var Noter = function(){

    var prs = new Group();
    var filters = new FilterChain();
    this.registerProcessor=function(pr){
        prs.pushWithName(pr);
    }
    this.registerFilter=function(filter){
        filters.push(filter);
    }
    this.createNote = function(node){
        var note = new Note(node);
        note.ctx = new NoteContext();
        return note;
    }
    var work = function( node, note ) {
        var parent = context.getParent();
        if(parent){
            parent.appendChild(note);
        }

    	//notify before
        for( var i=0; i < prs.length; i++ ){
            var pr = prs.get(i);
            if(pr.beforeScan){            	
                pr.beforeScan(note, node, context);
            	if(note.manifest){
            		return note;
            	}else if(note.assign){
            		break;
            	}
            }
        }

        //scan
        context.pushParent(note);
        note.scan( node, this );
        context.popParent(note);

        //notify after
        if(note.assign){
            var pr = prs.getByName(note.assign);
            return pr.process(note, node, context);
        }else{
            for( var i=0; i < prs.length; i++ ){
                var pr = prs[i];
                if(pr.afterScan && pr.afterScan(note, node, context)){
                    return pr.process(node, note, ctx);
                }
            }
        }
       
        return note; 
    };

    this.takeNote = filters.weave(work);
};

module.exports = Noter;

