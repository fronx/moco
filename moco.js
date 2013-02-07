(function(d){
  var rawUrl = d.getElementById('raw-url').href;
  d.getElementById('wrapper').remove();
  d.getElementById('footer').remove();
  d.body
    .appendChild(d.createElement('script'))
    .src = 'https://raw.github.com/marijnh/acorn/master/acorn.js';
  console.log(rawUrl);
})(document);
