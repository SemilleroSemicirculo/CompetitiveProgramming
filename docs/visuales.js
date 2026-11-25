// Visuales paso a paso para los algoritmos que no tienen una demo propia en demos.js.
// Cada visual = un generador que corre el algoritmo sobre un ejemplo pequeño y guarda
// cada paso (estado + explicación) y un dibujo que pinta ese estado.
(function(){
const D = window.DEMOS = window.DEMOS || {};
const el = h => { const d = document.createElement('div'); d.innerHTML = h; return d.firstElementChild; };
const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const clone = o => JSON.parse(JSON.stringify(o));
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = R(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const fmt = x => (x === Infinity || x >= 1e15) ? '∞' : (x === -Infinity ? '−∞' : x);

// ---------- reproductor común ----------
function player(box, title, note, gen, render) {
  const w = el('<div class="demo"><h3>' + title + '</h3><div class="row"><button class="btn" data-k="p">Paso ▶</button><button class="btn" data-k="a">Reproducir</button><button class="btn" data-k="r">Reiniciar</button><button class="btn" data-k="n">Ejemplo nuevo</button></div><div class="vis"></div><div class="msg"></div>' + (note ? '<p class="note">' + note + '</p>' : '') + '</div>');
  box.appendChild(w);
  const vis = w.querySelector('.vis'), msg = w.querySelector('.msg'), play = w.querySelector('[data-k=a]');
  let steps = [], k = 0, timer = null;
  const show = () => { const st = steps[k]; vis.innerHTML = render(st.s); msg.textContent = st.m + '  (' + (k + 1) + '/' + steps.length + ')'; };
  const stop = () => { if (timer) { clearInterval(timer); timer = null; play.textContent = 'Reproducir'; } };
  const nuevo = () => { stop(); steps = gen(); k = 0; show(); };
  w.querySelector('[data-k=p]').onclick = () => { stop(); if (k < steps.length - 1) { k++; show(); } };
  play.onclick = () => {
    if (timer) { stop(); return; }
    if (k >= steps.length - 1) { k = 0; show(); }
    play.textContent = 'Pausa';
    timer = setInterval(() => { if (!document.body.contains(w)) { stop(); return; } if (k < steps.length - 1) { k++; show(); } else stop(); }, 850);
  };
  w.querySelector('[data-k=r]').onclick = () => { stop(); k = 0; show(); };
  w.querySelector('[data-k=n]').onclick = nuevo;
  nuevo();
}
// registra una visual; gen recibe push(mensaje, estado)
function V(id, title, note, gen, render) {
  if (D[id]) return;
  D[id] = box => player(box, title, note, () => { const st = []; gen((m, s) => st.push({ m, s: clone(s) })); return st; }, render);
}

// ---------- dibujos ----------
const cellsRow = (t, v, c) => '<div class="vrow">' + (t !== undefined ? '<span class="vlab">' + t + '</span>' : '') + '<div class="cells" style="margin:3px 0">' + v.map((x, i) => '<div class="cell ' + ((c && c[i]) || '') + '">' + (x === null || x === undefined ? '·' : fmt(x)) + '</div>').join('') + '</div></div>';
const rows = rs => rs.map(r => cellsRow(r.t, r.v, r.c)).join('');
const table = (g, cls, rl, cl) => '<div style="overflow:auto"><table style="border-collapse:separate;border-spacing:3px">' + (cl ? '<tr><td></td>' + cl.map(x => '<td class="cell" style="font-weight:700">' + x + '</td>').join('') + '</tr>' : '') + g.map((row, i) => '<tr>' + (rl ? '<td class="cell" style="font-weight:700">' + rl[i] + '</td>' : '') + row.map((x, j) => '<td class="cell ' + ((cls && cls[i] && cls[i][j]) || '') + '">' + (x === null || x === undefined ? '·' : fmt(x)) + '</td>').join('') + '</tr>').join('') + '</table></div>';
const COL = { g: '#2da44e', a: '#d4a72c', b: '#1f6feb', r: '#cf222e', p: '#8250df', o: '#fb8f44', k: '#57606a' };
function graph(G) {
  const W = G.W || 540, H = G.H || 280, rad = 15;
  let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" style="max-width:' + W + 'px;display:block"><defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="11" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#888"/></marker></defs>';
  for (const e of G.edges) {
    const A = G.nodes[e.a], B = G.nodes[e.b];
    const dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy) || 1, off = e.bend || 0;
    const x1 = A.x + dx / L * rad, y1 = A.y + dy / L * rad, x2 = B.x - dx / L * rad, y2 = B.y - dy / L * rad;
    const col = COL[e.c] || '#999', mx = (x1 + x2) / 2 - dy / L * off, my = (y1 + y2) / 2 + dx / L * off;
    s += '<path d="M' + x1 + ' ' + y1 + ' Q' + mx + ' ' + my + ' ' + x2 + ' ' + y2 + '" fill="none" stroke="' + col + '" stroke-width="' + (e.c && e.c !== 'x' ? 3.5 : 1.5) + '"' + (e.dash ? ' stroke-dasharray="4 4"' : '') + (e.d ? ' marker-end="url(#ar)"' : '') + ' opacity="' + (e.c === 'x' ? 0.25 : 1) + '"/>';
    if (e.l !== undefined && e.l !== '') s += '<text x="' + (mx + 9 * dy / L) + '" y="' + (my - 9 * dx / L + 4) + '" font-size="12" text-anchor="middle" fill="currentColor">' + e.l + '</text>';
  }
  for (const v of G.nodes) {
    if (v.hide) continue;
    s += '<circle cx="' + v.x + '" cy="' + v.y + '" r="' + rad + '" fill="' + (COL[v.c] || 'var(--card)') + '" stroke="' + (v.ring ? '#d4a72c' : '#666') + '" stroke-width="' + (v.ring ? 4 : 1.5) + '"/>';
    s += '<text x="' + v.x + '" y="' + (v.y + 4) + '" text-anchor="middle" font-size="12" font-weight="600" fill="' + (v.c ? '#fff' : 'currentColor') + '">' + v.l + '</text>';
    if (v.s !== undefined && v.s !== '') s += '<text x="' + v.x + '" y="' + (v.y - 21) + '" text-anchor="middle" font-size="11" fill="currentColor">' + v.s + '</text>';
  }
  return s + '</svg>';
}
const svgBox = (inner, W = 540, H = 300) => '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" style="max-width:' + W + 'px;display:block;background:var(--bg);border:1px solid var(--line);border-radius:10px">' + inner + '</svg>';

// ---------- grafos de ejemplo ----------
function circleLayout(n, W = 540, H = 280) {
  return Array.from({ length: n }, (_, i) => ({ x: Math.round(W / 2 + (W / 2 - 40) * Math.cos(2 * Math.PI * i / n - Math.PI / 2)), y: Math.round(H / 2 + (H / 2 - 32) * Math.sin(2 * Math.PI * i / n - Math.PI / 2)) }));
}
// grafo conexo al azar: aristas {a, b, w}
function randGraph(n, extra, opt = {}) {
  const E = [], has = new Set(), key = (a, b) => opt.dir ? a + ',' + b : Math.min(a, b) + ',' + Math.max(a, b);
  const add = (a, b) => { if (a === b || has.has(key(a, b)) || (opt.dir && has.has(key(b, a)))) return false; has.add(key(a, b)); E.push({ a, b, w: R(opt.wmin || 1, opt.wmax || 9) }); return true; };
  const order = shuffle([...Array(n).keys()]);
  if (!opt.noTree) for (let i = 1; i < n; i++) { const p = order[R(0, i - 1)]; opt.dir && R(0, 1) ? add(order[i], p) : add(p, order[i]); }
  let tries = 0;
  while (extra > 0 && tries++ < 200) if (add(R(0, n - 1), R(0, n - 1))) extra--;
  return E;
}
// árbol al azar con su dibujo por niveles: devuelve {par, kids, pos}
function randTree(n, W = 540, H = 260) {
  const par = [-1], kids = [[]];
  for (let i = 1; i < n; i++) { const p = R(Math.max(0, i - 4), i - 1); par.push(p); kids.push([]); kids[p].push(i); }
  const depth = [0], order = [0];
  for (const u of order) for (const v of kids[u]) { depth[v] = depth[u] + 1; order.push(v); }
  const maxd = Math.max(...depth), pos = [];
  let leaf = 0; const leaves = [];
  const place = u => { if (!kids[u].length) { pos[u] = leaf++; return pos[u]; } const xs = kids[u].map(place); pos[u] = (Math.min(...xs) + Math.max(...xs)) / 2; return pos[u]; };
  place(0);
  const xy = [...Array(n).keys()].map(u => ({ x: Math.round(30 + (W - 60) * (leaf > 1 ? pos[u] / (leaf - 1) : 0.5)), y: Math.round(30 + (H - 60) * (maxd ? depth[u] / maxd : 0)) }));
  return { par, kids, xy, depth };
}
const nodesOf = (xy, f) => xy.map((p, i) => Object.assign({ x: p.x, y: p.y, l: i + 1 }, f ? f(i) : {}));

// =================== DP ===================
V('DP-Algorithms-CoinChange', 'Monedas mínimas paso a paso', 'Amarillo = cantidad que se calcula; azul = cantidad de la que viene (s − moneda); verde = ya calculada.', push => {
  const coins = shuffle([1, 3, 4, 5, 6, 7]).slice(0, 3).sort((a, b) => a - b), x = R(9, 12);
  const dp = Array(x + 1).fill(Infinity); dp[0] = 0;
  const st = () => ({ coins, dp, cur: -1, from: -1 });
  push('Monedas ' + coins.join(', ') + ' y objetivo ' + x + '. dp[0] = 0: pagar 0 no necesita monedas.', st());
  for (const c of coins) for (let s = c; s <= x; s++) {
    const old = dp[s]; if (dp[s - c] + 1 < dp[s]) dp[s] = dp[s - c] + 1;
    push('Moneda ' + c + ': dp[' + s + '] = min(' + fmt(old) + ', dp[' + (s - c) + '] + 1 = ' + fmt(dp[s - c] + 1) + ') = ' + fmt(dp[s]), Object.assign(st(), { cur: s, from: s - c }));
  }
  push(dp[x] === Infinity ? 'No hay forma de pagar ' + x + '.' : 'Respuesta: ' + dp[x] + ' monedas para pagar ' + x + '.', Object.assign(st(), { cur: x }));
}, s => rows([{ t: 'cantidad', v: s.dp.map((_, i) => i) }, { t: 'dp', v: s.dp, c: s.dp.map((v, i) => i === s.cur ? 'a' : i === s.from ? 'b' : v !== Infinity ? 'g' : '') }]) + '<p class="note">Monedas: ' + s.coins.join(', ') + '</p>');

V('DP-Algorithms-CoinCombinations', 'Contar formas paso a paso', 'Con la moneda en el bucle externo, cada combinación se cuenta una sola vez.', push => {
  const coins = shuffle([1, 2, 3, 5]).slice(0, 3).sort((a, b) => a - b), x = R(7, 10);
  const dp = Array(x + 1).fill(0); dp[0] = 1;
  push('Monedas ' + coins.join(', ') + ', objetivo ' + x + '. dp[0] = 1 (no usar monedas).', { dp, cur: -1, from: -1, c: 0 });
  for (const c of coins) for (let s = c; s <= x; s++) { dp[s] += dp[s - c]; push('Moneda ' + c + ': dp[' + s + '] += dp[' + (s - c) + '] → ' + dp[s], { dp, cur: s, from: s - c, c }); }
  push('Hay ' + dp[x] + ' formas de sumar ' + x + ' sin importar el orden.', { dp, cur: x, from: -1, c: 0 });
}, s => rows([{ t: 'suma', v: s.dp.map((_, i) => i) }, { t: 'formas', v: s.dp, c: s.dp.map((v, i) => i === s.cur ? 'a' : i === s.from ? 'b' : v ? 'g' : '') }]));

V('DP-Algorithms-Knapsack', 'Mochila 0/1 paso a paso', 'Cada libro se revisa una vez; el presupuesto se recorre de mayor a menor.', push => {
  const n = 4, price = Array.from({ length: n }, () => R(1, 5)), pages = Array.from({ length: n }, () => R(2, 9)), x = R(6, 9);
  const dp = Array(x + 1).fill(0);
  push('Presupuesto ' + x + '. Libros (precio/páginas): ' + price.map((p, i) => p + '/' + pages[i]).join(', '), { dp, cur: -1, from: -1, item: -1, price, pages });
  for (let i = 0; i < n; i++) for (let w = x; w >= price[i]; w--) {
    const take = dp[w - price[i]] + pages[i], old = dp[w]; if (take > dp[w]) dp[w] = take;
    push('Libro ' + (i + 1) + ', presupuesto ' + w + ': no comprar = ' + old + ', comprar = dp[' + (w - price[i]) + '] + ' + pages[i] + ' = ' + take + ' → ' + dp[w], { dp, cur: w, from: w - price[i], item: i, price, pages });
  }
  push('Máximo de páginas con presupuesto ' + x + ': ' + dp[x], { dp, cur: x, from: -1, item: -1, price, pages });
}, s => rows([{ t: 'libro', v: s.price.map((p, i) => 'p' + p + ' · ' + s.pages[i] + 'pág'), c: s.price.map((_, i) => i === s.item ? 'a' : '') }, { t: 'presupuesto', v: s.dp.map((_, i) => i) }, { t: 'páginas', v: s.dp, c: s.dp.map((v, i) => i === s.cur ? 'a' : i === s.from ? 'b' : v ? 'g' : '') }]));

V('DP-Algorithms-Kadane2D', 'Submatriz de suma máxima', 'Se fijan las filas de arriba y abajo, se suman las columnas y se aplica Kadane a esa fila.', push => {
  const r = 4, c = 5, M = Array.from({ length: r }, () => Array.from({ length: c }, () => R(-6, 6)));
  let best = -Infinity, bb = null;
  for (let t = 0; t < r; t++) { const col = Array(c).fill(0); for (let b = t; b < r; b++) {
    for (let j = 0; j < c; j++) col[j] += M[b][j];
    let cur = 0, start = 0, lb = -Infinity, ls = 0, le = 0;
    for (let j = 0; j < c; j++) { if (cur <= 0) { cur = col[j]; start = j; } else cur += col[j]; if (cur > lb) { lb = cur; ls = start; le = j; } }
    if (lb > best) { best = lb; bb = [t, b, ls, le]; }
    push('Filas ' + (t + 1) + ' a ' + (b + 1) + ': suma por columnas [' + col.join(', ') + '], mejor tramo = ' + lb + '. Mejor global = ' + best, { M, t, b, col, ls, le, bb });
  } }
  push('La submatriz de suma máxima suma ' + best + ' (verde).', { M, t: -1, b: -1, col: null, ls: -1, le: -1, bb });
}, s => table(s.M, s.M.map((row, i) => row.map((_, j) => (s.bb && i >= s.bb[0] && i <= s.bb[1] && j >= s.bb[2] && j <= s.bb[3] && s.t < 0) ? 'g' : (i >= s.t && i <= s.b) ? (j >= s.ls && j <= s.le ? 'a' : 'b') : ''))) + (s.col ? rows([{ t: 'columnas', v: s.col, c: s.col.map((_, j) => j >= s.ls && j <= s.le ? 'a' : '') }]) : ''));

V('DP-Algorithms-LIS-I', 'LIS en O(n²)', 'Para cada número se miran los anteriores más pequeños (azul) y se extiende el mejor.', push => {
  const a = Array.from({ length: 8 }, () => R(1, 15)), dp = Array(8).fill(null);
  push('Arreglo inicial. dp[i] será la LIS que termina en a[i].', { a, dp, i: -1, js: [] });
  for (let i = 0; i < a.length; i++) { dp[i] = 1; const js = []; for (let j = 0; j < i; j++) if (a[j] < a[i]) { js.push(j); dp[i] = Math.max(dp[i], dp[j] + 1); }
    push('a[' + i + '] = ' + a[i] + ': ' + (js.length ? 'se extiende desde los menores anteriores → dp = ' + dp[i] : 'ningún anterior es menor → dp = 1'), { a, dp, i, js }); }
  push('La LIS mide ' + Math.max(...dp) + '.', { a, dp, i: -1, js: [] });
}, s => rows([{ t: 'a', v: s.a, c: s.a.map((_, k) => k === s.i ? 'a' : s.js.includes(k) ? 'b' : '') }, { t: 'dp', v: s.dp, c: s.dp.map(v => v === null ? '' : 'g') }]));

V('DP-Algorithms-LIS-II', 'LIS con búsqueda binaria', 'R guarda el menor final posible para cada longitud; cada número reemplaza o agrega.', push => {
  const a = Array.from({ length: 10 }, () => R(1, 20)), Rr = [];
  push('R empieza vacío.', { a, Rr, i: -1, pos: -1 });
  a.forEach((v, i) => { let lo = 0, hi = Rr.length; while (lo < hi) { const m = (lo + hi) >> 1; if (Rr[m] < v) lo = m + 1; else hi = m; }
    const grew = lo === Rr.length; Rr[lo] = v;
    push(v + ': ' + (grew ? 'es mayor que todos, la LIS crece a ' + Rr.length : 'reemplaza a la posición ' + (lo + 1) + ' (deja un final más pequeño)'), { a, Rr, i, pos: lo }); });
  push('Largo de la LIS: ' + Rr.length + '.', { a, Rr, i: -1, pos: -1 });
}, s => rows([{ t: 'a', v: s.a, c: s.a.map((_, k) => k === s.i ? 'a' : k < s.i ? 'g' : '') }, { t: 'R', v: s.Rr.length ? s.Rr : [null], c: s.Rr.map((_, k) => k === s.pos ? 'a' : 'b') }]));

V('DP-Algorithms-LCS', 'Tabla de la LCS', 'Verde = las letras coinciden (viene de la diagonal); amarillo = casilla actual.', push => {
  const al = 'ABCD', a = Array.from({ length: 5 }, () => pick(al)), b = Array.from({ length: 6 }, () => pick(al));
  const T = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0)), cls = T.map(r => r.map(() => ''));
  push('Se compara ' + a.join('') + ' con ' + b.join('') + '.', { T, cls });
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) {
    const eq = a[i - 1] === b[j - 1]; T[i][j] = eq ? T[i - 1][j - 1] + 1 : Math.max(T[i - 1][j], T[i][j - 1]);
    const c2 = cls.map(r => r.slice()); c2[i][j] = 'a';
    push((eq ? a[i - 1] + ' = ' + b[j - 1] + ': diagonal + 1 = ' : a[i - 1] + ' ≠ ' + b[j - 1] + ': máximo de arriba e izquierda = ') + T[i][j], { T, cls: c2 }); if (eq) cls[i][j] = 'g';
  }
  let i = a.length, j = b.length; const res = [];
  while (i && j) { if (a[i - 1] === b[j - 1]) { res.push(a[i - 1]); cls[i][j] = 'p'; i--; j--; } else if (T[i - 1][j] >= T[i][j - 1]) i--; else j--; }
  push('Recorriendo hacia atrás (morado) sale la LCS: ' + (res.reverse().join('') || '(vacía)') + ', de largo ' + T[a.length][b.length] + '.', { T, cls });
}, s => table(s.T, s.cls));

