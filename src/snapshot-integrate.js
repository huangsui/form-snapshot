const Snapshot = require('./snapshot-core');

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