
const Snapshot = require('../../snapshot');

"use strict";

var pr = new function(){
    this.name = "bank-other-processor";

    this.beforeScan = function(note, node, ctx){
        if(typeof node=="object" && $(node).children().is('.checkbox-custom') && $(node).prev().get(0)){  //代理checkbox组(带label的组)
            if($(node).prev().get(0).nodeName=="LABEL" && $($(node).prev().get(0)).text()!==""){
                note.assign = this.name;
                note.manifest = "INPUT";

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
                ctx.pnote.manifest="!TEXT~CHECKBOXES";
            }
        }


        if(typeof node.className=="string" && node.className.indexOf("ztree")>=0){          //代理树结构
            note.assign = this.name;
            note.manifest = "ITEM";

            note.nodeName="#ztree";
            var treeObj = $.fn.zTree.getZTreeObj(node.id);
            // var nodes = treeObj.transformToArray(treeObj.getNodes());
            note.value = treeObj.getNodes();
            note.nodeType = "ZTREE";
            note.manifest="ZTREE";
        }
        return note;
    };


    this.convert= function(note,ctx){
        var i=6,j=4,k=8;
        /*if(Number(note.attrs.width*2)>Number(ctx.root.attrs.width)){
            i=12;
            j=2;
            k=10;
        }*/

        if(note.manifest=="!TEXT~CHECKBOXES"){
            var html = "<div  class=\"form-group col-md-"+i+"\">";

            var item1 = note.subNotes[0], item2 = note.subNotes[1];
            html += "<label for='' >"+item1.attrs.value+"</label>";

            if(item2.nodeType=="CHECKBOXES"){
                for(var i=0;i<item2.subNotes.length;i++){
                    if(item2.subNotes[i].manifest=="CHECKBOX~TEXT"){
                        html += "<input type='checkbox' disabled='disabled'"+(item2.subNotes[i].attrs.checked?"checked":"")+"/><label class='cursor-hand'>"+node2Html(item2.subNotes[i].attrs.value)+"</label>";
                    }
                }
            }

            html +="</div>";
        }else if(note.nodeType=="ZTREE"){
            var html = '<div class="zTreeDemoBackground left">' +
                    '<ul id="tree" class="ztree menu-right-tree"></ul>' +
                '</div>';
            var setting = {
                view: {
                    selectedMulti: false
                },
                check: {
                    enable: true,
                    chkDisabledInherit: true
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    onCheck: onCheck,
                    onExpand:onExpand
                }
            };
            var zNodes =[];

            note.value.map(function (item) {
                item.chkDisabled=true;
                return item;
            });
            zNodes=note.value;
            setTimeout(function(){
                $.fn.zTree.init($("#tree"), setting, zNodes);
            },0);
        }else{
            html="";
        }

        return html;
    };

    function node2Html(value){
        if(typeof value=="string" && $.trim(value)=="请选择"){
            value="";
        }
        return value;
    }
}

Snapshot.cache(pr);