V('DP-Algorithms-BitmaskDP', 'DP sobre subconjuntos (ascensor)', 'Cada fila es un grupo: los bits encendidos son las personas que ya subieron.', push => {
  const n = 4, x = R(8, 12), w = Array.from({ length: n }, () => R(2, 7)), full = 1 << n;
  const ri = Array(full).fill(null), la = Array(full).fill(null); ri[0] = 1; la[0] = 0;
  const st = cur => ({ w, x, ri, la, cur, n });
  push('Pesos ' + w.join(', ') + ', capacidad ' + x + '. El grupo vacío: 1 viaje con 0 kg.', st(0));
  for (let m = 1; m < full; m++) { let br = 99, bl = 0;
    for (let i = 0; i < n; i++) if (m >> i & 1) { let r = ri[m ^ (1 << i)], l = la[m ^ (1 << i)]; if (l + w[i] <= x) l += w[i]; else { r++; l = w[i]; } if (r < br || (r === br && l < bl)) { br = r; bl = l; } }
    ri[m] = br; la[m] = bl; push('Grupo ' + m.toString(2).padStart(n, '0') + ': ' + br + ' viajes, ' + bl + ' kg en el último.', st(m)); }
  push('Todos juntos necesitan ' + ri[full - 1] + ' viajes.', st(full - 1));
}, s => { const ms = [...Array(1 << s.n).keys()]; return table(ms.map(m => [m.toString(2).padStart(s.n, '0'), s.ri[m], s.la[m]]), ms.map(m => m === s.cur ? ['a', 'a', 'a'] : s.ri[m] !== null ? ['', 'g', 'g'] : ['', '', '']), null, ['grupo', 'viajes', 'último kg']); });

V('DP-Classic-Problems-Campeonato', 'Probabilidad de ganar la serie', 'P[i][j] = probabilidad de que A gane si le faltan i victorias y a B le faltan j.', push => {
  const n = 4, p = pick([0.4, 0.5, 0.6]), q = 1 - p;
  const P = Array.from({ length: n + 1 }, (_, i) => Array.from({ length: n + 1 }, (_, j) => i === 0 && j > 0 ? 1 : (j === 0 ? 0 : null)));
  const show = () => P.map(r => r.map(v => v === null ? null : v.toFixed(2)));
  push('A gana cada partido con probabilidad ' + p + '. Casos base: si a A no le falta nada, 1; si a B no le falta nada, 0.', { P: show(), cur: [-1, -1] });
  for (let i = 1; i <= n; i++) for (let j = 1; j <= n; j++) { P[i][j] = p * P[i - 1][j] + q * P[i][j - 1]; push('P[' + i + '][' + j + '] = ' + p + '·P[' + (i - 1) + '][' + j + '] + ' + q.toFixed(1) + '·P[' + i + '][' + (j - 1) + '] = ' + P[i][j].toFixed(3), { P: show(), cur: [i, j] }); }
  push('Al mejor de ' + (2 * n - 1) + ', A gana con probabilidad ' + P[n][n].toFixed(4) + '.', { P: show(), cur: [n, n] });
}, s => table(s.P, s.P.map((r, i) => r.map((v, j) => i === s.cur[0] && j === s.cur[1] ? 'a' : (i === s.cur[0] - 1 && j === s.cur[1]) || (i === s.cur[0] && j === s.cur[1] - 1) ? 'b' : v !== null ? 'g' : '')), [...Array(s.P.length).keys()].map(i => 'A:' + i), [...Array(s.P.length).keys()].map(j => 'B:' + j)));

