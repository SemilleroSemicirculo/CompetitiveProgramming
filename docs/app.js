(function(){
const A = window.ALGORITMOS, K = window.CONTENIDO || {}, DEMOS = window.DEMOS || {};
const nav = document.getElementById('nav'), main = document.getElementById('main');
const byId = Object.fromEntries(A.map(a => [a.id, a]));
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const NIV = {1:'Básico', 2:'Intermedio', 3:'Avanzado'};
const lvl = n => '<span class="lvl lvl'+n+'">'+NIV[n]+'</span>';
const fmt = x => x >= 1e15 ? '10^' + Math.round(Math.log10(x)) : x >= 1e6 ? (x/1e6).toFixed(x >= 1e8 ? 0 : 1).replace('.0','') + ' millones' : Math.round(x).toLocaleString('es');
let timers = [];
const later = (f, ms) => timers.push(setInterval(f, ms));

// ---------- Resaltado de C++ ----------
const KW = new Set('if else for while do return break continue struct class const static void int long double bool char auto using namespace typedef template typename public private new delete switch case true false operator define include'.split(' '));
const TY = new Set('vector map set queue stack deque priority_queue pair tuple array string ll ld cin cout sort unique min max abs swap'.split(' '));
function resaltar(src){
  const re = /(\/\*[\s\S]*?\*\/|\/\/[^\n]*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(#\w+)|\b(\d+\.?\d*)\b|\b([A-Za-z_]\w*)\b/g;
  let out = '', last = 0, m;
  while ((m = re.exec(src))) {
    out += esc(src.slice(last, m.index)); last = re.lastIndex;
    if (m[1]) out += '<span class="c">'+esc(m[1])+'</span>';
    else if (m[2]) out += '<span class="s">'+esc(m[2])+'</span>';
    else if (m[3]) out += '<span class="k">'+esc(m[3])+'</span>';
    else if (m[4]) out += '<span class="n">'+m[4]+'</span>';
    else if (KW.has(m[5])) out += '<span class="k">'+m[5]+'</span>';
    else if (TY.has(m[5])) out += '<span class="t">'+m[5]+'</span>';
    else out += m[5];
  }
  return out + esc(src.slice(last));
}

// ---------- Menú lateral ----------
const ORDEN = ['DP','Data Structures','FunctionalTools','Geometry','Graphs','Strings'];
function menu(filtro){
  const f = (filtro || '').toLowerCase(); let h = '';
  for (const c of ORDEN) {
    const items = A.filter(a => a.carpeta === c && (!f || (a.nombre+' '+a.algoritmo+' '+((K[a.id]||{}).idea||'')).toLowerCase().includes(f)));
    if (!items.length) continue;
    h += '<h4>'+c+'</h4>'; let sub = '';
    for (const a of items) {
      if (a.sub !== sub) { sub = a.sub; if (sub !== '-') h += '<h5>'+esc(sub.split('/').pop())+'</h5>'; }
      const n = (K[a.id]||{}).nivel || 1;
      h += '<a href="#/'+a.id+'" data-id="'+a.id+'"><span class="dot lvl'+n+'"></span>'+(DEMOS[a.id]?'▶ ':'')+esc(a.nombre)+'</a>';
    }
  }
  nav.innerHTML = h || '<p class="note">Sin resultados.</p>';
  marcar();
}
function marcar(){
  const id = location.hash.slice(2);
  nav.querySelectorAll('a').forEach(a => a.classList.toggle('on', a.dataset.id === id));
  document.querySelectorAll('header nav.top a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#/'+(byId[id]?'':id)));
}

// ---------- Portada ----------
function inicio(){
  main.innerHTML = `
  <div class="hero">
    <h1>Resolver problemas difíciles<br>con código rápido.</h1>
    <p class="lead">La programación competitiva consiste en leer un problema, encontrar una idea eficiente y programarla antes de que se acabe el tiempo. Esta guía te explica los algoritmos que más aparecen, desde los más básicos hasta los avanzados.</p>
    <div class="cta"><a class="p" href="#/elegir" onclick="window.__reset&&window.__reset()">Elegir un algoritmo →</a><a class="s" href="#/ruta">Ver ruta de estudio</a></div>
  </div>

  <section class="blk"><h2>¿Cómo funciona una competencia?</h2>
    <p>Recibes un problema, escribes un programa y un <b>juez automático</b> lo prueba con muchos casos que no conoces. Solo es correcto si da la respuesta exacta en todos y dentro del límite de tiempo (normalmente 1 segundo).</p>
    <div class="pipe" id="pipe">
      <div class="st"><b>1 · Enunciado</b>📄 Leer el problema</div><span class="ar">→</span>
      <div class="st"><b>2 · Idea</b>💡 Elegir el algoritmo</div><span class="ar">→</span>
      <div class="st"><b>3 · Código</b>⌨️ Programarlo en C++</div><span class="ar">→</span>
      <div class="st"><b>4 · Juez</b>⚙️ Corre tus casos</div><span class="ar">→</span>
      <div class="st"><b>5 · Veredicto</b><span class="verdict ac" id="vd">ACCEPTED</span></div>
    </div>
    <div class="two">
      <div class="box"><h3>Veredictos que verás</h3>
        <p><span class="verdict ac">ACCEPTED</span> todo correcto y a tiempo.</p>
        <p><span class="verdict wa">WRONG ANSWER</span> alguna respuesta no coincide.</p>
        <p><span class="verdict tle">TIME LIMIT</span> tu idea es correcta pero demasiado lenta.</p></div>
      <div class="box"><h3>Dónde practicar</h3>
        <p>Todos los códigos de esta guía fueron probados en <a href="https://cses.fi/problemset/" target="_blank" rel="noopener">CSES</a>, una colección de problemas clásicos ordenados por tema. También puedes practicar en Codeforces, AtCoder o en los problemas de ICPC.</p></div>
    </div>
  </section>

  <section class="blk"><h2>Un problema de ejemplo</h2>
    <p>Dado un arreglo de <b>n</b> números, ¿cuál es la mayor suma de un tramo seguido? Las dos soluciones dan la misma respuesta, pero mira qué pasa cuando n crece.</p>
    <div class="two">
      <div class="box"><h3>Entrada y salida</h3><div class="mono">8
-1 3 -2 5 3 -5 2 2

→ 9   (3 − 2 + 5 + 3)</div></div>
      <div class="box"><h3>Tamaño del caso: n = <span id="nv"></span></h3>
        <input type="range" id="ns" min="1" max="5.3" step="0.01" value="2">
        <div class="bars" id="cmp"></div></div>
    </div>
    <p class="note">Regla práctica: un computador hace unos <b>100 millones</b> (10⁸) de operaciones sencillas por segundo. La fuerza bruta prueba todos los pares (n² operaciones); <a href="#/DP-Algorithms-Kadane1D">Kadane</a> recorre el arreglo una vez (n operaciones).</p>
  </section>

  <section class="blk"><h2>¿Qué tan rápido tiene que ser mi algoritmo?</h2>
    <p>Mueve el tamaño de la entrada y mira qué complejidades caben en 1 segundo. Esto es lo primero que se piensa al leer un problema: el tamaño de n te dice qué tipo de algoritmo buscar.</p>
    <div class="box"><h3>n = <span id="nv2"></span></h3><input type="range" id="ns2" min="1" max="9" step="0.01" value="5"><div class="bars" id="cx"></div></div>
  </section>

  <section class="blk"><h2>Carpetas del repositorio</h2>
    <div class="opts" id="temas"></div>
  </section>`;

  // animación del flujo
  const st = [...main.querySelectorAll('#pipe .st')]; let k = 0;
  const V = [['ACCEPTED','ac'],['TIME LIMIT','tle'],['ACCEPTED','ac'],['WRONG ANSWER','wa']]; let v = 0;
  later(() => { st.forEach((s,i) => s.classList.toggle('on', i === k)); if (k === 4) { const [t,c] = V[v++ % V.length]; const e = document.getElementById('vd'); e.textContent = t; e.className = 'verdict '+c; } k = (k+1) % 5; }, 900);

  // comparación fuerza bruta vs Kadane
  const LIM = 1e8;
  function barra(nombre, ops, extra){
    const p = Math.min(100, Math.max(2, Math.log10(Math.max(ops,1)) / Math.log10(LIM*100) * 100));
    const ok = ops <= LIM, med = ops <= LIM*0.3;
    return '<div class="bar"><span>'+nombre+'</span><div class="tr"><div class="fl" style="width:'+p+'%;background:'+(med?'#2da44e':ok?'#d4a72c':'#cf222e')+'"></div></div><span>'+(extra||'')+(ok?'<span class="verdict ac">AC</span>':'<span class="verdict tle">TLE</span>')+'</span></div>';
  }
  const ns = document.getElementById('ns');
  function upd(){ const n = Math.round(10 ** +ns.value); document.getElementById('nv').textContent = n.toLocaleString('es');
    document.getElementById('cmp').innerHTML = barra('Fuerza bruta', n*n/2, fmt(n*n/2)+' ops ') + barra('Kadane', n, fmt(n)+' ops '); }
  ns.oninput = upd; upd();

  // tabla de complejidades
  const CX = [['O(log n)', n => Math.log2(n)], ['O(n)', n => n], ['O(n log n)', n => n*Math.log2(n)], ['O(n²)', n => n*n], ['O(n³)', n => n**3], ['O(2ⁿ)', n => n > 200 ? 1e60 : 2**n]];
  const ns2 = document.getElementById('ns2');
  function upd2(){ const n = Math.round(10 ** +ns2.value); document.getElementById('nv2').textContent = n.toLocaleString('es');
    document.getElementById('cx').innerHTML = CX.map(([t,f]) => barra(t, f(n))).join(''); }
  ns2.oninput = upd2; upd2();

  document.getElementById('temas').innerHTML = ORDEN.map(c => { const it = A.filter(a => a.carpeta === c); return '<a class="opt" style="text-decoration:none" href="#/elegir" data-c="'+c+'"><span class="ic">'+ICON[c]+'</span><b>'+it[0].area+'</b><small>'+DESC[c]+' · '+it.length+' algoritmos</small></a>'; }).join('');
  main.querySelectorAll('#temas [data-c]').forEach(b => b.onclick = () => { elegido = [b.dataset.c]; });
}

// ---------- Elegir algoritmo (carpetas del repositorio) ----------
const ICON = {'DP':'🧩','Data Structures':'🗂️','Graphs':'🕸️','Strings':'🔤','Geometry':'📐','FunctionalTools':'🧰'};
const DESC = {'DP':'Programación dinámica: dividir un problema en subproblemas y reutilizar respuestas.','Data Structures':'Estructuras de datos: guardar información para consultarla y cambiarla rápido.','Graphs':'Grafos: ciudades, rutas, redes y árboles.','Strings':'Cadenas: buscar y comparar textos.','Geometry':'Geometría: puntos, polígonos y vectores.','FunctionalTools':'Herramientas: búsqueda binaria, primos y matemáticas.'};
function tarjeta(id){
  const a = byId[id], c = K[id] || {};
  return '<a class="opt" style="text-decoration:none" href="#/'+id+'">'+lvl(c.nivel||1)+(DEMOS[id]?' <small>▶ con demo</small>':'')+'<b style="margin-top:8px">'+esc(a.nombre)+'</b><small>'+esc(c.idea||a.algoritmo)+'</small></a>';
}
let elegido = [];  // [carpeta, subcarpeta]
window.__reset = () => { elegido = []; };
function elegir(){
  const [c, sub] = elegido;
  let h = '<h1>Elige un algoritmo</h1><p class="note">Las opciones siguen las carpetas del repositorio.</p>';
  const ruta = ['Repositorio'].concat(elegido);
  h += '<div class="wiz-path">' + ruta.map((p,i) => i < ruta.length-1 ? '<button data-i="'+i+'">'+esc(p)+'</button> ›' : '<span>'+esc(p)+'</span>').join(' ') + '</div>';
  if (!c) {
    h += '<h2>¿Qué carpeta quieres explorar?</h2><div class="opts">' + ORDEN.map((x,i) => '<button class="opt" data-c="'+x+'" style="animation-delay:'+i*40+'ms"><span class="ic">'+ICON[x]+'</span><b>'+x+'</b><small>'+DESC[x]+' · '+A.filter(a=>a.carpeta===x).length+' algoritmos</small></button>').join('') + '</div>';
  } else {
    const items = A.filter(a => a.carpeta === c);
    const subs = [...new Set(items.map(a => a.sub))];
    if (subs.length > 1 && !sub) {
      h += '<h2>'+esc(c)+'</h2><p>'+esc(DESC[c])+'</p><div class="opts">' + subs.map((x,i) => { const n = items.filter(a=>a.sub===x); return '<button class="opt" data-s="'+esc(x)+'" style="animation-delay:'+i*40+'ms"><span class="ic">📁</span><b>'+esc(x.split('/').pop())+'</b><small>'+n.map(a=>esc(a.nombre)).join(', ')+'</small></button>'; }).join('') + '</div>';
    } else {
      const lista = items.filter(a => !sub || a.sub === sub).sort((x,y) => ((K[x.id]||{}).nivel||1) - ((K[y.id]||{}).nivel||1));
      h += '<h2>'+esc(sub ? sub.split('/').pop() : c)+'</h2><p class="note">Ordenados de básico a avanzado.</p><div class="opts">' + lista.map(a => tarjeta(a.id)).join('') + '</div>';
    }
  }
  main.innerHTML = h;
  main.querySelectorAll('[data-c]').forEach(b => b.onclick = () => { elegido = [b.dataset.c]; elegir(); });
  main.querySelectorAll('[data-s]').forEach(b => b.onclick = () => { elegido = [c, b.dataset.s]; elegir(); });
  main.querySelectorAll('[data-i]').forEach(b => b.onclick = () => { elegido = elegido.slice(0, +b.dataset.i); elegir(); });
}

// ---------- Ruta de estudio ----------
function ruta(){
  let h = '<h1>Ruta de estudio</h1><p class="note">Empieza por la columna de la izquierda. Cada algoritmo usa ideas de los anteriores.</p><div class="lvlcol">';
  for (const n of [1,2,3]) {
    h += '<div class="box"><h3>'+lvl(n)+'</h3>';
    for (const c of ORDEN) { const it = A.filter(a => a.carpeta === c && (K[a.id]||{}).nivel === n); if (!it.length) continue;
      h += '<h5 style="margin:12px 0 2px;color:var(--mut)">'+c+'</h5>' + it.map(a => '<a href="#/'+a.id+'">'+(DEMOS[a.id]?'▶ ':'')+esc(a.nombre)+'</a>').join(''); }
    h += '</div>';
  }
  main.innerHTML = h + '</div>';
}

// ---------- Página de cada algoritmo ----------
function pagina(a){
  const c = K[a.id] || {}, dem = DEMOS[a.id];
  const mismo = A.filter(x => x.carpeta === a.carpeta), i = mismo.indexOf(a), prev = mismo[i-1], next = mismo[i+1];
  let h = '<div class="crumb">'+esc(a.area)+(a.sub !== '-' ? ' › '+esc(a.sub) : '')+'</div><h1>'+esc(a.nombre)+'</h1><p>'+lvl(c.nivel||1)+' <span class="note">'+esc(a.algoritmo)+'</span></p>';
  if (c.idea) h += '<div class="idea">'+esc(c.idea)+'</div>';
  if (c.texto) h += '<h2>¿Cómo funciona?</h2><p>'+esc(c.texto)+'</p>';
  if (dem) h += '<h2>Míralo en acción</h2><div id="demo"></div>';
  if (c.pasos) h += '<h2>Paso a paso</h2><ol class="steps">'+c.pasos.map(p => '<li>'+esc(p)+'</li>').join('')+'</ol>';
  if (c.cuando) h += '<div class="when"><b>¿Cuándo usarlo?</b> '+esc(c.cuando)+'</div>';
  h += '<div class="meta"><div><b>Complejidad</b>'+esc(a.complejidad)+'</div>';
  h += '<div><b>Pruébalo</b>'+(a.cses ? '<a href="'+a.cses+'" target="_blank" rel="noopener">'+esc(a.problema.replace(/\s*\(https?:[^)]*\)/,''))+'</a>' : esc(a.problema))+'</div>';
  h += '<div><b>Entrada</b>'+esc(a.entrada)+'</div><div><b>Salida</b>'+esc(a.salida)+'</div></div>';
  h += '<details class="code"><summary>Ver el código en C++</summary><div class="row"><button class="btn" id="copiar">Copiar código</button><a class="btn" style="text-decoration:none" href="https://github.com/SemilleroSemicirculo/CompetitiveProgramming/blob/main/'+encodeURI(a.archivo)+'" target="_blank" rel="noopener">Ver en GitHub</a></div><pre><code>'+resaltar(a.codigo)+'</code></pre></details>';
  h += '<div class="pn">'+(prev ? '<a href="#/'+prev.id+'"><small>← Anterior</small>'+esc(prev.nombre)+'</a>' : '<span></span>')+(next ? '<a class="nx" href="#/'+next.id+'"><small>Siguiente →</small>'+esc(next.nombre)+'</a>' : '<span></span>')+'</div>';
  main.innerHTML = h;
  document.getElementById('copiar').onclick = e => { try { navigator.clipboard.writeText(a.codigo).catch(() => {}); } catch (_) {} e.target.textContent = '¡Copiado!'; setTimeout(() => e.target.textContent = 'Copiar código', 1500); };
  if (dem) dem(document.getElementById('demo'));
}

// ---------- Rutas ----------
function router(){
  timers.forEach(clearInterval); timers = [];
  const id = location.hash.slice(2), a = byId[id];
  document.body.classList.toggle('alg', !!a);
  if (a) pagina(a); else if (id === 'elegir') elegir(); else if (id === 'ruta') ruta(); else inicio();
  marcar(); window.scrollTo && window.scrollTo(0, 0); nav.classList.remove('open');
}
document.getElementById('buscar').oninput = e => { menu(e.target.value); if (e.target.value) { document.body.classList.add('alg'); nav.classList.add('open'); } };
document.getElementById('menu').onclick = () => { nav.classList.toggle('open'); document.body.classList.add('alg'); };
window.addEventListener('hashchange', router);
menu(); router();
})();
