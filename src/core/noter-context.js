
"use strict";

const Cache = require('./../common/cache.js');
var ProcessContext = new function(){

    var aCache = new Cache();
    this.data = function(){
        return aCache.cache.apply(aCache, arguments);
    };

    
    this.closesd = function(key){
        if(typeof aCache.cache(key) === "undefined"){
            if(this.parent){
                return this.parent.closesd(key);
            }else{
                return undefined;
            }
        }
        return aCache.cache(key);
    };

    var parents = [];
    this.getParent = function(){
        return parents[parents.length - 1];
    }
    this.popParent = function(){
        return parents.pop();
    }
    this.pushParent = function(note){
        parents.push(note);
        return this;
    }
    this.getRoot = function(){
        return parents.length==0?null:parents[0];
    }

};

module.exports = ProcessContext;

