(function(){
const A = window.ALGORITMOS, K = window.CONTENIDO || {}, DEMOS = window.DEMOS || {};
const nav = document.getElementById('nav'), main = document.getElementById('main');
// ---------- Organización por técnica (secciones.js) ----------
const SEC = window.SECCIONES || {}, CARP = window.CARPETAS || {}, VISTA = window.NOMBRE_VISTA || {};
const cn = c => CARP[c] || c;
{ const pos = {}; let k = 0;
  for (const c of Object.keys(SEC)) for (const g of SEC[c]) for (const id of g.ids) pos[id] = [k++, g];
  for (const a of A) { const p = pos[a.id]; if (p) { a.sub = p[1].t; a.subDesc = p[1].d; } if (VISTA[a.id]) a.nombre = VISTA[a.id]; }
  A.sort((x, y) => ((pos[x.id] || [1e9])[0]) - ((pos[y.id] || [1e9])[0])); }
const byId = Object.fromEntries(A.map(a => [a.id, a]));
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const NIV = {1:'Básico', 2:'Intermedio', 3:'Avanzado', 4:'Finales mundiales'};
const lvl = n => '<span class="lvl lvl'+n+'">'+NIV[n]+'</span>';
const fmt = x => x >= 1e15 ? '10^' + Math.round(Math.log10(x)) : x >= 1e6 ? (x/1e6).toFixed(x >= 1e8 ? 0 : 1).replace('.0','') + ' millones' : Math.round(x).toLocaleString('es');
// ---------- Modo libre / modo libro ----------
let modo = 'libre';
try { if (localStorage.getItem('modo') === 'libro') modo = 'libro'; } catch (_) {}
const CAPS = [], LEC = [], capDe = {};
(window.LIBRO || []).forEach(p => p.caps.forEach(c => { const num = CAPS.length + 1; CAPS.push(Object.assign({ num, parte: p.parte }, c)); c.algs.forEach((id, k) => { capDe[id] = { num, k }; LEC.push(id); }); }));
let hechos = new Set();
try { hechos = new Set(JSON.parse(localStorage.getItem('hechos') || '[]')); } catch (_) {}
const guardarHechos = () => { try { localStorage.setItem('hechos', JSON.stringify([...hechos])); } catch (_) {} };
// marcado sencillo del libro: `código` y **negrita**
const md = t => esc(t).replace(/`([^`]+)`/g, '<code class="ic">$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
let timers = [];
const later = (f, ms) => timers.push(setInterval(f, ms));

// ---------- Resaltado de C++ ----------
const KW = new Set('if else for while do return break continue struct class const static void int long double bool char auto using namespace typedef template typename public private new delete switch case true false operator define include'.split(' '));
const TY = new Set('vector map set queue stack deque priority_queue pair tuple array string ll ld cin cout sort unique min max abs swap'.split(' '));
const KWP = new Set('def class return if elif else for while in not and or is import from as with try except finally raise pass break continue lambda yield global nonlocal None True False'.split(' '));
const TYP = new Set('int float str list dict set tuple range len print input map min max sum sorted enumerate zip abs sys deque heapq bisect math'.split(' '));
function resaltarPy(src){
  const re = /("{3}[\s\S]*?"{3}|#[^\n]*)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|\b(\d+\.?\d*)\b|\b([A-Za-z_]\w*)\b/g;
  let out = '', last = 0, m;
  while ((m = re.exec(src))) {
    out += esc(src.slice(last, m.index)); last = re.lastIndex;
    if (m[1]) out += '<span class="c">'+esc(m[1])+'</span>';
    else if (m[2]) out += '<span class="s">'+esc(m[2])+'</span>';
    else if (m[3]) out += '<span class="n">'+m[3]+'</span>';
    else if (KWP.has(m[4])) out += '<span class="k">'+m[4]+'</span>';
    else if (TYP.has(m[4])) out += '<span class="t">'+m[4]+'</span>';
    else out += m[4];
  }
  return out + esc(src.slice(last));
}
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
const ORDEN = Object.keys(CARP).length ? Object.keys(CARP) : ['DP','Data Structures','FunctionalTools','Geometry','Graphs','Strings'];
function menu(filtro){
  if (modo === 'libro') return menuLibro();
  const f = (filtro || '').toLowerCase(); let h = '';
  for (const c of ORDEN) {
    const items = A.filter(a => a.carpeta === c && (!f || (a.nombre+' '+a.algoritmo+' '+((K[a.id]||{}).idea||'')).toLowerCase().includes(f)));
    if (!items.length) continue;
    h += '<h4>'+esc(cn(c))+'</h4>'; let sub = '';
    for (const a of items) {
      if (a.sub !== sub) { sub = a.sub; if (sub !== '-') h += '<h5 title="'+esc(a.subDesc||'')+'">'+esc(sub)+'</h5>'; }
      const n = (K[a.id]||{}).nivel || 1;
      h += '<a href="#/'+a.id+'" data-id="'+a.id+'"><span class="dot lvl'+n+'"></span>'+esc(a.nombre)+'</a>';
    }
  }
  nav.innerHTML = h || '<p class="note">Sin resultados.</p>';
  marcar();
}
function menuLibro(){
  let h = '', parte = '';
  for (const c of CAPS) {
    if (c.parte !== parte) { parte = c.parte; h += '<h4>'+esc(parte)+'</h4>'; }
    const ok = c.algs.length && c.algs.every(id => hechos.has(id));
    h += '<a href="#/libro/'+c.num+'" data-id="libro/'+c.num+'"><b>'+c.num+'.</b> '+esc(c.t)+(ok ? ' ✓' : '')+'</a>';
    for (const id of c.algs) h += '<a href="#/'+id+'" data-id="'+id+'" style="padding-left:24px;font-size:13px">'+(hechos.has(id) ? '✓ ' : '· ')+esc(byId[id].nombre)+'</a>';
  }
  nav.innerHTML = h; marcar();
}
function marcar(){
  const id = location.hash.slice(2);
  nav.querySelectorAll('a').forEach(a => a.classList.toggle('on', a.dataset.id === id));
  const top = byId[id] ? '#/elegir' : '#/'+id;
  document.querySelectorAll('header nav.top a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === top));
}

// ---------- Portada ----------
function inicio(){
  main.innerHTML = `
  <div class="hero">
    <img class="hero-logo" src="img/logo.png" alt="Logo del Semillero Semicírculo">
    <p class="kicker">Semillero Semicírculo</p>
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
        <p>Cada código se probó contra una fuerza bruta en cientos de casos al azar (el script está en la carpeta <code>tests/</code> del repositorio) y, cuando existe, contra un juez en línea: CSES, Codeforces, Library Checker, Kattis, SPOJ u otros. Cada lección dice de qué juez es su problema. Para practicar, mira la sección Practicar.</p></div>
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
    <p class="note">Regla práctica: un computador hace unos <b>100 millones</b> (10⁸) de operaciones sencillas por segundo. La fuerza bruta prueba todos los pares (unos n²/2 operaciones: orden n²); <a href="#/DP-Algorithms-Kadane1D">Kadane</a> recorre el arreglo una vez (n operaciones).</p>
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

  document.getElementById('temas').innerHTML = ORDEN.map(c => { const it = A.filter(a => a.carpeta === c); return '<a class="opt" style="text-decoration:none" href="#/elegir" data-c="'+c+'"><span class="ic">'+ICON[c]+'</span><b>'+esc(cn(c))+'</b><small>'+DESC[c]+' · '+it.length+' lecciones</small></a>'; }).join('');
  main.querySelectorAll('#temas [data-c]').forEach(b => b.onclick = () => { elegido = [b.dataset.c]; });
}

