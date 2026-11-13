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
const ORDEN = ['DP','Data Structures','Graphs','Strings','Geometry','FunctionalTools'];
function menu(filtro){
  const f = (filtro || '').toLowerCase(); let h = '';
  for (const c of ORDEN) {
    const items = A.filter(a => a.carpeta === c && (!f || (a.nombre+' '+a.algoritmo+' '+((K[a.id]||{}).idea||'')).toLowerCase().includes(f)));
    if (!items.length) continue;
    h += '<h4>'+items[0].area+'</h4>'; let sub = '';
    for (const a of items) {
      if (a.sub !== sub) { sub = a.sub; if (sub !== '-') h += '<h5>'+esc(sub)+'</h5>'; }
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
    <div class="cta"><a class="p" href="#/elegir">Ayúdame a elegir un algoritmo →</a><a class="s" href="#/ruta">Ver ruta de estudio</a></div>
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

  <section class="blk"><h2>Explora por tema</h2>
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

  const ICON = {'DP':'🧩','Data Structures':'🗂️','Graphs':'🕸️','Strings':'🔤','Geometry':'📐','FunctionalTools':'🧰'};
  const DESC = {'DP':'Dividir un problema en subproblemas y reutilizar respuestas.','Data Structures':'Guardar datos para consultarlos y cambiarlos rápido.','Graphs':'Ciudades, rutas, redes y árboles.','Strings':'Buscar y comparar textos.','Geometry':'Puntos, polígonos y vectores.','FunctionalTools':'Búsqueda binaria, primos y matemáticas.'};
  document.getElementById('temas').innerHTML = ORDEN.map(c => { const it = A.filter(a => a.carpeta === c); return '<a class="opt" style="text-decoration:none" href="#/'+it[0].id+'"><span class="ic">'+ICON[c]+'</span><b>'+it[0].area+'</b><small>'+DESC[c]+' · '+it.length+' algoritmos</small></a>'; }).join('');
}

// ---------- Asistente para elegir ----------
const L = (t, d, algs) => ({t, d, algs});
const ARBOL = {q:'¿Con qué trabaja tu problema?', opts:[
  {ic:'🔢', t:'Una lista de números', d:'Arreglos, secuencias, sumas…', next:{q:'¿Qué te piden?', opts:[
    L('La mayor suma de un tramo seguido','Ej.: mejor racha de ganancias',['DP-Algorithms-Kadane1D','DP-Algorithms-Kadane2D']),
    L('La subsecuencia creciente más larga','No tiene que ser seguida',['DP-Algorithms-LIS-II','DP-Algorithms-LIS-I']),
    L('Buscar un valor en datos ordenados','¿Existe? ¿En qué posición?',['FunctionalTools-Codes-BS','FunctionalTools-Codes-BS-library']),
    L('El menor valor que cumple una condición','«¿Alcanza con t?» y la respuesta es monótona',['FunctionalTools-Codes-BinarySearchAnswer','FunctionalTools-Codes-TS']),
    L('Dos elementos que sumen x','Pares con una condición',['Data-Structures-Algorithms-TwoPointers']),
    L('El mínimo de cada ventana de tamaño k','Ventana que se desliza',['Data-Structures-Algorithms-Deque']),
    L('El menor elemento más cercano','A la izquierda o derecha de cada uno',['Data-Structures-Algorithms-Stack']),
    L('Intervalos que se solapan','Llegadas y salidas, eventos',['Data-Structures-Algorithms-SweepLine','Data-Structures-Algorithms-Heap']),
    L('Las k mejores combinaciones','Un número de cada lista',['Data-Structures-Classic-Problems-K-Smallest-Sums']),
    L('Simular una fila con grupos','Cada grupo tiene su propia fila',['Data-Structures-Classic-Problems-Team-Queue'])]}},
  {ic:'📊', t:'Muchas preguntas sobre rangos', d:'Suma, mínimo… de a[l..r]', next:{q:'¿El arreglo cambia entre preguntas?', opts:[
    L('No cambia, pido mínimos','Respuesta instantánea',['Data-Structures-Algorithms-SparseTable']),
    L('Cambia un valor, pido sumas','Actualización puntual',['Data-Structures-Algorithms-FenwickTree']),
    L('Cambia un valor, pido mínimos','Actualización puntual',['Data-Structures-Algorithms-SegmentTreeMin']),
    L('Cambian rangos completos','Sumar o asignar a [l, r]',['Data-Structures-Algorithms-SegmentTree']),
    L('No cambia, pero la pregunta es rara','Ej.: cuántos valores distintos',['Data-Structures-Algorithms-MoAlgorithm'])]}},
  {ic:'🧩', t:'Optimizar o contar formas', d:'«el mínimo…», «¿de cuántas formas…?»', next:{q:'¿Cómo es el problema?', opts:[
    L('Formar un total con monedas','Mínimo de monedas o número de formas',['DP-Algorithms-CoinChange','DP-Algorithms-CoinCombinations']),
    L('Elegir objetos con un presupuesto','Cada objeto una vez',['DP-Algorithms-Knapsack']),
    L('Comparar dos textos o secuencias','Parecido, ediciones, parte común',['DP-Algorithms-EditDistance','DP-Algorithms-LCS']),
    L('Pocos elementos (n ≤ 20)','Importa qué subconjunto usaste',['DP-Algorithms-BitmaskDP']),
    L('Subconjuntos con n ≤ 40','Demasiados para probar todos',['FunctionalTools-Codes-MeetInTheMiddle']),
    L('Probabilidades por etapas','Series, juegos',['DP-Classic-Problems-Campeonato'])]}},
  {ic:'🕸️', t:'Ciudades, rutas o conexiones', d:'Nodos unidos por aristas', next:{q:'¿Qué necesitas?', opts:[
    {t:'El camino más corto', d:'Distancias', next:{q:'¿Cómo son las aristas?', opts:[
      L('Todas valen lo mismo','Laberintos, número de pasos',['Graphs-Algorithms-Graph-Traversal-BFS']),
      L('Pesos positivos','Kilómetros, tiempos',['Graphs-Algorithms-Graph-Traversal-Djikstra']),
      L('Puede haber pesos negativos','O detectar ciclos negativos',['Graphs-Algorithms-Graph-Traversal-BellmanFord']),
      L('Entre todos los pares','Grafo pequeño (n ≤ 500)',['Graphs-Algorithms-Graph-Traversal-FloydWarshall'])]}},
    L('Saber qué está conectado','Componentes, grupos',['Graphs-Algorithms-Graph-Traversal-DFS','Graphs-Algorithms-Graph-Traversal-DSU']),
    L('Conectar todo al menor costo','Árbol de expansión mínima',['Graphs-Algorithms-MST-Kruskal','Graphs-Algorithms-MST-Prim']),
    L('Ordenar tareas con requisitos','Una antes que otra',['Graphs-Algorithms-Graph-Traversal-TopologicalSort']),
    L('Encontrar un ciclo','Dirigido o no dirigido',['Graphs-Algorithms-Miscellaneous-CycleFindingUndirected','Graphs-Algorithms-Miscellaneous-CycleFindingDirected']),
    L('Dividir en dos grupos','Sin enemigos en el mismo equipo',['Graphs-Algorithms-Graph-Traversal-Bipartite']),
    L('Grupos donde todos llegan a todos','Grafos dirigidos',['Graphs-Algorithms-Graph-Traversal-Kosaraju','Graphs-Algorithms-Graph-Traversal-Tarjan']),
    L('Condiciones de sí/no de a pares','«a o b», «no a o c»…',['Graphs-Algorithms-Miscellaneous-2-SAT']),
    L('Usar cada arista una sola vez','Sin levantar el lápiz',['Graphs-Algorithms-Graph-Traversal-EulerianCycle','Graphs-Algorithms-Graph-Traversal-HierholzerDirected']),
    L('Enviar o asignar lo máximo posible','Tuberías, parejas, costos',['Graphs-Algorithms-Flow-Algoritms-Dinic','Graphs-Algorithms-Flow-Algoritms-EdmonsKarp','Graphs-Algorithms-Flow-Algoritms-BipartiteMatching','Graphs-Algorithms-Flow-Algoritms-MinCostMaxFlow','Graphs-Algorithms-Flow-Algoritms-MinCostAnyFlow'])]}},
  {ic:'🌳', t:'Un árbol', d:'n nodos y n − 1 aristas, sin ciclos', next:{q:'¿Qué necesitas?', opts:[
    L('La distancia más larga','Diámetro o el más lejano de cada nodo',['Graphs-Algorithms-Graph-Traversal-Diameter','Graphs-Algorithms-Trees-TreeDistances']),
    L('El ancestro común de dos nodos','Jefes, distancias entre nodos',['Graphs-Algorithms-Trees-LCA','Graphs-Algorithms-Trees-BinaryLifting']),
    L('Consultas sobre subárboles','Sumas o cambios en un subárbol',['Graphs-Algorithms-Trees-EulerTour']),
    L('El nodo central','Que deje partes equilibradas',['Graphs-Algorithms-Trees-Centroid']),
    L('Contar caminos con una propiedad','Ej.: caminos de largo k',['Graphs-Algorithms-Trees-CentroidDecomposition']),
    L('Comparar la forma de dos árboles','Isomorfismo',['Graphs-Algorithms-Trees-TreeIsomorfismRooted','Graphs-Algorithms-Trees-TreeIsomorfism'])]}},
  {ic:'🔤', t:'Textos', d:'Cadenas de caracteres', next:{q:'¿Qué te piden?', opts:[
    L('Buscar un patrón en un texto','¿Cuántas veces aparece?',['Strings-Algorithms-KMP-II','Strings-Algorithms-ZFunction','Strings-Algorithms-RabinKarp','Strings-Algorithms-KMP-I']),
    L('Palíndromos','Se lee igual al revés',['Strings-Algorithms-Manacher']),
    L('Un diccionario de palabras','Partir un texto en palabras',['Strings-Algorithms-PrefixTrie']),
    L('Rotaciones de una cadena','La menor rotación',['Strings-Algorithms-MinimalRotation']),
    L('Contar subcadenas distintas','Problemas avanzados de subcadenas',['Strings-Algorithms-SuffixArray'])]}},
  {ic:'📐', t:'Puntos y figuras', d:'Geometría en el plano', next:{q:'¿Qué te piden?', opts:[
    L('Operaciones con vectores','La base de todo',['Geometry-Point']),
    L('El área de un polígono','O sus puntos enteros',['Geometry-Shoelace','Geometry-PolygonLatticePoints']),
    L('Rodear todos los puntos','Envolvente convexa',['Geometry-ConvexHull']),
    L('¿Un punto está dentro?','Adentro, afuera o en el borde',['Geometry-PointInPolygon']),
    L('¿Dos segmentos se cruzan?','Intersección',['Geometry-SegmentIntersection']),
    L('Los dos puntos más cercanos','Muchos puntos',['Geometry-ClosestPair'])]}},
  {ic:'🧮', t:'Matemáticas', d:'Primos, módulos, recurrencias', next:{q:'¿Qué te piden?', opts:[
    L('Números primos','Listar o verificar muchos',['FunctionalTools-Codes-Sieve']),
    L('Combinaciones con módulo','C(n, k) mod 10⁹+7',['FunctionalTools-Codes-ModArithmetic']),
    L('Un término enorme de una recurrencia','Fibonacci con n = 10¹⁸',['FunctionalTools-Codes-MatrixExponentiation']),
    L('Recorrer todos los bits cambiando uno','Código Gray',['FunctionalTools-Codes-GrayCode'])]}}
]};
function tarjeta(id){
  const a = byId[id], c = K[id] || {};
  return '<a class="opt" style="text-decoration:none" href="#/'+id+'">'+lvl(c.nivel||1)+(DEMOS[id]?' <small>▶ con demo</small>':'')+'<b style="margin-top:8px">'+esc(a.nombre)+'</b><small>'+esc(c.idea||a.algoritmo)+'</small></a>';
}
function elegir(){
  const pila = [ARBOL];
  function pintar(){
    const nodo = pila[pila.length-1];
    let h = '<h1>¿Qué algoritmo necesito?</h1><p class="note">Responde unas preguntas sobre tu problema y te mostramos los algoritmos que encajan.</p>';
    h += '<div class="wiz-path">' + pila.map((p,i) => i < pila.length-1 ? '<button data-i="'+i+'">'+esc(i ? p.t : 'Inicio')+'</button> ›' : '<span>'+esc(i ? p.t : 'Inicio')+'</span>').join(' ') + '</div>';
    if (nodo.algs) {
      h += '<h2>'+esc(nodo.t)+'</h2><p>Estos algoritmos resuelven ese tipo de problema (el primero suele ser el más indicado):</p><div class="opts">'+nodo.algs.map(tarjeta).join('')+'</div>';
    } else {
      const q = nodo.next ? nodo.next : nodo;
      h += '<h2>'+esc(q.q)+'</h2><div class="opts">'+q.opts.map((o,i) => '<button class="opt" data-o="'+i+'" style="animation-delay:'+i*40+'ms">'+(o.ic?'<span class="ic">'+o.ic+'</span>':'')+'<b>'+esc(o.t)+'</b><small>'+esc(o.d)+'</small></button>').join('')+'</div>';
    }
    main.innerHTML = h;
    main.querySelectorAll('[data-o]').forEach(b => b.onclick = () => { const q = nodo.next || nodo; pila.push(q.opts[+b.dataset.o]); pintar(); });
    main.querySelectorAll('[data-i]').forEach(b => b.onclick = () => { pila.length = +b.dataset.i + 1; pintar(); });
  }
  pintar();
}

// ---------- Ruta de estudio ----------
function ruta(){
  let h = '<h1>Ruta de estudio</h1><p class="note">Empieza por la columna de la izquierda. Cada algoritmo usa ideas de los anteriores.</p><div class="lvlcol">';
  for (const n of [1,2,3]) {
    h += '<div class="box"><h3>'+lvl(n)+'</h3>';
    for (const c of ORDEN) { const it = A.filter(a => a.carpeta === c && (K[a.id]||{}).nivel === n); if (!it.length) continue;
      h += '<h5 style="margin:12px 0 2px;color:var(--mut)">'+it[0].area+'</h5>' + it.map(a => '<a href="#/'+a.id+'">'+(DEMOS[a.id]?'▶ ':'')+esc(a.nombre)+'</a>').join(''); }
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
  document.getElementById('copiar').onclick = e => { navigator.clipboard.writeText(a.codigo); e.target.textContent = '¡Copiado!'; setTimeout(() => e.target.textContent = 'Copiar código', 1500); };
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
