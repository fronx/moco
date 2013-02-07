(function () {

Moco = {};

// http://stackoverflow.com/questions/2820249/base64-encoding-and-decoding-in-client-side-javascript
decodeBase64 = function (s) {
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

function get (url, fn) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.onload = function () {
    fn(this.responseText);
  };
  request.send(null);
}

function loadScript (url) {
  document.body
    .appendChild(document.createElement('script'))
    .src = url;
}

function loadStyles (url) {
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

Moco.initEditor = function (textarea, code, mode) {
  textarea.value = code;
  Moco.foldFunc = CodeMirror.newFoldFunction(CodeMirror.braceRangeFinder);
  window.editor = CodeMirror.fromTextArea(textarea, {
    mode:         mode,
    lineNumbers:  true,
    lineWrapping: true,
    readOnly:     'nocursor'
  });
  editor.on("gutterClick", Moco.foldFunc);
  return window.editor;
}

Moco.githubApiUrl = function (url) {
  return url.replace('//github.com', '//api.github.com/repos').replace('/blob/master/', '/contents/');
}

Moco.editor = function (url, mode) {
  get(Moco.githubApiUrl(url), function (response) {
    Moco.initEditor(
      Moco.createTextArea(),
      Moco.unpackContentAsCode(response),
      mode
    );
  });
}

Moco.editorLineElements = function () {
  return document.querySelectorAll('.CodeMirror-lines pre');
}

function toArray (weirdness) {
  return Array.prototype.slice.call(weirdness);
}

function isKeyWord (token, keyword) {
  return (token.className == "cm-keyword") && (token.innerHTML == keyword)
}

Moco.linesWithFunction = function () {
  return toArray(Moco.editorLineElements()).reduce(function (acc, line, index) {
    if (toArray(line.children).some(function (token) { return isKeyWord(token, 'function') })) {
      return acc.concat([index])
    } else {
      return acc
    }
  }, []) // initial value
}

Moco.foldFunctions = function () {
  '.CodeMirror-lines pre span'
}

Moco.replacePage = function () {
  // gather info
  var codeFileUrl = window.location.href;

  // remove all the content!!!
  while (document.body.firstChild) { document.body.removeChild(document.body.firstChild) };
  while (document.head.firstChild) { document.head.removeChild(document.head.firstChild) };

  // the post-content world
  loadStyles('https://raw.github.com/marijnh/CodeMirror/master/lib/codemirror.css');
  loadScript('https://raw.github.com/marijnh/CodeMirror/master/lib/codemirror.js');
  loadScript('https://raw.github.com/marijnh/CodeMirror/master/addon/fold/foldcode.js');

  Moco.editorFromUrl(codeFileUrl);
}

})();