// =================== Data Structures ===================
// Dibujos de las estructuras en sí: pila vertical, cola y deque horizontales, heap como árbol + arreglo.
const FILL = { a: '#ffd33d', b: '#79b8ff', g: '#7ee2a8', r: '#ff8182' };
const caja = (x, y, w, h, t, c, op) => '<g opacity="' + (op || 1) + '"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="7" fill="' + (FILL[c] || 'var(--card)') + '" stroke="' + (c ? '#555' : 'var(--mut)') + '" stroke-width="1.5"/><text x="' + (x + w / 2) + '" y="' + (y + h / 2 + 5) + '" text-anchor="middle" font-size="15" font-weight="700" fill="' + (c ? '#111' : 'currentColor') + '">' + t + '</text></g>';
const txt = (x, y, t, o = {}) => '<text x="' + x + '" y="' + y + '" font-size="' + (o.s || 12) + '" text-anchor="' + (o.a || 'middle') + '" fill="' + (o.c || 'currentColor') + '"' + (o.b ? ' font-weight="700"' : '') + '>' + t + '</text>';
const flecha = (x1, y1, x2, y2, c = '#888') => '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + c + '" stroke-width="2" marker-end="url(#ds-ar)"/>';
const defsAr = '<defs><marker id="ds-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#888"/></marker></defs>';
// lista de operaciones a la derecha, con la actual resaltada
const opsList = (ops, cur, x, y, max = 9) => { const from = Math.max(0, Math.min(cur - 4, ops.length - max)); let s = txt(x, y, 'Operaciones', { a: 'start', b: 1, s: 13 });
  ops.slice(from, from + max).forEach((o, j) => { const k = from + j; s += txt(x, y + 22 + j * 20, (k === cur ? '▶ ' : k < cur ? '✓ ' : '   ') + o, { a: 'start', s: 13, b: k === cur, c: k > cur ? 'var(--mut)' : 'currentColor' }); }); return s; };
const opsDe = (n, mk) => { const ops = []; let size = 0; for (let i = 0; i < n; i++) { const o = mk(size, i); ops.push(o); size += o.d; } return ops; };

V('Data-Structures-Algorithms-Stack', 'La pila (stack): último en entrar, primero en salir', 'Amarillo = elemento que acaba de entrar · azul = el tope que se consulta · rojo = el que sale. Todas las operaciones son O(1) porque solo se toca el tope.', push => {
  const ops = opsDe(10, (sz, i) => sz >= 2 && (i > 2 && R(0, 2) === 0) ? (R(0, 3) ? { o: 'pop()', d: -1 } : { o: 'top()', d: 0 }) : sz >= 6 ? { o: 'pop()', d: -1 } : { o: 'push(' + R(1, 99) + ')', d: 1 });
  const st = [], L = ops.map(o => o.o);
  push('Una pila es como una torre de platos: solo puedes poner o quitar el de arriba (el tope).', { st: [], L, k: -1 });
  ops.forEach((o, k) => {
    if (o.d === 1) { const v = +o.o.slice(5, -1); st.push(v); push('push(' + v + '): ' + v + ' se pone encima de todo. Ahora es el tope.', { st: st.slice(), L, k, hi: 'a' }); }
    else if (o.d === -1) { const v = st.pop(); push('pop(): sale ' + v + ', el último que había entrado.' + (st.length ? ' El nuevo tope es ' + st[st.length - 1] + '.' : ' La pila quedó vacía.'), { st: st.slice(), L, k, out: v }); }
    else push('top(): mira el tope (' + st[st.length - 1] + ') sin sacarlo.', { st: st.slice(), L, k, hi: 'b' });
  });
  push('Orden de salida = orden inverso de entrada (LIFO). Se usa para deshacer, paréntesis balanceados, DFS y la «pila monótona» del código de abajo.', { st: st.slice(), L, k: L.length });
}, s => { const W = 540, H = 330, x = 110, w = 110, h = 34, base = 300; let g = defsAr;
  g += '<path d="M' + (x - 8) + ' 60 V' + (base + 6) + ' H' + (x + w + 8) + ' V60" fill="none" stroke="var(--mut)" stroke-width="3"/>';
  s.st.forEach((v, i) => { const top = i === s.st.length - 1; g += caja(x, base - (i + 1) * (h + 4), w, h, v, top && s.hi ? s.hi : ''); });
  if (s.st.length) { const y = base - s.st.length * (h + 4) + h / 2; g += flecha(x + w + 70, y, x + w + 14, y) + txt(x + w + 74, y + 4, 'tope', { a: 'start', b: 1 }); }
  else g += txt(x + w / 2, base - 20, 'vacía', { c: 'var(--mut)' });
  if (s.out !== undefined) g += caja(x, 14, w, h, s.out, 'r', 0.9) + flecha(x + w / 2, 60, x + w / 2, 50, '#cf222e');
  g += txt(x + w / 2, base + 24, 'pila', { c: 'var(--mut)' });
  return svgBox(g + opsList(s.L, s.k, 330, 40), W, H); });

V('Data-Structures-Classic-Problems-Team-Queue', 'La cola (queue): primero en llegar, primero en salir', 'Primera parte: una cola normal. Segunda parte: la «cola de colas» del problema Team Queue, donde cada equipo (color) tiene su propia cola dentro de la cola general.', push => {
  const q = [], L = [];
  const ops = opsDe(8, (sz, i) => sz >= 2 && R(0, 2) === 0 ? { o: 'dequeue()', d: -1 } : sz >= 6 ? { o: 'dequeue()', d: -1 } : { o: 'enqueue(' + R(1, 99) + ')', d: 1 });
  ops.forEach(o => L.push(o.o));
  push('Una cola es la fila del banco: se entra por el final y se sale por el frente. Nadie se cuela.', { mode: 1, q: [], L, k: -1 });
  ops.forEach((o, k) => {
    if (o.d === 1) { const v = +o.o.slice(8, -1); q.push(v); push('enqueue(' + v + '): ' + v + ' entra por el final de la fila. O(1).', { mode: 1, q: q.slice(), L, k, hi: q.length - 1 }); }
    else { const v = q.shift(); push('dequeue(): sale ' + v + ', el que llevaba más tiempo esperando. O(1).', { mode: 1, q: q.slice(), L, k, out: v }); }
  });
  push('Orden de salida = orden de llegada (FIFO). Es la base de BFS y de cualquier simulación de turnos.', { mode: 1, q: q.slice(), L, k: L.length });
  // segunda parte: cola de colas
  const T = ['g', 'b', 'o'], G = []; let id = 1;
  push('Team Queue: ahora cada persona pertenece a un equipo (color). La cola general guarda equipos, y cada equipo tiene su propia cola.', { mode: 2, G: [] });
  for (let s = 0; s < 11; s++) {
    if (G.length && (R(0, 2) === 0 || id > 9)) { const t = G[0], x = t.m.shift(); if (!t.m.length) G.shift();
      push('DEQUEUE: sale ' + x + ', el primero del equipo que está al frente' + (t.m.length ? '.' : '; su equipo quedó vacío y sale de la cola general.'), { mode: 2, G: clone(G), out: { n: x, t: t.t } }); continue; }
    const t = pick(T), x = id++, e = G.find(y => y.t === t);
    if (e) { e.m.push(x); push('ENQUEUE ' + x + ': su equipo ya está en la fila, así que entra al final de la cola de su equipo.', { mode: 2, G: clone(G), hi: x }); }
    else { G.push({ t, m: [x] }); push('ENQUEUE ' + x + ': su equipo no estaba; el equipo entra al final de la cola general.', { mode: 2, G: clone(G), hi: x }); }
  }
}, s => { let g = defsAr;
  if (s.mode === 1) { const W = 540, H = 240, x0 = 90, y = 70, w = 48, h = 40;
    g += '<path d="M' + (x0 - 6) + ' ' + (y - 8) + ' H' + (x0 + 7 * (w + 4) + 6) + ' M' + (x0 - 6) + ' ' + (y + h + 8) + ' H' + (x0 + 7 * (w + 4) + 6) + '" stroke="var(--mut)" stroke-width="3"/>';
    s.q.forEach((v, i) => g += caja(x0 + i * (w + 4), y, w, h, v, i === s.hi ? 'a' : i === 0 ? 'b' : ''));
    if (!s.q.length) g += txt(x0 + 180, y + 25, 'vacía', { c: 'var(--mut)' });
    if (s.q.length === 1) g += txt(x0 + w / 2, y + h + 28, 'frente y final', { b: 1, a: 'start' }); else if (s.q.length) { g += txt(x0 + w / 2, y + h + 28, 'frente', { b: 1 }); g += txt(x0 + (s.q.length - 1) * (w + 4) + w / 2, y + h + 28, 'final', { b: 1 }); }
    g += flecha(x0 + 7 * (w + 4) + 50, y + h / 2, x0 + 7 * (w + 4) + 12, y + h / 2) + txt(x0 + 7 * (w + 4) + 30, y - 16, 'entra', { c: 'var(--mut)' });
    g += flecha(x0 - 10, y + h / 2, x0 - 60, y + h / 2) + txt(x0 - 40, y - 16, 'sale', { c: 'var(--mut)' });
    if (s.out !== undefined) g += caja(14, y + h + 14, 48, 34, s.out, 'r');
    g += '<g transform="translate(0,190)">' + opsInline(s.L, s.k, 5) + '</g>';
    return svgBox(g, W, H); }
  const W = 540, H = 200, y = 60; let x = 70;
  g += txt(16, 30, 'frente', { a: 'start', b: 1 });
  s.G.forEach(t => { const w = t.m.length * 38 + 14; g += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="56" rx="10" fill="' + COL[t.t] + '22" stroke="' + COL[t.t] + '" stroke-width="2.5"/>';
    t.m.forEach((m, j) => g += '<rect x="' + (x + 7 + j * 38) + '" y="' + (y + 11) + '" width="34" height="34" rx="6" fill="' + COL[t.t] + '" stroke="' + (m === s.hi ? '#d4a72c' : 'none') + '" stroke-width="4"/>' + txt(x + 24 + j * 38, y + 33, m, { c: '#fff', b: 1, s: 14 }));
    x += w + 10; });
  if (!s.G.length) g += txt(270, y + 32, 'cola general vacía', { c: 'var(--mut)' });
  if (s.out) g += '<rect x="14" y="' + (y + 11) + '" width="34" height="34" rx="6" fill="' + COL[s.out.t] + '" opacity=".55"/>' + txt(31, y + 33, s.out.n, { c: '#fff', b: 1, s: 14 }) + txt(31, y + 64, 'sale', { c: '#cf222e' });
  g += txt(16, 158, 'Cada caja grande es la cola de un equipo (sus miembros en orden de llegada).', { a: 'start', s: 12, c: 'var(--mut)' }) + txt(16, 176, 'Las cajas forman la cola general: sale primero el equipo de la izquierda.', { a: 'start', s: 12, c: 'var(--mut)' });
  return svgBox(g, W, H); });

V('Data-Structures-Algorithms-Deque', 'La deque: una cola con dos puertas', 'Se puede meter y sacar por los dos extremos en O(1). Amarillo = acaba de entrar · rojo = el que sale · azul = frente y final.', push => {
  const d = [], names = ['push_front', 'push_back', 'pop_front', 'pop_back'];
  const ops = opsDe(11, (sz, i) => { const p = sz < 2 ? R(0, 1) : sz >= 6 ? R(2, 3) : R(0, 4) < 3 ? R(0, 1) : R(2, 3); return p < 2 ? { o: names[p] + '(' + R(1, 99) + ')', d: 1, p } : { o: names[p] + '()', d: -1, p }; });
  const L = ops.map(o => o.o);
  push('Una deque (double-ended queue) es una fila en la que se puede entrar y salir por adelante y por atrás. Sirve de pila y de cola a la vez.', { d: [], L, k: -1 });
  ops.forEach((o, k) => {
    if (o.p === 0) { const v = +o.o.match(/\d+/)[0]; d.unshift(v); push(o.o + ': ' + v + ' entra por el frente.', { d: d.slice(), L, k, hi: 0 }); }
    else if (o.p === 1) { const v = +o.o.match(/\d+/)[0]; d.push(v); push(o.o + ': ' + v + ' entra por el final.', { d: d.slice(), L, k, hi: d.length - 1 }); }
    else if (o.p === 2) { const v = d.shift(); push('pop_front(): sale ' + v + ' por el frente.', { d: d.slice(), L, k, out: v, side: 0 }); }
    else { const v = d.pop(); push('pop_back(): sale ' + v + ' por el final.', { d: d.slice(), L, k, out: v, side: 1 }); }
  });
  push('Con solo push_back + pop_back es una pila; con push_back + pop_front es una cola. El código de abajo la usa para el mínimo de una ventana que se desliza.', { d: d.slice(), L, k: L.length });
}, s => { const W = 540, H = 250, x0 = 110, y = 60, w = 44, h = 40, n = 7; let g = defsAr;
  const R2 = x0 + n * (w + 4);
  g += '<path d="M' + (x0 - 6) + ' ' + (y - 8) + ' H' + (R2 + 2) + ' M' + (x0 - 6) + ' ' + (y + h + 8) + ' H' + (R2 + 2) + '" stroke="var(--mut)" stroke-width="3"/>';
  s.d.forEach((v, i) => g += caja(x0 + i * (w + 4), y, w, h, v, i === s.hi ? 'a' : (i === 0 || i === s.d.length - 1) ? 'b' : ''));
  if (!s.d.length) g += txt(x0 + 165, y + 25, 'vacía', { c: 'var(--mut)' });
  g += txt(x0 - 50, y - 16, 'frente', { b: 1 }) + flecha(x0 - 70, y + 12, x0 - 12, y + 12) + flecha(x0 - 12, y + 30, x0 - 70, y + 30);
  g += txt(R2 + 50, y - 16, 'final', { b: 1 }) + flecha(R2 + 70, y + 12, R2 + 10, y + 12) + flecha(R2 + 10, y + 30, R2 + 70, y + 30);
  if (s.out !== undefined) g += caja(s.side ? R2 + 30 : x0 - 85, y + h + 20, 44, 34, s.out, 'r');
  g += '<g transform="translate(0,195)">' + opsInline(s.L, s.k, 5) + '</g>';
  return svgBox(g, W, H); });
function opsInline(L, k, per = 6) { const a = L.map((o, j) => j === k ? '▶' + o : j < k ? '✓' + o : o); return txt(14, 0, 'Operaciones:', { a: 'start', s: 12, b: 1 }) + txt(14, 20, a.slice(0, per).join('   '), { a: 'start', s: 12 }) + txt(14, 38, a.slice(per).join('   '), { a: 'start', s: 12 }); }

V('Data-Structures-Algorithms-Heap', 'El heap (montículo): el mínimo siempre arriba', 'Es un árbol binario guardado en un arreglo: los hijos de i están en 2i+1 y 2i+2. Regla: cada padre ≤ sus hijos. Amarillo = nodo que se mueve · azul = con quién se compara · rojo = el que sale.', push => {
  const h = [];
  const S = (m, o = {}) => push(m, Object.assign({ h: h.slice() }, o));
  S('Un heap no ordena todo: solo garantiza que cada padre sea menor o igual que sus hijos. Por eso la raíz siempre es el mínimo.');
  const ins = v => { h.push(v); let i = h.length - 1; S('push(' + v + '): se pone en el primer hueco libre (posición ' + i + ').', { a: i });
    while (i > 0) { const p = (i - 1) >> 1; if (h[p] <= h[i]) { S(h[p] + ' ≤ ' + h[i] + ': el padre ya es menor, se detiene. O(log n) pasos como máximo.', { a: i, b: p }); return; }
      S(h[i] + ' < ' + h[p] + ': es menor que su padre, se intercambian (sube).', { a: i, b: p }); [h[p], h[i]] = [h[i], h[p]]; i = p; }
    S(v + ' llegó a la raíz: es el nuevo mínimo.', { a: 0 }); };
  const pop = () => { const m = h[0]; S('pop(): sale la raíz ' + m + ', que es el mínimo.', { r: 0 }); const last = h.pop(); if (!h.length) { S('El heap quedó vacío.'); return; }
    h[0] = last; let i = 0; S('El último elemento (' + last + ') pasa a la raíz para no dejar hueco.', { a: 0, out: m });
    for (;;) { const l = 2 * i + 1, r = l + 1; let c = i; if (l < h.length && h[l] < h[c]) c = l; if (r < h.length && h[r] < h[c]) c = r;
      if (c === i) { S('Ningún hijo es menor: se detiene. La raíz vuelve a ser el mínimo (' + h[0] + ').', { a: i, out: m }); return; }
      S(h[i] + ' es mayor que su hijo menor ' + h[c] + ': se intercambian (baja).', { a: i, b: c, out: m }); [h[i], h[c]] = [h[c], h[i]]; i = c; } };
  const vals = shuffle([...Array(40).keys()].map(x => x + 1)).slice(0, 9);
  vals.slice(0, 7).forEach(ins); pop(); pop(); vals.slice(7).forEach(ins); pop();
  S('Insertar y sacar el mínimo cuestan O(log n). El código de abajo lo usa para saber qué habitación se desocupa primero.');
}, s => { const W = 540, H = 190, n = s.h.length; let g = '';
  const pos = i => { const d = Math.floor(Math.log2(i + 1)), k = i - (2 ** d - 1), cnt = 2 ** d; return { x: W * (k + 0.5) / cnt, y: 30 + d * 56 }; };
  for (let i = 1; i < n; i++) { const a = pos(i), b = pos((i - 1) >> 1); g += '<line x1="' + a.x + '" y1="' + a.y + '" x2="' + b.x + '" y2="' + b.y + '" stroke="#999" stroke-width="1.5"/>'; }
  for (let i = 0; i < n; i++) { const p = pos(i), c = i === s.r ? 'r' : i === s.a ? 'a' : i === s.b ? 'b' : i === 0 ? 'g' : '';
    g += '<circle cx="' + p.x + '" cy="' + p.y + '" r="18" fill="' + (FILL[c] || 'var(--card)') + '" stroke="#666" stroke-width="1.5"/>' + txt(p.x, p.y + 5, s.h[i], { b: 1, s: 14, c: c ? '#111' : 'currentColor' }) + txt(p.x + 22, p.y + 18, i, { s: 10, c: 'var(--mut)' }); }
  if (!n) g += txt(W / 2, 80, 'heap vacío', { c: 'var(--mut)' });
  if (s.out !== undefined) g += '<circle cx="505" cy="30" r="18" fill="' + FILL.r + '" opacity=".8"/>' + txt(505, 35, s.out, { b: 1, s: 14, c: '#111' }) + txt(505, 64, 'salió', { c: '#cf222e' });
  return svgBox(g, W, H) + cellsRow('arreglo', n ? s.h : [null], s.h.map((_, i) => i === s.r ? 'r' : i === s.a ? 'a' : i === s.b ? 'b' : '')); });

V('Data-Structures-Algorithms-FenwickTree', 'Fenwick Tree: suma de prefijos', 'Cada casilla del BIT guarda un bloque que termina en ella; una suma junta pocos bloques.', push => {
  const n = 8, a = [0, ...Array.from({ length: n }, () => R(1, 9))], bit = Array(n + 1).fill(0);
  const st = (hl, used, msg) => ({ a: a.slice(1), bit: bit.slice(1), hl, used });
  push('Arreglo inicial; el BIT empieza en cero.', st(-1, []));
  for (let i = 1; i <= n; i++) { const touched = []; for (let j = i; j <= n; j += j & -j) { bit[j] += a[i]; touched.push(j); } push('Se suma a[' + i + '] = ' + a[i] + ' en las casillas ' + touched.join(', ') + ' (subiendo con i += i & −i).', st(i, touched)); }
  const r = R(3, n); const used = []; let sum = 0; for (let j = r; j > 0; j -= j & -j) { used.push(j); sum += bit[j]; }
  push('Suma de a[1..' + r + '] = juntar los bloques ' + used.join(', ') + ' (bajando con i −= i & −i) = ' + sum, st(-1, used));
}, s => rows([{ t: 'a', v: s.a, c: s.a.map((_, i) => i + 1 === s.hl ? 'a' : '') }, { t: 'bloque', v: s.a.map((_, i) => { const j = i + 1, lw = j & -j; return (j - lw + 1) + '..' + j; }) }, { t: 'bit', v: s.bit, c: s.bit.map((_, i) => s.used.includes(i + 1) ? 'g' : '') }]));

V('Data-Structures-Algorithms-SparseTable', 'Sparse Table: mínimos por potencias de 2', 'Cada nivel j guarda el mínimo de los tramos de largo 2^j.', push => {
  const n = 8, a = Array.from({ length: n }, () => R(1, 20)), st = [a.slice()];
  push('Nivel 0: el propio arreglo.', { st, hl: [], q: null });
  for (let j = 1; (1 << j) <= n; j++) { st.push([]); for (let i = 0; i + (1 << j) <= n; i++) st[j].push(Math.min(st[j - 1][i], st[j - 1][i + (1 << (j - 1))])); push('Nivel ' + j + ': cada casilla es el mínimo de dos casillas del nivel ' + (j - 1) + ' (tramos de largo ' + (1 << j) + ').', { st, hl: [j], q: null }); }
  const l = R(0, 3), r = R(l + 2, n - 1), k = 31 - Math.clz32(r - l + 1);
  push('Consulta [' + (l + 1) + ', ' + (r + 1) + ']: dos tramos de largo ' + (1 << k) + ' que se solapan. Mínimo = ' + Math.min(st[k][l], st[k][r - (1 << k) + 1]), { st, hl: [], q: [k, l, r - (1 << k) + 1, l, r] });
}, s => { const n = s.st[0].length; return s.st.map((row, j) => cellsRow('nivel ' + j, row.concat(Array(n - row.length).fill(null)), row.map((_, i) => s.q ? (j === 0 && i >= s.q[3] && i <= s.q[4] ? 'b' : j === s.q[0] && (i === s.q[1] || i === s.q[2]) ? 'g' : '') : s.hl.includes(j) ? 'a' : ''))).join(''); });

// árbol de segmentos dibujado como grafo
function segLayout(n, W = 540, H = 260) {
  const nodes = [], edges = [], idx = {};
  const levels = Math.ceil(Math.log2(n)) + 1;
  (function build(id, l, r, d, x0, x1) { idx[id] = nodes.length; nodes.push({ id, l, r, x: Math.round((x0 + x1) / 2), y: Math.round(28 + (H - 56) * (levels > 1 ? d / (levels - 1) : 0)) });
    if (l === r) return; const m = (l + r) >> 1; build(2 * id, l, m, d + 1, x0, (x0 + x1) / 2); build(2 * id + 1, m + 1, r, d + 1, (x0 + x1) / 2, x1); edges.push([id, 2 * id], [id, 2 * id + 1]); })(1, 0, n - 1, 0, 10, W - 10);
  return { nodes, edges, idx };
}
V('Data-Structures-Algorithms-SegmentTreeMin', 'Segment Tree de mínimos', 'Cada nodo guarda el mínimo de su tramo. Amarillo = camino que se recalcula; verde = nodos que responden la consulta.', push => {
  const n = 8, a = Array.from({ length: n }, () => R(1, 20)), L = segLayout(n), t = {};
  (function b(id, l, r) { if (l === r) { t[id] = a[l]; return; } const m = (l + r) >> 1; b(2 * id, l, m); b(2 * id + 1, m + 1, r); t[id] = Math.min(t[2 * id], t[2 * id + 1]); })(1, 0, n - 1);
  const st = (c = {}) => ({ L, t: Object.assign({}, t), c });
  push('Árbol construido: las hojas son el arreglo y cada padre es el mínimo de sus hijos.', st());
  const p = R(0, n - 1), v = R(0, 20), path = {}; (function u(id, l, r) { path[id] = 'a'; if (l === r) { t[id] = v; return; } const m = (l + r) >> 1; p <= m ? u(2 * id, l, m) : u(2 * id + 1, m + 1, r); t[id] = Math.min(t[2 * id], t[2 * id + 1]); })(1, 0, n - 1);
  push('Se cambia a[' + (p + 1) + '] = ' + v + ': solo se recalcula el camino hasta la raíz.', st(path));
  const ql = R(0, 3), qr = R(ql + 2, n - 1), used = {}; let res = Infinity;
  (function q(id, l, r) { if (r < ql || l > qr) return; if (ql <= l && r <= qr) { used[id] = 'g'; res = Math.min(res, t[id]); return; } used[id] = 'b'; const m = (l + r) >> 1; q(2 * id, l, m); q(2 * id + 1, m + 1, r); })(1, 0, n - 1);
  push('Consulta [' + (ql + 1) + ', ' + (qr + 1) + ']: bastan los nodos verdes. Mínimo = ' + res, st(used));
}, s => graph({ W: 540, H: 260, nodes: s.L.nodes.map(nd => ({ x: nd.x, y: nd.y, l: s.t[nd.id], c: s.c[nd.id] || '', s: nd.l === nd.r ? '[' + (nd.l + 1) + ']' : '' })), edges: s.L.edges.map(([u, v]) => ({ a: s.L.idx[u], b: s.L.idx[v] })) }));

V('Data-Structures-Algorithms-SegmentTree', 'Segment Tree con propagación perezosa', 'Cada nodo muestra su suma; la etiqueta de arriba (+x) es una suma pendiente que todavía no se bajó a los hijos.', push => {
  const n = 8, a = Array.from({ length: n }, () => R(1, 9)), L = segLayout(n), sum = {}, lz = {}, size = {};
  (function b(id, l, r) { size[id] = r - l + 1; lz[id] = 0; if (l === r) { sum[id] = a[l]; return; } const m = (l + r) >> 1; b(2 * id, l, m); b(2 * id + 1, m + 1, r); sum[id] = sum[2 * id] + sum[2 * id + 1]; })(1, 0, n - 1);
  const st = (c = {}) => ({ L, sum: Object.assign({}, sum), lz: Object.assign({}, lz), c });
  push('Árbol de sumas construido.', st());
  const apply = (id, x) => { sum[id] += x * size[id]; lz[id] += x; };
  const push2 = id => { if (lz[id]) { apply(2 * id, lz[id]); apply(2 * id + 1, lz[id]); lz[id] = 0; } };
  for (let rep = 0; rep < 2; rep++) {
    const ql = R(0, 4), qr = R(ql + 1, n - 1), x = R(1, 5), c = {};
    (function u(id, l, r) { if (r < ql || l > qr) return; if (ql <= l && r <= qr) { apply(id, x); c[id] = 'g'; return; } c[id] = 'b'; push2(id); const m = (l + r) >> 1; u(2 * id, l, m); u(2 * id + 1, m + 1, r); sum[id] = sum[2 * id] + sum[2 * id + 1]; })(1, 0, n - 1);
    push('Sumar ' + x + ' a [' + (ql + 1) + ', ' + (qr + 1) + ']: los nodos verdes cubren el rango y se quedan con la nota +' + x + ' sin bajar a las hojas.', st(c));
  }
  const ql = R(0, 3), qr = R(ql + 1, n - 1), c = {}; let res = 0;
  (function q(id, l, r) { if (r < ql || l > qr) return; if (ql <= l && r <= qr) { c[id] = 'g'; res += sum[id]; return; } c[id] = 'b'; push2(id); const m = (l + r) >> 1; q(2 * id, l, m); q(2 * id + 1, m + 1, r); })(1, 0, n - 1);
  push('Consulta [' + (ql + 1) + ', ' + (qr + 1) + ']: al bajar, las notas pendientes pasan a los hijos (azul). Suma = ' + res, st(c));
}, s => graph({ W: 540, H: 260, nodes: s.L.nodes.map(nd => ({ x: nd.x, y: nd.y, l: s.sum[nd.id], c: s.c[nd.id] || '', s: s.lz[nd.id] ? '+' + s.lz[nd.id] : '' })), edges: s.L.edges.map(([u, v]) => ({ a: s.L.idx[u], b: s.L.idx[v] })) }));

V('Data-Structures-Algorithms-MoAlgorithm', 'Algoritmo de Mo', 'Las consultas se reordenan por bloques; la ventana (azul) se mueve poco entre una y otra.', push => {
  const n = 12, a = Array.from({ length: n }, () => R(1, 5)), qs = Array.from({ length: 6 }, (_, i) => { const l = R(0, n - 3); return { l, r: R(l + 1, n - 1), i }; });
  const B = 3, ord = qs.slice().sort((x, y) => Math.floor(x.l / B) - Math.floor(y.l / B) || x.r - y.r), ans = Array(qs.length).fill(null);
  push('Bloques de tamaño ' + B + '. Orden de respuesta: ' + ord.map(q => '[' + (q.l + 1) + ',' + (q.r + 1) + ']').join(' '), { a, L: 0, R: -1, d: 0, ans, cur: -1, qs });
  const cnt = {}; let L = 0, Rr = -1, d = 0, moves = 0;
  for (const q of ord) { while (Rr < q.r) { Rr++; if (!cnt[a[Rr]]++) d++; moves++; } while (L > q.l) { L--; if (!cnt[a[L]]++) d++; moves++; } while (Rr > q.r) { if (!--cnt[a[Rr]]) d--; Rr--; moves++; } while (L < q.l) { if (!--cnt[a[L]]) d--; L++; moves++; }
    ans[q.i] = d; push('Consulta [' + (q.l + 1) + ', ' + (q.r + 1) + ']: ' + d + ' valores distintos. Movimientos acumulados: ' + moves, { a, L, R: Rr, d, ans: ans.slice(), cur: q.i, qs }); }
}, s => rows([{ t: 'arreglo', v: s.a, c: s.a.map((_, j) => j >= s.L && j <= s.R ? 'b' : '') }, { t: 'consulta', v: s.qs.map(q => (q.l + 1) + '–' + (q.r + 1)), c: s.qs.map(q => q.i === s.cur ? 'a' : '') }, { t: 'respuesta', v: s.ans, c: s.ans.map(v => v === null ? '' : 'g') }]));

V('Data-Structures-Algorithms-SweepLine', 'Barrido de eventos', 'Cada cliente aporta +1 al llegar y −1 al salir; el contador más alto es la respuesta.', push => {
  const n = 5, cl = Array.from({ length: n }, () => { const a = R(1, 14); return [a, a + R(1, 6)]; });
  const ev = []; cl.forEach(([a, b]) => { ev.push([a, 1]); ev.push([b, -1]); }); ev.sort((x, y) => x[0] - y[0] || x[1] - y[1]);
  let cur = 0, best = 0; push('Clientes: ' + cl.map(c => c[0] + '–' + c[1]).join(', ') + '. Se ordenan los eventos por tiempo.', { cl, t: 0, cur, best });
  for (const [t, d] of ev) { cur += d; best = Math.max(best, cur); push('Tiempo ' + t + ': ' + (d > 0 ? 'llega' : 'sale') + ' un cliente → ' + cur + ' adentro (máximo ' + best + ')', { cl, t, cur, best }); }
}, s => { const W = 540, sx = t => 20 + t * 24; let g = '<line x1="' + sx(s.t) + '" y1="5" x2="' + sx(s.t) + '" y2="' + (s.cl.length * 26 + 20) + '" stroke="#d4a72c" stroke-width="3"/>';
  s.cl.forEach(([a, b], i) => { const on = a <= s.t && s.t < b; g += '<rect x="' + sx(a) + '" y="' + (12 + i * 26) + '" width="' + (sx(b) - sx(a)) + '" height="16" rx="5" fill="' + (on ? '#2da44e' : '#8884') + '"/>'; });
  return svgBox(g, W, s.cl.length * 26 + 30) + '<p class="msg">Adentro: ' + s.cur + ' · máximo: ' + s.best + '</p>'; });

V('Data-Structures-Algorithms-TwoPointers', 'Dos punteros', 'Si la suma es pequeña se mueve el izquierdo; si es grande, el derecho.', push => {
  const a = Array.from({ length: 9 }, () => R(1, 20)).sort((x, y) => x - y), x = a[R(0, 3)] + a[R(5, 8)];
  let l = 0, r = a.length - 1; push('Buscamos dos números que sumen ' + x + '.', { a, l, r, ok: false });
  while (l < r) { const s = a[l] + a[r]; if (s === x) { push(a[l] + ' + ' + a[r] + ' = ' + x + ': ¡encontrados!', { a, l, r, ok: true }); return; }
    push(a[l] + ' + ' + a[r] + ' = ' + s + (s < x ? ' < ' + x + ': avanza el izquierdo.' : ' > ' + x + ': retrocede el derecho.'), { a, l, r, ok: false }); s < x ? l++ : r--; }
  push('No hay par que sume ' + x + '.', { a, l, r, ok: false });
}, s => rows([{ t: 'ordenado', v: s.a, c: s.a.map((_, j) => (j === s.l || j === s.r) ? (s.ok ? 'g' : 'a') : (j < s.l || j > s.r) ? 'r' : '') }]));

V('Data-Structures-Classic-Problems-K-Smallest-Sums', 'Las k menores sumas', 'Cuadrícula de sumas a[i] + b[j]; se exploran solo las vecinas de las ya elegidas.', push => {
  const k = 4, a = Array.from({ length: k }, () => R(1, 12)).sort((x, y) => x - y), b = Array.from({ length: k }, () => R(1, 12)).sort((x, y) => x - y);
  const S = a.map(x => b.map(y => x + y)), cls = S.map(r => r.map(() => '')); const heap = [[S[0][0], 0, 0]], seen = new Set(['0,0']), res = [];
  cls[0][0] = 'b'; push('La menor suma posible es a[0] + b[0] = ' + S[0][0] + '.', { S, cls, res: res.slice() });
  while (res.length < k) { heap.sort((x, y) => x[0] - y[0]); const [v, i, j] = heap.shift(); res.push(v); cls[i][j] = 'g';
    for (const [ni, nj] of [[i + 1, j], [i, j + 1]]) if (ni < k && nj < k && !seen.has(ni + ',' + nj)) { seen.add(ni + ',' + nj); heap.push([S[ni][nj], ni, nj]); cls[ni][nj] = 'b'; }
    push('Se elige ' + v + ' y se agregan sus vecinas al heap (azul). Elegidas: ' + res.join(', '), { S, cls, res: res.slice() }); }
}, s => table(s.S, s.cls));


// =================== FunctionalTools ===================
V('FunctionalTools-Codes-BinarySearchAnswer', 'Búsqueda binaria sobre la respuesta', 'Rojo = con ese tiempo no alcanza; verde = alcanza. Se busca la frontera.', push => {
  const k = Array.from({ length: 3 }, () => R(2, 6)), t = R(6, 12), made = T => k.reduce((s, x) => s + Math.floor(T / x), 0);
  let lo = 1, hi = Math.min(...k) * t; const mark = {};
  push('Máquinas con tiempos ' + k.join(', ') + '; hay que fabricar ' + t + ' productos. Rango: [' + lo + ', ' + hi + '].', { lo, hi, mark: {}, hi0: hi });
  while (lo < hi) { const m = (lo + hi) >> 1, p = made(m); mark[m] = p >= t ? 'g' : 'r';
    push('¿Alcanza con ' + m + '? Se fabrican ' + p + (p >= t ? ' ≥ ' + t + ': sí, se prueba con menos.' : ' < ' + t + ': no, hace falta más tiempo.'), { lo, hi, mark: Object.assign({}, mark), hi0: Math.min(...k) * t, m }); p >= t ? hi = m : lo = m + 1; }
  push('El tiempo mínimo es ' + lo + '.', { lo, hi, mark, hi0: Math.min(...k) * t, m: lo, done: true });
}, s => { const v = [...Array(s.hi0).keys()].map(i => i + 1); return rows([{ t: 'tiempo', v, c: v.map(x => s.done && x === s.m ? 'g' : x === s.m ? 'a' : s.mark[x] || (x < s.lo || x > s.hi ? 'r' : '')) }]); });

V('FunctionalTools-Codes-TS', 'Búsqueda ternaria', 'Se comparan dos puntos y se descarta el tercio que no puede tener el máximo.', push => {
  const c = R(-10, 10), f = x => -(x - c) * (x - c) + 50; let l = -15, r = 15;
  push('Función con un solo pico en [' + l + ', ' + r + '].', { l, r, m1: null, m2: null, f: c });
  while (r - l > 3) { const m1 = l + Math.floor((r - l) / 3), m2 = r - Math.floor((r - l) / 3);
    push('f(' + m1 + ') = ' + f(m1) + ', f(' + m2 + ') = ' + f(m2) + (f(m1) < f(m2) ? ': se descarta la izquierda de ' + m1 : ': se descarta la derecha de ' + m2), { l, r, m1, m2, f: c }); if (f(m1) < f(m2)) l = m1; else r = m2; }
  push('Quedan pocos valores; se revisan todos. El máximo está en x = ' + c + '.', { l, r, m1: c, m2: null, f: c, done: true });
}, s => { const sx = x => 20 + (x + 15) * 16.6, sy = y => 240 - Math.max(-60, y) * 3; let g = '';
  g += '<rect x="' + sx(s.l) + '" y="10" width="' + (sx(s.r) - sx(s.l)) + '" height="240" fill="#1f6feb18"/>';
  let d = ''; for (let x = -15; x <= 15; x += 0.5) d += (d ? 'L' : 'M') + sx(x) + ' ' + sy(-(x - s.f) * (x - s.f) + 50);
  g += '<path d="' + d + '" fill="none" stroke="#888" stroke-width="2"/>';
  for (const [m, col] of [[s.m1, s.done ? '#2da44e' : '#d4a72c'], [s.m2, '#d4a72c']]) if (m !== null) g += '<circle cx="' + sx(m) + '" cy="' + sy(-(m - s.f) * (m - s.f) + 50) + '" r="7" fill="' + col + '"/>';
  return svgBox(g, 540, 260); });

V('FunctionalTools-Codes-ModArithmetic', 'Exponenciación rápida modular', 'Se recorre el exponente en binario: se eleva al cuadrado en cada paso y se multiplica cuando el bit está encendido.', push => {
  const p = pick([13, 17, 19, 23]), a = R(2, p - 1); let b = p - 2; const bits = b.toString(2).split('').reverse().map(Number);
  let res = 1, cur = a % p;
  push('Inverso de ' + a + ' módulo ' + p + ' (Fermat): ' + a + '^' + (p - 2) + ' mod ' + p + '. Bits de ' + (p - 2) + ': ' + (p - 2).toString(2), { bits, i: -1, res, cur });
  bits.forEach((bt, i) => { if (bt) res = res * cur % p;
    push('Bit ' + i + (bt ? ' encendido: resultado × ' + cur + ' = ' + res : ' apagado: no se multiplica') + '. Luego base² = ' + (cur * cur % p), { bits, i, res, cur }); cur = cur * cur % p; });
  push('Inverso: ' + res + ' (comprobación: ' + a + ' × ' + res + ' mod ' + p + ' = ' + (a * res % p) + ').', { bits, i: bits.length, res, cur });
}, s => rows([{ t: 'bits (de menor a mayor)', v: s.bits, c: s.bits.map((b, i) => i === s.i ? 'a' : i < s.i ? (b ? 'g' : 'r') : '') }, { t: 'base actual', v: [s.cur] }, { t: 'resultado', v: [s.res], c: ['g'] }]));

V('FunctionalTools-Codes-GrayCode', 'Código Gray', 'Entre un código y el siguiente cambia un solo bit (amarillo).', push => {
  const n = 3, codes = []; push('Se listan los 2^' + n + ' códigos con i XOR (i >> 1).', { codes: [], ch: -1 });
  for (let i = 0; i < (1 << n); i++) { const g = i ^ (i >> 1), prev = codes.length ? parseInt(codes[codes.length - 1], 2) : g; codes.push(g.toString(2).padStart(n, '0'));
    const diff = prev ^ g; push('i = ' + i + ' → ' + codes[codes.length - 1] + (i ? ' (cambia el bit ' + (Math.log2(diff)) + ')' : ''), { codes: codes.slice(), ch: i ? n - 1 - Math.log2(diff) : -1 }); }
}, s => s.codes.map((c, k) => cellsRow(k, c.split(''), c.split('').map((_, j) => k === s.codes.length - 1 && j === s.ch ? 'a' : ''))).join(''));

V('FunctionalTools-Codes-MatrixExponentiation', 'Fibonacci con potencias de matrices', 'M = [[1,1],[1,0]]; M^n tiene F(n) en la esquina. Se usan los bits de n.', push => {
  const n = R(10, 30), bits = n.toString(2).split('').reverse().map(Number), mul = (A, B) => [[A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]], [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]]];
  let Rm = [[1, 0], [0, 1]], P = [[1, 1], [1, 0]];
  push('Calcular F(' + n + '). En binario, ' + n + ' = ' + n.toString(2) + '.', { bits, i: -1, Rm, P });
  bits.forEach((b, i) => { if (b) Rm = mul(Rm, P); push('Potencia M^' + (1 << i) + (b ? ': el bit está encendido, se multiplica al resultado' : ': bit apagado, se salta'), { bits, i, Rm, P }); P = mul(P, P); });
  push('F(' + n + ') = ' + Rm[0][1] + ', con solo ' + bits.length + ' cuadrados en vez de ' + n + ' sumas.', { bits, i: bits.length, Rm, P });
}, s => rows([{ t: 'bits de n', v: s.bits, c: s.bits.map((b, i) => i === s.i ? 'a' : i < s.i ? (b ? 'g' : 'r') : '') }]) + '<div class="two"><div><p class="note">M^(2^i)</p>' + table(s.P) + '</div><div><p class="note">resultado</p>' + table(s.Rm, [['g', 'g'], ['g', 'g']]) + '</div></div>');