// ---------- Elegir algoritmo (carpetas del repositorio) ----------
const ICON = {'DP':'🧩','Data Structures':'🗂️','Graphs':'🕸️','Strings':'🔤','Geometry':'📐','FunctionalTools':'🧰','Probability':'🎲'};
const DESC = {'DP':'Programación dinámica: dividir un problema en subproblemas y reutilizar respuestas.','Data Structures':'Estructuras de datos: guardar información para consultarla y cambiarla rápido.','Graphs':'Grafos: ciudades, rutas, redes y árboles.','Strings':'Cadenas: buscar y comparar textos.','Geometry':'Geometría: puntos, polígonos y vectores.','FunctionalTools':'Herramientas: búsqueda binaria, primos y matemáticas.','Probability':'Probabilidad: valor esperado, procesos aleatorios y respuestas módulo un primo.'};
function tarjeta(id){
  const a = byId[id], c = K[id] || {};
  return '<a class="opt" style="text-decoration:none" href="#/'+id+'">'+lvl(c.nivel||1)+(DEMOS[id]?' <small>con demo</small>':'')+'<b style="margin-top:8px">'+esc(a.nombre)+'</b><small>'+esc(c.idea||a.algoritmo)+'</small></a>';
}
let elegido = [];  // [carpeta, subcarpeta]
window.__reset = () => { elegido = []; };
function elegir(){
  const [c, sub] = elegido;
  let h = '<h1>Elige un algoritmo</h1><p class="note">Organizado por tema y por técnica, de lo básico a lo avanzado.</p>';
  const ruta = ['Temas'].concat(elegido.map((x, i) => i === 0 ? cn(x) : x));
  h += '<div class="wiz-path">' + ruta.map((p,i) => i < ruta.length-1 ? '<button data-i="'+i+'">'+esc(p)+'</button> ›' : '<span>'+esc(p)+'</span>').join(' ') + '</div>';
  if (!c) {
    h += '<h2>¿Qué carpeta quieres explorar?</h2><div class="opts">' + ORDEN.map((x,i) => '<button class="opt" data-c="'+x+'" style="animation-delay:'+i*40+'ms"><span class="ic">'+ICON[x]+'</span><b>'+esc(cn(x))+'</b><small>'+DESC[x]+' · '+A.filter(a=>a.carpeta===x).length+' lecciones</small></button>').join('') + '</div>';
  } else {
    const items = A.filter(a => a.carpeta === c);
    const subs = [...new Set(items.map(a => a.sub))];
    if (subs.length > 1 && !sub) {
      h += '<h2>'+esc(cn(c))+'</h2><p>'+esc(DESC[c])+'</p><div class="opts">' + subs.map((x,i) => { const n = items.filter(a=>a.sub===x); return '<button class="opt" data-s="'+esc(x)+'" style="animation-delay:'+i*40+'ms"><span class="ic">📁</span><b>'+esc(x)+'</b><small>'+esc(n[0].subDesc ? n[0].subDesc + ' ' : '')+n.length+(n.length === 1 ? ' lección: ' : ' lecciones: ')+n.map(a=>esc(a.nombre)).join(', ')+'</small></button>'; }).join('') + '</div>';
    } else {
      const lista = items.filter(a => !sub || a.sub === sub).sort((x,y) => ((K[x.id]||{}).nivel||1) - ((K[y.id]||{}).nivel||1));
      h += '<h2>'+esc(sub || cn(c))+'</h2><p class="note">Ordenados de básico a avanzado.</p><div class="opts">' + lista.map(a => tarjeta(a.id)).join('') + '</div>';
    }
  }
  main.innerHTML = h;
  main.querySelectorAll('[data-c]').forEach(b => b.onclick = () => { elegido = [b.dataset.c]; elegir(); });
  main.querySelectorAll('[data-s]').forEach(b => b.onclick = () => { elegido = [c, b.dataset.s]; elegir(); });
  main.querySelectorAll('[data-i]').forEach(b => b.onclick = () => { elegido = elegido.slice(0, +b.dataset.i); elegir(); });
}

