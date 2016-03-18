define(['component/jade/util'], function(jade) { if(jade && jade['runtime'] !== undefined) { jade = jade.runtime; } return function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
var locals_ = (locals || {}),defaultValue = locals_.defaultValue;
buf.push("<input type=\"text\"" + (jade.attr("value", defaultValue, true, false)) + " style=\"width:100%\" class=\"grid-text-input\"/>");;return buf.join("");
}});