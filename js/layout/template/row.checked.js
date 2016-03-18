define(['component/jade/util'], function(jade) { if(jade && jade['runtime'] !== undefined) { jade = jade.runtime; } return function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
var locals_ = (locals || {}),checked = locals_.checked,disabled = locals_.disabled;
if ( checked)
{
if ( disabled)
{
buf.push("<input type=\"checkbox\" checked=\"checked\" disabled=\"disabled\" class=\"column-checkbox\"/>");
}
else
{
buf.push("<input type=\"checkbox\" checked=\"checked\" class=\"column-checkbox\"/>");
}
}
else
{
if ( disabled)
{
buf.push("<input type=\"checkbox\" disabled=\"disabled\" class=\"column-checkbox\"/>");
}
else
{
buf.push("<input type=\"checkbox\" class=\"column-checkbox\"/>");
}
};return buf.join("");
}});