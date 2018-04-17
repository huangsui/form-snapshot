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
    const Rebuilder = __webpack_require__(7);
    const Util = __webpack_require__(1);
    const Cache = __webpack_require__(3);
    const Noter = __webpack_require__(8);
    const ssContext = __webpack_require__(4);

    var that = this;
    var builder = new Rebuilder();
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
            $.extend(ssContext.cfg, opts);
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
                    builder.registerConvertor(arg);
                }
            }else if(arg.name.indexOf("-filter")>0){
                noter.registerFilter(arg);
            }else if(arg.name.indexOf("-convertor")>0){
                builder.registerConvertor(arg.bind, arg);
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
        return builder.work.apply(builder, arguments);
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



/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";




const Util = __webpack_require__(1);

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



/***/ }),
/* 3 */
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


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



const Cache = __webpack_require__(3);
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



/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



const Cache = __webpack_require__(3);
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



//core
__webpack_require__(0);
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

//extend
__webpack_require__(22);
__webpack_require__(23);


//bank version
__webpack_require__(24);
__webpack_require__(25);
__webpack_require__(26);

__webpack_require__(27);
__webpack_require__(28);
__webpack_require__(29);
__webpack_require__(30);


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";




const Cache = __webpack_require__(3);

/*重建者：通过Note记录重建Html*/
var Rebuilder = function(){

    var cvts = new Cache();
    this.registerConvertor=function(){
        cvts.cache.apply(cvts, arguments);
        if(arguments.length==1){
            cvts.cache(arguments[0].name).builder = this;
        }else if(arguments.length==2){
            cvts.cache(arguments[0]).builder = this;
        }
        
    };

    this.work = function(note){
        var result = "";
        if(note.assign){
            var cvt = cvts.cache(note.assign);
            result = cvt.convert(note);
        }else if(note.subNotes){
            for (var i = 0; i < note.subNotes.length; i++) {
                var subNote = note.subNotes[i];
                result += this.work(subNote);
            }
        }
        return result;
    };
};

module.exports = Rebuilder;



/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";




const Group = __webpack_require__(9);
const FilterChain = __webpack_require__(10);
const context = __webpack_require__(4);
const Note = __webpack_require__(11);
const NoteContext = __webpack_require__(5);
const NoteWasher = __webpack_require__(12);
const noteRule = __webpack_require__(2);

var Noter = function(){

    var prGroup = new Group();
    var filters = new FilterChain();
    var noteWasher = new NoteWasher();

    this.registerProcessor=function(pr){
        prGroup.pushWithName(pr);
    }
    this.registerFilter=function(filter){
        filters.push(filter);
    }
    this.createNote = function(node){
        var note = new Note(node);
        note.ctx = new NoteContext();
        note.noter = this;
        return note;
    }

    var work = function(node, note ) {

    	//notify before
        if(!noteRule.isFactor(node.nodeName)){
            for( var i=0; i < prGroup.length; i++ ){
                var pr = prGroup.get(i);
                if(pr.beforeScan){              
                    pr.beforeScan(note, node, context);
                    if(note.manifest){
                        return note;
                    }else if(note.assign){
                        break;
                    }
                }
            }
        }

        //scan
        note.scan( node, this );

        //notify after
        if(!noteRule.isFactor(note.manifest)){
            if(note.assign){
                var pr = prGroup.getByName(note.assign);
                return pr.process(note, node, context);
            }else{
                for( var i=0; i < prGroup.length; i++ ){
                    var pr = prGroup.get(i);
                    if(pr.afterScan && pr.afterScan(note, node, context)){
                        return pr.process(note, node, context);
                    }
                }
            }
        }
       
        return note; 
    };

    this.work = filters.weave(this, work);

    this.takeNote = function(node){
        var note = this.createNote(node);
        return this.work( node, note );
    };
};

module.exports = Noter;



/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

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


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";




