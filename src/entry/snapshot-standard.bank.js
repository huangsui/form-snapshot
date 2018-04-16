
"use strict";

//core
require('../core/filter-chain');
require('../core/note-rule');
require('../core/note-context');
require('../core/note-factory');
require('../core/noter');
require('../core/snapshot-context');

require('../snapshot-core');
require('../filter/base-filter');

//filter Configurable
require('../filter/node-asterisk-filter');//星号过滤
require('../filter/node-attrs-filter');//s-属性
require('../filter/node-invisible-filter');//不可见元素

require('../filter/note-clean-filter');//清理已不需要的信息
require('../filter/note-width-filter');//宽度
require('../filter/note-upgrade-filter');//空壳note升级

//processor
require('../processor/default-item-processor');
require('../processor/default-group-processor');
require('../processor/default-panel-processor');

//extend
require('../extend/default-table-processor');
require('../extend/default-table-convertor');


//standard version
require('../snapshot-integrate');
require('../snapshot-ajax');

require('../extend/default-tab-processor');

//bank
require('../extend/bank/bank-select2-processor');
