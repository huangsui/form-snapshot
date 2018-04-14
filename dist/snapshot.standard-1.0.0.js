/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

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
    const Note = __webpack_require__(3);
    const FilterChain = __webpack_require__(5);
    const HtmlFactory = __webpack_require__(8);
    const Util = __webpack_require__(4);
    const Cache = __webpack_require__(1);

    var that = this;
    var htmlFactory = new HtmlFactory();
    var aCache = new Cache();
    var processors = [];
    var filterChain = new FilterChain();

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

    var scan = function(node, note, ctx){
        if(node.childNodes.length>0){
            var _pnote = ctx.pnote || ctx.noteRoot;
            ctx.pnote = note;

            $.each(node.childNodes, function(idx, subNode){
                var subNote = note.createSubNote(subNode);
                var result = through( subNode, subNote, ctx );
                if(result){
                    note.appendChild(result);
                }
            });

            ctx.pnote = _pnote;            
        }

        note.makeManifest(node, ctx);
    }

    var through = function( node, note, ctx ) {
        var result = note;

        for( var i=0; i < processors.length; i++ ){
            var pr = processors[i];
            if(pr.matchNode && pr.matchNode(node, note, ctx)){
                return pr.process(node, note, ctx);
            }else if(note.assign){
                break;
            }
        }
        
        if(result!=note){
            return;
        }

        scan( node, note, ctx );
        
        if(note.assign){
            for( var i=0; i < processors.length; i++ ){
                var pr = processors[i];
                if(pr.name == note.assign){
                    return pr.process(node, note, ctx);
                }
            }
        }else{
            //有货单
            for( var i=0; i < processors.length; i++ ){
                var pr = processors[i];
                if(pr.matchManifest && pr.matchManifest(node, note, ctx)){
                    return pr.process(node, note, ctx);
                }
            }
        }
       
        return note;            
        
    };
    through = filterChain.weave(through);

    var Snapshot = function( options ) {

        this.takeSnap = function( selector, opts ){
            var node = $(selector)[0];
            var pctx = new ProcessContext(node, opts);
            var note = new Note(node);
            pctx.appendNote(note);
            var result = through(node, note, pctx);
            return result;
        };

        this.init( options );

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
                processors.push(arg);
                if(typeof arg.convert === "function"){
                    htmlFactory.equip(arg);
                    console.log("register convertor:"+arg.name);
                }
            }else if(arg.name.indexOf("-filter")>0){
                filterChain.add(arg);
            }else if(arg.name.endsWith("-convertor")){
                htmlFactory.equip(arg.bind, arg);
                console.log("register convertor:"+arg.bind);
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
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function() {
            return Snapshot;
        }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    }

    if(true){
        module.exports = Snapshot;
    }

})( typeof window !== "undefined" ? window : this, jQuery );



/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

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


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



const Cache = __webpack_require__(1);
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



/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



const NoteContext = __webpack_require__(2);
const Util = __webpack_require__(4);

var Note = function(node){

    this.init(node);
    this.baseInfo(node);
    this.parent = null;
    this.depth = 0;
    this.ctx = new NoteContext();

    this.createSubNote = function(node){
        var note = new Note(node);
        //note.parent = this;
        note.depth = this.depth + 1;
        note.ctx = new NoteContext();
        note.ctx.parent = this.ctx;
        return note;
    }

}

Note.prototype = {
    constructor:Note,
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
                this.attrs.value=Util.trim(node.nodeValue);
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

module.exports = Note;



/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



var Util = {
    trim:function(x) {
        return x.replace(/^\s+|\s+$/gm,'');
    }
}


module.exports = Util;



/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";




var FilterChain = function(){
    var filters = [],
    	curIdx = -1,
    	targetFn = null;
    this.add = function(filter){
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


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



__webpack_require__(7);

__webpack_require__(17);
__webpack_require__(18);





/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



__webpack_require__(2);
__webpack_require__(3);
__webpack_require__(5);
__webpack_require__(0);
__webpack_require__(9);

//--- Configurable behind here ---
__webpack_require__(10);
__webpack_require__(11);
__webpack_require__(12);


__webpack_require__(13);
__webpack_require__(14);
__webpack_require__(15);
__webpack_require__(16);



/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";




const Cache = __webpack_require__(1);

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

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * 基础过滤器
 * 
 * 辅助快照核心组件完成节点筛选
 *  
 */
const Snapshot = __webpack_require__(0);

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




/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {



const Snapshot = __webpack_require__(0);

"use strict";

/**
    属性过滤器 
    
*/
var filter = new function() {
    this.name = "attrs-filter";
    
    this.filter = function(args, filterChain) {
        var node = args[0];
        var note = args[1];
        var ctx = args[2];

        //find all attrs start with "s-"
	    $.each( node.attributes, function ( index, attribute ) {
	    	if(attribute.name.startsWith("s-")){
	    		note.ctx.data(attribute.name, attribute.value);
	    	}	        
	    } );

        return filterChain.filter.apply(filterChain, args);
    };
}

Snapshot.cache(filter);



/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

const Snapshot = __webpack_require__(0);

"use strict";

/**
    不可见元素过滤器，
    默认情况过滤所有不可见元素
    如果需要自定义过滤规则，请使用属性“s-visible=false|true”
*/
var filter = new function() {
    this.name = "invisible-filter";

    this.filter = function(args, filterChain) {
        var node = args[0];
        var note = args[1];
        var ctx = args[2];

        var visible = note.ctx.closesd("s-visible");
        switch(visible){
            case "true":
                return filterChain.filter.apply(filterChain, args);
            case "false":
                return;
            default:
                if (node.nodeType == 1 && !$(node).is(":visible")) {
                    return;
                }else{
                    return filterChain.filter.apply(filterChain, args);
                }
        }
    };
}

Snapshot.cache(filter);



/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {



const Snapshot = __webpack_require__(0);

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




/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";




const Snapshot = __webpack_require__(0);

var pr = new function(){
    this.name = "form-processor";

    this.beforeProcess = function(node, note, ctx){

    }

    this.afterProcess = function(node, note, ctx){

    }

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



/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
//const Snapshot = require('../snapshot-core');



var convertor = new function() {
    this.name = "form-convertor";
    this.bind = "form-processor";

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
            html += "</div></div>";
        } else if (/^!*(~*INPUTS\:(CHECKBOX|RADIO)~+TEXT)+$/g.test(note.manifest)) {
            html = "<div class=\"col-sm-offset-1 form-group\" style=\"display:inline-block;\">";
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
                        html += "<input type='radio' " + attrs2html(subNote.attrs) + " /> ";
                        break;
                    default:
                        throw "nodeType is unknown!" + subNote.nodeType;
                }
            }
            html += "</div>";
        }

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

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {


const Snapshot = __webpack_require__(0);

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



/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {



const Snapshot = __webpack_require__(0);

"use strict";

var convertor = new function(){
    this.name = "table-convertor";
    this.bind = "table-processor";
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





/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

const Snapshot = __webpack_require__(0);

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

/***/ }),
/* 18 */
/***/ (function(module, exports) {

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

/***/ })
/******/ ]);