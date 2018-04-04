/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	
	"use strict";

	__webpack_require__(1);

	__webpack_require__(10);
	__webpack_require__(11);





/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	
	"use strict";

	__webpack_require__(2);
	__webpack_require__(3);

	//--- Configurable behind here ---
	__webpack_require__(4);
	__webpack_require__(5);

	__webpack_require__(6);
	__webpack_require__(7);
	__webpack_require__(8);
	__webpack_require__(9);



/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

	/**
	 * 表单快照核心组件
	 * 
	 * Note: 便签，记录节点相关信息
	 * Filter：过滤器，对每个节点扫描前进行过滤 
	 * ProcessContext：上下文，节点处理时提供上下文信息
	 * Manifest：货单，简单的节点描述规则，方便识别
	 * 
	 * !!TEXT~INPUTS~~!TEXT~INPUTS
	 *  
	 * 标签前缀：ss-
	 * 
	 */

	( function ( global, $ ) {

	    "use strict"

	    const VERSION = "1.0.0";/*版本*/

	    var that = this;

	    var NoteFactory = new function(){
	        this.create = function(node, ctx){
	            var note = new Note().init(node).baseInfo(node);
	            note.depth = ctx.depth();
	            return note;
	        }
	    };

	    var Note = function(){
	    }

	    Note.prototype = {
	        constructor:Note,
	        depth:1,
	        hierarchy:0,
	        init:function(node){
	            this.nodeName = node.nodeName;
	            return this;
	        },
	        baseInfo:function(node){
	            this.attrs = {};
	            //factor: 0|1，文本和各输入框为快照基本因子
	            switch(node.nodeName){
	                case "INPUT"://text,hidden,radio,checkbox,password
	                    var iptType = node.getAttribute("type");
	                    iptType = iptType||"TEXT";
	                    this.nodeType="INPUTS:"+iptType.toUpperCase();
	                    if(iptType=="checkbox" || iptType=="radio"){
	                        if(node.checked)this.attrs.checked = node.checked;
	                    }else{
	                        this.attrs.value = node.value||"";
	                    }
	                    
	                    break;
	                case "SELECT"://multiple
	                    this.nodeType="INPUTS:SELECT";
	                    break;
	                case "TEXTAREA":
	                    this.nodeType="INPUTS";
	                    break;
	                case "#text"://button
	                    this.nodeType="TEXT";
	                    this.attrs.value=trim(node.nodeValue);
	                    break;
	                default:;
	            }
	            return this;
	        },
	        makeManifest:function(node, ctx){
	            if(!this.subNotes || this.subNotes.length == 0){
	                this.manifest = this.nodeType;
	                this.hierarchy = 1;
	                return this;
	            }

	            if(node.nodeName == "TEXTAREA"){
	                this.manifest = "INPUTS";
	            }

	            if(!this.manifest){
	                for(var i=0;i<this.subNotes.length;i++){
	                    var subNote = this.subNotes[i];
	                    this.hierarchy = Math.max(subNote.hierarchy+1, this.hierarchy);
	                    if(subNote.assign){
	                        this.manifest = "GROUP";
	                        break;
	                    }else{
	                        this.manifest = (this.manifest?this.manifest+"||":"!")+subNote.manifest; 
	                    }                                   
	                }
	            }            

	            var idx = Math.min(this.hierarchy, 5)-2;
	            this.manifest=this.manifest.replace(/\|\|/g,["~","~~","~~~","~~~~","~~~~~"][idx]);

	            return this;
	        },
	        appendChild:function(arg){
	            this.subNotes = this.subNotes || [];
	            if(arg instanceof Array ){
	                this.subNotes = this.subNotes.concat(arg);
	            }else{
	                this.subNotes.push(arg);
	            }
	            
	        },
	        removeChild:function(note){
	            for (var i = 0; i < this.subNotes.length; i++) {
	                var subNote = this.subNotes[i];
	                if(subNote == note){
	                    this.subNotes.splice(i, 1);
	                }
	            }
	        }
	    };

	    function trim(x) {
	        return x.replace(/^\s+|\s+$/gm,'');
	    }

	    var ProcessContext = function(node, opts){
	        this.noteRoot = null;
	        this.pnote = null;
	        this.curNote = null;
	        this.opts = opts;
	        this.depth = function(){
	            if(this.pnote){
	                return this.pnote.depth+1;
	            }
	            return 1;
	        };
	        this.appendNote = function(note){
	            if(this.noteRoot == null){
	                this.noteRoot = note;
	            }else{
	                this.pnote.appendChild(note);
	            }            
	        };
	        this.removeNote = function(note){
	            this.pnote.removeChild(note);
	        }
	    }

	    var filterChain = {
	        filters:[],
	        curIdx:-1,
	        targetFn:null,
	        add:function(filter){
	            this.filters.push(filter);
	        },
	        resetIdx:function(){
	            this.curIdx = -1;
	        },
	        filter:function(){
	            this.curIdx++;
	            if(this.curIdx < this.filters.length){                
	                var result = this.filters[this.curIdx].filter(arguments, this);
	                return result;
	            }else{
	                return this.invoke.apply(this, arguments);
	            }            
	        },
	        invoke:function(){
	            var result = this.targetFn.apply(this, arguments);
	            return result;
	        },
	        weave:function(fn){
	            this.targetFn = fn;
	            //节点为树状结构，遍历节点过程为递归式嵌套，过滤器链也在递归中被嵌套
	            return function(){
	                //过滤器链每次发起前进行下标重置
	                filterChain.resetIdx();
	                var result = filterChain.filter.apply(filterChain, arguments);
	                return result;
	            };
	        }
	    };

	    var through = function( node, note, ctx ) {
	        var result = note;
	        processorChain.reset();
	        while(processorChain.hashNext()){
	            var pr = processorChain.next();
	            if(pr.matchNode && pr.matchNode(node, note, ctx)){
	                result = pr.process(node, note, ctx);
	                return result;
	            }
	        }

	        if(node.childNodes.length>0){
	            var _pnote = ctx.pnote || ctx.noteRoot;
	            ctx.pnote = note;
	            for( var i=0; i<node.childNodes.length; i++ ){
	                var subNode = node.childNodes[i];
	                var subNote = NoteFactory.create(subNode, ctx);
	                result = through( subNode, subNote, ctx );
	                if(result){
	                    note.appendChild(result);
	                }               
	            }
	            ctx.pnote = _pnote;            
	        }

	        note.makeManifest(node, ctx);
	        
	        //有货单
	        processorChain.reset();
	        while(processorChain.hashNext()){
	            var pr = processorChain.next();
	            if(pr.matchManifest && pr.matchManifest(node, note, ctx)){
	                return pr.process(node, note, ctx);
	            }
	        }
	       
	        return note;            
	        
	    };

	    var Snapshot = function( options ) {

	        this.takeSnap = function( selector, opts ){
	            var node = $(selector)[0];
	            var pctx = new ProcessContext(node, opts);
	            var note = NoteFactory.create(node, pctx);
	            pctx.appendNote(note);
	            var result = through(node, note, pctx);
	            return result;
	        };

	        this.init( options );

	    };

	    var processorChain = {
	        chain:[],
	        curIdx:-1,
	        add:function(pr){
	            pr.init();
	            this.chain.push(pr); 
	        },
	        reset:function(){
	            this.curIdx = -1;
	        },
	        hashNext:function(){
	            return (this.curIdx+1) < this.chain.length;
	        },
	        next:function(){
	            return this.chain[++this.curIdx];
	        }        
	    };

	    var caches = {};
	    Snapshot.cache = function(){
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

	    var convertors = [];

	    Snapshot.register = function(){
	        for (var i = 0; i < arguments.length; i++) {
	            var arg = arguments[i];
	            if(typeof arg == "string"){
	                var m = Snapshot.cache(arg);
	                if(m){
	                    Snapshot.register(m);
	                }else{
	                    throw "Snapshot cannot find \""+arg+"\" in caches ";
	                }
	            }else if(arg.name.indexOf("-processor")>0){
	                processorChain.add(arg);
	            }else if(arg.name.indexOf("-filter")>0){
	                filterChain.add(arg);
	            }else if(arg.name.endsWith("-convertor")){
	                convertors.push(arg);
	            }else{
	                Snapshot.cache(arg);
	            }            
	        }
	        return this;
	    }

	    Snapshot.fn = Snapshot.prototype = {
	        version: VERSION,
	        constructor: Snapshot,
	        config: { maxDepth:10, isVisible:true },
	        init: function( options ){
	            this.config = this.config||{};
	            if( options ){
	                this.config.isVisible = options.isVisible;
	                this.config.convertType = options["convert-type"];
	            }
	            return this;
	        }
	    }


	    through = filterChain.weave(through);

	    
	    var convertArray = function(arr, ctx){
	        var html = "";
	        for (var i = 0; i < arr.length; i++) {
	            html += convert(arr[i], ctx);
	        }
	        return html;
	    }

	    var convert = function(arg, ctx){
	        if(!arg){
	            throw "convert param is required.";
	        }else if(arg instanceof Array){
	            return convertArray.call(this, arg, ctx);
	        }

	        if(!ctx || !ctx.root){
	            ctx = {root:arg};
	        }

	        var html = "", note = arg;
	        for (var i = 0; i < convertors.length; i++) {
	            var cvt = convertors[i];
	            if(cvt.match(note)){
	                html = cvt.convert(note, ctx);
	                break;
	            }
	        }

	        if( note.manifest == "GROUP" || note.subNotes){
	            ctx.parent = note;
	            html += convert(note.subNotes, ctx);
	            //ctx.parent is dirty here.
	        }      

	        return html;
	    };

	    Snapshot.convert = convert;
	    Snapshot.fn.convert = convert;
	    
	    global.Snapshot = Snapshot;

	    if ( true ) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
	            return Snapshot;
	        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    }

	    if(true){
	        module.exports = Snapshot;
	    }

	})( typeof window !== "undefined" ? window : this, jQuery );