// ---------- Ruta de estudio ----------
function ruta(){
  let h = '<h1>Ruta de estudio</h1><p class="note">Empieza por el nivel Básico y avanza hacia Finales mundiales. Cada algoritmo usa ideas de los anteriores. Si prefieres un orden con clases y preguntas, usa el <a href="#/libro">modo libro</a>.</p><div class="lvlcol c4">';
  for (const n of [1,2,3,4]) {
    h += '<div class="box"><h3>'+lvl(n)+'</h3>';
    let cuantos = 0;
    for (const c of ORDEN) { const it = A.filter(a => a.carpeta === c && (K[a.id]||{}).nivel === n); if (!it.length) continue; cuantos += it.length;
      h += '<h5 style="margin:12px 0 2px;color:var(--mut)">'+esc(cn(c))+'</h5>' + it.map(a => '<a href="#/'+a.id+'">'+(hechos.has(a.id) ? '✓ ' : '')+esc(a.nombre)+'</a>').join(''); }
    if (!cuantos) h += '<p class="note">Todavía no hay lecciones en este nivel.</p>';
    h += '</div>';
  }
  main.innerHTML = h + '</div>';
}

// ---------- Teoría por carpeta ----------
let teoCarpeta = 'Graphs';
const TEO_NOMBRE = {'FunctionalTools': 'Matemáticas y teoría de números'};
const TEO_DESC = {'FunctionalTools': 'Teoría de números y la matemática que se usa en todo lo demás: primos, divisibilidad, congruencias, combinatoria y álgebra.'};
const teoNombre = c => cn(c);
function teoria(){
  const T = window.TEORIA || {};
  let h = '<h1>Teoría</h1><p class="note">Los teoremas y resultados que más se usan en cada tema, desde lo básico hasta lo que aparece en la Maratón Nacional ACIS y en las finales mundiales del ICPC.</p>';
  h += '<div class="row">' + ORDEN.map(c => '<button class="btn lang'+(c===teoCarpeta?' on':'')+'" data-t="'+c+'">'+esc(teoNombre(c))+'</button>').join('') + '</div>';
  const items = (T[teoCarpeta] || []).slice().sort((a, b) => a.l - b.l);
  h += '<p>'+esc(TEO_DESC[teoCarpeta]||DESC[teoCarpeta]||'')+'</p>';
  h += items.map(t => '<div class="box" style="margin:12px 0"><h3>'+lvl(t.l)+' '+esc(t.n)+'</h3><p>'+esc(t.e)+'</p><p class="note"><b>Para qué sirve:</b> '+esc(t.u)+'</p></div>').join('');
  const algs = A.filter(a => a.carpeta === teoCarpeta);
  h += '<h3>Lecciones de este tema</h3><p>' + algs.map(a => '<a href="#/'+a.id+'">'+esc(a.nombre)+'</a>').join(' · ') + '</p>';
  main.innerHTML = h;
  main.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { teoCarpeta = b.dataset.t; teoria(); });
}
window.__teo = c => { teoCarpeta = c; };

