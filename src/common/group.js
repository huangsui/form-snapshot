
"use strict";

var Group = function(){
	var group = [];
    var groupMap = {};
    this.length = 0;

    this.get = function(idx){
        return group[idx];
    }
    this.push = function(object){
        group.push(object);
        this.length++;
    }
    this.pushWithName = function(){
        if(arguments.length==2){
            this.push(arguments[1]);
            groupMap[arguments[0]] = arguments[1];
        }else if(arguments.length==1 && arguments[0].name){
            this.push(arguments[0]);
            groupMap[arguments[0].name] = arguments[0];
        }else{
            throw "pleace check your arguments.";
        }
        return this;
    }
    this.getByName = function(name){
        return groupMap[name];
    }

};

module.exports = Group;
