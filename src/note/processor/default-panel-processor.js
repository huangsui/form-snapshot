

"use strict";

const Snapshot = require('./../../snapshot');
const nodeRule = require('./../../note/note-rule.js');

var pr = new function(){
    this.name = "default-panel-processor";

    this.afterScan = function(note, node, ctx){
    	var panel = note.ctx.closesd("s-panel");
    	if(panel){

    	}
        return panel || (note.manifest == nodeRule.PANEL);
    }

    this.process= function(note, node, ctx){
        note.assign = this.name;
        return note;
    };

    this.convert = function(note) {

        var html = "";
        html += '<div class="card">';
        html += '<div class="card-body">';
        //<h5 class="card-title">Card title</h5>
        for (var i = 0; i < note.subNotes.length; i++) {
            var subNote = note.subNotes[i];
            html += this.builder.work(subNote);
        }        
        html += '</div>'
        html += '</div>'

        return html;
    };
}

Snapshot.cache(pr);