var FilterChain = function(){
    var filters = [],
    	curIdx = -1,
        weaved = {};
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
        return weaved.method.apply(weaved.target, arguments);
    },
    this.weave = function(target, method){
        weaved.target = target;
        weaved.method = method;
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
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



const Util = __webpack_require__(1);
const NoteContext = __webpack_require__(5);
const nodeRule = __webpack_require__(2);

var Note = function(node){

    this.parent = null;
    this.subNotes = [],
    this.depth = 0;
    this.ctx = new NoteContext();

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
        if(nodeRule.isNodeNameFactor(node.nodeName)){
            this.recordFactor(node);
        }else if(node.childNodes){
            for (var i = 0; i < node.childNodes.length; i++) {
                var subNote = noter.createNote(node.childNodes[i]);
                this.appendChild(subNote);
                var result = noter.work( node.childNodes[i], subNote );
                if(!result){
                    this.removeChild(subNote);
                }
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
                    case "button":
                    case "submit":
                    case "reset":
                    case "file":
                        this.isFactor = false;
                        this.isInvalid = true;
                        break;
                    default:
                        this.value = node.value||"";
                        break;
                }
                this.type = type || "text";
                break;
            case "SELECT"://multiple
                this.type = "select";
                this.value = $(node).val();
                this.textValue = $(node).find("option:selected").text();
                //options
                break;
            case "TEXTAREA":
                this.type = "textarea";
                this.textValue = $(node).val();
                this.rows = $(node).attr("rows");
                this.cols = $(node).attr("cols");                
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
            this.manifest = nodeRule.getManifest(this.nodeName);
            this.grade = 0;
        }else if(!this.isInvalid){
            for(var i=0;i<this.subNotes.length;i++){
                var subNote = this.subNotes[i];
                this.manifest = (this.manifest?this.manifest+"~":"")+subNote.manifest;                                   
            }
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



/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



const noteRule = __webpack_require__(2);

var NoteWasher = function(parent){
    
    this.wash = function(notes){
        var highestGrade = -1;
        for (var i = 0; i < notes.length; i++) {
            var note = notes[i];
            var grade = noteRule.getGrade(note.manifest);
            highestGrade = Math.max(highestGrade, grade);
        }

        for (var i = 0; i < notes.length; i++) {
            var note = notes[i];
            var upgradedManifest = noteRule.upgradeManifest(note.manifest);
            var newGrade = noteRule.getGrade(upgradedManifest);
            if(newGrade < highestGrade){
                notes.splice(i, 1);
                i--;
            }else if(newGrade == highestGrade){
                note.manifest = upgradedManifest;
            }
        }

        return notes;
    };
    
}

module.exports = NoteWasher;



/***/ }),
/* 13 */
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

        if(node.nodeName == "BUTTON"){
            return;
        }

    	var note = filterChain.filter.apply(filterChain, args);

        if(!note){
            return note;
        }
        
        note.nodeName = node.nodeName;
        //已委派
        if(note.assign){
            return note;
        }
        
        //无货单，也无委派，进行丢弃
        if(!note.manifest){            
            //console.log("无效节点: "+note.nodeName);
            return null;
        }

        //未委派，但是有正常货单的情况，直接返回
    	return note;            
    };      
}

Snapshot.register(filter);




/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";




const Snapshot = __webpack_require__(0);
const Util = __webpack_require__(1);

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