/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * 基础过滤器
	 * 
	 * 辅助快照核心组件完成节点筛选
	 *  
	 */
	const Snapshot = __webpack_require__(2);

	"use strict";

	var filter = new function(){
	    this.name = "base-filter";
	    this.init = function(config){

	    };
	    /*
			http://www.w3school.com.cn/jsref/prop_node_nodetype.asp
			nodeType 属性返回以数字值返回指定节点的节点类型。
			如果节点是元素节点，则 nodeType 属性将返回 1。
			如果节点是Text节点，则 nodeType 属性将返回 3。
		*/
	    this.filter= function(args, filterChain){
	    	var node = args[0];
	    	var note = args[1];
	    	var ctx = args[2];

	        //换行符、空节点 直接跳过
	    	if(node.nodeType==3 && /(^\s*$)/.test(node.nodeValue)){
	            return;
	        }

	    	var result = filterChain.filter.apply(filterChain, args);

	        if(!result){
	            return result;
	        }
	        
	        //已委派
	        if(result.assign){
	            return result;
	        }
	        
	        //无货单，也无委派，进行丢弃
	        if(!result.manifest){            
	            //console.log("无效节点: "+result.nodeName);
	            return null;
	        }

	        //剥离空壳
	        if(result.manifest.startsWith("!") 
	            && result.subNotes.length == 1){
	            //console.log("剥离空壳: "+result.nodeName);            
	            return result.subNotes[0];
	        }

	        //未委派，但是有正常货单的情况，直接返回
	    	return result;            
	    };      
	}

	Snapshot.register(filter);