V('FunctionalTools-Codes-MeetInTheMiddle', 'Meet in the middle', 'Se listan las sumas de cada mitad y se buscan pares que completen x.', push => {
  const a = Array.from({ length: 6 }, () => R(1, 9)), L = a.slice(0, 3), Rr = a.slice(3), sums = v => { let s = [0]; for (const x of v) s = s.concat(s.map(y => y + x)); return s; };
  const SL = sums(L), SR = sums(Rr).sort((x, y) => x - y), x = pick(SL) + pick(SR);
  push('Arreglo ' + a.join(', ') + ', objetivo ' + x + '. Mitades: [' + L.join(', ') + '] y [' + Rr.join(', ') + '].', { SL, SR, i: -1, hit: [], cnt: 0 });
  let cnt = 0; SL.forEach((s, i) => { const hit = SR.map((v, j) => v === x - s ? j : -1).filter(j => j >= 0); cnt += hit.length;
    push('Suma izquierda ' + s + ': se buscan ' + (x - s) + ' en la derecha → ' + hit.length + ' coincidencias (total ' + cnt + ')', { SL, SR, i, hit, cnt }); });
  push('Hay ' + cnt + ' subconjuntos que suman ' + x + ' (con 2³ + 2³ sumas en lugar de 2⁶).', { SL, SR, i: -1, hit: [], cnt });
}, s => rows([{ t: 'mitad izq.', v: s.SL, c: s.SL.map((_, i) => i === s.i ? 'a' : '') }, { t: 'mitad der. (ordenada)', v: s.SR, c: s.SR.map((_, j) => s.hit.includes(j) ? 'g' : '') }]));

// =================== Geometry ===================
const G0 = { W: 540, H: 300 };
const toS = p => [G0.W / 2 + p[0] * 22, G0.H / 2 - p[1] * 22];
const gridBg = () => { let g = ''; for (let x = -12; x <= 12; x++) g += '<line x1="' + toS([x, -7])[0] + '" y1="0" x2="' + toS([x, 7])[0] + '" y2="' + G0.H + '" stroke="#8882" />'; for (let y = -6; y <= 6; y++) g += '<line x1="0" y1="' + toS([0, y])[1] + '" x2="' + G0.W + '" y2="' + toS([0, y])[1] + '" stroke="#8882" />'; return g; };
const seg = (a, b, col, w = 2.5, dash) => { const A = toS(a), B = toS(b); return '<line x1="' + A[0] + '" y1="' + A[1] + '" x2="' + B[0] + '" y2="' + B[1] + '" stroke="' + col + '" stroke-width="' + w + '"' + (dash ? ' stroke-dasharray="5 4"' : '') + '/>'; };
const dot = (p, col, r = 5, label) => { const A = toS(p); return '<circle cx="' + A[0] + '" cy="' + A[1] + '" r="' + r + '" fill="' + col + '"/>' + (label ? '<text x="' + (A[0] + 8) + '" y="' + (A[1] - 8) + '" font-size="12" fill="currentColor">' + label + '</text>' : ''); };
const poly = (P, fill, stroke) => '<polygon points="' + P.map(p => toS(p).join(',')).join(' ') + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="2"/>';
const randPoly = n => { const ang = Array.from({ length: n }, () => Math.random() * 2 * Math.PI).sort((a, b) => a - b); return ang.map(t => { const r = R(3, 6); return [Math.round(r * Math.cos(t)), Math.round(r * Math.sin(t))]; }).filter((p, i, A) => i === 0 || p[0] !== A[i - 1][0] || p[1] !== A[i - 1][1]); };
const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);

V('Geometry-Point', 'Vectores: punto, cruz y proyección', 'A en azul, B en naranja; cada paso muestra una operación.', push => {
  const A = [R(1, 6), R(-3, 5)], B = [R(-5, 5), R(1, 5)], dotp = A[0] * B[0] + A[1] * B[1], cr = A[0] * B[1] - A[1] * B[0], k = dotp / (B[0] * B[0] + B[1] * B[1]);
  const base = { A, B }; push('A = (' + A + '), B = (' + B + ').', Object.assign({ show: [] }, base));
  push('A + B = (' + (A[0] + B[0]) + ', ' + (A[1] + B[1]) + '): poner B a continuación de A.', Object.assign({ show: ['sum'] }, base));
  push('A · B = ' + dotp + (dotp > 0 ? ' > 0: apuntan hacia el mismo lado.' : dotp < 0 ? ' < 0: apuntan a lados opuestos.' : ' = 0: son perpendiculares.'), Object.assign({ show: ['dot'] }, base));
  push('A × B = ' + cr + (cr > 0 ? ' > 0: B está a la izquierda de A (giro antihorario).' : cr < 0 ? ' < 0: B está a la derecha de A.' : ': son paralelos.') + ' Su valor es el área del paralelogramo.', Object.assign({ show: ['cross'] }, base));
  push('Proyección de A sobre B = B · (A·B / |B|²) = (' + (B[0] * k).toFixed(2) + ', ' + (B[1] * k).toFixed(2) + ').', Object.assign({ show: ['proj'], k }, base));
}, s => { const O = [0, 0]; let g = gridBg();
  if (s.show.includes('cross')) g += poly([O, s.A, [s.A[0] + s.B[0], s.A[1] + s.B[1]], s.B], '#8250df33', '#8250df');
  if (s.show.includes('sum')) { g += seg(s.A, [s.A[0] + s.B[0], s.A[1] + s.B[1]], '#fb8f44', 2, true); g += seg(O, [s.A[0] + s.B[0], s.A[1] + s.B[1]], '#2da44e', 3); }
  if (s.show.includes('proj')) { const P = [s.B[0] * s.k, s.B[1] * s.k]; g += seg(s.A, P, '#888', 1.5, true); g += seg(O, P, '#2da44e', 4); }
  g += seg(O, s.A, '#1f6feb', 3) + seg(O, s.B, '#fb8f44', 3) + dot(s.A, '#1f6feb', 5, 'A') + dot(s.B, '#fb8f44', 5, 'B') + dot(O, '#666', 3);
  return svgBox(g, G0.W, G0.H); });

V('Geometry-Shoelace', 'Área con la fórmula del Shoelace', 'Cada arista aporta un triángulo con signo desde el origen; la suma es el doble del área.', push => {
  const P = randPoly(6); let sum = 0;
  push('Polígono con ' + P.length + ' vértices.', { P, i: -1, sum });
  for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length], t = a[0] * b[1] - b[0] * a[1]; sum += t;
    push('Arista ' + (i + 1) + ': x₁·y₂ − x₂·y₁ = ' + t + (t >= 0 ? ' (suma)' : ' (resta)') + '. Acumulado: ' + sum, { P, i, sum }); }
  push('Área = |' + sum + '| / 2 = ' + Math.abs(sum) / 2 + '.', { P, i: P.length, sum });
}, s => { let g = gridBg() + poly(s.P, s.i >= s.P.length ? '#2da44e33' : 'none', '#888');
  if (s.i >= 0 && s.i < s.P.length) { const a = s.P[s.i], b = s.P[(s.i + 1) % s.P.length], t = a[0] * b[1] - b[0] * a[1]; g += poly([[0, 0], a, b], t >= 0 ? '#2da44e44' : '#cf222e44', t >= 0 ? '#2da44e' : '#cf222e'); }
  s.P.forEach(p => g += dot(p, '#1f6feb')); g += dot([0, 0], '#666', 3, 'O'); return svgBox(g, G0.W, G0.H); });

