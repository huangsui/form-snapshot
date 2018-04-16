

"use strict";

const Snapshot = require('./../../snapshot');
const nodeRule = require('./../../note/note-rule.js');

var pr = new function(){
    this.name = "default-item-processor";

    this.afterScan = function(note, node, ctx){
        return note.manifest == nodeRule.ITEM;
    }

    this.process= function(note, node, ctx){
        note.assign = this.name;
        return note;
    };

    this.convert = function(note) {
    	var subNote1 = note.subNotes[0];
    	var subNote2 = note.subNotes[1];

        var html = "";
    	html += '<p>';
    	if(subNote1.type == "checkbox" || subNote1.type == "radio"){
			html += "<input type='"+subNote1.type+"'/> ";
	        html += '<label for="input">';
	    	html += subNote2.value;
	    	html += '</label>';
    	}else{
    		html += '<label for="input">';
	    	html += subNote1.value;
	    	html += '</label>';
    		if (/^INPUT$/g.test(subNote2.nodeName)) {
	        	html += '<input type="text" value="'+subNote2.value+'">';
	        }else if(/^SELECT$/g.test(subNote2.nodeName)){
	        	html += '<select><option value="'+subNote2.value+'">'+subNote2.textValue+'</option></select>';
	        }else if(/^TEXTAREA$/g.test(subNote2.nodeName)){
                html += '<textarea '+((subNote2.rows)?(' rows="'+subNote2.rows+'" '):'')+'>'+subNote2.textValue+'</textarea>';
            }else{
	        	html += '<input type="text" value="'+subNote2.value+'">';
	        }
    	}

        html += '</p>'
        return html;
    };
}

Snapshot.cache(pr);