/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	const Snapshot = __webpack_require__(2);

	"use strict";

	var filter = new function() {
	    this.name = "default-filter";
	    this.init = function(config) {

	    };
	    /*
	        http://www.w3school.com.cn/jsref/prop_node_nodetype.asp
	        nodeType 属性返回以数字值返回指定节点的节点类型。
	        如果节点是元素节点，则 nodeType 属性将返回 1。
	        如果节点是Text节点，则 nodeType 属性将返回 3。
	    */
	    this.filter = function(args, filterChain) {
	        var node = args[0];
	        var note = args[1];
	        var ctx = args[2];

	        //过滤不可见节点
	        if (!ctx.opts || ctx.opts.visible !== false) {
	            if (node.nodeType == 1 && !$(node).is(":visible")) {
	                //console.log("过滤不可见节点: "+node.nodeName);
	                return;
	            }
	        }

	        if ($(node).data("ss-ignore")) {
	            console.log("过滤ignore节点: " + node.nodeName);
	            return;
	        }

	        var result = filterChain.filter.apply(filterChain, args);

	        return result;
	    };
	}

	Snapshot.cache(filter);

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	

	const Snapshot = __webpack_require__(2);

	"use strict";

	var filter = new function(){
	    this.name = "form-filter";
	    this.init = function(config){

	    };
	    /*
			http://www.w3school.com.cn/jsref/prop_node_nodetype.asp
			nodeType 属性返回以数字值返回指定节点的节点类型。
			如果节点是元素节点，则 nodeType 属性将返回 1。
			如果节点是Text节点，则 nodeType 属性将返回 3。
		*/
	    this.filter= function(args, filterChain){
	    	var node = args[0];
	    	var note = args[1];
	    	var ctx = args[2];

	        if(node.nodeType==1){//元素节点
	            note.attrs = note.attrs || {};
	            note.attrs.width = $(node).width();
	        }

	        //过滤*号
	        if(node.nodeName=="#text" && typeof node.nodeValue=="string" && $.trim(node.nodeValue)=="*"){
	            return;
	        }

	    	var result = filterChain.filter.apply(filterChain, args);

	        if(node.nodeName=="INPUT" && node.getAttribute("type").toUpperCase() == "PASSWORD"){
	            note.attrs = note.attrs || {};
	            note.textValue = "********";
	        }

	        //空壳继承宽度
	        if(result.subNotes && result.subNotes.length == 1){           
	            result.subNotes[0].attrs.width = note.attrs.width;
	            return result;
	        }
	    	return result;            
	    };      
	}

	Snapshot.cache(filter);