V('Geometry-PointInPolygon', 'Punto en polígono con un rayo', 'Se lanza un rayo hacia la derecha y se cuentan los cruces con el borde.', push => {
  const P = randPoly(7), p = [R(-3, 3) + 0.5, R(-3, 3) + 0.5]; let cnt = 0; const hits = [];
  push('¿El punto amarillo está dentro?', { P, p, i: -1, hits: [], cnt });
  for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length]; let hit = false;
    if ((a[1] > p[1]) !== (b[1] > p[1])) { const x = a[0] + (p[1] - a[1]) * (b[0] - a[0]) / (b[1] - a[1]); if (x > p[0]) { hit = true; cnt++; hits.push([x, p[1]]); } }
    push('Arista ' + (i + 1) + (hit ? ': el rayo la cruza. Cruces: ' + cnt : ': no la cruza.'), { P, p, i, hits: hits.slice(), cnt }); }
  push(cnt % 2 ? 'Cruces impares (' + cnt + '): el punto está ADENTRO.' : 'Cruces pares (' + cnt + '): el punto está AFUERA.', { P, p, i: -1, hits, cnt, done: true });
}, s => { let g = gridBg() + poly(s.P, s.done ? (s.cnt % 2 ? '#2da44e33' : '#cf222e22') : 'none', '#888');
  if (s.i >= 0) g += seg(s.P[s.i], s.P[(s.i + 1) % s.P.length], '#d4a72c', 4);
  g += seg(s.p, [13, s.p[1]], '#d4a72c', 2, true); s.hits.forEach(h => g += dot(h, '#cf222e', 5)); g += dot(s.p, '#d4a72c', 7); return svgBox(g, G0.W, G0.H); });

V('Geometry-SegmentIntersection', '¿Se cruzan dos segmentos?', 'Se mira de qué lado de cada segmento quedan los extremos del otro.', push => {
  const A = [R(-9, -1), R(-5, 5)], B = [R(1, 9), R(-5, 5)], C = [R(-6, 6), R(-6, -1)], D2 = [R(-6, 6), R(1, 6)];
  const o = (a, b, c) => Math.sign(cross(a, b, c)), side = v => v > 0 ? 'izquierda' : v < 0 ? 'derecha' : 'sobre la recta';
  push('Segmentos AB (azul) y CD (naranja).', { A, B, C, D: D2, h: 0 });
  const o1 = o(A, B, C), o2 = o(A, B, D2), o3 = o(C, D2, A), o4 = o(C, D2, B);
  push('Respecto a AB: C está a la ' + side(o1) + ' y D a la ' + side(o2) + (o1 * o2 <= 0 ? ' → lados opuestos.' : ' → mismo lado, no se cruzan.'), { A, B, C, D: D2, h: 1 });
  push('Respecto a CD: A está a la ' + side(o3) + ' y B a la ' + side(o4) + (o3 * o4 <= 0 ? ' → lados opuestos.' : ' → mismo lado.'), { A, B, C, D: D2, h: 2 });
  push(o1 * o2 <= 0 && o3 * o4 <= 0 ? 'Ambas condiciones se cumplen: los segmentos SE CRUZAN.' : 'Alguna condición falla: NO se cruzan.', { A, B, C, D: D2, h: 3, yes: o1 * o2 <= 0 && o3 * o4 <= 0 });
}, s => { let g = gridBg();
  if (s.h === 1) g += seg([s.A[0] * 3 - s.B[0] * 2, s.A[1] * 3 - s.B[1] * 2], [s.B[0] * 3 - s.A[0] * 2, s.B[1] * 3 - s.A[1] * 2], '#1f6feb55', 1.5, true);
  if (s.h === 2) g += seg([s.C[0] * 3 - s.D[0] * 2, s.C[1] * 3 - s.D[1] * 2], [s.D[0] * 3 - s.C[0] * 2, s.D[1] * 3 - s.C[1] * 2], '#fb8f4455', 1.5, true);
  const c1 = s.h === 3 ? (s.yes ? '#2da44e' : '#cf222e') : '#1f6feb', c2 = s.h === 3 ? (s.yes ? '#2da44e' : '#cf222e') : '#fb8f44';
  g += seg(s.A, s.B, c1, 4) + seg(s.C, s.D, c2, 4) + dot(s.A, c1, 5, 'A') + dot(s.B, c1, 5, 'B') + dot(s.C, c2, 5, 'C') + dot(s.D, c2, 5, 'D'); return svgBox(g, G0.W, G0.H); });

V('Geometry-PolygonLatticePoints', 'Teorema de Pick', 'Puntos del borde (naranja) con gcd por arista; luego los interiores (verde) salen de la fórmula.', push => {
  const P = randPoly(5); let area2 = 0, B = 0; const bpts = [];
  push('Polígono con vértices enteros.', { P, bpts: [], ipts: [], i: -1 });
  for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length], dx = b[0] - a[0], dy = b[1] - a[1], g = (function gcd(x, y) { return y ? gcd(y, x % y) : Math.abs(x); })(Math.abs(dx), Math.abs(dy));
    area2 += a[0] * b[1] - b[0] * a[1]; B += g; for (let t = 0; t < g; t++) bpts.push([a[0] + dx / g * t, a[1] + dy / g * t]);
    push('Arista ' + (i + 1) + ': gcd(' + Math.abs(dx) + ', ' + Math.abs(dy) + ') = ' + g + ' puntos en el borde (sin contar el vértice final). B = ' + B, { P, bpts: bpts.slice(), ipts: [], i }); }
  area2 = Math.abs(area2); const I = (area2 - B + 2) / 2, ipts = [];
  for (let x = -7; x <= 7; x++) for (let y = -7; y <= 7; y++) { let c = 0, on = false; for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length]; if (cross(a, b, [x, y]) === 0 && Math.min(a[0], b[0]) <= x && x <= Math.max(a[0], b[0]) && Math.min(a[1], b[1]) <= y && y <= Math.max(a[1], b[1])) on = true; if ((a[1] > y) !== (b[1] > y) && x < a[0] + (y - a[1]) * (b[0] - a[0]) / (b[1] - a[1])) c++; } if (!on && c % 2) ipts.push([x, y]); }
  push('Área = ' + area2 / 2 + '. Pick: I = A − B/2 + 1 = ' + I + ' puntos interiores (se ven en verde: ' + ipts.length + ').', { P, bpts, ipts, i: -1 });
}, s => { let g = gridBg() + poly(s.P, '#1f6feb18', '#1f6feb'); if (s.i >= 0) g += seg(s.P[s.i], s.P[(s.i + 1) % s.P.length], '#d4a72c', 4);
  s.ipts.forEach(p => g += dot(p, '#2da44e', 4)); s.bpts.forEach(p => g += dot(p, '#fb8f44', 5)); return svgBox(g, G0.W, G0.H); });

V('Geometry-ClosestPair', 'Par de puntos más cercano (barrido)', 'La franja azul contiene los puntos a menos de d en x; solo esos se comparan.', push => {
  const n = 12, P = Array.from({ length: n }, () => [R(-11, 11), R(-6, 6)]).sort((a, b) => a[0] - b[0]); let best = Infinity, bp = null, left = 0;
  push('Puntos ordenados por x.', { P, i: -1, left: 0, best, bp: null, cmp: [] });
  for (let i = 0; i < n; i++) { const d = Math.sqrt(best); while (left < i && P[i][0] - P[left][0] >= d) left++;
    const cmp = []; for (let j = left; j < i; j++) if (Math.abs(P[j][1] - P[i][1]) < d) { cmp.push(j); const dd = (P[i][0] - P[j][0]) ** 2 + (P[i][1] - P[j][1]) ** 2; if (dd < best) { best = dd; bp = [i, j]; } }
    push('Punto ' + (i + 1) + ': se compara con ' + cmp.length + ' puntos de la franja. Mejor distancia² = ' + fmt(best), { P, i, left, best, bp, cmp }); }
  push('La pareja más cercana está a distancia √' + best + ' = ' + Math.sqrt(best).toFixed(2) + '.', { P, i: -1, left: 0, best, bp, cmp: [] });
}, s => { let g = gridBg(); if (s.i >= 0) { const x0 = toS(s.P[s.left])[0], x1 = toS(s.P[s.i])[0]; g += '<rect x="' + x0 + '" y="0" width="' + (x1 - x0) + '" height="' + G0.H + '" fill="#1f6feb18"/>'; }
  if (s.bp) g += seg(s.P[s.bp[0]], s.P[s.bp[1]], '#2da44e', 4);
  s.P.forEach((p, k) => g += dot(p, k === s.i ? '#d4a72c' : s.cmp.includes(k) ? '#1f6feb' : (s.bp && s.bp.includes(k)) ? '#2da44e' : '#888', k === s.i ? 7 : 5)); return svgBox(g, G0.W, G0.H); });

// =================== Graphs ===================
// estado de grafo: xy (posiciones), E (aristas {a,b,w}), dir, nc/ns (color y etiqueta de nodos), ec/el (color y etiqueta de aristas)
const GS = (xy, E, dir) => ({ xy, E, dir: !!dir, nc: xy.map(() => ''), ns: xy.map(() => ''), ec: E.map(() => ''), el: E.map(e => e.w === undefined ? '' : e.w) });
const GR = s => graph({ nodes: s.xy.map((p, i) => ({ x: p.x, y: p.y, l: s.lab ? s.lab[i] : i + 1, c: s.nc[i], s: s.ns[i], ring: s.ring === i })), edges: s.E.map((e, k) => ({ a: e.a, b: e.b, d: s.dir, c: s.ec[k], l: s.el[k], bend: e.bend })) });
const adjOf = (n, E, dir) => { const G = Array.from({ length: n }, () => []); E.forEach((e, k) => { G[e.a].push([e.b, k]); if (!dir) G[e.b].push([e.a, k]); }); return G; };
const SCC_COLORS = ['g', 'b', 'o', 'p', 'r', 'a'];

V('Graphs-Algorithms-Graph-Traversal-DFS', 'DFS y componentes conexas', 'Cada componente se pinta de un color; amarillo = nodo que se explora.', push => {
  const n = 9, xy = circleLayout(n), E = []; const comps = shuffle([...Array(n).keys()]); const cut = [0, R(2, 4), R(5, 7), n];
  for (let c = 0; c < 3; c++) { const g = comps.slice(cut[c], cut[c + 1]); for (let i = 1; i < g.length; i++) E.push({ a: g[R(0, i - 1)], b: g[i] }); }
  const s = GS(xy, E), G = adjOf(n, E), seen = Array(n).fill(false); let comp = 0;
  push('Grafo con varias islas.', s);
  for (let st = 0; st < n; st++) { if (seen[st]) continue; const col = SCC_COLORS[comp++]; const stack = [st]; seen[st] = true;
    while (stack.length) { const u = stack.pop(); s.nc = s.nc.map((c, i) => i === u ? 'a' : c); push('Componente ' + comp + ': se visita ' + (u + 1) + '.', s); s.nc[u] = col;
      for (const [v, k] of G[u]) { s.ec[k] = col; if (!seen[v]) { seen[v] = true; stack.push(v); } } } }
  push('Se encontraron ' + comp + ' componentes: hacen falta ' + (comp - 1) + ' caminos para unirlas.', s);
}, GR);

V('Graphs-Algorithms-Graph-Traversal-BellmanFord', 'Bellman-Ford por rondas', 'En cada ronda se relajan todas las aristas; las etiquetas son las distancias desde 1.', push => {
  const n = 6, xy = circleLayout(n), E = randGraph(n, 3, { dir: true, wmin: -2, wmax: 8 }), s = GS(xy, E, true), d = Array(n).fill(Infinity); d[0] = 0;
  s.ns = d.map(fmt); s.nc[0] = 'g'; push('Distancias iniciales: 0 en el nodo 1 y ∞ en el resto.', s);
  for (let r = 1; r < n; r++) { let ch = false; s.ec = E.map(() => '');
    E.forEach((e, k) => { if (d[e.a] + e.w < d[e.b]) { d[e.b] = d[e.a] + e.w; ch = true; s.ec[k] = 'g'; } });
    s.ns = d.map(fmt); s.nc = d.map(x => x < Infinity ? 'g' : ''); push('Ronda ' + r + ': ' + (ch ? 'las aristas verdes mejoraron alguna distancia.' : 'nada cambió, ya terminó.'), s); if (!ch) break; }
  const neg = E.some(e => d[e.a] + e.w < d[e.b]); push(neg ? 'Una ronda más todavía mejora algo: hay un ciclo negativo.' : 'Una ronda extra no mejora nada: no hay ciclo negativo alcanzable.', s);
}, GR);

V('Graphs-Algorithms-Graph-Traversal-FloydWarshall', 'Floyd-Warshall', 'En cada paso se permite pasar por el nodo k (amarillo); verde = distancias que mejoraron.', push => {
  const n = 4, D = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => i === j ? 0 : Infinity));
  randGraph(n, 2, { wmax: 9 }).forEach(e => { D[e.a][e.b] = D[e.b][e.a] = Math.min(D[e.a][e.b], e.w); });
  const lab = [...Array(n).keys()].map(i => i + 1);
  push('Matriz inicial: solo las aristas directas.', { D, cls: D.map(r => r.map(() => '')) });
  for (let k = 0; k < n; k++) { const cls = D.map((r, i) => r.map((_, j) => i === k || j === k ? 'a' : ''));
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (D[i][k] + D[k][j] < D[i][j]) { D[i][j] = D[i][k] + D[k][j]; cls[i][j] = 'g'; }
    push('k = ' + (k + 1) + ': se prueba ir de i a j pasando por ' + (k + 1) + '.', { D, cls }); }
  push('Distancias mínimas entre todos los pares.', { D, cls: D.map(r => r.map(() => 'g')) });
}, s => table(s.D, s.cls, s.D.map((_, i) => i + 1), s.D.map((_, i) => i + 1)));

V('Graphs-Algorithms-Graph-Traversal-TopologicalSort', 'Orden topológico (Kahn)', 'La etiqueta es cuántas dependencias le faltan; los de 0 entran a la cola.', push => {
  const n = 7, xy = circleLayout(n), perm = shuffle([...Array(n).keys()]), E = [];
  for (let t = 0; t < 9; t++) { const i = R(0, n - 2), j = R(i + 1, n - 1); if (!E.some(e => e.a === perm[i] && e.b === perm[j])) E.push({ a: perm[i], b: perm[j] }); }
  const s = GS(xy, E, true), indeg = Array(n).fill(0); E.forEach(e => indeg[e.b]++); const G = adjOf(n, E, true), order = [];
  s.ns = indeg.slice(); const q = [...Array(n).keys()].filter(v => !indeg[v]); q.forEach(v => s.nc[v] = 'b');
  push('Grados de entrada. Los que tienen 0 (azul) pueden ir primero.', s);
  while (q.length) { const v = q.shift(); order.push(v + 1); s.nc[v] = 'g';
    for (const [u, k] of G[v]) { s.ec[k] = 'x'; if (--indeg[u] === 0) { q.push(u); s.nc[u] = 'b'; } }
    s.ns = indeg.map((d, i) => s.nc[i] === 'g' ? '' : d); push('Sale ' + (v + 1) + '. Orden: ' + order.join(' → '), s); }
}, GR);

V('Graphs-Algorithms-Graph-Traversal-Tarjan', 'Tarjan: componentes fuertemente conexas', 'Etiqueta = descubrimiento/low. Cuando low = descubrimiento, se cierra una componente (color).', push => {
  const n = 7, xy = circleLayout(n), E = randGraph(n, 5, { dir: true }); E.forEach(e => e.w = undefined);
  const s = GS(xy, E, true), G = adjOf(n, E, true), disc = Array(n).fill(-1), low = Array(n).fill(0), on = Array(n).fill(false), st = []; let t = 0, c = 0;
  const lab = () => { s.ns = disc.map((d, i) => d < 0 ? '' : d + '/' + low[i]); };
  push('Grafo dirigido.', s);
  for (let r = 0; r < n; r++) { if (disc[r] >= 0) continue; const call = [[r, 0]]; disc[r] = low[r] = t++; st.push(r); on[r] = true; s.nc[r] = 'a'; lab(); push('Se descubre ' + (r + 1) + '.', s);
    while (call.length) { const top = call[call.length - 1], [v, i] = top;
      if (i < G[v].length) { top[1]++; const [u, k] = G[v][i];
        if (disc[u] < 0) { disc[u] = low[u] = t++; st.push(u); on[u] = true; s.nc[u] = 'a'; s.ec[k] = 'b'; call.push([u, 0]); lab(); push('Se baja a ' + (u + 1) + '.', s); }
        else if (on[u]) { low[v] = Math.min(low[v], disc[u]); lab(); push('Arista hacia ' + (u + 1) + ', que está en la pila: low[' + (v + 1) + '] = ' + low[v] + '.', s); } }
      else { call.pop(); if (call.length) { const p = call[call.length - 1][0]; low[p] = Math.min(low[p], low[v]); }
        if (low[v] === disc[v]) { const col = SCC_COLORS[c++ % 6], mem = []; let x; do { x = st.pop(); on[x] = false; s.nc[x] = col; mem.push(x + 1); } while (x !== v); lab(); push('low = descubrimiento en ' + (v + 1) + ': componente {' + mem.join(', ') + '}.', s); } } } }
  push('Hay ' + c + ' componentes fuertemente conexas.', s);
}, GR);

