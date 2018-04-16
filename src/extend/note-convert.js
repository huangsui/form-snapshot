

"use strict";

const Cache = require('./../common/cache.js');

var HtmlFactory = function(){

	var convertors = new Cache();
	this.convert = function(arg, convertor){
		if(!arg){
            throw "convert param is required.";
        }else if(arg instanceof Array){
            return this.convertArray.call(this, arg, convertor);
        }

        var html = "", note = arg;
        if(note.assign){
            var cvt = convertors.cache(note.assign);
            html = cvt.convert(note, convertor);
        }

        return html;
	}

	this.convertArray = function(arr, convertor){
        var html = "";
        for (var i = 0; i < arr.length; i++) {
            html += this.convert(arr[i], convertor);
        }
        return html;
    }

	this.equip = function(){
		convertors.cache.apply(convertors, arguments);
	}


}

module.exports = HtmlFactory;