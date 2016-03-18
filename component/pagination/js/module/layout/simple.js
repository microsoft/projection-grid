define(['component/jade/util'], function(jade) { if(jade && jade['runtime'] !== undefined) { jade = jade.runtime; } return function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<nav class=\"unselectable\"><ul class=\"pagination\"><li class=\"human\"><span data-bind=\"text: human_item_range\"></span></li><li data-bind=\"css: { disabled: page_count_before() &lt;= 0 }\" class=\"previous\"><a><span class=\"glyphicon glyphicon-triangle-left\"></span></a></li><li data-bind=\"css: { disabled: page_count_after() &lt;= 0 }\" class=\"next\"><a><span class=\"glyphicon glyphicon-triangle-right\"></span></a></li></ul></nav>");;return buf.join("");
}});