V('Graphs-Algorithms-Graph-Traversal-Kosaraju', 'Kosaraju: dos recorridos', 'Primera pasada: orden de salida. Segunda: sobre el grafo invertido, cada recorrido es una componente.', push => {
  const n = 7, xy = circleLayout(n), E = randGraph(n, 5, { dir: true }); E.forEach(e => e.w = undefined);
  const s = GS(xy, E, true), G = adjOf(n, E, true), seen = Array(n).fill(false), order = [];
  push('Grafo dirigido original.', s);
  for (let r = 0; r < n; r++) { if (seen[r]) continue; const call = [[r, 0]]; seen[r] = true;
    while (call.length) { const top = call[call.length - 1]; const [v, i] = top; if (i < G[v].length) { top[1]++; const u = G[v][i][0]; if (!seen[u]) { seen[u] = true; call.push([u, 0]); } } else { call.pop(); order.push(v); s.ns[v] = 'sale ' + order.length; s.nc[v] = 'k'; push('Termina ' + (v + 1) + ' (posición ' + order.length + ' en el orden de salida).', s); } } }
  const RE = E.map(e => ({ a: e.b, b: e.a })), s2 = GS(xy, RE, true); s2.ns = s.ns.slice(); push('Se invierten todas las flechas.', s2);
  const GT = adjOf(n, RE, true), comp = Array(n).fill(-1); let c = 0;
  for (const v of order.reverse()) { if (comp[v] >= 0) continue; const col = SCC_COLORS[c % 6], st = [v]; comp[v] = c; const mem = [];
    while (st.length) { const u = st.pop(); mem.push(u + 1); s2.nc[u] = col; for (const [w] of GT[u]) if (comp[w] < 0) { comp[w] = c; st.push(w); } }
    c++; push('Desde ' + (v + 1) + ' (el que salió más tarde): componente {' + mem.join(', ') + '}.', s2); }
}, GR);

V('Graphs-Algorithms-Graph-Traversal-Bipartite', 'Colorear con dos colores', 'Cada vecino recibe el color contrario; dos vecinos iguales = ciclo impar.', push => {
  const n = 8, xy = circleLayout(n), E = randGraph(n, R(1, 3)); E.forEach(e => e.w = undefined);
  const s = GS(xy, E), G = adjOf(n, E), col = Array(n).fill(0);
  push('¿Se puede dividir en dos equipos?', s);
  for (let st = 0; st < n; st++) { if (col[st]) continue; col[st] = 1; s.nc[st] = 'b'; const q = [st]; push('Se pinta ' + (st + 1) + ' de azul.', s);
    while (q.length) { const u = q.shift(); for (const [v, k] of G[u]) { if (!col[v]) { col[v] = 3 - col[u]; s.nc[v] = col[v] === 1 ? 'b' : 'o'; s.ec[k] = 'g'; q.push(v); push((v + 1) + ' recibe el color contrario a ' + (u + 1) + '.', s); }
      else if (col[v] === col[u]) { s.ec[k] = 'r'; push((u + 1) + ' y ' + (v + 1) + ' son vecinos y tienen el mismo color: hay un ciclo impar, IMPOSSIBLE.', s); return; } } } }
  push('Se logró: azules y naranjas son los dos equipos.', s);
}, GR);

V('Graphs-Algorithms-Graph-Traversal-EulerianCycle', 'Circuito euleriano (Hierholzer)', 'Se avanza por aristas libres; al quedar sin salida, el nodo entra al circuito.', push => {
  const n = 6, xy = circleLayout(n), E = [], has = new Set();
  for (let rep = 0; rep < 3; rep++) { const cyc = shuffle([...Array(n).keys()]).slice(0, rep === 0 ? n : R(3, 5)); for (let i = 0; i < cyc.length; i++) { const a = cyc[i], b = cyc[(i + 1) % cyc.length], key = Math.min(a, b) + ',' + Math.max(a, b); if (has.has(key)) continue; has.add(key); E.push({ a, b }); } }
  const deg = Array(n).fill(0); E.forEach(e => { deg[e.a]++; deg[e.b]++; });
  const odd = deg.map((d, i) => d % 2 ? i : -1).filter(i => i >= 0);
  for (let i = 0; i + 1 < odd.length; i += 2) E.push({ a: odd[i], b: odd[i + 1], bend: 30 });
  const s = GS(xy, E), G = adjOf(n, E), used = Array(E.length).fill(false), ptr = Array(n).fill(0), st = [E[0].a], cyc = [];
  s.ns = Array(n).fill(0).map((_, i) => 'grado ' + G[i].length); push('Todos los grados son pares, así que existe el circuito.', s);
  while (st.length) { const v = st[st.length - 1]; while (ptr[v] < G[v].length && used[G[v][ptr[v]][1]]) ptr[v]++;
    if (ptr[v] === G[v].length) { cyc.push(v + 1); st.pop(); s.nc[v] = 'g'; push((v + 1) + ' quedó sin salidas: entra al circuito → ' + cyc.join(' '), s); }
    else { const [u, k] = G[v][ptr[v]]; used[k] = true; s.ec[k] = 'b'; st.push(u); s.nc = s.nc.map((c, i) => i === u ? 'a' : c === 'a' ? '' : c); push('Se avanza de ' + (v + 1) + ' a ' + (u + 1) + '.', s); } }
  push('Circuito que usa cada arista una vez: ' + cyc.join(' → '), s);
}, GR);

V('Graphs-Algorithms-Graph-Traversal-HierholzerDirected', 'Camino euleriano dirigido', 'Etiqueta = salidas − entradas. El inicio debe tener +1 y el final −1.', push => {
  const n = 6, xy = circleLayout(n), E = [], used = new Set(); let v = 0;
  for (let t = 0; t < 12; t++) { const opts = [...Array(n).keys()].filter(u => u !== v && !used.has(v + ',' + u)); if (!opts.length) break; const u = pick(opts); used.add(v + ',' + u); E.push({ a: v, b: u }); v = u; }
  const end = v, s = GS(xy, E, true), bal = Array(n).fill(0); E.forEach(e => { bal[e.a]++; bal[e.b]--; });
  s.ns = bal.map(b => (b > 0 ? '+' : '') + b); s.nc[0] = 'b'; s.nc[end] = 'o'; push('Inicio ' + 1 + ' y final ' + (end + 1) + '; los demás están balanceados.', s);
  const G = adjOf(n, E, true).map(l => l.slice()), st = [0], path = [];
  while (st.length) { const u = st[st.length - 1]; if (G[u].length) { const [w, k] = G[u].pop(); s.ec[k] = 'b'; st.push(w); push('Se usa ' + (u + 1) + ' → ' + (w + 1) + '.', s); } else { path.push(u + 1); st.pop(); s.nc[u] = 'g'; push((u + 1) + ' sin salidas: entra al camino.', s); } }
  push('Camino: ' + path.reverse().join(' → '), s);
}, GR);

V('Graphs-Algorithms-Graph-Traversal-Diameter', 'Diámetro de un árbol', 'Dos BFS: desde cualquier nodo al más lejano (A), y desde A al más lejano (B).', push => {
  const n = 10, T = randTree(n), E = T.par.slice(1).map((p, i) => ({ a: p, b: i + 1 })), s = GS(T.xy, E), G = adjOf(n, E);
  const bfs = r => { const d = Array(n).fill(-1); d[r] = 0; const q = [r]; for (const u of q) for (const [v] of G[u]) if (d[v] < 0) { d[v] = d[u] + 1; q.push(v); } return d; };
  push('Un árbol cualquiera.', s);
  const d0 = bfs(0); s.ns = d0; const A = d0.indexOf(Math.max(...d0)); s.nc[0] = 'b'; s.nc[A] = 'a'; push('BFS desde 1: el más lejano es ' + (A + 1) + ' (distancia ' + d0[A] + ').', s);
  const dA = bfs(A); s.ns = dA; const B = dA.indexOf(Math.max(...dA)); s.nc = s.nc.map(() => ''); s.nc[A] = 'a'; s.nc[B] = 'a'; push('BFS desde ' + (A + 1) + ': el más lejano es ' + (B + 1) + '.', s);
  const par = Array(n).fill(-1), q = [A], seen = Array(n).fill(false); seen[A] = true; for (const u of q) for (const [v, k] of G[u]) if (!seen[v]) { seen[v] = true; par[v] = [u, k]; q.push(v); }
  for (let x = B; x !== A; x = par[x][0]) { s.ec[par[x][1]] = 'g'; s.nc[x] = 'g'; } s.nc[A] = 'g'; push('Diámetro = ' + dA[B] + ' (camino verde).', s);
}, GR);

V('Graphs-Algorithms-MST-Prim', 'Prim: crecer el árbol', 'Verde = árbol actual; amarillo = arista más barata que sale del árbol.', push => {
  const n = 7, xy = circleLayout(n), E = randGraph(n, 5), s = GS(xy, E), inT = Array(n).fill(false); let total = 0;
  inT[0] = true; s.nc[0] = 'g'; push('Se empieza desde el nodo 1.', s);
  for (let it = 1; it < n; it++) { let best = -1; E.forEach((e, k) => { if (inT[e.a] !== inT[e.b] && (best < 0 || e.w < E[best].w)) best = k; });
    if (best < 0) break; s.ec = s.ec.map(c => c === 'a' ? '' : c); s.ec[best] = 'a'; push('La arista más barata que sale del árbol pesa ' + E[best].w + '.', s);
    const e = E[best], v = inT[e.a] ? e.b : e.a; inT[v] = true; total += e.w; s.ec[best] = 'g'; s.nc[v] = 'g'; push('Se agrega el nodo ' + (v + 1) + '. Costo total: ' + total, s); }
  E.forEach((e, k) => { if (s.ec[k] !== 'g') s.ec[k] = 'x'; }); push('Árbol de expansión mínima con costo ' + total + '.', s);
}, GR);

V('Graphs-Algorithms-Miscellaneous-CycleFindingUndirected', 'Encontrar un ciclo (no dirigido)', 'La DFS marca el camino actual (azul); volver a un ancestro cierra un ciclo (verde).', push => {
  const n = 8, xy = circleLayout(n), E = randGraph(n, 2); E.forEach(e => e.w = undefined);
  const s = GS(xy, E), G = adjOf(n, E), vis = Array(n).fill(false), on = Array(n).fill(false), par = Array(n).fill(-1), pe = Array(n).fill(-1);
  push('Grafo no dirigido.', s);
  for (let r = 0; r < n; r++) { if (vis[r]) continue; const call = [[r, 0]]; vis[r] = on[r] = true; s.nc[r] = 'b';
    while (call.length) { const top = call[call.length - 1], [v, i] = top;
      if (i < G[v].length) { top[1]++; const [u, k] = G[v][i]; if (k === pe[v]) continue;
        if (!vis[u]) { vis[u] = on[u] = true; par[u] = v; pe[u] = k; s.nc[u] = 'b'; s.ec[k] = 'b'; call.push([u, 0]); push('Se baja de ' + (v + 1) + ' a ' + (u + 1) + '.', s); }
        else if (on[u]) { s.ec[k] = 'g'; s.nc[u] = 'g'; const cyc = [u + 1]; for (let x = v; x !== u; x = par[x]) { s.nc[x] = 'g'; s.ec[pe[x]] = 'g'; cyc.push(x + 1); } push('La arista ' + (v + 1) + '–' + (u + 1) + ' vuelve a un ancestro: ciclo ' + cyc.reverse().join(' → ') + ' → ' + (u + 1), s); return; } }
      else { call.pop(); on[v] = false; s.nc[v] = 'k'; push((v + 1) + ' no tiene más vecinos: se sale del camino.', s); } } }
  push('No hay ciclos: el grafo es un bosque.', s);
}, GR);

V('Graphs-Algorithms-Miscellaneous-CycleFindingDirected', 'Encontrar un ciclo dirigido', 'Solo hay ciclo si una flecha apunta a un nodo que está en el camino actual (azul).', push => {
  const n = 7, xy = circleLayout(n), E = randGraph(n, 3, { dir: true }); E.forEach(e => e.w = undefined);
  const s = GS(xy, E, true), G = adjOf(n, E, true), vis = Array(n).fill(false), on = Array(n).fill(false), par = Array(n).fill(-1), pe = Array(n).fill(-1);
  push('Grafo dirigido.', s);
  for (let r = 0; r < n; r++) { if (vis[r]) continue; const call = [[r, 0]]; vis[r] = on[r] = true; s.nc[r] = 'b';
    while (call.length) { const top = call[call.length - 1], [v, i] = top;
      if (i < G[v].length) { top[1]++; const [u, k] = G[v][i];
        if (!vis[u]) { vis[u] = on[u] = true; par[u] = v; pe[u] = k; s.nc[u] = 'b'; s.ec[k] = 'b'; call.push([u, 0]); push('Se baja de ' + (v + 1) + ' a ' + (u + 1) + '.', s); }
        else if (on[u]) { s.ec[k] = 'g'; s.nc[u] = 'g'; for (let x = v; x !== u; x = par[x]) { s.nc[x] = 'g'; s.ec[pe[x]] = 'g'; } push('La flecha ' + (v + 1) + ' → ' + (u + 1) + ' llega a un nodo del camino actual: ¡ciclo!', s); return; }
        else { s.ec[k] = 'x'; push('La flecha ' + (v + 1) + ' → ' + (u + 1) + ' llega a un nodo ya terminado: no es ciclo.', s); } }
      else { call.pop(); on[v] = false; s.nc[v] = 'k'; push((v + 1) + ' terminado (gris).', s); } } }
  push('No hay ciclo dirigido.', s);
}, GR);

V('Graphs-Algorithms-Miscellaneous-2-SAT', '2-SAT con el grafo de implicaciones', 'Cada cláusula (a ∨ b) agrega ¬a → b y ¬b → a. Si x y ¬x quedan en la misma componente, no hay solución.', push => {
  const m = 3, nodes = [], xy = []; for (let i = 0; i < m; i++) { xy.push({ x: 90 + i * 180, y: 60 }); xy.push({ x: 90 + i * 180, y: 220 }); }
  const lab = []; for (let i = 0; i < m; i++) { lab.push('x' + (i + 1)); lab.push('¬x' + (i + 1)); }
  const lit = () => 2 * R(0, m - 1) + R(0, 1), cls = Array.from({ length: 4 }, () => [lit(), lit()]).filter(([a, b]) => a !== b);
  const E = [], s = GS(xy, E, true); s.lab = lab;
  push('Variables x1..x3: arriba verdadero, abajo falso.', s);
  for (const [a, b] of cls) { E.push({ a: a ^ 1, b, bend: 18 }); E.push({ a: b ^ 1, b: a, bend: 18 }); const t = GS(xy, E, true); t.lab = lab; t.ec = E.map((_, k) => k >= E.length - 2 ? 'a' : ''); push('Cláusula (' + lab[a] + ' ∨ ' + lab[b] + '): ' + lab[a ^ 1] + ' → ' + lab[b] + ' y ' + lab[b ^ 1] + ' → ' + lab[a], t); }
  const n = 2 * m, G = adjOf(n, E, true), RG = adjOf(n, E.map(e => ({ a: e.b, b: e.a })), true), seen = Array(n).fill(false), ord = [];
  const d1 = v => { seen[v] = true; for (const [u] of G[v]) if (!seen[u]) d1(u); ord.push(v); }; for (let v = 0; v < n; v++) if (!seen[v]) d1(v);
  const comp = Array(n).fill(-1); let c = 0; const d2 = v => { comp[v] = c; for (const [u] of RG[v]) if (comp[u] < 0) d2(u); }; for (const v of ord.reverse()) if (comp[v] < 0) { d2(v); c++; }
  const f = GS(xy, E, true); f.lab = lab; f.nc = comp.map(x => SCC_COLORS[x % 6]); push('Componentes fuertemente conexas (mismo color = mismo grupo).', f);
  const bad = [...Array(m).keys()].some(i => comp[2 * i] === comp[2 * i + 1]);
  if (bad) { push('Una variable y su negación están en la misma componente: IMPOSSIBLE.', f); return; }
  const g = GS(xy, E, true); g.lab = lab; for (let i = 0; i < m; i++) { const tv = comp[2 * i] > comp[2 * i + 1]; g.nc[2 * i] = tv ? 'g' : 'r'; g.nc[2 * i + 1] = tv ? 'r' : 'g'; }
  push('Se elige el literal cuya componente va después en el orden topológico: ' + [...Array(m).keys()].map(i => 'x' + (i + 1) + ' = ' + (comp[2 * i] > comp[2 * i + 1] ? 'V' : 'F')).join(', '), g);
}, GR);

// ---- árboles ----
const treeState = (n, W, H) => { const T = randTree(n, W, H); const E = T.par.slice(1).map((p, i) => ({ a: p, b: i + 1 })); return { T, E, s: GS(T.xy, E) }; };

V('Graphs-Algorithms-Trees-LCA', 'Ancestro común más cercano', 'Primero se igualan las alturas y luego ambos suben con saltos de potencias de 2.', push => {
  const n = 12, { T, s } = treeState(n), up = [T.par.map(p => p < 0 ? 0 : p)];
  for (let j = 1; j < 4; j++) up.push(up[j - 1].map(v => up[j - 1][v]));
  let a = R(4, n - 1), b = R(1, n - 1); while (b === a) b = R(1, n - 1);
  s.ns = T.depth.map(d => 'prof ' + d); s.nc[a] = 'b'; s.nc[b] = 'o'; push('Buscar el ancestro común de ' + (a + 1) + ' y ' + (b + 1) + '.', s);
  if (T.depth[a] < T.depth[b]) [a, b] = [b, a];
  let diff = T.depth[a] - T.depth[b];
  for (let j = 3; j >= 0; j--) if (diff >> j & 1) { s.nc[a] = ''; a = up[j][a]; s.nc[a] = s.nc[a] === 'o' ? 'g' : 'b'; push('Se sube ' + (1 << j) + ' nivel(es): ahora en ' + (a + 1) + '.', s); }
  if (a === b) { s.nc[a] = 'g'; push('Quedaron en el mismo nodo: el ancestro común es ' + (a + 1) + '.', s); return; }
  for (let j = 3; j >= 0; j--) if (up[j][a] !== up[j][b]) { s.nc[a] = ''; s.nc[b] = ''; a = up[j][a]; b = up[j][b]; s.nc[a] = 'b'; s.nc[b] = 'o'; push('Ambos suben ' + (1 << j) + ' nivel(es) sin juntarse.', s); }
  const l = up[0][a]; s.nc[l] = 'g'; push('El padre de ambos es el ancestro común: ' + (l + 1) + '.', s);
}, GR);

