
"use strict";

var Cache = function(){
	var caches = {};
    this.cache = function(){
        if(arguments.length==0){
            throw "arguments length must be greater then 0.";
        }
        if(arguments.length==1){
            if(typeof arguments[0] == "string"){
                return caches[arguments[0]];
            }else if(arguments[0] && arguments[0].name){
                caches[arguments[0].name] = arguments[0];
            }
        }else if(arguments.length==2){
            caches[arguments[0]] = arguments[1];
        }
    }
};

module.exports = Cache;
