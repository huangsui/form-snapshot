

"use strict";

const Snapshot = require('./../../snapshot');
const nodeRule = require('./../../note/note-rule.js');

var pr = new function(){
    this.name = "bank-panel-processor";

    this.afterScan = function(note, node, ctx){
        return /^ITEM(~ITEM)+$/g.test(note.manifest) || /^(TEXT~CARD)+$/g.test(note.manifest);
    }

    this.process= function(note, node, ctx){
        note.assign = this.name;
        
        if(/^ITEM(~ITEM)+$/g.test(note.manifest)){
            note.manifest = "CARD";
        }else if(/^(TEXT~CARD)$/g.test(note.manifest)){
            note.header = note.subNotes[0];
            note.body = note.subNotes[1];
            note.subNotes = null;
            note.manifest = "CARD";
        }else if(/^(TEXT~CARD)+$/g.test(note.manifest)){
            var _subNotes = note.subNotes;
            note.subNotes = [];
            for (var i = 0; i < _subNotes.length; i++) {
                var header =  _subNotes[i];
                var body = _subNotes[i+1];
                var newNote = {assign:this.name, header:header, body:body, manifest:"CARD"};
                note.subNotes.push(newNote);
                i++;
            }
            note.manifest = "CARDS";
        }
        
        return note;
    };

    this.convert = function(note) {
        var html = "";
        if(note.manifest == "CARDS"){
            html += '<div class="panel-group">';
            for (var i = 0; i < note.subNotes.length; i++) {
                var subNote = note.subNotes[i];
                html += this.convert(subNote);
            }
            html += '</div>';
        }else if(note.manifest == "CARD"){
            html += '<div class="panel panel-default">';
            if(note.header){
                html += '<div class="panel-heading" role="tab">';
                    html += '<h4 class="panel-title">';
                        html += note.header.value;
                    html += '</h4>';
                html += '</div>';
            }
            html += '<div class="panel-body">';
            if(note.body){
                for (var i = 0; i < note.body.subNotes.length; i++) {
                    var subNote = note.body.subNotes[i];
                    html += this.builder.work(subNote);
                }
            }else if(note.subNotes){
                for (var i = 0; i < note.subNotes.length; i++) {
                    var subNote = note.subNotes[i];
                    html += this.builder.work(subNote);
                }
            }
            html += '</div>';
            html += '</div>';
        }

        return html;
    };
}

Snapshot.cache(pr);