/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	

	"use strict";

	const Snapshot = __webpack_require__(2);

	var pr = new function(){
	    this.name = "form-processor";
	    this.init = function(config){

	    };

	    this.matchNode = function(node, note, ctx){
	        return false;
	    }

	    this.matchManifest = function(node, note, ctx){
	        if(/^!*TEXT~+INPUTS(\:TEXT|\:EMAIL|\:PASSWORD)?(~+TEXT)*$/g.test(note.manifest) ){
	            note.textValue = $(node).find("input").val();
	            return true;
	        }
	        if(/^!*TEXT~+INPUTS\:SELECT(~+TEXT)*$/g.test(note.manifest) ){
	            note.textValue = $(node).find("select").find("option:selected").text();
	            return true;
	        }        
	        if(/^!*(~*INPUTS\:(CHECKBOX|RADIO)~+TEXT)+$/g.test(note.manifest) ){
	            return true;
	        }
	        return false;
	    }

	    this.process= function(node, note, ctx){
	        note.assign = this.name;
	        return note;
	    };
	}

	Snapshot.cache(pr);



/***/ },
/* 7 */
/***/ function(module, exports) {

	//const Snapshot = require('../snapshot-core');

	"use strict";

	var convertor = new function() {
	    this.name = "form-convertor";
	    this.init = function(config) {

	    };

	    this.match = function(note) {
	        return note.assign == "form-processor";
	    }

	    this.convert = function(note, ctx) {
	        var i = 6,
	            j = 4,
	            k = 8;
	        if (Number(note.attrs.width * 2) > Number(ctx.root.attrs.width)) {
	            i = 12, j = 2, k = 10;
	        }

	        var html = "";

	        if (/^!*TEXT~+INPUTS(\:TEXT|\:EMAIL|\:PASSWORD|\:SELECT)?(~+TEXT)*$/g.test(note.manifest)) {
	            html = "<div class=\"form-group col-md-" + i + "\">";
	            var item1 = note.subNotes[0],
	                item2 = note.subNotes[1];
	            html += "<label for='' class='col-md-" + j + "'>" + item1.attrs.value + "</label>";
	            html += "<div class='col-md-" + k + "'>";
	            switch (item2.nodeName) {
	                case "INPUT":
	                    html += "<input class='form-control'";
	                    if(note.manifest.indexOf("PASSWORD")!=-1){
	                        html += " type='password' ";
	                    }
	                    html += " value=\"" + note.textValue + "\"/>";
	                    break;
	                case "SELECT":
	                    html += "<input class='form-control' value=\"" + note.textValue + "\"/>";
	                    break;
	                case "TEXTAREA":
	                    // html += "<textarea class='form-control' >"+item2.subNotes[0].attrs.value+"</textarea>";
	                    if (!!item2.subNotes) {
	                        html += "<textarea class='form-control' >" + item2.subNotes[0].attrs.value + "</textarea>";
	                    } else {
	                        html += "<textarea class='form-control' >" + attrs2html(item2.attrs.value) + "</textarea>";
	                    }
	                    break;
	                default:
	                    throw "nodeName is unknown!" + item2.nodeName;
	            }
	        } else if (/^!*(~*INPUTS\:(CHECKBOX|RADIO)~+TEXT)+$/g.test(note.manifest)) {
	            html = "<div class=\"col-sm-offset-1 form-group col-md-" + i + "\">";
	            for (var i = 0; i < note.subNotes.length; i++) {
	                var subNote = note.subNotes[i];
	                switch (subNote.nodeType) {
	                    case "TEXT":
	                        html += subNote.attrs.value;
	                        break;
	                    case "INPUTS:CHECKBOX":
	                        html += "<input type='checkbox' " + attrs2html(subNote.attrs) + "/> ";
	                        break;
	                    case "INPUTS:RADIO":
	                        html += "<input type='radio' " + attrs2html(subNote.attrs) + "/> ";
	                        break;
	                    default:
	                        throw "nodeType is unknown!" + subNote.nodeType;
	                }
	            }
	        }

	        html += "</div></div>";

	        return html;
	    };

	    function attrs2html(attrs) {
	        var attrString = " ";
	        for (var name in attrs) {
	            attrString += (name + "='" + attrs[name] + "' ");
	        }
	        return attrString;
	    }

	}

	Snapshot.cache(convertor);
	//module.exports = pr;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	
	const Snapshot = __webpack_require__(2);

	"use strict";

	var pr = new function(){
	    this.name = "table-processor";
	    this.init = function(config){

	    };

	    this.matchNode = function(node, note, ctx){
	        if(note.nodeName == "TABLE" || "table" == $(node).attr("ss-type")){
	            return true;
	        }
	        return false;
	    }

	    this.process= function(node, note, ctx){
	        note.assign = this.name;
	        var opts = ctx.opts;
	        var rows = [];
	        var table = node;

	        var thTexts = getRowText($(table).find("tr:first"));
	        rows.push(thTexts);

	        if(opts && opts.data ){//选择器操作（自定义多选框-selector，自定义行操作-selector/elem）
	            var tr=$( node ).find(opts.data).closest("tr");
	            if(tr.length == 0){
	                throw "cannt find tr";
	            }
	            rows.push( getRowText(tr) );
	        }else if(opts && opts.event && $(node).has(event.target)){//行操作
	            var tr = $(event.target).closest("tr");
	            if(tr.length == 0){
	                throw "cannt find tr";
	            }
	            rows.push( getRowText(tr) );
	        }

	        if(rows.length == 1){//常规多选框
	            var checkedTrs = $( table ).find("tr").has("input:checked");
	            if(checkedTrs){
	                for (var i = checkedTrs.length - 1; i >= 0; i--) {
	                    var tr = checkedTrs[i];
	                    rows.push(getRowText(tr));
	                }
	            }
	        }

	        if(rows.length == 1){
	            throw "have not got operated table records."
	        }

	        console.log(rows);
	        note.data=rows;
	        return note;
	    };
	}

	function getRowText(tr){
	    var tds = $(tr).find("td,th");
	    var texts = tds.map(function(){
	        return $(this).text();
	    }).get();

	    return texts;
	}

	Snapshot.cache(pr);



/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	

	const Snapshot = __webpack_require__(2);

	"use strict";

	var convertor = new function(){
	    this.name = "table-convertor";
	    this.init = function(config){

	    };

	    this.match = function(note){
	        return note.assign == "table-processor";
	    }

	    this.convert= function(note){

	        var html = '<table class="table table-bordered">';

	        html += '<thead>';
	        var ths = '';
	        for(var j=0;j<note.data[0].length;j++){
	            ths += '<th>' + note.data[0][j] + '</th>';
	        }
	        html += '<tr style="background-color: #F3F3F3;">' + ths + '</tr>';
	        html += '</thead>';

	        html += '<tbody>';
	        for(var i=1;i<note.data.length;i++){
	            var tds = '';
	            for(var j=0;j<note.data[i].length;j++){
	                tds += '<td>' + note.data[i][j] + '</td>';
	            }
	            html += '<tr>' + tds + '</tr>';
	        }
	        html += '</tbody>';
	        html += '</table>';
	        return html;
	    };
	    
	}

	Snapshot.cache(convertor);





/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	const Snapshot = __webpack_require__(2);

	"use strict";

	/**
	 * 发布前置：快照或者模板发布前处理
	 * 
	    opt:{
	        type:"ss|tpl",
	        target:"#form1",
	        data:{}|""//"td[recordId=10000]"|elem|tpl-data
	    }
	 */
	function beforePublish(opt) {
	    if (opt.type == "ss") {
	        if($(opt.target).length==0){
	            throw "can not find the element by \""+opt.target+"\".";
	        }
	        var result = new Snapshot().takeSnap(opt.target, opt);
	        return {
	            type: "ss",
	            version: Snapshot.version,
	            data: result
	        };
	    } else if (opt.type == "tpl") {
	        return {
	            type: "tpl",
	            version: Snapshot.version,
	            data: {
	                tpl: opt.target,
	                data: opt.data
	            }
	        };
	    } else {
	        throw "publish type is unknown.";
	    }
	}

	//tpl-consumer, ss-consumer
	function consume(ss) {
	    if (ss.type == "ss") {
	        var consumer = Snapshot.cache("ss-consumer");
	        if (!consumer) {
	            throw "please register ss-consumer first by Snapshot.";
	        }
	        return consumer.consume(ss.data);
	    } else if (ss.type == "tpl") {
	        var consumer = Snapshot.cache("tpl-consumer");
	        if (!consumer) {
	            throw "please register tpl-consumer first by Snapshot.";
	        }
	        return consumer.consume(ss.data.tpl, ss.data.data);
	    }
	}

	//请根据具体需求再次注册，即可覆盖该消费者
	Snapshot.register({
	    name: "ss-consumer",
	    consume: function(data) {
	        return Snapshot.convert(data);
	    }
	});

	/*
	 * 消费展示快照
	 */
	function _consume(serialNo, callback) {

	    var _ss = '{"type":"tpl","version":"1.0.0","tpl":"./tmpl/dsgj.art","data":{"relExaNo":"f7fac8dfab6f46e2b7ddae038b921a89","fdpAcctInfoDto":{"acctGenus":"11","acctKind":"01","acctType":"1","assetName":"小伙子有前途","assetRealNo":"12345678905678","assetUnit":"01","selfBal":2000,"startDate":"20170829","subProdCode":"11030300100000000004","upBal":0,"useBal":2000,"virUpBal":0},"fdpInterInfoDto":{"interType":"00","interCycle":"","interAssignFlag":""},"loanType":"0","fdpUpInfoDto":{"uType":"2","uCycleType":"1","uCycle":"2,3,2","uTime":"0:00","uTrgAmt":"10","uKeepAmt":"10","uMaxAmt":"100","uRule":"2","uPar":"0.1"},"fdpDownInfoDto":{"dType":"1","fdpPri":"1","dCycleType":"0","dCycle":",","dTime":"0:00,1:00","dRule":"2","dPar":"2","overUFlag":"0"},"bizSurtax":"","stampTax":"","bizTax":"","exceedLimit":"","fdpLoanDto":{"loanType":"0","bizSurtax":"","stampTax":"","bizTax":""}}}'
	    var ss = JSON.parse(_ss)

	    if (ss.type == 'tpl') {
	        callback(ss)
	    }

	    /*  在业务代码中 加入用于渲染的逻辑

	     var render = function(ss) {
	     var el = $('.workflow')
	     var tmpl = require('' + ss.tpl)
	     var data = ss.data
	     el.html(tmpl(data))

	     //transfer

	     }
	     var snapshot = new Snapshot()
	     snapshot.consume(serialNo, render)
	     */


	}

	Snapshot.beforePublish = beforePublish;
	Snapshot.consume = consume;

/***/ },
/* 11 */
/***/ function(module, exports) {

	(function(global, Snapshot, $) {

	    "use strict";

	    /*

	    $.ajax({
	        url: "",
	        method:"post",
	        ss: "#form1", //ss-type="ss|tpl"
	        ss:["../aa/tpl-1", {}],
	        //"#",".ss-"
	        ss:["#form1", "html"],
	        ss:["#table1", "td[recordId=10000]"|event|elem],
	        data: {
	            "a": "b"
	        },
	        success: function() {}
	    });

	    $.ajax("http://www.abc.com", {
	        method:"post",
	        ss: {
	            type:"ss|tpl",
	            target:"#form1",
	            data:{}/"",
	            event:evt
	        },
	        data: {
	            "a": "b"
	        },
	        success: function() {}
	    });

	    <table ss-selected=".checkbox-selected">
	        <tr><td class="checkbox-selected"></td>..</tr>
	        <tr><td class="checkbox-selected"></td>..</tr>
	        <tr>..</tr>
	        <tr>..</tr>
	        <tr>..</tr>
	    </table>

	    */

	    function resolveSSValue(value) {
	        var cfg = {};

	        if (typeof value == "string") {
	            cfg.type = "ss";
	            cfg.target = value;
	        } else if (value instanceof Array) {
	            var opt1 = value[0];
	            if (typeof opt1 != "string") {
	                throw "first option must be string for ajax/ss";
	            }
	            if (value.length == 1) {
	                return resolveOptions(opt1);
	            }

	            var opt2 = value[1];
	            if (opt1.startsWith("#") || opt1.startsWith(".ss-")) { //ss
	                cfg.type = "ss";
	                cfg.target = opt1;

	                //表格的情况会有第二个参数
	                if (opt2) {
	                    cfg.data = opt2.target || opt2;
	                }
	            } else if (typeof opt2 == "object") { //tpl
	                cfg.type = "tpl";
	                cfg.target = opt1;
	                if (!opt2) {
	                    throw "please check your \"ss\" value in ajax.";
	                }
	                cfg.data = opt2;
	            } else {
	                throw "It has not yet been supported";
	            }

	        } else {
	            throw "It has not yet been supported";
	        }

	        return cfg;
	    }

	    Snapshot._ajax_ = $.ajax;

	    Snapshot.proxyAjax = function() {
	        var options = (typeof arguments[0] == "string") ? arguments[1] : arguments[0];
	        var ssVal = options.ss;
	        if (ssVal) { //需要进行快照发布
	            if (options.method !== "post" && options.method !== "POST") {
	                throw "The http method must be 'post'";
	            }

	            var ssOpts = resolveSSValue(ssVal);
	            var ssResult = Snapshot.beforePublish(ssOpts);
	            if (!ssResult) {
	                return;
	            }

	            options.data = options.data || {}; //数据可能在uri上
	            if (typeof options.data == "string") {
	                if (options.data.indexOf("_ss=") > 0) {
	                    throw "The parameter named \"_ss\" is reserved for Snapshot."
	                }
	                if (options.data.indexOf("?") < 0) {
	                    options.data += "?";
	                }
	                options.data += "&_ss=" + ssResult;
	            } else {
	                if (typeof options.data._ss != "undefined") {
	                    throw "The parameter named \"_ss\" is reserved for Snapshot."
	                }
	                options.data._ss = JSON.stringify(ssResult);
	            }
	        }

	        //delete options.ss;
	        Snapshot._ajax_.apply($, arguments);
	    }

	    Snapshot.proxyAjax.proxy = "snapshot";
	    $.ajax = Snapshot.proxyAjax;

	})(typeof window !== "undefined" ? window : this, Snapshot, jQuery);

/***/ }
/******/ ]);