/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {



const Snapshot = __webpack_require__(0);

"use strict";

/**
    属性过滤器 
    
*/
var filter = new function() {
    this.name = "node-attrs-filter";
    
    this.filter = function(args, filterChain) {
        var node = args[0];
        var note = args[1];
        
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
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";




const Snapshot = __webpack_require__(0);
const context = __webpack_require__(4);

/**
    不可见元素过滤器，
    默认情况过滤所有不可见元素
    如果需要自定义过滤规则，请使用属性“s-visible=false|true”
*/
var filter = new function() {
    this.name = "node-invisible-filter";

    this.filter = function(args, filterChain) {
        var node = args[0];
        var note = args[1];

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
        return note;
    };
}

Snapshot.cache(filter);



/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

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



/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {



const Snapshot = __webpack_require__(0);
const Util = __webpack_require__(1);

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




/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



const Snapshot = __webpack_require__(0);

var filter = new function(){
    this.name = "note-upgrade-filter";
    
    this.filter= function(args, filterChain){

    	var resultNote = filterChain.filter.apply(filterChain, args);

        if(resultNote && resultNote.subNotes && resultNote.subNotes.length == 1){
            //console.log("剥离空壳: "+result.nodeName);
            var subNote = resultNote.subNotes[0];
            if(subNote.manifest == resultNote.manifest){
            	$.extend(resultNote, subNote);
            }
        }

    	return resultNote;            
    };      
}

Snapshot.cache(filter);




/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";




const Snapshot = __webpack_require__(0);
const nodeRule = __webpack_require__(2);

var pr = new function(){
    this.name = "default-item-processor";

    this.afterScan = function(note, node, ctx){
        return /^TEXT~INPUTS$/g.test(note.manifest) || /^INPUTS~TEXT$/g.test(note.manifest);
    }

    this.process= function(note, node, ctx){
        note.assign = this.name;
        note.manifest = "ITEM";
        return note;
    };

    this.convert = function(note) {
    	var subNote1 = note.subNotes[0];
    	var subNote2 = note.subNotes[1];

        var html = "";
    	html += '<p>';
    	if(subNote1.type == "checkbox" || subNote1.type == "radio"){
			html += "<input type='"+subNote1.type+"'/> ";
	        html += '<label for="input">';
	    	html += subNote2.value;
	    	html += '</label>';
    	}else{
    		html += '<label for="input">';
	    	html += subNote1.value;
	    	html += '</label>';
    		if (/^INPUT$/g.test(subNote2.nodeName)) {
	        	html += '<input type="text" value="'+subNote2.value+'">';
	        }else if(/^SELECT$/g.test(subNote2.nodeName)){
	        	html += '<select><option value="'+subNote2.value+'">'+subNote2.textValue+'</option></select>';
	        }else if(/^TEXTAREA$/g.test(subNote2.nodeName)){
                html += '<textarea '+((subNote2.rows)?(' rows="'+subNote2.rows+'" '):'')+'>'+subNote2.textValue+'</textarea>';
            }else{
	        	html += '<input type="text" value="'+subNote2.value+'">';
	        }
    	}

        html += '</p>'
        return html;
    };
}

Snapshot.cache(pr);



/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";




const Snapshot = __webpack_require__(0);
const nodeRule = __webpack_require__(2);

var pr = new function(){
    this.name = "default-card-processor";

    this.afterScan = function(note, node, ctx){
        return /^ITEM(~ITEM)+$/g.test(note.manifest);
    }

    this.process= function(note, node, ctx){
        note.assign = this.name;
        note.manifest = "CARD";
        return note;
    };

    this.convert = function(note) {
        var html = "";
        html += '<div class="card">';
        html += '<div class="card-body">';
        for (var i = 0; i < note.subNotes.length; i++) {
            var subNote = note.subNotes[i];
            html += this.builder.work(subNote);
        }        
        html += '</div>'
        html += '</div>'

        return html;
    };
}

Snapshot.cache(pr);



/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {


const Snapshot = __webpack_require__(0);

"use strict";

var pr = new function(){
    this.name = "default-table-processor";

    this.beforeScan = function(note, node, ctx){
        if(node.nodeName == "TABLE"){
            note.assign = this.name;
        }
        return note;
    }

    this.process= function(note, node, ctx){
        note.manifest = "GROUP";
        var opts = ctx.cfg;
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
/* 23 */
/***/ (function(module, exports, __webpack_require__) {



const Snapshot = __webpack_require__(0);

"use strict";

var convertor = new function(){
    this.name = "default-table-convertor";
    this.bind = "default-table-processor";

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
/* 24 */
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
/* 25 */
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

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {


const Snapshot = __webpack_require__(0);

"use strict";

var pr = new function(){
    this.name = "default-tab-processor";


    this.beforeScan = function(note, node, ctx){
        if(note.ctx.data("s-type") == "tab"){
            note.assign = this.name;
            note.manifest = "GROUP";

            var tabNames = [];
            var contents = [];

            $(node).find("a").each(function(idx, el){
                tabNames.push($(el).text());
            });

            note.tabNames = tabNames;

            $(node).find(".tab-pane").each(function(idx, el){
                var contentNode = note.noter.takeNote(el);
                contents.push(contentNode);//考虑空节点
            }); 
            note.contents = contents;
        }

        return note;
    }

    this.convert=function(note){
        var html = "";
        html += '<div class="nav nav-tabs" id="nav-tab" role="tablist">'
        for (var i = 0; i < note.tabNames.length; i++) {
            var tabName = note.tabNames[i];
            html += '<a class="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">'+tabName+'</a>'
        }
        html += '</div>'

        for (var i = 0; i < note.contents.length; i++) {
            var contentNote = note.contents[i];
            html += '<div class="tab-pane fade active show in" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">';
            html += this.builder.work(contentNote);
            html += '</div>';
        }
        
        return html;
    }
}

Snapshot.cache(pr);



/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {


const Snapshot = __webpack_require__(0);

"use strict";

var pr = new function(){
    this.name = "bank-select2-processor";

    this.beforeScan = function(note, node, ctx){        
        if($(node).children(".select2.select2-container").length>0){  //代理select2下拉框
            note.isFactor = true;
            note.manifest = "INPUTS";
            note.nodeName = "INPUT";
            note.type = "text";
            note.value = $(node).find(".select2-selection__rendered").text();

            note.orign = "select2";
        }
        return note;
    };
}

Snapshot.cache(pr);



/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {


const Snapshot = __webpack_require__(0);

"use strict";

var pr = new function(){
    this.name = "bank-tab-processor";

    this.beforeScan = function(note, node, ctx){
        if(node.className == "nav nav-tabs"||node.className == "panel-heading"){
            note.assign = this.name;
            note.manifest = "CARD";
        }
        return note;
    };

    this.process= function(note, node, ctx){
        if(node.className == "nav nav-tabs"){
            note.nodeName = "#text";
            note.value = $(node).find("li.active a").text();
            note.nodeType = "TEXT";
            note.manifest = "TEXT";
            note.hierarchy=1;
        }
        if(node.className == "panel-heading"){
            note.nodeName = "#text";
            note.value =$.trim($(node).find(".panel-title").text());
            note.nodeType = "TEXT";
            note.manifest = "PANEL";
            note.hierarchy=1;
        }
        return note;
    };

    this.convert= function(note){
        
        var html = "<div  class=\"form-group col-md-12\">";

        if(note.manifest=="TEXT"){
            html += note.value;
        }
        if(note.manifest=="PANEL"){
            html +="<h4 class='panel-title'>"+note.value+"</h4>";
        }

        html +="</div>";

        return html;
    };
}

Snapshot.cache(pr);



/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {


const Snapshot = __webpack_require__(0);

"use strict";

var pr = new function(){
    this.name = "bank-bttable-processor";

    this.beforeScan = function(note, node, ctx){
        if(node.className == "fixed-table-body"){       //代理bootstrap-table
            note.assign = this.name;
            note.manifest = "CARD";

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
        
        note.assign = this.name;
        }
        return note;
    };

    this.convert= function(note,ctx){

        var html = '<table class="table table-bordered">';

        html += '<thead>';
        var ths = '';
        for(var j=0;j<note.value[0].length;j++){
            ths += '<th>' + note.value[0][j] + '</th>';
        }
        html += '<tr style="background-color: #F3F3F3;">' + ths + '</tr>';
        html += '</thead>';

        html += '<tbody>';
        for(var i=1;i<note.value.length;i++){
            var tds = '';
            for(var j=0;j<note.value[i].length;j++){
                tds += '<td>' + note.value[i][j] + '</td>';
            }
            html += '<tr>' + tds + '</tr>';
        }
        html += '</tbody>';
        html += '</table>';

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



/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {


const Snapshot = __webpack_require__(0);

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



/***/ })
/******/ ]);