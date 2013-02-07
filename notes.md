# classes
## ?
````
nb ?methodcall
  require

kp ?keyword something
  extend, attr_reader
````

## !
````
s1  string
k   keyword
nn  namespace (definition)
nc  class     (definition)
ss  symbol
p   punctuation
o   operator
no  name (mention)

````

## methods
.k def
no start/end scope :(
language-specific
sooo... use a parser?

## whitespace
```html
<div class="line" id="LC31" style="">
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <span class="vi">@env</span>      <span class="o">=</span> <span class="no">EnvSet</span><span class="o">.</span><span class="n">new</span><span class="p">(</span><span class="n">env_set_repo</span><span class="o">.</span><span class="n">expand</span><span class="p">(</span><span class="n">data</span><span class="o">[</span><span class="s1">'env'</span><span class="o">]</span> <span class="o">||</span> <span class="p">{}))</span></div>
```

## parse tree
"Nodes have their start and end characters offsets recorded in start and end properties (directly on the node, rather than the loc object, which holds line/column data."
^-- so this is how i can map back to the original representation of the code! :)

