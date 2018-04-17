
"use strict";

const Util = require('../common/util.js');
const NoteContext = require('./note-context.js');
const nodeRule = require('./note-rule.js');

var Note = function(node){

    this.parent = null;
    this.subNotes = [],
    this.depth = 0;
    this.ctx = new NoteContext();

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
        if(nodeRule.isNodeNameFactor(node.nodeName)){
            this.recordFactor(node);
        }else if(node.childNodes){
            for (var i = 0; i < node.childNodes.length; i++) {
                var subNote = noter.createNote(node.childNodes[i]);
                this.appendChild(subNote);
                var result = noter.work( node.childNodes[i], subNote );
                if(!result){
                    this.removeChild(subNote);
                }
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
                    case "button":
                    case "submit":
                    case "reset":
                    case "file":
                        this.isFactor = false;
                        this.isInvalid = true;
                        break;
                    default:
                        this.value = node.value||"";
                        break;
                }
                this.type = type || "text";
                break;
            case "SELECT"://multiple
                this.type = "select";
                this.value = $(node).val();
                this.textValue = $(node).find("option:selected").text();
                //options
                break;
            case "TEXTAREA":
                this.type = "textarea";
                this.textValue = $(node).val();
                this.rows = $(node).attr("rows");
                this.cols = $(node).attr("cols");                
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
            this.manifest = nodeRule.getManifest(this.nodeName);
            this.grade = 0;
        }else if(!this.isInvalid){
            for(var i=0;i<this.subNotes.length;i++){
                var subNote = this.subNotes[i];
                this.manifest = (this.manifest?this.manifest+"~":"")+subNote.manifest;                                   
            }
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