// ---------- Practicar: problemas recomendados (sin resolver) ----------
let pracCarpeta = 'DP';
let resueltos = new Set();
try { resueltos = new Set(JSON.parse(localStorage.getItem('practica') || '[]')); } catch (_) {}
const guardarResueltos = () => { try { localStorage.setItem('practica', JSON.stringify([...resueltos])); } catch (_) {} };
function practicar(){
  const R = window.RECOMENDADOS || {}, T = R[pracCarpeta] || {};
  const BANDAS = [['facil', 'Sencillos', 1], ['medio', 'Medios', 2], ['dificil', 'Difíciles', 3], ['finales', 'Hacia las finales (2400–3000)', 4]];
  const key = x => x.j + ':' + x.id;
  let h = '<h1>Practicar</h1><p class="note">40 problemas recomendados por tema para resolver por tu cuenta: 10 sencillos, 10 medios, 10 difíciles y 10 de nivel finales (rating 2400–3000), de CSES y Codeforces. En «Regionales LatAm» están los regionales latinoamericanos completos. Ninguno está resuelto en esta guía. Marca los que vayas resolviendo; la marca se guarda en este navegador. En Codeforces se muestra la dificultad oficial (rating).</p>';
  h += '<div class="row">' + ORDEN.map(c => { const all = Object.values(R[c] || {}).flat(), n = all.filter(x => resueltos.has(key(x))).length;
    return '<button class="btn lang'+(c===pracCarpeta?' on':'')+'" data-p="'+c+'">'+esc(teoNombre(c))+' <small>'+n+'/'+all.length+'</small></button>'; }).join('') + (function () { const all = (window.REGIONALES || []).flatMap(r => r.probs), n = all.filter(x => resueltos.has(key(x))).length; return '<button class="btn lang'+(pracCarpeta==='REG'?' on':'')+'" data-p="REG">Regionales LatAm <small>'+n+'/'+all.length+'</small></button>'; })() + '</div>';
  const fila = x => '<label class="prac"><input type="checkbox" data-k="'+esc(key(x))+'"'+(resueltos.has(key(x)) ? ' checked' : '')+'> <a href="'+esc(x.u)+'" target="_blank" rel="noopener">'+esc(x.n)+'</a> <small>'+(x.j === 'CSES' ? 'CSES '+esc(x.id) : x.j === 'Gym' ? esc(x.id.slice(-1))+' · '+x.x+' equipos' : 'CF '+esc(x.id)+' · '+x.r)+'</small></label>';
  if (pracCarpeta === 'REG') {
    h += '<p class="note">Regionales latinoamericanos del ICPC en el gym de Codeforces. Cada lista está ordenada de más a menos resuelto en el gym, que es una buena guía de dificultad. Lo ideal es hacerlos como contest virtual de 5 horas, en equipo y con el notebook.</p><div class="lvlcol">' + (window.REGIONALES || []).map(r => '<div class="box"><h3><a href="https://codeforces.com/gym/'+r.id+'" target="_blank" rel="noopener">'+esc(r.t)+'</a></h3>'+r.probs.map(fila).join('')+'</div>').join('') + '</div>';
  } else
  h += '<div class="lvlcol c4">' + BANDAS.map(([b, t, n]) => '<div class="box"><h3>'+lvl(n).replace(NIV[n], t)+'</h3>' + (T[b] || []).map(fila).join('') + '</div>').join('') + '</div>';
  h += '<p class="note" style="margin-top:16px">Antes de los difíciles, repasa los problemas clásicos resueltos de esta carpeta en <a href="#/elegir" onclick="window.__reset&&window.__reset()">Elegir algoritmo</a>.</p>';
  main.innerHTML = h;
  main.querySelectorAll('[data-p]').forEach(b => b.onclick = () => { pracCarpeta = b.dataset.p; practicar(); });
  main.querySelectorAll('[data-k]').forEach(c => c.onchange = () => { c.checked ? resueltos.add(c.dataset.k) : resueltos.delete(c.dataset.k); guardarResueltos(); practicar(); });
}

