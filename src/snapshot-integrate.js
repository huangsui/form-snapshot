const Snapshot = require('./snapshot');

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