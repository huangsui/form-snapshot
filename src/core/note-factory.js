
"use strict";

const Util = require('../common/util.js');
const NoteContext = require('./note-context.js');
const nodeRule = require('./node-rule.js');
const context = require('./process-context.js');

var Note = function(node){

    this.parent = null;
    this.depth = 0;

    /*Object.defineProperty(this, "assign", {
            value:undefined,
            get : function(){
                return value;
            },
            set : function(newValue){
                value = newValue;
                console.log("assign:"+assign);
            }
        }
    );*/

}

Note.prototype = {
    constructor:Note,
    hierarchy:0,
    scan:function(node, noter){
        if(nodeRule.isFactor(node.nodeName)){
            this.recordFactor(node);
        }else if(node.childNodes){
            for (var i = 0; i < node.childNodes.length; i++) {
                noter.takeNote( node.childNodes[i] );
            }        
        }
        this.makeManifest();
        return this;
    },
    recordFactor:function(node){
        //open to external
        this.isFactor = true;
        this.nodeName = node.nodeName;
        switch(node.nodeName){
            case "INPUT"://text,hidden,radio,checkbox,password
                var type = node.getAttribute("type");
                switch(type){
                    case "radio":
                    case "checkbox":
                        this.checked = node.checked;
                        break;
                    default:
                        this.type = type || "text";
                        this.value = node.value||"";
                        break;
                }
                break;
            case "SELECT"://multiple
                this.type = "select";
                break;
            case "TEXTAREA":
                this.type = "textarea";
                break;
            case "#text"://button
                this.type="text";
                this.value=Util.trim(node.nodeValue);
                break;
            default:;
        }
        return this;
    },
    makeManifest:function(){
        if(this.isFactor){
            node.manifest = note.nodeName;
            this.high = 1;
        }else{
            for(var i=0;i<this.subNotes.length;i++){
                var subNote = this.subNotes[i];
                this.manifest = (this.manifest?this.manifest+"~":"")
                    +(subNote.summary||subNote.manifest);                                   
            }
        }

        if(nodeRule.isFactor(this.manifest)){
            this.summary = nodeRule.getManifest(this.manifest);
        }else if(nodeRule.isItem(this.manifest)){
            this.summary = nodeRule.ITEM;
        }else if(nodeRule.isGroup(this.manifest)){
            this.summary = nodeRule.GROUP;
        }else if(nodeRule.isPanel(this.manifest)){
            this.summary = nodeRule.PANEL;
        }           
        return this;
    },
    appendChild:function(note){
        note.depth = this.depth++;
        note.ctx.parent = this.ctx;
        this.subNotes.push(note);
    },
    appendChilds:function(notes){
        for (var i = 0; i < notes.length; i++) {
            this.appendChild(notes[i]);
        }
    },
    removeChild:function(note){
        for (var i = 0; i < this.subNotes.length; i++) {
            var subNote = this.subNotes[i];
            if(subNote == note){
                this.subNotes.splice(i, 1);
            }
        }
    }
};

module.exports = Note;

