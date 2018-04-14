
"use strict";

const NoteContext = require('./note-context.js');
const Util = require('../common/util.js');

var Note = function(node){

    this.init(node);
    this.baseInfo(node);
    this.parent = null;
    this.depth = 0;
    this.ctx = new NoteContext();

    this.createSubNote = function(node){
        var note = new Note(node);
        //note.parent = this;
        note.depth = this.depth + 1;
        note.ctx = new NoteContext();
        note.ctx.parent = this.ctx;
        return note;
    }

}

Note.prototype = {
    constructor:Note,
    hierarchy:0,
    init:function(node){
        this.nodeName = node.nodeName;
        return this;
    },
    baseInfo:function(node){
        this.attrs = {};
        //factor: 0|1，文本和各输入框为快照基本因子
        switch(node.nodeName){
            case "INPUT"://text,hidden,radio,checkbox,password
                var iptType = node.getAttribute("type");
                iptType = iptType||"TEXT";
                this.nodeType="INPUTS:"+iptType.toUpperCase();
                if(iptType=="checkbox" || iptType=="radio"){
                    if(node.checked)this.attrs.checked = node.checked;
                }else{
                    this.attrs.value = node.value||"";
                }
                
                break;
            case "SELECT"://multiple
                this.nodeType="INPUTS:SELECT";
                break;
            case "TEXTAREA":
                this.nodeType="INPUTS";
                break;
            case "#text"://button
                this.nodeType="TEXT";
                this.attrs.value=Util.trim(node.nodeValue);
                break;
            default:;
        }
        return this;
    },
    makeManifest:function(node, ctx){
        if(!this.subNotes || this.subNotes.length == 0){
            this.manifest = this.nodeType;
            this.hierarchy = 1;
            return this;
        }

        if(node.nodeName == "TEXTAREA"){
            this.manifest = "INPUTS";
        }

        if(!this.manifest){
            for(var i=0;i<this.subNotes.length;i++){
                var subNote = this.subNotes[i];
                this.hierarchy = Math.max(subNote.hierarchy+1, this.hierarchy);
                if(subNote.assign){
                    this.manifest = "GROUP";
                    break;
                }else{
                    this.manifest = (this.manifest?this.manifest+"||":"!")+subNote.manifest; 
                }                                   
            }
        }            

        var idx = Math.min(this.hierarchy, 5)-2;
        this.manifest=this.manifest.replace(/\|\|/g,["~","~~","~~~","~~~~","~~~~~"][idx]);

        return this;
    },
    appendChild:function(arg){
        this.subNotes = this.subNotes || [];
        if(arg instanceof Array ){
            this.subNotes = this.subNotes.concat(arg);
        }else{
            this.subNotes.push(arg);
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

