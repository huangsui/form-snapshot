

"use strict";

const Snapshot = require('./../../snapshot');
const nodeRule = require('./../../note/note-rule.js');

var pr = new function(){
    this.name = "default-cards-processor";

    this.afterScan = function(note, node, ctx){
        return /^(TEXT~CARD)+$/g.test(note.manifest);
    }

    this.process= function(note, node, ctx){
        note.assign = this.name;
        note.manifest = "CARDS";
        return note;
    };

    this.convert = function(note) {
        var html = "";
        html += '<div class="card">';
        html += '<div class="card-body">';
        for (var i = 0; i < note.subNotes.length; i++) {
            //
            var subNote = note.subNotes[i];
            html += this.builder.work(subNote);
        }        
        html += '</div>'
        html += '</div>'

        return html;
    };
}

Snapshot.cache(pr);

