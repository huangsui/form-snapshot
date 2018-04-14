

"use strict";

const Cache = require('./../common/cache.js');

var HtmlFactory = function(){

	var convertors = new Cache();
	this.convert = function(arg, ctx){
		if(!arg){
            throw "convert param is required.";
        }else if(arg instanceof Array){
            return this.convertArray.call(this, arg, ctx);
        }

        if(!ctx || !ctx.root){
            ctx = {root:arg};
        }

        var html = "", note = arg;
        if(note.assign){
            var cvt = convertors.cache(note.assign);
            html = cvt.convert(note, ctx);
        }


        if( note.manifest == "GROUP" || note.subNotes){
            ctx.parent = note;
            html += this.convert(note.subNotes, ctx);
            //ctx.parent is dirty here.
        }      

        return html;
	}

	this.convertArray = function(arr, ctx){
        var html = "";
        for (var i = 0; i < arr.length; i++) {
            html += this.convert(arr[i], ctx);
        }
        return html;
    }

	this.equip = function(){
		convertors.cache.apply(convertors, arguments);
	}


}

module.exports = HtmlFactory;