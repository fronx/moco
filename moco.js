(function(d){
  function syncGet (url) {
    console.log(url);
    var request = new XMLHttpRequest();
    request.open('GET', url, false);
    request.send(null);
    if (request.status === 200) {
      return request.responseText;
    }
  }
  // gather info
  var rawUrl = d.getElementById('raw-url').href;
  console.log(rawUrl);

  // remove all the content!!!
  d.getElementById('wrapper').remove();
  d.getElementById('footer').remove();

  // the post-content world
  d.body
    .appendChild(d.createElement('script'))
    .src = 'https://raw.github.com/marijnh/acorn/master/acorn.js';
  var code = syncGet(rawUrl);
  console.log(acorn.parse(code));
})(document);