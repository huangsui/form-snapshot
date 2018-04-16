

"use strict";

const Group = require('./../common/group.js');
const FilterChain = require('./../common/filter-chain.js');
const context = require('./../snapshot-context.js');
const Note = require('./note.js');
const NoteContext = require('./note-context.js');
const NoteWasher = require('./note-washer.js');
const noteRule = require('./note-rule.js');

var Noter = function(){

    var prGroup = new Group();
    var filters = new FilterChain();
    var noteWasher = new NoteWasher();

    this.registerProcessor=function(pr){
        prGroup.pushWithName(pr);
    }
    this.registerFilter=function(filter){
        filters.push(filter);
    }
    this.createNote = function(node){
        var note = new Note(node);
        note.ctx = new NoteContext();
        note.noter = this;
        return note;
    }

    var work = function(node, note ) {

    	//notify before
        if(!noteRule.isFactor(node.nodeName)){
            for( var i=0; i < prGroup.length; i++ ){
                var pr = prGroup.get(i);
                if(pr.beforeScan){              
                    pr.beforeScan(note, node, context);
                    if(note.manifest){
                        return note;
                    }else if(note.assign){
                        break;
                    }
                }
            }
        }

        //scan
        note.scan( node, this );

        //notify after
        if(!noteRule.isFactor(note.manifest)){
            if(note.assign){
                var pr = prGroup.getByName(note.assign);
                return pr.process(note, node, context);
            }else{
                for( var i=0; i < prGroup.length; i++ ){
                    var pr = prGroup.get(i);
                    if(pr.afterScan && pr.afterScan(note, node, context)){
                        return pr.process(note, node, context);
                    }
                }

                note.subNotes = noteWasher.wash(note.subNotes);
                note.manifest = "";
                note.makeManifest();
                

                for( var i=0; i < prGroup.length; i++ ){
                    var pr = prGroup.get(i);
                    if(pr.afterScan && pr.afterScan(note, node, context)){
                        return pr.process(note, node, context);
                    }
                }
            }
        }
       
        return note; 
    };

    this.work = filters.weave(this, work);

    this.takeNote = function(node){
        var note = this.createNote(node);
        return this.work( node, note );
    };
};

module.exports = Noter;

