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

	__webpack_require__(23);
	__webpack_require__(24);





/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	
	"use strict";

	//core
	__webpack_require__(2);
	__webpack_require__(3);
	__webpack_require__(5);
	__webpack_require__(7);
	__webpack_require__(9);
	__webpack_require__(8);

	__webpack_require__(11);
	__webpack_require__(13);

	//filter Configurable
	__webpack_require__(14);//星号过滤
	__webpack_require__(15);//s-属性
	__webpack_require__(16);//不可见元素

	__webpack_require__(17);//清理已不需要的信息
	__webpack_require__(18);//宽度
	__webpack_require__(19);//空壳note升级

	//processor
	__webpack_require__(20);
	__webpack_require__(21);
	__webpack_require__(22);

	//convert
	// require('../convertor/form-convertor');
	// require('../convertor/table-convertor');


/***/ },
/* 2 */
/***/ function(module, exports) {

	

	"use strict";

	var FilterChain = function(){
	    var filters = [],
	    	curIdx = -1,
	    	targetFn = null;
	    this.push = function(filter){
	        filters.push(filter);
	    },
	    this.resetIdx = function(){
	        curIdx = -1;
	    },
	    this.filter = function(){
	        curIdx++;
	        if(curIdx < filters.length){                
	            var result = filters[curIdx].filter(arguments, this);
	            return result;
	        }else{
	            return this.invoke.apply(this, arguments);
	        }            
	    },
	    this.invoke = function(){
	        var result = targetFn.apply(this, arguments);
	        return result;
	    },
	    this.weave = function(fn){
	        targetFn = fn;
	        return (function(chain){
	            return function(){
	            	chain.resetIdx();
	            	return chain.filter.apply(chain, arguments);
	            }            
	        })(this);
	    }
	};

	module.exports = FilterChain;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	

	"use strict";

	const Util = __webpack_require__(4);

	/*
	FACTOR = TEXT|INPUTS //TEXT可升级为LABEL
	ITEM = (LABEL|TEXT)(~INPUTS)+
	GROUP = ((LABEL|TEXT)?~)?ITEM+(~ITEM)*
	PANEL = GROUP(~GROUP)*
	CUSTOM=.{0,100}
	*/
	const Factors = ["#text","SELECT","INPUT", "TEXTAREA"];
	const ManifestMapping = {"#text":"TEXT","SELECT":"INPUTS","INPUT":"INPUTS", "TEXTAREA":"INPUTS"};

	var NodeRule = new function(){

		this.TEXT="TEXT";
		this.LABEL="LABEL";
		this.INPUTS="INPUTS";
		this.ITEM="ITEM";
		this.GROUP="GROUP";
		this.PANEL="PANEL";
		this.CUSTOM="CUSTOM";

	    this.isFactor = function(manifest){
	    	return Factors.indexOf(manifest)!=-1;
	    };
	    this.isItem = function(manifest){
	    	return /^(LABEL|TEXT)(~INPUTS)+$/g.test(manifest);
	    };
	    this.isGroup = function(manifest){
	    	return /^((LABEL|TEXT)?~)?ITEM+(~ITEM)*$/g.test(manifest);
	    };
	    this.isPanel = function(manifest){
	    	return /^GROUP(~GROUP)*$/g.test(manifest);
	    };
	    this.isCustom = function(){
	    	return CUSTOM = manifest;
	    };
	    this.getManifest = function(factor){
	    	return ManifestMapping[factor];
	    }

	}

	module.exports = NodeRule;



/***/ },
/* 4 */
/***/ function(module, exports) {

	
	"use strict";

	var Util = {
	    trim:function(x) {
	        if(typeof x !== "string"){
	            throw x+"is not string";
	        }
	        return x.replace(/^\s+|\s+$/gm,'');
	    },
	    /*
			http://www.w3school.com.cn/jsref/prop_node_nodetype.asp
			nodeType 属性返回以数字值返回指定节点的节点类型。
			如果节点是元素节点，则 nodeType 属性将返回 1。
			如果节点是Text节点，则 nodeType 属性将返回 3。
		*/
	    isElement:function(node){
	    	return node.nodeType==1;
	    }
	}


	module.exports = Util;



/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	
	"use strict";

	const Cache = __webpack_require__(6);
	var NoteContext = function(parent){
	    
	    this.parent = parent || null;

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
	    
	}

	module.exports = NoteContext;



/***/ },
/* 6 */
/***/ function(module, exports) {

	
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
	        return this;
	    }

	    this.get = function(name){
	        return caches[name];
	    }

	    this.set = function(name, value){
	        caches[name] = value;
	        return this;
	    }

	};

	module.exports = Cache;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	
	"use strict";

	const Util = __webpack_require__(4);
	const NoteContext = __webpack_require__(5);
	const nodeRule = __webpack_require__(3);
	const context = __webpack_require__(8);

	var Note = function(node){

	    this.parent = null;
	    this.depth = 0;

	    /*Object.defineProperty(this, "assign", {
	            value:undefined,
	            get : function(){
	                return value;
	            },
	            set : function(newValue){
	                value = newValue;
	                console.log("assign:"+assign);
	            }
	        }
	    );*/

	}

	Note.prototype = {
	    constructor:Note,
	    hierarchy:0,
	    scan:function(node, noter){
	        if(nodeRule.isFactor(node.nodeName)){
	            this.recordFactor(node);
	        }else if(node.childNodes){
	            for (var i = 0; i < node.childNodes.length; i++) {
	                noter.takeNote( node.childNodes[i] );
	            }        
	        }
	        this.makeManifest();
	        return this;
	    },
	    recordFactor:function(node){
	        //open to external
	        this.isFactor = true;
	        this.nodeName = node.nodeName;
	        switch(node.nodeName){
	            case "INPUT"://text,hidden,radio,checkbox,password
	                var type = node.getAttribute("type");
	                switch(type){
	                    case "radio":
	                    case "checkbox":
	                        this.checked = node.checked;
	                        break;
	                    default:
	                        this.type = type || "text";
	                        this.value = node.value||"";
	                        break;
	                }
	                break;
	            case "SELECT"://multiple
	                this.type = "select";
	                break;
	            case "TEXTAREA":
	                this.type = "textarea";
	                break;
	            case "#text"://button
	                this.type="text";
	                this.value=Util.trim(node.nodeValue);
	                break;
	            default:;
	        }
	        return this;
	    },
	    makeManifest:function(){
	        if(this.isFactor){
	            node.manifest = note.nodeName;
	            this.high = 1;
	        }else{
	            for(var i=0;i<this.subNotes.length;i++){
	                var subNote = this.subNotes[i];
	                this.manifest = (this.manifest?this.manifest+"~":"")
	                    +(subNote.summary||subNote.manifest);                                   
	            }
	        }

	        if(nodeRule.isFactor(this.manifest)){
	            this.summary = nodeRule.getManifest(this.manifest);
	        }else if(nodeRule.isItem(this.manifest)){
	            this.summary = nodeRule.ITEM;
	        }else if(nodeRule.isGroup(this.manifest)){
	            this.summary = nodeRule.GROUP;
	        }else if(nodeRule.isPanel(this.manifest)){
	            this.summary = nodeRule.PANEL;
	        }           
	        return this;
	    },
	    appendChild:function(note){
	        note.depth = this.depth++;
	        note.ctx.parent = this.ctx;
	        this.subNotes.push(note);
	    },
	    appendChilds:function(notes){
	        for (var i = 0; i < notes.length; i++) {
	            this.appendChild(notes[i]);
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

	module.exports = Note;



/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	
	"use strict";

	const Cache = __webpack_require__(6);
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



/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	

	"use strict";

	const Group = __webpack_require__(10);
	const context = __webpack_require__(8);
	const Note = __webpack_require__(7);
	const NoteContext = __webpack_require__(8);
	const FilterChain = __webpack_require__(2);

	var Noter = function(){

	    var prs = new Group();
	    var filters = new FilterChain();
	    this.registerProcessor=function(pr){
	        prs.pushWithName(pr);
	    }
	    this.registerFilter=function(filter){
	        filters.push(filter);
	    }
	    this.createNote = function(node){
	        var note = new Note(node);
	        note.ctx = new NoteContext();
	        return note;
	    }
	    var work = function( node, note ) {
	        var parent = context.getParent();
	        if(parent){
	            parent.appendChild(note);
	        }

	    	//notify before
	        for( var i=0; i < prs.length; i++ ){
	            var pr = prs.get(i);
	            if(pr.beforeScan){            	
	                pr.beforeScan(note, node, context);
	            	if(note.manifest){
	            		return note;
	            	}else if(note.assign){
	            		break;
	            	}
	            }
	        }

	        //scan
	        context.pushParent(note);
	        note.scan( node, this );
	        context.popParent(note);

	        //notify after
	        if(note.assign){
	            var pr = prs.getByName(note.assign);
	            return pr.process(note, node, context);
	        }else{
	            for( var i=0; i < prs.length; i++ ){
	                var pr = prs[i];
	                if(pr.afterScan && pr.afterScan(note, node, context)){
	                    return pr.process(node, note, ctx);
	                }
	            }
	        }
	       
	        return note; 
	    };

	    this.takeNote = filters.weave(work);
	};

	module.exports = Noter;



/***/ },
/* 10 */
/***/ function(module, exports) {

	
	"use strict";

	var Group = function(){
		var group = [];
	    var groupMap = {};
	    this.length = 0;

	    this.get = function(idx){
	        return group[i];
	    }
	    this.push = function(object){
	        group.push(object);
	        this.length++;
	    }
	    this.pushWithName = function(){
	        if(arguments.length==2){
	            group.push(arguments[1]);
	            groupMap[arguments[0]] = arguments[1];
	        }else if(arguments.length==1 && arguments[0].name){
	            group.push(arguments[0]);
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


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

	/**
	 * 表单快照核心组件
	 * 
	 * Note: 便签，记录节点相关信息
	 * Filter：过滤器，对每个节点扫描前后进行过滤 
	 * Catcher: 捕捉者，
	 * ProcessContext：上下文，节点处理时提供上下文信息
	 * Manifest：货单，简单的节点描述规则，方便识别
	 * 
	 * !!TEXT~INPUTS~~!TEXT~INPUTS
	 *  
	 * 统一前缀：s-
	 * 
	 */

	( function ( global, $ ) {

	    "use strict"

	    const VERSION = "1.0.0";/*版本*/
	    const HtmlFactory = __webpack_require__(12);
	    const Util = __webpack_require__(4);
	    const Cache = __webpack_require__(6);
	    const Noter = __webpack_require__(9);

	    var that = this;
	    var htmlFactory = new HtmlFactory();
	    var aCache = new Cache();
	    var noter = new Noter();

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

	    var Snapshot = function( options ) {
	        this.init( options );
	        this.takeSnap = function( selector, opts ){
	            var node = $(selector)[0];
	            return noter.takeNote(node);
	        };
	    };

	    Snapshot.cache = function(){
	        return aCache.cache.apply(aCache, arguments);
	    }

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
	                noter.registerProcessor(arg);
	                if(typeof arg.convert === "function"){
	                    htmlFactory.equip(arg);
	                }
	            }else if(arg.name.indexOf("-filter")>0){
	                noter.registerFilter(arg);
	            }else if(arg.name.indexOf("-convertor")>0){
	                htmlFactory.equip(arg.bind, arg);
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
	    
	    Snapshot.convert = function(){
	        return htmlFactory.convert.apply(htmlFactory, arguments);
	    };
	    Snapshot.fn.convert = Snapshot.convert;
	    
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
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	

	"use strict";

	const Cache = __webpack_require__(6);

	var HtmlFactory = function(){

		var convertors = new Cache();
		this.convert = function(arg, ctx){
			if(!arg){
	            throw "convert param is required.";
	        }else if(arg instanceof Array){
	            return this.convertArray.call(this, arg, ctx);
	        }

	        if(!ctx || !ctx.root){
	            ctx = {root:arg};
	        }

	        var html = "", note = arg;
	        if(note.assign){
	            var cvt = convertors.cache(note.assign);
	            html = cvt.convert(note, ctx);
	        }


	        if( note.manifest == "GROUP" || note.subNotes){
	            ctx.parent = note;
	            html += this.convert(note.subNotes, ctx);
	            //ctx.parent is dirty here.
	        }      

	        return html;
		}

		this.convertArray = function(arr, ctx){
	        var html = "";
	        for (var i = 0; i < arr.length; i++) {
	            html += this.convert(arr[i], ctx);
	        }
	        return html;
	    }

		this.equip = function(){
			convertors.cache.apply(convertors, arguments);
		}


	}

	module.exports = HtmlFactory;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * 基础过滤器
	 * 
	 * 辅助快照核心组件完成节点筛选
	 *  
	 */
	const Snapshot = __webpack_require__(11);

	"use strict";

	var filter = new function(){
	    this.name = "base-filter";

	    /*
			http://www.w3school.com.cn/jsref/prop_node_nodetype.asp
			nodeType 属性返回以数字值返回指定节点的节点类型。
			如果节点是元素节点，则 nodeType 属性将返回 1。
			如果节点是Text节点，则 nodeType 属性将返回 3。
		*/
	    this.filter= function(args, filterChain){
	        var node = args[0];

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

	        //未委派，但是有正常货单的情况，直接返回
	    	return result;            
	    };      
	}

	Snapshot.register(filter);




/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	

	"use strict";

	const Snapshot = __webpack_require__(11);
	const Util = __webpack_require__(4);

	var filter = new function(){
	    this.name = "node-asterisk-filter";
	    
	    /*
			http://www.w3school.com.cn/jsref/prop_node_nodetype.asp
			nodeType 属性返回以数字值返回指定节点的节点类型。
			如果节点是元素节点，则 nodeType 属性将返回 1。
			如果节点是Text节点，则 nodeType 属性将返回 3。
		*/
	    this.filter= function(args, filterChain){
	        var node = args[0];

	        //过滤*号
	        if(node.nodeName=="#text" && Util.trim(node.nodeValue)=="*"){
	            return;
	        }

	    	return filterChain.filter.apply(filterChain, args);        
	    };      
	}

	Snapshot.cache(filter);




/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	

	const Snapshot = __webpack_require__(11);

	"use strict";

	/**
	    属性过滤器 
	    
	*/
	var filter = new function() {
	    this.name = "node-attrs-filter";
	    
	    this.filter = function(args, filterChain) {
	        var node = args[0];
	        var note = filterChain.filter.apply(filterChain, args);

	        //find all attrs start with "s-"
	        $.each( node.attributes, function ( index, attribute ) {
	            if(attribute.name.startsWith("s-")){
	                note.ctx.data(attribute.name, attribute.value);
	            }           
	        } );

	        return note;
	    };
	}

	Snapshot.cache(filter);



/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	

	"use strict";

	const Snapshot = __webpack_require__(11);
	const context = __webpack_require__(8);

	/**
	    不可见元素过滤器，
	    默认情况过滤所有不可见元素
	    如果需要自定义过滤规则，请使用属性“s-visible=false|true”
	*/
	var filter = new function() {
	    this.name = "node-invisible-filter";

	    this.filter = function(args, filterChain) {
	        var node = args[0];

	        //FIXME:待改造
	        var parentNote = context.getParent();
	        var visible = parentNote && parentNote.ctx.closesd("s-visible");
	        var note;
	        switch(visible){
	            case "true":
	                note = filterChain.filter.apply(filterChain, args);
	            case "false":
	                return;
	            default:
	                if (node.nodeType == 1 && !$(node).is(":visible")) {
	                    return;
	                }else{
	                    note = filterChain.filter.apply(filterChain, args);
	                }
	        }

	        if(note.ctx.get("s-visible") == "false"){
	            note = undefined;
	        }

	        return note;
	    };
	}

	Snapshot.cache(filter);



/***/ },
/* 17 */
/***/ function(module, exports) {

	
	"use strict";

	/*
	 清理note上无用的数据
	*/
	var filter = new function() {
	    this.name = "note-clean-filter";

	    this.filter = function(args, filterChain) {
	        var node = args[0];

	        var resultNote = filterChain.filter.apply(filterChain, args);

	        if(resultNote){
	        	delete resultNote.ctx;
	        }        
	        
	        return resultNote;
	    };
	}

	Snapshot.cache(filter);



/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	

	const Snapshot = __webpack_require__(11);
	const Util = __webpack_require__(4);

	"use strict";

	var filter = new function(){
	    this.name = "note-width-filter";
	    
	    this.filter= function(args, filterChain){
	    	var node = args[0];

	    	var resultNote = filterChain.filter.apply(filterChain, args);

	        if(Util.isElement(node)){//元素节点
	            resultNote.layout = resultNote.layout || {};
	            resultNote.layout.width = $(node).width();
	        }

	    	return resultNote;            
	    };      
	}

	Snapshot.cache(filter);




/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	
	"use strict";

	const Snapshot = __webpack_require__(11);

	var filter = new function(){
	    this.name = "note-upgrade-filter";
	    
	    this.filter= function(args, filterChain){

	    	var resultNote = filterChain.filter.apply(filterChain, args);

	        if(resultNote && resultNote.subNotes && resultNote.subNotes.length == 1){
	            //console.log("剥离空壳: "+result.nodeName);            
	            return resultNote.subNotes[0];
	        }

	    	return resultNote;            
	    };      
	}

	Snapshot.cache(filter);




/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	

	"use strict";

	const Snapshot = __webpack_require__(11);
	const nodeRule = __webpack_require__(3);

	var pr = new function(){
	    this.name = "default-item-processor";

	    this.afterScan = function(note, node, ctx){
	        return note.summary = nodeRule.ITEM;
	    }

	    this.process= function(note, node, ctx){
	        note.assign = this.name;
	        return note;
	    };
	}

	Snapshot.cache(pr);



/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	

	"use strict";

	const Snapshot = __webpack_require__(11);
	const nodeRule = __webpack_require__(3);

	var pr = new function(){
	    this.name = "default-group-processor";

	    this.afterScan = function(note, node, ctx){
	        return note.summary = nodeRule.GROUP;
	    }

	    this.process= function(note, node, ctx){
	        note.assign = this.name;
	        return note;
	    };
	}

	Snapshot.cache(pr);



/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	

	"use strict";

	const Snapshot = __webpack_require__(11);
	const nodeRule = __webpack_require__(3);

	var pr = new function(){
	    this.name = "default-panel-processor";

	    this.afterScan = function(note, node, ctx){
	        return note.summary = nodeRule.PANEL;
	    }

	    this.process= function(note, node, ctx){
	        note.assign = this.name;
	        return note;
	    };
	}

	Snapshot.cache(pr);



/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	const Snapshot = __webpack_require__(11);

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

	Snapshot.beforePublish = beforePublish;
	Snapshot.consume = consume;

/***/ },
/* 24 */
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
	                options.data += "&_ss=" + encodeURIComponent(JSON.stringify(ssResult));
	            } else {
	                if (typeof options.data._ss != "undefined") {
	                    throw "The parameter named \"_ss\" is reserved for Snapshot."
	                }
	                options.data._ss = encodeURIComponent(JSON.stringify(ssResult));
	            }
	        }

	        //delete options.ss;
	        return Snapshot._ajax_.apply($, arguments);
	    }

	    Snapshot.proxyAjax.proxy = "snapshot";
	    $.ajax = Snapshot.proxyAjax;

	})(typeof window !== "undefined" ? window : this, Snapshot, jQuery);

/***/ }
/******/ ]);