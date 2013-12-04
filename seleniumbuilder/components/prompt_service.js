var COMPILED = !0, goog = goog || {};
goog.global = this;
goog.DEBUG = !0;
goog.LOCALE = "en";
goog.provide = function(a) {
  if(!COMPILED) {
    if(goog.isProvided_(a)) {
      throw Error('Namespace "' + a + '" already declared.');
    }
    delete goog.implicitNamespaces_[a];
    for(var b = a;(b = b.substring(0, b.lastIndexOf("."))) && !goog.getObjectByName(b);) {
      goog.implicitNamespaces_[b] = !0
    }
  }
  goog.exportPath_(a)
};
goog.setTestOnly = function(a) {
  if(COMPILED && !goog.DEBUG) {
    throw a = a || "", Error("Importing test-only code into non-debug environment" + a ? ": " + a : ".");
  }
};
COMPILED || (goog.isProvided_ = function(a) {
  return!goog.implicitNamespaces_[a] && !!goog.getObjectByName(a)
}, goog.implicitNamespaces_ = {});
goog.exportPath_ = function(a, b, c) {
  a = a.split(".");
  c = c || goog.global;
  !(a[0] in c) && c.execScript && c.execScript("var " + a[0]);
  for(var d;a.length && (d = a.shift());) {
    !a.length && goog.isDef(b) ? c[d] = b : c = c[d] ? c[d] : c[d] = {}
  }
};
goog.getObjectByName = function(a, b) {
  for(var c = a.split("."), d = b || goog.global, e;e = c.shift();) {
    if(goog.isDefAndNotNull(d[e])) {
      d = d[e]
    }else {
      return null
    }
  }
  return d
};
goog.globalize = function(a, b) {
  var c = b || goog.global, d;
  for(d in a) {
    c[d] = a[d]
  }
};
goog.addDependency = function(a, b, c) {
  if(!COMPILED) {
    for(var d, a = a.replace(/\\/g, "/"), e = goog.dependencies_, f = 0;d = b[f];f++) {
      e.nameToPath[d] = a;
      a in e.pathToNames || (e.pathToNames[a] = {});
      e.pathToNames[a][d] = true
    }
    for(d = 0;b = c[d];d++) {
      a in e.requires || (e.requires[a] = {});
      e.requires[a][b] = true
    }
  }
};
goog.ENABLE_DEBUG_LOADER = !0;
goog.require = function(a) {
  if(!COMPILED && !goog.isProvided_(a)) {
    if(goog.ENABLE_DEBUG_LOADER) {
      var b = goog.getPathFromDeps_(a);
      if(b) {
        goog.included_[b] = true;
        goog.writeScripts_();
        return
      }
    }
    a = "goog.require could not find: " + a;
    goog.global.console && goog.global.console.error(a);
    throw Error(a);
  }
};
goog.basePath = "";
goog.nullFunction = function() {
};
goog.identityFunction = function(a) {
  return a
};
goog.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(a) {
  a.getInstance = function() {
    return a.instance_ || (a.instance_ = new a)
  }
};
!COMPILED && goog.ENABLE_DEBUG_LOADER && (goog.included_ = {}, goog.dependencies_ = {pathToNames:{}, nameToPath:{}, requires:{}, visited:{}, written:{}}, goog.inHtmlDocument_ = function() {
  var a = goog.global.document;
  return typeof a != "undefined" && "write" in a
}, goog.findBasePath_ = function() {
  if(goog.global.CLOSURE_BASE_PATH) {
    goog.basePath = goog.global.CLOSURE_BASE_PATH
  }else {
    if(goog.inHtmlDocument_()) {
      for(var a = goog.global.document.getElementsByTagName("script"), b = a.length - 1;b >= 0;--b) {
        var c = a[b].src, d = c.lastIndexOf("?"), d = d == -1 ? c.length : d;
        if(c.substr(d - 7, 7) == "base.js") {
          goog.basePath = c.substr(0, d - 7);
          break
        }
      }
    }
  }
}, goog.importScript_ = function(a) {
  var b = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
  !goog.dependencies_.written[a] && b(a) && (goog.dependencies_.written[a] = true)
}, goog.writeScriptTag_ = function(a) {
  if(goog.inHtmlDocument_()) {
    goog.global.document.write('<script type="text/javascript" src="' + a + '"><\/script>');
    return true
  }
  return false
}, goog.writeScripts_ = function() {
  function a(e) {
    if(!(e in d.written)) {
      if(!(e in d.visited)) {
        d.visited[e] = true;
        if(e in d.requires) {
          for(var g in d.requires[e]) {
            if(!goog.isProvided_(g)) {
              if(g in d.nameToPath) {
                a(d.nameToPath[g])
              }else {
                throw Error("Undefined nameToPath for " + g);
              }
            }
          }
        }
      }
      if(!(e in c)) {
        c[e] = true;
        b.push(e)
      }
    }
  }
  var b = [], c = {}, d = goog.dependencies_, e;
  for(e in goog.included_) {
    d.written[e] || a(e)
  }
  for(e = 0;e < b.length;e++) {
    if(b[e]) {
      goog.importScript_(goog.basePath + b[e])
    }else {
      throw Error("Undefined script input");
    }
  }
}, goog.getPathFromDeps_ = function(a) {
  return a in goog.dependencies_.nameToPath ? goog.dependencies_.nameToPath[a] : null
}, goog.findBasePath_(), goog.global.CLOSURE_NO_DEPS || goog.importScript_(goog.basePath + "deps.js"));
goog.typeOf = function(a) {
  var b = typeof a;
  if(b == "object") {
    if(a) {
      if(a instanceof Array) {
        return"array"
      }
      if(a instanceof Object) {
        return b
      }
      var c = Object.prototype.toString.call(a);
      if(c == "[object Window]") {
        return"object"
      }
      if(c == "[object Array]" || typeof a.length == "number" && typeof a.splice != "undefined" && typeof a.propertyIsEnumerable != "undefined" && !a.propertyIsEnumerable("splice")) {
        return"array"
      }
      if(c == "[object Function]" || typeof a.call != "undefined" && typeof a.propertyIsEnumerable != "undefined" && !a.propertyIsEnumerable("call")) {
        return"function"
      }
    }else {
      return"null"
    }
  }else {
    if(b == "function" && typeof a.call == "undefined") {
      return"object"
    }
  }
  return b
};
goog.propertyIsEnumerableCustom_ = function(a, b) {
  if(b in a) {
    for(var c in a) {
      if(c == b && Object.prototype.hasOwnProperty.call(a, b)) {
        return true
      }
    }
  }
  return false
};
goog.propertyIsEnumerable_ = function(a, b) {
  return a instanceof Object ? Object.prototype.propertyIsEnumerable.call(a, b) : goog.propertyIsEnumerableCustom_(a, b)
};
goog.isDef = function(a) {
  return a !== void 0
};
goog.isNull = function(a) {
  return a === null
};
goog.isDefAndNotNull = function(a) {
  return a != null
};
goog.isArray = function(a) {
  return goog.typeOf(a) == "array"
};
goog.isArrayLike = function(a) {
  var b = goog.typeOf(a);
  return b == "array" || b == "object" && typeof a.length == "number"
};
goog.isDateLike = function(a) {
  return goog.isObject(a) && typeof a.getFullYear == "function"
};
goog.isString = function(a) {
  return typeof a == "string"
};
goog.isBoolean = function(a) {
  return typeof a == "boolean"
};
goog.isNumber = function(a) {
  return typeof a == "number"
};
goog.isFunction = function(a) {
  return goog.typeOf(a) == "function"
};
goog.isObject = function(a) {
  a = goog.typeOf(a);
  return a == "object" || a == "array" || a == "function"
};
goog.getUid = function(a) {
  return a[goog.UID_PROPERTY_] || (a[goog.UID_PROPERTY_] = ++goog.uidCounter_)
};
goog.removeUid = function(a) {
  "removeAttribute" in a && a.removeAttribute(goog.UID_PROPERTY_);
  try {
    delete a[goog.UID_PROPERTY_]
  }catch(b) {
  }
};
goog.UID_PROPERTY_ = "closure_uid_" + Math.floor(2147483648 * Math.random()).toString(36);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(a) {
  var b = goog.typeOf(a);
  if(b == "object" || b == "array") {
    if(a.clone) {
      return a.clone()
    }
    var b = b == "array" ? [] : {}, c;
    for(c in a) {
      b[c] = goog.cloneObject(a[c])
    }
    return b
  }
  return a
};
goog.bindNative_ = function(a, b, c) {
  return a.call.apply(a.bind, arguments)
};
goog.bindJs_ = function(a, b, c) {
  if(!a) {
    throw Error();
  }
  if(arguments.length > 2) {
    var d = Array.prototype.slice.call(arguments, 2);
    return function() {
      var c = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(c, d);
      return a.apply(b, c)
    }
  }
  return function() {
    return a.apply(b, arguments)
  }
};
goog.bind = function(a, b, c) {
  goog.bind = Function.prototype.bind && Function.prototype.bind.toString().indexOf("native code") != -1 ? goog.bindNative_ : goog.bindJs_;
  return goog.bind.apply(null, arguments)
};
goog.partial = function(a, b) {
  var c = Array.prototype.slice.call(arguments, 1);
  return function() {
    var b = Array.prototype.slice.call(arguments);
    b.unshift.apply(b, c);
    return a.apply(this, b)
  }
};
goog.mixin = function(a, b) {
  for(var c in b) {
    a[c] = b[c]
  }
};
goog.now = Date.now || function() {
  return+new Date
};
goog.globalEval = function(a) {
  if(goog.global.execScript) {
    goog.global.execScript(a, "JavaScript")
  }else {
    if(goog.global.eval) {
      if(goog.evalWorksForGlobals_ == null) {
        goog.global.eval("var _et_ = 1;");
        if(typeof goog.global._et_ != "undefined") {
          delete goog.global._et_;
          goog.evalWorksForGlobals_ = true
        }else {
          goog.evalWorksForGlobals_ = false
        }
      }
      if(goog.evalWorksForGlobals_) {
        goog.global.eval(a)
      }else {
        var b = goog.global.document, c = b.createElement("script");
        c.type = "text/javascript";
        c.defer = false;
        c.appendChild(b.createTextNode(a));
        b.body.appendChild(c);
        b.body.removeChild(c)
      }
    }else {
      throw Error("goog.globalEval not available");
    }
  }
};
goog.evalWorksForGlobals_ = null;
goog.getCssName = function(a, b) {
  var c = function(a) {
    return goog.cssNameMapping_[a] || a
  }, d;
  d = goog.cssNameMapping_ ? goog.cssNameMappingStyle_ == "BY_WHOLE" ? c : function(a) {
    for(var a = a.split("-"), b = [], d = 0;d < a.length;d++) {
      b.push(c(a[d]))
    }
    return b.join("-")
  } : function(a) {
    return a
  };
  return b ? a + "-" + d(b) : d(a)
};
goog.setCssNameMapping = function(a, b) {
  goog.cssNameMapping_ = a;
  goog.cssNameMappingStyle_ = b
};
!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING && (goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING);
goog.getMsg = function(a, b) {
  var c = b || {}, d;
  for(d in c) {
    var e = ("" + c[d]).replace(/\$/g, "$$$$"), a = a.replace(RegExp("\\{\\$" + d + "\\}", "gi"), e)
  }
  return a
};
goog.exportSymbol = function(a, b, c) {
  goog.exportPath_(a, b, c)
};
goog.exportProperty = function(a, b, c) {
  a[b] = c
};
goog.inherits = function(a, b) {
  function c() {
  }
  c.prototype = b.prototype;
  a.superClass_ = b.prototype;
  a.prototype = new c;
  a.prototype.constructor = a
};
goog.base = function(a, b, c) {
  var d = arguments.callee.caller;
  if(d.superClass_) {
    return d.superClass_.constructor.apply(a, Array.prototype.slice.call(arguments, 1))
  }
  for(var e = Array.prototype.slice.call(arguments, 2), f = false, g = a.constructor;g;g = g.superClass_ && g.superClass_.constructor) {
    if(g.prototype[b] === d) {
      f = true
    }else {
      if(f) {
        return g.prototype[b].apply(a, e)
      }
    }
  }
  if(a[b] === d) {
    return a.constructor.prototype[b].apply(a, e)
  }
  throw Error("goog.base called from a method of one name to a method of a different name");
};
goog.scope = function(a) {
  a.call(goog.global)
};
goog.debug = {};
goog.debug.RelativeTimeProvider = function() {
  this.relativeTimeStart_ = goog.now()
};
goog.debug.RelativeTimeProvider.defaultInstance_ = new goog.debug.RelativeTimeProvider;
goog.debug.RelativeTimeProvider.prototype.set = function(a) {
  this.relativeTimeStart_ = a
};
goog.debug.RelativeTimeProvider.prototype.reset = function() {
  this.set(goog.now())
};
goog.debug.RelativeTimeProvider.prototype.get = function() {
  return this.relativeTimeStart_
};
goog.debug.RelativeTimeProvider.getDefaultInstance = function() {
  return goog.debug.RelativeTimeProvider.defaultInstance_
};
goog.string = {};
goog.string.Unicode = {NBSP:"\u00a0"};
goog.string.startsWith = function(a, b) {
  return 0 == a.lastIndexOf(b, 0)
};
goog.string.endsWith = function(a, b) {
  var c = a.length - b.length;
  return 0 <= c && a.indexOf(b, c) == c
};
goog.string.caseInsensitiveStartsWith = function(a, b) {
  return 0 == goog.string.caseInsensitiveCompare(b, a.substr(0, b.length))
};
goog.string.caseInsensitiveEndsWith = function(a, b) {
  return 0 == goog.string.caseInsensitiveCompare(b, a.substr(a.length - b.length, b.length))
};
goog.string.subs = function(a, b) {
  for(var c = 1;c < arguments.length;c++) {
    var d = ("" + arguments[c]).replace(/\$/g, "$$$$"), a = a.replace(/\%s/, d)
  }
  return a
};
goog.string.collapseWhitespace = function(a) {
  return a.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "")
};
goog.string.isEmpty = function(a) {
  return/^[\s\xa0]*$/.test(a)
};
goog.string.isEmptySafe = function(a) {
  return goog.string.isEmpty(goog.string.makeSafe(a))
};
goog.string.isBreakingWhitespace = function(a) {
  return!/[^\t\n\r ]/.test(a)
};
goog.string.isAlpha = function(a) {
  return!/[^a-zA-Z]/.test(a)
};
goog.string.isNumeric = function(a) {
  return!/[^0-9]/.test(a)
};
goog.string.isAlphaNumeric = function(a) {
  return!/[^a-zA-Z0-9]/.test(a)
};
goog.string.isSpace = function(a) {
  return" " == a
};
goog.string.isUnicodeChar = function(a) {
  return 1 == a.length && " " <= a && "~" >= a || "\u0080" <= a && "\ufffd" >= a
};
goog.string.stripNewlines = function(a) {
  return a.replace(/(\r\n|\r|\n)+/g, " ")
};
goog.string.canonicalizeNewlines = function(a) {
  return a.replace(/(\r\n|\r|\n)/g, "\n")
};
goog.string.normalizeWhitespace = function(a) {
  return a.replace(/\xa0|\s/g, " ")
};
goog.string.normalizeSpaces = function(a) {
  return a.replace(/\xa0|[ \t]+/g, " ")
};
goog.string.collapseBreakingSpaces = function(a) {
  return a.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "")
};
goog.string.trim = function(a) {
  return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "")
};
goog.string.trimLeft = function(a) {
  return a.replace(/^[\s\xa0]+/, "")
};
goog.string.trimRight = function(a) {
  return a.replace(/[\s\xa0]+$/, "")
};
goog.string.caseInsensitiveCompare = function(a, b) {
  var c = ("" + a).toLowerCase(), d = ("" + b).toLowerCase();
  return c < d ? -1 : c == d ? 0 : 1
};
goog.string.numerateCompareRegExp_ = /(\.\d+)|(\d+)|(\D+)/g;
goog.string.numerateCompare = function(a, b) {
  if(a == b) {
    return 0
  }
  if(!a) {
    return-1
  }
  if(!b) {
    return 1
  }
  for(var c = a.toLowerCase().match(goog.string.numerateCompareRegExp_), d = b.toLowerCase().match(goog.string.numerateCompareRegExp_), e = Math.min(c.length, d.length), f = 0;f < e;f++) {
    var g = c[f], h = d[f];
    if(g != h) {
      return c = parseInt(g, 10), !isNaN(c) && (d = parseInt(h, 10), !isNaN(d) && c - d) ? c - d : g < h ? -1 : 1
    }
  }
  return c.length != d.length ? c.length - d.length : a < b ? -1 : 1
};
goog.string.encodeUriRegExp_ = /^[a-zA-Z0-9\-_.!~*'()]*$/;
goog.string.urlEncode = function(a) {
  a = "" + a;
  return!goog.string.encodeUriRegExp_.test(a) ? encodeURIComponent(a) : a
};
goog.string.urlDecode = function(a) {
  return decodeURIComponent(a.replace(/\+/g, " "))
};
goog.string.newLineToBr = function(a, b) {
  return a.replace(/(\r\n|\r|\n)/g, b ? "<br />" : "<br>")
};
goog.string.htmlEscape = function(a, b) {
  if(b) {
    return a.replace(goog.string.amperRe_, "&amp;").replace(goog.string.ltRe_, "&lt;").replace(goog.string.gtRe_, "&gt;").replace(goog.string.quotRe_, "&quot;")
  }
  if(!goog.string.allRe_.test(a)) {
    return a
  }
  -1 != a.indexOf("&") && (a = a.replace(goog.string.amperRe_, "&amp;"));
  -1 != a.indexOf("<") && (a = a.replace(goog.string.ltRe_, "&lt;"));
  -1 != a.indexOf(">") && (a = a.replace(goog.string.gtRe_, "&gt;"));
  -1 != a.indexOf('"') && (a = a.replace(goog.string.quotRe_, "&quot;"));
  return a
};
goog.string.amperRe_ = /&/g;
goog.string.ltRe_ = /</g;
goog.string.gtRe_ = />/g;
goog.string.quotRe_ = /\"/g;
goog.string.allRe_ = /[&<>\"]/;
goog.string.unescapeEntities = function(a) {
  return goog.string.contains(a, "&") ? "document" in goog.global ? goog.string.unescapeEntitiesUsingDom_(a) : goog.string.unescapePureXmlEntities_(a) : a
};
goog.string.unescapeEntitiesUsingDom_ = function(a) {
  var b = {"&amp;":"&", "&lt;":"<", "&gt;":">", "&quot;":'"'}, c = document.createElement("div");
  return a.replace(goog.string.HTML_ENTITY_PATTERN_, function(a, e) {
    var f = b[a];
    if(f) {
      return f
    }
    if("#" == e.charAt(0)) {
      var g = Number("0" + e.substr(1));
      isNaN(g) || (f = String.fromCharCode(g))
    }
    f || (c.innerHTML = a + " ", f = c.firstChild.nodeValue.slice(0, -1));
    return b[a] = f
  })
};
goog.string.unescapePureXmlEntities_ = function(a) {
  return a.replace(/&([^;]+);/g, function(a, c) {
    switch(c) {
      case "amp":
        return"&";
      case "lt":
        return"<";
      case "gt":
        return">";
      case "quot":
        return'"';
      default:
        if("#" == c.charAt(0)) {
          var d = Number("0" + c.substr(1));
          if(!isNaN(d)) {
            return String.fromCharCode(d)
          }
        }
        return a
    }
  })
};
goog.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
goog.string.whitespaceEscape = function(a, b) {
  return goog.string.newLineToBr(a.replace(/  /g, " &#160;"), b)
};
goog.string.stripQuotes = function(a, b) {
  for(var c = b.length, d = 0;d < c;d++) {
    var e = 1 == c ? b : b.charAt(d);
    if(a.charAt(0) == e && a.charAt(a.length - 1) == e) {
      return a.substring(1, a.length - 1)
    }
  }
  return a
};
goog.string.truncate = function(a, b, c) {
  c && (a = goog.string.unescapeEntities(a));
  a.length > b && (a = a.substring(0, b - 3) + "...");
  c && (a = goog.string.htmlEscape(a));
  return a
};
goog.string.truncateMiddle = function(a, b, c, d) {
  c && (a = goog.string.unescapeEntities(a));
  if(d && a.length > b) {
    d > b && (d = b);
    var e = a.length - d, a = a.substring(0, b - d) + "..." + a.substring(e)
  }else {
    a.length > b && (d = Math.floor(b / 2), e = a.length - d, a = a.substring(0, d + b % 2) + "..." + a.substring(e))
  }
  c && (a = goog.string.htmlEscape(a));
  return a
};
goog.string.specialEscapeChars_ = {"\x00":"\\0", "\u0008":"\\b", "\u000c":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\x0B", '"':'\\"', "\\":"\\\\"};
goog.string.jsEscapeCache_ = {"'":"\\'"};
goog.string.quote = function(a) {
  a = "" + a;
  if(a.quote) {
    return a.quote()
  }
  for(var b = ['"'], c = 0;c < a.length;c++) {
    var d = a.charAt(c), e = d.charCodeAt(0);
    b[c + 1] = goog.string.specialEscapeChars_[d] || (31 < e && 127 > e ? d : goog.string.escapeChar(d))
  }
  b.push('"');
  return b.join("")
};
goog.string.escapeString = function(a) {
  for(var b = [], c = 0;c < a.length;c++) {
    b[c] = goog.string.escapeChar(a.charAt(c))
  }
  return b.join("")
};
goog.string.escapeChar = function(a) {
  if(a in goog.string.jsEscapeCache_) {
    return goog.string.jsEscapeCache_[a]
  }
  if(a in goog.string.specialEscapeChars_) {
    return goog.string.jsEscapeCache_[a] = goog.string.specialEscapeChars_[a]
  }
  var b = a, c = a.charCodeAt(0);
  if(31 < c && 127 > c) {
    b = a
  }else {
    if(256 > c) {
      if(b = "\\x", 16 > c || 256 < c) {
        b += "0"
      }
    }else {
      b = "\\u", 4096 > c && (b += "0")
    }
    b += c.toString(16).toUpperCase()
  }
  return goog.string.jsEscapeCache_[a] = b
};
goog.string.toMap = function(a) {
  for(var b = {}, c = 0;c < a.length;c++) {
    b[a.charAt(c)] = !0
  }
  return b
};
goog.string.contains = function(a, b) {
  return-1 != a.indexOf(b)
};
goog.string.countOf = function(a, b) {
  return a && b ? a.split(b).length - 1 : 0
};
goog.string.removeAt = function(a, b, c) {
  var d = a;
  0 <= b && b < a.length && 0 < c && (d = a.substr(0, b) + a.substr(b + c, a.length - b - c));
  return d
};
goog.string.remove = function(a, b) {
  var c = RegExp(goog.string.regExpEscape(b), "");
  return a.replace(c, "")
};
goog.string.removeAll = function(a, b) {
  var c = RegExp(goog.string.regExpEscape(b), "g");
  return a.replace(c, "")
};
goog.string.regExpEscape = function(a) {
  return("" + a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08")
};
goog.string.repeat = function(a, b) {
  return Array(b + 1).join(a)
};
goog.string.padNumber = function(a, b, c) {
  a = goog.isDef(c) ? a.toFixed(c) : "" + a;
  c = a.indexOf(".");
  -1 == c && (c = a.length);
  return goog.string.repeat("0", Math.max(0, b - c)) + a
};
goog.string.makeSafe = function(a) {
  return null == a ? "" : "" + a
};
goog.string.buildString = function(a) {
  return Array.prototype.join.call(arguments, "")
};
goog.string.getRandomString = function() {
  return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ goog.now()).toString(36)
};
goog.string.compareVersions = function(a, b) {
  for(var c = 0, d = goog.string.trim("" + a).split("."), e = goog.string.trim("" + b).split("."), f = Math.max(d.length, e.length), g = 0;0 == c && g < f;g++) {
    var h = d[g] || "", j = e[g] || "", m = RegExp("(\\d*)(\\D*)", "g"), i = RegExp("(\\d*)(\\D*)", "g");
    do {
      var n = m.exec(h) || ["", "", ""], l = i.exec(j) || ["", "", ""];
      if(0 == n[0].length && 0 == l[0].length) {
        break
      }
      var c = 0 == n[1].length ? 0 : parseInt(n[1], 10), k = 0 == l[1].length ? 0 : parseInt(l[1], 10), c = goog.string.compareElements_(c, k) || goog.string.compareElements_(0 == n[2].length, 0 == l[2].length) || goog.string.compareElements_(n[2], l[2])
    }while(0 == c)
  }
  return c
};
goog.string.compareElements_ = function(a, b) {
  return a < b ? -1 : a > b ? 1 : 0
};
goog.string.HASHCODE_MAX_ = 4294967296;
goog.string.hashCode = function(a) {
  for(var b = 0, c = 0;c < a.length;++c) {
    b = 31 * b + a.charCodeAt(c), b %= goog.string.HASHCODE_MAX_
  }
  return b
};
goog.string.uniqueStringCounter_ = 2147483648 * Math.random() | 0;
goog.string.createUniqueString = function() {
  return"goog_" + goog.string.uniqueStringCounter_++
};
goog.string.toNumber = function(a) {
  var b = Number(a);
  return 0 == b && goog.string.isEmpty(a) ? NaN : b
};
goog.string.toCamelCaseCache_ = {};
goog.string.toCamelCase = function(a) {
  return goog.string.toCamelCaseCache_[a] || (goog.string.toCamelCaseCache_[a] = ("" + a).replace(/\-([a-z])/g, function(a, c) {
    return c.toUpperCase()
  }))
};
goog.string.toSelectorCaseCache_ = {};
goog.string.toSelectorCase = function(a) {
  return goog.string.toSelectorCaseCache_[a] || (goog.string.toSelectorCaseCache_[a] = ("" + a).replace(/([A-Z])/g, "-$1").toLowerCase())
};
goog.debug.Formatter = function(a) {
  this.prefix_ = a || "";
  this.startTimeProvider_ = goog.debug.RelativeTimeProvider.getDefaultInstance()
};
goog.debug.Formatter.prototype.showAbsoluteTime = !0;
goog.debug.Formatter.prototype.showRelativeTime = !0;
goog.debug.Formatter.prototype.showLoggerName = !0;
goog.debug.Formatter.prototype.showExceptionText = !1;
goog.debug.Formatter.prototype.showSeverityLevel = !1;
goog.debug.Formatter.prototype.setStartTimeProvider = function(a) {
  this.startTimeProvider_ = a
};
goog.debug.Formatter.prototype.getStartTimeProvider = function() {
  return this.startTimeProvider_
};
goog.debug.Formatter.prototype.resetRelativeTimeStart = function() {
  this.startTimeProvider_.reset()
};
goog.debug.Formatter.getDateTimeStamp_ = function(a) {
  a = new Date(a.getMillis());
  return goog.debug.Formatter.getTwoDigitString_(a.getFullYear() - 2E3) + goog.debug.Formatter.getTwoDigitString_(a.getMonth() + 1) + goog.debug.Formatter.getTwoDigitString_(a.getDate()) + " " + goog.debug.Formatter.getTwoDigitString_(a.getHours()) + ":" + goog.debug.Formatter.getTwoDigitString_(a.getMinutes()) + ":" + goog.debug.Formatter.getTwoDigitString_(a.getSeconds()) + "." + goog.debug.Formatter.getTwoDigitString_(Math.floor(a.getMilliseconds() / 10))
};
goog.debug.Formatter.getTwoDigitString_ = function(a) {
  return 10 > a ? "0" + a : "" + a
};
goog.debug.Formatter.getRelativeTime_ = function(a, b) {
  var c = (a.getMillis() - b) / 1E3, d = c.toFixed(3), e = 0;
  if(1 > c) {
    e = 2
  }else {
    for(;100 > c;) {
      e++, c *= 10
    }
  }
  for(;0 < e--;) {
    d = " " + d
  }
  return d
};
goog.debug.HtmlFormatter = function(a) {
  goog.debug.Formatter.call(this, a)
};
goog.inherits(goog.debug.HtmlFormatter, goog.debug.Formatter);
goog.debug.HtmlFormatter.prototype.showExceptionText = !0;
goog.debug.HtmlFormatter.prototype.formatRecord = function(a) {
  var b;
  switch(a.getLevel().value) {
    case goog.debug.Logger.Level.SHOUT.value:
      b = "dbg-sh";
      break;
    case goog.debug.Logger.Level.SEVERE.value:
      b = "dbg-sev";
      break;
    case goog.debug.Logger.Level.WARNING.value:
      b = "dbg-w";
      break;
    case goog.debug.Logger.Level.INFO.value:
      b = "dbg-i";
      break;
    default:
      b = "dbg-f"
  }
  var c = [];
  c.push(this.prefix_, " ");
  this.showAbsoluteTime && c.push("[", goog.debug.Formatter.getDateTimeStamp_(a), "] ");
  this.showRelativeTime && c.push("[", goog.string.whitespaceEscape(goog.debug.Formatter.getRelativeTime_(a, this.startTimeProvider_.get())), "s] ");
  this.showLoggerName && c.push("[", goog.string.htmlEscape(a.getLoggerName()), "] ");
  c.push('<span class="', b, '">', goog.string.newLineToBr(goog.string.whitespaceEscape(goog.string.htmlEscape(a.getMessage()))));
  this.showExceptionText && a.getException() && c.push("<br>", goog.string.newLineToBr(goog.string.whitespaceEscape(a.getExceptionText() || "")));
  c.push("</span><br>");
  return c.join("")
};
goog.debug.TextFormatter = function(a) {
  goog.debug.Formatter.call(this, a)
};
goog.inherits(goog.debug.TextFormatter, goog.debug.Formatter);
goog.debug.TextFormatter.prototype.formatRecord = function(a) {
  var b = [];
  b.push(this.prefix_, " ");
  this.showAbsoluteTime && b.push("[", goog.debug.Formatter.getDateTimeStamp_(a), "] ");
  this.showRelativeTime && b.push("[", goog.debug.Formatter.getRelativeTime_(a, this.startTimeProvider_.get()), "s] ");
  this.showLoggerName && b.push("[", a.getLoggerName(), "] ");
  this.showSeverityLevel && b.push("[", a.getLevel().name, "] ");
  b.push(a.getMessage(), "\n");
  this.showExceptionText && a.getException() && b.push(a.getExceptionText(), "\n");
  return b.join("")
};
goog.debug.Error = function(a) {
  this.stack = Error().stack || "";
  a && (this.message = "" + a)
};
goog.inherits(goog.debug.Error, Error);
goog.debug.Error.prototype.name = "CustomError";
goog.asserts = {};
goog.asserts.ENABLE_ASSERTS = goog.DEBUG;
goog.asserts.AssertionError = function(a, b) {
  b.unshift(a);
  goog.debug.Error.call(this, goog.string.subs.apply(null, b));
  b.shift();
  this.messagePattern = a
};
goog.inherits(goog.asserts.AssertionError, goog.debug.Error);
goog.asserts.AssertionError.prototype.name = "AssertionError";
goog.asserts.doAssertFailure_ = function(a, b, c, d) {
  var e = "Assertion failed";
  if(c) {
    var e = e + (": " + c), f = d
  }else {
    a && (e += ": " + a, f = b)
  }
  throw new goog.asserts.AssertionError("" + e, f || []);
};
goog.asserts.assert = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !a && goog.asserts.doAssertFailure_("", null, b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.fail = function(a, b) {
  if(goog.asserts.ENABLE_ASSERTS) {
    throw new goog.asserts.AssertionError("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1));
  }
};
goog.asserts.assertNumber = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isNumber(a) && goog.asserts.doAssertFailure_("Expected number but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertString = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isString(a) && goog.asserts.doAssertFailure_("Expected string but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertFunction = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isFunction(a) && goog.asserts.doAssertFailure_("Expected function but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertObject = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isObject(a) && goog.asserts.doAssertFailure_("Expected object but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertArray = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isArray(a) && goog.asserts.doAssertFailure_("Expected array but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertBoolean = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(a) && goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertInstanceof = function(a, b, c, d) {
  goog.asserts.ENABLE_ASSERTS && !(a instanceof b) && goog.asserts.doAssertFailure_("instanceof check failed.", null, c, Array.prototype.slice.call(arguments, 3))
};
goog.array = {};
goog.NATIVE_ARRAY_PROTOTYPES = !0;
goog.array.peek = function(a) {
  return a[a.length - 1]
};
goog.array.ARRAY_PROTOTYPE_ = Array.prototype;
goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.indexOf ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.indexOf.call(a, b, c)
} : function(a, b, c) {
  c = null == c ? 0 : 0 > c ? Math.max(0, a.length + c) : c;
  if(goog.isString(a)) {
    return!goog.isString(b) || 1 != b.length ? -1 : a.indexOf(b, c)
  }
  for(;c < a.length;c++) {
    if(c in a && a[c] === b) {
      return c
    }
  }
  return-1
};
goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.lastIndexOf ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.lastIndexOf.call(a, b, null == c ? a.length - 1 : c)
} : function(a, b, c) {
  c = null == c ? a.length - 1 : c;
  0 > c && (c = Math.max(0, a.length + c));
  if(goog.isString(a)) {
    return!goog.isString(b) || 1 != b.length ? -1 : a.lastIndexOf(b, c)
  }
  for(;0 <= c;c--) {
    if(c in a && a[c] === b) {
      return c
    }
  }
  return-1
};
goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.forEach ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  goog.array.ARRAY_PROTOTYPE_.forEach.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    f in e && b.call(c, e[f], f, a)
  }
};
goog.array.forEachRight = function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, d = d - 1;0 <= d;--d) {
    d in e && b.call(c, e[d], d, a)
  }
};
goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.filter ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.filter.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = [], f = 0, g = goog.isString(a) ? a.split("") : a, h = 0;h < d;h++) {
    if(h in g) {
      var j = g[h];
      b.call(c, j, h, a) && (e[f++] = j)
    }
  }
  return e
};
goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.map ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.map.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = Array(d), f = goog.isString(a) ? a.split("") : a, g = 0;g < d;g++) {
    g in f && (e[g] = b.call(c, f[g], g, a))
  }
  return e
};
goog.array.reduce = function(a, b, c, d) {
  if(a.reduce) {
    return d ? a.reduce(goog.bind(b, d), c) : a.reduce(b, c)
  }
  var e = c;
  goog.array.forEach(a, function(c, g) {
    e = b.call(d, e, c, g, a)
  });
  return e
};
goog.array.reduceRight = function(a, b, c, d) {
  if(a.reduceRight) {
    return d ? a.reduceRight(goog.bind(b, d), c) : a.reduceRight(b, c)
  }
  var e = c;
  goog.array.forEachRight(a, function(c, g) {
    e = b.call(d, e, c, g, a)
  });
  return e
};
goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.some ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.some.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && b.call(c, e[f], f, a)) {
      return!0
    }
  }
  return!1
};
goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.every ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.every.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && !b.call(c, e[f], f, a)) {
      return!1
    }
  }
  return!0
};
goog.array.find = function(a, b, c) {
  b = goog.array.findIndex(a, b, c);
  return 0 > b ? null : goog.isString(a) ? a.charAt(b) : a[b]
};
goog.array.findIndex = function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && b.call(c, e[f], f, a)) {
      return f
    }
  }
  return-1
};
goog.array.findRight = function(a, b, c) {
  b = goog.array.findIndexRight(a, b, c);
  return 0 > b ? null : goog.isString(a) ? a.charAt(b) : a[b]
};
goog.array.findIndexRight = function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, d = d - 1;0 <= d;d--) {
    if(d in e && b.call(c, e[d], d, a)) {
      return d
    }
  }
  return-1
};
goog.array.contains = function(a, b) {
  return 0 <= goog.array.indexOf(a, b)
};
goog.array.isEmpty = function(a) {
  return 0 == a.length
};
goog.array.clear = function(a) {
  if(!goog.isArray(a)) {
    for(var b = a.length - 1;0 <= b;b--) {
      delete a[b]
    }
  }
  a.length = 0
};
goog.array.insert = function(a, b) {
  goog.array.contains(a, b) || a.push(b)
};
goog.array.insertAt = function(a, b, c) {
  goog.array.splice(a, c, 0, b)
};
goog.array.insertArrayAt = function(a, b, c) {
  goog.partial(goog.array.splice, a, c, 0).apply(null, b)
};
goog.array.insertBefore = function(a, b, c) {
  var d;
  2 == arguments.length || 0 > (d = goog.array.indexOf(a, c)) ? a.push(b) : goog.array.insertAt(a, b, d)
};
goog.array.remove = function(a, b) {
  var c = goog.array.indexOf(a, b), d;
  (d = 0 <= c) && goog.array.removeAt(a, c);
  return d
};
goog.array.removeAt = function(a, b) {
  goog.asserts.assert(null != a.length);
  return 1 == goog.array.ARRAY_PROTOTYPE_.splice.call(a, b, 1).length
};
goog.array.removeIf = function(a, b, c) {
  b = goog.array.findIndex(a, b, c);
  return 0 <= b ? (goog.array.removeAt(a, b), !0) : !1
};
goog.array.concat = function(a) {
  return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments)
};
goog.array.clone = function(a) {
  if(goog.isArray(a)) {
    return goog.array.concat(a)
  }
  for(var b = [], c = 0, d = a.length;c < d;c++) {
    b[c] = a[c]
  }
  return b
};
goog.array.toArray = function(a) {
  return goog.isArray(a) ? goog.array.concat(a) : goog.array.clone(a)
};
goog.array.extend = function(a, b) {
  for(var c = 1;c < arguments.length;c++) {
    var d = arguments[c], e;
    if(goog.isArray(d) || (e = goog.isArrayLike(d)) && d.hasOwnProperty("callee")) {
      a.push.apply(a, d)
    }else {
      if(e) {
        for(var f = a.length, g = d.length, h = 0;h < g;h++) {
          a[f + h] = d[h]
        }
      }else {
        a.push(d)
      }
    }
  }
};
goog.array.splice = function(a, b, c, d) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.splice.apply(a, goog.array.slice(arguments, 1))
};
goog.array.slice = function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return 2 >= arguments.length ? goog.array.ARRAY_PROTOTYPE_.slice.call(a, b) : goog.array.ARRAY_PROTOTYPE_.slice.call(a, b, c)
};
goog.array.removeDuplicates = function(a, b) {
  for(var c = b || a, d = {}, e = 0, f = 0;f < a.length;) {
    var g = a[f++], h = goog.isObject(g) ? "o" + goog.getUid(g) : (typeof g).charAt(0) + g;
    Object.prototype.hasOwnProperty.call(d, h) || (d[h] = !0, c[e++] = g)
  }
  c.length = e
};
goog.array.binarySearch = function(a, b, c) {
  return goog.array.binarySearch_(a, c || goog.array.defaultCompare, !1, b)
};
goog.array.binarySelect = function(a, b, c) {
  return goog.array.binarySearch_(a, b, !0, void 0, c)
};
goog.array.binarySearch_ = function(a, b, c, d, e) {
  for(var f = 0, g = a.length, h;f < g;) {
    var j = f + g >> 1, m;
    m = c ? b.call(e, a[j], j, a) : b(d, a[j]);
    0 < m ? f = j + 1 : (g = j, h = !m)
  }
  return h ? f : ~f
};
goog.array.sort = function(a, b) {
  goog.asserts.assert(null != a.length);
  goog.array.ARRAY_PROTOTYPE_.sort.call(a, b || goog.array.defaultCompare)
};
goog.array.stableSort = function(a, b) {
  for(var c = 0;c < a.length;c++) {
    a[c] = {index:c, value:a[c]}
  }
  var d = b || goog.array.defaultCompare;
  goog.array.sort(a, function(a, b) {
    return d(a.value, b.value) || a.index - b.index
  });
  for(c = 0;c < a.length;c++) {
    a[c] = a[c].value
  }
};
goog.array.sortObjectsByKey = function(a, b, c) {
  var d = c || goog.array.defaultCompare;
  goog.array.sort(a, function(a, c) {
    return d(a[b], c[b])
  })
};
goog.array.isSorted = function(a, b, c) {
  for(var b = b || goog.array.defaultCompare, d = 1;d < a.length;d++) {
    var e = b(a[d - 1], a[d]);
    if(0 < e || 0 == e && c) {
      return!1
    }
  }
  return!0
};
goog.array.equals = function(a, b, c) {
  if(!goog.isArrayLike(a) || !goog.isArrayLike(b) || a.length != b.length) {
    return!1
  }
  for(var d = a.length, c = c || goog.array.defaultCompareEquality, e = 0;e < d;e++) {
    if(!c(a[e], b[e])) {
      return!1
    }
  }
  return!0
};
goog.array.compare = function(a, b, c) {
  return goog.array.equals(a, b, c)
};
goog.array.compare3 = function(a, b, c) {
  for(var c = c || goog.array.defaultCompare, d = Math.min(a.length, b.length), e = 0;e < d;e++) {
    var f = c(a[e], b[e]);
    if(0 != f) {
      return f
    }
  }
  return goog.array.defaultCompare(a.length, b.length)
};
goog.array.defaultCompare = function(a, b) {
  return a > b ? 1 : a < b ? -1 : 0
};
goog.array.defaultCompareEquality = function(a, b) {
  return a === b
};
goog.array.binaryInsert = function(a, b, c) {
  c = goog.array.binarySearch(a, b, c);
  return 0 > c ? (goog.array.insertAt(a, b, -(c + 1)), !0) : !1
};
goog.array.binaryRemove = function(a, b, c) {
  b = goog.array.binarySearch(a, b, c);
  return 0 <= b ? goog.array.removeAt(a, b) : !1
};
goog.array.bucket = function(a, b) {
  for(var c = {}, d = 0;d < a.length;d++) {
    var e = a[d], f = b(e, d, a);
    goog.isDef(f) && (c[f] || (c[f] = [])).push(e)
  }
  return c
};
goog.array.repeat = function(a, b) {
  for(var c = [], d = 0;d < b;d++) {
    c[d] = a
  }
  return c
};
goog.array.flatten = function(a) {
  for(var b = [], c = 0;c < arguments.length;c++) {
    var d = arguments[c];
    goog.isArray(d) ? b.push.apply(b, goog.array.flatten.apply(null, d)) : b.push(d)
  }
  return b
};
goog.array.rotate = function(a, b) {
  goog.asserts.assert(null != a.length);
  a.length && (b %= a.length, 0 < b ? goog.array.ARRAY_PROTOTYPE_.unshift.apply(a, a.splice(-b, b)) : 0 > b && goog.array.ARRAY_PROTOTYPE_.push.apply(a, a.splice(0, -b)));
  return a
};
goog.array.zip = function(a) {
  if(!arguments.length) {
    return[]
  }
  for(var b = [], c = 0;;c++) {
    for(var d = [], e = 0;e < arguments.length;e++) {
      var f = arguments[e];
      if(c >= f.length) {
        return b
      }
      d.push(f[c])
    }
    b.push(d)
  }
};
goog.array.shuffle = function(a, b) {
  for(var c = b || Math.random, d = a.length - 1;0 < d;d--) {
    var e = Math.floor(c() * (d + 1)), f = a[d];
    a[d] = a[e];
    a[e] = f
  }
};
goog.object = {};
goog.object.forEach = function(a, b, c) {
  for(var d in a) {
    b.call(c, a[d], d, a)
  }
};
goog.object.filter = function(a, b, c) {
  var d = {}, e;
  for(e in a) {
    b.call(c, a[e], e, a) && (d[e] = a[e])
  }
  return d
};
goog.object.map = function(a, b, c) {
  var d = {}, e;
  for(e in a) {
    d[e] = b.call(c, a[e], e, a)
  }
  return d
};
goog.object.some = function(a, b, c) {
  for(var d in a) {
    if(b.call(c, a[d], d, a)) {
      return!0
    }
  }
  return!1
};
goog.object.every = function(a, b, c) {
  for(var d in a) {
    if(!b.call(c, a[d], d, a)) {
      return!1
    }
  }
  return!0
};
goog.object.getCount = function(a) {
  var b = 0, c;
  for(c in a) {
    b++
  }
  return b
};
goog.object.getAnyKey = function(a) {
  for(var b in a) {
    return b
  }
};
goog.object.getAnyValue = function(a) {
  for(var b in a) {
    return a[b]
  }
};
goog.object.contains = function(a, b) {
  return goog.object.containsValue(a, b)
};
goog.object.getValues = function(a) {
  var b = [], c = 0, d;
  for(d in a) {
    b[c++] = a[d]
  }
  return b
};
goog.object.getKeys = function(a) {
  var b = [], c = 0, d;
  for(d in a) {
    b[c++] = d
  }
  return b
};
goog.object.getValueByKeys = function(a, b) {
  for(var c = goog.isArrayLike(b), d = c ? b : arguments, c = c ? 0 : 1;c < d.length && !(a = a[d[c]], !goog.isDef(a));c++) {
  }
  return a
};
goog.object.containsKey = function(a, b) {
  return b in a
};
goog.object.containsValue = function(a, b) {
  for(var c in a) {
    if(a[c] == b) {
      return!0
    }
  }
  return!1
};
goog.object.findKey = function(a, b, c) {
  for(var d in a) {
    if(b.call(c, a[d], d, a)) {
      return d
    }
  }
};
goog.object.findValue = function(a, b, c) {
  return(b = goog.object.findKey(a, b, c)) && a[b]
};
goog.object.isEmpty = function(a) {
  for(var b in a) {
    return!1
  }
  return!0
};
goog.object.clear = function(a) {
  for(var b in a) {
    delete a[b]
  }
};
goog.object.remove = function(a, b) {
  var c;
  (c = b in a) && delete a[b];
  return c
};
goog.object.add = function(a, b, c) {
  if(b in a) {
    throw Error('The object already contains the key "' + b + '"');
  }
  goog.object.set(a, b, c)
};
goog.object.get = function(a, b, c) {
  return b in a ? a[b] : c
};
goog.object.set = function(a, b, c) {
  a[b] = c
};
goog.object.setIfUndefined = function(a, b, c) {
  return b in a ? a[b] : a[b] = c
};
goog.object.clone = function(a) {
  var b = {}, c;
  for(c in a) {
    b[c] = a[c]
  }
  return b
};
goog.object.unsafeClone = function(a) {
  var b = goog.typeOf(a);
  if("object" == b || "array" == b) {
    if(a.clone) {
      return a.clone()
    }
    var b = "array" == b ? [] : {}, c;
    for(c in a) {
      b[c] = goog.object.unsafeClone(a[c])
    }
    return b
  }
  return a
};
goog.object.transpose = function(a) {
  var b = {}, c;
  for(c in a) {
    b[a[c]] = c
  }
  return b
};
goog.object.PROTOTYPE_FIELDS_ = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",");
goog.object.extend = function(a, b) {
  for(var c, d, e = 1;e < arguments.length;e++) {
    d = arguments[e];
    for(c in d) {
      a[c] = d[c]
    }
    for(var f = 0;f < goog.object.PROTOTYPE_FIELDS_.length;f++) {
      c = goog.object.PROTOTYPE_FIELDS_[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c])
    }
  }
};
goog.object.create = function(a) {
  var b = arguments.length;
  if(1 == b && goog.isArray(arguments[0])) {
    return goog.object.create.apply(null, arguments[0])
  }
  if(b % 2) {
    throw Error("Uneven number of arguments");
  }
  for(var c = {}, d = 0;d < b;d += 2) {
    c[arguments[d]] = arguments[d + 1]
  }
  return c
};
goog.object.createSet = function(a) {
  var b = arguments.length;
  if(1 == b && goog.isArray(arguments[0])) {
    return goog.object.createSet.apply(null, arguments[0])
  }
  for(var c = {}, d = 0;d < b;d++) {
    c[arguments[d]] = !0
  }
  return c
};
goog.structs = {};
goog.structs.getCount = function(a) {
  return"function" == typeof a.getCount ? a.getCount() : goog.isArrayLike(a) || goog.isString(a) ? a.length : goog.object.getCount(a)
};
goog.structs.getValues = function(a) {
  if("function" == typeof a.getValues) {
    return a.getValues()
  }
  if(goog.isString(a)) {
    return a.split("")
  }
  if(goog.isArrayLike(a)) {
    for(var b = [], c = a.length, d = 0;d < c;d++) {
      b.push(a[d])
    }
    return b
  }
  return goog.object.getValues(a)
};
goog.structs.getKeys = function(a) {
  if("function" == typeof a.getKeys) {
    return a.getKeys()
  }
  if("function" != typeof a.getValues) {
    if(goog.isArrayLike(a) || goog.isString(a)) {
      for(var b = [], a = a.length, c = 0;c < a;c++) {
        b.push(c)
      }
      return b
    }
    return goog.object.getKeys(a)
  }
};
goog.structs.contains = function(a, b) {
  return"function" == typeof a.contains ? a.contains(b) : "function" == typeof a.containsValue ? a.containsValue(b) : goog.isArrayLike(a) || goog.isString(a) ? goog.array.contains(a, b) : goog.object.containsValue(a, b)
};
goog.structs.isEmpty = function(a) {
  return"function" == typeof a.isEmpty ? a.isEmpty() : goog.isArrayLike(a) || goog.isString(a) ? goog.array.isEmpty(a) : goog.object.isEmpty(a)
};
goog.structs.clear = function(a) {
  "function" == typeof a.clear ? a.clear() : goog.isArrayLike(a) ? goog.array.clear(a) : goog.object.clear(a)
};
goog.structs.forEach = function(a, b, c) {
  if("function" == typeof a.forEach) {
    a.forEach(b, c)
  }else {
    if(goog.isArrayLike(a) || goog.isString(a)) {
      goog.array.forEach(a, b, c)
    }else {
      for(var d = goog.structs.getKeys(a), e = goog.structs.getValues(a), f = e.length, g = 0;g < f;g++) {
        b.call(c, e[g], d && d[g], a)
      }
    }
  }
};
goog.structs.filter = function(a, b, c) {
  if("function" == typeof a.filter) {
    return a.filter(b, c)
  }
  if(goog.isArrayLike(a) || goog.isString(a)) {
    return goog.array.filter(a, b, c)
  }
  var d, e = goog.structs.getKeys(a), f = goog.structs.getValues(a), g = f.length;
  if(e) {
    d = {};
    for(var h = 0;h < g;h++) {
      b.call(c, f[h], e[h], a) && (d[e[h]] = f[h])
    }
  }else {
    d = [];
    for(h = 0;h < g;h++) {
      b.call(c, f[h], void 0, a) && d.push(f[h])
    }
  }
  return d
};
goog.structs.map = function(a, b, c) {
  if("function" == typeof a.map) {
    return a.map(b, c)
  }
  if(goog.isArrayLike(a) || goog.isString(a)) {
    return goog.array.map(a, b, c)
  }
  var d, e = goog.structs.getKeys(a), f = goog.structs.getValues(a), g = f.length;
  if(e) {
    d = {};
    for(var h = 0;h < g;h++) {
      d[e[h]] = b.call(c, f[h], e[h], a)
    }
  }else {
    d = [];
    for(h = 0;h < g;h++) {
      d[h] = b.call(c, f[h], void 0, a)
    }
  }
  return d
};
goog.structs.some = function(a, b, c) {
  if("function" == typeof a.some) {
    return a.some(b, c)
  }
  if(goog.isArrayLike(a) || goog.isString(a)) {
    return goog.array.some(a, b, c)
  }
  for(var d = goog.structs.getKeys(a), e = goog.structs.getValues(a), f = e.length, g = 0;g < f;g++) {
    if(b.call(c, e[g], d && d[g], a)) {
      return!0
    }
  }
  return!1
};
goog.structs.every = function(a, b, c) {
  if("function" == typeof a.every) {
    return a.every(b, c)
  }
  if(goog.isArrayLike(a) || goog.isString(a)) {
    return goog.array.every(a, b, c)
  }
  for(var d = goog.structs.getKeys(a), e = goog.structs.getValues(a), f = e.length, g = 0;g < f;g++) {
    if(!b.call(c, e[g], d && d[g], a)) {
      return!1
    }
  }
  return!0
};
goog.structs.Collection = function() {
};
goog.iter = {};
goog.iter.StopIteration = "StopIteration" in goog.global ? goog.global.StopIteration : Error("StopIteration");
goog.iter.Iterator = function() {
};
goog.iter.Iterator.prototype.next = function() {
  throw goog.iter.StopIteration;
};
goog.iter.Iterator.prototype.__iterator__ = function() {
  return this
};
goog.iter.toIterator = function(a) {
  if(a instanceof goog.iter.Iterator) {
    return a
  }
  if("function" == typeof a.__iterator__) {
    return a.__iterator__(!1)
  }
  if(goog.isArrayLike(a)) {
    var b = 0, c = new goog.iter.Iterator;
    c.next = function() {
      for(;;) {
        if(b >= a.length) {
          throw goog.iter.StopIteration;
        }
        if(b in a) {
          return a[b++]
        }
        b++
      }
    };
    return c
  }
  throw Error("Not implemented");
};
goog.iter.forEach = function(a, b, c) {
  if(goog.isArrayLike(a)) {
    try {
      goog.array.forEach(a, b, c)
    }catch(d) {
      if(d !== goog.iter.StopIteration) {
        throw d;
      }
    }
  }else {
    a = goog.iter.toIterator(a);
    try {
      for(;;) {
        b.call(c, a.next(), void 0, a)
      }
    }catch(e) {
      if(e !== goog.iter.StopIteration) {
        throw e;
      }
    }
  }
};
goog.iter.filter = function(a, b, c) {
  var a = goog.iter.toIterator(a), d = new goog.iter.Iterator;
  d.next = function() {
    for(;;) {
      var d = a.next();
      if(b.call(c, d, void 0, a)) {
        return d
      }
    }
  };
  return d
};
goog.iter.range = function(a, b, c) {
  var d = 0, e = a, f = c || 1;
  1 < arguments.length && (d = a, e = b);
  if(0 == f) {
    throw Error("Range step argument must not be zero");
  }
  var g = new goog.iter.Iterator;
  g.next = function() {
    if(f > 0 && d >= e || f < 0 && d <= e) {
      throw goog.iter.StopIteration;
    }
    var a = d;
    d = d + f;
    return a
  };
  return g
};
goog.iter.join = function(a, b) {
  return goog.iter.toArray(a).join(b)
};
goog.iter.map = function(a, b, c) {
  var a = goog.iter.toIterator(a), d = new goog.iter.Iterator;
  d.next = function() {
    for(;;) {
      var d = a.next();
      return b.call(c, d, void 0, a)
    }
  };
  return d
};
goog.iter.reduce = function(a, b, c, d) {
  var e = c;
  goog.iter.forEach(a, function(a) {
    e = b.call(d, e, a)
  });
  return e
};
goog.iter.some = function(a, b, c) {
  a = goog.iter.toIterator(a);
  try {
    for(;;) {
      if(b.call(c, a.next(), void 0, a)) {
        return!0
      }
    }
  }catch(d) {
    if(d !== goog.iter.StopIteration) {
      throw d;
    }
  }
  return!1
};
goog.iter.every = function(a, b, c) {
  a = goog.iter.toIterator(a);
  try {
    for(;;) {
      if(!b.call(c, a.next(), void 0, a)) {
        return!1
      }
    }
  }catch(d) {
    if(d !== goog.iter.StopIteration) {
      throw d;
    }
  }
  return!0
};
goog.iter.chain = function(a) {
  var b = arguments, c = b.length, d = 0, e = new goog.iter.Iterator;
  e.next = function() {
    try {
      if(d >= c) {
        throw goog.iter.StopIteration;
      }
      return goog.iter.toIterator(b[d]).next()
    }catch(a) {
      if(a !== goog.iter.StopIteration || d >= c) {
        throw a;
      }
      d++;
      return this.next()
    }
  };
  return e
};
goog.iter.dropWhile = function(a, b, c) {
  var a = goog.iter.toIterator(a), d = new goog.iter.Iterator, e = !0;
  d.next = function() {
    for(;;) {
      var d = a.next();
      if(!e || !b.call(c, d, void 0, a)) {
        return e = !1, d
      }
    }
  };
  return d
};
goog.iter.takeWhile = function(a, b, c) {
  var a = goog.iter.toIterator(a), d = new goog.iter.Iterator, e = !0;
  d.next = function() {
    for(;;) {
      if(e) {
        var d = a.next();
        if(b.call(c, d, void 0, a)) {
          return d
        }
        e = !1
      }else {
        throw goog.iter.StopIteration;
      }
    }
  };
  return d
};
goog.iter.toArray = function(a) {
  if(goog.isArrayLike(a)) {
    return goog.array.toArray(a)
  }
  var a = goog.iter.toIterator(a), b = [];
  goog.iter.forEach(a, function(a) {
    b.push(a)
  });
  return b
};
goog.iter.equals = function(a, b) {
  var a = goog.iter.toIterator(a), b = goog.iter.toIterator(b), c, d;
  try {
    for(;;) {
      c = d = !1;
      var e = a.next();
      c = !0;
      var f = b.next();
      d = !0;
      if(e != f) {
        break
      }
    }
  }catch(g) {
    if(g !== goog.iter.StopIteration) {
      throw g;
    }
    if(c && !d) {
      return!1
    }
    if(!d) {
      try {
        b.next()
      }catch(h) {
        if(h !== goog.iter.StopIteration) {
          throw h;
        }
        return!0
      }
    }
  }
  return!1
};
goog.iter.nextOrValue = function(a, b) {
  try {
    return goog.iter.toIterator(a).next()
  }catch(c) {
    if(c != goog.iter.StopIteration) {
      throw c;
    }
    return b
  }
};
goog.iter.product = function(a) {
  if(goog.array.some(arguments, function(a) {
    return!a.length
  }) || !arguments.length) {
    return new goog.iter.Iterator
  }
  var b = new goog.iter.Iterator, c = arguments, d = goog.array.repeat(0, c.length);
  b.next = function() {
    if(d) {
      for(var a = goog.array.map(d, function(a, b) {
        return c[b][a]
      }), b = d.length - 1;0 <= b;b--) {
        goog.asserts.assert(d);
        if(d[b] < c[b].length - 1) {
          d[b]++;
          break
        }
        if(0 == b) {
          d = null;
          break
        }
        d[b] = 0
      }
      return a
    }
    throw goog.iter.StopIteration;
  };
  return b
};
goog.iter.cycle = function(a) {
  var b = goog.iter.toIterator(a), c = [], d = 0, a = new goog.iter.Iterator, e = !1;
  a.next = function() {
    var a = null;
    if(!e) {
      try {
        return a = b.next(), c.push(a), a
      }catch(g) {
        if(g != goog.iter.StopIteration || goog.array.isEmpty(c)) {
          throw g;
        }
        e = !0
      }
    }
    a = c[d];
    d = (d + 1) % c.length;
    return a
  };
  return a
};
goog.structs.Map = function(a, b) {
  this.map_ = {};
  goog.structs.Map.PRESERVE_NON_STRING_KEYS && (this.numericKeyMap_ = {});
  var c = arguments.length;
  if(1 < c) {
    if(c % 2) {
      throw Error("Uneven number of arguments");
    }
    for(var d = 0;d < c;d += 2) {
      this.set(arguments[d], arguments[d + 1])
    }
  }else {
    a && this.addAll(a)
  }
};
goog.structs.Map.PRESERVE_NON_STRING_KEYS = !0;
goog.structs.Map.KEY_PREFIX = ":";
goog.structs.Map.prototype.count_ = 0;
goog.structs.Map.prototype.version_ = 0;
goog.structs.Map.prototype.getCount = function() {
  return this.count_
};
goog.structs.Map.prototype.getValues = function() {
  var a = [], b;
  for(b in this.map_) {
    goog.structs.Map.isKey_(b) && a.push(this.map_[b])
  }
  return a
};
goog.structs.Map.prototype.getKeys = function() {
  var a = [], b;
  for(b in this.map_) {
    goog.structs.Map.isKey_(b) && a.push(this.getKey_(b))
  }
  return a
};
goog.structs.Map.prototype.containsKey = function(a) {
  return goog.structs.Map.makeKey_(a) in this.map_
};
goog.structs.Map.prototype.containsValue = function(a) {
  for(var b in this.map_) {
    if(goog.structs.Map.isKey_(b) && this.map_[b] == a) {
      return!0
    }
  }
  return!1
};
goog.structs.Map.prototype.equals = function(a, b) {
  if(this === a) {
    return!0
  }
  if(this.count_ != a.getCount()) {
    return!1
  }
  var c = b || goog.structs.Map.defaultEquals, d;
  for(d in this.map_) {
    if(d = this.getKey_(d), !c(this.get(d), a.get(d))) {
      return!1
    }
  }
  return!0
};
goog.structs.Map.defaultEquals = function(a, b) {
  return a === b
};
goog.structs.Map.prototype.isEmpty = function() {
  return 0 == this.count_
};
goog.structs.Map.prototype.clear = function() {
  this.map_ = {};
  this.version_ = this.count_ = 0;
  goog.structs.Map.PRESERVE_NON_STRING_KEYS && (this.numericKeyMap_ = {})
};
goog.structs.Map.prototype.remove = function(a) {
  a = goog.structs.Map.makeKey_(a);
  return goog.object.remove(this.map_, a) ? (goog.structs.Map.PRESERVE_NON_STRING_KEYS && delete this.numericKeyMap_[a], this.count_--, this.version_++, !0) : !1
};
goog.structs.Map.prototype.get = function(a, b) {
  var c = goog.structs.Map.makeKey_(a);
  return c in this.map_ ? this.map_[c] : b
};
goog.structs.Map.prototype.set = function(a, b) {
  var c = goog.structs.Map.makeKey_(a);
  c in this.map_ || (this.version_++, this.count_++, goog.structs.Map.PRESERVE_NON_STRING_KEYS && goog.isNumber(a) && (this.numericKeyMap_[c] = !0));
  this.map_[c] = b
};
goog.structs.Map.prototype.addAll = function(a) {
  var b;
  a instanceof goog.structs.Map ? (b = a.getKeys(), a = a.getValues()) : (b = goog.object.getKeys(a), a = goog.object.getValues(a));
  for(var c = 0;c < b.length;c++) {
    this.set(b[c], a[c])
  }
};
goog.structs.Map.prototype.clone = function() {
  return new goog.structs.Map(this)
};
goog.structs.Map.prototype.transpose = function() {
  var a = new goog.structs.Map, b;
  for(b in this.map_) {
    a.set(this.map_[b], this.getKey_(b))
  }
  return a
};
goog.structs.Map.prototype.toObject = function() {
  var a = {}, b;
  for(b in this.map_) {
    goog.structs.Map.isKey_(b) && (a[this.getKey_(b)] = this.map_[b])
  }
  return a
};
goog.structs.Map.prototype.getKeyIterator = function() {
  return this.__iterator__(!0)
};
goog.structs.Map.prototype.getValueIterator = function() {
  return this.__iterator__(!1)
};
goog.structs.Map.prototype.__iterator__ = function(a) {
  var b = 0, c = this.getKeys(), d = this.map_, e = this.version_, f = this, g = new goog.iter.Iterator;
  g.next = function() {
    for(;;) {
      if(e != f.version_) {
        throw Error("The map has changed since the iterator was created");
      }
      if(b >= c.length) {
        throw goog.iter.StopIteration;
      }
      var g = c[b++];
      return a ? g : d[goog.structs.Map.makeKey_(g)]
    }
  };
  return g
};
goog.structs.Map.prototype.getKey_ = function(a) {
  var b = a.substring(1);
  return goog.structs.Map.PRESERVE_NON_STRING_KEYS ? this.numericKeyMap_[a] ? Number(b) : b : b
};
goog.structs.Map.isKey_ = function(a) {
  return a.charAt(0) == goog.structs.Map.KEY_PREFIX
};
goog.structs.Map.makeKey_ = function(a) {
  return goog.structs.Map.KEY_PREFIX + a
};
goog.structs.Set = function(a) {
  this.map_ = new goog.structs.Map;
  a && this.addAll(a)
};
goog.structs.Set.getKey_ = function(a) {
  var b = typeof a;
  return"object" == b && a || "function" == b ? "o" + goog.getUid(a) : b.substr(0, 1) + a
};
goog.structs.Set.prototype.getCount = function() {
  return this.map_.getCount()
};
goog.structs.Set.prototype.add = function(a) {
  this.map_.set(goog.structs.Set.getKey_(a), a)
};
goog.structs.Set.prototype.addAll = function(a) {
  for(var a = goog.structs.getValues(a), b = a.length, c = 0;c < b;c++) {
    this.add(a[c])
  }
};
goog.structs.Set.prototype.removeAll = function(a) {
  for(var a = goog.structs.getValues(a), b = a.length, c = 0;c < b;c++) {
    this.remove(a[c])
  }
};
goog.structs.Set.prototype.remove = function(a) {
  return this.map_.remove(goog.structs.Set.getKey_(a))
};
goog.structs.Set.prototype.clear = function() {
  this.map_.clear()
};
goog.structs.Set.prototype.isEmpty = function() {
  return this.map_.isEmpty()
};
goog.structs.Set.prototype.contains = function(a) {
  return this.map_.containsKey(goog.structs.Set.getKey_(a))
};
goog.structs.Set.prototype.containsAll = function(a) {
  return goog.structs.every(a, this.contains, this)
};
goog.structs.Set.prototype.intersection = function(a) {
  for(var b = new goog.structs.Set, a = goog.structs.getValues(a), c = 0;c < a.length;c++) {
    var d = a[c];
    this.contains(d) && b.add(d)
  }
  return b
};
goog.structs.Set.prototype.getValues = function() {
  return this.map_.getValues()
};
goog.structs.Set.prototype.clone = function() {
  return new goog.structs.Set(this)
};
goog.structs.Set.prototype.equals = function(a) {
  return this.getCount() == goog.structs.getCount(a) && this.isSubsetOf(a)
};
goog.structs.Set.prototype.isSubsetOf = function(a) {
  var b = goog.structs.getCount(a);
  if(this.getCount() > b) {
    return!1
  }
  !(a instanceof goog.structs.Set) && 5 < b && (a = new goog.structs.Set(a));
  return goog.structs.every(this, function(b) {
    return goog.structs.contains(a, b)
  })
};
goog.structs.Set.prototype.__iterator__ = function() {
  return this.map_.__iterator__(!1)
};
goog.userAgent = {};
goog.userAgent.ASSUME_IE = !1;
goog.userAgent.ASSUME_GECKO = !0;
goog.userAgent.ASSUME_WEBKIT = !1;
goog.userAgent.ASSUME_MOBILE_WEBKIT = !1;
goog.userAgent.ASSUME_OPERA = !1;
goog.userAgent.ASSUME_ANY_VERSION = !1;
goog.userAgent.BROWSER_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_GECKO || goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_OPERA;
goog.userAgent.getUserAgentString = function() {
  return goog.global.navigator ? goog.global.navigator.userAgent : null
};
goog.userAgent.getNavigator = function() {
  return goog.global.navigator
};
goog.userAgent.init_ = function() {
  goog.userAgent.detectedOpera_ = !1;
  goog.userAgent.detectedIe_ = !1;
  goog.userAgent.detectedWebkit_ = !1;
  goog.userAgent.detectedMobile_ = !1;
  goog.userAgent.detectedGecko_ = !1;
  var a;
  if(!goog.userAgent.BROWSER_KNOWN_ && (a = goog.userAgent.getUserAgentString())) {
    var b = goog.userAgent.getNavigator();
    goog.userAgent.detectedOpera_ = 0 == a.indexOf("Opera");
    goog.userAgent.detectedIe_ = !goog.userAgent.detectedOpera_ && -1 != a.indexOf("MSIE");
    goog.userAgent.detectedWebkit_ = !goog.userAgent.detectedOpera_ && -1 != a.indexOf("WebKit");
    goog.userAgent.detectedMobile_ = goog.userAgent.detectedWebkit_ && -1 != a.indexOf("Mobile");
    goog.userAgent.detectedGecko_ = !goog.userAgent.detectedOpera_ && !goog.userAgent.detectedWebkit_ && "Gecko" == b.product
  }
};
goog.userAgent.BROWSER_KNOWN_ || goog.userAgent.init_();
goog.userAgent.OPERA = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_OPERA : goog.userAgent.detectedOpera_;
goog.userAgent.IE = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_IE : goog.userAgent.detectedIe_;
goog.userAgent.GECKO = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_GECKO : goog.userAgent.detectedGecko_;
goog.userAgent.WEBKIT = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_MOBILE_WEBKIT : goog.userAgent.detectedWebkit_;
goog.userAgent.MOBILE = goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.detectedMobile_;
goog.userAgent.SAFARI = goog.userAgent.WEBKIT;
goog.userAgent.determinePlatform_ = function() {
  var a = goog.userAgent.getNavigator();
  return a && a.platform || ""
};
goog.userAgent.PLATFORM = goog.userAgent.determinePlatform_();
goog.userAgent.ASSUME_MAC = !1;
goog.userAgent.ASSUME_WINDOWS = !1;
goog.userAgent.ASSUME_LINUX = !1;
goog.userAgent.ASSUME_X11 = !1;
goog.userAgent.PLATFORM_KNOWN_ = goog.userAgent.ASSUME_MAC || goog.userAgent.ASSUME_WINDOWS || goog.userAgent.ASSUME_LINUX || goog.userAgent.ASSUME_X11;
goog.userAgent.initPlatform_ = function() {
  goog.userAgent.detectedMac_ = goog.string.contains(goog.userAgent.PLATFORM, "Mac");
  goog.userAgent.detectedWindows_ = goog.string.contains(goog.userAgent.PLATFORM, "Win");
  goog.userAgent.detectedLinux_ = goog.string.contains(goog.userAgent.PLATFORM, "Linux");
  goog.userAgent.detectedX11_ = !!goog.userAgent.getNavigator() && goog.string.contains(goog.userAgent.getNavigator().appVersion || "", "X11")
};
goog.userAgent.PLATFORM_KNOWN_ || goog.userAgent.initPlatform_();
goog.userAgent.MAC = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_MAC : goog.userAgent.detectedMac_;
goog.userAgent.WINDOWS = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_WINDOWS : goog.userAgent.detectedWindows_;
goog.userAgent.LINUX = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_LINUX : goog.userAgent.detectedLinux_;
goog.userAgent.X11 = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_X11 : goog.userAgent.detectedX11_;
goog.userAgent.determineVersion_ = function() {
  var a = "", b;
  goog.userAgent.OPERA && goog.global.opera ? (a = goog.global.opera.version, a = "function" == typeof a ? a() : a) : (goog.userAgent.GECKO ? b = /rv\:([^\);]+)(\)|;)/ : goog.userAgent.IE ? b = /MSIE\s+([^\);]+)(\)|;)/ : goog.userAgent.WEBKIT && (b = /WebKit\/(\S+)/), b && (a = (a = b.exec(goog.userAgent.getUserAgentString())) ? a[1] : ""));
  return goog.userAgent.IE && (b = goog.userAgent.getDocumentMode_(), b > parseFloat(a)) ? "" + b : a
};
goog.userAgent.getDocumentMode_ = function() {
  var a = goog.global.document;
  return a ? a.documentMode : void 0
};
goog.userAgent.VERSION = goog.userAgent.determineVersion_();
goog.userAgent.compare = function(a, b) {
  return goog.string.compareVersions(a, b)
};
goog.userAgent.isVersionCache_ = {};
goog.userAgent.isVersion = function(a) {
  return goog.userAgent.ASSUME_ANY_VERSION || goog.userAgent.isVersionCache_[a] || (goog.userAgent.isVersionCache_[a] = 0 <= goog.string.compareVersions(goog.userAgent.VERSION, a))
};
goog.userAgent.isDocumentModeCache_ = {};
goog.userAgent.isDocumentMode = function(a) {
  return goog.userAgent.isDocumentModeCache_[a] || (goog.userAgent.isDocumentModeCache_[a] = goog.userAgent.IE && document.documentMode && document.documentMode >= a)
};
goog.debug.catchErrors = function(a, b, c) {
  var c = c || goog.global, d = c.onerror, e = goog.userAgent.WEBKIT ? !b : !!b;
  c.onerror = function(b, c, h) {
    d && d(b, c, h);
    a({message:b, fileName:c, line:h});
    return e
  }
};
goog.debug.expose = function(a, b) {
  if("undefined" == typeof a) {
    return"undefined"
  }
  if(null == a) {
    return"NULL"
  }
  var c = [], d;
  for(d in a) {
    if(b || !goog.isFunction(a[d])) {
      var e = d + " = ";
      try {
        e += a[d]
      }catch(f) {
        e += "*** " + f + " ***"
      }
      c.push(e)
    }
  }
  return c.join("\n")
};
goog.debug.deepExpose = function(a, b) {
  var c = new goog.structs.Set, d = [], e = function(a, g) {
    var h = g + "  ";
    try {
      if(goog.isDef(a)) {
        if(goog.isNull(a)) {
          d.push("NULL")
        }else {
          if(goog.isString(a)) {
            d.push('"' + a.replace(/\n/g, "\n" + g) + '"')
          }else {
            if(goog.isFunction(a)) {
              d.push(("" + a).replace(/\n/g, "\n" + g))
            }else {
              if(goog.isObject(a)) {
                if(c.contains(a)) {
                  d.push("*** reference loop detected ***")
                }else {
                  c.add(a);
                  d.push("{");
                  for(var j in a) {
                    if(b || !goog.isFunction(a[j])) {
                      d.push("\n"), d.push(h), d.push(j + " = "), e(a[j], h)
                    }
                  }
                  d.push("\n" + g + "}")
                }
              }else {
                d.push(a)
              }
            }
          }
        }
      }else {
        d.push("undefined")
      }
    }catch(m) {
      d.push("*** " + m + " ***")
    }
  };
  e(a, "");
  return d.join("")
};
goog.debug.exposeArray = function(a) {
  for(var b = [], c = 0;c < a.length;c++) {
    goog.isArray(a[c]) ? b.push(goog.debug.exposeArray(a[c])) : b.push(a[c])
  }
  return"[ " + b.join(", ") + " ]"
};
goog.debug.exposeException = function(a, b) {
  try {
    var c = goog.debug.normalizeErrorObject(a);
    return"Message: " + goog.string.htmlEscape(c.message) + '\nUrl: <a href="view-source:' + c.fileName + '" target="_new">' + c.fileName + "</a>\nLine: " + c.lineNumber + "\n\nBrowser stack:\n" + goog.string.htmlEscape(c.stack + "-> ") + "[end]\n\nJS stack traversal:\n" + goog.string.htmlEscape(goog.debug.getStacktrace(b) + "-> ")
  }catch(d) {
    return"Exception trying to expose exception! You win, we lose. " + d
  }
};
goog.debug.normalizeErrorObject = function(a) {
  var b = goog.getObjectByName("window.location.href");
  if(goog.isString(a)) {
    return{message:a, name:"Unknown error", lineNumber:"Not available", fileName:b, stack:"Not available"}
  }
  var c, d, e = !1;
  try {
    c = a.lineNumber || a.line || "Not available"
  }catch(f) {
    c = "Not available", e = !0
  }
  try {
    d = a.fileName || a.filename || a.sourceURL || b
  }catch(g) {
    d = "Not available", e = !0
  }
  return e || !a.lineNumber || !a.fileName || !a.stack ? {message:a.message, name:a.name, lineNumber:c, fileName:d, stack:a.stack || "Not available"} : a
};
goog.debug.enhanceError = function(a, b) {
  var c = "string" == typeof a ? Error(a) : a;
  c.stack || (c.stack = goog.debug.getStacktrace(arguments.callee.caller));
  if(b) {
    for(var d = 0;c["message" + d];) {
      ++d
    }
    c["message" + d] = "" + b
  }
  return c
};
goog.debug.getStacktraceSimple = function(a) {
  for(var b = [], c = arguments.callee.caller, d = 0;c && (!a || d < a);) {
    b.push(goog.debug.getFunctionName(c));
    b.push("()\n");
    try {
      c = c.caller
    }catch(e) {
      b.push("[exception trying to get caller]\n");
      break
    }
    d++;
    if(d >= goog.debug.MAX_STACK_DEPTH) {
      b.push("[...long stack...]");
      break
    }
  }
  a && d >= a ? b.push("[...reached max depth limit...]") : b.push("[end]");
  return b.join("")
};
goog.debug.MAX_STACK_DEPTH = 50;
goog.debug.getStacktrace = function(a) {
  return goog.debug.getStacktraceHelper_(a || arguments.callee.caller, [])
};
goog.debug.getStacktraceHelper_ = function(a, b) {
  var c = [];
  if(goog.array.contains(b, a)) {
    c.push("[...circular reference...]")
  }else {
    if(a && b.length < goog.debug.MAX_STACK_DEPTH) {
      c.push(goog.debug.getFunctionName(a) + "(");
      for(var d = a.arguments, e = 0;e < d.length;e++) {
        0 < e && c.push(", ");
        var f;
        f = d[e];
        switch(typeof f) {
          case "object":
            f = f ? "object" : "null";
            break;
          case "string":
            break;
          case "number":
            f = "" + f;
            break;
          case "boolean":
            f = f ? "true" : "false";
            break;
          case "function":
            f = (f = goog.debug.getFunctionName(f)) ? f : "[fn]";
            break;
          default:
            f = typeof f
        }
        40 < f.length && (f = f.substr(0, 40) + "...");
        c.push(f)
      }
      b.push(a);
      c.push(")\n");
      try {
        c.push(goog.debug.getStacktraceHelper_(a.caller, b))
      }catch(g) {
        c.push("[exception trying to get caller]\n")
      }
    }else {
      a ? c.push("[...long stack...]") : c.push("[end]")
    }
  }
  return c.join("")
};
goog.debug.setFunctionResolver = function(a) {
  goog.debug.fnNameResolver_ = a
};
goog.debug.getFunctionName = function(a) {
  if(goog.debug.fnNameCache_[a]) {
    return goog.debug.fnNameCache_[a]
  }
  if(goog.debug.fnNameResolver_) {
    var b = goog.debug.fnNameResolver_(a);
    if(b) {
      return goog.debug.fnNameCache_[a] = b
    }
  }
  a = "" + a;
  goog.debug.fnNameCache_[a] || (b = /function ([^\(]+)/.exec(a), goog.debug.fnNameCache_[a] = b ? b[1] : "[Anonymous]");
  return goog.debug.fnNameCache_[a]
};
goog.debug.makeWhitespaceVisible = function(a) {
  return a.replace(/ /g, "[_]").replace(/\f/g, "[f]").replace(/\n/g, "[n]\n").replace(/\r/g, "[r]").replace(/\t/g, "[t]")
};
goog.debug.fnNameCache_ = {};
goog.debug.LogRecord = function(a, b, c, d, e) {
  this.reset(a, b, c, d, e)
};
goog.debug.LogRecord.prototype.sequenceNumber_ = 0;
goog.debug.LogRecord.prototype.exception_ = null;
goog.debug.LogRecord.prototype.exceptionText_ = null;
goog.debug.LogRecord.ENABLE_SEQUENCE_NUMBERS = !0;
goog.debug.LogRecord.nextSequenceNumber_ = 0;
goog.debug.LogRecord.prototype.reset = function(a, b, c, d, e) {
  goog.debug.LogRecord.ENABLE_SEQUENCE_NUMBERS && (this.sequenceNumber_ = "number" == typeof e ? e : goog.debug.LogRecord.nextSequenceNumber_++);
  this.time_ = d || goog.now();
  this.level_ = a;
  this.msg_ = b;
  this.loggerName_ = c;
  delete this.exception_;
  delete this.exceptionText_
};
goog.debug.LogRecord.prototype.getLoggerName = function() {
  return this.loggerName_
};
goog.debug.LogRecord.prototype.getException = function() {
  return this.exception_
};
goog.debug.LogRecord.prototype.setException = function(a) {
  this.exception_ = a
};
goog.debug.LogRecord.prototype.getExceptionText = function() {
  return this.exceptionText_
};
goog.debug.LogRecord.prototype.setExceptionText = function(a) {
  this.exceptionText_ = a
};
goog.debug.LogRecord.prototype.setLoggerName = function(a) {
  this.loggerName_ = a
};
goog.debug.LogRecord.prototype.getLevel = function() {
  return this.level_
};
goog.debug.LogRecord.prototype.setLevel = function(a) {
  this.level_ = a
};
goog.debug.LogRecord.prototype.getMessage = function() {
  return this.msg_
};
goog.debug.LogRecord.prototype.setMessage = function(a) {
  this.msg_ = a
};
goog.debug.LogRecord.prototype.getMillis = function() {
  return this.time_
};
goog.debug.LogRecord.prototype.setMillis = function(a) {
  this.time_ = a
};
goog.debug.LogRecord.prototype.getSequenceNumber = function() {
  return this.sequenceNumber_
};
goog.debug.LogBuffer = function() {
  goog.asserts.assert(goog.debug.LogBuffer.isBufferingEnabled(), "Cannot use goog.debug.LogBuffer without defining goog.debug.LogBuffer.CAPACITY.");
  this.clear()
};
goog.debug.LogBuffer.getInstance = function() {
  goog.debug.LogBuffer.instance_ || (goog.debug.LogBuffer.instance_ = new goog.debug.LogBuffer);
  return goog.debug.LogBuffer.instance_
};
goog.debug.LogBuffer.CAPACITY = 0;
goog.debug.LogBuffer.prototype.addRecord = function(a, b, c) {
  var d = (this.curIndex_ + 1) % goog.debug.LogBuffer.CAPACITY;
  this.curIndex_ = d;
  if(this.isFull_) {
    return d = this.buffer_[d], d.reset(a, b, c), d
  }
  this.isFull_ = d == goog.debug.LogBuffer.CAPACITY - 1;
  return this.buffer_[d] = new goog.debug.LogRecord(a, b, c)
};
goog.debug.LogBuffer.isBufferingEnabled = function() {
  return 0 < goog.debug.LogBuffer.CAPACITY
};
goog.debug.LogBuffer.prototype.clear = function() {
  this.buffer_ = Array(goog.debug.LogBuffer.CAPACITY);
  this.curIndex_ = -1;
  this.isFull_ = !1
};
goog.debug.LogBuffer.prototype.forEachRecord = function(a) {
  var b = this.buffer_;
  if(b[0]) {
    var c = this.curIndex_, d = this.isFull_ ? c : -1;
    do {
      d = (d + 1) % goog.debug.LogBuffer.CAPACITY, a(b[d])
    }while(d != c)
  }
};
goog.debug.Logger = function(a) {
  this.name_ = a
};
goog.debug.Logger.prototype.parent_ = null;
goog.debug.Logger.prototype.level_ = null;
goog.debug.Logger.prototype.children_ = null;
goog.debug.Logger.prototype.handlers_ = null;
goog.debug.Logger.ENABLE_HIERARCHY = !0;
goog.debug.Logger.ENABLE_HIERARCHY || (goog.debug.Logger.rootHandlers_ = []);
goog.debug.Logger.Level = function(a, b) {
  this.name = a;
  this.value = b
};
goog.debug.Logger.Level.prototype.toString = function() {
  return this.name
};
goog.debug.Logger.Level.OFF = new goog.debug.Logger.Level("OFF", Infinity);
goog.debug.Logger.Level.SHOUT = new goog.debug.Logger.Level("SHOUT", 1200);
goog.debug.Logger.Level.SEVERE = new goog.debug.Logger.Level("SEVERE", 1E3);
goog.debug.Logger.Level.WARNING = new goog.debug.Logger.Level("WARNING", 900);
goog.debug.Logger.Level.INFO = new goog.debug.Logger.Level("INFO", 800);
goog.debug.Logger.Level.CONFIG = new goog.debug.Logger.Level("CONFIG", 700);
goog.debug.Logger.Level.FINE = new goog.debug.Logger.Level("FINE", 500);
goog.debug.Logger.Level.FINER = new goog.debug.Logger.Level("FINER", 400);
goog.debug.Logger.Level.FINEST = new goog.debug.Logger.Level("FINEST", 300);
goog.debug.Logger.Level.ALL = new goog.debug.Logger.Level("ALL", 0);
goog.debug.Logger.Level.PREDEFINED_LEVELS = [goog.debug.Logger.Level.OFF, goog.debug.Logger.Level.SHOUT, goog.debug.Logger.Level.SEVERE, goog.debug.Logger.Level.WARNING, goog.debug.Logger.Level.INFO, goog.debug.Logger.Level.CONFIG, goog.debug.Logger.Level.FINE, goog.debug.Logger.Level.FINER, goog.debug.Logger.Level.FINEST, goog.debug.Logger.Level.ALL];
goog.debug.Logger.Level.predefinedLevelsCache_ = null;
goog.debug.Logger.Level.createPredefinedLevelsCache_ = function() {
  goog.debug.Logger.Level.predefinedLevelsCache_ = {};
  for(var a = 0, b;b = goog.debug.Logger.Level.PREDEFINED_LEVELS[a];a++) {
    goog.debug.Logger.Level.predefinedLevelsCache_[b.value] = b;
    goog.debug.Logger.Level.predefinedLevelsCache_[b.name] = b
  }
};
goog.debug.Logger.Level.getPredefinedLevel = function(a) {
  goog.debug.Logger.Level.predefinedLevelsCache_ || goog.debug.Logger.Level.createPredefinedLevelsCache_();
  return goog.debug.Logger.Level.predefinedLevelsCache_[a] || null
};
goog.debug.Logger.Level.getPredefinedLevelByValue = function(a) {
  goog.debug.Logger.Level.predefinedLevelsCache_ || goog.debug.Logger.Level.createPredefinedLevelsCache_();
  if(a in goog.debug.Logger.Level.predefinedLevelsCache_) {
    return goog.debug.Logger.Level.predefinedLevelsCache_[a]
  }
  for(var b = 0;b < goog.debug.Logger.Level.PREDEFINED_LEVELS.length;++b) {
    var c = goog.debug.Logger.Level.PREDEFINED_LEVELS[b];
    if(c.value <= a) {
      return c
    }
  }
  return null
};
goog.debug.Logger.getLogger = function(a) {
  return goog.debug.LogManager.getLogger(a)
};
goog.debug.Logger.logToProfilers = function(a) {
  goog.global.console && (goog.global.console.timeStamp ? goog.global.console.timeStamp(a) : goog.global.console.markTimeline && goog.global.console.markTimeline(a));
  goog.global.msWriteProfilerMark && goog.global.msWriteProfilerMark(a)
};
goog.debug.Logger.prototype.getName = function() {
  return this.name_
};
goog.debug.Logger.prototype.addHandler = function(a) {
  if(goog.debug.Logger.ENABLE_HIERARCHY) {
    if(!this.handlers_) {
      this.handlers_ = []
    }
    this.handlers_.push(a)
  }else {
    goog.asserts.assert(!this.name_, "Cannot call addHandler on a non-root logger when goog.debug.Logger.ENABLE_HIERARCHY is false.");
    goog.debug.Logger.rootHandlers_.push(a)
  }
};
goog.debug.Logger.prototype.removeHandler = function(a) {
  var b = goog.debug.Logger.ENABLE_HIERARCHY ? this.handlers_ : goog.debug.Logger.rootHandlers_;
  return!!b && goog.array.remove(b, a)
};
goog.debug.Logger.prototype.getParent = function() {
  return this.parent_
};
goog.debug.Logger.prototype.getChildren = function() {
  if(!this.children_) {
    this.children_ = {}
  }
  return this.children_
};
goog.debug.Logger.prototype.setLevel = function(a) {
  if(goog.debug.Logger.ENABLE_HIERARCHY) {
    this.level_ = a
  }else {
    goog.asserts.assert(!this.name_, "Cannot call setLevel() on a non-root logger when goog.debug.Logger.ENABLE_HIERARCHY is false.");
    goog.debug.Logger.rootLevel_ = a
  }
};
goog.debug.Logger.prototype.getLevel = function() {
  return this.level_
};
goog.debug.Logger.prototype.getEffectiveLevel = function() {
  if(!goog.debug.Logger.ENABLE_HIERARCHY) {
    return goog.debug.Logger.rootLevel_
  }
  if(this.level_) {
    return this.level_
  }
  if(this.parent_) {
    return this.parent_.getEffectiveLevel()
  }
  goog.asserts.fail("Root logger has no level set.");
  return null
};
goog.debug.Logger.prototype.isLoggable = function(a) {
  return a.value >= this.getEffectiveLevel().value
};
goog.debug.Logger.prototype.log = function(a, b, c) {
  this.isLoggable(a) && this.doLogRecord_(this.getLogRecord(a, b, c))
};
goog.debug.Logger.prototype.getLogRecord = function(a, b, c) {
  var d = goog.debug.LogBuffer.isBufferingEnabled() ? goog.debug.LogBuffer.getInstance().addRecord(a, b, this.name_) : new goog.debug.LogRecord(a, "" + b, this.name_);
  if(c) {
    d.setException(c);
    d.setExceptionText(goog.debug.exposeException(c, arguments.callee.caller))
  }
  return d
};
goog.debug.Logger.prototype.shout = function(a, b) {
  this.log(goog.debug.Logger.Level.SHOUT, a, b)
};
goog.debug.Logger.prototype.severe = function(a, b) {
  this.log(goog.debug.Logger.Level.SEVERE, a, b)
};
goog.debug.Logger.prototype.warning = function(a, b) {
  this.log(goog.debug.Logger.Level.WARNING, a, b)
};
goog.debug.Logger.prototype.info = function(a, b) {
  this.log(goog.debug.Logger.Level.INFO, a, b)
};
goog.debug.Logger.prototype.config = function(a, b) {
  this.log(goog.debug.Logger.Level.CONFIG, a, b)
};
goog.debug.Logger.prototype.fine = function(a, b) {
  this.log(goog.debug.Logger.Level.FINE, a, b)
};
goog.debug.Logger.prototype.finer = function(a, b) {
  this.log(goog.debug.Logger.Level.FINER, a, b)
};
goog.debug.Logger.prototype.finest = function(a, b) {
  this.log(goog.debug.Logger.Level.FINEST, a, b)
};
goog.debug.Logger.prototype.logRecord = function(a) {
  this.isLoggable(a.getLevel()) && this.doLogRecord_(a)
};
goog.debug.Logger.prototype.doLogRecord_ = function(a) {
  goog.debug.Logger.logToProfilers("log:" + a.getMessage());
  if(goog.debug.Logger.ENABLE_HIERARCHY) {
    for(var b = this;b;) {
      b.callPublish_(a);
      b = b.getParent()
    }
  }else {
    for(var b = 0, c;c = goog.debug.Logger.rootHandlers_[b++];) {
      c(a)
    }
  }
};
goog.debug.Logger.prototype.callPublish_ = function(a) {
  if(this.handlers_) {
    for(var b = 0, c;c = this.handlers_[b];b++) {
      c(a)
    }
  }
};
goog.debug.Logger.prototype.setParent_ = function(a) {
  this.parent_ = a
};
goog.debug.Logger.prototype.addChild_ = function(a, b) {
  this.getChildren()[a] = b
};
goog.debug.LogManager = {};
goog.debug.LogManager.loggers_ = {};
goog.debug.LogManager.rootLogger_ = null;
goog.debug.LogManager.initialize = function() {
  if(!goog.debug.LogManager.rootLogger_) {
    goog.debug.LogManager.rootLogger_ = new goog.debug.Logger("");
    goog.debug.LogManager.loggers_[""] = goog.debug.LogManager.rootLogger_;
    goog.debug.LogManager.rootLogger_.setLevel(goog.debug.Logger.Level.CONFIG)
  }
};
goog.debug.LogManager.getLoggers = function() {
  return goog.debug.LogManager.loggers_
};
goog.debug.LogManager.getRoot = function() {
  goog.debug.LogManager.initialize();
  return goog.debug.LogManager.rootLogger_
};
goog.debug.LogManager.getLogger = function(a) {
  goog.debug.LogManager.initialize();
  return goog.debug.LogManager.loggers_[a] || goog.debug.LogManager.createLogger_(a)
};
goog.debug.LogManager.createFunctionForCatchErrors = function(a) {
  return function(b) {
    (a || goog.debug.LogManager.getRoot()).severe("Error: " + b.message + " (" + b.fileName + " @ Line: " + b.line + ")")
  }
};
goog.debug.LogManager.createLogger_ = function(a) {
  var b = new goog.debug.Logger(a);
  if(goog.debug.Logger.ENABLE_HIERARCHY) {
    var c = a.lastIndexOf("."), d = a.substr(0, c), c = a.substr(c + 1), d = goog.debug.LogManager.getLogger(d);
    d.addChild_(c, b);
    b.setParent_(d)
  }
  return goog.debug.LogManager.loggers_[a] = b
};
var fxdriver = {Logger:{}, debug:{}};
fxdriver.debug.initialized_ = !1;
fxdriver.debug.LogLevel = {DEBUG:500, INFO:800, WARNING:900, ERROR:1E3, OFF:Math.pow(2, 31) - 1};
fxdriver.debug.driverLogLevel_ = fxdriver.debug.LogLevel.OFF;
fxdriver.debug.LOG_DRIVER_ = "webdriver.log.driver";
fxdriver.debug.ConsoleFormatter = function() {
  goog.debug.Formatter.call(this)
};
goog.inherits(fxdriver.debug.ConsoleFormatter, goog.debug.Formatter);
fxdriver.debug.ConsoleFormatter.prototype.formatRecord = function(a) {
  var b = [];
  this.showSeverityLevel && b.push("[", a.getLevel().name, "] ");
  for(var c = Components.stack, d = 0;7 > d && c;d++) {
    c = c.caller
  }
  d = c.filename.replace(/.*\//, "");
  b.push(d + ":" + c.lineNumber + " ");
  b.push(a.getMessage(), "\n");
  this.showExceptionText && a.getException() && b.push(a.getExceptionText(), "\n");
  return b.join("")
};
fxdriver.debug.addErrorConsoleLogger_ = function(a) {
  if(Components) {
    var b = new fxdriver.debug.ConsoleFormatter;
    b.showSeverityLevel = !0;
    var c = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
    a.addHandler(function(a) {
      a = b.formatRecord(a);
      c.logStringMessage(a)
    })
  }
};
fxdriver.debug.getLevelFromLogRecord_ = function(a) {
  return a == goog.debug.Logger.Level.DEBUG ? fxdriver.debug.LogLevel.DEBUG : a == goog.debug.Logger.Level.WARNING ? fxdriver.debug.LogLevel.WARNING : a == goog.debug.Logger.Level.ERROR ? fxdriver.debug.LogLevel.ERROR : fxdriver.debug.LogLevel.OFF
};
fxdriver.debug.addLogRecorderHandler_ = function(a) {
  var b = fxdriver.debug.driverLogLevel_;
  a.addHandler(function(a) {
    var d = fxdriver.debug.getLevelFromLogRecord_(a.getLevel());
    if(d >= b) {
      var e = a.getMillis() || (new Date).getTime();
      fxdriver.debug.writeToFile_(fxdriver.debug.driver_logs_file.path, JSON.stringify({timestamp:e, level:d, message:a.getMessage()}) + "\n")
    }
  })
};
fxdriver.debug.writeToFile_ = function(a, b) {
  var c = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
  c.initWithPath(a);
  var d = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
  d.init(c, 18, 438, 0);
  c = Components.classes["@mozilla.org/intl/converter-output-stream;1"].createInstance(Components.interfaces.nsIConverterOutputStream);
  c.init(d, "UTF-8", 0, 0);
  c.writeString(b);
  c.close()
};
fxdriver.debug.addFileLogger_ = function(a, b) {
  if(b) {
    var c = new goog.debug.TextFormatter("webdriver");
    if("/dev/stdout" == b) {
      a.addHandler(function(a) {
        dump(c.formatRecord(a))
      })
    }else {
      var d = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
      d.initWithPath(b);
      d.createUnique(Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 438);
      var e = d.path;
      a.addHandler(function(a) {
        fxdriver.debug.writeToFile_(e, c.formatRecord(a))
      })
    }
  }
};
fxdriver.debug.initialize = function() {
  if(!fxdriver.debug.initialized_) {
    var a = goog.debug.Logger.getLogger("");
    fxdriver.debug.addErrorConsoleLogger_(a);
    var b = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch), c = b.prefHasUserValue("webdriver.log.file") && b.getCharPref("webdriver.log.file");
    fxdriver.debug.addFileLogger_(a, c);
    b.prefHasUserValue(fxdriver.debug.LOG_DRIVER_) && (fxdriver.debug.driverLogLevel_ = b.getIntPref(fxdriver.debug.LOG_DRIVER_), fxdriver.debug.driver_logs_file = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("TmpD", Components.interfaces.nsIFile), fxdriver.debug.driver_logs_file.append("driverlogs.txt"), fxdriver.debug.driver_logs_file.createUnique(Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 438), fxdriver.debug.addLogRecorderHandler_(a));
    fxdriver.debug.initialized_ = !0
  }
};
fxdriver.Logger.dumpn = function(a) {
  fxdriver.debug.initialize();
  goog.debug.Logger.getLogger("webdriver").info(a)
};
fxdriver.Logger.dump = function(a) {
  fxdriver.debug.initialize();
  var b, c = [];
  b = "=============\nSupported interfaces: ";
  for(var d in Components.interfaces) {
    try {
      a.QueryInterface(Components.interfaces[d]), b += d + ", "
    }catch(e) {
    }
  }
  b += "\n------------\n";
  try {
    fxdriver.Logger.dumpProperties_(a, c)
  }catch(f) {
  }
  c.sort();
  for(var g in c) {
    b += c[g] + "\n"
  }
  goog.debug.Logger.getLogger("webdriver").warning(b + "=============\n\n\n")
};
fxdriver.Logger.dumpProperties_ = function(a, b) {
  fxdriver.debug.initialize();
  for(var c in a) {
    var d = "\t" + c + ": ";
    try {
      d = typeof a[c] == typeof Function ? d + " function()" : d + ("" + a[c])
    }catch(e) {
      d += " Cannot obtain value"
    }
    b.push(d)
  }
};
fxdriver.Logger.stackTrace = function() {
  fxdriver.debug.initialize();
  for(var a = Components.stack, b = "";a.caller;) {
    a = a.caller, b += a + "\n"
  }
  fxdriver.Logger.dumpn(b)
};
fxdriver.Timer = function() {
  this.timer = null
};
fxdriver.Timer.prototype.setTimeout = function(a, b) {
  var c = Components.interfaces, d = b || 10;
  this.timer = Components.classes["@mozilla.org/timer;1"].createInstance(c.nsITimer);
  this.timer.initWithCallback({notify:function() {
    a.apply(null)
  }}, d, c.nsITimer.TYPE_ONE_SHOT)
};
fxdriver.Timer.prototype.runWhenTrue = function(a, b, c, d) {
  var e = c, f = this, g = function() {
    var c = a();
    0 <= e && !c ? (e -= 100, f.setTimeout(g, 100)) : 0 >= e ? d() : b(c)
  };
  g()
};
fxdriver.Timer.prototype.cancel = function() {
  this.timer && this.timer.cancel()
};
var STATE_STOP = Components.interfaces.nsIWebProgressListener.STATE_STOP;
function DoNothing(a, b, c) {
  this.browser = a;
  this.onComplete = b;
  this.win = c;
  this.active = !0
}
DoNothing.prototype.onLocationChange = function() {
  return 0
};
DoNothing.prototype.onProgressChange = function() {
  return 0
};
DoNothing.prototype.onStateChange = function() {
  return 0
};
DoNothing.prototype.onStatusChange = function() {
  return 0
};
DoNothing.prototype.onSecurityChange = function() {
  return 0
};
DoNothing.prototype.onLinkIconAvailable = function() {
  return 0
};
DoNothing.prototype.QueryInterface = function(a) {
  if(a.equals(Components.interfaces.nsIWebProgressListener) || a.equals(Components.interfaces.nsISupportsWeakReference) || a.equals(Components.interfaces.nsISupports)) {
    return this
  }
  throw Components.results.NS_NOINTERFACE;
};
function PatientListener(a, b, c) {
  this.browser = a;
  this.onComplete = b;
  this.win = c;
  this.active = !0
}
PatientListener.prototype = new DoNothing;
PatientListener.prototype.onStateChange = function(a, b, c) {
  if(!this.active) {
    return 0
  }
  c & STATE_STOP && b.URI && (this.active = !1, bot.userAgent.isProductVersion("4") && WebLoadingListener.removeListener(this.browser, this), this.onComplete());
  return 0
};
function ImpatientListener(a, b, c) {
  this.broser = a;
  this.browserProgress = a.webProgress;
  this.active = !0;
  this.onComplete = b;
  this.win = c || null
}
ImpatientListener.prototype = new PatientListener;
ImpatientListener.prototype.onProgressChange = function() {
  if(!this.active || !this.win || this.win.closed) {
    return 0
  }
  var a = this.win.document && this.win.document.readyState, b = this.win.document.location;
  if(("complete" == a || "interactive" == a) && "about:blank" != b) {
    this.active = !1, bot.userAgent.isProductVersion("4") && WebLoadingListener.removeListener(this.browser, this), this.onComplete()
  }
  return 0
};
var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
function buildHandler(a, b, c) {
  return prefs.prefHasUserValue("webdriver.load.strategy") && "unstable" == prefs.getCharPref("webdriver.load.strategy") ? new ImpatientListener(a, b, c) : new PatientListener(a, b, c)
}
var loadingListenerTimer, WebLoadingListener = function(a, b, c, d) {
  loadingListenerTimer = new fxdriver.Timer;
  var e = function(a) {
    loadingListenerTimer.cancel();
    b(a)
  };
  this.handler = buildHandler(a, e, d);
  a.addProgressListener(this.handler);
  var f = this.handler;
  0 < c && loadingListenerTimer.setTimeout(function() {
    e(!0);
    WebLoadingListener.removeListener(a, f)
  }, c)
};
WebLoadingListener.removeListener = function(a, b) {
  a.removeProgressListener(b.handler)
};
var bot = {ErrorCode:{SUCCESS:0, NO_SUCH_ELEMENT:7, NO_SUCH_FRAME:8, UNKNOWN_COMMAND:9, UNSUPPORTED_OPERATION:9, STALE_ELEMENT_REFERENCE:10, ELEMENT_NOT_VISIBLE:11, INVALID_ELEMENT_STATE:12, UNKNOWN_ERROR:13, ELEMENT_NOT_SELECTABLE:15, JAVASCRIPT_ERROR:17, XPATH_LOOKUP_ERROR:19, TIMEOUT:21, NO_SUCH_WINDOW:23, INVALID_COOKIE_DOMAIN:24, UNABLE_TO_SET_COOKIE:25, MODAL_DIALOG_OPENED:26, NO_MODAL_DIALOG_OPEN:27, SCRIPT_TIMEOUT:28, INVALID_ELEMENT_COORDINATES:29, INVALID_SELECTOR_ERROR:32, SQL_DATABASE_ERROR:33, 
MOVE_TARGET_OUT_OF_BOUNDS:34, IME_ENGINE_ACTIVATION_FAILED:35, IME_NOT_AVAILABLE:36}, Error:function(a, b) {
  this.code = a;
  this.message = b || "";
  this.name = bot.Error.NAMES_[a] || bot.Error.NAMES_[bot.ErrorCode.UNKNOWN_ERROR];
  var c = Error(this.message);
  c.name = this.name;
  this.stack = c.stack || ""
}};
goog.inherits(bot.Error, Error);
bot.Error.NAMES_ = goog.object.create(bot.ErrorCode.NO_SUCH_ELEMENT, "NoSuchElementError", bot.ErrorCode.NO_SUCH_FRAME, "NoSuchFrameError", bot.ErrorCode.UNKNOWN_COMMAND, "UnknownCommandError", bot.ErrorCode.STALE_ELEMENT_REFERENCE, "StaleElementReferenceError", bot.ErrorCode.ELEMENT_NOT_VISIBLE, "ElementNotVisibleError", bot.ErrorCode.INVALID_ELEMENT_STATE, "InvalidElementStateError", bot.ErrorCode.UNKNOWN_ERROR, "UnknownError", bot.ErrorCode.ELEMENT_NOT_SELECTABLE, "ElementNotSelectableError", 
bot.ErrorCode.XPATH_LOOKUP_ERROR, "XPathLookupError", bot.ErrorCode.NO_SUCH_WINDOW, "NoSuchWindowError", bot.ErrorCode.INVALID_COOKIE_DOMAIN, "InvalidCookieDomainError", bot.ErrorCode.UNABLE_TO_SET_COOKIE, "UnableToSetCookieError", bot.ErrorCode.MODAL_DIALOG_OPENED, "ModalDialogOpenedError", bot.ErrorCode.NO_MODAL_DIALOG_OPEN, "NoModalDialogOpenError", bot.ErrorCode.SCRIPT_TIMEOUT, "ScriptTimeoutError", bot.ErrorCode.INVALID_SELECTOR_ERROR, "InvalidSelectorError", bot.ErrorCode.SQL_DATABASE_ERROR, 
"SqlDatabaseError", bot.ErrorCode.MOVE_TARGET_OUT_OF_BOUNDS, "MoveTargetOutOfBoundsError");
bot.Error.prototype.isAutomationError = !0;
goog.DEBUG && (bot.Error.prototype.toString = function() {
  return"[" + this.name + "] " + this.message
});
try {
  bot.window_ = window
}catch(ignored$$1) {
  bot.window_ = goog.global
}
bot.getWindow = function() {
  return bot.window_
};
bot.setWindow = function(a) {
  bot.window_ = a
};
bot.getDocument = function() {
  return bot.window_.document
};
goog.color = {};
goog.color.names = {aliceblue:"#f0f8ff", antiquewhite:"#faebd7", aqua:"#00ffff", aquamarine:"#7fffd4", azure:"#f0ffff", beige:"#f5f5dc", bisque:"#ffe4c4", black:"#000000", blanchedalmond:"#ffebcd", blue:"#0000ff", blueviolet:"#8a2be2", brown:"#a52a2a", burlywood:"#deb887", cadetblue:"#5f9ea0", chartreuse:"#7fff00", chocolate:"#d2691e", coral:"#ff7f50", cornflowerblue:"#6495ed", cornsilk:"#fff8dc", crimson:"#dc143c", cyan:"#00ffff", darkblue:"#00008b", darkcyan:"#008b8b", darkgoldenrod:"#b8860b", 
darkgray:"#a9a9a9", darkgreen:"#006400", darkgrey:"#a9a9a9", darkkhaki:"#bdb76b", darkmagenta:"#8b008b", darkolivegreen:"#556b2f", darkorange:"#ff8c00", darkorchid:"#9932cc", darkred:"#8b0000", darksalmon:"#e9967a", darkseagreen:"#8fbc8f", darkslateblue:"#483d8b", darkslategray:"#2f4f4f", darkslategrey:"#2f4f4f", darkturquoise:"#00ced1", darkviolet:"#9400d3", deeppink:"#ff1493", deepskyblue:"#00bfff", dimgray:"#696969", dimgrey:"#696969", dodgerblue:"#1e90ff", firebrick:"#b22222", floralwhite:"#fffaf0", 
forestgreen:"#228b22", fuchsia:"#ff00ff", gainsboro:"#dcdcdc", ghostwhite:"#f8f8ff", gold:"#ffd700", goldenrod:"#daa520", gray:"#808080", green:"#008000", greenyellow:"#adff2f", grey:"#808080", honeydew:"#f0fff0", hotpink:"#ff69b4", indianred:"#cd5c5c", indigo:"#4b0082", ivory:"#fffff0", khaki:"#f0e68c", lavender:"#e6e6fa", lavenderblush:"#fff0f5", lawngreen:"#7cfc00", lemonchiffon:"#fffacd", lightblue:"#add8e6", lightcoral:"#f08080", lightcyan:"#e0ffff", lightgoldenrodyellow:"#fafad2", lightgray:"#d3d3d3", 
lightgreen:"#90ee90", lightgrey:"#d3d3d3", lightpink:"#ffb6c1", lightsalmon:"#ffa07a", lightseagreen:"#20b2aa", lightskyblue:"#87cefa", lightslategray:"#778899", lightslategrey:"#778899", lightsteelblue:"#b0c4de", lightyellow:"#ffffe0", lime:"#00ff00", limegreen:"#32cd32", linen:"#faf0e6", magenta:"#ff00ff", maroon:"#800000", mediumaquamarine:"#66cdaa", mediumblue:"#0000cd", mediumorchid:"#ba55d3", mediumpurple:"#9370d8", mediumseagreen:"#3cb371", mediumslateblue:"#7b68ee", mediumspringgreen:"#00fa9a", 
mediumturquoise:"#48d1cc", mediumvioletred:"#c71585", midnightblue:"#191970", mintcream:"#f5fffa", mistyrose:"#ffe4e1", moccasin:"#ffe4b5", navajowhite:"#ffdead", navy:"#000080", oldlace:"#fdf5e6", olive:"#808000", olivedrab:"#6b8e23", orange:"#ffa500", orangered:"#ff4500", orchid:"#da70d6", palegoldenrod:"#eee8aa", palegreen:"#98fb98", paleturquoise:"#afeeee", palevioletred:"#d87093", papayawhip:"#ffefd5", peachpuff:"#ffdab9", peru:"#cd853f", pink:"#ffc0cb", plum:"#dda0dd", powderblue:"#b0e0e6", 
purple:"#800080", red:"#ff0000", rosybrown:"#bc8f8f", royalblue:"#4169e1", saddlebrown:"#8b4513", salmon:"#fa8072", sandybrown:"#f4a460", seagreen:"#2e8b57", seashell:"#fff5ee", sienna:"#a0522d", silver:"#c0c0c0", skyblue:"#87ceeb", slateblue:"#6a5acd", slategray:"#708090", slategrey:"#708090", snow:"#fffafa", springgreen:"#00ff7f", steelblue:"#4682b4", tan:"#d2b48c", teal:"#008080", thistle:"#d8bfd8", tomato:"#ff6347", turquoise:"#40e0d0", violet:"#ee82ee", wheat:"#f5deb3", white:"#ffffff", whitesmoke:"#f5f5f5", 
yellow:"#ffff00", yellowgreen:"#9acd32"};
goog.math = {};
goog.math.randomInt = function(a) {
  return Math.floor(Math.random() * a)
};
goog.math.uniformRandom = function(a, b) {
  return a + Math.random() * (b - a)
};
goog.math.clamp = function(a, b, c) {
  return Math.min(Math.max(a, b), c)
};
goog.math.modulo = function(a, b) {
  var c = a % b;
  return 0 > c * b ? c + b : c
};
goog.math.lerp = function(a, b, c) {
  return a + c * (b - a)
};
goog.math.nearlyEquals = function(a, b, c) {
  return Math.abs(a - b) <= (c || 1.0E-6)
};
goog.math.standardAngle = function(a) {
  return goog.math.modulo(a, 360)
};
goog.math.toRadians = function(a) {
  return a * Math.PI / 180
};
goog.math.toDegrees = function(a) {
  return 180 * a / Math.PI
};
goog.math.angleDx = function(a, b) {
  return b * Math.cos(goog.math.toRadians(a))
};
goog.math.angleDy = function(a, b) {
  return b * Math.sin(goog.math.toRadians(a))
};
goog.math.angle = function(a, b, c, d) {
  return goog.math.standardAngle(goog.math.toDegrees(Math.atan2(d - b, c - a)))
};
goog.math.angleDifference = function(a, b) {
  var c = goog.math.standardAngle(b) - goog.math.standardAngle(a);
  180 < c ? c -= 360 : -180 >= c && (c = 360 + c);
  return c
};
goog.math.sign = function(a) {
  return 0 == a ? 0 : 0 > a ? -1 : 1
};
goog.math.longestCommonSubsequence = function(a, b, c, d) {
  for(var c = c || function(a, b) {
    return a == b
  }, d = d || function(b) {
    return a[b]
  }, e = a.length, f = b.length, g = [], h = 0;h < e + 1;h++) {
    g[h] = [], g[h][0] = 0
  }
  for(var j = 0;j < f + 1;j++) {
    g[0][j] = 0
  }
  for(h = 1;h <= e;h++) {
    for(j = 1;j <= e;j++) {
      g[h][j] = c(a[h - 1], b[j - 1]) ? g[h - 1][j - 1] + 1 : Math.max(g[h - 1][j], g[h][j - 1])
    }
  }
  for(var m = [], h = e, j = f;0 < h && 0 < j;) {
    c(a[h - 1], b[j - 1]) ? (m.unshift(d(h - 1, j - 1)), h--, j--) : g[h - 1][j] > g[h][j - 1] ? h-- : j--
  }
  return m
};
goog.math.sum = function(a) {
  return goog.array.reduce(arguments, function(a, c) {
    return a + c
  }, 0)
};
goog.math.average = function(a) {
  return goog.math.sum.apply(null, arguments) / arguments.length
};
goog.math.standardDeviation = function(a) {
  var b = arguments.length;
  if(2 > b) {
    return 0
  }
  var c = goog.math.average.apply(null, arguments), b = goog.math.sum.apply(null, goog.array.map(arguments, function(a) {
    return Math.pow(a - c, 2)
  })) / (b - 1);
  return Math.sqrt(b)
};
goog.math.isInt = function(a) {
  return isFinite(a) && 0 == a % 1
};
goog.math.isFiniteNumber = function(a) {
  return isFinite(a) && !isNaN(a)
};
bot.color = {};
bot.color.standardizeColor = function(a, b) {
  return bot.color.isColorProperty(a) && bot.color.isConvertibleColor(b) ? bot.color.standardizeToRgba_(b) : b
};
bot.color.standardizeToRgba_ = function(a) {
  if(!bot.color.parseRgbaColor(a).length) {
    var b = bot.color.convertToRgba_(a);
    if(b.length) {
      return bot.color.addAlphaIfNecessary_(b), bot.color.toRgbaStyle_(b)
    }
  }
  return a
};
bot.color.convertToRgba_ = function(a) {
  var b = bot.color.parseRgbColor_(a);
  if(b.length) {
    return b
  }
  b = goog.color.names[a.toLowerCase()];
  b = !b ? bot.color.prependHashIfNecessary_(a) : b;
  return bot.color.isValidHexColor_(b) && (b = bot.color.hexToRgb(bot.color.normalizeHex(b)), b.length) ? b : []
};
bot.color.isConvertibleColor = function(a) {
  return!(!bot.color.isValidHexColor_(bot.color.prependHashIfNecessary_(a)) && !bot.color.parseRgbColor_(a).length && !(goog.color.names && goog.color.names[a.toLowerCase()] || bot.color.parseRgbaColor(a).length))
};
bot.color.COLOR_PROPERTIES_ = "background-color,border-top-color,border-right-color,border-bottom-color,border-left-color,color,outline-color".split(",");
bot.color.isColorProperty = function(a) {
  return goog.array.contains(bot.color.COLOR_PROPERTIES_, a)
};
bot.color.HEX_TRIPLET_RE_ = /#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])/;
bot.color.normalizeHex = function(a) {
  if(!bot.color.isValidHexColor_(a)) {
    throw Error("'" + a + "' is not a valid hex color");
  }
  4 == a.length && (a = a.replace(bot.color.HEX_TRIPLET_RE_, "#$1$1$2$2$3$3"));
  return a.toLowerCase()
};
bot.color.hexToRgb = function(a) {
  var a = bot.color.normalizeHex(a), b = parseInt(a.substr(1, 2), 16), c = parseInt(a.substr(3, 2), 16), a = parseInt(a.substr(5, 2), 16);
  return[b, c, a]
};
bot.color.VALID_HEX_COLOR_RE_ = /^#(?:[0-9a-f]{3}){1,2}$/i;
bot.color.isValidHexColor_ = function(a) {
  return bot.color.VALID_HEX_COLOR_RE_.test(a)
};
bot.color.NORMALIZED_HEX_COLOR_RE_ = /^#[0-9a-f]{6}$/;
bot.color.isNormalizedHexColor_ = function(a) {
  return bot.color.NORMALIZED_HEX_COLOR_RE_.test(a)
};
bot.color.RGBA_COLOR_RE_ = /^(?:rgba)?\((\d{1,3}),\s?(\d{1,3}),\s?(\d{1,3}),\s?(0|1|0\.\d*)\)$/i;
bot.color.parseRgbaColor = function(a) {
  var b = a.match(bot.color.RGBA_COLOR_RE_);
  if(b) {
    var a = Number(b[1]), c = Number(b[2]), d = Number(b[3]), b = Number(b[4]);
    if(0 <= a && 255 >= a && 0 <= c && 255 >= c && 0 <= d && 255 >= d && 0 <= b && 1 >= b) {
      return[a, c, d, b]
    }
  }
  return[]
};
bot.color.RGB_COLOR_RE_ = /^(?:rgb)?\((0|[1-9]\d{0,2}),\s?(0|[1-9]\d{0,2}),\s?(0|[1-9]\d{0,2})\)$/i;
bot.color.parseRgbColor_ = function(a) {
  var b = a.match(bot.color.RGB_COLOR_RE_);
  if(b) {
    var a = Number(b[1]), c = Number(b[2]), b = Number(b[3]);
    if(0 <= a && 255 >= a && 0 <= c && 255 >= c && 0 <= b && 255 >= b) {
      return[a, c, b]
    }
  }
  return[]
};
bot.color.prependHashIfNecessary_ = function(a) {
  return"#" == a.charAt(0) ? a : "#" + a
};
bot.color.addAlphaIfNecessary_ = function(a) {
  3 == a.length && a.push(1);
  return a
};
bot.color.toRgbaStyle_ = function(a) {
  return"rgba(" + a.join(",") + ")"
};
goog.dom = {};
goog.dom.BrowserFeature = {CAN_ADD_NAME_OR_TYPE_ATTRIBUTES:!goog.userAgent.IE || goog.userAgent.isDocumentMode(9), CAN_USE_CHILDREN_ATTRIBUTE:!goog.userAgent.GECKO && !goog.userAgent.IE || goog.userAgent.IE && goog.userAgent.isDocumentMode(9) || goog.userAgent.GECKO && goog.userAgent.isVersion("1.9.1"), CAN_USE_INNER_TEXT:goog.userAgent.IE && !goog.userAgent.isVersion("9"), INNER_HTML_NEEDS_SCOPED_ELEMENT:goog.userAgent.IE};
goog.dom.TagName = {A:"A", ABBR:"ABBR", ACRONYM:"ACRONYM", ADDRESS:"ADDRESS", APPLET:"APPLET", AREA:"AREA", B:"B", BASE:"BASE", BASEFONT:"BASEFONT", BDO:"BDO", BIG:"BIG", BLOCKQUOTE:"BLOCKQUOTE", BODY:"BODY", BR:"BR", BUTTON:"BUTTON", CANVAS:"CANVAS", CAPTION:"CAPTION", CENTER:"CENTER", CITE:"CITE", CODE:"CODE", COL:"COL", COLGROUP:"COLGROUP", DD:"DD", DEL:"DEL", DFN:"DFN", DIR:"DIR", DIV:"DIV", DL:"DL", DT:"DT", EM:"EM", FIELDSET:"FIELDSET", FONT:"FONT", FORM:"FORM", FRAME:"FRAME", FRAMESET:"FRAMESET", 
H1:"H1", H2:"H2", H3:"H3", H4:"H4", H5:"H5", H6:"H6", HEAD:"HEAD", HR:"HR", HTML:"HTML", I:"I", IFRAME:"IFRAME", IMG:"IMG", INPUT:"INPUT", INS:"INS", ISINDEX:"ISINDEX", KBD:"KBD", LABEL:"LABEL", LEGEND:"LEGEND", LI:"LI", LINK:"LINK", MAP:"MAP", MENU:"MENU", META:"META", NOFRAMES:"NOFRAMES", NOSCRIPT:"NOSCRIPT", OBJECT:"OBJECT", OL:"OL", OPTGROUP:"OPTGROUP", OPTION:"OPTION", P:"P", PARAM:"PARAM", PRE:"PRE", Q:"Q", S:"S", SAMP:"SAMP", SCRIPT:"SCRIPT", SELECT:"SELECT", SMALL:"SMALL", SPAN:"SPAN", STRIKE:"STRIKE", 
STRONG:"STRONG", STYLE:"STYLE", SUB:"SUB", SUP:"SUP", TABLE:"TABLE", TBODY:"TBODY", TD:"TD", TEXTAREA:"TEXTAREA", TFOOT:"TFOOT", TH:"TH", THEAD:"THEAD", TITLE:"TITLE", TR:"TR", TT:"TT", U:"U", UL:"UL", VAR:"VAR"};
goog.dom.classes = {};
goog.dom.classes.set = function(a, b) {
  a.className = b
};
goog.dom.classes.get = function(a) {
  return(a = a.className) && "function" == typeof a.split ? a.split(/\s+/) : []
};
goog.dom.classes.add = function(a, b) {
  var c = goog.dom.classes.get(a), d = goog.array.slice(arguments, 1), d = goog.dom.classes.add_(c, d);
  a.className = c.join(" ");
  return d
};
goog.dom.classes.remove = function(a, b) {
  var c = goog.dom.classes.get(a), d = goog.array.slice(arguments, 1), d = goog.dom.classes.remove_(c, d);
  a.className = c.join(" ");
  return d
};
goog.dom.classes.add_ = function(a, b) {
  for(var c = 0, d = 0;d < b.length;d++) {
    goog.array.contains(a, b[d]) || (a.push(b[d]), c++)
  }
  return c == b.length
};
goog.dom.classes.remove_ = function(a, b) {
  for(var c = 0, d = 0;d < a.length;d++) {
    goog.array.contains(b, a[d]) && (goog.array.splice(a, d--, 1), c++)
  }
  return c == b.length
};
goog.dom.classes.swap = function(a, b, c) {
  for(var d = goog.dom.classes.get(a), e = !1, f = 0;f < d.length;f++) {
    d[f] == b && (goog.array.splice(d, f--, 1), e = !0)
  }
  e && (d.push(c), a.className = d.join(" "));
  return e
};
goog.dom.classes.addRemove = function(a, b, c) {
  var d = goog.dom.classes.get(a);
  goog.isString(b) ? goog.array.remove(d, b) : goog.isArray(b) && goog.dom.classes.remove_(d, b);
  goog.isString(c) && !goog.array.contains(d, c) ? d.push(c) : goog.isArray(c) && goog.dom.classes.add_(d, c);
  a.className = d.join(" ")
};
goog.dom.classes.has = function(a, b) {
  return goog.array.contains(goog.dom.classes.get(a), b)
};
goog.dom.classes.enable = function(a, b, c) {
  c ? goog.dom.classes.add(a, b) : goog.dom.classes.remove(a, b)
};
goog.dom.classes.toggle = function(a, b) {
  var c = !goog.dom.classes.has(a, b);
  goog.dom.classes.enable(a, b, c);
  return c
};
goog.math.Coordinate = function(a, b) {
  this.x = goog.isDef(a) ? a : 0;
  this.y = goog.isDef(b) ? b : 0
};
goog.math.Coordinate.prototype.clone = function() {
  return new goog.math.Coordinate(this.x, this.y)
};
goog.DEBUG && (goog.math.Coordinate.prototype.toString = function() {
  return"(" + this.x + ", " + this.y + ")"
});
goog.math.Coordinate.equals = function(a, b) {
  return a == b ? true : !a || !b ? false : a.x == b.x && a.y == b.y
};
goog.math.Coordinate.distance = function(a, b) {
  var c = a.x - b.x, d = a.y - b.y;
  return Math.sqrt(c * c + d * d)
};
goog.math.Coordinate.squaredDistance = function(a, b) {
  var c = a.x - b.x, d = a.y - b.y;
  return c * c + d * d
};
goog.math.Coordinate.difference = function(a, b) {
  return new goog.math.Coordinate(a.x - b.x, a.y - b.y)
};
goog.math.Coordinate.sum = function(a, b) {
  return new goog.math.Coordinate(a.x + b.x, a.y + b.y)
};
goog.math.Size = function(a, b) {
  this.width = a;
  this.height = b
};
goog.math.Size.equals = function(a, b) {
  return a == b ? !0 : !a || !b ? !1 : a.width == b.width && a.height == b.height
};
goog.math.Size.prototype.clone = function() {
  return new goog.math.Size(this.width, this.height)
};
goog.DEBUG && (goog.math.Size.prototype.toString = function() {
  return"(" + this.width + " x " + this.height + ")"
});
goog.math.Size.prototype.getLongest = function() {
  return Math.max(this.width, this.height)
};
goog.math.Size.prototype.getShortest = function() {
  return Math.min(this.width, this.height)
};
goog.math.Size.prototype.area = function() {
  return this.width * this.height
};
goog.math.Size.prototype.perimeter = function() {
  return(this.width + this.height) * 2
};
goog.math.Size.prototype.aspectRatio = function() {
  return this.width / this.height
};
goog.math.Size.prototype.isEmpty = function() {
  return!this.area()
};
goog.math.Size.prototype.ceil = function() {
  this.width = Math.ceil(this.width);
  this.height = Math.ceil(this.height);
  return this
};
goog.math.Size.prototype.fitsInside = function(a) {
  return this.width <= a.width && this.height <= a.height
};
goog.math.Size.prototype.floor = function() {
  this.width = Math.floor(this.width);
  this.height = Math.floor(this.height);
  return this
};
goog.math.Size.prototype.round = function() {
  this.width = Math.round(this.width);
  this.height = Math.round(this.height);
  return this
};
goog.math.Size.prototype.scale = function(a) {
  this.width = this.width * a;
  this.height = this.height * a;
  return this
};
goog.math.Size.prototype.scaleToFit = function(a) {
  return this.scale(this.aspectRatio() > a.aspectRatio() ? a.width / this.width : a.height / this.height)
};
goog.dom.ASSUME_QUIRKS_MODE = !1;
goog.dom.ASSUME_STANDARDS_MODE = !1;
goog.dom.COMPAT_MODE_KNOWN_ = goog.dom.ASSUME_QUIRKS_MODE || goog.dom.ASSUME_STANDARDS_MODE;
goog.dom.NodeType = {ELEMENT:1, ATTRIBUTE:2, TEXT:3, CDATA_SECTION:4, ENTITY_REFERENCE:5, ENTITY:6, PROCESSING_INSTRUCTION:7, COMMENT:8, DOCUMENT:9, DOCUMENT_TYPE:10, DOCUMENT_FRAGMENT:11, NOTATION:12};
goog.dom.getDomHelper = function(a) {
  return a ? new goog.dom.DomHelper(goog.dom.getOwnerDocument(a)) : goog.dom.defaultDomHelper_ || (goog.dom.defaultDomHelper_ = new goog.dom.DomHelper)
};
goog.dom.getDocument = function() {
  return document
};
goog.dom.getElement = function(a) {
  return goog.isString(a) ? document.getElementById(a) : a
};
goog.dom.$ = goog.dom.getElement;
goog.dom.getElementsByTagNameAndClass = function(a, b, c) {
  return goog.dom.getElementsByTagNameAndClass_(document, a, b, c)
};
goog.dom.getElementsByClass = function(a, b) {
  var c = b || document;
  return goog.dom.canUseQuerySelector_(c) ? c.querySelectorAll("." + a) : c.getElementsByClassName ? c.getElementsByClassName(a) : goog.dom.getElementsByTagNameAndClass_(document, "*", a, b)
};
goog.dom.getElementByClass = function(a, b) {
  var c = b || document, d = null;
  return(d = goog.dom.canUseQuerySelector_(c) ? c.querySelector("." + a) : goog.dom.getElementsByClass(a, b)[0]) || null
};
goog.dom.canUseQuerySelector_ = function(a) {
  return a.querySelectorAll && a.querySelector && (!goog.userAgent.WEBKIT || goog.dom.isCss1CompatMode_(document) || goog.userAgent.isVersion("528"))
};
goog.dom.getElementsByTagNameAndClass_ = function(a, b, c, d) {
  a = d || a;
  b = b && "*" != b ? b.toUpperCase() : "";
  if(goog.dom.canUseQuerySelector_(a) && (b || c)) {
    return a.querySelectorAll(b + (c ? "." + c : ""))
  }
  if(c && a.getElementsByClassName) {
    a = a.getElementsByClassName(c);
    if(b) {
      for(var d = {}, e = 0, f = 0, g;g = a[f];f++) {
        b == g.nodeName && (d[e++] = g)
      }
      d.length = e;
      return d
    }
    return a
  }
  a = a.getElementsByTagName(b || "*");
  if(c) {
    d = {};
    for(f = e = 0;g = a[f];f++) {
      b = g.className, "function" == typeof b.split && goog.array.contains(b.split(/\s+/), c) && (d[e++] = g)
    }
    d.length = e;
    return d
  }
  return a
};
goog.dom.$$ = goog.dom.getElementsByTagNameAndClass;
goog.dom.setProperties = function(a, b) {
  goog.object.forEach(b, function(b, d) {
    "style" == d ? a.style.cssText = b : "class" == d ? a.className = b : "for" == d ? a.htmlFor = b : d in goog.dom.DIRECT_ATTRIBUTE_MAP_ ? a.setAttribute(goog.dom.DIRECT_ATTRIBUTE_MAP_[d], b) : goog.string.startsWith(d, "aria-") ? a.setAttribute(d, b) : a[d] = b
  })
};
goog.dom.DIRECT_ATTRIBUTE_MAP_ = {cellpadding:"cellPadding", cellspacing:"cellSpacing", colspan:"colSpan", rowspan:"rowSpan", valign:"vAlign", height:"height", width:"width", usemap:"useMap", frameborder:"frameBorder", maxlength:"maxLength", type:"type"};
goog.dom.getViewportSize = function(a) {
  return goog.dom.getViewportSize_(a || window)
};
goog.dom.getViewportSize_ = function(a) {
  var b = a.document;
  if(goog.userAgent.WEBKIT && !goog.userAgent.isVersion("500") && !goog.userAgent.MOBILE) {
    "undefined" == typeof a.innerHeight && (a = window);
    var b = a.innerHeight, c = a.document.documentElement.scrollHeight;
    a == a.top && c < b && (b -= 15);
    return new goog.math.Size(a.innerWidth, b)
  }
  a = goog.dom.isCss1CompatMode_(b) ? b.documentElement : b.body;
  return new goog.math.Size(a.clientWidth, a.clientHeight)
};
goog.dom.getDocumentHeight = function() {
  return goog.dom.getDocumentHeight_(window)
};
goog.dom.getDocumentHeight_ = function(a) {
  var b = a.document, c = 0;
  if(b) {
    var a = goog.dom.getViewportSize_(a).height, c = b.body, d = b.documentElement;
    if(goog.dom.isCss1CompatMode_(b) && d.scrollHeight) {
      c = d.scrollHeight != a ? d.scrollHeight : d.offsetHeight
    }else {
      var b = d.scrollHeight, e = d.offsetHeight;
      d.clientHeight != e && (b = c.scrollHeight, e = c.offsetHeight);
      c = b > a ? b > e ? b : e : b < e ? b : e
    }
  }
  return c
};
goog.dom.getPageScroll = function(a) {
  return goog.dom.getDomHelper((a || goog.global || window).document).getDocumentScroll()
};
goog.dom.getDocumentScroll = function() {
  return goog.dom.getDocumentScroll_(document)
};
goog.dom.getDocumentScroll_ = function(a) {
  var b = goog.dom.getDocumentScrollElement_(a), a = goog.dom.getWindow_(a);
  return new goog.math.Coordinate(a.pageXOffset || b.scrollLeft, a.pageYOffset || b.scrollTop)
};
goog.dom.getDocumentScrollElement = function() {
  return goog.dom.getDocumentScrollElement_(document)
};
goog.dom.getDocumentScrollElement_ = function(a) {
  return!goog.userAgent.WEBKIT && goog.dom.isCss1CompatMode_(a) ? a.documentElement : a.body
};
goog.dom.getWindow = function(a) {
  return a ? goog.dom.getWindow_(a) : window
};
goog.dom.getWindow_ = function(a) {
  return a.parentWindow || a.defaultView
};
goog.dom.createDom = function(a, b, c) {
  return goog.dom.createDom_(document, arguments)
};
goog.dom.createDom_ = function(a, b) {
  var c = b[0], d = b[1];
  if(!goog.dom.BrowserFeature.CAN_ADD_NAME_OR_TYPE_ATTRIBUTES && d && (d.name || d.type)) {
    c = ["<", c];
    d.name && c.push(' name="', goog.string.htmlEscape(d.name), '"');
    if(d.type) {
      c.push(' type="', goog.string.htmlEscape(d.type), '"');
      var e = {};
      goog.object.extend(e, d);
      d = e;
      delete d.type
    }
    c.push(">");
    c = c.join("")
  }
  c = a.createElement(c);
  d && (goog.isString(d) ? c.className = d : goog.isArray(d) ? goog.dom.classes.add.apply(null, [c].concat(d)) : goog.dom.setProperties(c, d));
  2 < b.length && goog.dom.append_(a, c, b, 2);
  return c
};
goog.dom.append_ = function(a, b, c, d) {
  function e(c) {
    c && b.appendChild(goog.isString(c) ? a.createTextNode(c) : c)
  }
  for(;d < c.length;d++) {
    var f = c[d];
    goog.isArrayLike(f) && !goog.dom.isNodeLike(f) ? goog.array.forEach(goog.dom.isNodeList(f) ? goog.array.clone(f) : f, e) : e(f)
  }
};
goog.dom.$dom = goog.dom.createDom;
goog.dom.createElement = function(a) {
  return document.createElement(a)
};
goog.dom.createTextNode = function(a) {
  return document.createTextNode(a)
};
goog.dom.createTable = function(a, b, c) {
  return goog.dom.createTable_(document, a, b, !!c)
};
goog.dom.createTable_ = function(a, b, c, d) {
  for(var e = ["<tr>"], f = 0;f < c;f++) {
    e.push(d ? "<td>&nbsp;</td>" : "<td></td>")
  }
  e.push("</tr>");
  e = e.join("");
  c = ["<table>"];
  for(f = 0;f < b;f++) {
    c.push(e)
  }
  c.push("</table>");
  a = a.createElement(goog.dom.TagName.DIV);
  a.innerHTML = c.join("");
  return a.removeChild(a.firstChild)
};
goog.dom.htmlToDocumentFragment = function(a) {
  return goog.dom.htmlToDocumentFragment_(document, a)
};
goog.dom.htmlToDocumentFragment_ = function(a, b) {
  var c = a.createElement("div");
  goog.dom.BrowserFeature.INNER_HTML_NEEDS_SCOPED_ELEMENT ? (c.innerHTML = "<br>" + b, c.removeChild(c.firstChild)) : c.innerHTML = b;
  if(1 == c.childNodes.length) {
    return c.removeChild(c.firstChild)
  }
  for(var d = a.createDocumentFragment();c.firstChild;) {
    d.appendChild(c.firstChild)
  }
  return d
};
goog.dom.getCompatMode = function() {
  return goog.dom.isCss1CompatMode() ? "CSS1Compat" : "BackCompat"
};
goog.dom.isCss1CompatMode = function() {
  return goog.dom.isCss1CompatMode_(document)
};
goog.dom.isCss1CompatMode_ = function(a) {
  return goog.dom.COMPAT_MODE_KNOWN_ ? goog.dom.ASSUME_STANDARDS_MODE : "CSS1Compat" == a.compatMode
};
goog.dom.canHaveChildren = function(a) {
  if(a.nodeType != goog.dom.NodeType.ELEMENT) {
    return!1
  }
  switch(a.tagName) {
    case goog.dom.TagName.APPLET:
    ;
    case goog.dom.TagName.AREA:
    ;
    case goog.dom.TagName.BASE:
    ;
    case goog.dom.TagName.BR:
    ;
    case goog.dom.TagName.COL:
    ;
    case goog.dom.TagName.FRAME:
    ;
    case goog.dom.TagName.HR:
    ;
    case goog.dom.TagName.IMG:
    ;
    case goog.dom.TagName.INPUT:
    ;
    case goog.dom.TagName.IFRAME:
    ;
    case goog.dom.TagName.ISINDEX:
    ;
    case goog.dom.TagName.LINK:
    ;
    case goog.dom.TagName.NOFRAMES:
    ;
    case goog.dom.TagName.NOSCRIPT:
    ;
    case goog.dom.TagName.META:
    ;
    case goog.dom.TagName.OBJECT:
    ;
    case goog.dom.TagName.PARAM:
    ;
    case goog.dom.TagName.SCRIPT:
    ;
    case goog.dom.TagName.STYLE:
      return!1
  }
  return!0
};
goog.dom.appendChild = function(a, b) {
  a.appendChild(b)
};
goog.dom.append = function(a, b) {
  goog.dom.append_(goog.dom.getOwnerDocument(a), a, arguments, 1)
};
goog.dom.removeChildren = function(a) {
  for(var b;b = a.firstChild;) {
    a.removeChild(b)
  }
};
goog.dom.insertSiblingBefore = function(a, b) {
  b.parentNode && b.parentNode.insertBefore(a, b)
};
goog.dom.insertSiblingAfter = function(a, b) {
  b.parentNode && b.parentNode.insertBefore(a, b.nextSibling)
};
goog.dom.insertChildAt = function(a, b, c) {
  a.insertBefore(b, a.childNodes[c] || null)
};
goog.dom.removeNode = function(a) {
  return a && a.parentNode ? a.parentNode.removeChild(a) : null
};
goog.dom.replaceNode = function(a, b) {
  var c = b.parentNode;
  c && c.replaceChild(a, b)
};
goog.dom.flattenElement = function(a) {
  var b, c = a.parentNode;
  if(c && c.nodeType != goog.dom.NodeType.DOCUMENT_FRAGMENT) {
    if(a.removeNode) {
      return a.removeNode(!1)
    }
    for(;b = a.firstChild;) {
      c.insertBefore(b, a)
    }
    return goog.dom.removeNode(a)
  }
};
goog.dom.getChildren = function(a) {
  return goog.dom.BrowserFeature.CAN_USE_CHILDREN_ATTRIBUTE && void 0 != a.children ? a.children : goog.array.filter(a.childNodes, function(a) {
    return a.nodeType == goog.dom.NodeType.ELEMENT
  })
};
goog.dom.getFirstElementChild = function(a) {
  return void 0 != a.firstElementChild ? a.firstElementChild : goog.dom.getNextElementNode_(a.firstChild, !0)
};
goog.dom.getLastElementChild = function(a) {
  return void 0 != a.lastElementChild ? a.lastElementChild : goog.dom.getNextElementNode_(a.lastChild, !1)
};
goog.dom.getNextElementSibling = function(a) {
  return void 0 != a.nextElementSibling ? a.nextElementSibling : goog.dom.getNextElementNode_(a.nextSibling, !0)
};
goog.dom.getPreviousElementSibling = function(a) {
  return void 0 != a.previousElementSibling ? a.previousElementSibling : goog.dom.getNextElementNode_(a.previousSibling, !1)
};
goog.dom.getNextElementNode_ = function(a, b) {
  for(;a && a.nodeType != goog.dom.NodeType.ELEMENT;) {
    a = b ? a.nextSibling : a.previousSibling
  }
  return a
};
goog.dom.getNextNode = function(a) {
  if(!a) {
    return null
  }
  if(a.firstChild) {
    return a.firstChild
  }
  for(;a && !a.nextSibling;) {
    a = a.parentNode
  }
  return a ? a.nextSibling : null
};
goog.dom.getPreviousNode = function(a) {
  if(!a) {
    return null
  }
  if(!a.previousSibling) {
    return a.parentNode
  }
  for(a = a.previousSibling;a && a.lastChild;) {
    a = a.lastChild
  }
  return a
};
goog.dom.isNodeLike = function(a) {
  return goog.isObject(a) && 0 < a.nodeType
};
goog.dom.isElement = function(a) {
  return goog.isObject(a) && a.nodeType == goog.dom.NodeType.ELEMENT
};
goog.dom.isWindow = function(a) {
  return goog.isObject(a) && a.window == a
};
goog.dom.contains = function(a, b) {
  if(a.contains && b.nodeType == goog.dom.NodeType.ELEMENT) {
    return a == b || a.contains(b)
  }
  if("undefined" != typeof a.compareDocumentPosition) {
    return a == b || Boolean(a.compareDocumentPosition(b) & 16)
  }
  for(;b && a != b;) {
    b = b.parentNode
  }
  return b == a
};
goog.dom.compareNodeOrder = function(a, b) {
  if(a == b) {
    return 0
  }
  if(a.compareDocumentPosition) {
    return a.compareDocumentPosition(b) & 2 ? 1 : -1
  }
  if("sourceIndex" in a || a.parentNode && "sourceIndex" in a.parentNode) {
    var c = a.nodeType == goog.dom.NodeType.ELEMENT, d = b.nodeType == goog.dom.NodeType.ELEMENT;
    if(c && d) {
      return a.sourceIndex - b.sourceIndex
    }
    var e = a.parentNode, f = b.parentNode;
    return e == f ? goog.dom.compareSiblingOrder_(a, b) : !c && goog.dom.contains(e, b) ? -1 * goog.dom.compareParentsDescendantNodeIe_(a, b) : !d && goog.dom.contains(f, a) ? goog.dom.compareParentsDescendantNodeIe_(b, a) : (c ? a.sourceIndex : e.sourceIndex) - (d ? b.sourceIndex : f.sourceIndex)
  }
  d = goog.dom.getOwnerDocument(a);
  c = d.createRange();
  c.selectNode(a);
  c.collapse(!0);
  d = d.createRange();
  d.selectNode(b);
  d.collapse(!0);
  return c.compareBoundaryPoints(goog.global.Range.START_TO_END, d)
};
goog.dom.compareParentsDescendantNodeIe_ = function(a, b) {
  var c = a.parentNode;
  if(c == b) {
    return-1
  }
  for(var d = b;d.parentNode != c;) {
    d = d.parentNode
  }
  return goog.dom.compareSiblingOrder_(d, a)
};
goog.dom.compareSiblingOrder_ = function(a, b) {
  for(var c = b;c = c.previousSibling;) {
    if(c == a) {
      return-1
    }
  }
  return 1
};
goog.dom.findCommonAncestor = function(a) {
  var b, c = arguments.length;
  if(c) {
    if(1 == c) {
      return arguments[0]
    }
  }else {
    return null
  }
  var d = [], e = Infinity;
  for(b = 0;b < c;b++) {
    for(var f = [], g = arguments[b];g;) {
      f.unshift(g), g = g.parentNode
    }
    d.push(f);
    e = Math.min(e, f.length)
  }
  f = null;
  for(b = 0;b < e;b++) {
    for(var g = d[0][b], h = 1;h < c;h++) {
      if(g != d[h][b]) {
        return f
      }
    }
    f = g
  }
  return f
};
goog.dom.getOwnerDocument = function(a) {
  return a.nodeType == goog.dom.NodeType.DOCUMENT ? a : a.ownerDocument || a.document
};
goog.dom.getFrameContentDocument = function(a) {
  return a.contentDocument || a.contentWindow.document
};
goog.dom.getFrameContentWindow = function(a) {
  return a.contentWindow || goog.dom.getWindow_(goog.dom.getFrameContentDocument(a))
};
goog.dom.setTextContent = function(a, b) {
  if("textContent" in a) {
    a.textContent = b
  }else {
    if(a.firstChild && a.firstChild.nodeType == goog.dom.NodeType.TEXT) {
      for(;a.lastChild != a.firstChild;) {
        a.removeChild(a.lastChild)
      }
      a.firstChild.data = b
    }else {
      goog.dom.removeChildren(a);
      var c = goog.dom.getOwnerDocument(a);
      a.appendChild(c.createTextNode(b))
    }
  }
};
goog.dom.getOuterHtml = function(a) {
  if("outerHTML" in a) {
    return a.outerHTML
  }
  var b = goog.dom.getOwnerDocument(a).createElement("div");
  b.appendChild(a.cloneNode(!0));
  return b.innerHTML
};
goog.dom.findNode = function(a, b) {
  var c = [];
  return goog.dom.findNodes_(a, b, c, !0) ? c[0] : void 0
};
goog.dom.findNodes = function(a, b) {
  var c = [];
  goog.dom.findNodes_(a, b, c, !1);
  return c
};
goog.dom.findNodes_ = function(a, b, c, d) {
  if(null != a) {
    for(a = a.firstChild;a;) {
      if(b(a) && (c.push(a), d) || goog.dom.findNodes_(a, b, c, d)) {
        return!0
      }
      a = a.nextSibling
    }
  }
  return!1
};
goog.dom.TAGS_TO_IGNORE_ = {SCRIPT:1, STYLE:1, HEAD:1, IFRAME:1, OBJECT:1};
goog.dom.PREDEFINED_TAG_VALUES_ = {IMG:" ", BR:"\n"};
goog.dom.isFocusableTabIndex = function(a) {
  var b = a.getAttributeNode("tabindex");
  return b && b.specified ? (a = a.tabIndex, goog.isNumber(a) && 0 <= a && 32768 > a) : !1
};
goog.dom.setFocusableTabIndex = function(a, b) {
  b ? a.tabIndex = 0 : (a.tabIndex = -1, a.removeAttribute("tabIndex"))
};
goog.dom.getTextContent = function(a) {
  if(goog.dom.BrowserFeature.CAN_USE_INNER_TEXT && "innerText" in a) {
    a = goog.string.canonicalizeNewlines(a.innerText)
  }else {
    var b = [];
    goog.dom.getTextContent_(a, b, !0);
    a = b.join("")
  }
  a = a.replace(/ \xAD /g, " ").replace(/\xAD/g, "");
  a = a.replace(/\u200B/g, "");
  goog.dom.BrowserFeature.CAN_USE_INNER_TEXT || (a = a.replace(/ +/g, " "));
  " " != a && (a = a.replace(/^\s*/, ""));
  return a
};
goog.dom.getRawTextContent = function(a) {
  var b = [];
  goog.dom.getTextContent_(a, b, !1);
  return b.join("")
};
goog.dom.getTextContent_ = function(a, b, c) {
  if(!(a.nodeName in goog.dom.TAGS_TO_IGNORE_)) {
    if(a.nodeType == goog.dom.NodeType.TEXT) {
      c ? b.push(("" + a.nodeValue).replace(/(\r\n|\r|\n)/g, "")) : b.push(a.nodeValue)
    }else {
      if(a.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) {
        b.push(goog.dom.PREDEFINED_TAG_VALUES_[a.nodeName])
      }else {
        for(a = a.firstChild;a;) {
          goog.dom.getTextContent_(a, b, c), a = a.nextSibling
        }
      }
    }
  }
};
goog.dom.getNodeTextLength = function(a) {
  return goog.dom.getTextContent(a).length
};
goog.dom.getNodeTextOffset = function(a, b) {
  for(var c = b || goog.dom.getOwnerDocument(a).body, d = [];a && a != c;) {
    for(var e = a;e = e.previousSibling;) {
      d.unshift(goog.dom.getTextContent(e))
    }
    a = a.parentNode
  }
  return goog.string.trimLeft(d.join("")).replace(/ +/g, " ").length
};
goog.dom.getNodeAtOffset = function(a, b, c) {
  for(var a = [a], d = 0, e;0 < a.length && d < b;) {
    if(e = a.pop(), !(e.nodeName in goog.dom.TAGS_TO_IGNORE_)) {
      if(e.nodeType == goog.dom.NodeType.TEXT) {
        var f = e.nodeValue.replace(/(\r\n|\r|\n)/g, "").replace(/ +/g, " "), d = d + f.length
      }else {
        if(e.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) {
          d += goog.dom.PREDEFINED_TAG_VALUES_[e.nodeName].length
        }else {
          for(f = e.childNodes.length - 1;0 <= f;f--) {
            a.push(e.childNodes[f])
          }
        }
      }
    }
  }
  goog.isObject(c) && (c.remainder = e ? e.nodeValue.length + b - d - 1 : 0, c.node = e);
  return e
};
goog.dom.isNodeList = function(a) {
  if(a && "number" == typeof a.length) {
    if(goog.isObject(a)) {
      return"function" == typeof a.item || "string" == typeof a.item
    }
    if(goog.isFunction(a)) {
      return"function" == typeof a.item
    }
  }
  return!1
};
goog.dom.getAncestorByTagNameAndClass = function(a, b, c) {
  var d = b ? b.toUpperCase() : null;
  return goog.dom.getAncestor(a, function(a) {
    return(!d || a.nodeName == d) && (!c || goog.dom.classes.has(a, c))
  }, !0)
};
goog.dom.getAncestorByClass = function(a, b) {
  return goog.dom.getAncestorByTagNameAndClass(a, null, b)
};
goog.dom.getAncestor = function(a, b, c, d) {
  c || (a = a.parentNode);
  for(var c = null == d, e = 0;a && (c || e <= d);) {
    if(b(a)) {
      return a
    }
    a = a.parentNode;
    e++
  }
  return null
};
goog.dom.getActiveElement = function(a) {
  try {
    return a && a.activeElement
  }catch(b) {
  }
  return null
};
goog.dom.DomHelper = function(a) {
  this.document_ = a || goog.global.document || document
};
goog.dom.DomHelper.prototype.getDomHelper = goog.dom.getDomHelper;
goog.dom.DomHelper.prototype.setDocument = function(a) {
  this.document_ = a
};
goog.dom.DomHelper.prototype.getDocument = function() {
  return this.document_
};
goog.dom.DomHelper.prototype.getElement = function(a) {
  return goog.isString(a) ? this.document_.getElementById(a) : a
};
goog.dom.DomHelper.prototype.$ = goog.dom.DomHelper.prototype.getElement;
goog.dom.DomHelper.prototype.getElementsByTagNameAndClass = function(a, b, c) {
  return goog.dom.getElementsByTagNameAndClass_(this.document_, a, b, c)
};
goog.dom.DomHelper.prototype.getElementsByClass = function(a, b) {
  return goog.dom.getElementsByClass(a, b || this.document_)
};
goog.dom.DomHelper.prototype.getElementByClass = function(a, b) {
  return goog.dom.getElementByClass(a, b || this.document_)
};
goog.dom.DomHelper.prototype.$$ = goog.dom.DomHelper.prototype.getElementsByTagNameAndClass;
goog.dom.DomHelper.prototype.setProperties = goog.dom.setProperties;
goog.dom.DomHelper.prototype.getViewportSize = function(a) {
  return goog.dom.getViewportSize(a || this.getWindow())
};
goog.dom.DomHelper.prototype.getDocumentHeight = function() {
  return goog.dom.getDocumentHeight_(this.getWindow())
};
goog.dom.DomHelper.prototype.createDom = function(a, b, c) {
  return goog.dom.createDom_(this.document_, arguments)
};
goog.dom.DomHelper.prototype.$dom = goog.dom.DomHelper.prototype.createDom;
goog.dom.DomHelper.prototype.createElement = function(a) {
  return this.document_.createElement(a)
};
goog.dom.DomHelper.prototype.createTextNode = function(a) {
  return this.document_.createTextNode(a)
};
goog.dom.DomHelper.prototype.createTable = function(a, b, c) {
  return goog.dom.createTable_(this.document_, a, b, !!c)
};
goog.dom.DomHelper.prototype.htmlToDocumentFragment = function(a) {
  return goog.dom.htmlToDocumentFragment_(this.document_, a)
};
goog.dom.DomHelper.prototype.getCompatMode = function() {
  return this.isCss1CompatMode() ? "CSS1Compat" : "BackCompat"
};
goog.dom.DomHelper.prototype.isCss1CompatMode = function() {
  return goog.dom.isCss1CompatMode_(this.document_)
};
goog.dom.DomHelper.prototype.getWindow = function() {
  return goog.dom.getWindow_(this.document_)
};
goog.dom.DomHelper.prototype.getDocumentScrollElement = function() {
  return goog.dom.getDocumentScrollElement_(this.document_)
};
goog.dom.DomHelper.prototype.getDocumentScroll = function() {
  return goog.dom.getDocumentScroll_(this.document_)
};
goog.dom.DomHelper.prototype.appendChild = goog.dom.appendChild;
goog.dom.DomHelper.prototype.append = goog.dom.append;
goog.dom.DomHelper.prototype.removeChildren = goog.dom.removeChildren;
goog.dom.DomHelper.prototype.insertSiblingBefore = goog.dom.insertSiblingBefore;
goog.dom.DomHelper.prototype.insertSiblingAfter = goog.dom.insertSiblingAfter;
goog.dom.DomHelper.prototype.removeNode = goog.dom.removeNode;
goog.dom.DomHelper.prototype.replaceNode = goog.dom.replaceNode;
goog.dom.DomHelper.prototype.flattenElement = goog.dom.flattenElement;
goog.dom.DomHelper.prototype.getFirstElementChild = goog.dom.getFirstElementChild;
goog.dom.DomHelper.prototype.getLastElementChild = goog.dom.getLastElementChild;
goog.dom.DomHelper.prototype.getNextElementSibling = goog.dom.getNextElementSibling;
goog.dom.DomHelper.prototype.getPreviousElementSibling = goog.dom.getPreviousElementSibling;
goog.dom.DomHelper.prototype.getNextNode = goog.dom.getNextNode;
goog.dom.DomHelper.prototype.getPreviousNode = goog.dom.getPreviousNode;
goog.dom.DomHelper.prototype.isNodeLike = goog.dom.isNodeLike;
goog.dom.DomHelper.prototype.contains = goog.dom.contains;
goog.dom.DomHelper.prototype.getOwnerDocument = goog.dom.getOwnerDocument;
goog.dom.DomHelper.prototype.getFrameContentDocument = goog.dom.getFrameContentDocument;
goog.dom.DomHelper.prototype.getFrameContentWindow = goog.dom.getFrameContentWindow;
goog.dom.DomHelper.prototype.setTextContent = goog.dom.setTextContent;
goog.dom.DomHelper.prototype.findNode = goog.dom.findNode;
goog.dom.DomHelper.prototype.findNodes = goog.dom.findNodes;
goog.dom.DomHelper.prototype.getTextContent = goog.dom.getTextContent;
goog.dom.DomHelper.prototype.getNodeTextLength = goog.dom.getNodeTextLength;
goog.dom.DomHelper.prototype.getNodeTextOffset = goog.dom.getNodeTextOffset;
goog.dom.DomHelper.prototype.getAncestorByTagNameAndClass = goog.dom.getAncestorByTagNameAndClass;
goog.dom.DomHelper.prototype.getAncestorByClass = goog.dom.getAncestorByClass;
goog.dom.DomHelper.prototype.getAncestor = goog.dom.getAncestor;
bot.locators = {};
bot.locators.xpath = {};
bot.locators.XPathResult_ = {ORDERED_NODE_SNAPSHOT_TYPE:7, FIRST_ORDERED_NODE_TYPE:9};
bot.locators.xpath.DEFAULT_RESOLVER_ = function() {
  var a = {svg:"http://www.w3.org/2000/svg"};
  return function(b) {
    return a[b] || null
  }
}();
bot.locators.xpath.evaluate_ = function(a, b, c) {
  var d = goog.dom.getOwnerDocument(a);
  try {
    if(!d.implementation || !d.implementation.hasFeature("XPath", "3.0")) {
      return null
    }
  }catch(e) {
    return null
  }
  try {
    var f = d.createNSResolver ? d.createNSResolver(d.documentElement) : bot.locators.xpath.DEFAULT_RESOLVER_;
    return d.evaluate(b, a, f, c, null)
  }catch(g) {
    if(!(goog.userAgent.GECKO && "NS_ERROR_ILLEGAL_VALUE" == g.name)) {
      throw new bot.Error(bot.ErrorCode.INVALID_SELECTOR_ERROR, "Unable to locate an element with the xpath expression " + b + " because of the following error:\n" + g);
    }
  }
};
bot.locators.xpath.checkElement_ = function(a, b) {
  if(!a || a.nodeType != goog.dom.NodeType.ELEMENT) {
    throw new bot.Error(bot.ErrorCode.INVALID_SELECTOR_ERROR, 'The result of the xpath expression "' + b + '" is: ' + a + ". It should be an element.");
  }
};
bot.locators.xpath.single = function(a, b) {
  var c = function() {
    var c = bot.locators.xpath.evaluate_(b, a, bot.locators.XPathResult_.FIRST_ORDERED_NODE_TYPE);
    return c ? (c = c.singleNodeValue, goog.userAgent.OPERA ? c : c || null) : b.selectSingleNode ? (c = goog.dom.getOwnerDocument(b), c.setProperty && c.setProperty("SelectionLanguage", "XPath"), b.selectSingleNode(a)) : null
  }();
  goog.isNull(c) || bot.locators.xpath.checkElement_(c, a);
  return c
};
bot.locators.xpath.many = function(a, b) {
  var c = function() {
    var c = bot.locators.xpath.evaluate_(b, a, bot.locators.XPathResult_.ORDERED_NODE_SNAPSHOT_TYPE);
    if(c) {
      var e = c.snapshotLength;
      goog.userAgent.OPERA && !goog.isDef(e) && bot.locators.xpath.checkElement_(null, a);
      for(var f = [], g = 0;g < e;++g) {
        f.push(c.snapshotItem(g))
      }
      return f
    }
    return b.selectNodes ? (c = goog.dom.getOwnerDocument(b), c.setProperty && c.setProperty("SelectionLanguage", "XPath"), b.selectNodes(a)) : []
  }();
  goog.array.forEach(c, function(b) {
    bot.locators.xpath.checkElement_(b, a)
  });
  return c
};
goog.userAgent.product = {};
goog.userAgent.product.ASSUME_FIREFOX = !1;
goog.userAgent.product.ASSUME_CAMINO = !1;
goog.userAgent.product.ASSUME_IPHONE = !1;
goog.userAgent.product.ASSUME_IPAD = !1;
goog.userAgent.product.ASSUME_ANDROID = !1;
goog.userAgent.product.ASSUME_CHROME = !1;
goog.userAgent.product.ASSUME_SAFARI = !1;
goog.userAgent.product.PRODUCT_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_OPERA || goog.userAgent.product.ASSUME_FIREFOX || goog.userAgent.product.ASSUME_CAMINO || goog.userAgent.product.ASSUME_IPHONE || goog.userAgent.product.ASSUME_IPAD || goog.userAgent.product.ASSUME_ANDROID || goog.userAgent.product.ASSUME_CHROME || goog.userAgent.product.ASSUME_SAFARI;
goog.userAgent.product.init_ = function() {
  goog.userAgent.product.detectedFirefox_ = !1;
  goog.userAgent.product.detectedCamino_ = !1;
  goog.userAgent.product.detectedIphone_ = !1;
  goog.userAgent.product.detectedIpad_ = !1;
  goog.userAgent.product.detectedAndroid_ = !1;
  goog.userAgent.product.detectedChrome_ = !1;
  goog.userAgent.product.detectedSafari_ = !1;
  var a = goog.userAgent.getUserAgentString();
  a && (-1 != a.indexOf("Firefox") ? goog.userAgent.product.detectedFirefox_ = !0 : -1 != a.indexOf("Camino") ? goog.userAgent.product.detectedCamino_ = !0 : -1 != a.indexOf("iPhone") || -1 != a.indexOf("iPod") ? goog.userAgent.product.detectedIphone_ = !0 : -1 != a.indexOf("iPad") ? goog.userAgent.product.detectedIpad_ = !0 : -1 != a.indexOf("Android") ? goog.userAgent.product.detectedAndroid_ = !0 : -1 != a.indexOf("Chrome") ? goog.userAgent.product.detectedChrome_ = !0 : -1 != a.indexOf("Safari") && 
  (goog.userAgent.product.detectedSafari_ = !0))
};
goog.userAgent.product.PRODUCT_KNOWN_ || goog.userAgent.product.init_();
goog.userAgent.product.OPERA = goog.userAgent.OPERA;
goog.userAgent.product.IE = goog.userAgent.IE;
goog.userAgent.product.FIREFOX = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_FIREFOX : goog.userAgent.product.detectedFirefox_;
goog.userAgent.product.CAMINO = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_CAMINO : goog.userAgent.product.detectedCamino_;
goog.userAgent.product.IPHONE = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_IPHONE : goog.userAgent.product.detectedIphone_;
goog.userAgent.product.IPAD = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_IPAD : goog.userAgent.product.detectedIpad_;
goog.userAgent.product.ANDROID = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_ANDROID : goog.userAgent.product.detectedAndroid_;
goog.userAgent.product.CHROME = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_CHROME : goog.userAgent.product.detectedChrome_;
goog.userAgent.product.SAFARI = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_SAFARI : goog.userAgent.product.detectedSafari_;
goog.userAgent.product.determineVersion_ = function() {
  var a = "", b, c;
  if(goog.userAgent.product.FIREFOX) {
    b = /Firefox\/([0-9.]+)/
  }else {
    if(goog.userAgent.product.IE || goog.userAgent.product.OPERA) {
      return goog.userAgent.VERSION
    }
    goog.userAgent.product.CHROME ? b = /Chrome\/([0-9.]+)/ : goog.userAgent.product.SAFARI ? b = /Version\/([0-9.]+)/ : goog.userAgent.product.IPHONE || goog.userAgent.product.IPAD ? (b = /Version\/(\S+).*Mobile\/(\S+)/, c = !0) : goog.userAgent.product.ANDROID ? b = /Android\s+([0-9.]+)(?:.*Version\/([0-9.]+))?/ : goog.userAgent.product.CAMINO && (b = /Camino\/([0-9.]+)/)
  }
  b && (a = (a = b.exec(goog.userAgent.getUserAgentString())) ? c ? a[1] + "." + a[2] : a[2] || a[1] : "");
  return a
};
goog.userAgent.product.VERSION = goog.userAgent.product.determineVersion_();
goog.userAgent.product.isVersion = function(a) {
  return 0 <= goog.string.compareVersions(goog.userAgent.product.VERSION, a)
};
bot.userAgent = {};
bot.userAgent.isEngineVersion = function(a) {
  return bot.userAgent.FIREFOX_EXTENSION ? bot.userAgent.FIREFOX_EXTENSION_IS_ENGINE_VERSION_(a) : goog.userAgent.IE ? 0 <= goog.string.compareVersions(document.documentMode, a) : goog.userAgent.isVersion(a)
};
bot.userAgent.isProductVersion = function(a) {
  return bot.userAgent.FIREFOX_EXTENSION ? bot.userAgent.FIREFOX_EXTENSION_IS_PRODUCT_VERSION_(a) : goog.userAgent.product.ANDROID ? 0 <= goog.string.compareVersions(bot.userAgent.ANDROID_VERSION_, a) : goog.userAgent.product.isVersion(a)
};
bot.userAgent.FIREFOX_EXTENSION = function() {
  if(!goog.userAgent.GECKO) {
    return!1
  }
  var a = goog.global.Components;
  if(!a) {
    return!1
  }
  try {
    if(!a.classes) {
      return!1
    }
  }catch(b) {
    return!1
  }
  var c = a.classes, a = a.interfaces, d = c["@mozilla.org/xpcom/version-comparator;1"].getService(a.nsIVersionComparator), c = c["@mozilla.org/xre/app-info;1"].getService(a.nsIXULAppInfo), e = c.platformVersion, f = c.version;
  bot.userAgent.FIREFOX_EXTENSION_IS_ENGINE_VERSION_ = function(a) {
    return 0 <= d.compare(e, "" + a)
  };
  bot.userAgent.FIREFOX_EXTENSION_IS_PRODUCT_VERSION_ = function(a) {
    return 0 <= d.compare(f, "" + a)
  };
  return!0
}();
bot.userAgent.IOS = goog.userAgent.product.IPAD || goog.userAgent.product.IPHONE;
bot.userAgent.MOBILE = bot.userAgent.IOS || goog.userAgent.product.ANDROID;
bot.userAgent.ANDROID_VERSION_ = function() {
  if(goog.userAgent.product.ANDROID) {
    var a = /Android\s+([0-9\.]+)/.exec(goog.userAgent.getUserAgentString());
    return a ? a[1] : "0"
  }
  return"0"
}();
bot.userAgent.IE_DOC_9 = goog.userAgent.IE && 9 <= document.documentMode;
bot.userAgent.IE_DOC_PRE9 = goog.userAgent.IE && !bot.userAgent.IE_DOC_9;
bot.window = {};
bot.window.HISTORY_LENGTH_INCLUDES_NEW_PAGE_ = !goog.userAgent.IE && !goog.userAgent.OPERA;
bot.window.HISTORY_LENGTH_INCLUDES_FORWARD_PAGES_ = !goog.userAgent.OPERA && (!goog.userAgent.WEBKIT || bot.userAgent.isEngineVersion("533"));
bot.window.back = function(a) {
  var b = bot.window.HISTORY_LENGTH_INCLUDES_NEW_PAGE_ ? bot.getWindow().history.length - 1 : bot.getWindow().history.length, a = bot.window.checkNumPages_(b, a);
  bot.getWindow().history.go(-a)
};
bot.window.forward = function(a) {
  var b = bot.window.HISTORY_LENGTH_INCLUDES_FORWARD_PAGES_ ? bot.getWindow().history.length - 1 : null, a = bot.window.checkNumPages_(b, a);
  bot.getWindow().history.go(a)
};
bot.window.checkNumPages_ = function(a, b) {
  var c = goog.isDef(b) ? b : 1;
  if(0 >= c) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "number of pages must be positive");
  }
  if(null !== a && c > a) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "number of pages must be less than the length of the browser history");
  }
  return c
};
bot.window.getInteractableSize = function(a) {
  var b = (a || bot.getWindow()).document, a = b.documentElement, c = b.body;
  if(!c) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "No BODY element present");
  }
  b = [a.clientHeight, a.scrollHeight, a.offsetHeight, c.scrollHeight, c.offsetHeight];
  a = Math.max.apply(null, [a.clientWidth, a.scrollWidth, a.offsetWidth, c.scrollWidth, c.offsetWidth]);
  b = Math.max.apply(null, b);
  return new goog.math.Size(a, b)
};
bot.window.getSize = function(a) {
  a = a || bot.getWindow();
  return new goog.math.Size(a.outerWidth, a.outerHeight)
};
bot.window.setSize = function(a, b) {
  (b || bot.getWindow()).resizeTo(a.width, a.height)
};
bot.window.getPosition = function(a) {
  var b = a || bot.getWindow();
  goog.userAgent.IE ? (a = b.screenLeft, b = b.screenTop) : (a = b.screenX, b = b.screenY);
  return new goog.math.Coordinate(a, b)
};
bot.window.setPosition = function(a, b) {
  (b || bot.getWindow()).moveTo(a.x, a.y)
};
goog.dom.TagWalkType = {START_TAG:1, OTHER:0, END_TAG:-1};
goog.dom.TagIterator = function(a, b, c, d, e) {
  this.reversed = !!b;
  a && this.setPosition(a, d);
  this.depth = void 0 != e ? e : this.tagType || 0;
  this.reversed && (this.depth *= -1);
  this.constrained = !c
};
goog.inherits(goog.dom.TagIterator, goog.iter.Iterator);
goog.dom.TagIterator.prototype.node = null;
goog.dom.TagIterator.prototype.tagType = goog.dom.TagWalkType.OTHER;
goog.dom.TagIterator.prototype.started_ = !1;
goog.dom.TagIterator.prototype.setPosition = function(a, b, c) {
  if(this.node = a) {
    this.tagType = goog.isNumber(b) ? b : this.node.nodeType != goog.dom.NodeType.ELEMENT ? goog.dom.TagWalkType.OTHER : this.reversed ? goog.dom.TagWalkType.END_TAG : goog.dom.TagWalkType.START_TAG
  }
  goog.isNumber(c) && (this.depth = c)
};
goog.dom.TagIterator.prototype.copyFrom = function(a) {
  this.node = a.node;
  this.tagType = a.tagType;
  this.depth = a.depth;
  this.reversed = a.reversed;
  this.constrained = a.constrained
};
goog.dom.TagIterator.prototype.clone = function() {
  return new goog.dom.TagIterator(this.node, this.reversed, !this.constrained, this.tagType, this.depth)
};
goog.dom.TagIterator.prototype.skipTag = function() {
  var a = this.reversed ? goog.dom.TagWalkType.END_TAG : goog.dom.TagWalkType.START_TAG;
  this.tagType == a && (this.tagType = -1 * a, this.depth += this.tagType * (this.reversed ? -1 : 1))
};
goog.dom.TagIterator.prototype.restartTag = function() {
  var a = this.reversed ? goog.dom.TagWalkType.START_TAG : goog.dom.TagWalkType.END_TAG;
  this.tagType == a && (this.tagType = -1 * a, this.depth += this.tagType * (this.reversed ? -1 : 1))
};
goog.dom.TagIterator.prototype.next = function() {
  var a;
  if(this.started_) {
    if(!this.node || this.constrained && 0 == this.depth) {
      throw goog.iter.StopIteration;
    }
    a = this.node;
    var b = this.reversed ? goog.dom.TagWalkType.END_TAG : goog.dom.TagWalkType.START_TAG;
    if(this.tagType == b) {
      var c = this.reversed ? a.lastChild : a.firstChild;
      c ? this.setPosition(c) : this.setPosition(a, -1 * b)
    }else {
      (c = this.reversed ? a.previousSibling : a.nextSibling) ? this.setPosition(c) : this.setPosition(a.parentNode, -1 * b)
    }
    this.depth += this.tagType * (this.reversed ? -1 : 1)
  }else {
    this.started_ = !0
  }
  a = this.node;
  if(!this.node) {
    throw goog.iter.StopIteration;
  }
  return a
};
goog.dom.TagIterator.prototype.isStarted = function() {
  return this.started_
};
goog.dom.TagIterator.prototype.isStartTag = function() {
  return this.tagType == goog.dom.TagWalkType.START_TAG
};
goog.dom.TagIterator.prototype.isEndTag = function() {
  return this.tagType == goog.dom.TagWalkType.END_TAG
};
goog.dom.TagIterator.prototype.isNonElement = function() {
  return this.tagType == goog.dom.TagWalkType.OTHER
};
goog.dom.TagIterator.prototype.equals = function(a) {
  return a.node == this.node && (!this.node || a.tagType == this.tagType)
};
goog.dom.TagIterator.prototype.splice = function(a) {
  var b = this.node;
  this.restartTag();
  this.reversed = !this.reversed;
  goog.dom.TagIterator.prototype.next.call(this);
  this.reversed = !this.reversed;
  for(var c = goog.isArrayLike(arguments[0]) ? arguments[0] : arguments, d = c.length - 1;0 <= d;d--) {
    goog.dom.insertSiblingAfter(c[d], b)
  }
  goog.dom.removeNode(b)
};
goog.dom.NodeIterator = function(a, b, c, d) {
  goog.dom.TagIterator.call(this, a, b, c, null, d)
};
goog.inherits(goog.dom.NodeIterator, goog.dom.TagIterator);
goog.dom.NodeIterator.prototype.next = function() {
  do {
    goog.dom.NodeIterator.superClass_.next.call(this)
  }while(this.isEndTag());
  return this.node
};
goog.math.Box = function(a, b, c, d) {
  this.top = a;
  this.right = b;
  this.bottom = c;
  this.left = d
};
goog.math.Box.boundingBox = function(a) {
  for(var b = new goog.math.Box(arguments[0].y, arguments[0].x, arguments[0].y, arguments[0].x), c = 1;c < arguments.length;c++) {
    var d = arguments[c];
    b.top = Math.min(b.top, d.y);
    b.right = Math.max(b.right, d.x);
    b.bottom = Math.max(b.bottom, d.y);
    b.left = Math.min(b.left, d.x)
  }
  return b
};
goog.math.Box.prototype.clone = function() {
  return new goog.math.Box(this.top, this.right, this.bottom, this.left)
};
goog.DEBUG && (goog.math.Box.prototype.toString = function() {
  return"(" + this.top + "t, " + this.right + "r, " + this.bottom + "b, " + this.left + "l)"
});
goog.math.Box.prototype.contains = function(a) {
  return goog.math.Box.contains(this, a)
};
goog.math.Box.prototype.expand = function(a, b, c, d) {
  if(goog.isObject(a)) {
    this.top = this.top - a.top;
    this.right = this.right + a.right;
    this.bottom = this.bottom + a.bottom;
    this.left = this.left - a.left
  }else {
    this.top = this.top - a;
    this.right = this.right + b;
    this.bottom = this.bottom + c;
    this.left = this.left - d
  }
  return this
};
goog.math.Box.prototype.expandToInclude = function(a) {
  this.left = Math.min(this.left, a.left);
  this.top = Math.min(this.top, a.top);
  this.right = Math.max(this.right, a.right);
  this.bottom = Math.max(this.bottom, a.bottom)
};
goog.math.Box.equals = function(a, b) {
  return a == b ? true : !a || !b ? false : a.top == b.top && a.right == b.right && a.bottom == b.bottom && a.left == b.left
};
goog.math.Box.contains = function(a, b) {
  return!a || !b ? false : b instanceof goog.math.Box ? b.left >= a.left && b.right <= a.right && b.top >= a.top && b.bottom <= a.bottom : b.x >= a.left && b.x <= a.right && b.y >= a.top && b.y <= a.bottom
};
goog.math.Box.distance = function(a, b) {
  return b.x >= a.left && b.x <= a.right ? b.y >= a.top && b.y <= a.bottom ? 0 : b.y < a.top ? a.top - b.y : b.y - a.bottom : b.y >= a.top && b.y <= a.bottom ? b.x < a.left ? a.left - b.x : b.x - a.right : goog.math.Coordinate.distance(b, new goog.math.Coordinate(b.x < a.left ? a.left : a.right, b.y < a.top ? a.top : a.bottom))
};
goog.math.Box.intersects = function(a, b) {
  return a.left <= b.right && b.left <= a.right && a.top <= b.bottom && b.top <= a.bottom
};
goog.math.Box.intersectsWithPadding = function(a, b, c) {
  return a.left <= b.right + c && b.left <= a.right + c && a.top <= b.bottom + c && b.top <= a.bottom + c
};
goog.math.Rect = function(a, b, c, d) {
  this.left = a;
  this.top = b;
  this.width = c;
  this.height = d
};
goog.math.Rect.prototype.clone = function() {
  return new goog.math.Rect(this.left, this.top, this.width, this.height)
};
goog.math.Rect.prototype.toBox = function() {
  return new goog.math.Box(this.top, this.left + this.width, this.top + this.height, this.left)
};
goog.math.Rect.createFromBox = function(a) {
  return new goog.math.Rect(a.left, a.top, a.right - a.left, a.bottom - a.top)
};
goog.DEBUG && (goog.math.Rect.prototype.toString = function() {
  return"(" + this.left + ", " + this.top + " - " + this.width + "w x " + this.height + "h)"
});
goog.math.Rect.equals = function(a, b) {
  return a == b ? true : !a || !b ? false : a.left == b.left && a.width == b.width && a.top == b.top && a.height == b.height
};
goog.math.Rect.prototype.intersection = function(a) {
  var b = Math.max(this.left, a.left), c = Math.min(this.left + this.width, a.left + a.width);
  if(b <= c) {
    var d = Math.max(this.top, a.top), a = Math.min(this.top + this.height, a.top + a.height);
    if(d <= a) {
      this.left = b;
      this.top = d;
      this.width = c - b;
      this.height = a - d;
      return true
    }
  }
  return false
};
goog.math.Rect.intersection = function(a, b) {
  var c = Math.max(a.left, b.left), d = Math.min(a.left + a.width, b.left + b.width);
  if(c <= d) {
    var e = Math.max(a.top, b.top), f = Math.min(a.top + a.height, b.top + b.height);
    if(e <= f) {
      return new goog.math.Rect(c, e, d - c, f - e)
    }
  }
  return null
};
goog.math.Rect.intersects = function(a, b) {
  return a.left <= b.left + b.width && b.left <= a.left + a.width && a.top <= b.top + b.height && b.top <= a.top + a.height
};
goog.math.Rect.prototype.intersects = function(a) {
  return goog.math.Rect.intersects(this, a)
};
goog.math.Rect.difference = function(a, b) {
  var c = goog.math.Rect.intersection(a, b);
  if(!c || !c.height || !c.width) {
    return[a.clone()]
  }
  var c = [], d = a.top, e = a.height, f = a.left + a.width, g = a.top + a.height, h = b.left + b.width, j = b.top + b.height;
  if(b.top > a.top) {
    c.push(new goog.math.Rect(a.left, a.top, a.width, b.top - a.top));
    d = b.top;
    e = e - (b.top - a.top)
  }
  if(j < g) {
    c.push(new goog.math.Rect(a.left, j, a.width, g - j));
    e = j - d
  }
  b.left > a.left && c.push(new goog.math.Rect(a.left, d, b.left - a.left, e));
  h < f && c.push(new goog.math.Rect(h, d, f - h, e));
  return c
};
goog.math.Rect.prototype.difference = function(a) {
  return goog.math.Rect.difference(this, a)
};
goog.math.Rect.prototype.boundingRect = function(a) {
  var b = Math.max(this.left + this.width, a.left + a.width), c = Math.max(this.top + this.height, a.top + a.height);
  this.left = Math.min(this.left, a.left);
  this.top = Math.min(this.top, a.top);
  this.width = b - this.left;
  this.height = c - this.top
};
goog.math.Rect.boundingRect = function(a, b) {
  if(!a || !b) {
    return null
  }
  var c = a.clone();
  c.boundingRect(b);
  return c
};
goog.math.Rect.prototype.contains = function(a) {
  return a instanceof goog.math.Rect ? this.left <= a.left && this.left + this.width >= a.left + a.width && this.top <= a.top && this.top + this.height >= a.top + a.height : a.x >= this.left && a.x <= this.left + this.width && a.y >= this.top && a.y <= this.top + this.height
};
goog.math.Rect.prototype.getSize = function() {
  return new goog.math.Size(this.width, this.height)
};
goog.style = {};
goog.style.setStyle = function(a, b, c) {
  goog.isString(b) ? goog.style.setStyle_(a, c, b) : goog.object.forEach(b, goog.partial(goog.style.setStyle_, a))
};
goog.style.setStyle_ = function(a, b, c) {
  a.style[goog.string.toCamelCase(c)] = b
};
goog.style.getStyle = function(a, b) {
  return a.style[goog.string.toCamelCase(b)] || ""
};
goog.style.getComputedStyle = function(a, b) {
  var c = goog.dom.getOwnerDocument(a);
  return c.defaultView && c.defaultView.getComputedStyle && (c = c.defaultView.getComputedStyle(a, null)) ? c[b] || c.getPropertyValue(b) : ""
};
goog.style.getCascadedStyle = function(a, b) {
  return a.currentStyle ? a.currentStyle[b] : null
};
goog.style.getStyle_ = function(a, b) {
  return goog.style.getComputedStyle(a, b) || goog.style.getCascadedStyle(a, b) || a.style && a.style[b]
};
goog.style.getComputedPosition = function(a) {
  return goog.style.getStyle_(a, "position")
};
goog.style.getBackgroundColor = function(a) {
  return goog.style.getStyle_(a, "backgroundColor")
};
goog.style.getComputedOverflowX = function(a) {
  return goog.style.getStyle_(a, "overflowX")
};
goog.style.getComputedOverflowY = function(a) {
  return goog.style.getStyle_(a, "overflowY")
};
goog.style.getComputedZIndex = function(a) {
  return goog.style.getStyle_(a, "zIndex")
};
goog.style.getComputedTextAlign = function(a) {
  return goog.style.getStyle_(a, "textAlign")
};
goog.style.getComputedCursor = function(a) {
  return goog.style.getStyle_(a, "cursor")
};
goog.style.setPosition = function(a, b, c) {
  var d, e = goog.userAgent.GECKO && (goog.userAgent.MAC || goog.userAgent.X11) && goog.userAgent.isVersion("1.9");
  b instanceof goog.math.Coordinate ? (d = b.x, b = b.y) : (d = b, b = c);
  a.style.left = goog.style.getPixelStyleValue_(d, e);
  a.style.top = goog.style.getPixelStyleValue_(b, e)
};
goog.style.getPosition = function(a) {
  return new goog.math.Coordinate(a.offsetLeft, a.offsetTop)
};
goog.style.getClientViewportElement = function(a) {
  a = a ? a.nodeType == goog.dom.NodeType.DOCUMENT ? a : goog.dom.getOwnerDocument(a) : goog.dom.getDocument();
  return goog.userAgent.IE && !goog.userAgent.isDocumentMode(9) && !goog.dom.getDomHelper(a).isCss1CompatMode() ? a.body : a.documentElement
};
goog.style.getBoundingClientRect_ = function(a) {
  var b = a.getBoundingClientRect();
  goog.userAgent.IE && (a = a.ownerDocument, b.left -= a.documentElement.clientLeft + a.body.clientLeft, b.top -= a.documentElement.clientTop + a.body.clientTop);
  return b
};
goog.style.getOffsetParent = function(a) {
  if(goog.userAgent.IE && !goog.userAgent.isDocumentMode(8)) {
    return a.offsetParent
  }
  for(var b = goog.dom.getOwnerDocument(a), c = goog.style.getStyle_(a, "position"), d = "fixed" == c || "absolute" == c, a = a.parentNode;a && a != b;a = a.parentNode) {
    if(c = goog.style.getStyle_(a, "position"), d = d && "static" == c && a != b.documentElement && a != b.body, !d && (a.scrollWidth > a.clientWidth || a.scrollHeight > a.clientHeight || "fixed" == c || "absolute" == c || "relative" == c)) {
      return a
    }
  }
  return null
};
goog.style.getVisibleRectForElement = function(a) {
  for(var b = new goog.math.Box(0, Infinity, Infinity, 0), c = goog.dom.getDomHelper(a), d = c.getDocument().body, e = c.getDocument().documentElement, f = c.getDocumentScrollElement();a = goog.style.getOffsetParent(a);) {
    if((!goog.userAgent.IE || 0 != a.clientWidth) && (!goog.userAgent.WEBKIT || 0 != a.clientHeight || a != d) && a != d && a != e && "visible" != goog.style.getStyle_(a, "overflow")) {
      var g = goog.style.getPageOffset(a), h = goog.style.getClientLeftTop(a);
      g.x += h.x;
      g.y += h.y;
      b.top = Math.max(b.top, g.y);
      b.right = Math.min(b.right, g.x + a.clientWidth);
      b.bottom = Math.min(b.bottom, g.y + a.clientHeight);
      b.left = Math.max(b.left, g.x)
    }
  }
  d = f.scrollLeft;
  f = f.scrollTop;
  b.left = Math.max(b.left, d);
  b.top = Math.max(b.top, f);
  c = c.getViewportSize();
  b.right = Math.min(b.right, d + c.width);
  b.bottom = Math.min(b.bottom, f + c.height);
  return 0 <= b.top && 0 <= b.left && b.bottom > b.top && b.right > b.left ? b : null
};
goog.style.scrollIntoContainerView = function(a, b, c) {
  var d = goog.style.getPageOffset(a), e = goog.style.getPageOffset(b), f = goog.style.getBorderBox(b), g = d.x - e.x - f.left, d = d.y - e.y - f.top, e = b.clientWidth - a.offsetWidth, a = b.clientHeight - a.offsetHeight;
  c ? (b.scrollLeft += g - e / 2, b.scrollTop += d - a / 2) : (b.scrollLeft += Math.min(g, Math.max(g - e, 0)), b.scrollTop += Math.min(d, Math.max(d - a, 0)))
};
goog.style.getClientLeftTop = function(a) {
  if(goog.userAgent.GECKO && !goog.userAgent.isVersion("1.9")) {
    var b = parseFloat(goog.style.getComputedStyle(a, "borderLeftWidth"));
    if(goog.style.isRightToLeft(a)) {
      var c = a.offsetWidth - a.clientWidth - b - parseFloat(goog.style.getComputedStyle(a, "borderRightWidth")), b = b + c
    }
    return new goog.math.Coordinate(b, parseFloat(goog.style.getComputedStyle(a, "borderTopWidth")))
  }
  return new goog.math.Coordinate(a.clientLeft, a.clientTop)
};
goog.style.getPageOffset = function(a) {
  var b, c = goog.dom.getOwnerDocument(a), d = goog.style.getStyle_(a, "position"), e = goog.userAgent.GECKO && c.getBoxObjectFor && !a.getBoundingClientRect && "absolute" == d && (b = c.getBoxObjectFor(a)) && (0 > b.screenX || 0 > b.screenY), f = new goog.math.Coordinate(0, 0), g = goog.style.getClientViewportElement(c);
  if(a == g) {
    return f
  }
  if(a.getBoundingClientRect) {
    b = goog.style.getBoundingClientRect_(a), a = goog.dom.getDomHelper(c).getDocumentScroll(), f.x = b.left + a.x, f.y = b.top + a.y
  }else {
    if(c.getBoxObjectFor && !e) {
      b = c.getBoxObjectFor(a), a = c.getBoxObjectFor(g), f.x = b.screenX - a.screenX, f.y = b.screenY - a.screenY
    }else {
      b = a;
      do {
        f.x += b.offsetLeft;
        f.y += b.offsetTop;
        b != a && (f.x += b.clientLeft || 0, f.y += b.clientTop || 0);
        if(goog.userAgent.WEBKIT && "fixed" == goog.style.getComputedPosition(b)) {
          f.x += c.body.scrollLeft;
          f.y += c.body.scrollTop;
          break
        }
        b = b.offsetParent
      }while(b && b != a);
      if(goog.userAgent.OPERA || goog.userAgent.WEBKIT && "absolute" == d) {
        f.y -= c.body.offsetTop
      }
      for(b = a;(b = goog.style.getOffsetParent(b)) && b != c.body && b != g;) {
        if(f.x -= b.scrollLeft, !goog.userAgent.OPERA || "TR" != b.tagName) {
          f.y -= b.scrollTop
        }
      }
    }
  }
  return f
};
goog.style.getPageOffsetLeft = function(a) {
  return goog.style.getPageOffset(a).x
};
goog.style.getPageOffsetTop = function(a) {
  return goog.style.getPageOffset(a).y
};
goog.style.getFramedPageOffset = function(a, b) {
  var c = new goog.math.Coordinate(0, 0), d = goog.dom.getWindow(goog.dom.getOwnerDocument(a)), e = a;
  do {
    var f = d == b ? goog.style.getPageOffset(e) : goog.style.getClientPosition(e);
    c.x += f.x;
    c.y += f.y
  }while(d && d != b && (e = d.frameElement) && (d = d.parent));
  return c
};
goog.style.translateRectForAnotherFrame = function(a, b, c) {
  if(b.getDocument() != c.getDocument()) {
    var d = b.getDocument().body, c = goog.style.getFramedPageOffset(d, c.getWindow()), c = goog.math.Coordinate.difference(c, goog.style.getPageOffset(d));
    goog.userAgent.IE && !b.isCss1CompatMode() && (c = goog.math.Coordinate.difference(c, b.getDocumentScroll()));
    a.left += c.x;
    a.top += c.y
  }
};
goog.style.getRelativePosition = function(a, b) {
  var c = goog.style.getClientPosition(a), d = goog.style.getClientPosition(b);
  return new goog.math.Coordinate(c.x - d.x, c.y - d.y)
};
goog.style.getClientPosition = function(a) {
  var b = new goog.math.Coordinate;
  if(a.nodeType == goog.dom.NodeType.ELEMENT) {
    if(a.getBoundingClientRect) {
      a = goog.style.getBoundingClientRect_(a), b.x = a.left, b.y = a.top
    }else {
      var c = goog.dom.getDomHelper(a).getDocumentScroll(), a = goog.style.getPageOffset(a);
      b.x = a.x - c.x;
      b.y = a.y - c.y
    }
  }else {
    var c = goog.isFunction(a.getBrowserEvent), d = a;
    a.targetTouches ? d = a.targetTouches[0] : c && a.getBrowserEvent().targetTouches && (d = a.getBrowserEvent().targetTouches[0]);
    b.x = d.clientX;
    b.y = d.clientY
  }
  return b
};
goog.style.setPageOffset = function(a, b, c) {
  var d = goog.style.getPageOffset(a);
  b instanceof goog.math.Coordinate && (c = b.y, b = b.x);
  goog.style.setPosition(a, a.offsetLeft + (b - d.x), a.offsetTop + (c - d.y))
};
goog.style.setSize = function(a, b, c) {
  if(b instanceof goog.math.Size) {
    c = b.height, b = b.width
  }else {
    if(void 0 == c) {
      throw Error("missing height argument");
    }
  }
  goog.style.setWidth(a, b);
  goog.style.setHeight(a, c)
};
goog.style.getPixelStyleValue_ = function(a, b) {
  "number" == typeof a && (a = (b ? Math.round(a) : a) + "px");
  return a
};
goog.style.setHeight = function(a, b) {
  a.style.height = goog.style.getPixelStyleValue_(b, !0)
};
goog.style.setWidth = function(a, b) {
  a.style.width = goog.style.getPixelStyleValue_(b, !0)
};
goog.style.getSize = function(a) {
  if("none" != goog.style.getStyle_(a, "display")) {
    return goog.style.getSizeWithDisplay_(a)
  }
  var b = a.style, c = b.display, d = b.visibility, e = b.position;
  b.visibility = "hidden";
  b.position = "absolute";
  b.display = "inline";
  a = goog.style.getSizeWithDisplay_(a);
  b.display = c;
  b.position = e;
  b.visibility = d;
  return a
};
goog.style.getSizeWithDisplay_ = function(a) {
  var b = a.offsetWidth, c = a.offsetHeight, d = goog.userAgent.WEBKIT && !b && !c;
  return(!goog.isDef(b) || d) && a.getBoundingClientRect ? (a = goog.style.getBoundingClientRect_(a), new goog.math.Size(a.right - a.left, a.bottom - a.top)) : new goog.math.Size(b, c)
};
goog.style.getBounds = function(a) {
  var b = goog.style.getPageOffset(a), a = goog.style.getSize(a);
  return new goog.math.Rect(b.x, b.y, a.width, a.height)
};
goog.style.toCamelCase = function(a) {
  return goog.string.toCamelCase("" + a)
};
goog.style.toSelectorCase = function(a) {
  return goog.string.toSelectorCase(a)
};
goog.style.getOpacity = function(a) {
  var b = a.style, a = "";
  "opacity" in b ? a = b.opacity : "MozOpacity" in b ? a = b.MozOpacity : "filter" in b && (b = b.filter.match(/alpha\(opacity=([\d.]+)\)/)) && (a = "" + b[1] / 100);
  return"" == a ? a : Number(a)
};
goog.style.setOpacity = function(a, b) {
  var c = a.style;
  "opacity" in c ? c.opacity = b : "MozOpacity" in c ? c.MozOpacity = b : "filter" in c && (c.filter = "" === b ? "" : "alpha(opacity=" + 100 * b + ")")
};
goog.style.setTransparentBackgroundImage = function(a, b) {
  var c = a.style;
  goog.userAgent.IE && !goog.userAgent.isVersion("8") ? c.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + b + '", sizingMethod="crop")' : (c.backgroundImage = "url(" + b + ")", c.backgroundPosition = "top left", c.backgroundRepeat = "no-repeat")
};
goog.style.clearTransparentBackgroundImage = function(a) {
  a = a.style;
  "filter" in a ? a.filter = "" : a.backgroundImage = "none"
};
goog.style.showElement = function(a, b) {
  a.style.display = b ? "" : "none"
};
goog.style.isElementShown = function(a) {
  return"none" != a.style.display
};
goog.style.installStyles = function(a, b) {
  var c = goog.dom.getDomHelper(b), d = null;
  if(goog.userAgent.IE) {
    d = c.getDocument().createStyleSheet(), goog.style.setStyles(d, a)
  }else {
    var e = c.getElementsByTagNameAndClass("head")[0];
    e || (d = c.getElementsByTagNameAndClass("body")[0], e = c.createDom("head"), d.parentNode.insertBefore(e, d));
    d = c.createDom("style");
    goog.style.setStyles(d, a);
    c.appendChild(e, d)
  }
  return d
};
goog.style.uninstallStyles = function(a) {
  goog.dom.removeNode(a.ownerNode || a.owningElement || a)
};
goog.style.setStyles = function(a, b) {
  goog.userAgent.IE ? a.cssText = b : a[goog.userAgent.WEBKIT ? "innerText" : "innerHTML"] = b
};
goog.style.setPreWrap = function(a) {
  a = a.style;
  goog.userAgent.IE && !goog.userAgent.isVersion("8") ? (a.whiteSpace = "pre", a.wordWrap = "break-word") : a.whiteSpace = goog.userAgent.GECKO ? "-moz-pre-wrap" : "pre-wrap"
};
goog.style.setInlineBlock = function(a) {
  a = a.style;
  a.position = "relative";
  goog.userAgent.IE && !goog.userAgent.isVersion("8") ? (a.zoom = "1", a.display = "inline") : a.display = goog.userAgent.GECKO ? goog.userAgent.isVersion("1.9a") ? "inline-block" : "-moz-inline-box" : "inline-block"
};
goog.style.isRightToLeft = function(a) {
  return"rtl" == goog.style.getStyle_(a, "direction")
};
goog.style.unselectableStyle_ = goog.userAgent.GECKO ? "MozUserSelect" : goog.userAgent.WEBKIT ? "WebkitUserSelect" : null;
goog.style.isUnselectable = function(a) {
  return goog.style.unselectableStyle_ ? "none" == a.style[goog.style.unselectableStyle_].toLowerCase() : goog.userAgent.IE || goog.userAgent.OPERA ? "on" == a.getAttribute("unselectable") : !1
};
goog.style.setUnselectable = function(a, b, c) {
  var c = !c ? a.getElementsByTagName("*") : null, d = goog.style.unselectableStyle_;
  if(d) {
    if(b = b ? "none" : "", a.style[d] = b, c) {
      for(var a = 0, e;e = c[a];a++) {
        e.style[d] = b
      }
    }
  }else {
    if(goog.userAgent.IE || goog.userAgent.OPERA) {
      if(b = b ? "on" : "", a.setAttribute("unselectable", b), c) {
        for(a = 0;e = c[a];a++) {
          e.setAttribute("unselectable", b)
        }
      }
    }
  }
};
goog.style.getBorderBoxSize = function(a) {
  return new goog.math.Size(a.offsetWidth, a.offsetHeight)
};
goog.style.setBorderBoxSize = function(a, b) {
  var c = goog.dom.getOwnerDocument(a), d = goog.dom.getDomHelper(c).isCss1CompatMode();
  if(goog.userAgent.IE && (!d || !goog.userAgent.isVersion("8"))) {
    if(c = a.style, d) {
      var d = goog.style.getPaddingBox(a), e = goog.style.getBorderBox(a);
      c.pixelWidth = b.width - e.left - d.left - d.right - e.right;
      c.pixelHeight = b.height - e.top - d.top - d.bottom - e.bottom
    }else {
      c.pixelWidth = b.width, c.pixelHeight = b.height
    }
  }else {
    goog.style.setBoxSizingSize_(a, b, "border-box")
  }
};
goog.style.getContentBoxSize = function(a) {
  var b = goog.dom.getOwnerDocument(a), c = goog.userAgent.IE && a.currentStyle;
  if(c && goog.dom.getDomHelper(b).isCss1CompatMode() && "auto" != c.width && "auto" != c.height && !c.boxSizing) {
    return b = goog.style.getIePixelValue_(a, c.width, "width", "pixelWidth"), a = goog.style.getIePixelValue_(a, c.height, "height", "pixelHeight"), new goog.math.Size(b, a)
  }
  c = goog.style.getBorderBoxSize(a);
  b = goog.style.getPaddingBox(a);
  a = goog.style.getBorderBox(a);
  return new goog.math.Size(c.width - a.left - b.left - b.right - a.right, c.height - a.top - b.top - b.bottom - a.bottom)
};
goog.style.setContentBoxSize = function(a, b) {
  var c = goog.dom.getOwnerDocument(a), d = goog.dom.getDomHelper(c).isCss1CompatMode();
  if(goog.userAgent.IE && (!d || !goog.userAgent.isVersion("8"))) {
    if(c = a.style, d) {
      c.pixelWidth = b.width, c.pixelHeight = b.height
    }else {
      var d = goog.style.getPaddingBox(a), e = goog.style.getBorderBox(a);
      c.pixelWidth = b.width + e.left + d.left + d.right + e.right;
      c.pixelHeight = b.height + e.top + d.top + d.bottom + e.bottom
    }
  }else {
    goog.style.setBoxSizingSize_(a, b, "content-box")
  }
};
goog.style.setBoxSizingSize_ = function(a, b, c) {
  a = a.style;
  goog.userAgent.GECKO ? a.MozBoxSizing = c : goog.userAgent.WEBKIT ? a.WebkitBoxSizing = c : a.boxSizing = c;
  a.width = b.width + "px";
  a.height = b.height + "px"
};
goog.style.getIePixelValue_ = function(a, b, c, d) {
  if(/^\d+px?$/.test(b)) {
    return parseInt(b, 10)
  }
  var e = a.style[c], f = a.runtimeStyle[c];
  a.runtimeStyle[c] = a.currentStyle[c];
  a.style[c] = b;
  b = a.style[d];
  a.style[c] = e;
  a.runtimeStyle[c] = f;
  return b
};
goog.style.getIePixelDistance_ = function(a, b) {
  return goog.style.getIePixelValue_(a, goog.style.getCascadedStyle(a, b), "left", "pixelLeft")
};
goog.style.getBox_ = function(a, b) {
  if(goog.userAgent.IE) {
    var c = goog.style.getIePixelDistance_(a, b + "Left"), d = goog.style.getIePixelDistance_(a, b + "Right"), e = goog.style.getIePixelDistance_(a, b + "Top"), f = goog.style.getIePixelDistance_(a, b + "Bottom");
    return new goog.math.Box(e, d, f, c)
  }
  c = goog.style.getComputedStyle(a, b + "Left");
  d = goog.style.getComputedStyle(a, b + "Right");
  e = goog.style.getComputedStyle(a, b + "Top");
  f = goog.style.getComputedStyle(a, b + "Bottom");
  return new goog.math.Box(parseFloat(e), parseFloat(d), parseFloat(f), parseFloat(c))
};
goog.style.getPaddingBox = function(a) {
  return goog.style.getBox_(a, "padding")
};
goog.style.getMarginBox = function(a) {
  return goog.style.getBox_(a, "margin")
};
goog.style.ieBorderWidthKeywords_ = {thin:2, medium:4, thick:6};
goog.style.getIePixelBorder_ = function(a, b) {
  if("none" == goog.style.getCascadedStyle(a, b + "Style")) {
    return 0
  }
  var c = goog.style.getCascadedStyle(a, b + "Width");
  return c in goog.style.ieBorderWidthKeywords_ ? goog.style.ieBorderWidthKeywords_[c] : goog.style.getIePixelValue_(a, c, "left", "pixelLeft")
};
goog.style.getBorderBox = function(a) {
  if(goog.userAgent.IE) {
    var b = goog.style.getIePixelBorder_(a, "borderLeft"), c = goog.style.getIePixelBorder_(a, "borderRight"), d = goog.style.getIePixelBorder_(a, "borderTop"), a = goog.style.getIePixelBorder_(a, "borderBottom");
    return new goog.math.Box(d, c, a, b)
  }
  b = goog.style.getComputedStyle(a, "borderLeftWidth");
  c = goog.style.getComputedStyle(a, "borderRightWidth");
  d = goog.style.getComputedStyle(a, "borderTopWidth");
  a = goog.style.getComputedStyle(a, "borderBottomWidth");
  return new goog.math.Box(parseFloat(d), parseFloat(c), parseFloat(a), parseFloat(b))
};
goog.style.getFontFamily = function(a) {
  var b = goog.dom.getOwnerDocument(a), c = "";
  if(b.body.createTextRange) {
    b = b.body.createTextRange();
    b.moveToElementText(a);
    try {
      c = b.queryCommandValue("FontName")
    }catch(d) {
      c = ""
    }
  }
  c || (c = goog.style.getStyle_(a, "fontFamily"));
  a = c.split(",");
  1 < a.length && (c = a[0]);
  return goog.string.stripQuotes(c, "\"'")
};
goog.style.lengthUnitRegex_ = /[^\d]+$/;
goog.style.getLengthUnits = function(a) {
  return(a = a.match(goog.style.lengthUnitRegex_)) && a[0] || null
};
goog.style.ABSOLUTE_CSS_LENGTH_UNITS_ = {cm:1, "in":1, mm:1, pc:1, pt:1};
goog.style.CONVERTIBLE_RELATIVE_CSS_UNITS_ = {em:1, ex:1};
goog.style.getFontSize = function(a) {
  var b = goog.style.getStyle_(a, "fontSize"), c = goog.style.getLengthUnits(b);
  if(b && "px" == c) {
    return parseInt(b, 10)
  }
  if(goog.userAgent.IE) {
    if(c in goog.style.ABSOLUTE_CSS_LENGTH_UNITS_) {
      return goog.style.getIePixelValue_(a, b, "left", "pixelLeft")
    }
    if(a.parentNode && a.parentNode.nodeType == goog.dom.NodeType.ELEMENT && c in goog.style.CONVERTIBLE_RELATIVE_CSS_UNITS_) {
      return a = a.parentNode, c = goog.style.getStyle_(a, "fontSize"), goog.style.getIePixelValue_(a, b == c ? "1em" : b, "left", "pixelLeft")
    }
  }
  c = goog.dom.createDom("span", {style:"visibility:hidden;position:absolute;line-height:0;padding:0;margin:0;border:0;height:1em;"});
  goog.dom.appendChild(a, c);
  b = c.offsetHeight;
  goog.dom.removeNode(c);
  return b
};
goog.style.parseStyleAttribute = function(a) {
  var b = {};
  goog.array.forEach(a.split(/\s*;\s*/), function(a) {
    a = a.split(/\s*:\s*/);
    2 == a.length && (b[goog.string.toCamelCase(a[0].toLowerCase())] = a[1])
  });
  return b
};
goog.style.toStyleAttribute = function(a) {
  var b = [];
  goog.object.forEach(a, function(a, d) {
    b.push(goog.string.toSelectorCase(d), ":", a, ";")
  });
  return b.join("")
};
goog.style.setFloat = function(a, b) {
  a.style[goog.userAgent.IE ? "styleFloat" : "cssFloat"] = b
};
goog.style.getFloat = function(a) {
  return a.style[goog.userAgent.IE ? "styleFloat" : "cssFloat"] || ""
};
goog.style.getScrollbarWidth = function(a) {
  var b = goog.dom.createElement("div");
  a && (b.className = a);
  b.style.cssText = "visiblity:hidden;overflow:auto;position:absolute;top:0;width:100px;height:100px";
  a = goog.dom.createElement("div");
  goog.style.setSize(a, "200px", "200px");
  b.appendChild(a);
  goog.dom.appendChild(goog.dom.getDocument().body, b);
  a = b.offsetWidth - b.clientWidth;
  goog.dom.removeNode(b);
  return a
};
bot.dom = {};
bot.dom.getActiveElement = function(a) {
  return goog.dom.getOwnerDocument(a).activeElement
};
bot.dom.isElement = function(a, b) {
  return!!a && a.nodeType == goog.dom.NodeType.ELEMENT && (!b || a.tagName.toUpperCase() == b)
};
bot.dom.isInteractable = function(a) {
  return bot.dom.isShown(a, !0) && bot.dom.isEnabled(a) && (goog.userAgent.IE || goog.userAgent.OPERA || bot.userAgent.FIREFOX_EXTENSION && bot.userAgent.isProductVersion(3.6) || "none" != bot.dom.getEffectiveStyle(a, "pointer-events"))
};
bot.dom.isSelectable = function(a) {
  return bot.dom.isElement(a, goog.dom.TagName.OPTION) ? !0 : bot.dom.isElement(a, goog.dom.TagName.INPUT) ? (a = a.type.toLowerCase(), "checkbox" == a || "radio" == a) : !1
};
bot.dom.isSelected = function(a) {
  if(!bot.dom.isSelectable(a)) {
    throw new bot.Error(bot.ErrorCode.ELEMENT_NOT_SELECTABLE, "Element is not selectable");
  }
  var b = "selected", c = a.type && a.type.toLowerCase();
  if("checkbox" == c || "radio" == c) {
    b = "checked"
  }
  return!!bot.dom.getProperty(a, b)
};
bot.dom.FOCUSABLE_FORM_FIELDS_ = [goog.dom.TagName.A, goog.dom.TagName.AREA, goog.dom.TagName.BUTTON, goog.dom.TagName.INPUT, goog.dom.TagName.LABEL, goog.dom.TagName.SELECT, goog.dom.TagName.TEXTAREA];
bot.dom.isFocusable = function(a) {
  return goog.array.some(bot.dom.FOCUSABLE_FORM_FIELDS_, function(b) {
    return a.tagName.toUpperCase() == b
  }) || null != bot.dom.getAttribute(a, "tabindex") && 0 <= Number(bot.dom.getProperty(a, "tabIndex"))
};
bot.dom.PROPERTY_ALIASES_ = {"class":"className", readonly:"readOnly"};
bot.dom.BOOLEAN_PROPERTIES_ = ["checked", "disabled", "draggable", "hidden"];
bot.dom.getProperty = function(a, b) {
  var c = bot.dom.PROPERTY_ALIASES_[b] || b, d = a[c];
  if(!goog.isDef(d) && goog.array.contains(bot.dom.BOOLEAN_PROPERTIES_, c)) {
    return!1
  }
  "value" == b && bot.dom.isElement(a, goog.dom.TagName.OPTION) && !bot.dom.hasAttribute(a, b) && (d = goog.dom.getRawTextContent(a));
  return d
};
bot.dom.BOOLEAN_ATTRIBUTES_ = "async,autofocus,autoplay,checked,compact,complete,controls,declare,defaultchecked,defaultselected,defer,disabled,draggable,ended,formnovalidate,hidden,indeterminate,iscontenteditable,ismap,itemscope,loop,multiple,muted,nohref,noresize,noshade,novalidate,nowrap,open,paused,pubdate,readonly,required,reversed,scoped,seamless,seeking,selected,spellcheck,truespeed,willvalidate".split(",");
bot.dom.SPLIT_STYLE_ATTRIBUTE_ON_SEMICOLONS_REGEXP_ = /[;]+(?=(?:(?:[^"]*"){2})*[^"]*$)(?=(?:(?:[^']*'){2})*[^']*$)(?=(?:[^()]*\([^()]*\))*[^()]*$)/;
bot.dom.isBooleanAttribute = function(a) {
  return goog.array.contains(bot.dom.BOOLEAN_ATTRIBUTES_, a)
};
bot.dom.standardizeStyleAttribute_ = function(a) {
  var a = a.split(bot.dom.SPLIT_STYLE_ATTRIBUTE_ON_SEMICOLONS_REGEXP_), b = [];
  goog.array.forEach(a, function(a) {
    var d = a.indexOf(":");
    0 < d && (a = [a.slice(0, d), a.slice(d + 1)], 2 == a.length && b.push(a[0].toLowerCase(), ":", a[1], ";"))
  });
  b = b.join("");
  b = ";" == b.charAt(b.length - 1) ? b : b + ";";
  return goog.userAgent.OPERA ? b.replace(/\w+:;/g, "") : b
};
bot.dom.getAttribute = function(a, b) {
  if(goog.dom.NodeType.COMMENT == a.nodeType) {
    return null
  }
  b = b.toLowerCase();
  if("style" == b) {
    return bot.dom.standardizeStyleAttribute_(a.style.cssText)
  }
  var c = a.getAttributeNode(b);
  goog.userAgent.IE && !c && goog.userAgent.isVersion(8) && bot.dom.isBooleanAttribute(b) && (c = a[b]);
  return!c ? null : bot.dom.isBooleanAttribute(b) ? bot.userAgent.IE_DOC_PRE9 && !c.specified && "false" == c.value ? null : "true" : c.specified ? c.value : null
};
bot.dom.hasAttribute = function(a, b) {
  b = b.toLowerCase();
  if(a.hasAttribute) {
    return a.hasAttribute(b)
  }
  try {
    return a.attributes[b].specified
  }catch(c) {
    return!1
  }
};
bot.dom.DISABLED_ATTRIBUTE_SUPPORTED_ = [goog.dom.TagName.BUTTON, goog.dom.TagName.INPUT, goog.dom.TagName.OPTGROUP, goog.dom.TagName.OPTION, goog.dom.TagName.SELECT, goog.dom.TagName.TEXTAREA];
bot.dom.isEnabled = function(a) {
  var b = a.tagName.toUpperCase();
  return!goog.array.contains(bot.dom.DISABLED_ATTRIBUTE_SUPPORTED_, b) ? !0 : bot.dom.getProperty(a, "disabled") ? !1 : a.parentNode && a.parentNode.nodeType == goog.dom.NodeType.ELEMENT && goog.dom.TagName.OPTGROUP == b || goog.dom.TagName.OPTION == b ? bot.dom.isEnabled(a.parentNode) : !0
};
bot.dom.TEXTUAL_INPUT_TYPES_ = "text,search,tel,url,email,password,number".split(",");
bot.dom.isTextual = function(a) {
  return bot.dom.isElement(a, goog.dom.TagName.TEXTAREA) ? !0 : bot.dom.isElement(a, goog.dom.TagName.INPUT) ? (a = a.type.toLowerCase(), goog.array.contains(bot.dom.TEXTUAL_INPUT_TYPES_, a)) : bot.dom.isContentEditable(a) ? !0 : !1
};
bot.dom.isContentEditable = function(a) {
  function b(a) {
    return"inherit" == a.contentEditable ? (a = bot.dom.getParentElement(a)) ? b(a) : !1 : "true" == a.contentEditable
  }
  return!goog.isDef(a.contentEditable) ? !1 : !goog.userAgent.IE && goog.isDef(a.isContentEditable) ? a.isContentEditable : b(a)
};
bot.dom.isEditable = function(a) {
  return bot.dom.isTextual(a) && !bot.dom.getProperty(a, "readOnly")
};
bot.dom.getParentElement = function(a) {
  for(a = a.parentNode;a && a.nodeType != goog.dom.NodeType.ELEMENT && a.nodeType != goog.dom.NodeType.DOCUMENT && a.nodeType != goog.dom.NodeType.DOCUMENT_FRAGMENT;) {
    a = a.parentNode
  }
  return bot.dom.isElement(a) ? a : null
};
bot.dom.getInlineStyle = function(a, b) {
  return goog.style.getStyle(a, b)
};
bot.dom.getEffectiveStyle = function(a, b) {
  var c = goog.string.toCamelCase(b), c = goog.style.getComputedStyle(a, c) || bot.dom.getCascadedStyle_(a, c);
  return null === c ? null : bot.color.standardizeColor(b, c)
};
bot.dom.getCascadedStyle_ = function(a, b) {
  var c = a.currentStyle || a.style, d = c[b];
  !goog.isDef(d) && goog.isFunction(c.getPropertyValue) && (d = c.getPropertyValue(b));
  return"inherit" != d ? goog.isDef(d) ? d : null : (c = bot.dom.getParentElement(a)) ? bot.dom.getCascadedStyle_(c, b) : null
};
bot.dom.getElementSize = function(a) {
  if(goog.isFunction(a.getBBox)) {
    try {
      var b = a.getBBox();
      if(b) {
        return b
      }
    }catch(c) {
    }
  }
  return bot.dom.isElement(a, goog.dom.TagName.BODY) ? (b = goog.dom.getOwnerDocument(a), b = goog.dom.getWindow(b) || void 0, "hidden" == bot.dom.getEffectiveStyle(a, "overflow") ? goog.dom.getViewportSize(b) : bot.window.getInteractableSize(b)) : goog.style.getSize(a)
};
bot.dom.isShown = function(a, b) {
  function c(a) {
    if("none" == bot.dom.getEffectiveStyle(a, "display")) {
      return!1
    }
    a = bot.dom.getParentElement(a);
    return!a || c(a)
  }
  function d(a) {
    var b = bot.dom.getElementSize(a);
    return 0 < b.height && 0 < b.width ? !0 : goog.array.some(a.childNodes, function(a) {
      return a.nodeType == goog.dom.NodeType.TEXT || bot.dom.isElement(a) && d(a)
    })
  }
  function e(a) {
    var b = goog.style.getOffsetParent(a);
    if(b && "hidden" == bot.dom.getEffectiveStyle(b, "overflow")) {
      var c = bot.dom.getElementSize(b), d = goog.style.getClientPosition(b), a = goog.style.getClientPosition(a);
      return d.x + c.width < a.x || d.y + c.height < a.y ? !1 : e(b)
    }
    return!0
  }
  if(!bot.dom.isElement(a)) {
    throw Error("Argument to isShown must be of type Element");
  }
  if(bot.dom.isElement(a, goog.dom.TagName.OPTION) || bot.dom.isElement(a, goog.dom.TagName.OPTGROUP)) {
    var f = goog.dom.getAncestor(a, function(a) {
      return bot.dom.isElement(a, goog.dom.TagName.SELECT)
    });
    return!!f && bot.dom.isShown(f, !0)
  }
  if(bot.dom.isElement(a, goog.dom.TagName.MAP)) {
    if(!a.name) {
      return!1
    }
    f = goog.dom.getOwnerDocument(a);
    f = f.evaluate ? bot.locators.xpath.single('/descendant::*[@usemap = "#' + a.name + '"]', f) : goog.dom.findNode(f, function(b) {
      return bot.dom.isElement(b) && bot.dom.getAttribute(b, "usemap") == "#" + a.name
    });
    return!!f && bot.dom.isShown(f, b)
  }
  return bot.dom.isElement(a, goog.dom.TagName.AREA) ? (f = goog.dom.getAncestor(a, function(a) {
    return bot.dom.isElement(a, goog.dom.TagName.MAP)
  }), !!f && bot.dom.isShown(f, b)) : bot.dom.isElement(a, goog.dom.TagName.INPUT) && "hidden" == a.type.toLowerCase() || bot.dom.isElement(a, goog.dom.TagName.NOSCRIPT) || "hidden" == bot.dom.getEffectiveStyle(a, "visibility") || !c(a) || !b && 0 == bot.dom.getOpacity(a) || !d(a) || !e(a) ? !1 : !0
};
bot.dom.trimExcludingNonBreakingSpaceCharacters_ = function(a) {
  return a.replace(/^[^\S\xa0]+|[^\S\xa0]+$/g, "")
};
bot.dom.getVisibleText = function(a) {
  var b = [];
  bot.dom.appendVisibleTextLinesFromElement_(a, b);
  b = goog.array.map(b, bot.dom.trimExcludingNonBreakingSpaceCharacters_);
  a = b.join("\n");
  return bot.dom.trimExcludingNonBreakingSpaceCharacters_(a).replace(/\xa0/g, " ")
};
bot.dom.appendVisibleTextLinesFromElement_ = function(a, b) {
  if(bot.dom.isElement(a, goog.dom.TagName.BR)) {
    b.push("")
  }else {
    var c = bot.dom.isElement(a, goog.dom.TagName.TD), d = bot.dom.getEffectiveStyle(a, "display"), e = !c && !goog.array.contains(bot.dom.INLINE_DISPLAY_BOXES_, d);
    e && !goog.string.isEmpty(goog.array.peek(b) || "") && b.push("");
    var f = bot.dom.isShown(a), g = null, h = null;
    f && (g = bot.dom.getEffectiveStyle(a, "white-space"), h = bot.dom.getEffectiveStyle(a, "text-transform"));
    goog.array.forEach(a.childNodes, function(a) {
      a.nodeType == goog.dom.NodeType.TEXT && f ? bot.dom.appendVisibleTextLinesFromTextNode_(a, b, g, h) : bot.dom.isElement(a) && bot.dom.appendVisibleTextLinesFromElement_(a, b)
    });
    var j = goog.array.peek(b) || "";
    if((c || "table-cell" == d) && j && !goog.string.endsWith(j, " ")) {
      b[b.length - 1] += " "
    }
    e && !goog.string.isEmpty(j) && b.push("")
  }
};
bot.dom.INLINE_DISPLAY_BOXES_ = "inline,inline-block,inline-table,none,table-cell,table-column,table-column-group".split(",");
bot.dom.appendVisibleTextLinesFromTextNode_ = function(a, b, c, d) {
  a = a.nodeValue.replace(/\u200b/g, "");
  a = goog.string.canonicalizeNewlines(a);
  if("normal" == c || "nowrap" == c) {
    a = a.replace(/\n/g, " ")
  }
  a = "pre" == c || "pre-wrap" == c ? a.replace(/[ \f\t\v\u2028\u2029]/g, "\u00a0") : a.replace(/[\ \f\t\v\u2028\u2029]+/g, " ");
  "capitalize" == d ? a = a.replace(/(^|\s)(\S)/g, function(a, b, c) {
    return b + c.toUpperCase()
  }) : "uppercase" == d ? a = a.toUpperCase() : "lowercase" == d && (a = a.toLowerCase());
  c = b.pop() || "";
  goog.string.endsWith(c, " ") && goog.string.startsWith(a, " ") && (a = a.substr(1));
  b.push(c + a)
};
bot.dom.getOpacity = function(a) {
  if(goog.userAgent.IE) {
    if("relative" == bot.dom.getEffectiveStyle(a, "position")) {
      return 1
    }
    a = bot.dom.getEffectiveStyle(a, "filter");
    return(a = a.match(/^alpha\(opacity=(\d*)\)/) || a.match(/^progid:DXImageTransform.Microsoft.Alpha\(Opacity=(\d*)\)/)) ? Number(a[1]) / 100 : 1
  }
  return bot.dom.getOpacityNonIE_(a)
};
bot.dom.getOpacityNonIE_ = function(a) {
  var b = 1, c = bot.dom.getEffectiveStyle(a, "opacity");
  c && (b = Number(c));
  (a = bot.dom.getParentElement(a)) && (b *= bot.dom.getOpacityNonIE_(a));
  return b
};
bot.dom.calculateViewportScrolling_ = function(a, b) {
  return a >= b ? a - (b - 1) : 0 > a ? a : 0
};
bot.dom.getInViewLocation = function(a, b) {
  var c = b || bot.getWindow(), d = goog.dom.getViewportSize(c), e = bot.dom.calculateViewportScrolling_(a.x, d.width), f = bot.dom.calculateViewportScrolling_(a.y, d.height), g = goog.dom.getDomHelper(c.document).getDocumentScroll();
  (0 != e || 0 != f) && c.scrollBy(e, f);
  c = goog.dom.getDomHelper(c.document).getDocumentScroll();
  if(g.x + e != c.x || g.y + f != c.y) {
    throw new bot.Error(bot.ErrorCode.MOVE_TARGET_OUT_OF_BOUNDS, "The target location (" + (a.x + g.x) + ", " + (a.y + g.y) + ") is not on the webpage.");
  }
  e = new goog.math.Coordinate(a.x - e, a.y - f);
  if(0 > e.x || e.x >= d.width) {
    throw new bot.Error(bot.ErrorCode.MOVE_TARGET_OUT_OF_BOUNDS, "The target location (" + e.x + ", " + e.y + ") should be within the viewport (" + d.width + ":" + d.height + ") after scrolling.");
  }
  if(0 > e.y || e.y >= d.height) {
    throw new bot.Error(bot.ErrorCode.MOVE_TARGET_OUT_OF_BOUNDS, "The target location (" + e.x + ", " + e.y + ") should be within the viewport (" + d.width + ":" + d.height + ") after scrolling.");
  }
  return e
};
bot.dom.scrollRegionIntoView_ = function(a, b) {
  b.scrollLeft += Math.min(a.left, Math.max(a.left - a.width, 0));
  b.scrollTop += Math.min(a.top, Math.max(a.top - a.height, 0))
};
bot.dom.scrollElementRegionIntoContainerView_ = function(a, b, c) {
  var a = goog.style.getPageOffset(a), d = goog.style.getPageOffset(c), e = goog.style.getBorderBox(c);
  bot.dom.scrollRegionIntoView_(new goog.math.Rect(a.x + b.left - d.x - e.left, a.y + b.top - d.y - e.top, c.clientWidth - b.width, c.clientHeight - b.height), c)
};
bot.dom.scrollElementRegionIntoClientView = function(a, b) {
  for(var c = goog.dom.getOwnerDocument(a), d = bot.dom.getParentElement(a);d && d != c.body && d != c.documentElement;d = bot.dom.getParentElement(d)) {
    bot.dom.scrollElementRegionIntoContainerView_(a, b, d)
  }
  var d = goog.style.getPageOffset(a), e = goog.dom.getDomHelper(c).getViewportSize(), d = new goog.math.Rect(d.x + b.left - c.body.scrollLeft, d.y + b.top - c.body.scrollTop, e.width - b.width, e.height - b.height);
  bot.dom.scrollRegionIntoView_(d, c.body || c.documentElement)
};
bot.dom.getLocationInView = function(a, b) {
  var c;
  c = b ? new goog.math.Rect(b.left, b.top, b.width, b.height) : new goog.math.Rect(0, 0, a.offsetWidth, a.offsetHeight);
  bot.dom.scrollElementRegionIntoClientView(a, c);
  var d = a.getClientRects ? a.getClientRects()[0] : null, d = d ? new goog.math.Coordinate(d.left, d.top) : goog.style.getClientPosition(a);
  return new goog.math.Coordinate(d.x + c.left, d.y + c.top)
};
bot.dom.isScrolledIntoView = function(a, b) {
  for(var c = goog.dom.getWindow(goog.dom.getOwnerDocument(a)), d = c.top, e = goog.style.getSize(a);;c = c.parent) {
    var f = goog.dom.getDomHelper(c.document).getDocumentScroll(), g = goog.dom.getViewportSize(c), f = new goog.math.Rect(f.x, f.y, g.width, g.height), g = goog.style.getFramedPageOffset(a, c), g = new goog.math.Rect(g.x, g.y, e.width, e.height);
    if(!goog.math.Rect.intersects(f, g)) {
      return!1
    }
    if(c == d) {
      break
    }
  }
  d = goog.style.getVisibleRectForElement(a);
  if(!d) {
    return!1
  }
  if(b) {
    return e = goog.style.getPageOffset(a), e = goog.math.Coordinate.sum(e, b), d.contains(e)
  }
  e = goog.style.getBounds(a).toBox();
  return goog.math.Box.intersects(d, e)
};
fxdriver.moz = {};
var CC = Components.classes, CI = Components.interfaces, CR = Components.results, CU = Components.utils;
fxdriver.moz.load = function() {
  Components.utils["import"]("resource://gre/modules/XPCOMUtils.jsm")
};
fxdriver.moz.getService = function(a, b) {
  var c = Components.classes[a];
  if(void 0 == c) {
    throw Error("Cannot create component " + a);
  }
  return c.getService(Components.interfaces[b])
};
fxdriver.moz.queryInterface = function(a, b) {
  return function(c) {
    if(!c) {
      return CR.NS_ERROR_NO_INTERFACE
    }
    if(c.equals(CI.nsISupports) || goog.array.reduce(b, function(a, b) {
      return!b ? a : a || b.equals(c)
    }, !1)) {
      return a
    }
    throw CR.NS_ERROR_NO_INTERFACE;
  }
};
fxdriver.moz.unwrap = function(a) {
  if(!goog.isDefAndNotNull(a) || a.__fxdriver_unwrapped) {
    return a
  }
  if(a.wrappedJSObject) {
    return a.wrappedJSObject.__fxdriver_unwrapped = !0, a.wrappedJSObject
  }
  try {
    if(a == XPCNativeWrapper(a)) {
      var b = XPCNativeWrapper.unwrap(a), b = b ? b : a;
      b.__fxdriver_unwrapped = !0;
      return b
    }
  }catch(c) {
  }
  return a
};
fxdriver.moz.unwrapXpcOnly = function(a) {
  if(XPCNativeWrapper && "unwrap" in XPCNativeWrapper) {
    try {
      return XPCNativeWrapper.unwrap(a)
    }catch(b) {
      fxdriver.Logger.dumpn("Unwrap From XPC only failed: " + b)
    }
  }
  return a
};
fxdriver.moz.unwrapFor4 = function(a) {
  return bot.userAgent.isProductVersion(4) ? fxdriver.moz.unwrap(a) : a
};
fxdriver.utils = {};
fxdriver.moz.queryInterface = function(a, b) {
  return function(c) {
    if(!c) {
      return CR.NS_ERROR_NO_INTERFACE
    }
    if(c.equals(CI.nsISupports) || goog.array.reduce(b, function(a, b) {
      return!b ? a : a || b.equals(c)
    }, !1)) {
      return a
    }
    throw CR.NS_ERROR_NO_INTERFACE;
  }
};
fxdriver.utils.windowMediator = function() {
  var a = CC["@mozilla.org/appshell/window-mediator;1"];
  if(!a) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_COMMAND);
  }
  return a.getService(CI.nsIWindowMediator)
};
fxdriver.utils.getChromeWindow = function(a) {
  return a.QueryInterface(CI.nsIInterfaceRequestor).getInterface(CI.nsIWebNavigation).QueryInterface(CI.nsIDocShellTreeItem).rootTreeItem.QueryInterface(CI.nsIInterfaceRequestor).getInterface(CI.nsIDOMWindow).QueryInterface(CI.nsIDOMChromeWindow)
};
fxdriver.utils.getUniqueId = function() {
  fxdriver.utils._generator || (fxdriver.utils._generator = fxdriver.moz.getService("@mozilla.org/uuid-generator;1", "nsIUUIDGenerator"));
  return fxdriver.utils._generator.generateUUID().toString()
};
fxdriver.utils.newCoordinates = function(a, b, c) {
  return{QueryInterface:function(a) {
    if(a.equals(Components.interfaces.wdICoordinate) || a.equals(Components.interfaces.nsISupports)) {
      return this
    }
    throw Components.results.NS_NOINTERFACE;
  }, auxiliary:a, x:b, y:c}
};
var Utils = {}, WebDriverError = function(a, b, c) {
  var d;
  b instanceof Error ? (d = b.message, b = b.stack) : (d = b.toString(), b = Error(d).stack.split("\n"), b.shift(), b = b.join("\n"));
  this.additionalFields = [];
  if(c) {
    for(var e in c) {
      this.additionalFields.push(e), this[e] = c[e]
    }
  }
  this.code = a;
  this.message = d;
  this.stack = b;
  this.isWebDriverError = !0
};
function notifyOfCloseWindow(a) {
  a = a || 0;
  if(Utils.useNativeEvents()) {
    var b = Utils.getNativeEvents();
    b && b.notifyOfCloseWindow(a)
  }
}
function notifyOfSwitchToWindow(a) {
  if(Utils.useNativeEvents()) {
    var b = Utils.getNativeEvents();
    b && b.notifyOfSwitchToWindow(a)
  }
}
Utils.newInstance = function(a, b) {
  var c = Components.classes[a];
  if(c) {
    var d = Components.interfaces[b];
    try {
      return c.createInstance(d)
    }catch(e) {
      throw fxdriver.Logger.dumpn("Cannot create: " + a + " from " + b), fxdriver.Logger.dumpn(e), e;
    }
  }else {
    fxdriver.Logger.dumpn("Unable to find class: " + a)
  }
};
Utils.getServer = function() {
  return Utils.newInstance("@googlecode.com/webdriver/fxdriver;1", "nsISupports").wrappedJSObject
};
Utils.getActiveElement = function(a) {
  var b = goog.dom.getWindow(a);
  a.activeElement ? b = a.activeElement : (b = b.top.activeElement) && a != b.ownerDocument && (b = null);
  b || (b = a.body);
  return b
};
Utils.addToKnownElements = function(a) {
  var b = {};
  Components.utils["import"]("resource://fxdriver/modules/web_element_cache.js", b);
  return b.put(a)
};
Utils.getElementAt = function(a, b) {
  var c = {};
  Components.utils["import"]("resource://fxdriver/modules/web_element_cache.js", c);
  return c.get(a, b)
};
Utils.isAttachedToDom = function(a) {
  function b(a) {
    return bot.userAgent.isProductVersion(4) ? a ? new XPCNativeWrapper(a) : null : a
  }
  for(var c = b(a.ownerDocument.documentElement), a = b(a);a && a != c;) {
    a = b(a.parentNode)
  }
  return a == c
};
Utils.shiftCount = 0;
Utils.getNativeComponent = function(a, b) {
  try {
    return Components.classes[a].createInstance().QueryInterface(b)
  }catch(c) {
    fxdriver.Logger.dumpn(c)
  }
};
Utils.getNativeEvents = function() {
  return Utils.getNativeComponent("@openqa.org/nativeevents;1", Components.interfaces.nsINativeEvents)
};
Utils.getNativeMouse = function() {
  return Utils.getNativeComponent("@openqa.org/nativemouse;1", Components.interfaces.nsINativeMouse)
};
Utils.getNativeKeyboard = function() {
  return Utils.getNativeComponent("@openqa.org/nativekeyboard;1", Components.interfaces.nsINativeKeyboard)
};
Utils.getNativeIME = function() {
  return Utils.getNativeComponent("@openqa.org/nativeime;1", Components.interfaces.nsINativeIME)
};
Utils.getNodeForNativeEvents = function(a) {
  try {
    return Utils.newInstance("@mozilla.org/accessibleRetrieval;1", "nsIAccessibleRetrieval").getAccessibleFor(a.ownerDocument).QueryInterface(Components.interfaces.nsIAccessibleDocument).QueryInterface(Components.interfaces.nsISupports)
  }catch(b) {
  }
};
Utils.useNativeEvents = function() {
  var a = fxdriver.moz.getService("@mozilla.org/preferences-service;1", "nsIPrefBranch");
  return a.prefHasUserValue("webdriver_enable_native_events") && a.getBoolPref("webdriver_enable_native_events") && Utils.getNativeEvents() ? !0 : !1
};
Utils.type = function(a, b, c, d, e, f, g) {
  var h = Utils.getNativeKeyboard(), j = Utils.getNodeForNativeEvents(b), m = Components.classes["@mozilla.org/thread-manager;1"], d = d && h && j && m, c = c.replace(RegExp("\u0008", "g"), "\ue003").replace(/\t/g, "\ue004").replace(/(\r\n|\n|\r)/g, "\ue006");
  if(d) {
    a = Utils.getPageUnloadedIndicator(b), h.sendKeys(j, c, f), Utils.waitForNativeEventsProcessing(b, Utils.getNativeEvents(), a, e)
  }else {
    fxdriver.Logger.dumpn("Doing sendKeys in a non-native way...");
    d = j = h = e = !1;
    g && (e = g.control, h = g.shiftKey, j = g.alt, d = g.meta);
    Utils.shiftCount = 0;
    g = c.toUpperCase();
    for(m = 0;m < c.length;m++) {
      var i = c.charAt(m);
      if("\ue000" == i) {
        if(e && (i = Components.interfaces.nsIDOMKeyEvent.DOM_VK_CONTROL, Utils.keyEvent(a, b, "keyup", i, 0, e = !1, h, j, d, !1)), h && (i = Components.interfaces.nsIDOMKeyEvent.DOM_VK_SHIFT, Utils.keyEvent(a, b, "keyup", i, 0, e, h = !1, j, d, !1)), j && (i = Components.interfaces.nsIDOMKeyEvent.DOM_VK_ALT, Utils.keyEvent(a, b, "keyup", i, 0, e, h, j = !1, d, !1)), d) {
          i = Components.interfaces.nsIDOMKeyEvent.DOM_VK_META, Utils.keyEvent(a, b, "keyup", i, 0, e, h, j, d = !1, !1)
        }
      }else {
        var n = "", l = 0, k = 0;
        "\ue001" == i ? k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_CANCEL : "\ue002" == i ? k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_HELP : "\ue003" == i ? k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_BACK_SPACE : "\ue004" == i ? k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_TAB : "\ue005" == i ? k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_CLEAR : "\ue006" == i ? k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_RETURN : "\ue007" == i ? k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_ENTER : 
        "\ue008" == i ? (k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_SHIFT, n = (h = !h) ? "keydown" : "keyup") : "\ue009" == i ? (k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_CONTROL, n = (e = !e) ? "keydown" : "keyup") : "\ue00a" == i ? (k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_ALT, n = (j = !j) ? "keydown" : "keyup") : "\ue03d" == i ? (k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_META, n = (d = !d) ? "keydown" : "keyup") : "\ue00b" == i ? k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_PAUSE : 
        "\ue00c" == i ? k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_ESCAPE : "\ue00d" == i ? k = l = 32 : "\ue00e" == i ? k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_PAGE_UP : "\ue00f" == i ? k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_PAGE_DOWN : "\ue010" == i ? k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_END : "\ue011" == i ? k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_HOME : "\ue012" == i ? k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_LEFT : "\ue013" == i ? k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_UP : 
        "\ue014" == i ? k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_RIGHT : "\ue015" == i ? k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_DOWN : "\ue016" == i ? k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_INSERT : "\ue017" == i ? k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_DELETE : "\ue018" == i ? (k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_SEMICOLON, l = 59) : "\ue019" == i ? (k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_EQUALS, l = 61) : "\ue01a" == i ? (k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_NUMPAD0, 
        l = 48) : "\ue01b" == i ? (k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_NUMPAD1, l = 49) : "\ue01c" == i ? (k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_NUMPAD2, l = 50) : "\ue01d" == i ? (k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_NUMPAD3, l = 51) : "\ue01e" == i ? (k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_NUMPAD4, l = 52) : "\ue01f" == i ? (k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_NUMPAD5, l = 53) : "\ue020" == i ? (k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_NUMPAD6, 
        l = 54) : "\ue021" == i ? (k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_NUMPAD7, l = 55) : "\ue022" == i ? (k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_NUMPAD8, l = 56) : "\ue023" == i ? (k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_NUMPAD9, l = 57) : "\ue024" == i ? (k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_MULTIPLY, l = 42) : "\ue025" == i ? (k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_ADD, l = 43) : "\ue026" == i ? (k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_SEPARATOR, 
        l = 44) : "\ue027" == i ? (k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_SUBTRACT, l = 45) : "\ue028" == i ? (k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_DECIMAL, l = 46) : "\ue029" == i ? (k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_DIVIDE, l = 47) : "\ue031" == i ? k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_F1 : "\ue032" == i ? k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_F2 : "\ue033" == i ? k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_F3 : "\ue034" == i ? k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_F4 : 
        "\ue035" == i ? k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_F5 : "\ue036" == i ? k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_F6 : "\ue037" == i ? k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_F7 : "\ue038" == i ? k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_F8 : "\ue039" == i ? k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_F9 : "\ue03a" == i ? k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_F10 : "\ue03b" == i ? k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_F11 : "\ue03c" == 
        i ? k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_F12 : "," == i || "<" == i ? (k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_COMMA, l = i.charCodeAt(0)) : "." == i || ">" == i ? (k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_PERIOD, l = i.charCodeAt(0)) : "/" == i || "?" == i ? (k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_SLASH, l = c.charCodeAt(m)) : "`" == i || "~" == i ? (k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_BACK_QUOTE, l = i.charCodeAt(0)) : "{" == i || "[" == i ? 
        (k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_OPEN_BRACKET, l = i.charCodeAt(0)) : "\\" == i || "|" == i ? (k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_BACK_SLASH, l = i.charCodeAt(0)) : "}" == i || "]" == i ? (k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_CLOSE_BRACKET, l = i.charCodeAt(0)) : "'" == i || '"' == i ? (k = Components.interfaces.nsIDOMKeyEvent.DOM_VK_QUOTE, l = i.charCodeAt(0)) : (k = g.charCodeAt(m), l = c.charCodeAt(m));
        if(n) {
          Utils.keyEvent(a, b, n, k, 0, e, h, j, d, !1)
        }else {
          n = !1;
          l && (n = /[A-Z\!\$\^\*\(\)\+\{\}\:\?\|~@#%&_"<>]/.test(i));
          n && !h && (i = Components.interfaces.nsIDOMKeyEvent.DOM_VK_SHIFT, Utils.keyEvent(a, b, "keydown", i, 0, e, !0, j, d, !1), Utils.shiftCount += 1);
          i = k;
          if(32 <= l && 127 > l && (i = 0, !n && h && 32 < l)) {
            if(97 <= l && 122 >= l) {
              l = l + 65 - 97
            }else {
              var o = "`1234567890-=[]\\;',./".search(String.fromCharCode(l).replace(/([\[\\\.])/g, "\\$1"));
              0 <= o && (l = '~!@#$%^&*()_+{}|:"<>?'.charCodeAt(o))
            }
          }
          o = Utils.keyEvent(a, b, "keydown", k, 0, e, n || h, j, d, !1);
          Utils.keyEvent(a, b, "keypress", i, l, e, n || h, j, d, !o);
          Utils.keyEvent(a, b, "keyup", k, 0, e, n || h, j, d, !1);
          n && !h && (i = Components.interfaces.nsIDOMKeyEvent.DOM_VK_SHIFT, Utils.keyEvent(a, b, "keyup", i, 0, e, !1, j, d, !1))
        }
      }
    }
    e && f && (i = Components.interfaces.nsIDOMKeyEvent.DOM_VK_CONTROL, Utils.keyEvent(a, b, "keyup", i, 0, e = !1, h, j, d, !1));
    h && f && (i = Components.interfaces.nsIDOMKeyEvent.DOM_VK_SHIFT, Utils.keyEvent(a, b, "keyup", i, 0, e, h = !1, j, d, !1));
    j && f && (i = Components.interfaces.nsIDOMKeyEvent.DOM_VK_ALT, Utils.keyEvent(a, b, "keyup", i, 0, e, h, j = !1, d, !1));
    d && f && (i = Components.interfaces.nsIDOMKeyEvent.DOM_VK_META, Utils.keyEvent(a, b, "keyup", i, 0, e, h, j, d = !1, !1));
    return{shiftKey:h, alt:j, meta:d, control:e}
  }
};
Utils.keyEvent = function(a, b, c, d, e, f, g, h, j, m) {
  var m = void 0 == m ? !1 : m, i = a.createEvent("KeyEvents");
  i.initKeyEvent(c, !0, !0, a.defaultView, f, h, g, j, d, e);
  m && i.preventDefault();
  return bot.userAgent.isProductVersion(4) ? a.defaultView.QueryInterface(Components.interfaces.nsIInterfaceRequestor).getInterface(Components.interfaces.nsIDOMWindowUtils).dispatchDOMEventViaPresShell(b, i, !0) : b.dispatchEvent(i)
};
Utils.fireHtmlEvent = function(a, b) {
  var c = a.ownerDocument.createEvent("HTMLEvents");
  c.initEvent(b, !0, !0);
  return a.dispatchEvent(c)
};
Utils.fireMouseEventOn = function(a, b, c, d) {
  Utils.triggerMouseEvent(a, b, c, d)
};
Utils.triggerMouseEvent = function(a, b, c, d) {
  var e = a.ownerDocument.createEvent("MouseEvents"), f = a.ownerDocument.defaultView;
  e.initMouseEvent(b, !0, !0, f, 1, 0, 0, c || 0, d || 0, !1, !1, !1, !1, 0, a);
  a.dispatchEvent(e)
};
Utils.getElementLocation = function(a) {
  for(var b = a.offsetLeft, c = a.offsetTop, a = a.offsetParent;null != a;) {
    if("TABLE" == a.tagName) {
      var d = parseInt(a.border);
      isNaN(d) ? null != a.getAttribute("frame") && (b += 1, c += 1) : 0 < d && (b += d, c += d)
    }
    b += a.offsetLeft;
    c += a.offsetTop;
    a = a.offsetParent
  }
  a = {};
  a.x = b;
  a.y = c;
  return a
};
Utils.getLocationViaAccessibilityInterface = function(a) {
  if(a = Utils.newInstance("@mozilla.org/accessibleRetrieval;1", "nsIAccessibleRetrieval").getAccessibleFor(a)) {
    var b = {}, c = {}, d = {}, e = {};
    a.getBounds(b, c, d, e);
    return{x:b.value, y:c.value, width:d.value, height:e.value}
  }
};
Utils.getLocation = function(a, b) {
  try {
    var a = a.wrappedJSObject ? a.wrappedJSObject : a, c = void 0, c = b && 1 < a.getClientRects().length ? a.getClientRects()[0] : a.getBoundingClientRect();
    if(c.width) {
      return{x:c.left, y:c.top, width:c.width, height:c.height}
    }
    if(void 0 !== c.top) {
      return{x:c.left, y:c.top, width:c.right - c.left, height:c.bottom - c.top}
    }
    fxdriver.Logger.dumpn("Falling back to firefox3 mechanism");
    var d = Utils.getLocationViaAccessibilityInterface(a);
    d.x = c.left;
    d.y = c.top;
    return d
  }catch(e) {
    fxdriver.Logger.dumpn(e);
    fxdriver.Logger.dumpn("Falling back to using closure to find the location of the element");
    var c = goog.style.getClientPosition(a), d = goog.style.getBorderBoxSize(a), f = bot.dom.isShown(a, !0);
    return{x:c.x, y:c.y, width:f ? d.width : 0, height:f ? d.height : 0}
  }
};
Utils.getLocationRelativeToWindowHandle = function(a, b, c) {
  var c = Utils.getLocation(a, c), d = Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULAppInfo);
  if(0 <= Components.classes["@mozilla.org/xpcom/version-comparator;1"].getService(Components.interfaces.nsIVersionComparator).compare(d.version, "3.6")) {
    for(var e = a.ownerDocument.defaultView, d = a.ownerDocument.defaultView.parent;d != e;) {
      e = d, d = e.parent
    }
    e = a.ownerDocument.defaultView.mozInnerScreenY - d.mozInnerScreenY;
    c.x += a.ownerDocument.defaultView.mozInnerScreenX - d.mozInnerScreenX;
    c.y += e
  }
  a = Utils.getBrowserSpecificOffset(b);
  c.x += a.x;
  c.y += a.y;
  return c
};
Utils.getBrowserSpecificOffset = function(a) {
  var b = 0, c = 0;
  bot.userAgent.isProductVersion(4) && (a = a.getBoundingClientRect(), c += a.top, b += a.left, fxdriver.Logger.dumpn("Browser-specific offset (X,Y): " + b + ", " + c));
  return{x:b, y:c}
};
Utils.translateByBrowserSpecificOffset = function(a, b) {
  var c = Utils.getBrowserSpecificOffset(a);
  b.x += c.x;
  b.y += c.y
};
Utils.getLocationOnceScrolledIntoView = function(a, b) {
  "function" == typeof a.scrollIntoView && a.scrollIntoView();
  return Utils.getLocation(a, b)
};
Utils.unwrapParameters = function(a, b) {
  switch(typeof a) {
    case "number":
    ;
    case "string":
    ;
    case "boolean":
      return a;
    case "object":
      if(null == a) {
        return null
      }
      if("number" === typeof a.length && !a.propertyIsEnumerable("length")) {
        for(var c = [];a && 0 < a.length;) {
          var d = a.shift();
          c.push(Utils.unwrapParameters(d, b))
        }
        return c
      }
      if("string" === typeof a.ELEMENT) {
        return c = Utils.getElementAt(a.ELEMENT, b), c = c.wrappedJSObject ? c.wrappedJSObject : c
      }
      c = {};
      for(d in a) {
        c[d] = Utils.unwrapParameters(a[d], b)
      }
      return c
  }
};
Utils.wrapResult = function(a, b) {
  a = fxdriver.moz.unwrap(a);
  switch(typeof a) {
    case "string":
    ;
    case "number":
    ;
    case "boolean":
      return a;
    case "function":
      return a.toString();
    case "undefined":
      return null;
    case "object":
      if(null == a) {
        return null
      }
      if(a.tagName) {
        return{ELEMENT:Utils.addToKnownElements(a)}
      }
      if("number" === typeof a.length && !a.propertyIsEnumerable("length")) {
        for(var c = [], d = 0;d < a.length;d++) {
          c.push(Utils.wrapResult(a[d], b))
        }
        return c
      }
      try {
        for(var e = a.QueryInterface(CI.nsIDOMNodeList), c = [], d = 0;d < e.length;d++) {
          c.push(Utils.wrapResult(a.item(d), b))
        }
        return c
      }catch(f) {
        fxdriver.Logger.dumpn(f)
      }
      var c = {}, g;
      for(g in a) {
        c[g] = Utils.wrapResult(a[g], b)
      }
      return c;
    default:
      return a
  }
};
Utils.loadUrl = function(a) {
  fxdriver.Logger.dumpn("Loading: " + a);
  var b = fxdriver.moz.getService("@mozilla.org/network/io-service;1", "nsIIOService").newChannel(a, null, null).open(), c = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance(Components.interfaces.nsIScriptableInputStream);
  c.init(b);
  var d = Utils.newInstance("@mozilla.org/intl/scriptableunicodeconverter", "nsIScriptableUnicodeConverter");
  d.charset = "UTF-8";
  for(var e = "", f = c.read(4096);f;f = c.read(4096)) {
    e += d.ConvertToUnicode(f)
  }
  c.close();
  b.close();
  fxdriver.Logger.dumpn("Done reading: " + a);
  return e
};
Utils.installWindowCloseListener = function(a) {
  var b = a.session.getBrowser(), c = goog.bind(a.send, a);
  a.send = function() {
    e.unregisterNotification(d);
    c()
  };
  var d = {observe:function(c, d) {
    "domwindowclosed" == d && b.contentWindow == c.content && (fxdriver.Logger.dumpn("Window was closed."), a.send())
  }}, e = fxdriver.moz.getService("@mozilla.org/embedcomp/window-watcher;1", "nsIWindowWatcher");
  e.registerNotification(d)
};
Utils.installClickListener = function(a, b) {
  var c = a.session.getBrowser(), d = a.session.getWindow(), e = new b(c, function(b) {
    fxdriver.Logger.dumpn("New page loading.");
    d.closed && (fxdriver.Logger.dumpn("Detected page load in top window; changing session focus from frame to new top window."), a.session.setWindow(c.contentWindow));
    b && a.sendError(new WebDriverError(bot.ErrorCode.TIMEOUT, "Timed out waiting for page load."));
    a.send()
  }, a.session.getPageLoadTimeout(), d), f = c.contentWindow;
  f.closed ? (fxdriver.Logger.dumpn("Content window closed."), a.send()) : f.setTimeout(function() {
    c.webProgress.isLoadingDocument || (b.removeListener(c, e), fxdriver.Logger.dumpn("Not loading document anymore."), a.send())
  }, 50)
};
Utils.waitForNativeEventsProcessing = function(a, b, c, d) {
  var e = Components.classes["@mozilla.org/thread-manager;1"], f = Utils.getNodeForNativeEvents(a), g = {}, e = e.getService(Components.interfaces.nsIThreadManager).currentThread;
  do {
    var h = !1;
    d.setTimeout(function() {
      fxdriver.Logger.dumpn("Done native event wait.");
      h = !0
    }, 100);
    b.hasUnhandledEvents(f, g);
    fxdriver.Logger.dumpn("Pending native events: " + g.value);
    for(var j = 0;!h && g.value && !c.wasUnloaded && 350 > j;) {
      e.processNextEvent(!0), j += 1
    }
    fxdriver.Logger.dumpn("Extra events processed: " + j + " Page Unloaded: " + c.wasUnloaded)
  }while(!0 == g.value && !c.wasUnloaded);
  fxdriver.Logger.dumpn("Done main loop.");
  c.wasUnloaded ? fxdriver.Logger.dumpn("Page has been reloaded while waiting for native events to be processed. Remaining events? " + g.value) : Utils.removePageUnloadEventListener(a, c);
  a = 0;
  for(b = e.processNextEvent(!1);b && 200 > a;) {
    b = e.processNextEvent(!1), a += 1
  }
  fxdriver.Logger.dumpn("Done extra event loop, " + a)
};
Utils.getPageUnloadedIndicator = function(a) {
  var b = {wasUnloaded:!1}, c = function() {
    b.wasUnloaded = !0
  };
  b.callback = c;
  a.ownerDocument.body.addEventListener("unload", c, !1);
  a.ownerDocument.defaultView.addEventListener("pagehide", c, !1);
  return b
};
Utils.removePageUnloadEventListener = function(a, b) {
  b.callback && a.ownerDocument && (a.ownerDocument.body && a.ownerDocument.body.removeEventListener("unload", b.callback, !1), a.ownerDocument.defaultView && a.ownerDocument.defaultView.removeEventListener("pagehide", b.callback, !1))
};
Utils.convertNSIArrayToNative = function(a) {
  var b = [];
  if(null == a) {
    return b
  }
  b.length = a.length;
  for(var a = a.enumerate(), c = 0;a.hasMoreElements();) {
    var d = Components.interfaces, d = a.getNext().QueryInterface(d.nsISupportsCString);
    b[c] = d.toString();
    c += 1
  }
  return b
};
fxdriver.modals = {};
fxdriver.modals.isModalPresent = function(a, b) {
  fxdriver.modaltimer = new fxdriver.Timer;
  fxdriver.modaltimer.runWhenTrue(function() {
    var a = fxdriver.modals.find_();
    return a && a.document
  }, function() {
    a(!0)
  }, b, function() {
    a(!1)
  })
};
fxdriver.modals.acceptAlert = function(a) {
  var b = fxdriver.modals.find_();
  fxdriver.modals.findButton_(b, "accept").click();
  fxdriver.modals.clearFlag_(a)
};
fxdriver.modals.dismissAlert = function(a) {
  var b = fxdriver.modals.find_(), c = fxdriver.modals.findButton_(b, "cancel");
  c || (fxdriver.Logger.dumpn("No cancel button Falling back to the accept button"), c = fxdriver.modals.findButton_(b, "accept"));
  c.click();
  fxdriver.modals.clearFlag_(a)
};
fxdriver.modals.getText = function(a) {
  return a.modalOpen
};
fxdriver.modals.setValue = function(a, b) {
  var c = fxdriver.modals.find_().document.getElementById("loginTextbox");
  try {
    var d = !1;
    if(d = bot.userAgent.isProductVersion(8) ? 0 != c.clientHeight : -1 < c.selectionStart) {
      c.value = b;
      return
    }
  }catch(e) {
  }
  throw new WebDriverError(bot.ErrorCode.ELEMENT_NOT_VISIBLE, "Alert did not have a text box");
};
fxdriver.modals.find_ = function() {
  var a = fxdriver.utils.windowMediator().getMostRecentWindow(""), a = fxdriver.moz.unwrap(a);
  return!a.QueryInterface(CI.nsIInterfaceRequestor).getInterface(CI.nsIWebNavigation).QueryInterface(CI.nsIDocShellTreeItem).treeOwner.QueryInterface(CI.nsIInterfaceRequestor).getInterface(CI.nsIWebBrowserChrome).isWindowModal() ? null : a
};
fxdriver.modals.findButton_ = function(a, b) {
  return a.document.getElementsByTagName("dialog")[0].getButton(b)
};
fxdriver.modals.setFlag = function(a, b) {
  a.modalOpen = b
};
fxdriver.modals.clearFlag_ = function(a) {
  fxdriver.modals.setFlag(a, !1)
};
fxdriver.modals.findAssociatedDriver_ = function(a) {
  if (a) { // qqDPSWD Added this if.
    CC["@mozilla.org/embedcomp/window-watcher;1"].getService(CI.nsIWindowWatcher);
    for(var b = CC["@mozilla.org/appshell/window-mediator;1"].getService(CI.nsIWindowMediator).getEnumerator("navigator:browser");b.hasMoreElements();) {
      var c = b.getNext().QueryInterface(CI.nsIDOMWindow);
      if(c.content == a || c.content.top == a.top) {
        return c.fxdriver
      }
    }
  } // qqDPSWD Added this if.
  fxdriver.Logger.dumpn("Unable to find the associated driver")
};
fxdriver.modals.signalOpenModal = function(a, b) {
  if (!a) { return; } // No window, no signal. qqDPSWD
  fxdriver.Logger.dumpn("signalOpenModal");
  var c = fxdriver.modals.findAssociatedDriver_(a);
  // qqDPSWD
  // Selenium 1 local playback piggybacks on Selenium 2 by setting these directives.
  if (c && c.modalHandling && c.modalHandling != 0) {
    if(c/* && c.response_*/) {
      fxdriver.modals.setFlag(c, b);
    }
    if (c.modalHandling == "acceptAlert") {
      c.acceptAlert({'send': function() {}});
    } else if (c.modalHandling == "dismissAlert") {
      c.dismissAlert({'send': function() {}});
    } else if (c.modalHandling == "answerAlert") {
      c.setAlertValue({'send': function() {
        c.acceptAlert({'send': function() {}});
      }}, {'text': c.modalResponse});
    }
    
    c.modalHandling = "acceptAlert";
    return;
  }
  // qqDPSWD
  if(c && c.response_) {
    fxdriver.modals.setFlag(c, b);
    var d = c.response_;
    "executeAsyncScript" == c.response_.name && !c.response_.responseSent_ ? fxdriver.modals.isModalPresent(function(a) {
      var f = "Unexpected modal dialog (text: " + b + ")";
      if(a) {
        try {
          fxdriver.modals.dismissAlert(c)
        }catch(g) {
          f += " The alert could not be closed. The browser may be in a wildly inconsistent state, and the alert may still be open. This is not good. If you can reliably reproduce this, please report a new issue at https://code.google.com/p/selenium/issues/entry with reproduction steps. Exception message: " + g
        }
      }else {
        f += " The alert disappeared before it could be closed."
      }
      d.sendError(new WebDriverError(bot.ErrorCode.MODAL_DIALOG_OPENED, f, {alert:{text:b}}))
    }, 2E3) : (d.value = b, d.send())
  }
};
var EXCLUDED_NAMES = "QueryInterface,alert,alertCheck,confirm,confirmCheck,confirmEx,getPrompt,prompt,promptPassword,promptUsernameAndPassword,select".split(",");
function addInterfaces(a, b, c) {
  goog.array.forEach(c, function(c) {
    try {
      var e = b.QueryInterface(c), f;
      for(f in e) {
        goog.array.contains(EXCLUDED_NAMES, f.toString()) || (a[f] = e[f])
      }
    }catch(g) {
    }
  })
}
function ObservingAlert(a, b) {
  this.parentWindow_ = a;
  var c = [CI.nsIPrompt, CI.nsIAuthPrompt, CI.nsIAuthPrompt2, CI.nsIWritablePropertyBag2];
  addInterfaces(this, b, c);
  this.delegate_ = b;
  this.QueryInterface = fxdriver.moz.queryInterface(this, c)
}
ObservingAlert.prototype.alert = function(a, b) {
  fxdriver.modals.signalOpenModal(this.parentWindow_, b);
  this.delegate_.alert(a, b)
};
ObservingAlert.prototype.alertCheck = function(a, b, c, d) {
  fxdriver.modals.signalOpenModal(this.parentWindow_, b);
  this.delegate_.alertCheck(a, b, c, d)
};
ObservingAlert.prototype.confirm = function(a, b) {
  fxdriver.modals.signalOpenModal(this.parentWindow_, b);
  return this.delegate_.confirm(a, b)
};
ObservingAlert.prototype.confirmCheck = function(a, b, c, d) {
  fxdriver.modals.signalOpenModal(this.parentWindow_, b);
  return this.delegate_.confirmCheck(a, b, c, d)
};
ObservingAlert.prototype.confirmEx = function(a, b, c, d, e, f, g, h) {
  fxdriver.modals.signalOpenModal(this.parentWindow_, b);
  return this.delegate_.confirmEx(a, b, c, d, e, f, g, h)
};
ObservingAlert.prototype.prompt = function(a, b, c, d, e) {
  fxdriver.modals.signalOpenModal(this.parentWindow_, b);
  return this.delegate_.prompt(a, b, c, d, e)
};
ObservingAlert.prototype.promptPassword = function(a, b, c, d, e) {
  fxdriver.modals.signalOpenModal(this.parentWindow_, b);
  return this.delegate_.promptPassword(a, b, c, d, e)
};
ObservingAlert.prototype.promptUsernameAndPassword = function(a, b, c, d, e, f) {
  fxdriver.modals.signalOpenModal(this.parentWindow_, b);
  return this.delegate_.promptUsernameAndPassword(a, b, c, d, e, f)
};
ObservingAlert.prototype.select = function(a, b, c, d, e) {
  fxdriver.modals.signalOpenModal(this.parentWindow_, b);
  return this.delegate_.select(a, b, c, d, e)
};
function DrivenPromptService() {
  fxdriver.Logger.dumpn("Spoofing prompt service");
  var a = function(a, b) {
    for(var e = 0;e < b.length;e++) {
      var f = Components.classesByID[b[e]];
      if(f && (f = f.getService())) {
        try {
          var g = f.QueryInterface(a);
          fxdriver.Logger.dumpn("Found implementation at: " + b[e]);
          return g
        }catch(h) {
        }
      }
    }
    return null
  }, b = a(CI.nsIPromptService2, ["{7ad1b327-6dfa-46ec-9234-f2a620ea7e00}", "{A2112D6A-0E28-421f-B46A-25C0B308CBD0}"]), a = a(CI.nsIPromptFactory, ["{1c978d25-b37f-43a8-a2d6-0c7a239ead87}"]);
  b || fxdriver.Logger.dumpn("Unable to locate original prompt service");
  a || fxdriver.Logger.dumpn("Unable to locate original prompter");
  this.delegate_ = a ? a : b;
  addInterfaces(this, this.delegate_, [CI.nsIPromptFactory, CI.nsIPromptService, CI.nsIPromptService2]);
  this.QueryInterface = fxdriver.moz.queryInterface(this, [CI.nsIPromptFactory, CI.nsIPromptService, CI.nsIPromptService2]);
  fxdriver.Logger.dumpn("Finished initializing spoofed prompt service")
}
DrivenPromptService.prototype = {BUTTON_POS_0:1, BUTTON_POS_1:256, BUTTON_POS_2:65536, BUTTON_TITLE_OK:1, BUTTON_TITLE_CANCEL:2, BUTTON_TITLE_YES:3, BUTTON_TITLE_NO:4, BUTTON_TITLE_SAVE:5, BUTTON_TITLE_DONT_SAVE:6, BUTTON_TITLE_REVERT:7, BUTTON_TITLE_IS_STRING:127, BUTTON_POS_0_DEFAULT:0, BUTTON_POS_1_DEFAULT:16777216, BUTTON_POS_2_DEFAULT:33554432, BUTTON_DELAY_ENABLE:67108864, STD_OK_CANCEL_BUTTONS:this.BUTTON_TITLE_OK * this.BUTTON_POS_0 + this.BUTTON_TITLE_CANCEL * this.BUTTON_POS_1, STD_YES_NO_BUTTONS:this.BUTTON_TITLE_YES * 
this.BUTTON_POS_0 + this.BUTTON_TITLE_NO * this.BUTTON_POS_1};
DrivenPromptService.prototype.alert = function(a, b, c) {
  fxdriver.modals.signalOpenModal(a, c);
  return this.delegate_.QueryInterface(CI.nsIPromptService2).alert(a, b, c)
};
DrivenPromptService.prototype.alertCheck = function(a, b, c, d, e) {
  fxdriver.modals.signalOpenModal(a, c);
  return this.delegate_.QueryInterface(CI.nsIPromptService2).alertCheck(a, b, c, d, e)
};
DrivenPromptService.prototype.confirm = function(a, b, c) {
  fxdriver.modals.signalOpenModal(a, c);
  return this.delegate_.QueryInterface(CI.nsIPromptService2).confirm(a, b, c)
};
DrivenPromptService.prototype.confirmCheck = function(a, b, c, d, e) {
  fxdriver.modals.signalOpenModal(a, c);
  return this.delegate_.QueryInterface(CI.nsIPromptService2).confirmCheck(a, b, c, d, e)
};
DrivenPromptService.prototype.confirmEx = function(a, b, c, d, e, f, g, h, j) {
  fxdriver.modals.signalOpenModal(a, c);
  return this.delegate_.QueryInterface(CI.nsIPromptService2).confirmEx(a, b, c, d, e, f, g, h, j)
};
DrivenPromptService.prototype.prompt = function(a, b, c, d, e, f) {
  fxdriver.modals.signalOpenModal(a, c);
  return this.delegate_.QueryInterface(CI.nsIPromptService2).prompt(a, b, c, d, e, f)
};
DrivenPromptService.prototype.promptUsernameAndPassword = function(a, b, c, d, e, f, g) {
  return this.delegate_.QueryInterface(CI.nsIPromptService2).promptUsernameAndPassword(a, b, c, d, e, f, g)
};
DrivenPromptService.prototype.promptPassword = function(a, b, c, d, e, f) {
  return this.delegate_.QueryInterface(CI.nsIPromptService2).promptPassword(a, b, c, d, e, f)
};
DrivenPromptService.prototype.select = function(a, b, c, d, e, f) {
  return this.delegate_.QueryInterface(CI.nsIPromptService2).select(a, b, c, d, e, f)
};
DrivenPromptService.prototype.promptAuth = function(a, b, c, d, e, f) {
  fxdriver.modals.signalOpenModal(a, "");
  return this.delegate_.QueryInterface(CI.nsIPromptService2).promptAuth(a, b, c, d, e, f)
};
DrivenPromptService.prototype.asyncPromptAuth = function(a, b, c, d, e, f, g, h) {
  fxdriver.modals.signalOpenModal(a, "");
  return this.delegate_.QueryInterface(CI.nsIPromptService2).asyncPromptAuth(a, b, c, d, e, f, g, h)
};
DrivenPromptService.prototype.getPrompt = function(a, b) {
  var c = this.delegate_.QueryInterface(CI.nsIPromptFactory).getPrompt(a, b);
  return new ObservingAlert(a, c)
};
DrivenPromptService.prototype.observe = function(a, b, c) {
  return this.delegate_.observe(a, b, c)
};
var PROMPT_SERVICE_CONTRACT_ID = "@mozilla.org/embedcomp/prompt-service;1", PROMPTER_CONTRACT_ID = "@mozilla.org/prompter;1", DRIVEN_PROMPT_SERVICE_CLASS_ID = Components.ID("{e26dbdcd-d3ba-4ded-88c3-6cb07ee3e9e0}"), service = void 0, PromptServiceSpoofFactory = {createInstance:function(a) {
  if(null != a) {
    throw Components.results.NS_ERROR_NO_AGGREGATION;
  }
  void 0 == service && (service = new DrivenPromptService);
  return service
}};
function PromptServiceSpoofModule() {
  this.firstTime_ = !0
}
PromptServiceSpoofModule.prototype.registerSelf = function(a, b, c, d) {
  if(this.firstTime_) {
    throw this.firstTime_ = !1, Components.results.NS_ERROR_FACTORY_REGISTER_AGAIN;
  }
  a = a.QueryInterface(CI.nsIComponentRegistrar);
  a.registerFactoryLocation(DRIVEN_PROMPT_SERVICE_CLASS_ID, "Driven prompt service", PROMPT_SERVICE_CONTRACT_ID, b, c, d);
  a.registerFactoryLocation(DRIVEN_PROMPT_SERVICE_CLASS_ID, "Driven prompter service", PROMPTER_CONTRACT_ID, b, c, d)
};
PromptServiceSpoofModule.prototype.unregisterSelf = function(a, b) {
  fxdriver.Logger.dumpn("Unregistering\n");
  a.QueryInterface(CI.nsIComponentRegistrar);
  a.unregisterFactoryLocation(DRIVEN_PROMPT_SERVICE_CLASS_ID, b)
};
PromptServiceSpoofModule.prototype.getClassObject = function(a, b, c) {
  if(!c.equals(Components.interfaces.nsIFactory)) {
    throw Components.results.NS_ERROR_NOT_IMPLEMENTED;
  }
  if(b.equals(DRIVEN_PROMPT_SERVICE_CLASS_ID)) {
    return PromptServiceSpoofFactory
  }
  throw Components.results.NS_ERROR_NO_INTERFACE;
};
PromptServiceSpoofModule.prototype.canUnload = function() {
  return!0
};
NSGetModule = function() {
  return new PromptServiceSpoofModule
};
DrivenPromptService.prototype.classID = DRIVEN_PROMPT_SERVICE_CLASS_ID;
fxdriver.moz.load("resource://gre/modules/XPCOMUtils.jsm");
XPCOMUtils.generateNSGetFactory && (NSGetFactory = XPCOMUtils.generateNSGetFactory([DrivenPromptService]));

