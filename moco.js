(function(d){
  function get (url, fn) {
    console.log(url);
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function () {
      console.log(this.responseText);
      fn(this.responseText);
    };
    request.send(null);
  }
  // gather info
  var rawUrl = d.getElementById('raw-url').href;

  // remove all the content!!!
  d.getElementById('wrapper').remove();
  d.getElementById('footer').remove();

  // the post-content world
  d.body
    .appendChild(d.createElement('script'))
    .src = 'https://raw.github.com/marijnh/acorn/master/acorn.js';
  get(rawUrl, function (code) {
    console.log(acorn.parse(code));
  });
})(document);