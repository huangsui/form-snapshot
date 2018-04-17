

"use strict";

const Util = require('../common/util.js');

/*
FACTOR = TEXT|INPUTS
ITEM = TEXT~INPUTS    //grade = 1, inputType
CARD = ITEM(~ITEM)+  //grade = 2
CARD = TEXT~CARD      //grade>2
CARD = CARD(~CARD)+     ////grade>2
*/
const ManifestFactors = ["TEXT", "INPUTS"];
const NodeNameFacotrs = ["#text","SELECT","INPUT","TEXTAREA"];
const ManifestMapping = {"#text":"TEXT","SELECT":"INPUTS","INPUT":"INPUTS", "TEXTAREA":"INPUTS"};

var NoteRule = new function(){

	this.TEXT="TEXT";
	this.INPUTS="INPUTS";
	this.ITEM="ITEM";
	this.CARD="CARD";

    const GRADE = {
        "TEXT":"0",
        "INPUTS":"0",
        "ITEM":"1",
        "CARD":"2"
    }

    this.isNodeNameFactor = function(nodeName){
        return NodeNameFacotrs.indexOf(nodeName)!=-1;
    };
    this.isFactor = function(manifest){
    	return ManifestFactors.indexOf(manifest)!=-1;
    };
    this.isItem = function(manifest){
    	return /^TEXT~INPUTS$/g.test(manifest) || /^INPUTS~TEXT$/g.test(manifest);
    };
    this.isCARD = function(manifest){
    	return /^ITEM(~ITEM)+$/g.test(manifest);
    };
    
    this.getManifest = function(factor){
    	return ManifestMapping[factor];
    };
    this.getGrade = function(manifest){
        return GRADE[manifest]||-1;
    };


}

module.exports = NoteRule;

