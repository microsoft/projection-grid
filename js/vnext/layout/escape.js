const pugMatch = /["&<>]/;

function pugEscape(_html) {
  const html = String(_html);
  const regexResult = pugMatch.exec(html);
  if (!regexResult) {
    return _html;
  }

  let result = '';
  let i, lastIndex, escape;
  for (i = regexResult.index, lastIndex = 0; i < html.length; i++) {
    switch (html.charCodeAt(i)) {
      case 34: escape = '&quot;'; break;
      case 38: escape = '&amp;'; break;
      case 60: escape = '&lt;'; break;
      case 62: escape = '&gt;'; break;
      default: continue;
    }
    if (lastIndex !== i) {
      result += html.substring(lastIndex, i);
    }
    lastIndex = i + 1;
    result += escape;
  }
  if (lastIndex !== i) {
    return result + html.substring(lastIndex, i);
  }

  return result;
}

export function escapeAttr(attr) {
  if (Array.isArray(attr)) {
    return attr.map(function (val) {
      return escapeAttr(val);
    });
  } else if (typeof attr === 'object') {
    return Object.keys(attr).reduce(function (memo, key) {
      memo[key] = escapeAttr(attr[key]);
      return memo;
    }, {});
  } else if (typeof attr === 'boolean' || attr === undefined) {
    return attr;
  }
  return pugEscape(attr);
}
