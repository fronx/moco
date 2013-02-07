Moco = {};

// http://stackoverflow.com/questions/2820249/base64-encoding-and-decoding-in-client-side-javascript
Moco.decodeBase64 = function (s) {
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
Moco.whenAvailable = function (parent, name, callback) {
  var interval = 10; // ms
  window.setTimeout(function() {
    if (parent[name]) {
      callback(parent[name]);
    } else {
      window.setTimeout(arguments.callee, interval);
    }
  }, interval);
}

Moco.get = function (url, fn) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.onload = function () {
    fn(this.responseText);
  };
  request.send(null);
}

Moco.loadScript = function (url) {
  document.body
    .appendChild(document.createElement('script'))
    .src = url;
}

 Moco.loadStyles = function (url) {
  elem = document.createElement('link');
  elem.rel = 'stylesheet';
  elem.type = 'text/css';
  elem.href = url;
  document.body.appendChild(elem);
}

Moco.unpackContentAsCode = function (response) {
  var doc = JSON.parse(response);
  var lines64 = doc['content'].split("\n")
  var lines = decodeBase64(lines64.join(''));
  lines = lines.split("\n");
  lines.pop();
  var code = lines.join("\n");
  return code;
}

Moco.createTextArea = function () {
  var elem = document.createElement('textarea');
  document.body.appendChild(elem);
  return elem;
}

Moco.initEditor = function (textarea, code) {
  textarea.value = code;
  whenAvailable(window, 'CodeMirror', function () {
    whenAvailable(CodeMirror, 'newFoldFunction', function () {
      var foldFunc = CodeMirror.newFoldFunction(CodeMirror.braceRangeFinder);
      window.editor = CodeMirror.fromTextArea(textarea, {
        mode: "javascript",
        lineNumbers: true,
        lineWrapping: true
      });
      editor.on("gutterClick", foldFunc);
      foldFunc(editor, 2); // todo: do this for all function declarations
      // pre > span.cm-keyword[text="function"]
    });
  });
}

Moco.githubApiUrl = function (url) {
  return url.replace('//github.com', '//api.github.com/repos').replace('/blob/master/', '/contents/');
}

Moco.editor = function (url) {
  Moco.get(Moco.githubApiUrl(url), function (response) {
    Moco.initEditor(
      Moco.createTextArea(),
      Moco.unpackContentAsCode(response)
    );
  });
}

Moco.replacePage = function () {
  // gather info
  var codeFileUrl = window.location.href;

  // remove all the content!!!
  while (document.body.firstChild) { document.body.removeChild(document.body.firstChild) };
  while (document.head.firstChild) { document.head.removeChild(document.head.firstChild) };

  // the post-content world
  Moco.loadStyles('https://raw.github.com/marijnh/CodeMirror/master/lib/codemirror.css');
  Moco.loadScript('https://raw.github.com/marijnh/CodeMirror/master/lib/codemirror.js');
  Moco.loadScript('https://raw.github.com/marijnh/CodeMirror/master/addon/fold/foldcode.js');

  Moco.editorFromUrl(codeFileUrl);
}
