
"use strict";

const Cache = require('./common/cache.js');
var ssContext = new function(){

    this.cfg = {};

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




};

module.exports = ssContext;

