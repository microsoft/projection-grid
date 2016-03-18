define(['lib/underscore'], function (_) {
    'use strict';

    function attr(key, val, escaped) {
        var result = ' ' + key;
        if (!val) {
            return result;
        }
        return result + '=\'' + (escaped ? _.escape(val) : val) + '\'';
    }

    function joinClasses(val) {
      return Array.isArray(val) ? _.filter(val, function (cl) { return cl != null && cl !== ''; }).join(' ') : val;
    }

    function cls(classes, escaped) {      
      var buf = [];      
      for (var i = 0; i < classes.length; i++) {
        if (escaped && escaped[i]) {
          buf.push(_.escape(joinClasses([classes[i]])));
        } else {
          buf.push(joinClasses(classes[i]));
        }
      }
      var text = joinClasses(buf);
      if (text.length) {
        return ' class="' + text + '"';
      } else {
        return '';
      }
    };


    return{
        escape: _.escape,
        attr: attr,
        cls: cls
    };

});