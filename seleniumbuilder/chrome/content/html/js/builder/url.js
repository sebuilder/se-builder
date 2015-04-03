/**
 * A helper object for extracting particular parts of an URL. 
 *
 * @param url If this doesn't contain ://, a http:// is prefixed.
 */
builder.Url = function (url) {
  if (url) {
    this.base = url.indexOf('://') < 0 ? 'http://' + url : url;
  } else {
    this.base = null;
  }
};

builder.Url.prototype = {
  /**
   * @return everything before the first "/" in the path including protocol, hostname, and port
   * Example: http://www.foo.com:8000/bar -> http://www.foo.com:8000
   */
  server: function () {
    return this.base ? this.base.replace(/^([a-z]*:\/\/[^\/\?#]+).*$/i, "$1") : null;
  },

  /**
   * @return The hostname
   * Example: http://www.foo.com:8000/bar -> www.foo.com
   */
  hostname: function () {
    return this.base ? this.base.replace(/^.*:\/\/([^:\/\?#]+).*$/i, "$1") : null;
  },
  
  /**
   * @return Everything after and including the first "/" in the path. This is guaranteed to
   *         start with a "/", even if the URL contained no path component.
   * Example: http://www.foo.com:8000/bar -> /bar
   * Example: http://www.foo.com -> /
   */
  path: function () {
    if (!this.base) { return null; }

    var attempt = this.base.replace(this.server(), "");
    if (attempt.indexOf('/') !== 0) {
      attempt = "/" + attempt;
    }
    return attempt;
  },

  /**
   * @return The entire URL
   * Example: http://www.foo.com:8000/bar -> http://www.foo.com:8000/bar
   */
  href: function () {
    return this.server() + this.path();
  }
};



if (builder && builder.loader && builder.loader.loadNextMainScript) { builder.loader.loadNextMainScript(); }
