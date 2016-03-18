define(['component/jade/util'], function(jade) { if(jade && jade['runtime'] !== undefined) { jade = jade.runtime; } return function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
var locals_ = (locals || {}),columns = locals_.columns,value = locals_.value,undefined = locals_.undefined;
buf.push("<table class=\"table table-striped table-hover\">");
var i = 0;
var j = 0;
buf.push("<thead><tr>");
j = 0;
while (j < columns.length)
{
var column = columns[j];
buf.push("<th" + (jade.attr("style", column.$th_style, true, false)) + ">" + (jade.escape(null == (jade_interp = column.$text || column.property || column) ? "" : jade_interp)) + "</th>");
j++
}
buf.push("</tr></thead><tbody>");
i = 0;
while (i < value.length)
{
var row = value[i];
buf.push("<tr>");
j = 0
while (j < columns.length)
{
var column = columns[j];
buf.push("<td" + (jade.attr("style", column.$td_style, true, false)) + (jade.cls([column.$lock?'table-col-lock':undefined], [true])) + ">");
var res = row[column.property]
if ( (res && res.$html))
{
buf.push(null == (jade_interp = res.$html) ? "" : jade_interp);
}
else
{
buf.push(jade.escape(null == (jade_interp = res) ? "" : jade_interp));
}
buf.push("</td>");
j++
}
buf.push("</tr>");
i++
}
buf.push("</tbody></table>");;return buf.join("");
}});