V('Graphs-Algorithms-Trees-BinaryLifting', 'Saltos en potencias de 2', 'Cada planeta apunta a otro. Para k saltos se usan solo los bits encendidos de k.', push => {
  const n = 8, xy = circleLayout(n), t = Array.from({ length: n }, (_, i) => { let v = R(0, n - 1); while (v === i) v = R(0, n - 1); return v; });
  const E = t.map((b, a) => ({ a, b })), s = GS(xy, E, true), up = [t]; for (let j = 1; j < 5; j++) up.push(up[j - 1].map(v => up[j - 1][v]));
  let x = R(0, n - 1), k = R(5, 25); const start = x;
  s.nc[x] = 'b'; push('Desde el planeta ' + (x + 1) + ', ' + k + ' saltos. En binario: ' + k.toString(2) + '.', s);
  for (let j = 0; j < 5; j++) if (k >> j & 1) { s.nc[x] = 'k'; x = up[j][x]; s.nc[x] = 'b'; push('Bit ' + j + ' encendido: salto de ' + (1 << j) + ' → planeta ' + (x + 1) + '.', s); }
  s.nc[x] = 'g'; push('Tras ' + k + ' saltos desde ' + (start + 1) + ' se llega a ' + (x + 1) + '.', s);
}, GR);

V('Graphs-Algorithms-Trees-Centroid', 'Encontrar el centroide', 'Etiqueta = tamaño del subárbol. Se baja al hijo con más de la mitad de los nodos.', push => {
  const n = 11, { T, s } = treeState(n), sz = Array(n).fill(1), order = [0]; for (const u of order) order.push(...T.kids[u]);
  for (const u of order.slice().reverse()) if (T.par[u] >= 0) sz[T.par[u]] += sz[u];
  s.ns = sz; push('Tamaños de los subárboles. La mitad de ' + n + ' es ' + Math.floor(n / 2) + '.', s);
  let u = 0; s.nc[u] = 'a'; push('Se empieza en la raíz.', s);
  while (true) { const nx = T.kids[u].find(v => sz[v] > n / 2); if (nx === undefined) break; s.nc[u] = 'k'; u = nx; s.nc[u] = 'a'; push('El hijo ' + (u + 1) + ' tiene ' + sz[u] + ' > ' + Math.floor(n / 2) + ' nodos: se baja.', s); }
  s.nc[u] = 'g'; push('Ningún pedazo supera la mitad: el centroide es ' + (u + 1) + '.', s);
}, GR);

V('Graphs-Algorithms-Trees-CentroidDecomposition', 'Descomposición por centroides', 'Cada color es un nivel: se quita el centroide y se repite en cada pedazo.', push => {
  const n = 13, { T, E, s } = treeState(n), G = adjOf(n, E), rem = Array(n).fill(false), lvl = Array(n).fill(-1), cols = ['r', 'o', 'a', 'b', 'p', 'g'];
  push('Árbol inicial.', s); const st = [[0, 0]];
  while (st.length) { const [r, d] = st.shift(); const comp = [r], par = { [r]: -1 }; for (const u of comp) for (const [v] of G[u]) if (!rem[v] && v !== par[u]) { par[v] = u; comp.push(v); }
    const sz = {}; for (const u of comp.slice().reverse()) { sz[u] = 1; for (const [v] of G[u]) if (!rem[v] && v !== par[u]) sz[u] += sz[v]; }
    let c = r; while (true) { const nx = G[c].map(x => x[0]).find(v => !rem[v] && v !== par[c] && 2 * sz[v] > comp.length); if (nx === undefined) break; c = nx; }
    rem[c] = true; lvl[c] = d; s.nc[c] = cols[d % 6]; s.ns[c] = 'nivel ' + d; G[c].forEach(([v, k]) => { if (!rem[v]) s.ec[k] = 'x'; });
    push('Pedazo de ' + comp.length + ' nodos: su centroide es ' + (c + 1) + ' (nivel ' + d + ').', s);
    for (const [v] of G[c]) if (!rem[v]) st.push([v, d + 1]); }
  push('Cada nodo es centroide de un solo nivel; hay ' + (Math.max(...lvl) + 1) + ' niveles (≈ log₂ n).', s);
}, GR);

V('Graphs-Algorithms-Trees-EulerTour', 'Euler Tour: aplanar el árbol', 'Etiqueta = [entrada, salida]. Cada subárbol ocupa un tramo seguido del arreglo.', push => {
  const n = 9, { T, s } = treeState(n), tin = Array(n).fill(0), tout = Array(n).fill(0), arr = []; let timer = 0;
  push('Recorrido DFS desde la raíz.', Object.assign(s, { arr: [], hl: [] }));
  const st = [[0, 0]]; tin[0] = ++timer; arr.push(1); s.ns[0] = '[' + tin[0] + ',·]'; s.nc[0] = 'b'; push('Entra 1 en la posición 1.', Object.assign(s, { arr: arr.slice() }));
  while (st.length) { const top = st[st.length - 1], [u, i] = top;
    if (i < T.kids[u].length) { top[1]++; const v = T.kids[u][i]; tin[v] = ++timer; arr.push(v + 1); s.ns[v] = '[' + tin[v] + ',·]'; s.nc[v] = 'b'; st.push([v, 0]); push('Entra ' + (v + 1) + ' en la posición ' + tin[v] + '.', Object.assign(s, { arr: arr.slice() })); }
    else { st.pop(); tout[u] = timer; s.ns[u] = '[' + tin[u] + ',' + tout[u] + ']'; s.nc[u] = 'g'; push('Sale ' + (u + 1) + ': su subárbol ocupa las posiciones ' + tin[u] + '..' + tout[u] + '.', Object.assign(s, { arr: arr.slice() })); } }
  const v = R(1, n - 1); push('Ejemplo: el subárbol de ' + (v + 1) + ' es el tramo ' + tin[v] + '..' + tout[v] + ' (amarillo).', Object.assign(s, { hl: [tin[v], tout[v]] }));
}, s => GR(s) + rows([{ t: 'posición', v: s.arr.map((_, i) => i + 1) }, { t: 'nodo', v: s.arr.length ? s.arr : [null], c: s.arr.map((_, i) => s.hl.length && i + 1 >= s.hl[0] && i + 1 <= s.hl[1] ? 'a' : '') }]));

V('Graphs-Algorithms-Trees-TreeDistances', 'Distancia máxima desde cada nodo', 'Los extremos del diámetro (A y B) son siempre los nodos más lejanos.', push => {
  const n = 10, { T, E, s } = treeState(n), G = adjOf(n, E);
  const bfs = r => { const d = Array(n).fill(-1); d[r] = 0; const q = [r]; for (const u of q) for (const [v] of G[u]) if (d[v] < 0) { d[v] = d[u] + 1; q.push(v); } return d; };
  const d0 = bfs(0), A = d0.indexOf(Math.max(...d0)), dA = bfs(A), B = dA.indexOf(Math.max(...dA)), dB = bfs(B);
  s.nc[A] = 'b'; s.ns = dA.map(x => 'A:' + x); push('Extremo A = ' + (A + 1) + ' (el más lejano desde 1). Distancias a A.', s);
  s.nc[B] = 'o'; s.ns = dB.map(x => 'B:' + x); push('Extremo B = ' + (B + 1) + '. Distancias a B.', s);
  s.ns = dA.map((x, i) => Math.max(x, dB[i])); s.nc = s.nc.map((c, i) => i === A ? 'b' : i === B ? 'o' : 'g'); push('Para cada nodo, la respuesta es el máximo entre su distancia a A y a B.', s);
}, GR);

// dos árboles lado a lado con ids canónicos
function twoTrees(iso) {
  const n = 7, T1 = randTree(n, 260, 240); let T2;
  if (iso) { const perm = shuffle([...Array(n).keys()].slice(1)); const map = [0, ...perm]; const par = Array(n).fill(-1); T1.par.forEach((p, i) => { if (p >= 0) par[map[i]] = map[p]; });
    const kids = Array.from({ length: n }, () => []); par.forEach((p, i) => { if (p >= 0) kids[p].push(i); }); const depth = Array(n).fill(0), ord = [0]; for (const u of ord) for (const v of kids[u]) { depth[v] = depth[u] + 1; ord.push(v); }
    T2 = { par, kids, depth, xy: null }; const leaf = { c: 0 }, pos = []; const place = u => { if (!kids[u].length) return pos[u] = leaf.c++; const xs = kids[u].map(place); return pos[u] = (Math.min(...xs) + Math.max(...xs)) / 2; }; place(0); const md = Math.max(...depth);
    T2.xy = pos.map((p, u) => ({ x: Math.round(30 + 200 * (leaf.c > 1 ? p / (leaf.c - 1) : 0.5)), y: Math.round(30 + 180 * (md ? depth[u] / md : 0)) })); }
  else T2 = randTree(n, 260, 240);
  const xy = T1.xy.concat(T2.xy.map(p => ({ x: p.x + 280, y: p.y }))), E = T1.par.slice(1).map((p, i) => ({ a: p, b: i + 1 })).concat(T2.par.map((p, i) => p >= 0 ? { a: p + n, b: i + n } : null).filter(Boolean));
  return { n, T1, T2, xy, E };
}
function canonSteps(push, s, T, off, ids, tag) {
  const order = [0]; for (const u of order) order.push(...T.kids[u]); const id = Array(T.par.length);
  for (const u of order.reverse()) { const key = T.kids[u].map(v => id[v]).sort((a, b) => a - b).join(','); if (!(key in ids)) ids[key] = Object.keys(ids).length; id[u] = ids[key]; s.ns[u + off] = 'id ' + id[u]; s.nc[u + off] = 'b'; push(tag + ': hijos con ids [' + key + '] → id ' + id[u] + '.', s); }
  return id[0];
}
V('Graphs-Algorithms-Trees-TreeIsomorfismRooted', 'Isomorfismo de árboles con raíz', 'Cada lista ordenada de ids de hijos recibe un id; formas iguales reciben el mismo id.', push => {
  const iso = R(0, 1) === 1, { n, T1, T2, xy, E } = twoTrees(iso), s = GS(xy, E); push('Dos árboles con raíz (la raíz es el nodo de arriba).', s);
  const ids = {}, a = canonSteps(push, s, T1, 0, ids, 'Árbol 1'), b = canonSteps(push, s, T2, n, ids, 'Árbol 2');
  s.nc[0] = s.nc[n] = a === b ? 'g' : 'r'; push(a === b ? 'Las raíces tienen el mismo id (' + a + '): son isomorfos, YES.' : 'Las raíces tienen ids distintos (' + a + ' y ' + b + '): NO son isomorfos.', s);
}, GR);
V('Graphs-Algorithms-Trees-TreeIsomorfism', 'Isomorfismo de árboles sin raíz', 'Se usa como raíz el centroide de cada árbol y se comparan los ids canónicos.', push => {
  const iso = R(0, 1) === 1, { n, T1, T2, xy, E } = twoTrees(iso), s = GS(xy, E); push('Dos árboles sin raíz.', s);
  const reroot = T => { const G = Array.from({ length: n }, () => []); T.par.forEach((p, i) => { if (p >= 0) { G[p].push(i); G[i].push(p); } });
    const sz = Array(n).fill(1), ord = [0], par = Array(n).fill(-1); for (const u of ord) for (const v of G[u]) if (v !== par[u]) { par[v] = u; ord.push(v); } for (const u of ord.slice().reverse()) if (par[u] >= 0) sz[par[u]] += sz[u];
    const cs = [...Array(n).keys()].filter(u => Math.max(n - sz[u], ...G[u].filter(v => v !== par[u]).map(v => sz[v])) <= n / 2);
    const c = cs[0], p2 = Array(n).fill(-1), kids = Array.from({ length: n }, () => []), o2 = [c]; for (const u of o2) for (const v of G[u]) if (v !== p2[u] && v !== c) { p2[v] = u; kids[u].push(v); o2.push(v); }
    return { c, cs, T: { par: p2, kids: kids, root: c } }; };
  const r1 = reroot(T1), r2 = reroot(T2);
  r1.cs.forEach(c => s.nc[c] = 'a'); r2.cs.forEach(c => s.nc[c + n] = 'a'); push('Centroides (amarillo): son la raíz natural de cada árbol.', s);
  const canon = (R0, off, ids, tag) => { const order = [R0.c]; for (const u of order) order.push(...R0.T.kids[u]); const id = {};
    for (const u of order.reverse()) { const key = R0.T.kids[u].map(v => id[v]).sort((a, b) => a - b).join(','); if (!(key in ids)) ids[key] = Object.keys(ids).length; id[u] = ids[key]; s.ns[u + off] = 'id ' + id[u]; push(tag + ': nodo ' + (u + 1) + ' → id ' + id[u] + '.', s); } return id[R0.c]; };
  const ids = {}; const b = canon(r2, n, ids, 'Árbol 2'); let ok = false;
  for (const c of r1.cs) { const a = canon({ c, T: reroot(T1).c === c ? r1.T : (function () { const G = Array.from({ length: n }, () => []); T1.par.forEach((p, i) => { if (p >= 0) { G[p].push(i); G[i].push(p); } }); const p2 = Array(n).fill(-1), kids = Array.from({ length: n }, () => []), o2 = [c]; for (const u of o2) for (const v of G[u]) if (v !== p2[u] && v !== c) { p2[v] = u; kids[u].push(v); o2.push(v); } return { par: p2, kids }; })() }, 0, ids, 'Árbol 1 (raíz ' + (c + 1) + ')'); if (a === b) { ok = true; break; } }
  push(ok ? 'Con raíz en los centroides coinciden los ids: son isomorfos, YES.' : 'Ninguna combinación de centroides coincide: NO son isomorfos.', s);
}, GR);

// ---- flujos ----
function flowNet() {
  const n = 6, xy = [{ x: 50, y: 150 }, { x: 190, y: 60 }, { x: 190, y: 240 }, { x: 350, y: 60 }, { x: 350, y: 240 }, { x: 490, y: 150 }];
  const E = [[0, 1], [0, 2], [1, 3], [2, 4], [1, 4], [2, 1], [3, 5], [4, 5], [4, 3]].map(([a, b]) => ({ a, b, w: R(2, 9) }));
  return { n, xy, E };
}
const flowLab = (E, f) => E.map((e, k) => f[k] + '/' + e.w);
function augmentSteps(push, n, xy, E, useBfs, title) {
  const f = E.map(() => 0); let total = 0; const s = GS(xy, E, true); s.lab = ['S', 2, 3, 4, 5, 'T']; s.el = flowLab(E, f);
  push('Etiqueta = flujo/capacidad. Se buscan caminos de S a T con capacidad sobrante.', s);
  for (let it = 0; it < 12; it++) {
    const prev = Array(n).fill(null); prev[0] = [-1, 0]; const q = [0];
    while (q.length && !prev[n - 1]) { const u = useBfs ? q.shift() : q.pop(); E.forEach((e, k) => {
      if (e.a === u && !prev[e.b] && f[k] < e.w) { prev[e.b] = [k, 1]; q.push(e.b); }
      if (e.b === u && !prev[e.a] && f[k] > 0) { prev[e.a] = [k, -1]; q.push(e.a); } }); }
    if (!prev[n - 1]) break;
    let b = Infinity, path = []; for (let v = n - 1; v !== 0;) { const [k, d] = prev[v]; path.push([k, d]); b = Math.min(b, d > 0 ? E[k].w - f[k] : f[k]); v = d > 0 ? E[k].a : E[k].b; }
    s.ec = E.map((e, k) => f[k] === e.w ? 'r' : f[k] ? 'b' : ''); path.forEach(([k, d]) => s.ec[k] = d > 0 ? 'a' : 'p');
    push('Camino ' + (it + 1) + ' (amarillo' + (path.some(p => p[1] < 0) ? '; morado = se devuelve flujo' : '') + '): cuello de botella ' + b + '.', s);
    path.forEach(([k, d]) => f[k] += d * b); total += b; s.el = flowLab(E, f); s.ec = E.map((e, k) => f[k] === e.w ? 'r' : f[k] ? 'b' : '');
    push('Se envían ' + b + '. Flujo total: ' + total + ' (rojo = arista llena).', s);
  }
  const seen = Array(n).fill(false); seen[0] = true; const q = [0]; for (const u of q) E.forEach((e, k) => { if (e.a === u && !seen[e.b] && f[k] < e.w) { seen[e.b] = true; q.push(e.b); } if (e.b === u && !seen[e.a] && f[k] > 0) { seen[e.a] = true; q.push(e.a); } });
  s.nc = seen.map(x => x ? 'g' : 'o'); push(title + ': flujo máximo = ' + total + '. Verde = lado de S en el corte mínimo; las aristas rojas que cruzan suman ' + total + '.', s);
}
V('Graphs-Algorithms-Flow-Algoritms-EdmonsKarp', 'Edmonds-Karp', 'Cada vez se usa el camino aumentante más corto (BFS).', push => { const { n, xy, E } = flowNet(); augmentSteps(push, n, xy, E, true, 'No quedan caminos'); }, GR);

