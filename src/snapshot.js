

/**
 * 工单快照核心组件（由描述器，解析器，组装器构成）
 * 描述器：节点描述
 * 解析器：节点解析和识别
 * 组装器：依赖描述器和解析器，提供Json和html相关获取和转换接口
 *
 */

//类删除操作：获取表格标题和当前行数据进行工单展示
//非直接展示的数据：比如通过鼠标悬浮查看或者通过点击进行编辑展示

( function ( global, $ ) {

    "use strict"

    const JSON_VERSION = "1.0.0";/*json数据版本*/
    const VERSION = "1.0.0";/*版本*/

    /**
     * 节点分类：可输入类元素 INPUTS, 文本节点 TEXT, 容器 CONTAINER, 其他 OTHER
     *     INPUTS：用户可输入类元素，包括input, select, textarea
     *     TEXT：文本节点
     *     CONTAINER：容纳以上类型节点的节点
     *     OTHER：其他节点
     * @type {string}
     */
    const CNR="CONTAINER", INP="INPUTS", TXT="TEXT", OTR="OTHER";


    /*描述器工厂：1、创建描述器，2、基本信息，3、生成货单*/
    var DescFactory = new function () {

        var Descriptor = function () {
            this.append=function(item){
                this.items = this.items||[];
                if(item.type!=OTR){//丢弃OTHER类型的节点
                    this.items.push(item);
                }
            }
        }

        this.init = function ( node, ctx ) {
            var desc = new Descriptor();
            /*
             http://www.w3school.com.cn/jsref/prop_node_nodetype.asp
             nodeType 属性返回以数字值返回指定节点的节点类型。
             如果节点是元素节点，则 nodeType 属性将返回 1。
             如果节点是Text节点，则 nodeType 属性将返回 3。
             */
            if(node.nodeType==1){
                if(!$(node).is(":visible")){
                    desc.visible = false;
                }
            }else if(node.nodeType==3){
                if(/(^\s*$)/.test(node.nodeValue) ){//换行符
                    desc.type=OTR;
                }
            }

            if(!desc.type){
                switch(node.nodeName){
                    case "INPUT":
                    case "SELECT":
                    case "TEXTAREA":
                        desc.type=INP;
                        break;
                    case "#text":
                        desc.type=TXT;
                        break;
                    case "script":
                        desc.type=OTR;
                        break;
                    default:;
                }
            }

            if(!desc.type && node.hasChildNodes()){
                desc.type=CNR;
            }

            if(!desc.type){
                desc.type=OTR;
            }

            return desc;
        }

        this.baseInfo=function (desc, node) {
            desc.nodeAttrs = {};
            switch(node.nodeName){
                case "INPUT"://text,hidden,radio,checkbox,password
                    desc.nodeAttrs.type=node.getAttribute("type") || "text"; // null
                    desc.nodeAttrs.name=node.getAttribute("name");
                    desc.nodeAttrs.value=trim(node.value);
                    var readonly;
                    if(readonly=node.getAttribute("readonly")){
                        desc.nodeAttrs.readonly=readonly;
                    }
                    break;
                case "SELECT"://multiple
                    desc.nodeAttrs.value=node.value;
                    desc.nodeAttrs.name=node.getAttribute("name");
                    //options
                    break;
                case "TEXTAREA":
                    desc.nodeAttrs.value=node.value;
                    desc.nodeAttrs.name=node.getAttribute("name");
                    break;
                case "#text"://button
                    desc.nodeAttrs.value=trim(node.nodeValue);
                    break;
                default:;
            }
            desc.nodeName=node.nodeName;
            return desc;
        };

        this.manifest=function (desc, node) {

            desc.level = 1;
            switch(desc.type){
                case INP:
                    //desc.manifest = INP+":"+desc.nodeAttrs.type;
                    desc.manifest = INP;
                    break;
                case TXT:
                    desc.manifest = TXT;
                    break;
                case CNR:
                    break;
                case OTR:
                    desc.manifest = OTR;
                    break;
                default:
                    throw "node type not exist!";
            }

            if(desc.type == CNR){
                if(desc.items.length==0){
                    desc.type = OTR;
                }else if(desc.items.length==1){
                    desc=desc.items[0];
                    desc.peel=desc.peel||0;
                    desc.peel++;
                }else{
                    for(var i=0;i<desc.items.length;i++){
                        var item = desc.items[i];
                        if(item.level>=desc.level){
                            desc.level = item.level+1;
                        }
                        if(!item.manifest){
                            throw "Exception: item's manifest undefined!";
                        }
                        desc.manifest = (desc.manifest?desc.manifest+"||":"")+item.manifest;
                    }
                }
            }

            if(desc.level>1){
                var idx = Math.min(desc.level, 6)-2;
                desc.manifest=desc.manifest.replace(/\|\|/g,["~","~~","~~~","~~~~","~~~~~"][idx]);
            }

            return desc;
        }
    }

    /*缺省解析器*/
    var DefaultParser = function(options){
        this.name = "default_parser";

        this.preJudge=function (desc, node) {
            if(desc.assign)return;
            if($(node).hasClass("btn")){//过滤按钮
                desc.type="OTHER";
            }
        }
        
        this.postJudge=function (desc, node) {
            if(desc.assign)return;
            if(desc.level>3){
                return;
            }
            normalize(desc, node);

            if(desc.manifest=="TEXT~INPUTS" || /^TEXT~+INPUTS~+INPUTS$/.test(desc.manifest) ){
                desc.assign = this.name;
                desc.manifest="formitem";
                desc.level=1;
            }

        }
        
        this.toJson=function (desc) {
            //console.log(desc);
            if(desc.assign != this.name)return;
            var json = {type:"formitem", assign:this.name, items:[]};
            for (var i = 0; i < desc.items.length; i++) {
                var item = desc.items[i];
                var itemJson = {nodeName:item.nodeName, attrs:item.nodeAttrs};
                json.items.push(itemJson);
            }
            return json;
        }

        function normalize(desc, node) {
            if(desc.manifest=="TEXT~TEXT"){
                if(desc.items[0].value=="*"){
                    desc.items[1].required=true;
                    desc.items.shift();
                }
                desc=desc.items[1];
                desc.manifest="TEXT";
            }

        }

        function attrs2html(attrs){
            var attrString = " ";
            for (var name in attrs) {
                attrString += (name + "='" + attrs[name]+"' ");
            }
            return attrString;
        }

        this.toHtml=function(json, callback){
            var html = "<div  class=\"form-group col-md-12\">";
            var item1 = json.items[0], item2 = json.items[1];
            html += "<label for='' >"+item1.attrs.value+"</label>";
            switch(item2.nodeName){
                case "INPUT":
                    html += "<input id='' class='form-control' class=\"form-control\" "+attrs2html(item2.attrs)+"/>";
                    break;
                case "SELECT":
                    html += "<select class='form-control' class=\"form-control\" "+attrs2html(item2.attrs)+"></select>";
                    break;
                case "TEXTAREA":
                    html += "<textarea class='form-control' class=\"form-control\">"+item2.attrs.value+"</textarea>";
                    break;
                default:
                    throw "nodeName is unknown!" + item2.nodeName;
            }

            html +="</div>";

            return html;
        }
    }


    const TRACK = {STAGE_1:"1", STAGE_2:"2", STAGE_3:"3"};

    /*组装生产快照Json*/
    var Assembler = function ( context ) {
        var _desc, _json;
        this.ctx = context;
        // 生成描述对象
        this.load = function( node ){
            _desc = track( node, this.ctx );
            return this;
        };

        this.getDesc = function(){
            return _desc;
        };

        this.setJson = function(json){
            _json = json;
            return this;
        };

        this.toJson = function() {
            if(!_desc){
                throw "未加装目标结点！";
            }
            _json = desc2Json(_desc);
            $.extend(_json, {assign:"root_parser", type:"root", version:JSON_VERSION});
            return _json;
        }

        function desc2Json(desc){
            var json;
            if(desc.assign){
                json = ParserManager.getParser(desc.assign).toJson(desc, desc2Json);
            }else if(desc.type == CNR){
                json={type:desc.type, nodeName:desc.nodeName, items:[]};
                for (var i = desc.items.length - 1; i >= 0; i--) {
                    var subDesc = desc.items[i];
                    json.items.push(desc2Json(subDesc));
                }
            }else{
                json={type:desc.type, nodeName:desc.nodeName, attrs:desc.nodeAttrs};
            }
            return json;
        }

        this.toHtml = function(){
            if(!_json){
                throw "Json未生成，需先执行desc2Json方法，或设置用来转换的Json";
            }
            var html = json2Html(_json);
            return html;
        };

        function json2Html(json){
            var html = "";
            if(json.assign){
                html = ParserManager.getParser(json.assign).toHtml(json, json2Html);
            }else if(json.type==CNR || json.type == "root"){
                html += " ";
                for (var i = json.items.length - 1; i >= 0; i--) {
                    var itemJson = json.items[i];
                    html += json2Html(itemJson);
                }
                html += " ";
            }
            return html;
        }

        /*track: init desc -> preJudge -> baseInfo -> track child-> beforeManifest -> manifest -> postJudge*/
        function track( node , ctx ) {

            var desc = DescFactory.init( node, ctx );
            /*
             * preJudge
             * 遍历所有Parser的preJudge方法
             * 如果返回desc对象，那么终止遍历
             * 遍历完成时，如果desc对象带有assign属性，那么终止后续逻辑
             */
            var parsers = ParserManager.getParsers(TRACK.STAGE_1);
            for (var i = parsers.length - 1; i >= 0; i--) {
                var _desc1 = parsers[i].preJudge(desc, node);
                if(_desc1){
                    desc = _desc1;
                    break;
                }
            }

            if(desc.assign){//交由指定解析器处理
                return desc;
            }

            /*记录基本信息*/
            DescFactory.baseInfo(desc, node);

            /*有子节点时，递归遍历子节点*/
            if(desc.type==CNR){
                for(var i=0;i<node.childNodes.length;i++){
                    var item = track( node.childNodes[i], ctx );
                    desc.append(item);
                }
            }

            /*
             * beforeManifest
             * 遍历所有Parser的beforeManifest方法
             * 如果返回desc对象，那么终止遍历
             * 遍历完成时，如果desc对象带有assign属性，那么终止后续逻辑
             */
            parsers = ParserManager.getParsers(TRACK.STAGE_2);
            for (var i = parsers.length - 1; i >= 0; i--) {
                var _desc2 = parsers[i].beforeManifest(desc, node);
                if(_desc2){
                    desc = _desc2;
                    break;
                }
            }
            if(desc.assign){//交由指定解析器处理
                return desc;
            }
            /*标记manifest*/
            desc = DescFactory.manifest(desc, node);

            /*
             * postJudge
             * 遍历所有Parser的postJudge方法
             * 如果返回desc对象，那么终止遍历
             */
            parsers = ParserManager.getParsers(TRACK.STAGE_3);
            for (var i = parsers.length - 1; i >= 0; i--) {
                var _desc3 = parsers[i].postJudge(desc, node);
                if( i==0 ){
                    // console.log("after",desc.assign,node);
                }
                if(_desc3){
                    desc = _desc3;
                    break;
                }
            }
            return desc;
        }
    };

    var ParserManager = new function () {

        var parsers = {};
        var parsersOfStage1=[];
        var parsersOfStage2=[];
        var parsersOfStage3=[];

        this.register=function (define, parser) {
            parsers[define]=parser;
            if(parser.preJudge){
                parsersOfStage1.push(parser);
            }
            if(parser.beforeManifest){
                parsersOfStage2.push(parser);
            }
            if(parser.postJudge){
                parsersOfStage3.push(parser);
            }
            return this;
        }

        this.getParser=function (define) {
            return parsers[define];
        }

        this.getParsers=function (stage) {
            switch(stage){
                case TRACK.STAGE_1:
                    return parsersOfStage1;
                case TRACK.STAGE_2:
                    return parsersOfStage2;
                case TRACK.STAGE_3:
                    return parsersOfStage3;
            }
        }

    };

    function trim(x) {
        return x.replace(/^\s+|\s+$/gm,'');
    }

    var Snapshot = function( options ) {
        return this.init( options );       
    };

    Snapshot.fn = Snapshot.prototype = {
        version: VERSION,
        constructor: Snapshot,
        init: function( options ){
            this.ctx = { maxDepth:10, isVisible:true };
            if( options ){
                this.ctx.isVisible = options.isVisible;
            }
            this.assembler = new Assembler(this.ctx);
            return this;
        },
        takeSnap: function( selector ){
            return this.assembler.load($(selector)[0]).toJson();
        },
        //for parser
        register: function( ){
            for (var i = 0; i < arguments.length; i++) {
                var parser = arguments[i];
                ParserManager.register( parser.name, parser );
            }
            return this;
        },
        resolve: function( json ) {
            return new Assembler().setJson( json ).toHtml();
        }
    }

    Snapshot.descFactory = DescFactory;
    global.Snapshot = Snapshot;
    Snapshot.defaultParser = new DefaultParser();

    if ( typeof define === "function" && define.amd ) {
        define( "Snapshot", [], function() {
            return Snapshot;
        } );
    }

    if(typeof module !== "undefined"){
        module.exports = Snapshot;
    }

})( typeof window !== "undefined" ? window : this, jQuery );