// ---------- Libro ----------
function progreso(){ const n = LEC.filter(id => hechos.has(id)).length; return '<div class="prog"><div style="width:'+(100 * n / LEC.length).toFixed(1)+'%"></div></div><p class="note">'+n+' de '+LEC.length+' lecciones estudiadas.</p>'; }
function libroIndice(){
  let h = '<h1>El libro</h1><p class="lead" style="color:var(--mut);font-size:18px;max-width:720px">Un curso completo de algoritmos y optimización, en el orden en que se enseñaría en clase. Solo se supone que sabes lo básico de Python: variables, listas, ciclos y funciones. Cada capítulo empieza con una clase y sigue con lecciones, cada una con su visualización y su código verificado.</p>' + progreso();
  const sig = LEC.find(id => !hechos.has(id));
  h += '<div class="cta">'+(sig ? '<a class="p" href="#/'+(hechos.size ? sig : 'libro/1')+'">'+(hechos.size ? 'Continuar donde ibas →' : 'Empezar el capítulo 1 →')+'</a>' : '<a class="p" href="#/libro/1">Repasar desde el inicio</a>')+'</div>';
  let parte = '';
  for (const c of CAPS) {
    if (c.parte !== parte) { if (parte) h += '</div>'; parte = c.parte; h += '<h2 style="margin-top:28px">'+esc(parte)+'</h2><div class="grid-home">'; }
    const n = c.algs.filter(id => hechos.has(id)).length;
    h += '<a class="card" href="#/libro/'+c.num+'"><small>Capítulo '+c.num+'</small><b style="display:block;margin:4px 0">'+esc(c.t)+'</b><small>'+(c.algs.length ? n+' / '+c.algs.length+' lecciones' : 'Solo clase')+'</small></a>';
  }
  main.innerHTML = h + '</div>';
}
function bloque(b){
  if (typeof b === 'string') return '<p>'+md(b)+'</p>';
  if (b.h) return '<h3>'+esc(b.h)+'</h3>';
  if (b.py) return '<pre><code>'+resaltarPy(b.py)+'</code></pre>';
  if (b.nota) return '<div class="when">'+md(b.nota)+'</div>';
  return '';
}
function capitulo(num){
  const c = CAPS[num - 1]; if (!c) return libroIndice();
  const T = window.TEORIA || {};
  let h = '<div class="crumb"><a href="#/libro">El libro</a> › '+esc(c.parte)+'</div><h1>Capítulo '+c.num+'. '+esc(c.t)+'</h1>';
  h += '<div class="box"><h3>Al terminar este capítulo vas a saber</h3><ul>'+c.obj.map(o => '<li>'+md(o)+'</li>').join('')+'</ul></div>';
  h += '<h2>La clase</h2><div class="clase">'+c.clase.map(bloque).join('')+'</div>';
  if (c.algs.length) h += '<h2>Lecciones</h2><ol class="lecs">'+c.algs.map(id => { const a = byId[id], k = K[id] || {}; return '<li><a href="#/'+id+'">'+(hechos.has(id) ? '✓ ' : '')+'<b>'+esc(a.nombre)+'</b></a> <span class="note">'+esc(k.idea || a.algoritmo)+'</span></li>'; }).join('')+'</ol>';
  const teo = c.teo.map(([f, n]) => (T[f] || []).find(t => t.n === n)).filter(Boolean);
  if (teo.length) h += '<h2>Teoremas del capítulo</h2>'+teo.map(t => '<div class="box" style="margin:10px 0"><h3>'+lvl(t.l)+' '+esc(t.n)+'</h3><p>'+esc(t.e)+'</p><p class="note"><b>Para qué sirve:</b> '+esc(t.u)+'</p></div>').join('');
  h += '<h2>Preguntas para pensar</h2><p class="note">Intenta responder antes de abrir la respuesta.</p>'+c.preguntas.map(q => '<details class="preg"><summary>'+md(q.q)+'</summary><p>'+md(q.a)+'</p></details>').join('');
  h += '<div class="idea">'+md(c.cierre)+'</div>';
  const prev = CAPS[num - 2], next = c.algs.length ? null : CAPS[num];
  h += '<div class="pn">'+(prev ? '<a href="#/libro/'+prev.num+'"><small>← Capítulo anterior</small>'+esc(prev.t)+'</a>' : '<a href="#/libro"><small>←</small>Índice del libro</a>')
     + (c.algs.length ? '<a class="nx" href="#/'+c.algs[0]+'"><small>Primera lección →</small>'+esc(byId[c.algs[0]].nombre)+'</a>' : next ? '<a class="nx" href="#/libro/'+next.num+'"><small>Siguiente capítulo →</small>'+esc(next.t)+'</a>' : '<span></span>')+'</div>';
  main.innerHTML = h;
}

