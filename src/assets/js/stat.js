var params = window
  .location
  .search
  .replace('?','')
  .split('&')
  .reduce(
    function(p,e){
      var a = e.split('=');
      p[ decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
      return p;
    },
    {}
  );

function setCookie(name, value, options) {
  options = options || {};

  var expires = options.expires;

  if (typeof expires == "number" && expires) {
    var d = new Date();
    d.setTime(d.getTime() + expires * 1000);
    expires = options.expires = d;
  }
  if (expires && expires.toUTCString) {
    options.expires = expires.toUTCString();
  }

  value = encodeURIComponent(value);

  var updatedCookie = name + "=" + value;

  for (var propName in options) {
    updatedCookie += "; " + propName;
    var propValue = options[propName];
    if (propValue !== true) {
      updatedCookie += "=" + propValue;
    }
  }

  document.cookie = updatedCookie;
}

function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

if (!getCookie('utm_source'))
{
  if (params['utm_source']) setCookie('utm_source', params['utm_source'], { "domain":".bmchain.io", "expires":"Tue, 19 Jan 2038 03:14:07 GMT" });
  if (params['utm_medium']) setCookie('utm_medium', params['utm_medium'], { "domain":".bmchain.io", "expires":"Tue, 19 Jan 2038 03:14:07 GMT" });
  if (params['utm_campaign']) setCookie('utm_campaign', params['utm_campaign'], { "domain":".bmchain.io", "expires":"Tue, 19 Jan 2038 03:14:07 GMT" });
  if (params['utm_term']) setCookie('utm_term', params['utm_term'], { "domain":".bmchain.io", "expires":"Tue, 19 Jan 2038 03:14:07 GMT" });
  if (params['utm_content']) setCookie('utm_content', params['utm_content'], { "domain":".bmchain.io", "expires":"Tue, 19 Jan 2038 03:14:07 GMT" });

  if (params['r']) setCookie('r', params['r'], { "domain":".bmchain.io", "expires":"Tue, 19 Jan 2038 03:14:07 GMT" });

  if (params['utm_source']) setCookie('utm_source', params['utm_source'], { "domain":"bmchain.io", "expires":"Tue, 19 Jan 2038 03:14:07 GMT" });
  if (params['utm_medium']) setCookie('utm_medium', params['utm_medium'], { "domain":"bmchain.io", "expires":"Tue, 19 Jan 2038 03:14:07 GMT" });
  if (params['utm_campaign']) setCookie('utm_campaign', params['utm_campaign'], { "domain":"bmchain.io", "expires":"Tue, 19 Jan 2038 03:14:07 GMT" });
  if (params['utm_term']) setCookie('utm_term', params['utm_term'], { "domain":"bmchain.io", "expires":"Tue, 19 Jan 2038 03:14:07 GMT" });
  if (params['utm_content']) setCookie('utm_content', params['utm_content'], { "domain":"bmchain.io", "expires":"Tue, 19 Jan 2038 03:14:07 GMT" });
}
