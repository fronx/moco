(function(){
  Moco = {};
  // http://stackoverflow.com/questions/2820249/base64-encoding-and-decoding-in-client-side-javascript
  function decodeBase64 (s) {
    var e={},i,k,v=[],r='',w=String.fromCharCode;
    var n=[[65,91],[97,123],[48,58],[43,44],[47,48]];

    for(z in n){for(i=n[z][0];i<n[z][1];i++){v.push(w(i));}}
    for(i=0;i<64;i++){e[v[i]]=i;}

    for(i=0;i<s.length;i+=72){
      var b=0,c,x,l=0,o=s.substring(i,i+72);
      for(x=0;x<o.length;x++){
        c=e[o.charAt(x)];b=(b<<6)+c;l+=6;
          while(l>=8){r+=w((b>>>(l-=8))%256);}
      }
    }
    return r;
  }

  // http://stackoverflow.com/questions/8618464/how-to-wait-for-another-js-to-load-to-proceed-operation
  function whenAvailable (name, callback) {
    var interval = 10; // ms
    window.setTimeout(function() {
      if (window[name]) {
        callback(window[name]);
      } else {
        window.setTimeout(arguments.callee, interval);
      }
    }, interval);
  }

  function get (url, fn) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function () {
      fn(this.responseText);
    };
    request.send(null);
  }

  function treeNodeToDom (parent, node, code) {
    elem = document.createElement('div');
    elem.className = node.Type;
    if (elem.body instanceof Array) {
      elem.body.each(function (child) {
        parent.appendChild(
          treeNodeToDom(elem, child, code)
        );
      })
    } else {
      parent.appendChild(
        treeNodeToDom(elem, elem.body, code)
      );
    }
  }
  // gather info
  var rawUrl = window.location.href.replace('//github.com', '//api.github.com/repos').replace('/blob/master/', '/contents/')

  // remove all the content!!!
  document.getElementById('wrapper').remove();
  document.getElementById('footer').remove();

  // the post-content world
  function loadScript (url) {
    document.body
      .appendChild(document.createElement('script'))
      .src = url;
  }
  loadScript('https://raw.github.com/marijnh/acorn/master/acorn.js');

  get(rawUrl, function (response) {
    Moco.doc = JSON.parse(response);
    var lines64 = Moco.doc['content'].split("\n")
    Moco.lines = decodeBase64(lines64.join(''));
    Moco.lines = Moco.lines.split("\n");
    Moco.lines.pop();
    Moco.code = Moco.lines.join("\n");
    whenAvailable('acorn', function () {
      Moco.tree = acorn.parse(Moco.code);
      console.log(Moco);
      Moco.root = document.createElement('div');
      Moco.root.id = 'moco-root';
      document.body.appendChild(Moco.root);
      treeNodeToDom(Moco.root);
    });
  });
})();