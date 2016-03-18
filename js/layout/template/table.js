define(['component/jade/util'], function(jade) { if(jade && jade['runtime'] !== undefined) { jade = jade.runtime; } return function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
var locals_ = (locals || {}),value = locals_.value;
jade_mixins["th"] = function(column){
var block = (this && this.block), attributes = (this && this.attributes) || {};
var attr = (column.$metadata || {})['attr.head']
var cls = [];
if ( column.sortable)
{
cls.push('sortable');
}
if ( column.$orderby)
{
cls.push('orderby');
}
cls = cls.join(' ');
buf.push("<th" + (jade.attrs(jade.merge([{"class": (jade_interp = [true], jade.joinClasses([cls].map(jade.joinClasses).map(function (cls, i) {   return jade_interp[i] ? jade.escape(cls) : cls })))},attributes,attr]), false)) + ">");
if ( column.$orderby)
{
if ( column.$orderby.dir > 0)
{
buf.push("<span class=\"grid-asc\"></span>");
}
else
{
buf.push("<span class=\"grid-des\"></span>");
}
}
if ( (column && column.$html))
{
buf.push(null == (jade_interp = column.$html) ? "" : jade_interp);
}
else
{
buf.push(jade.escape(null == (jade_interp = (typeof column.$text != 'undefined')? column.$text : (column.property || column)) ? "" : jade_interp));
}
buf.push("</th>");
};
jade_mixins["td"] = function(row, column){
var block = (this && this.block), attributes = (this && this.attributes) || {};
var attr = (column.$metadata || {})['attr.body']
buf.push("<td" + (jade.attrs(jade.merge([attributes,attr]), false)) + ">");
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
};
buf.push("<table class=\"table table-hover grid\"><thead><tr class=\"table__row--header\">");
// iterate locals['columns'] || []
;(function(){
  var $$obj = locals['columns'] || [];
  if ('number' == typeof $$obj.length) {

    for (var index = 0, $$l = $$obj.length; index < $$l; index++) {
      var column = $$obj[index];

jade_mixins["th"](column);
    }

  } else {
    var $$l = 0;
    for (var index in $$obj) {
      $$l++;      var column = $$obj[index];

jade_mixins["th"](column);
    }

  }
}).call(this);

buf.push("</tr></thead><tbody>");
// iterate value
;(function(){
  var $$obj = value;
  if ('number' == typeof $$obj.length) {

    for (var i = 0, $$l = $$obj.length; i < $$l; i++) {
      var row = $$obj[i];

var attr = (row.$metadata || {}).attr
buf.push("<tr" + (jade.attrs(jade.merge([{"class": "table__row--body"},attr]), false)) + ">");
// iterate locals['columns'] || []
;(function(){
  var $$obj = locals['columns'] || [];
  if ('number' == typeof $$obj.length) {

    for (var j = 0, $$l = $$obj.length; j < $$l; j++) {
      var column = $$obj[j];

jade_mixins["td"](row, column);
    }

  } else {
    var $$l = 0;
    for (var j in $$obj) {
      $$l++;      var column = $$obj[j];

jade_mixins["td"](row, column);
    }

  }
}).call(this);

buf.push("</tr>");
    }

  } else {
    var $$l = 0;
    for (var i in $$obj) {
      $$l++;      var row = $$obj[i];

var attr = (row.$metadata || {}).attr
buf.push("<tr" + (jade.attrs(jade.merge([{"class": "table__row--body"},{"class": "table__row--body"},attr]), false)) + ">");
// iterate locals['columns'] || []
;(function(){
  var $$obj = locals['columns'] || [];
  if ('number' == typeof $$obj.length) {

    for (var j = 0, $$l = $$obj.length; j < $$l; j++) {
      var column = $$obj[j];

jade_mixins["td"](row, column);
    }

  } else {
    var $$l = 0;
    for (var j in $$obj) {
      $$l++;      var column = $$obj[j];

jade_mixins["td"](row, column);
    }

  }
}).call(this);

buf.push("</tr>");
    }

  }
}).call(this);

buf.push("</tbody></table>");;return buf.join("");
}});