V('Graphs-Algorithms-Flow-Algoritms-Dinic', 'Dinic: niveles y flujo bloqueante', 'Etiqueta del nodo = nivel BFS. Solo se usan aristas que suben exactamente un nivel.', push => {
  const { n, xy, E } = flowNet(), f = E.map(() => 0); let total = 0; const s = GS(xy, E, true); s.lab = ['S', 2, 3, 4, 5, 'T']; s.el = flowLab(E, f);
  push('Red de flujo: flujo/capacidad.', s);
  for (let phase = 1; phase < 8; phase++) {
    const lv = Array(n).fill(-1); lv[0] = 0; const q = [0]; for (const u of q) E.forEach((e, k) => { if (e.a === u && lv[e.b] < 0 && f[k] < e.w) { lv[e.b] = lv[u] + 1; q.push(e.b); } if (e.b === u && lv[e.a] < 0 && f[k] > 0) { lv[e.a] = lv[u] + 1; q.push(e.a); } });
    s.ns = lv.map(l => l < 0 ? '—' : 'nivel ' + l); s.ec = E.map((e, k) => (lv[e.b] === lv[e.a] + 1 && f[k] < e.w) || (lv[e.a] === lv[e.b] + 1 && f[k] > 0) ? 'b' : 'x');
    if (lv[n - 1] < 0) { push('T no es alcanzable: termina con flujo máximo ' + total + '.', s); return; }
    push('Fase ' + phase + ': grafo de niveles (azul = aristas útiles).', s); let sent = 0;
    while (true) { const dfs = (u, lim, path) => { if (u === n - 1) return [lim, path]; for (let k = 0; k < E.length; k++) { const e = E[k];
        if (e.a === u && lv[e.b] === lv[u] + 1 && f[k] < e.w) { const r = dfs(e.b, Math.min(lim, e.w - f[k]), path.concat([[k, 1]])); if (r) return r; }
        if (e.b === u && lv[e.a] === lv[u] + 1 && f[k] > 0) { const r = dfs(e.a, Math.min(lim, f[k]), path.concat([[k, -1]])); if (r) return r; } } return null; };
      const r = dfs(0, Infinity, []); if (!r) break; const [b, path] = r; path.forEach(([k, d]) => f[k] += d * b); total += b; sent += b; s.el = flowLab(E, f);
      const ec = s.ec.slice(); path.forEach(([k]) => s.ec[k] = 'a'); push('Dentro de la fase se envían ' + b + ' por un camino de niveles. Total: ' + total, s); s.ec = ec.map((c, k) => f[k] === E[k].w ? 'r' : c); }
    push('Fin de la fase ' + phase + ' (flujo bloqueante de ' + sent + ').', s);
  }
}, GR);

V('Graphs-Algorithms-Flow-Algoritms-BipartiteMatching', 'Emparejamiento bipartito (Kuhn)', 'Cada niño de la izquierda busca pareja; si está ocupada, se intenta reacomodar al otro.', push => {
  const L = 4, Rr = 4, xy = []; for (let i = 0; i < L; i++) xy.push({ x: 140, y: 40 + i * 70 }); for (let j = 0; j < Rr; j++) xy.push({ x: 400, y: 40 + j * 70 });
  const E = []; for (let i = 0; i < L; i++) { const cs = shuffle([...Array(Rr).keys()]).slice(0, R(1, 3)); cs.forEach(j => E.push({ a: i, b: L + j })); }
  const s = GS(xy, E); s.lab = [...Array(L).keys()].map(i => 'N' + (i + 1)).concat([...Array(Rr).keys()].map(j => 'C' + (j + 1)));
  const mR = Array(Rr).fill(-1), mE = Array(Rr).fill(-1); const paint = () => { s.ec = E.map((_, k) => mE.includes(k) ? 'g' : ''); s.nc = s.nc.map((_, v) => v < L ? (mR.includes(v) ? 'g' : '') : (mR[v - L] >= 0 ? 'g' : '')); };
  push('Niños (izquierda) y niñas (derecha); las líneas son las parejas posibles.', s);
  for (let i = 0; i < L; i++) { const vis = Array(Rr).fill(false), path = [];
    const tryK = u => { for (let k = 0; k < E.length; k++) { const e = E[k]; if (e.a !== u) continue; const j = e.b - L; if (vis[j]) continue; vis[j] = true; path.push(k); if (mR[j] < 0 || tryK(mR[j])) { mR[j] = u; mE[j] = k; return true; } } return false; };
    const ok = tryK(i); paint(); s.nc[i] = ok ? 'g' : 'r'; path.forEach(k => { if (!mE.includes(k)) s.ec[k] = 'x'; });
    push('N' + (i + 1) + ': ' + (ok ? 'consigue pareja (camino alternante, se reacomodan los demás).' : 'no hay forma de emparejarlo.'), s); }
  push('Parejas máximas: ' + mR.filter(x => x >= 0).length + '.', s);
}, GR);

function mcmfSteps(push, stopWhenPositive) {
  const { n, xy, E } = flowNet(); E.forEach(e => { e.c = R(1, 6); e.w = R(1, 4); }); const f = E.map(() => 0); let flow = 0, cost = 0;
  const s = GS(xy, E, true); s.lab = ['S', 2, 3, 4, 5, 'T']; const lab = () => { s.el = E.map((e, k) => f[k] + '/' + e.w + ' $' + e.c); }; lab();
  push('Etiqueta = flujo/capacidad $costo por unidad.', s);
  for (let it = 0; it < 10; it++) {
    const d = Array(n).fill(Infinity), prev = Array(n).fill(null); d[0] = 0;
    for (let r = 0; r < n; r++) E.forEach((e, k) => { if (f[k] < e.w && d[e.a] + e.c < d[e.b]) { d[e.b] = d[e.a] + e.c; prev[e.b] = [k, 1]; } if (f[k] > 0 && d[e.b] - e.c < d[e.a]) { d[e.a] = d[e.b] - e.c; prev[e.a] = [k, -1]; } });
    if (d[n - 1] === Infinity) break;
    if (stopWhenPositive && d[n - 1] >= 0) { s.ns = d.map(fmt); push('El camino más barato ahora cuesta ' + d[n - 1] + ' ≥ 0: enviar más ya no ahorra. Se detiene.', s); break; }
    let b = Infinity, path = []; for (let v = n - 1; v !== 0;) { const [k, dd] = prev[v]; path.push([k, dd]); b = Math.min(b, dd > 0 ? E[k].w - f[k] : f[k]); v = dd > 0 ? E[k].a : E[k].b; }
    s.ns = d.map(fmt); s.ec = E.map((e, k) => f[k] === e.w ? 'r' : f[k] ? 'b' : ''); path.forEach(([k]) => s.ec[k] = 'a'); push('Camino más barato (Bellman-Ford): $' + d[n - 1] + ' por unidad, capacidad ' + b + '.', s);
    path.forEach(([k, dd]) => f[k] += dd * b); flow += b; cost += b * d[n - 1]; lab(); s.ec = E.map((e, k) => f[k] === e.w ? 'r' : f[k] ? 'b' : ''); push('Flujo ' + flow + ', costo total $' + cost + '.', s);
  }
  push('Resultado: flujo ' + flow + ' con costo mínimo $' + cost + '.', s);
}
V('Graphs-Algorithms-Flow-Algoritms-MinCostMaxFlow', 'Flujo máximo de costo mínimo', 'Siempre se aumenta por el camino más barato; la etiqueta del nodo es su distancia en costo.', push => mcmfSteps(push, false), GR);
V('Graphs-Algorithms-Flow-Algoritms-MinCostAnyFlow', 'Flujo de costo mínimo (cualquier cantidad)', 'Como el anterior, pero se para cuando el siguiente camino ya no tiene costo negativo.', push => {
  const old = R; mcmfSteps(push, true);
}, GR);

// =================== Strings ===================
const STRS = ['abacaba', 'aabxaab', 'banana', 'abcabcab', 'aaabaaa', 'mississippi', 'abracadabra'];
const strRows = (str, extra, hl) => rows([{ t: 'i', v: [...str].map((_, i) => i) }, { t: 's', v: [...str], c: [...str].map((_, i) => hl ? hl(i) : '') }].concat(extra || []));

V('Strings-Algorithms-ZFunction', 'Función Z', 'z[i] = cuánto coincide el texto desde i con el inicio. Azul = la caja [l, r] que se reutiliza.', push => {
  const s = pick(STRS), n = s.length, z = Array(n).fill(null); z[0] = n; let l = 0, r = 0;
  push('z[0] es la longitud completa.', { s, z: z.slice(), l, r, i: 0 });
  for (let i = 1; i < n; i++) { let k = 0; if (i < r) k = Math.min(r - i, z[i - l]); const from = k; while (i + k < n && s[k] === s[i + k]) k++; z[i] = k; if (i + k > r) { l = i; r = i + k; }
    push('i = ' + i + ': ' + (from ? 'se reutilizan ' + from + ' de la caja y ' : '') + 'se compara hasta z[' + i + '] = ' + k + '.', { s, z: z.slice(), l, r, i }); }
}, st => strRows(st.s, [{ t: 'z', v: st.z, c: st.z.map((_, j) => j === st.i ? 'a' : '') }], j => j === st.i ? 'a' : j >= st.l && j < st.r ? 'b' : ''));

V('Strings-Algorithms-RabinKarp', 'Rabin-Karp (hash rodante)', 'La ventana desliza: se quita la letra de la izquierda y se agrega la de la derecha.', push => {
  const t = pick(['abracadabra', 'banananaba', 'abcabcabca']), m = 3, p = t.substr(R(0, t.length - m), m), B = 31, M = 101, h = str => [...str].reduce((a, c) => (a * B + c.charCodeAt(0)) % M, 0);
  const hp = h(p); let hw = h(t.substr(0, m)); const pw = Array(m - 1).fill(B).reduce((a, b) => a * b % M, 1), found = [];
  for (let i = 0; i + m <= t.length; i++) { if (i) hw = ((hw - t.charCodeAt(i - 1) * pw % M + M) * B + t.charCodeAt(i + m - 1)) % M; const eq = hw === hp && t.substr(i, m) === p; if (eq) found.push(i);
    push('Ventana ' + i + ': hash ' + hw + (hw === hp ? (eq ? ' = hash del patrón y coincide.' : ' = hash del patrón pero no coincide (colisión).') : ' ≠ ' + hp + '.'), { t, i, m, p, hp, eq, found: found.slice() }); }
  push('Patrón "' + p + '" en las posiciones: ' + found.join(', '), { t, i: -1, m, p, hp, found });
}, st => strRows(st.t, [{ t: 'patrón', v: [...st.p] }], j => st.found.some(f => j >= f && j < f + st.m) && st.i < 0 ? 'g' : j >= st.i && j < st.i + st.m && st.i >= 0 ? (st.eq ? 'g' : 'a') : ''));

V('Strings-Algorithms-PrefixTrie', 'Trie de palabras', 'Cada camino desde la raíz es un prefijo; verde = termina una palabra.', push => {
  const words = shuffle(['ab', 'abc', 'abd', 'b', 'ba', 'bca', 'ac', 'cab']).slice(0, 5), nodes = [{ ch: '·', kids: {}, end: false, d: 0, par: -1 }];
  const draw = hl => { const W = 540, leaves = []; const place = (u, d) => { const ks = Object.values(nodes[u].kids); if (!ks.length) { nodes[u].px = leaves.length; leaves.push(u); } else { ks.forEach(v => place(v, d + 1)); nodes[u].px = (nodes[ks[0]].px + nodes[ks[ks.length - 1]].px) / 2; } nodes[u].d = d; }; place(0, 0);
    const xy = nodes.map(nd => ({ x: Math.round(30 + (W - 60) * (leaves.length > 1 ? nd.px / (leaves.length - 1) : 0.5)), y: 30 + nd.d * 60 }));
    return { xy, E: nodes.slice(1).map((nd, i) => ({ a: nd.par, b: i + 1 })), lab: nodes.map(nd => nd.ch), nc: nodes.map((nd, i) => hl.includes(i) ? 'a' : nd.end ? 'g' : ''), ns: nodes.map(() => ''), ec: nodes.slice(1).map((_, i) => hl.includes(i + 1) ? 'a' : ''), el: nodes.slice(1).map(() => ''), dir: false }; };
  push('Trie vacío.', draw([]));
  for (const w of words) { let u = 0; const path = [0]; for (const c of w) { if (!(c in nodes[u].kids)) { nodes.push({ ch: c, kids: {}, end: false, par: u }); nodes[u].kids[c] = nodes.length - 1; } u = nodes[u].kids[c]; path.push(u); } nodes[u].end = true; push('Se inserta "' + w + '" (amarillo = camino; los prefijos comunes se comparten).', draw(path)); }
  push('Palabras: ' + words.join(', ') + '. Contar formas de partir un texto = DP que recorre el trie desde cada posición.', draw([]));
}, GR);

V('Strings-Algorithms-Manacher', 'Manacher: palíndromos en O(n)', 'Se usa la cadena con separadores (#). Azul = palíndromo más a la derecha que se reutiliza por simetría.', push => {
  const s0 = pick(['abacabad', 'forgeeksskeegfor', 'babcbabcbaccba', 'aabbaacc']), t = '#' + [...s0].join('#') + '#', n = t.length, d = Array(n).fill(null); let l = 0, r = -1, best = 0;
  for (let i = 0; i < n; i++) { let k = i > r ? 1 : Math.min(d[l + r - i], r - i + 1); const mir = k > 1; while (i - k >= 0 && i + k < n && t[i - k] === t[i + k]) k++; d[i] = k; if (i + k - 1 > r) { l = i - k + 1; r = i + k - 1; } if (d[i] > d[best]) best = i;
    if (t[i] !== '#' || d[i] > 1) push('Centro ' + i + ': radio ' + d[i] + (mir ? ' (empezó copiando el espejo)' : '') + '. Palíndromo de longitud ' + (d[i] - 1) + '.', { t, d: d.slice(), i, l, r, best }); }
  push('Palíndromo más largo: "' + t.substr(best - d[best] + 1, 2 * d[best] - 1).replace(/#/g, '') + '".', { t, d, i: -1, l: best - d[best] + 1, r: best + d[best] - 1, best, fin: true });
}, st => rows([{ t: 't', v: [...st.t], c: [...st.t].map((_, j) => st.fin ? (j >= st.l && j <= st.r ? 'g' : '') : j === st.i ? 'a' : j >= st.l && j <= st.r ? 'b' : '') }, { t: 'radio', v: st.d, c: st.d.map((_, j) => j === st.i ? 'a' : '') }]));

V('Strings-Algorithms-MinimalRotation', 'Rotación mínima (Booth)', 'Se comparan dos candidatos i y j; el que pierde salta más allá de la parte comparada.', push => {
  const s = pick(['bbaaccaadd', 'cabbage', 'dcbaabcd', 'baca', 'zxyzxa']), n = s.length, ss = s + s; let i = 0, j = 1, k = 0;
  push('Candidatos i = 0 (azul) y j = 1 (naranja).', { s: ss, i, j, k });
  while (i < n && j < n && k < n) { const a = ss[i + k], b = ss[j + k]; if (a === b) { k++; continue; }
    const msg = 'Difieren en k = ' + k + ': ' + a + (a > b ? ' > ' : ' < ') + b + '. '; if (a > b) i += k + 1; else j += k + 1; if (i === j) j++; k = 0; push(msg + 'El perdedor salta: i = ' + i + ', j = ' + j + '.', { s: ss, i, j, k }); }
  const st = Math.min(i, j); push('La rotación mínima empieza en ' + st + ': "' + ss.substr(st, n) + '".', { s: ss, i: st, j: -1, k: n, fin: true });
}, st => rows([{ t: 's+s', v: [...st.s], c: [...st.s].map((_, x) => st.fin ? (x >= st.i && x < st.i + st.s.length / 2 ? 'g' : '') : x >= st.i && x < st.i + st.k + 1 ? 'b' : x >= st.j && x < st.j + st.k + 1 ? 'o' : '') }]));

V('Strings-Algorithms-SuffixArray', 'Arreglo de sufijos por duplicación', 'En cada ronda se ordena por pares (rango de i, rango de i+k): se duplica la longitud comparada.', push => {
  const s = pick(['banana', 'abracadabra', 'mississippi', 'abaab']) + '$', n = s.length; let rk = [...s].map(c => c.charCodeAt(0)), sa = [...Array(n).keys()];
  const show = (k, msg) => push(msg, { tab: sa.map(i => [i, s.slice(i), rk[i]]), k });
  sa.sort((a, b) => rk[a] - rk[b]); const re = () => { const nr = Array(n); nr[sa[0]] = 0; for (let t = 1; t < n; t++) nr[sa[t]] = nr[sa[t - 1]] + (key(sa[t]) > key(sa[t - 1]) ? 1 : 0); return nr; };
  let key = i => rk[i]; rk = re(); show(1, 'Ronda 0: orden por la primera letra.');
  for (let k = 1; k < n; k *= 2) { key = i => rk[i] * (n + 1) + (rk[(i + k) % n] + 1); sa.sort((a, b) => key(a) - key(b)); rk = re(); show(2 * k, 'Se ordena por los primeros ' + 2 * k + ' caracteres usando los rangos anteriores.'); if (rk[sa[n - 1]] === n - 1) break; }
  push('Rangos todos distintos: el arreglo de sufijos es [' + sa.join(', ') + '].', { tab: sa.map(i => [i, s.slice(i), rk[i]]), k: n, fin: true });
}, st => table(st.tab.map(([i, suf, r]) => [i, '<b>' + suf.slice(0, st.k) + '</b>' + suf.slice(st.k), r]), st.tab.map(() => ['', st.fin ? 'g' : '', '']), null, ['pos', 'sufijo', 'rango']));

})();