// ---------- Página de cada algoritmo ----------
function pagina(a){
  const c = K[a.id] || {}, dem = DEMOS[a.id];
  const mismo = A.filter(x => x.carpeta === a.carpeta), i = mismo.indexOf(a), prev = mismo[i-1], next = mismo[i+1];
  const L = modo === 'libro' && capDe[a.id], cap = L && CAPS[L.num - 1];
  let h = L ? '<div class="crumb"><a href="#/libro">El libro</a> › <a href="#/libro/'+cap.num+'">Capítulo '+cap.num+'. '+esc(cap.t)+'</a> › Lección '+(L.k + 1)+' de '+cap.algs.length+'</div><h1>'
            : '<div class="crumb">'+esc(cn(a.carpeta))+(a.sub !== '-' ? ' › '+esc(a.sub) : '')+'</div><h1>'+esc(a.nombre)+'</h1><p>'+lvl(c.nivel||1)+' <span class="note">'+esc(a.algoritmo)+'</span></p>';
  if (c.idea) h += '<div class="idea">'+esc(c.idea)+'</div>';
  if (c.texto) h += '<h2>¿Cómo funciona?</h2><p>'+esc(c.texto)+'</p>';
  if (dem) h += '<h2>Míralo en acción</h2><div id="demo"></div>';
  if (c.pasos) h += '<h2>Paso a paso</h2><ol class="steps">'+c.pasos.map(p => '<li>'+esc(p)+'</li>').join('')+'</ol>';
  if (c.cuando) h += '<div class="when"><b>¿Cuándo usarlo?</b> '+esc(c.cuando)+'</div>';
  if (c.pq) h += '<h2>¿Por qué funciona?</h2><p>'+esc(c.pq)+'</p>';
  if (c.err) h += '<h2>Errores típicos</h2><ul class="errs">'+c.err.map(e => '<li>'+esc(e)+'</li>').join('')+'</ul>';
  if (!L) h += '<p><a href="#/teoria" onclick="window.__teo(\''+a.carpeta+'\')">Ver los teoremas de '+esc(teoNombre(a.carpeta))+' →</a></p>';
  h += '<div class="meta"><div><b>Complejidad</b>'+esc(a.complejidad)+'</div>';
  h += '<div><b>Pruébalo</b>'+(a.cses ? '<a href="'+a.cses+'" target="_blank" rel="noopener">'+esc(a.problema.replace(/\s*\(https?:[^)]*\)/,''))+'</a>' : esc(a.problema))+'</div>';
  h += '<div><b>Entrada</b>'+esc(a.entrada)+'</div><div><b>Salida</b>'+esc(a.salida)+'</div></div>';
  const gh = 'https://github.com/SemilleroSemicirculo/CompetitiveProgramming/blob/main/';
  h += '<details class="code" open><summary>Ver el código</summary><div class="row"><button class="btn lang on" data-l="cpp">C++</button>'+(a.python?'<button class="btn lang" data-l="py">Python</button>':'')+'<span style="flex:1"></span><button class="btn" id="copiar">Copiar código</button><a class="btn" id="gh" style="text-decoration:none" href="'+gh+encodeURI(a.archivo)+'" target="_blank" rel="noopener">Ver en GitHub</a></div><p class="note" id="aviso" style="display:none">⚠️ Esta versión en Python da respuestas correctas, pero es demasiado lenta para el límite de tiempo del juez. En competencia usa la versión en C++.</p><pre><code id="src">'+resaltar(a.codigo)+'</code></pre></details>';
  if (L) {
    const pid = cap.algs[L.k - 1], nid = cap.algs[L.k + 1], ncap = CAPS[cap.num];
    h += '<div class="row" style="margin-top:24px"><button class="btn" id="hecho"></button></div>';
    h += '<div class="pn">'+(pid ? '<a href="#/'+pid+'"><small>← Lección anterior</small>'+esc(byId[pid].nombre)+'</a>' : '<a href="#/libro/'+cap.num+'"><small>← Volver a la clase</small>Capítulo '+cap.num+'</a>')
       + (nid ? '<a class="nx" href="#/'+nid+'"><small>Siguiente lección →</small>'+esc(byId[nid].nombre)+'</a>' : ncap ? '<a class="nx" href="#/libro/'+ncap.num+'"><small>Siguiente capítulo →</small>'+ncap.num+'. '+esc(ncap.t)+'</a>' : '<a class="nx" href="#/libro"><small>Fin del libro →</small>Índice</a>')+'</div>';
  } else h += (capDe[a.id] ? '<div class="row" style="margin-top:24px"><button class="btn" id="hecho"></button><span class="note">Capítulo '+capDe[a.id].num+' del libro: <a href="#/libro/'+capDe[a.id].num+'">'+esc(CAPS[capDe[a.id].num - 1].t)+'</a></span></div>' : '') + '<div class="pn">'+(prev ? '<a href="#/'+prev.id+'"><small>← Anterior</small>'+esc(prev.nombre)+'</a>' : '<span></span>')+(next ? '<a class="nx" href="#/'+next.id+'"><small>Siguiente →</small>'+esc(next.nombre)+'</a>' : '<span></span>')+'</div>';
  main.innerHTML = h;
  let lang = 'cpp';
  try { if (localStorage.getItem('lang') === 'py' && a.python) lang = 'py'; } catch (_) {}
  if (L && a.python) lang = 'py';
  const pintar = () => {
    document.getElementById('src').innerHTML = lang === 'py' ? resaltarPy(a.python) : resaltar(a.codigo);
    document.getElementById('aviso').style.display = (lang === 'py' && a.py_lento) ? 'block' : 'none';
    document.getElementById('gh').href = gh + encodeURI(lang === 'py' ? a.archivo.replace(/\.cpp$/, '.py') : a.archivo);
    main.querySelectorAll('.lang').forEach(b => b.classList.toggle('on', b.dataset.l === lang));
  };
  main.querySelectorAll('.lang').forEach(b => b.onclick = () => { lang = b.dataset.l; try { localStorage.setItem('lang', lang); } catch (_) {} pintar(); });
  pintar();
  document.getElementById('copiar').onclick = e => { try { navigator.clipboard.writeText(lang === 'py' ? a.python : a.codigo).catch(() => {}); } catch (_) {} e.target.textContent = '¡Copiado!'; setTimeout(() => e.target.textContent = 'Copiar código', 1500); };
  if (dem) dem(document.getElementById('demo'));
  const hb = document.getElementById('hecho');
  if (hb) { const pon = () => hb.textContent = hechos.has(a.id) ? '✓ Lección estudiada (quitar marca)' : 'Marcar como estudiada'; pon();
    hb.onclick = () => { hechos.has(a.id) ? hechos.delete(a.id) : hechos.add(a.id); guardarHechos(); pon(); menu(); }; }
}

