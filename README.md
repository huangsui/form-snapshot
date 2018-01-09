# form-snapshot
Fast record various content of submit by Json and has the ability to convert the json to html

V01
边界/方向/模式

核心职能：HTML解析/反解析
方向目标：
	第一步：满足标准场景，标准表单和表格
	第二步：逐步支持多种自定义的界面控件和组件
	第三步：支持复杂场景


场景假设：
	场景A（标准场景）：提交工作流的页面具备工单详情的展示要素
	场景B：提交页面不具备工单详情的展示要素
	场景C：平台A提交，平台B展示


三种模式：
	1、解析器生成JSON，解析器反解析JSON
	2、解析器生成JSON，页面（模板）反解析JSON
	3、JAVA生成JSON，解析器反解析JSON
	4、JAVA生成JSON，页面（模板）反解析JSON
	5、整个过程都脱离快照框架

Example：
	1、银行端典型性样例页面（增删改，覆盖绝大部分场景）
	2、企业端典型性样例页面（增删改，覆盖绝大部分场景）



	snapshot/parsers/example


快速加载测试html片段，可输入，可加载静态html，ajaxPlugin剥离出快照组件，缺省解析器是否剥离？

sts [port] 当前目录启动静态服务


### Usage ###



