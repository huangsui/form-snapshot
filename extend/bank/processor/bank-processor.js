
const Snapshot = require('../snapshot-core');

"use strict";

var pr = new function(){
    this.name = "bank-processor";

    this.matchNode = function(node, note, ctx){
        if(node.className == "fixed-table-body"){       //代理bootstrap-table
            return true;
        }
        if(node.nodeName == "SPAN"&& node.dir=="ltr"){  //代理select2下拉框
            return true;
        }
        if(typeof node=="object" && $(node).children().is('.checkbox-custom') && $(node).prev().get(0)){  //代理checkbox组(带label的组)
            if($(node).prev().get(0).nodeName=="LABEL" && $($(node).prev().get(0)).text()!==""){
                return true;
            }
        }
        if(typeof node.className=="string" && node.className.indexOf("ztree")>=0){          //代理树结构
            return true;
        }
        return false;
    };

    this.matchManifest = function(node, note, ctx){
        if(note.manifest=="!TEXT~SELECT"){
            return true;
        }
        if(note.manifest=="!TEXT~CHECKBOXES"){
            return true;
        }
        return false;
    };

    this.process= function(node, note, ctx){
        this.name = "bank-processor";
        if(node.className == "fixed-table-body"){
            var array=[];
            var array1=[];
            var $ths=$(node).find("tr").eq(0).find("th");
            for(var i=0;i<$ths.length;i++){
                array1.push($.trim($ths.eq(i).text()));
            }
            array.push(array1);
            var $trs=$(node).find("tr");
            for(var i=1;i<$trs.length;i++){
                var array2=[];
                var $tr = $trs.eq(i);
                var $tds = $tr.find("td");
                for(var j=0;j<$tds.length;j++){
                    var node=$tds.eq(j).children(":first").get(0);
                    if(node){
                        if(node.nodeName=="INPUT"){
                            array2.push($tds.eq(j).find("input").val());
                        }
                        if(node.nodeName=="SELECT"){
                            array2.push($tds.eq(j).find("select").find("option:selected").text());
                        }
                        if(node.nodeName=="A"){
                            var aString="";
                            var len=$tds.eq(j).find("a").length;
                            if(len>1){
                                for(var k=0;k<len;k++){
                                    aString+=$tds.eq(j).find("a").eq(k).text()+" ";
                                }
                            }else{
                                aString=$tds.eq(j).find("a").text();
                            }
                            array2.push(aString);
                        }
                        if(node.nodeName=="SPAN"){
                            array2.push($tds.eq(j).text());
                        }
                    }else {
                        array2.push($tds.eq(j).text());
                    }
                }
                array.push(array2);
            }
            note.value=array;
            note.nodeName="table";
            console.log(note);
        }
        if(node.nodeName == "SPAN"){
            ctx.pnote.nodeName="#select";
            ctx.pnote.attrs.value = $(node).find(".select2-selection__rendered").text();
            ctx.pnote.nodeType = "SELECT";
            this.name="";
        }
        if($(node).children().is('.checkbox-custom')){
            note.nodeName="#checkboxes";
            note.nodeType ="CHECKBOXES";
            note.subNotes=[];
            var $checkboxes=$(node).find(".checkbox-custom");
            for(var i=0;i<$checkboxes.length;i++){
                var checkbox={};
                checkbox.nodeName="#checkbox";
                checkbox.nodeType="checkbox";
                if($checkboxes.eq(i).find("input[type='checkbox']").attr('checked')){
                    checkbox.attrs={"checked":true,"value":$checkboxes.eq(i).find("label").text()};
                }else {
                    checkbox.attrs={"checked":false,"value":$checkboxes.eq(i).find("label").text()};
                }
                checkbox.manifest="CHECKBOX~TEXT";
                note.subNotes.push(checkbox);
            }
            // if(ctx.pnote.subNotes){
            //     if(ctx.pnote.subNotes[0].nodeType=="TEXT"){
                    ctx.pnote.manifest="!TEXT~CHECKBOXES";
            //     }
            // }
        }
        if(node.className.indexOf("ztree")>=0){
            note.nodeName="#ztree";
            var treeObj = $.fn.zTree.getZTreeObj(node.id);
            // var nodes = treeObj.transformToArray(treeObj.getNodes());
            note.attrs.value = treeObj.getNodes();
            note.nodeType = "ZTREE";
            note.manifest="ZTREE";
        }
        note.assign = this.name;
        return note;
    };
}

Snapshot.register(pr);