// ---------- Rutas ----------
function router(){
  timers.forEach(clearInterval); timers = [];
  const id = location.hash.slice(2), a = byId[id];
  document.body.classList.toggle('alg', !!a);
  if (id.startsWith('libro') && modo !== 'libro') { ponerModo('libro'); menu(); }
  document.body.classList.toggle('libro', modo === 'libro');
  if (modo === 'libro' && !a && !id.startsWith('libro') && !['practicar', 'teoria', 'ruta', 'elegir'].includes(id)) { location.replace('#/libro'); return; }
  if (modo === 'libro' && (a || id.startsWith('libro'))) document.body.classList.add('alg');
  if (a) pagina(a); else if (id === 'libro') libroIndice(); else if (id.startsWith('libro/')) capitulo(+id.slice(6)); else if (id === 'elegir') elegir(); else if (id === 'ruta') ruta(); else if (id === 'teoria') teoria(); else if (id === 'practicar') practicar(); else inicio();
  marcar(); window.scrollTo && window.scrollTo(0, 0); nav.classList.remove('open');
}
document.getElementById('buscar').oninput = e => { menu(e.target.value); if (e.target.value) { document.body.classList.add('alg'); nav.classList.add('open'); } };
document.getElementById('menu').onclick = () => { nav.classList.toggle('open'); document.body.classList.add('alg'); };
window.addEventListener('hashchange', router);
// botón de modo claro / oscuro (se recuerda en el navegador)
const tema = document.getElementById('tema');
const ponerTema = t => { document.documentElement.dataset.theme = t; tema.textContent = t === 'dark' ? '☀️' : '🌙'; };
ponerTema(document.documentElement.dataset.theme || 'light');
tema.onclick = () => { const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; ponerTema(t); try { localStorage.setItem('tema', t); } catch (_) {} };
// botón de modo libre / modo libro (se recuerda en el navegador)
const ponerModo = m => { modo = m; try { localStorage.setItem('modo', m); } catch (_) {} document.querySelectorAll('#modo button').forEach(b => b.classList.toggle('on', b.dataset.m === m)); };
document.querySelectorAll('#modo button').forEach(b => b.onclick = () => {
  if (b.dataset.m === modo) return; ponerModo(b.dataset.m); menu();
  const id = location.hash.slice(2);
  if (byId[id]) router(); else location.hash = modo === 'libro' ? '#/libro' : '#/';
});
ponerModo(modo);
// en el celular el selector de modo va al final de la fila de secciones; en pantallas grandes, a la derecha
const mq = matchMedia('(max-width:820px)'), modoEl = document.getElementById('modo');
const ubicarModo = () => { const dentro = false;
  const destino = dentro ? document.querySelector('header nav.top') : document.querySelector('header .tools');
  if (modoEl.parentNode !== destino) dentro ? destino.appendChild(modoEl) : destino.insertBefore(modoEl, destino.firstChild); };
mq.addEventListener ? mq.addEventListener('change', ubicarModo) : mq.addListener(ubicarModo);
document.querySelectorAll('#modo button').forEach(b => b.addEventListener('click', ubicarModo));
ubicarModo();
// atajo: «/» enfoca el buscador; Esc lo limpia
const buscar = document.getElementById('buscar');
document.addEventListener('keydown', e => {
  if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && getComputedStyle(buscar).display !== 'none' && buscar.offsetParent) { e.preventDefault(); buscar.focus(); }
  else if (e.key === 'Escape' && document.activeElement === buscar) { buscar.value = ''; buscar.dispatchEvent(new Event('input')); buscar.blur(); }
});
menu(); router();
})();
