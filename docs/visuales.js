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
const fmt = x => typeof x !== 'number' ? x : (x === Infinity || x >= 1e15) ? '∞' : (x === -Infinity ? '−∞' : x);

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
const table = (g, cls, rl, cl) => '<div style="overflow:auto"><table style="border-collapse:separate;border-spacing:3px">' + (cl ? '<tr>' + (rl ? '<td></td>' : '') + cl.map(x => '<td class="cell" style="font-weight:700">' + x + '</td>').join('') + '</tr>' : '') + g.map((row, i) => '<tr>' + (rl ? '<td class="cell" style="font-weight:700">' + rl[i] + '</td>' : '') + row.map((x, j) => '<td class="cell ' + ((cls && cls[i] && cls[i][j]) || '') + '">' + (x === null || x === undefined ? '·' : fmt(x)) + '</td>').join('') + '</tr>').join('') + '</table></div>';
const pl = (k, uno, varios) => k + ' ' + (k === 1 ? uno : varios);
const COL = { g: '#2da44e', a: '#d4a72c', b: '#1f6feb', r: '#cf222e', p: '#8250df', o: '#fb8f44', k: '#57606a' };
function graph(G) {
  const W = G.W || 540, rad = 15;
  // el alto se ajusta a los nodos para que nada quede cortado
  const H = Math.max(G.H || 280, Math.max(0, ...G.nodes.filter(v => !v.hide).map(v => v.y)) + 30);
  let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" style="max-width:' + W + 'px;display:block"><defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="11" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#888"/></marker></defs>';
  for (const e of G.edges) {
    const A = G.nodes[e.a], B = G.nodes[e.b];
    const dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy) || 1, off = e.bend || 0;
    const x1 = A.x + dx / L * rad, y1 = A.y + dy / L * rad, x2 = B.x - dx / L * rad, y2 = B.y - dy / L * rad;
    const col = COL[e.c] || '#999', mx = (x1 + x2) / 2 - dy / L * off, my = (y1 + y2) / 2 + dx / L * off;
    s += '<path d="M' + x1 + ' ' + y1 + ' Q' + mx + ' ' + my + ' ' + x2 + ' ' + y2 + '" fill="none" stroke="' + col + '" stroke-width="' + (e.c && e.c !== 'x' ? 3.5 : 1.5) + '"' + (e.dash ? ' stroke-dasharray="4 4"' : '') + (e.d ? ' marker-end="url(#ar)"' : '') + ' opacity="' + (e.c === 'x' ? 0.25 : 1) + '"/>';
    if (e.l !== undefined && e.l !== '') s += '<text x="' + (mx + 9 * dy / L) + '" y="' + (my - 9 * dx / L + 4) + '" font-size="12" text-anchor="middle" fill="currentColor" stroke="var(--card)" stroke-width="4" paint-order="stroke">' + e.l + '</text>';
  }
  for (const v of G.nodes) {
    if (v.hide) continue;
    s += '<circle cx="' + v.x + '" cy="' + v.y + '" r="' + rad + '" fill="' + (COL[v.c] || 'var(--card)') + '" stroke="' + (v.ring ? '#d4a72c' : '#666') + '" stroke-width="' + (v.ring ? 4 : 1.5) + '"/>';
    s += '<text x="' + v.x + '" y="' + (v.y + 4) + '" text-anchor="middle" font-size="12" font-weight="600" fill="' + (v.c ? '#fff' : 'currentColor') + '">' + v.l + '</text>';
    if (v.s !== undefined && v.s !== '') s += '<text x="' + v.x + '" y="' + (v.y - 21) + '" text-anchor="middle" font-size="11" fill="currentColor" stroke="var(--card)" stroke-width="4" paint-order="stroke">' + v.s + '</text>';
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
  const gap = Math.max(54, maxd ? (H - 60) / maxd : 0);
  const xy = [...Array(n).keys()].map(u => ({ x: Math.round(30 + (W - 60) * (leaf > 1 ? pos[u] / (leaf - 1) : 0.5)), y: Math.round(34 + gap * depth[u]) }));
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
}, s => rows([{ t: 'libro', v: s.price.map((p, i) => '$' + p + ' · ' + s.pages[i] + ' pág'), c: s.price.map((_, i) => i === s.item ? 'a' : '') }, { t: 'presupuesto', v: s.dp.map((_, i) => i) }, { t: 'páginas', v: s.dp, c: s.dp.map((v, i) => i === s.cur ? 'a' : i === s.from ? 'b' : v ? 'g' : '') }]));

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
  push('Se compara ' + a.join('') + ' (filas) con ' + b.join('') + ' (columnas).', { T, cls, a, b });
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) {
    const eq = a[i - 1] === b[j - 1]; T[i][j] = eq ? T[i - 1][j - 1] + 1 : Math.max(T[i - 1][j], T[i][j - 1]);
    const c2 = cls.map(r => r.slice()); c2[i][j] = 'a';
    push((eq ? a[i - 1] + ' = ' + b[j - 1] + ': diagonal + 1 = ' : a[i - 1] + ' ≠ ' + b[j - 1] + ': máximo de arriba e izquierda = ') + T[i][j], { T, cls: c2, a, b }); if (eq) cls[i][j] = 'g';
  }
  let i = a.length, j = b.length; const res = [];
  while (i && j) { if (a[i - 1] === b[j - 1]) { res.push(a[i - 1]); cls[i][j] = 'p'; i--; j--; } else if (T[i - 1][j] >= T[i][j - 1]) i--; else j--; }
  push('Recorriendo hacia atrás (morado) sale la LCS: ' + (res.reverse().join('') || '(vacía)') + ', de largo ' + T[a.length][b.length] + '.', { T, cls, a, b });
}, s => table(s.T, s.cls, ['∅'].concat(s.a), ['∅'].concat(s.b)));

V('DP-Algorithms-BitmaskDP', 'DP sobre subconjuntos (ascensor)', 'Cada fila es un grupo: los bits encendidos son las personas que ya subieron.', push => {
  const n = 4, x = R(10, 14), w = Array.from({ length: n }, () => R(2, 7)), full = 1 << n;
  const ri = Array(full).fill(null), la = Array(full).fill(null); ri[0] = 1; la[0] = 0;
  const st = cur => ({ w, x, ri, la, cur, n });
  push('Pesos ' + w.join(', ') + ', capacidad ' + x + '. El grupo vacío: 1 viaje (todavía vacío) con 0 kg.', st(0));
  for (let m = 1; m < full; m++) { let br = 99, bl = 0;
    for (let i = 0; i < n; i++) if (m >> i & 1) { let r = ri[m ^ (1 << i)], l = la[m ^ (1 << i)]; if (l + w[i] <= x) l += w[i]; else { r++; l = w[i]; } if (r < br || (r === br && l < bl)) { br = r; bl = l; } }
    ri[m] = br; la[m] = bl; push('Grupo ' + m.toString(2).padStart(n, '0') + ' (se prueba cada persona del grupo como la última en subir): ' + pl(br, 'viaje', 'viajes') + ', ' + bl + ' kg en el último.', st(m)); }
  push('Todos juntos necesitan ' + pl(ri[full - 1], 'viaje', 'viajes') + '.', st(full - 1));
}, s => { const ms = [...Array(1 << s.n).keys()]; return table(ms.map(m => [m.toString(2).padStart(s.n, '0'), s.ri[m], s.la[m]]), ms.map(m => m === s.cur ? ['a', 'a', 'a'] : s.ri[m] !== null ? ['', 'g', 'g'] : ['', '', '']), null, ['grupo', 'viajes', 'último kg']); });

V('Probability-Classic-Problems-Campeonato', 'Probabilidad de ganar la serie', 'P[i][j] = probabilidad de que A gane si le faltan i victorias y a B le faltan j.', push => {
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
  const l = R(0, 2), r = l + pick([2, 4, 5]), k = 31 - Math.clz32(r - l + 1);  // largo 3, 5 o 6: los dos bloques sí se solapan
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
// Segment Tree general: la operación se elige con un selector (suma, mínimo, máximo, gcd).
const gcdF = (a, b) => b ? gcdF(b, a % b) : a;
const SEG_OPS = {
  suma: { n: 'suma', f: (a, b) => a + b, e: 0, w: (x, y) => x + ' + ' + y, vals: () => R(1, 9) },
  min: { n: 'mínimo', f: Math.min, e: Infinity, w: (x, y) => 'min(' + x + ', ' + y + ')', vals: () => R(1, 20) },
  max: { n: 'máximo', f: Math.max, e: -Infinity, w: (x, y) => 'max(' + x + ', ' + y + ')', vals: () => R(1, 20) },
  gcd: { n: 'gcd', f: gcdF, e: 0, w: (x, y) => 'gcd(' + x + ', ' + y + ')', vals: () => pick([2, 3, 4, 6, 8, 9, 12, 18, 24, 30, 36]) }
};
let segOp = 'suma';
V('Data-Structures-Algorithms-SegmentTree', 'Segment Tree con cualquier operación asociativa', 'Elige la operación. Arriba de cada nodo está su tramo. Amarillo = nodo que se calcula · azul = nodo a medias (se baja a sus hijos) · verde = nodo que se usa entero · gris = fuera del rango (aporta el neutro).', push => {
  const O = SEG_OPS[segOp], n = 8, a = Array.from({ length: n }, O.vals), L = segLayout(n), t = {}, rg = {};
  (function b(id, l, r) { rg[id] = [l, r]; if (l === r) return; const m = (l + r) >> 1; b(2 * id, l, m); b(2 * id + 1, m + 1, r); })(1, 0, n - 1);
  const nm = id => '[' + (rg[id][0] + 1) + (rg[id][0] === rg[id][1] ? '' : '–' + (rg[id][1] + 1)) + ']';
  const S = (m, c = {}, q) => push(m, { L, rg, t: Object.assign({}, t), a: a.slice(), c: Object.assign({}, c), q });
  S('Operación: ' + O.n + ' (neutro ' + fmt(O.e) + '). Cada nodo va a guardar la ' + O.n + ' de su tramo.');
  const ids = Object.keys(rg).map(Number), leaf = id => rg[id][0] === rg[id][1];
  const c0 = {}; ids.filter(leaf).forEach(id => { t[id] = a[rg[id][0]]; c0[id] = 'a'; });
  S('Las hojas son los elementos del arreglo.', c0);
  const depth = id => Math.floor(Math.log2(id));
  for (let d = Math.max(...ids.map(depth)) - 1; d >= 0; d--) {
    const lv = ids.filter(id => !leaf(id) && depth(id) === d), c = {};
    lv.forEach(id => { t[id] = O.f(t[2 * id], t[2 * id + 1]); c[id] = 'a'; });
    const ej = lv[0];
    S('Nivel ' + d + ': cada nodo combina a sus dos hijos. Por ejemplo, ' + nm(ej) + ' = ' + O.w(fmt(t[2 * ej]), fmt(t[2 * ej + 1])) + ' = ' + fmt(t[ej]) + '.' + (d === 0 ? ' La raíz tiene la ' + O.n + ' de todo el arreglo.' : ''), c);
  }
  // actualización puntual
  const p = R(0, n - 1), v = O.vals(); let id = 1; const path = [];
  while (!leaf(id)) { path.push(id); id = p <= rg[id][0] + ((rg[id][1] - rg[id][0]) >> 1) ? 2 * id : 2 * id + 1; }
  a[p] = v; t[id] = v; const cu = { [id]: 'a' };
  S('update: a[' + (p + 1) + '] = ' + v + '. Se cambia la hoja y luego solo se recalculan sus ancestros.', cu);
  for (const u of path.reverse()) { t[u] = O.f(t[2 * u], t[2 * u + 1]); cu[u] = 'a'; S('Se recalcula ' + nm(u) + ' = ' + O.w(fmt(t[2 * u]), fmt(t[2 * u + 1])) + ' = ' + fmt(t[u]) + '.', cu); }
  S('Listo: se tocaron ' + (path.length + 1) + ' nodos (la altura del árbol), no los ' + n + ' elementos. O(log n).', cu);
  // consulta
  const ql = R(0, 3), qr = R(ql + 2, n - 1), cq = {}; let res = O.e, used = 0;
  S('query [' + (ql + 1) + ', ' + (qr + 1) + ']: se empieza en la raíz con resultado = neutro (' + fmt(O.e) + ').', cq, [ql, qr]);
  (function q(u) { const [l, r] = rg[u];
    if (r < ql || l > qr) { cq[u] = 'k'; S(nm(u) + ' está fuera del rango: se ignora.', cq, [ql, qr]); return; }
    if (ql <= l && r <= qr) { const old = res; res = O.f(res, t[u]); used++; cq[u] = 'g'; S(nm(u) + ' está completo dentro del rango: se usa entero. Resultado = ' + O.w(fmt(old), fmt(t[u])) + ' = ' + fmt(res) + '.', cq, [ql, qr]); return; }
    cq[u] = 'b'; S(nm(u) + ' está a medias: se baja a sus dos hijos.', cq, [ql, qr]); q(2 * u); q(2 * u + 1); })(1);
  S('Respuesta: la ' + O.n + ' de [' + (ql + 1) + ', ' + (qr + 1) + '] es ' + fmt(res) + ', usando solo ' + used + ' nodos verdes. Cambia la operación arriba: el algoritmo es idéntico.', cq, [ql, qr]);
}, s => graph({ W: 540, H: 270, nodes: s.L.nodes.map(nd => ({ x: nd.x, y: nd.y + 14, l: s.t[nd.id] === undefined ? '' : fmt(s.t[nd.id]), c: s.c[nd.id] || '', s: nd.l === nd.r ? '[' + (nd.l + 1) + ']' : (nd.l + 1) + '–' + (nd.r + 1) })), edges: s.L.edges.map(([u, v]) => ({ a: s.L.idx[u], b: s.L.idx[v] })) })
  + cellsRow('arreglo', s.a, s.a.map((_, i) => s.q && i >= s.q[0] && i <= s.q[1] ? 'b' : '')));
{ const base = D['Data-Structures-Algorithms-SegmentTree'];
  D['Data-Structures-Algorithms-SegmentTree'] = box => { base(box); const w = box.lastElementChild, row = w.querySelector('.row');
    const lab = el('<label style="margin-left:auto">Operación <select>' + Object.entries(SEG_OPS).map(([k, o]) => '<option value="' + k + '"' + (k === segOp ? ' selected' : '') + '>' + o.n + '</option>').join('') + '</select></label>');
    row.appendChild(lab); lab.querySelector('select').onchange = e => { segOp = e.target.value; w.querySelector('[data-k=n]').click(); }; }; }

V('Data-Structures-Algorithms-LazySegmentTree', 'Lazy Segment Tree: sumar a un rango', 'Cada nodo muestra la suma de su tramo; arriba, su tramo y su etiqueta pendiente (+x) si tiene. Verde = cubre el rango entero (se actualiza y se deja la etiqueta) · azul = a medias (se baja la etiqueta y se entra) · gris = fuera.', push => {
  const n = 8, a = Array.from({ length: n }, () => R(1, 9)), L = segLayout(n), sum = {}, lz = {}, rg = {};
  (function b(id, l, r) { rg[id] = [l, r]; lz[id] = 0; if (l === r) { sum[id] = a[l]; return; } const m = (l + r) >> 1; b(2 * id, l, m); b(2 * id + 1, m + 1, r); sum[id] = sum[2 * id] + sum[2 * id + 1]; })(1, 0, n - 1);
  const len = id => rg[id][1] - rg[id][0] + 1, nm = id => '[' + (rg[id][0] + 1) + (len(id) > 1 ? '–' + (rg[id][1] + 1) : '') + ']';
  const S = (m, c = {}) => push(m, { L, sum: Object.assign({}, sum), lz: Object.assign({}, lz), c: Object.assign({}, c) });
  S('Segment Tree de sumas, sin nada pendiente. Sin lazy, sumar x a un rango obligaría a tocar cada hoja.');
  const apply = (id, x) => { sum[id] += x * len(id); if (len(id) > 1) lz[id] += x; };
  const pushDown = (id, c) => { if (lz[id] && len(id) > 1) { const x = lz[id]; apply(2 * id, x); apply(2 * id + 1, x); lz[id] = 0; S('push: ' + nm(id) + ' tenía +' + x + ' pendiente; se baja a sus dos hijos antes de entrar.', c); } };
  for (let rep = 0; rep < 2; rep++) {
    const ql = R(0, 4), qr = R(ql + 1, n - 1), x = R(1, 5), c = {};
    S('update: sumar ' + x + ' a [' + (ql + 1) + ', ' + (qr + 1) + '].', c);
    (function u(id) { const [l, r] = rg[id];
      if (r < ql || l > qr) { c[id] = 'k'; return; }
      if (ql <= l && r <= qr) { apply(id, x); c[id] = 'g'; S(nm(id) + ' cabe entero: su suma crece ' + x + ' × ' + len(id) + ' = ' + x * len(id) + (len(id) > 1 ? ' y se anota +' + x + ' para sus hijos, sin bajar.' : ' (es una hoja, no hay nada que anotar).'), c); return; }
      c[id] = 'b'; pushDown(id, c); u(2 * id); u(2 * id + 1); sum[id] = sum[2 * id] + sum[2 * id + 1];
      S('Al volver, ' + nm(id) + ' se recalcula: ' + sum[2 * id] + ' + ' + sum[2 * id + 1] + ' = ' + sum[id] + '.', c); })(1);
  }
  const ql = R(0, 3), qr = R(ql + 1, n - 1), c = {}; let res = 0;
  S('query: suma de [' + (ql + 1) + ', ' + (qr + 1) + ']. Al bajar por el árbol, las etiquetas que se encuentran se empujan.', c);
  (function q(id) { const [l, r] = rg[id];
    if (r < ql || l > qr) { c[id] = 'k'; return; }
    if (ql <= l && r <= qr) { c[id] = 'g'; res += sum[id]; S(nm(id) + ' está entero dentro: aporta ' + sum[id] + ' (su suma ya incluye lo pendiente). Total = ' + res + '.', c); return; }
    c[id] = 'b'; pushDown(id, c); q(2 * id); q(2 * id + 1); })(1);
  S('Respuesta: ' + res + '. Cada modificación y cada consulta tocó O(log n) nodos.', c);
}, s => graph({ W: 540, H: 275, nodes: s.L.nodes.map(nd => ({ x: nd.x, y: nd.y + 14, l: s.sum[nd.id], c: s.c[nd.id] || '', ring: !!s.lz[nd.id], s: (nd.l === nd.r ? '[' + (nd.l + 1) + ']' : (nd.l + 1) + '–' + (nd.r + 1)) + (s.lz[nd.id] ? ' +' + s.lz[nd.id] : '') })), edges: s.L.edges.map(([u, v]) => ({ a: s.L.idx[u], b: s.L.idx[v] })) }));
V('Data-Structures-Algorithms-MoAlgorithm', 'Algoritmo de Mo', 'Las consultas se reordenan por bloques; la ventana (azul) se mueve poco entre una y otra.', push => {
  const n = 12, a = Array.from({ length: n }, () => R(1, 5)), qs = Array.from({ length: 6 }, (_, i) => { const l = R(0, n - 3); return { l, r: R(l + 1, n - 1), i }; });
  const B = 3, ord = qs.slice().sort((x, y) => Math.floor(x.l / B) - Math.floor(y.l / B) || x.r - y.r), ans = Array(qs.length).fill(null);
  push('Bloques de tamaño ' + B + '. Orden de respuesta: ' + ord.map(q => '[' + (q.l + 1) + ',' + (q.r + 1) + ']').join(' '), { a, L: 0, R: -1, d: 0, ans, cur: -1, qs });
  const cnt = Array(6).fill(0); let L = 0, Rr = -1, d = 0, moves = 0;  // cnt[v] = veces que v está en la ventana
  for (const q of ord) { while (Rr < q.r) { Rr++; if (!cnt[a[Rr]]++) d++; moves++; } while (L > q.l) { L--; if (!cnt[a[L]]++) d++; moves++; } while (Rr > q.r) { if (!--cnt[a[Rr]]) d--; Rr--; moves++; } while (L < q.l) { if (!--cnt[a[L]]) d--; L++; moves++; }
    ans[q.i] = d; push('Consulta [' + (q.l + 1) + ', ' + (q.r + 1) + '] (bloque ' + (Math.floor(q.l / B) + 1) + '): la ventana se movió hasta ahí; ' + d + ' valores distintos. Movimientos acumulados: ' + moves + ' (sin reordenar podrían ser muchos más).', { a, L, R: Rr, d, ans: ans.slice(), cur: q.i, qs }); }
}, s => rows([{ t: 'bloque', v: s.a.map((_, j) => j % 3 === 0 ? 'B' + (j / 3 + 1) : '') }, { t: 'arreglo', v: s.a, c: s.a.map((_, j) => j >= s.L && j <= s.R ? 'b' : '') }, { t: 'punteros', v: s.a.map((_, j) => (j === s.L ? 'L' : '') + (j === s.R ? 'R' : '')), c: s.a.map((_, j) => j === s.L || j === s.R ? 'a' : '') }, { t: 'consulta', v: s.qs.map(q => (q.l + 1) + '–' + (q.r + 1)), c: s.qs.map(q => q.i === s.cur ? 'a' : '') }, { t: 'respuesta', v: s.ans, c: s.ans.map(v => v === null ? '' : 'g') }]));

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
  const P = randPoly(7); let p = [R(-3, 3) + 0.5, R(-3, 3) + 0.5]; let cnt = 0; const hits = [];
  if (Math.random() < 0.3) { const a = P[0], b = P[1]; p = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; push('El punto está justo sobre un lado: el código revisa eso primero y responde BOUNDARY sin contar cruces.', { P, p, i: 0, hits: [], cnt: 0 }); return; }
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
  const n = 12, seenP = new Set(), P = []; while (P.length < n) { const q = [R(-11, 11), R(-6, 6)]; if (!seenP.has(q + '')) { seenP.add(q + ''); P.push(q); } } P.sort((a, b) => a[0] - b[0]); let best = Infinity, bp = null, left = 0;
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
    s.ns = d.map(fmt); s.nc = d.map(x => x < Infinity ? 'g' : ''); push('Ronda ' + r + ': ' + (ch ? 'las aristas verdes mejoraron alguna distancia.' : 'ninguna distancia mejoró, así que ya son definitivas y se puede parar antes.'), s); if (!ch) break; }
  const neg = E.some(e => d[e.a] + e.w < d[e.b]); push(neg ? 'Comprobación: una ronda más todavía mejora algo, así que hay un ciclo negativo alcanzable desde 1.' : 'Comprobación final: relajar otra vez no mejora nada, así que no hay ciclo negativo alcanzable desde 1.', s);
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
  push(c === 1 ? 'Todo el grafo es una sola componente fuertemente conexa.' : 'Hay ' + c + ' componentes fuertemente conexas.', s);
}, GR);

V('Graphs-Algorithms-Graph-Traversal-Kosaraju', 'Kosaraju: dos recorridos', 'Primera pasada: orden de salida. Segunda: sobre el grafo invertido, cada recorrido es una componente.', push => {
  const n = 7, xy = circleLayout(n), E = randGraph(n, 3, { dir: true }); E.forEach(e => e.w = undefined);
  // se agrega un ciclo para que haya al menos una componente grande
  const cyc = shuffle([...Array(n).keys()]).slice(0, R(3, 4)); cyc.forEach((v, i) => { const u = cyc[(i + 1) % cyc.length]; if (!E.some(e => e.a === v && e.b === u)) E.push({ a: v, b: u }); });
  const s = GS(xy, E, true), G = adjOf(n, E, true), seen = Array(n).fill(false), order = [];
  push('Grafo dirigido original.', s);
  for (let r = 0; r < n; r++) { if (seen[r]) continue; const call = [[r, 0]]; seen[r] = true;
    while (call.length) { const top = call[call.length - 1]; const [v, i] = top; if (i < G[v].length) { top[1]++; const u = G[v][i][0]; if (!seen[u]) { seen[u] = true; call.push([u, 0]); } } else { call.pop(); order.push(v); s.ns[v] = 'sale ' + order.length; s.nc[v] = 'k'; push('Termina ' + (v + 1) + ' (posición ' + order.length + ' en el orden de salida).', s); } } }
  const RE = E.map(e => ({ a: e.b, b: e.a })), s2 = GS(xy, RE, true); s2.ns = s.ns.slice(); push('Se invierten todas las flechas.', s2);
  const GT = adjOf(n, RE, true), comp = Array(n).fill(-1); let c = 0;
  for (const v of order.reverse()) { if (comp[v] >= 0) continue; const col = SCC_COLORS[c % 6], st = [v]; comp[v] = c; const mem = [];
    while (st.length) { const u = st.pop(); mem.push(u + 1); s2.nc[u] = col; for (const [w] of GT[u]) if (comp[w] < 0) { comp[w] = c; st.push(w); } }
    c++; push('Desde ' + (v + 1) + ' (el que salió más tarde entre los que aún no tienen componente): componente {' + mem.join(', ') + '}.', s2); }
  push('Hay ' + pl(c, 'componente fuertemente conexa', 'componentes fuertemente conexas') + ' (cada color es una).', s2);
}, GR);

V('Graphs-Algorithms-Graph-Traversal-Bipartite', 'Colorear con dos colores', 'Cada vecino recibe el color contrario; dos vecinos iguales = ciclo impar.', push => {
  const n = 8, xy = circleLayout(n); let E;
  if (Math.random() < 0.6) { const side = [...Array(n).keys()].map(() => R(0, 1)); E = []; for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) if (side[a] !== side[b] && Math.random() < 0.35) E.push({ a, b }); }
  else { E = randGraph(n, R(1, 3)); E.forEach(e => e.w = undefined); }
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
        else if (on[u]) { s.ec[k] = 'g'; s.nc[u] = 'g'; const path = []; for (let x = v; x !== u; x = par[x]) { s.nc[x] = 'g'; s.ec[pe[x]] = 'g'; path.push(x + 1); } push('La arista ' + (v + 1) + '–' + (u + 1) + ' vuelve a un ancestro: ciclo ' + [u + 1, ...path.reverse(), u + 1].join(' → '), s); return; } }
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
  const lit = () => 2 * R(0, m - 1) + R(0, 1);
  // 40%: cláusulas que obligan a x1 y a ¬x1 a la vez (caso IMPOSSIBLE); si no, cláusulas al azar
  const cls = Math.random() < 0.4 ? [[0, 2], [0, 3], [1, 4], [1, 5]] : Array.from({ length: 4 }, () => [lit(), lit()]).filter(([a, b]) => a !== b);
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
  push('Verde = literal verdadero, rojo = falso. Se elige el literal cuya componente va después en el orden topológico: ' + [...Array(m).keys()].map(i => 'x' + (i + 1) + ' = ' + (comp[2 * i] > comp[2 * i + 1] ? 'V' : 'F')).join(', '), g);
}, GR);

// ---- árboles ----
const treeState = (n, W, H) => { const T = randTree(n, W, H); const E = T.par.slice(1).map((p, i) => ({ a: p, b: i + 1 })); return { T, E, s: GS(T.xy, E) }; };

V('Graphs-Algorithms-Trees-LCA', 'Ancestro común más cercano', 'Primero se igualan las alturas y luego ambos suben con saltos de potencias de 2.', push => {
  const n = 14, { T, s } = treeState(n), up = [T.par.map(p => p < 0 ? 0 : p)];
  for (let j = 1; j < 4; j++) up.push(up[j - 1].map(v => up[j - 1][v]));
  // se eligen dos nodos profundos para que haya saltos que mostrar
  const byDepth = [...Array(n).keys()].sort((x, y) => T.depth[y] - T.depth[x]); let a = byDepth[0], b = byDepth.find(v => v !== a && !T.kids[a].includes(v) && T.par[a] !== v) ?? byDepth[1];
  push('Tabla de saltos: up[j][v] = ancestro 2^j niveles arriba. Para ' + (a + 1) + ': ' + [0, 1, 2, 3].map(j => 'up[' + j + '] = ' + (up[j][a] + 1)).join(', ') + '.', s);
  s.ns = T.depth.map(d => 'prof ' + d); s.nc[a] = 'b'; s.nc[b] = 'o'; push('Buscar el ancestro común de ' + (a + 1) + ' y ' + (b + 1) + '.', s);
  if (T.depth[a] < T.depth[b]) [a, b] = [b, a];
  let diff = T.depth[a] - T.depth[b];
  for (let j = 3; j >= 0; j--) if (diff >> j & 1) { s.nc[a] = ''; a = up[j][a]; s.nc[a] = s.nc[a] === 'o' ? 'g' : 'b'; push('Faltan ' + (diff) + ' niveles; el bit ' + j + ' está encendido: se usa up[' + j + '] y se sube ' + pl(1 << j, 'nivel', 'niveles') + ' de golpe → ' + (a + 1) + '.', s); diff -= 1 << j; }
  if (a === b) { s.nc[a] = 'g'; push('Quedaron en el mismo nodo: el ancestro común es ' + (a + 1) + '.', s); return; }
  for (let j = 3; j >= 0; j--) if (up[j][a] !== up[j][b]) { s.nc[a] = ''; s.nc[b] = ''; a = up[j][a]; b = up[j][b]; s.nc[a] = 'b'; s.nc[b] = 'o'; push('up[' + j + '] de ambos son distintos: los dos suben ' + pl(1 << j, 'nivel', 'niveles') + ' (si fueran iguales, se pasarían del ancestro común).', s); }
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
    push('Pedazo de ' + pl(comp.length, 'nodo', 'nodos') + ': su centroide es ' + (c + 1) + ' (nivel ' + d + ').', s);
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
V('Graphs-Algorithms-Trees-TreeIsomorphismRooted', 'Isomorfismo de árboles con raíz', 'Cada lista ordenada de ids de hijos recibe un id; formas iguales reciben el mismo id.', push => {
  const iso = R(0, 1) === 1, { n, T1, T2, xy, E } = twoTrees(iso), s = GS(xy, E); push('Dos árboles con raíz (la raíz es el nodo de arriba).', s);
  const ids = {}, a = canonSteps(push, s, T1, 0, ids, 'Árbol 1'), b = canonSteps(push, s, T2, n, ids, 'Árbol 2');
  s.nc[0] = s.nc[n] = a === b ? 'g' : 'r'; push(a === b ? 'Las raíces tienen el mismo id (' + a + '): son isomorfos, YES.' : 'Las raíces tienen ids distintos (' + a + ' y ' + b + '): NO son isomorfos.', s);
}, GR);
V('Graphs-Algorithms-Trees-TreeIsomorphism', 'Isomorfismo de árboles sin raíz', 'Se usa como raíz el centroide de cada árbol y se comparan los ids canónicos.', push => {
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
  s.nc = seen.map(x => x ? 'g' : 'o'); s.ec = E.map(e => seen[e.a] && !seen[e.b] ? 'r' : 'x');
  push(title + ': flujo máximo = ' + total + '. Corte mínimo: verde = nodos que S todavía alcanza; las aristas rojas van de verde a naranja, están llenas y sus capacidades suman ' + total + '.', s);
}
V('Graphs-Algorithms-Flow-Algorithms-EdmondsKarp', 'Edmonds-Karp', 'Cada vez se usa el camino aumentante más corto (BFS).', push => { const { n, xy, E } = flowNet(); augmentSteps(push, n, xy, E, true, 'No quedan caminos'); }, GR);

V('Graphs-Algorithms-Flow-Algorithms-Dinic', 'Dinic: niveles y flujo bloqueante', 'Etiqueta del nodo = nivel BFS. Solo se usan aristas que suben exactamente un nivel.', push => {
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

V('Graphs-Algorithms-Flow-Algorithms-BipartiteMatching', 'Emparejamiento bipartito (Kuhn)', 'Cada niño de la izquierda busca pareja; si está ocupada, se intenta reacomodar al otro.', push => {
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

function mcmfSteps(push, K) {
  const { n, xy, E } = flowNet(); E.forEach(e => { e.c = R(1, 6); e.w = R(1, 4); }); const f = E.map(() => 0); let flow = 0, cost = 0;
  const s = GS(xy, E, true); s.lab = ['S', 2, 3, 4, 5, 'T']; const lab = () => { s.el = E.map((e, k) => f[k] + '/' + e.w + ' $' + e.c); }; lab();
  push('Etiqueta = flujo/capacidad $costo por unidad.' + (K ? ' Se deben enviar exactamente ' + K + ' unidades.' : ' Se envía todo el flujo posible.') + ' Amarillo = camino elegido, azul = arista con flujo, rojo = llena.', s);
  for (let it = 0; it < 10 && (!K || flow < K); it++) {
    const d = Array(n).fill(Infinity), prev = Array(n).fill(null); d[0] = 0;
    for (let r = 0; r < n; r++) E.forEach((e, k) => { if (f[k] < e.w && d[e.a] + e.c < d[e.b]) { d[e.b] = d[e.a] + e.c; prev[e.b] = [k, 1]; } if (f[k] > 0 && d[e.b] - e.c < d[e.a]) { d[e.a] = d[e.b] - e.c; prev[e.a] = [k, -1]; } });
    if (d[n - 1] === Infinity) break;
    let b = K ? K - flow : Infinity, path = []; for (let v = n - 1; v !== 0;) { const [k, dd] = prev[v]; path.push([k, dd]); b = Math.min(b, dd > 0 ? E[k].w - f[k] : f[k]); v = dd > 0 ? E[k].a : E[k].b; }
    s.ns = d.map(fmt); s.ec = E.map((e, k) => f[k] === e.w ? 'r' : f[k] ? 'b' : ''); path.forEach(([k]) => s.ec[k] = 'a'); push('Camino más barato del grafo residual (etiqueta del nodo = su distancia en costo; el código la calcula con Dijkstra y potenciales): $' + d[n - 1] + ' por unidad, se mandan ' + b + '.', s);
    path.forEach(([k, dd]) => f[k] += dd * b); flow += b; cost += b * d[n - 1]; lab(); s.ec = E.map((e, k) => f[k] === e.w ? 'r' : f[k] ? 'b' : ''); push('Flujo ' + flow + ', costo total $' + cost + '.', s);
  }
  if (K && flow < K) push('Solo se pudieron enviar ' + flow + ' de ' + K + ' unidades: IMPOSSIBLE.', s);
  else push('Resultado: flujo ' + flow + ' con costo mínimo $' + cost + '.', s);
}
V('Graphs-Algorithms-Flow-Algorithms-MinCostMaxFlow', 'Flujo máximo de costo mínimo', 'Siempre se aumenta por el camino más barato; la etiqueta del nodo es su distancia en costo.', push => mcmfSteps(push, 0), GR);
V('Graphs-Algorithms-Flow-Algorithms-MinCostAnyFlow', 'Flujo de costo mínimo con exactamente K unidades', 'Igual que el anterior, pero el último camino solo manda lo que falta para llegar a K; si no se alcanza K, la respuesta es IMPOSSIBLE.', push => mcmfSteps(push, R(2, 6)), GR);

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
    if (t[i] !== '#' || d[i] > 1) push('Centro ' + i + ' de la cadena con #: radio ' + d[i] + (mir ? ' (empezó copiando el radio de su espejo)' : '') + '. Sin los #, el palíndromo mide radio − 1 = ' + (d[i] - 1) + '.', { t, d: d.slice(), i, l, r, best }); }
  push('Palíndromo más largo: "' + t.substr(best - d[best] + 1, 2 * d[best] - 1).replace(/#/g, '') + '".', { t, d, i: -1, l: best - d[best] + 1, r: best + d[best] - 1, best, fin: true });
}, st => rows([{ t: 't', v: [...st.t], c: [...st.t].map((_, j) => st.fin ? (j >= st.l && j <= st.r ? 'g' : '') : j === st.i ? 'a' : j >= st.l && j <= st.r ? 'b' : '') }, { t: 'radio', v: st.d, c: st.d.map((_, j) => j === st.i ? 'a' : '') }]));

V('Strings-Algorithms-MinimalRotation', 'Rotación mínima (dos candidatos)', 'Se comparan dos candidatos i y j; el que pierde salta más allá de la parte comparada.', push => {
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

// =================== Problemas clásicos de CSES ===================
// cuadrícula con colores propios por celda: cells[i][j] = { t: texto, bg: color o '', c: clase }
const gridHtml = (cells, size = 30) => '<div style="display:inline-grid;grid-template-columns:repeat(' + cells[0].length + ',' + size + 'px);gap:3px;margin:8px 0">' +
  cells.flat().map(x => '<div class="cell ' + (x.c || '') + '" style="min-width:0;padding:5px 0;' + (x.bg ? 'background:' + x.bg + ';color:#fff;border-color:' + x.bg : '') + '">' + (x.t === undefined || x.t === '' ? '&nbsp;' : x.t) + '</div>').join('') + '</div>';
const ROOMC = ['#2da44e', '#1f6feb', '#fb8f44', '#8250df', '#cf222e', '#d4a72c', '#0a7ea4', '#bf3989'];

// ---------- DP ----------
V('DP-Classic-Problems-Dice-Combinations', 'Formas de sumar n con un dado', 'Amarillo = suma que se calcula; azul = las seis sumas anteriores de las que puede venir (el último dado vale 1..6).', push => {
  const n = R(7, 11), dp = Array(n + 1).fill(null); dp[0] = 1;
  push('dp[0] = 1: la suma 0 se forma de una sola forma (sin lanzar).', { dp: dp.slice(), s: 0 });
  for (let s = 1; s <= n; s++) { const from = []; let v = 0; for (let k = 1; k <= 6 && k <= s; k++) { from.push(s - k); v += dp[s - k]; } dp[s] = v;
    push('dp[' + s + '] = ' + from.map(x => 'dp[' + x + ']').join(' + ') + ' = ' + v, { dp: dp.slice(), s, from }); }
  push('Hay ' + dp[n] + ' formas de sumar ' + n + '.', { dp: dp.slice(), s: n, fin: 1 });
}, s => rows([{ t: 'suma', v: s.dp.map((_, i) => i) }, { t: 'dp', v: s.dp, c: s.dp.map((v, i) => i === s.s ? (s.fin ? 'g' : 'a') : s.from && s.from.includes(i) ? 'b' : v !== null ? 'g' : '') }]));

V('DP-Classic-Problems-Grid-Paths-I', 'Caminos en una cuadrícula con trampas', 'Rojo = trampa (0 caminos); amarillo = celda que se calcula; azul = de dónde puede llegar (arriba e izquierda).', push => {
  const n = 5, trap = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i + j > 0 && i + j < 2 * n - 2 && Math.random() < 0.2)));
  const dp = trap.map(r => r.map(() => null));
  const st = (i, j, m) => push(m, { trap, dp: clone(dp), i, j });
  st(-1, -1, 'Solo se puede ir a la derecha o abajo. Se llena fila por fila.');
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    if (trap[i][j]) { dp[i][j] = 0; continue; }
    if (!i && !j) { dp[0][0] = 1; st(0, 0, 'La esquina de inicio tiene 1 camino.'); continue; }
    const up = i ? dp[i - 1][j] : 0, left = j ? dp[i][j - 1] : 0; dp[i][j] = up + left;
    st(i, j, '(' + (i + 1) + ', ' + (j + 1) + ') = ' + up + ' (desde arriba) + ' + left + ' (desde la izquierda) = ' + dp[i][j]);
  }
  st(n - 1, n - 1, 'Respuesta: ' + dp[n - 1][n - 1] + ' caminos hasta la esquina final.');
}, s => gridHtml(s.dp.map((r, i) => r.map((v, j) => s.trap[i][j] ? { t: '✕', c: 'r' } : { t: v === null ? '' : v, c: i === s.i && j === s.j ? 'a' : (i === s.i - 1 && j === s.j) || (i === s.i && j === s.j - 1) ? 'b' : v !== null ? 'g' : '' })), 40));

V('DP-Classic-Problems-Money-Sums', 'Sumas que se pueden formar con monedas', 'Verde = suma alcanzable; amarillo = sumas nuevas que aparecen al agregar la moneda (cada vieja s da s + x).', push => {
  const xs = Array.from({ length: 4 }, () => R(1, 6)), T = xs.reduce((a, b) => a + b, 0); let can = new Set([0]);
  push('Con ninguna moneda solo se forma la suma 0. Monedas: ' + xs.join(', '), { T, can: [...can], nw: [], xs, k: -1 });
  xs.forEach((x, k) => { const nw = [...can].map(v => v + x).filter(v => !can.has(v)); nw.forEach(v => can.add(v));
    push('Moneda ' + x + ': cada suma s alcanzable da también s + ' + x + '. Nuevas: ' + (nw.length ? [...new Set(nw)].sort((a, b) => a - b).join(', ') : 'ninguna'), { T, can: [...can], nw, xs, k }); });
  const res = [...can].filter(v => v).sort((a, b) => a - b);
  push(res.length + ' sumas distintas: ' + res.join(' '), { T, can: [...can], nw: [], xs, k: xs.length });
}, s => rows([{ t: 'monedas', v: s.xs, c: s.xs.map((_, k) => k === s.k ? 'a' : k < s.k ? 'g' : '') }, { t: 'suma', v: [...Array(s.T + 1).keys()], c: [...Array(s.T + 1).keys()].map(v => s.nw.includes(v) ? 'a' : s.can.includes(v) ? 'g' : '') }]));

V('DP-Classic-Problems-Removal-Game', 'Juego de quitar extremos (DP de intervalos)', 'd[l][r] = (mis puntos − los del rival) si me toca jugar en x[l..r]. Amarillo = tramo que se calcula; azul = los dos tramos que deja cada jugada.', push => {
  const n = 5, x = Array.from({ length: n }, () => R(1, 9)), d = x.map(() => Array(n).fill(null));
  const st = (l, r, m) => push(m, { x, d: clone(d), l, r });
  st(-1, -1, 'Lista: ' + x.join(', ') + '. Se calculan los tramos de menor a mayor largo.');
  for (let i = 0; i < n; i++) d[i][i] = x[i];
  st(-1, -1, 'Tramos de largo 1: el que juega toma el único número.');
  for (let len = 2; len <= n; len++) for (let l = 0; l + len <= n; l++) { const r = l + len - 1, a = x[l] - d[l + 1][r], b = x[r] - d[l][r - 1]; d[l][r] = Math.max(a, b);
    st(l, r, '[' + (l + 1) + ', ' + (r + 1) + ']: tomar ' + x[l] + ' deja ventaja ' + a + '; tomar ' + x[r] + ' deja ' + b + ' → ' + d[l][r]); }
  const tot = x.reduce((a, b) => a + b, 0);
  st(0, n - 1, 'Ventaja final ' + d[0][n - 1] + ' y total ' + tot + ': el primero obtiene (' + tot + ' + ' + d[0][n - 1] + ') / 2 = ' + (tot + d[0][n - 1]) / 2 + '.');
}, s => cellsRow('lista', s.x, s.x.map((_, i) => i >= s.l && i <= s.r ? 'b' : '')) + table(s.d.map(r => r.map(v => v === null ? '·' : v)), s.d.map((r, i) => r.map((v, j) => i === s.l && j === s.r ? 'a' : (i === s.l + 1 && j === s.r) || (i === s.l && j === s.r - 1) ? 'b' : v !== null ? 'g' : '')), s.x.map((_, i) => 'l=' + (i + 1)), s.x.map((_, i) => 'r=' + (i + 1))));

V('DP-Classic-Problems-Counting-Numbers', 'DP de dígitos: contar hasta x', 'Se cuenta f(x) = números en [0, x] sin dos dígitos vecinos iguales. Verde = prefijo copiado de x; amarillo = posición donde se pone un dígito menor.', push => {
  const x = R(1200, 9899), s = String(x), n = s.length; let res = 1;
  push('Contar en [0, ' + x + ']. Se empieza contando el 0.', { s, i: -1, res });
  for (let L = 1; L < n; L++) { res += 9 ** L; push('Números de ' + L + ' cifra(s): 9 opciones para la primera y 9 para cada siguiente (distinta a la anterior) = ' + 9 ** L + '. Total: ' + res, { s, i: -1, res }); }
  for (let i = 0; i < n; i++) { const opts = []; for (let d = i ? 0 : 1; d < +s[i]; d++) if (!i || d !== +s[i - 1]) opts.push(d);
    res += opts.length * 9 ** (n - 1 - i);
    push('Prefijo ' + (s.slice(0, i) || '(vacío)') + ' y en la posición ' + (i + 1) + ' un dígito menor que ' + s[i] + ': {' + opts.join(', ') + '} × 9^' + (n - 1 - i) + '. Total: ' + res, { s, i, res });
    if (i && s[i] === s[i - 1]) { push('x tiene dos ' + s[i] + ' seguidos: ningún número con este prefijo sirve. f(' + x + ') = ' + res, { s, i, res, stop: 1 }); return; } }
  res++; push(x + ' mismo no tiene vecinos iguales: se suma. f(' + x + ') = ' + res + '. La respuesta de [a, b] es f(b) − f(a − 1).', { s, i: n, res });
}, s => cellsRow('x', [...s.s], [...s.s].map((_, i) => i < s.i ? 'g' : i === s.i ? (s.stop ? 'r' : 'a') : s.i >= s.s.length ? 'g' : '')) + cellsRow('f(x) parcial', [s.res], ['b']));

// ---------- Estructuras de datos ----------
V('Data-Structures-Classic-Problems-Static-Range-Sum-Queries', 'Sumas de prefijos', 'Azul = rango consultado; amarillo = los dos prefijos que se restan: p[b] − p[a−1].', push => {
  const n = 8, x = Array.from({ length: n }, () => R(1, 9)), p = [0]; x.forEach(v => p.push(p[p.length - 1] + v));
  push('Se precalcula p[i] = x₁ + … + xᵢ una sola vez, en O(n).', { x, p, q: null });
  for (let t = 0; t < 3; t++) { const a = R(1, n - 1), b = R(a, n); push('Suma de [' + a + ', ' + b + '] = p[' + b + '] − p[' + (a - 1) + '] = ' + p[b] + ' − ' + p[a - 1] + ' = ' + (p[b] - p[a - 1]) + '. O(1) por consulta.', { x, p, q: [a, b] }); }
}, s => rows([{ t: 'i', v: [...Array(s.p.length).keys()] }, { t: 'x', v: [null, ...s.x], c: [null, ...s.x].map((_, i) => s.q && i >= s.q[0] && i <= s.q[1] ? 'b' : '') }, { t: 'p', v: s.p, c: s.p.map((_, i) => s.q && (i === s.q[1] || i === s.q[0] - 1) ? 'a' : '') }]));

V('Data-Structures-Classic-Problems-Forest-Queries', 'Sumas de prefijos en 2D', 'Izquierda: el bosque (árbol = 🌲). Derecha: p[i][j] = árboles en el rectángulo (1,1)–(i,j). Azul = rectángulo consultado; amarillo = los cuatro valores que se combinan.', push => {
  const n = 5, g = Array.from({ length: n }, () => Array.from({ length: n }, () => Math.random() < 0.4 ? 1 : 0)), p = Array.from({ length: n + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= n; i++) for (let j = 1; j <= n; j++) p[i][j] = p[i - 1][j] + p[i][j - 1] - p[i - 1][j - 1] + g[i - 1][j - 1];
  push('p se construye con inclusión-exclusión: arriba + izquierda − esquina + la celda.', { g, p, q: null });
  for (let t = 0; t < 2; t++) { const y1 = R(1, 3), x1 = R(1, 3), y2 = R(y1, n), x2 = R(x1, n), v = p[y2][x2] - p[y1 - 1][x2] - p[y2][x1 - 1] + p[y1 - 1][x1 - 1];
    push('(' + y1 + ',' + x1 + ')–(' + y2 + ',' + x2 + '): ' + p[y2][x2] + ' − ' + p[y1 - 1][x2] + ' − ' + p[y2][x1 - 1] + ' + ' + p[y1 - 1][x1 - 1] + ' = ' + v + ' árboles.', { g, p, q: [y1, x1, y2, x2] }); }
}, s => { const inQ = (i, j) => s.q && i >= s.q[0] && i <= s.q[2] && j >= s.q[1] && j <= s.q[3];
  const key = s.q ? [[s.q[2], s.q[3]], [s.q[0] - 1, s.q[3]], [s.q[2], s.q[1] - 1], [s.q[0] - 1, s.q[1] - 1]].map(x => x.join(',')) : [];
  return '<div style="display:flex;gap:24px;flex-wrap:wrap;align-items:flex-start">' + gridHtml(s.g.map((r, i) => r.map((v, j) => ({ t: v ? '🌲' : '', c: inQ(i + 1, j + 1) ? 'b' : '' })))) +
    table(s.p.map(r => r), s.p.map((r, i) => r.map((_, j) => key.includes(i + ',' + j) ? 'a' : inQ(i, j) ? 'b' : '')), s.p.map((_, i) => i), s.p.map((_, j) => j)) + '</div>'; });

V('Data-Structures-Classic-Problems-Range-Update-Queries', 'Sumar a un rango con el arreglo de diferencias', 'Sumar u a [a, b] cambia solo dos casillas de d (+u en a, −u en b+1). El valor de k es el original más d₁ + … + d_k (azul).', push => {
  const n = 8, x = Array.from({ length: n }, () => R(1, 9)), d = Array(n + 2).fill(0);
  const val = k => x[k - 1] + d.slice(1, k + 1).reduce((a, b) => a + b, 0);
  push('Se guardan los cambios como diferencias (en el código, dentro de un Fenwick Tree).', { x, d: d.slice(1, n + 1), hl: [], q: 0 });
  for (let t = 0; t < 5; t++) {
    if (t % 2 === 0) { const a = R(1, n - 1), b = R(a, n), u = R(1, 5); d[a] += u; if (b + 1 <= n) d[b + 1] -= u;
      push('Sumar ' + u + ' a [' + a + ', ' + b + ']: d[' + a + '] += ' + u + (b + 1 <= n ? ' y d[' + (b + 1) + '] −= ' + u : '') + '.', { x, d: d.slice(1, n + 1), hl: [a, b + 1], q: 0 }); }
    else { const k = R(1, n); push('Valor en ' + k + ' = ' + x[k - 1] + ' + (d₁ + … + d_' + k + ') = ' + val(k) + '.', { x, d: d.slice(1, n + 1), hl: [], q: k }); }
  }
}, s => rows([{ t: 'original', v: s.x, c: s.x.map((_, i) => i + 1 === s.q ? 'a' : '') }, { t: 'd', v: s.d, c: s.d.map((_, i) => s.hl.includes(i + 1) ? 'a' : i < s.q ? 'b' : '') }]));

V('Data-Structures-Classic-Problems-Hotel-Queries', 'Primer hotel con espacio (descenso en Segment Tree)', 'Cada nodo guarda el máximo de cuartos libres de su tramo. Azul = camino de bajada; amarillo = hotel asignado.', push => {
  const n = 8, L = segLayout(n), t = {}, h = Array.from({ length: n }, () => R(1, 9));
  const build = (id, l, r) => { if (l === r) { t[id] = h[l]; return; } const m = (l + r) >> 1; build(2 * id, l, m); build(2 * id + 1, m + 1, r); t[id] = Math.max(t[2 * id], t[2 * id + 1]); };
  build(1, 0, n - 1);
  const S = (m, c = {}) => push(m, { L, t: Object.assign({}, t), c });
  S('Cuartos libres de cada hotel en las hojas; cada padre = máximo de sus hijos.');
  for (let g = 0; g < 4; g++) { const r = R(1, 8), c = {};
    if (t[1] < r) { c[1] = 'r'; S('Un grupo pide ' + r + ': ni el máximo (' + t[1] + ') alcanza → 0.', c); continue; }
    let id = 1, l = 0, rr = n - 1; const path = [];
    while (l < rr) { c[id] = 'b'; path.push(id); const m = (l + rr) >> 1; if (t[2 * id] >= r) { id = 2 * id; rr = m; } else { id = 2 * id + 1; l = m + 1; } }
    c[id] = 'a'; S('Un grupo pide ' + r + ': se baja por la izquierda si su máximo alcanza → hotel ' + (l + 1) + '.', c);
    t[id] -= r; path.reverse().forEach(v => t[v] = Math.max(t[2 * v], t[2 * v + 1]));
    S('Al hotel ' + (l + 1) + ' le quedan ' + t[id] + ' cuartos; se recalcula el camino a la raíz.', c); }
}, s => graph({ W: 540, H: 250, nodes: s.L.nodes.map(nd => ({ x: nd.x, y: nd.y + 14, l: s.t[nd.id], c: s.c[nd.id] || '', s: nd.l === nd.r ? 'h' + (nd.l + 1) : '' })), edges: s.L.edges.map(([u, v]) => ({ a: s.L.idx[u], b: s.L.idx[v] })) }));

V('Data-Structures-Classic-Problems-Prefix-Sum-Queries', 'Segment Tree con nodos (suma, mejor prefijo)', 'Cada nodo muestra suma/prefijo. Verde = nodos que forman la consulta, combinados de izquierda a derecha: prefijo = max(P_izq, S_izq + P_der).', push => {
  const n = 8, L = segLayout(n), S = {}, P = {}, x = Array.from({ length: n }, () => R(-5, 6));
  const pull = id => { S[id] = S[2 * id] + S[2 * id + 1]; P[id] = Math.max(P[2 * id], S[2 * id] + P[2 * id + 1]); };
  const build = (id, l, r) => { if (l === r) { S[id] = x[l]; P[id] = Math.max(0, x[l]); return; } const m = (l + r) >> 1; build(2 * id, l, m); build(2 * id + 1, m + 1, r); pull(id); };
  build(1, 0, n - 1);
  const st = (m, c = {}) => push(m, { L, S: Object.assign({}, S), P: Object.assign({}, P), c });
  st('Arreglo: ' + x.join(', ') + '. Hoja = (x, max(0, x)).');
  for (let q = 0; q < 2; q++) { const a = R(0, 3), b = R(a + 2, n - 1), c = {}, used = [];
    (function go(id, l, r) { if (r < a || l > b) return; if (a <= l && r <= b) { used.push(id); c[id] = 'g'; return; } c[id] = 'b'; const m = (l + r) >> 1; go(2 * id, l, m); go(2 * id + 1, m + 1, r); })(1, 0, n - 1);
    let s = 0, p = 0; const log = []; used.forEach(id => { p = Math.max(p, s + P[id]); s += S[id]; log.push('(' + S[id] + '/' + P[id] + ')'); });
    st('Consulta [' + (a + 1) + ', ' + (b + 1) + ']: se combinan ' + log.join(' · ') + ' en orden → mejor prefijo = ' + p + '.', c); }
}, s => graph({ W: 540, H: 250, nodes: s.L.nodes.map(nd => ({ x: nd.x, y: nd.y + 14, l: s.S[nd.id], c: s.c[nd.id] || '', s: 'p ' + s.P[nd.id] })), edges: s.L.edges.map(([u, v]) => ({ a: s.L.idx[u], b: s.L.idx[v] })) }));

// ---------- Grafos ----------
V('Graphs-Classic-Problems-Counting-Rooms', 'Contar cuartos (flood fill)', 'Gris oscuro = pared. Cada color es un cuarto: al encontrar piso sin visitar se pinta entero.', push => {
  const n = 6, m = 10, wall = Array.from({ length: n }, () => Array.from({ length: m }, () => Math.random() < 0.38)), col = wall.map(r => r.map(() => -1));
  const st = (msg, cur) => push(msg, { wall, col: clone(col), cur });
  st('Mapa del edificio. Se recorre fila por fila buscando piso sin visitar.');
  let rooms = 0;
  for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) { if (wall[i][j] || col[i][j] >= 0) continue;
    const q = [[i, j]]; col[i][j] = rooms; let k = 0;
    while (k < q.length) { const [a, b] = q[k++]; for (const [x, y] of [[a + 1, b], [a - 1, b], [a, b + 1], [a, b - 1]]) if (x >= 0 && y >= 0 && x < n && y < m && !wall[x][y] && col[x][y] < 0) { col[x][y] = rooms; q.push([x, y]); } }
    rooms++; st('Piso nuevo en (' + (i + 1) + ', ' + (j + 1) + '): cuarto ' + rooms + ' (' + q.length + ' celdas).', [i, j]); }
  st('Hay ' + rooms + ' cuartos.');
}, s => gridHtml(s.wall.map((r, i) => r.map((w, j) => w ? { bg: '#57606a' } : s.col[i][j] >= 0 ? { bg: ROOMC[s.col[i][j] % ROOMC.length], t: s.cur && s.cur[0] === i && s.cur[1] === j ? '★' : '' } : { t: '' }))));

V('Graphs-Classic-Problems-Labyrinth', 'BFS en un laberinto y reconstrucción del camino', 'Los números son la distancia desde A. Amarillo = frontera actual del BFS; verde = el camino más corto, reconstruido desde B.', push => {
  const n = 6, m = 10; let wall, A = [0, 0], B = [n - 1, m - 1], dist;
  for (let tries = 0; tries < 50; tries++) { wall = Array.from({ length: n }, () => Array.from({ length: m }, () => Math.random() < 0.3)); wall[0][0] = wall[n - 1][m - 1] = false;
    dist = wall.map(r => r.map(() => -1)); dist[0][0] = 0; const q = [A]; for (let k = 0; k < q.length; k++) { const [a, b] = q[k]; for (const [x, y] of [[a + 1, b], [a - 1, b], [a, b + 1], [a, b - 1]]) if (x >= 0 && y >= 0 && x < n && y < m && !wall[x][y] && dist[x][y] < 0) { dist[x][y] = dist[a][b] + 1; q.push([x, y]); } }
    if (dist[n - 1][m - 1] > 0) break; }
  const D = dist[n - 1][m - 1], show = d => dist.map(r => r.map(v => v >= 0 && v <= d ? v : -1));
  push('A arriba a la izquierda, B abajo a la derecha.', { wall, d: show(0), front: 0, path: [] });
  for (let d = 1; d <= Math.max(D, 0); d += Math.max(1, Math.ceil(D / 6))) push('Nivel ' + d + ' del BFS: celdas a distancia ' + d + '.', { wall, d: show(d), front: d, path: [] });
  if (D < 0) { push('B no es alcanzable: NO.', { wall, d: show(99), front: -1, path: [] }); return; }
  const path = [B.join(',')]; let [x, y] = B; const dirs = [];
  while (dist[x][y] > 0) for (const [a, b, c] of [[x - 1, y, 'D'], [x + 1, y, 'U'], [x, y - 1, 'R'], [x, y + 1, 'L']]) if (a >= 0 && b >= 0 && a < n && b < m && dist[a][b] === dist[x][y] - 1) { dirs.push(c); x = a; y = b; path.push(a + ',' + b); break; }
  push('Desde B se retrocede siempre a una celda con distancia una menos: YES, ' + D + ' pasos: ' + dirs.reverse().join(''), { wall, d: show(99), front: -1, path });
}, s => gridHtml(s.wall.map((r, i) => r.map((w, j) => { const k = i + ',' + j, v = s.d[i][j];
  if (w) return { bg: '#57606a' }; const t = i === 0 && j === 0 ? 'A' : i === s.wall.length - 1 && j === r.length - 1 ? 'B' : v >= 0 ? v : '';
  return { t, c: s.path.includes(k) ? 'g' : v >= 0 && v === s.front ? 'a' : v >= 0 ? 'b' : '' }; }))));

V('Graphs-Classic-Problems-Flight-Discount', 'Un cupón: Dijkstra desde el inicio y desde el final', 'Etiqueta arriba de cada ciudad: distancia desde 1 / distancia hasta n. Amarillo = vuelo donde conviene usar el cupón.', push => {
  const n = 6, xy = circleLayout(n), E = []; const has = new Set();
  for (let i = 0; i < n - 1; i++) { E.push({ a: i, b: i + 1, w: R(2, 9) }); has.add(i + ',' + (i + 1)); }
  while (E.length < 9) { const a = R(0, n - 1), b = R(0, n - 1); if (a !== b && !has.has(a + ',' + b)) { has.add(a + ',' + b); E.push({ a, b, w: R(2, 20) }); } }
  const dij = (s, rev) => { const d = Array(n).fill(Infinity), done = Array(n).fill(false); d[s] = 0; for (let it = 0; it < n; it++) { let u = -1; for (let v = 0; v < n; v++) if (!done[v] && (u < 0 || d[v] < d[u])) u = v; if (d[u] === Infinity) break; done[u] = true; for (const e of E) { const [x, y] = rev ? [e.b, e.a] : [e.a, e.b]; if (x === u && d[u] + e.w < d[y]) d[y] = d[u] + e.w; } } return d; };
  const d1 = dij(0), dn = dij(n - 1, true), s = GS(xy, E, true);
  s.nc[0] = 'b'; s.nc[n - 1] = 'o';
  s.ns = d1.map(v => fmt(v) + ' / ?'); push('Primero: Dijkstra desde la ciudad 1 (primer número).', clone(s));
  s.ns = d1.map((v, i) => fmt(v) + ' / ' + fmt(dn[i])); push('Luego: Dijkstra desde n en el grafo con las flechas al revés (segundo número = cuánto falta hasta n).', clone(s));
  let best = Infinity, bk = -1;
  E.forEach((e, k) => { const c = d1[e.a] + Math.floor(e.w / 2) + dn[e.b]; if (c < best) { best = c; bk = k; } });
  s.ec[bk] = 'a'; const e = E[bk];
  push('Para cada vuelo a → b: d1[a] + ⌊c/2⌋ + dn[b]. El mejor es ' + (e.a + 1) + ' → ' + (e.b + 1) + ': ' + d1[e.a] + ' + ' + Math.floor(e.w / 2) + ' + ' + dn[e.b] + ' = ' + best + '.', clone(s));
}, GR);

V('Graphs-Classic-Problems-Longest-Flight-Route', 'Camino más largo en un DAG', 'Etiqueta = máximo de ciudades en una ruta desde 1 (−: no se llega). Amarillo = ciudad que se procesa en orden topológico; verde = la ruta final.', push => {
  const n = 7, xy = circleLayout(n), E = [], has = new Set();
  const order = [0, ...shuffle([...Array(n - 2).keys()].map(i => i + 1)), n - 1], pos = {}; order.forEach((v, i) => pos[v] = i);
  while (E.length < 11) { let a = R(0, n - 1), b = R(0, n - 1); if (a === b) continue; if (pos[a] > pos[b]) [a, b] = [b, a]; if (!has.has(a + ',' + b)) { has.add(a + ',' + b); E.push({ a, b }); } }
  const s = GS(xy, E, true), best = Array(n).fill(-1), par = Array(n).fill(-1); best[0] = 1;
  s.ns = best.map(v => v < 0 ? '−' : v); push('No hay ciclos. Se procesa en orden topológico: ' + order.map(v => v + 1).join(', '), clone(s));
  for (const u of order) { s.nc = s.nc.map(c => c === 'a' ? 'k' : c); s.nc[u] = 'a';
    for (const e of E) if (e.a === u && best[u] > 0 && best[u] + 1 > best[e.b]) { best[e.b] = best[u] + 1; par[e.b] = u; }
    s.ns = best.map(v => v < 0 ? '−' : v); push('Ciudad ' + (u + 1) + (best[u] > 0 ? ': se extiende su mejor ruta (' + best[u] + ') a sus vecinas.' : ': no se llega desde 1, se salta.'), clone(s)); }
  s.nc = s.nc.map(() => '');
  if (best[n - 1] < 0) { push('No se llega a ' + n + ': IMPOSSIBLE.', s); return; }
  const path = [n - 1]; while (par[path[path.length - 1]] >= 0) path.push(par[path[path.length - 1]]); path.reverse();
  path.forEach(v => s.nc[v] = 'g'); E.forEach((e, k) => { for (let i = 0; i + 1 < path.length; i++) if (e.a === path[i] && e.b === path[i + 1]) s.ec[k] = 'g'; });
  push('Ruta con ' + best[n - 1] + ' ciudades: ' + path.map(v => v + 1).join(' → '), s);
}, GR);

V('Graphs-Classic-Problems-Subordinates', 'Subordinados = tamaño del subárbol − 1', 'Se procesa de las hojas hacia el director (orden BFS al revés). Etiqueta = subordinados ya contados; amarillo = empleado que suma a su jefe.', push => {
  const n = 10, { T, s } = treeState(n), sub = Array(n).fill(0), order = [0]; for (const u of order) order.push(...T.kids[u]);
  s.ns = sub.map(() => 0); push('Orden BFS desde el director (1): ' + order.map(v => v + 1).join(', ') + '. Se recorre al revés.', clone(s));
  for (const v of order.slice(1).reverse()) { const p = T.par[v]; sub[p] += sub[v] + 1; s.nc = s.nc.map(c => c === 'a' ? 'g' : c); s.nc[v] = 'a'; s.ns = sub.slice();
    push('Empleado ' + (v + 1) + ' (' + sub[v] + ' subordinados): su jefe ' + (p + 1) + ' suma ' + (sub[v] + 1) + ' → ' + sub[p] + '.', clone(s)); }
  s.nc = s.nc.map(() => 'g'); push('Listo: ' + sub.join(' '), s);
}, GR);

// ---------- Cadenas ----------
const CP_STR = ['abacabab', 'aabaaab', 'abcabcab', 'abababab', 'aaabaaa', 'abcabca'];
V('Strings-Classic-Problems-Finding-Borders', 'Bordes con la función de prefijos', 'π[i] = mayor borde de s[0..i]. Los bordes de s son π[n−1], luego π[π[n−1]−1], y así (verde = borde actual).', push => {
  const s = pick(CP_STR), n = s.length, pi = Array(n).fill(null); pi[0] = 0;
  push('Se calcula π de izquierda a derecha.', { s, pi: pi.slice(), i: 0, b: 0 });
  for (let i = 1; i < n; i++) { let j = pi[i - 1]; while (j && s[i] !== s[j]) j = pi[j - 1]; if (s[i] === s[j]) j++; pi[i] = j; push('π[' + i + '] = ' + j, { s, pi: pi.slice(), i, b: 0 }); }
  const res = []; for (let b = pi[n - 1]; b; b = pi[b - 1]) { res.push(b); push('Borde de largo ' + b + ': "' + s.slice(0, b) + '" es prefijo y sufijo.', { s, pi: pi.slice(), i: -1, b }); }
  push('Bordes: ' + (res.length ? res.reverse().join(' ') : 'ninguno'), { s, pi: pi.slice(), i: -1, b: 0 });
}, s => rows([{ t: 's', v: [...s.s], c: [...s.s].map((_, k) => s.b && (k < s.b || k >= s.s.length - s.b) ? 'g' : k === s.i ? 'a' : '') }, { t: 'π', v: s.pi, c: s.pi.map((v, k) => k === s.i ? 'a' : v !== null ? 'b' : '') }]));

V('Strings-Classic-Problems-Finding-Periods', 'Periodos con la función Z', 'p es periodo si z[p] = n − p: desde p, la cadena coincide con su prefijo hasta el final. Verde = periodo; rojo = no.', push => {
  const s = pick(CP_STR), n = s.length, z = Array(n).fill(0);
  for (let i = 1, l = 0, r = 0; i < n; i++) { if (i < r) z[i] = Math.min(r - i, z[i - l]); while (i + z[i] < n && s[z[i]] === s[i + z[i]]) z[i]++; if (i + z[i] > r) { l = i; r = i + z[i]; } }
  const per = []; push('Función Z de "' + s + '".', { s, z, p: -1, per: [] });
  for (let p = 1; p < n; p++) { const ok = z[p] === n - p; if (ok) per.push(p); push('p = ' + p + ': z[' + p + '] = ' + z[p] + (ok ? ' = n − p → periodo "' + s.slice(0, p) + '"' : ' < ' + (n - p) + ' → no'), { s, z, p, per: per.slice(), ok }); }
  per.push(n); push('Periodos: ' + per.join(' ') + ' (n siempre lo es).', { s, z, p: -1, per });
}, s => rows([{ t: 's', v: [...s.s], c: [...s.s].map((_, k) => s.p > 0 && k >= s.p ? (s.ok ? 'g' : 'r') : '') }, { t: 'z', v: s.z, c: s.z.map((_, k) => k === s.p ? 'a' : s.per.includes(k) ? 'g' : '') }]));

V('Strings-Classic-Problems-Distinct-Subsequences', 'Subsecuencias distintas', 'T = subsecuencias distintas (con la vacía). Cada letra duplica T, pero se resta lo que había antes de su aparición anterior (last).', push => {
  const s = pick(['abab', 'aybabtu', 'abcab', 'aabb', 'abca']); let T = 1; const last = {}, hist = [1];
  push('T = 1 (solo la vacía).', { s, i: -1, hist: hist.slice(), last: { ...last } });
  for (let i = 0; i < s.length; i++) { const c = s[i], L = last[c] || 0, nT = 2 * T - L; last[c] = T; T = nT; hist.push(T);
    push('"' + c + '": T = 2·' + hist[i] + ' − ' + L + ' = ' + T + (L ? ' (las que ya terminaban en ' + c + ' se repetían)' : ''), { s, i, hist: hist.slice(), last: { ...last } }); }
  push('Sin la vacía: ' + (T - 1) + ' subsecuencias distintas.', { s, i: s.length, hist, last });
}, s => rows([{ t: 'letra', v: ['∅', ...s.s], c: ['', ...[...s.s].map((_, k) => k === s.i ? 'a' : k < s.i ? 'g' : '')] }, { t: 'T', v: s.hist, c: s.hist.map((_, k) => k === s.i + 1 ? 'a' : 'g') }]) + '<p class="note">last: ' + (Object.entries(s.last).map(([c, v]) => c + '=' + v).join(', ') || '—') + '</p>');

V('Strings-Classic-Problems-Repeating-Substring', 'Mayor subcadena repetida con el suffix array', 'Sufijos ordenados y LCP con el vecino de arriba. El mayor LCP (verde) es la subcadena repetida más larga.', push => {
  const s = pick(['banana', 'abracadabra', 'mississippi', 'cabababc', 'abcabcd']), sa = [...Array(s.length).keys()].sort((a, b) => s.slice(a) < s.slice(b) ? -1 : 1);
  const lcp = sa.map((v, i) => { if (!i) return 0; const a = s.slice(v), b = s.slice(sa[i - 1]); let k = 0; while (k < a.length && a[k] === b[k]) k++; return k; });
  push('Sufijos de "' + s + '" ordenados alfabéticamente.', { s, sa, lcp, k: -1, best: -1 });
  let best = 0, bi = 0; for (let i = 1; i < sa.length; i++) { if (lcp[i] > best) { best = lcp[i]; bi = i; } push('LCP con el anterior = ' + lcp[i] + (lcp[i] === best && i === bi ? ' (nuevo máximo)' : ''), { s, sa, lcp, k: i, best: bi }); }
  push(best ? 'La subcadena repetida más larga es "' + s.substr(sa[bi], best) + '" (largo ' + best + ').' : 'Nada se repite: −1.', { s, sa, lcp, k: -1, best: bi });
}, s => table(s.sa.map((v, i) => [v, s.s.slice(v), s.lcp[i]]), s.sa.map((_, i) => i === s.best ? ['g', 'g', 'g'] : i === s.k ? ['a', 'a', 'a'] : ['', '', '']), null, ['pos', 'sufijo', 'LCP']));

V('Strings-Classic-Problems-Required-Substring', 'Contar cadenas que contienen el patrón (DP sobre KMP)', 'Alfabeto reducido a {A, B} para que se vea. dp[k] = cadenas que aún no contienen el patrón y llevan k letras emparejadas; las que llegan a m (verde) ya lo contienen.', push => {
  const p = pick(['ABA', 'AAB', 'ABB', 'BAB']), m = p.length, n = 5, pi = [0];
  for (let i = 1; i < m; i++) { let j = pi[i - 1]; while (j && p[i] !== p[j]) j = pi[j - 1]; if (p[i] === p[j]) j++; pi.push(j); }
  const go = (k, c) => { while (k && p[k] !== c) k = pi[k - 1]; return p[k] === c ? k + 1 : 0; };
  let dp = Array(m).fill(0); dp[0] = 1; let total = 1, hit = 0; const tab = [[...dp, 0]];
  push('Patrón "' + p + '". go[k][c] = letras emparejadas tras leer c con k emparejadas.', { tab: tab.slice(), m, len: 0 });
  for (let len = 1; len <= n; len++) { const nd = Array(m).fill(0); let nh = 0; for (let k = 0; k < m; k++) for (const c of 'AB') { const t = go(k, c); if (t < m) nd[t] += dp[k]; else nh += dp[k]; }
    total *= 2; hit = total - nd.reduce((a, b) => a + b, 0); dp = nd; tab.push([...dp, hit]);
    push('Largo ' + len + ': ' + nd.reduce((a, b) => a + b, 0) + ' cadenas aún sin el patrón, ' + hit + ' lo contienen (= 2^' + len + ' − las que no).', { tab: tab.slice(), m, len }); }
}, s => table(s.tab, s.tab.map((r, i) => r.map((_, k) => k === s.m ? 'g' : i === s.len ? 'a' : '')), s.tab.map((_, i) => 'largo ' + i), [...Array(s.m).keys()].map(k => 'k=' + k).concat(['contienen'])));

// ---------- Geometría ----------
V('Geometry-Classic-Problems-Point-Location-Test', 'Izquierda, derecha o sobre la recta', 'Se mira desde p1 hacia p2. Verde = LEFT (cruz > 0), rojo = RIGHT (cruz < 0), amarillo = TOUCH.', push => {
  const p1 = [-8, -4], p2 = [8, 3], pts = Array.from({ length: 6 }, () => [R(-10, 10), R(-6, 6)]); pts.push([0, -0.5]); const done = [];
  push('Recta de p1 a p2.', { p1, p2, pts, done: [] });
  pts.forEach(q => { const c = cross(p1, p2, q); done.push(c); push('(' + q.join(', ') + '): cruz = ' + c + ' → ' + (c > 0 ? 'LEFT (izquierda)' : c < 0 ? 'RIGHT (derecha)' : 'TOUCH (sobre la recta)'), { p1, p2, pts, done: done.slice() }); });
}, s => { const d = [s.p2[0] - s.p1[0], s.p2[1] - s.p1[1]]; let g = gridBg() + seg([s.p1[0] - d[0], s.p1[1] - d[1]], [s.p2[0] + d[0], s.p2[1] + d[1]], '#999', 1, 1) + seg(s.p1, s.p2, '#1f6feb', 3) + dot(s.p1, '#1f6feb', 5, 'p1') + dot(s.p2, '#1f6feb', 5, 'p2');
  s.pts.forEach((q, i) => { const c = s.done[i]; g += dot(q, c === undefined ? '#999' : c > 0 ? '#2da44e' : c < 0 ? '#cf222e' : '#d4a72c', i === s.done.length - 1 ? 7 : 5); }); return svgBox(g, G0.W, G0.H); });

V('Geometry-Classic-Problems-Maximum-Manhattan-Distances', 'Distancia Manhattan máxima con u = x + y, v = x − y', 'Azul = puntos con u = x + y mínimo y máximo; naranja = con v = x − y mínimo y máximo. La respuesta es el mayor de los dos rangos.', push => {
  const P = []; let S = new Set(); while (P.length < 7) { const p = [R(-10, 10), R(-6, 6)]; if (!S.has(p + '')) { S.add(p + ''); P.push(p); } }
  for (let k = 1; k <= P.length; k++) { const Q = P.slice(0, k), u = Q.map(p => p[0] + p[1]), v = Q.map(p => p[0] - p[1]);
    const du = Math.max(...u) - Math.min(...u), dv = Math.max(...v) - Math.min(...v);
    push('Se agrega (' + P[k - 1].join(', ') + '). Rango de u = ' + du + ', rango de v = ' + dv + ' → máximo = ' + Math.max(du, dv), { Q, u, v }); }
}, s => { let g = gridBg(); const iu = [s.u.indexOf(Math.min(...s.u)), s.u.indexOf(Math.max(...s.u))], iv = [s.v.indexOf(Math.min(...s.v)), s.v.indexOf(Math.max(...s.v))];
  if (s.Q.length > 1) { g += seg(s.Q[iu[0]], s.Q[iu[1]], '#1f6feb', 1.5, 1) + seg(s.Q[iv[0]], s.Q[iv[1]], '#fb8f44', 1.5, 1); }
  s.Q.forEach((p, i) => g += dot(p, iu.includes(i) ? '#1f6feb' : iv.includes(i) ? '#fb8f44' : '#888', i === s.Q.length - 1 ? 7 : 5)); return svgBox(g, G0.W, G0.H); });

V('Geometry-Classic-Problems-Intersection-Points', 'Barrido para contar cruces', 'La línea amarilla barre de izquierda a derecha. Azul = horizontales activos; cada vertical (verde) cuenta los activos con altura dentro de su rango.', push => {
  const H = [], Vt = []; const ys = shuffle([-5, -3, -1, 1, 3, 5]).slice(0, 4), xs = shuffle([-8, -5, -2, 1, 4, 7]).slice(0, 4);
  ys.forEach(y => { const a = R(-11, -4), b = R(2, 11); H.push([a + 0.5, y, b - 0.5]); });
  xs.forEach(x => { const a = R(-6, -1), b = R(1, 6); Vt.push([x, a + 0.5, b - 0.5]); });
  const ev = [...H.map((h, i) => [h[0], 0, i]), ...Vt.map((v, i) => [v[0], 1, i]), ...H.map((h, i) => [h[2], 2, i])].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const act = new Set(); let tot = 0;
  push('Segmentos horizontales y verticales.', { H, Vt, x: null, act: [], tot, cv: -1 });
  for (const [x, t, i] of ev) {
    if (t === 0) { act.add(i); push('Empieza un horizontal (y = ' + H[i][1] + '): se activa.', { H, Vt, x, act: [...act], tot, cv: -1 }); }
    else if (t === 2) { act.delete(i); push('Termina el horizontal y = ' + H[i][1] + '.', { H, Vt, x, act: [...act], tot, cv: -1 }); }
    else { const v = Vt[i], c = [...act].filter(k => H[k][1] >= v[1] && H[k][1] <= v[2]).length; tot += c; push('Vertical en x = ' + v[0] + ': cruza ' + c + ' horizontal(es) activo(s). Total = ' + tot, { H, Vt, x, act: [...act], tot, cv: i }); }
  }
  push('Hay ' + tot + ' puntos de intersección.', { H, Vt, x: null, act: [], tot, cv: -1 });
}, s => { let g = gridBg(); s.H.forEach((h, i) => g += seg([h[0], h[1]], [h[2], h[1]], s.act.includes(i) ? '#1f6feb' : '#aaa', 3));
  s.Vt.forEach((v, i) => g += seg([v[0], v[1]], [v[0], v[2]], i === s.cv ? '#2da44e' : '#aaa', 3));
  if (s.x !== null) g += seg([s.x, -7], [s.x, 7], '#d4a72c', 2, 1); return svgBox(g, G0.W, G0.H); });

V('Geometry-Classic-Problems-Area-of-Rectangles', 'Área de la unión con barrido', 'Entre dos eventos seguidos en x, el largo cubierto en y no cambia: el área de esa franja (verde) es largo × ancho.', push => {
  const Rs = Array.from({ length: 3 }, () => { const x1 = R(-10, 3), y1 = R(-6, 1); return [x1, y1, x1 + R(3, 7), y1 + R(2, 5)]; });
  const xs = [...new Set(Rs.flatMap(r => [r[0], r[2]]))].sort((a, b) => a - b); let area = 0; const strips = [];
  push('Rectángulos (pueden encimarse). Eventos en x: ' + xs.join(', '), { Rs, strips: [], cur: null });
  for (let i = 0; i + 1 < xs.length; i++) { const a = xs[i], b = xs[i + 1], iv = Rs.filter(r => r[0] <= a && r[2] >= b).map(r => [r[1], r[3]]).sort((p, q) => p[0] - q[0]);
    let cov = 0, lo = -Infinity, hi = -Infinity; const parts = []; for (const [y1, y2] of iv) { if (y1 > hi) { if (hi > lo) { cov += hi - lo; parts.push([lo, hi]); } lo = y1; hi = y2; } else hi = Math.max(hi, y2); } if (hi > lo) { cov += hi - lo; parts.push([lo, hi]); }
    area += cov * (b - a); parts.forEach(p => strips.push([a, p[0], b, p[1]]));
    push('Franja x ∈ [' + a + ', ' + b + ']: cubierto en y = ' + cov + ' → ' + cov + ' × ' + (b - a) + ' = ' + cov * (b - a) + '. Área = ' + area, { Rs, strips: strips.slice(), cur: [a, b] }); }
  push('Área total de la unión: ' + area, { Rs, strips, cur: null });
}, s => { let g = gridBg(); s.strips.forEach(r => g += poly([[r[0], r[1]], [r[2], r[1]], [r[2], r[3]], [r[0], r[3]]], '#2da44e55', 'none'));
  s.Rs.forEach(r => g += poly([[r[0], r[1]], [r[2], r[1]], [r[2], r[3]], [r[0], r[3]]], 'none', '#1f6feb'));
  if (s.cur) g += seg([s.cur[0], -7], [s.cur[0], 7], '#d4a72c', 1.5, 1) + seg([s.cur[1], -7], [s.cur[1], 7], '#d4a72c', 1.5, 1); return svgBox(g, G0.W, G0.H); });

V('Geometry-Classic-Problems-Lines-and-Queries-I', 'Máximo entre rectas en un punto', 'Cada consulta x busca la recta más alta en ese x (punto verde). Aquí se dibujan todas para verlo; el Li Chao Tree guarda en cada nodo la recta que gana en el centro de su tramo y responde mirando solo O(log X) de ellas.', push => {
  const L = []; const ops = ['add', 'add', 'q', 'add', 'q', 'add', 'q', 'q'];
  for (const o of ops) {
    if (o === 'add' || !L.length) { const a = R(-4, 4) / 8, b = R(-4, 4); L.push([a, b]); push('Se agrega la recta y = ' + (a ? a + 'x ' : '') + (b < 0 ? '− ' + -b : '+ ' + b), { L: L.slice(), q: null }); }
    else { const x = R(-9, 9), ys = L.map(([a, b]) => a * x + b), m = Math.max(...ys); push('Consulta x = ' + x + ': la recta más alta da ' + m + '.', { L: L.slice(), q: [x, m, ys.indexOf(m)] }); }
  }
}, s => { let g = gridBg(); s.L.forEach(([a, b], i) => g += seg([-12, a * -12 + b], [12, a * 12 + b], s.q && s.q[2] === i ? '#2da44e' : '#1f6feb', s.q && s.q[2] === i ? 3 : 1.5));
  if (s.q) g += seg([s.q[0], -7], [s.q[0], 7], '#d4a72c', 1.5, 1) + dot([s.q[0], s.q[1]], '#2da44e', 6); return svgBox(g, G0.W, G0.H); });

// ---------- Herramientas ----------
V('FunctionalTools-Classic-Problems-Exponentiation', 'a^b con exponenciación binaria', 'Se recorren los bits de b de menor a mayor: la base se eleva al cuadrado en cada paso y se multiplica en el resultado si el bit está encendido (verde).', push => {
  const M = 1000000007, a = R(2, 9), b = R(10, 60), bits = b.toString(2).split('').reverse().map(Number); let base = a, res = 1;
  push(a + '^' + b + ' mód 10^9+7. En binario b = ' + b.toString(2) + '.', { bits, j: -1, base, res });
  bits.forEach((bt, j) => { if (bt) res = res * base % M; push('Bit ' + j + (bt ? ' encendido: resultado ×= ' + base : ' apagado: no se multiplica') + '.', { bits, j, base, res });
    base = Number(BigInt(base) * BigInt(base) % BigInt(M)); });
  push('Resultado: ' + res + ' con solo ' + bits.length + ' cuadrados en vez de ' + b + ' multiplicaciones.', { bits, j: bits.length, base, res });
}, s => rows([{ t: 'bits de b', v: s.bits, c: s.bits.map((bt, j) => j === s.j ? 'a' : j < s.j ? (bt ? 'g' : 'r') : '') }, { t: 'base actual', v: [s.base] }, { t: 'resultado', v: [s.res], c: ['g'] }]));

V('FunctionalTools-Classic-Problems-Counting-Divisors', 'Cantidad de divisores con la criba del menor primo', 'spf[x] = menor primo que divide a x. Se divide por spf repetidamente; si x = p₁^e₁·p₂^e₂…, hay (e₁+1)(e₂+1)… divisores.', push => {
  const x0 = pick([360, 720, 1260, 840, 2520, 504, 1800]); let x = x0; const spf = v => { for (let p = 2; p * p <= v; p++) if (v % p === 0) return p; return v; };
  const fac = []; push('x = ' + x0 + '.', { fac: [], x });
  while (x > 1) { const p = spf(x); let e = 0; while (x % p === 0) { x /= p; e++; } fac.push([p, e]); push('spf = ' + p + ': aparece ' + pl(e, 'vez', 'veces') + '. Queda ' + x + '.', { fac: fac.slice(), x }); }
  const d = fac.reduce((r, [, e]) => r * (e + 1), 1);
  push(x0 + ' = ' + fac.map(([p, e]) => p + '^' + e).join(' · ') + ' → ' + fac.map(([, e]) => '(' + e + '+1)').join('·') + ' = ' + d + ' divisores.', { fac, x, d });
}, s => rows([{ t: 'primo', v: s.fac.length ? s.fac.map(f => f[0]) : [null], c: s.fac.map(() => 'g') }, { t: 'exponente', v: s.fac.length ? s.fac.map(f => f[1]) : [null], c: s.fac.map(() => 'b') }, { t: 'resto', v: [s.x] }]));

V('FunctionalTools-Classic-Problems-Distributing-Apples', 'Estrellas y barras', 'Cada fila es un reparto: ★ = manzana, | = separador entre niños. Elegir dónde van las n − 1 barras entre m + n − 1 lugares da C(m + n − 1, n − 1).', push => {
  const n = 3, m = R(2, 4), all = []; const C = (a, b) => { let r = 1; for (let i = 1; i <= b; i++) r = r * (a - b + i) / i; return Math.round(r); };
  for (let i = 0; i <= m; i++) for (let j = 0; i + j <= m; j++) all.push([i, j, m - i - j]);
  push(m + ' manzanas entre ' + n + ' niños: hay ' + (m + n - 1) + ' lugares y se eligen ' + (n - 1) + ' para las barras.', { all, k: 0, m, n });
  for (let k = 1; k <= all.length; k += Math.max(1, Math.floor(all.length / 4))) push('Repartos listados: ' + k + '.', { all, k, m, n });
  push('Total = C(' + (m + n - 1) + ', ' + (n - 1) + ') = ' + C(m + n - 1, n - 1) + ' = ' + all.length + ' repartos.', { all, k: all.length, m, n });
}, s => '<div style="font:16px ui-monospace,monospace;line-height:1.7;columns:2;max-width:520px">' + s.all.slice(0, s.k).map(r => r.map(c => '★'.repeat(c)).join('<b style="color:var(--acc)">|</b>') + ' <small style="color:var(--mut)">(' + r.join(', ') + ')</small>').join('<br>') + '</div>');

V('FunctionalTools-Classic-Problems-Array-Division', 'Búsqueda binaria sobre la suma máxima', 'Para un L se llenan las partes golosamente (cada color es una parte). Si salen ≤ k partes, L sirve y se busca uno menor.', push => {
  const n = 9, k = 3, x = Array.from({ length: n }, () => R(1, 9)); let lo = Math.max(...x), hi = x.reduce((a, b) => a + b, 0);
  const parts = L => { const g = []; let s = 0, c = 0; for (const v of x) { if (s + v > L) { c++; s = 0; } s += v; g.push(c); } return g; };
  push('Partir en k = ' + k + ' partes. La respuesta está entre ' + lo + ' (el mayor) y ' + hi + ' (la suma).', { x, g: x.map(() => 0), lo, hi, L: null });
  while (lo < hi) { const L = (lo + hi) >> 1, g = parts(L), cnt = g[g.length - 1] + 1, ok = cnt <= k;
    push('L = ' + L + ': salen ' + cnt + ' partes → ' + (ok ? 'sirve, se busca menor' : 'no sirve, se busca mayor') + '.', { x, g, lo, hi, L, ok });
    if (ok) hi = L; else lo = L + 1; }
  push('La menor suma máxima es ' + lo + '.', { x, g: parts(lo), lo, hi, L: lo, ok: true });
}, s => '<div class="cells">' + s.x.map((v, i) => '<div class="cell" style="background:' + ROOMC[s.g[i] % ROOMC.length] + ';color:#fff;border-color:transparent">' + v + '</div>').join('') + '</div>' + cellsRow('rango', [s.lo + ' … ' + s.hi], ['b']));

V('FunctionalTools-Classic-Problems-Prime-Multiples', 'Inclusión-exclusión', 'Cada subconjunto de primos aporta ⌊n / producto⌋ con signo + (tamaño impar) o − (par). Abajo: los números de 1 a n divisibles por alguno (verde).', push => {
  const n = R(30, 60), a = pick([[2, 3], [2, 5], [3, 5], [2, 3, 5], [2, 3, 7]]), terms = [];
  push('n = ' + n + ', primos ' + a.join(', ') + '.', { n, a, terms: [], tot: 0, done: false });
  let tot = 0;
  for (let mask = 1; mask < 1 << a.length; mask++) { const S = a.filter((_, i) => mask >> i & 1), p = S.reduce((x, y) => x * y, 1), sg = S.length % 2 ? 1 : -1; tot += sg * Math.floor(n / p);
    terms.push([S.join('·'), sg > 0 ? '+' : '−', Math.floor(n / p)]); push('{' + S.join(', ') + '}: ' + (sg > 0 ? '+' : '−') + '⌊' + n + '/' + p + '⌋ = ' + (sg > 0 ? '+' : '−') + Math.floor(n / p) + '. Total = ' + tot, { n, a, terms: terms.slice(), tot, done: false }); }
  push(tot + ' números de 1 a ' + n + ' son divisibles por al menos uno.', { n, a, terms, tot, done: true });
}, s => table(s.terms.length ? s.terms : [['—', '', '']], s.terms.map(() => ['', '', 'b']), null, ['subconjunto', 'signo', '⌊n/prod⌋']) +
  (s.done ? '<div class="cells">' + [...Array(s.n).keys()].map(i => i + 1).map(v => '<div class="cell ' + (s.a.some(p => v % p === 0) ? 'g' : '') + '" style="min-width:30px">' + v + '</div>').join('') + '</div>' : ''));

// =================== Probabilidad ===================
const f3 = x => (Math.round(x * 1000) / 1000).toFixed(3).replace(/\.?0+$/, '') || '0';
const barras = (vals, hl, labs, maxV) => { const W = 540, H = 170, n = vals.length, bw = Math.min(40, (W - 20) / n - 2), m = maxV || Math.max(...vals, 1e-9); let g = '';
  vals.forEach((v, i) => { const h = (H - 40) * v / m, x = 10 + i * ((W - 20) / n); g += '<rect x="' + x + '" y="' + (H - 22 - h) + '" width="' + bw + '" height="' + h + '" rx="3" fill="' + (hl && hl[i] ? (FILL[hl[i]] || '#7ee2a8') : '#c9d1d9') + '"/>';
    if (labs) g += txt(x + bw / 2, H - 8, labs[i], { s: 10 }); });
  return svgBox(g, W, H); };

V('Probability-Algorithms-ProbabilityDP', 'Distribución de la suma de varios dados', 'Cada barra es la probabilidad de una suma. Al lanzar otro dado, cada barra se reparte en seis partes iguales (1/6) hacia s+1 … s+6. Verde = sumas dentro de [a, b].', push => {
  const n = R(2, 4), a = R(n + 1, 3 * n), b = R(a, Math.min(6 * n, a + 2 * n)); let p = [1];
  push('Con 0 dados la suma es 0 con probabilidad 1. Se busca P(' + a + ' ≤ suma ≤ ' + b + ') con ' + n + ' dados.', { p: p.slice(), a, b, n, d: 0 });
  for (let d = 1; d <= n; d++) { const q = Array(p.length + 6).fill(0); p.forEach((v, s) => { for (let c = 1; c <= 6; c++) q[s + c] += v / 6; }); p = q;
    push('Dado ' + d + ': p[s] = (p[s−1] + … + p[s−6]) / 6. Suma más probable: ' + p.indexOf(Math.max(...p)) + '.', { p: p.slice(), a, b, n, d }); }
  const res = p.slice(a, b + 1).reduce((x, y) => x + y, 0);
  push('P(' + a + ' ≤ suma ≤ ' + b + ') = ' + res.toFixed(6), { p, a, b, n, d: n, fin: 1 });
}, s => barras(s.p, s.p.map((_, i) => s.fin && i >= s.a && i <= s.b ? 'g' : ''), s.p.map((_, i) => i % 2 === 0 || s.p.length < 14 ? i : '')));

V('Probability-Algorithms-LinearityOfExpectation', 'Linealidad de la esperanza: par por par', 'E[inversiones] = Σ P(x_i > x_j) sobre los pares i < j, aunque los pares no sean independientes. Amarillo = par que se suma.', push => {
  const n = 4, r = Array.from({ length: n }, () => R(2, 6)); let tot = 0; const done = [];
  push('x_i es uniforme en [1, r_i]: r = ' + r.join(', ') + '.', { r, i: -1, j: -1, tot, done: [] });
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { let fav = 0; for (let v = 1; v <= r[i]; v++) fav += Math.min(v - 1, r[j]); const pr = fav / (r[i] * r[j]); tot += pr; done.push([i, j, pr]);
    push('P(x_' + (i + 1) + ' > x_' + (j + 1) + ') = ' + fav + ' / ' + (r[i] * r[j]) + ' = ' + f3(pr) + '. Acumulado: ' + tot.toFixed(4), { r, i, j, tot, done: done.slice() }); }
  push('Número esperado de inversiones: ' + tot.toFixed(6), { r, i: -1, j: -1, tot, done });
}, s => cellsRow('r', s.r, s.r.map((_, k) => k === s.i || k === s.j ? 'a' : '')) + table(s.done.length ? s.done.map(([i, j, p]) => ['(' + (i + 1) + ', ' + (j + 1) + ')', f3(p)]) : [['—', '']], s.done.map(([i, j]) => i === s.i && j === s.j ? ['a', 'a'] : ['g', 'g']), null, ['par', 'P(inversión)']));

V('Probability-Algorithms-ExpectedMaximum', 'Esperanza del máximo con P(máx ≤ m) = (m/k)ⁿ', 'Azul = P(máx ≤ m); verde = P(máx = m) = la diferencia de dos azules consecutivos. E[máx] = Σ m · P(máx = m).', push => {
  const n = R(2, 4), k = R(5, 8), F = [], P = []; let E = 0;
  push(n + ' niños, cada uno con un número al azar de 1 a ' + k + '.', { F: [], P: [], k, m: 0 });
  for (let m = 1; m <= k; m++) { F.push((m / k) ** n); P.push(F[m - 1] - (m > 1 ? F[m - 2] : 0)); E += m * P[m - 1];
    push('m = ' + m + ': P(máx ≤ ' + m + ') = (' + m + '/' + k + ')^' + n + ' = ' + f3(F[m - 1]) + ' → P(máx = ' + m + ') = ' + f3(P[m - 1]) + '. E parcial = ' + E.toFixed(4), { F: F.slice(), P: P.slice(), k, m }); }
  push('E[máx] = ' + E.toFixed(6), { F, P, k, m: k });
}, s => { const pad = a => a.concat(Array(s.k - a.length).fill(0)); return '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">' +
  '<div><small>P(máx ≤ m)</small>' + barras(pad(s.F), pad(s.F).map((_, i) => i < s.m ? 'b' : ''), [...Array(s.k).keys()].map(i => i + 1), 1) + '</div>' +
  '<div><small>P(máx = m)</small>' + barras(pad(s.P), pad(s.P).map((_, i) => i === s.m - 1 ? 'a' : i < s.m ? 'g' : ''), [...Array(s.k).keys()].map(i => i + 1), 1) + '</div></div>'; });

V('Probability-Algorithms-MarkovChain', 'Un robot como cadena de Markov', 'Tablero 5×5 (en el problema es 8×8). El color es la probabilidad de que el robot esté en cada casilla; en cada paso se reparte por igual entre las vecinas válidas.', push => {
  const N = 5, st = R(0, N * N - 1); let p = Array(N * N).fill(0); p[st] = 1;
  const nb = c => { const x = Math.floor(c / N), y = c % N; return [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]].filter(([a, b]) => a >= 0 && b >= 0 && a < N && b < N).map(([a, b]) => a * N + b); };
  push('El robot empieza en la casilla marcada con probabilidad 1.', { p: p.slice(), N, k: 0 });
  for (let k = 1; k <= 6; k++) { const q = Array(N * N).fill(0); p.forEach((v, c) => { if (v) { const L = nb(c); L.forEach(u => q[u] += v / L.length); } }); p = q;
    { const mx = Math.max(...p); push('Paso ' + k + ': cada casilla reparte su probabilidad entre sus 2–4 vecinas. La más probable ahora tiene ' + f3(mx) + '; la suma sigue siendo 1.', { p: p.slice(), N, k }); } }
  push('Con la distribución de cada robot: P(casilla vacía) = Π (1 − p_robot), y E[vacías] = Σ P(vacía).', { p, N, k: 6 });
}, s => { const m = Math.max(...s.p); return gridHtml(Array.from({ length: s.N }, (_, i) => Array.from({ length: s.N }, (_, j) => { const v = s.p[i * s.N + j];
  return { t: v ? f3(v) : '', bg: v ? 'rgba(31,111,235,' + (0.15 + 0.85 * v / m).toFixed(2) + ')' : '' }; })), 52); });

V('Probability-Algorithms-ModularExpectation', 'Esperanza módulo un primo', 'Arriba: la cuenta con fracciones reales. Abajo: la misma cuenta módulo 998244353 (cada a/b se guarda como a · b⁻¹). Ambas representan el mismo número.', push => {
  const M = 998244353n, pw = (b, e) => { let r = 1n; b %= M; while (e > 0n) { if (e & 1n) r = r * b % M; b = b * b % M; e >>= 1n; } return r; };
  const n = 3, ps = Array.from({ length: n }, () => pick([10, 20, 25, 50, 80])), inv100 = pw(100n, M - 2n);
  let num = 0, prod = 1, numM = 0n, prodM = 1n; const rowsF = [], rowsM = [];
  push('Espejos con probabilidades ' + ps.map(p => p + '%').join(', ') + '. E = (1 + q1 + q1q2) / (q1q2q3).', { rowsF: [], rowsM: [] });
  ps.forEach((p, i) => { num += prod; numM = (numM + prodM) % M; prod *= p / 100; prodM = prodM * (BigInt(p) * inv100 % M) % M;
    rowsF.push(['i=' + (i + 1), f3(num), f3(prod)]); rowsM.push(['i=' + (i + 1), String(numM), String(prodM)]);
    push('Se suma el producto actual al numerador y se multiplica por q' + (i + 1) + ' = ' + p + '/100.', { rowsF: rowsF.slice(), rowsM: rowsM.slice() }); });
  const E = num / prod, EM = numM * pw(prodM, M - 2n) % M;
  push('E = ' + f3(num) + ' / ' + f3(prod) + ' = ' + E.toFixed(4) + ' días. Módulo M: ' + numM + ' · (' + prodM + ')^(M−2) = ' + EM + '.', { rowsF, rowsM, E: [E.toFixed(4), String(EM)] });
}, s => '<div style="display:flex;gap:18px;flex-wrap:wrap">' + table(s.rowsF.length ? s.rowsF : [['', '', '']], null, null, ['', 'numerador', 'q1⋯qi']) + table(s.rowsM.length ? s.rowsM : [['', '', '']], null, null, ['', 'num mód M', 'prod mód M']) + '</div>' + (s.E ? cellsRow('E', s.E, ['g', 'g']) : ''));

V('Probability-Classic-Problems-Bag-of-Mice', 'Tabla P[w][b]: ¿gana la princesa?', 'P[w][b] = probabilidad de que gane la princesa si le toca sacar con w blancos y b negros. Amarillo = celda que se calcula; azul = celdas de las que depende (w−1, b−2) y (w, b−3).', push => {
  const W = 4, B = 5, P = Array.from({ length: W + 1 }, () => Array(B + 1).fill(null));
  for (let b = 0; b <= B; b++) P[0][b] = 0; for (let w = 1; w <= W; w++) P[w][0] = 1;
  const st = (w, b, m) => push(m, { P: clone(P), w, b });
  st(-1, -1, 'Sin blancos gana el dragón (0); sin negros gana la princesa (1).');
  for (let w = 1; w <= W; w++) for (let b = 1; b <= B; b++) { const t = w + b; let r = w / t;
    if (b >= 2) { const both = b / t * (b - 1) / (t - 1); if (t > 2) r += both * w / (t - 2) * P[w - 1][b - 2]; if (b >= 3) r += both * (b - 2) / (t - 2) * P[w][b - 3]; }
    P[w][b] = r; st(w, b, 'P[' + w + '][' + b + '] = ' + w + '/' + t + ' (blanco ya) + ramas en que ambos sacan negro y salta un ratón = ' + f3(r)); }
  st(W, B, 'Con ' + W + ' blancos y ' + B + ' negros la princesa gana con probabilidad ' + P[W][B].toFixed(6) + '.');
}, s => table(s.P.map(r => r.map(v => v === null ? '·' : f3(v))), s.P.map((r, w) => r.map((v, b) => w === s.w && b === s.b ? 'a' : (w === s.w - 1 && b === s.b - 2) || (w === s.w && b === s.b - 3) ? 'b' : v !== null ? 'g' : '')), s.P.map((_, w) => 'w=' + w), s.P[0].map((_, b) => 'b=' + b)));

V('Probability-Classic-Problems-Ilya-and-Escalator', 'Distribución de personas en la escalera', 'Cada barra es la probabilidad de que haya i personas en la escalera. Cada segundo, con probabilidad p entra el primero de la fila.', push => {
  const n = 5, p = pick([0.3, 0.5, 0.7]), T = 8; let d = [1, 0, 0, 0, 0, 0];
  const E = () => d.reduce((s, v, i) => s + i * v, 0);
  push(n + ' personas en fila, p = ' + p + '. Al inicio nadie ha entrado.', { d: d.slice(), t: 0 });
  for (let t = 1; t <= T; t++) { const e = Array(n + 1).fill(0); for (let i = 0; i < n; i++) { e[i + 1] += d[i] * p; e[i] += d[i] * (1 - p); } e[n] += d[n]; d = e;
    push('Segundo ' + t + ': E[personas] = Σ i·d[i] = ' + E().toFixed(4), { d: d.slice(), t }); }
}, s => barras(s.d, s.d.map(() => 'b'), s.d.map((_, i) => i), 1));

V('Probability-Classic-Problems-Fish', 'Probabilidad de cada conjunto de sobrevivientes', 'Cada fila es un conjunto de peces vivos (máscara) y su probabilidad de llegar a ocurrir. Se pasa de conjuntos grandes a pequeños; amarillo = conjunto que reparte su probabilidad.', push => {
  const n = 3, a = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const x = pick([0.2, 0.5, 0.7, 0.9]); a[i][j] = x; a[j][i] = Math.round((1 - x) * 10) / 10; }
  const P = Array(1 << n).fill(0); P[(1 << n) - 1] = 1; const name = m => '{' + [...Array(n).keys()].filter(i => m >> i & 1).map(i => i + 1).join(',') + '}';
  const S = (m, cur) => push(m, { P: P.slice(), cur, n });
  S('Matriz a: ' + a.map((r, i) => r.map((x, j) => i < j ? (i + 1) + '→' + (j + 1) + ': ' + x : '').filter(Boolean).join(', ')).filter(Boolean).join(', ') + '. Todos vivos con probabilidad 1.', -1);
  for (let m = (1 << n) - 1; m > 0; m--) { const alive = [...Array(n).keys()].filter(i => m >> i & 1), k = alive.length; if (k < 2 || !P[m]) continue;
    const pares = k * (k - 1) / 2; for (const j of alive) for (const i of alive) if (i !== j) P[m ^ (1 << j)] += P[m] / pares * a[i][j];
    S(name(m) + ': ' + (pares === 1 ? 'el único par se encuentra seguro' : 'cada uno de los ' + pares + ' pares se encuentra con probabilidad 1/' + pares) + '; la probabilidad se reparte entre los conjuntos con un pez menos.', m); }
  S('Respuesta: ' + [...Array(n).keys()].map(i => 'pez ' + (i + 1) + ' = ' + f3(P[1 << i])).join(', '), 0);
}, s => table([...Array(1 << s.n).keys()].reverse().filter(m => m).map(m => ['{' + [...Array(s.n).keys()].filter(i => m >> i & 1).map(i => i + 1).join(',') + '}', f3(s.P[m])]),
  [...Array(1 << s.n).keys()].reverse().filter(m => m).map(m => m === s.cur ? ['a', 'a'] : s.P[m] ? ['g', 'g'] : ['', '']), null, ['vivos', 'probabilidad']));

V('Probability-Classic-Problems-Journey', 'Probabilidad de llegar a cada ciudad', 'Etiqueta = probabilidad de pasar por esa ciudad: la del padre dividida entre sus hijos. Verde = hojas, donde termina el viaje; E = Σ prob(hoja) · profundidad.', push => {
  const n = 10, { T, s } = treeState(n), prob = Array(n).fill(0); prob[0] = 1; let E = 0;
  s.ns = prob.map(v => v ? f3(v) : ''); s.nc[0] = 'a'; push('El caballo sale de la ciudad 1 con probabilidad 1.', clone(s));
  const order = [0]; for (const u of order) { const k = T.kids[u]; s.nc[u] = k.length ? 'b' : 'g';
    if (!k.length) { E += prob[u] * T.depth[u]; push('Ciudad ' + (u + 1) + ' es hoja: aporta ' + f3(prob[u]) + ' × ' + T.depth[u] + '. E = ' + f3(E), clone(s)); continue; }
    k.forEach(v => { prob[v] = prob[u] / k.length; order.push(v); }); s.ns = prob.map(v => v ? f3(v) : '');
    push('Desde ' + (u + 1) + ' hay ' + k.length + ' caminos nuevos: cada hijo recibe ' + f3(prob[u]) + ' / ' + k.length + '.', clone(s)); }
  push('Largo esperado del viaje: ' + E.toFixed(6), s);
}, GR);

V('Probability-Classic-Problems-Game-on-Tree', 'Indicadores: E[pasos] = Σ 1 / profundidad', 'Un nodo cuenta como paso solo si se elige antes que todos sus ancestros: entre esos profundidad(v) nodos, cada uno es el primero con la misma probabilidad. Etiqueta = 1/profundidad.', push => {
  const n = 9, { T, s } = treeState(n); let E = 0; const order = [0]; for (const u of order) order.push(...T.kids[u]);
  push('Árbol con raíz 1 (profundidad 1).', clone(s));
  for (const u of order) { const d = T.depth[u] + 1; E += 1 / d; s.nc = s.nc.map(c => c === 'a' ? 'g' : c); s.nc[u] = 'a'; s.ns[u] = '1/' + d;
    push('Nodo ' + (u + 1) + ' (profundidad ' + d + '): P(elegirlo directamente) = 1/' + d + '. E = ' + E.toFixed(4), clone(s)); }
  s.nc = s.nc.map(() => 'g'); push('Número esperado de pasos: ' + E.toFixed(6), s);
}, GR);

V('Probability-Classic-Problems-Lets-Play-Osu', 'E[puntaje] con E[L] (largo del bloque actual)', 'Si el clic acierta, el puntaje sube (L+1)² − L² = 2L + 1. Se lleva E[L] y se suma p · (2·E[L] + 1) en cada clic.', push => {
  const ps = Array.from({ length: 7 }, () => pick([0.2, 0.5, 0.8, 0.9, 1])); let L = 0, res = 0; const Ls = [], Rs = [];
  push('Probabilidad de acertar cada clic: ' + ps.join(', '), { ps, Ls: [], Rs: [], i: -1 });
  ps.forEach((p, i) => { res += p * (2 * L + 1); L = p * (L + 1); Ls.push(f3(L)); Rs.push(f3(res));
    push('Clic ' + (i + 1) + ' (p = ' + p + '): E[puntaje] += ' + p + '·(2·E[L] + 1); E[L] = ' + p + '·(E[L] + 1) = ' + f3(L) + '.', { ps, Ls: Ls.slice(), Rs: Rs.slice(), i }); });
  push('Puntaje esperado: ' + res.toFixed(6), { ps, Ls, Rs, i: ps.length });
}, s => rows([{ t: 'p', v: s.ps, c: s.ps.map((_, k) => k === s.i ? 'a' : k < s.i ? 'g' : '') }, { t: 'E[L]', v: s.Ls.length ? s.Ls : [null], c: s.Ls.map(() => 'b') }, { t: 'E[puntaje]', v: s.Rs.length ? s.Rs : [null], c: s.Rs.map(() => 'g') }]));

// =================== Probabilidad: distribuciones ===================
V('Probability-Distributions-Binomial', 'La binomial ensayo por ensayo', 'Cada barra es P(i éxitos). Cada ensayo nuevo mueve una parte p de cada barra una posición a la derecha (éxito) y deja 1 − p en su lugar (fracaso). Verde = la barra que se pregunta.', push => {
  const n = R(5, 9), p = pick([0.3, 0.5, 0.7]), k = R(1, n - 1); let d = [1];
  const C = (a, b) => { let r = 1; for (let i = 1; i <= b; i++) r = r * (a - b + i) / i; return r; };
  push('n = ' + n + ' ensayos con p = ' + p + '. Se pregunta P(X = ' + k + ').', { d: d.slice(), n, k, t: 0 });
  for (let t = 1; t <= n; t++) { d = d.concat([0]).map((v, i) => v * (1 - p) + (i ? d[i - 1] * p : 0));
    push('Ensayo ' + t + ': d[i] = d[i]·(1 − p) + d[i − 1]·p. E[éxitos hasta ahora] = ' + f3(t * p) + '.', { d: d.slice(), n, k, t }); }
  push('P(X = ' + k + ') = ' + d[k].toFixed(6) + ' = C(' + n + ', ' + k + ')·' + p + '^' + k + '·' + f3(1 - p) + '^' + (n - k) + ' = ' + (C(n, k) * p ** k * (1 - p) ** (n - k)).toFixed(6) + '. E = np = ' + f3(n * p) + ', Var = np(1−p) = ' + f3(n * p * (1 - p)) + '.', { d, n, k, t: n, fin: 1 });
}, s => barras(s.d.concat(Array(s.n + 1 - s.d.length).fill(0)), [...Array(s.n + 1).keys()].map(i => i === s.k ? 'g' : 'b'), [...Array(s.n + 1).keys()]));

V('Probability-Distributions-CouponCollector', 'Coleccionista de cupones: una geométrica por cada tipo nuevo', 'Con c tipos vistos, el siguiente nuevo llega tras una espera geométrica de esperanza n/(n − c). Las esperas se suman por linealidad: E = n·H_n.', push => {
  const n = R(4, 7), W = []; let E = 0;
  push(n + ' tipos de cupón, todos igual de probables.', { W: [], n, E });
  for (let c = 0; c < n; c++) { const w = n / (n - c); E += w; W.push(w);
    push('Con ' + c + ' tipos vistos, un cupón es nuevo con probabilidad ' + (n - c) + '/' + n + ': espera esperada ' + n + '/' + (n - c) + ' = ' + f3(w) + '. Total = ' + f3(E), { W: W.slice(), n, E }); }
  push('E[compras] = ' + n + '·(1 + 1/2 + … + 1/' + n + ') = ' + E.toFixed(4) + '. Los últimos tipos son los que más cuestan.', { W, n, E });
}, s => barras(s.W.concat(Array(s.n - s.W.length).fill(0)), s.W.map((_, i) => i === s.W.length - 1 ? 'a' : 'b').concat(Array(s.n - s.W.length).fill('')), [...Array(s.n).keys()].map(c => c + '→' + (c + 1)), s.n));

V('Probability-Distributions-ContinuousUniform', 'Probabilidad geométrica: área favorable / área total', '(x, y) es un punto uniforme en el rectángulo. Verde = región x + y ≤ s; la probabilidad es su área dividida entre a·b. La línea punteada es x + y = s.', push => {
  const a = R(4, 10), b = R(3, 6);
  const area = s => { const T = c => c > 0 ? c * c / 2 : 0; return T(s) - T(s - a) - T(s - b) + T(s - a - b); };
  for (const s of [R(1, 3), Math.min(a, b) + 1, Math.max(a, b), a + b - 2, a + b])
    push('s = ' + s + ': área = ' + f3(area(s)) + ' de ' + a * b + ' → P(x + y ≤ ' + s + ') = ' + (area(s) / (a * b)).toFixed(4), { a, b, s });
}, s => { const k = 22, ox = 40, oy = 270, X = x => ox + x * k, Y = y => oy - y * k; let g = '';
  const pts = []; const clip = (x, y) => [Math.min(Math.max(x, 0), s.a), Math.min(Math.max(y, 0), s.b)];
  // región: polígono del rectángulo cortado por x + y ≤ s
  const P = [[0, 0], [Math.min(s.a, s.s), 0]]; if (s.s > s.a) P.push([s.a, Math.min(s.b, s.s - s.a)]); if (s.s > s.b) P.push([Math.min(s.a, s.s - s.b), s.b]); P.push([0, Math.min(s.b, s.s)]);
  g += '<rect x="' + X(0) + '" y="' + Y(s.b) + '" width="' + s.a * k + '" height="' + s.b * k + '" fill="none" stroke="#1f6feb" stroke-width="2"/>';
  g += '<polygon points="' + P.map(([x, y]) => X(x) + ',' + Y(y)).join(' ') + '" fill="#2da44e55" stroke="#2da44e"/>';
  g += '<line x1="' + X(0) + '" y1="' + Y(s.s) + '" x2="' + X(s.s) + '" y2="' + Y(0) + '" stroke="#d4a72c" stroke-width="2" stroke-dasharray="5 4"/>';
  g += txt(X(s.a), oy + 16, 'a = ' + s.a) + txt(ox - 18, Y(s.b) + 4, 'b = ' + s.b) + txt(X(0) - 6, oy + 16, '0');
  return '<svg viewBox="0 0 540 290" width="100%" style="max-width:540px;display:block;background:var(--bg);border:1px solid var(--line);border-radius:10px;overflow:hidden">' + g + '</svg>'; });

V('Probability-Classic-Problems-Probability-Given', 'Bayes: actualizar con lo que se sabe', 'Barras azules = probabilidad de cada amigo antes de saber nada (pᵢ). Barras verdes = después de saber que exactamente r compraron: P(compró y r compraron) / P(r compraron).', push => {
  const n = 4, p = Array.from({ length: n }, () => pick([0.1, 0.2, 0.3, 0.5, 0.8])), r = R(1, n - 1);
  const conteo = skip => { let d = [1]; p.forEach((pi, i) => { if (i !== skip) d = d.concat([0]).map((v, j) => v * (1 - pi) + (j ? d[j - 1] * pi : 0)); }); return d; };
  const total = conteo(-1)[r], post = [];
  push('Probabilidades de compra: ' + p.join(', ') + '. Se sabe que exactamente ' + r + ' compraron.', { p, post: [] });
  push('Denominador: P(exactamente ' + r + ' compran) = ' + total.toFixed(4) + ' (DP binomial con probabilidades distintas).', { p, post: [] });
  p.forEach((pi, i) => { const c = pi * conteo(i)[r - 1]; post.push(c / total);
    push('Amigo ' + (i + 1) + ': ' + pi + ' · P(' + (r - 1) + ' entre los demás) = ' + c.toFixed(4) + ' → ' + c.toFixed(4) + ' / ' + total.toFixed(4) + ' = ' + (c / total).toFixed(4), { p, post: post.slice() }); });
  push('Las probabilidades condicionales suman ' + post.reduce((x, y) => x + y, 0).toFixed(2) + ' = r: en promedio compran exactamente r.', { p, post });
}, s => { const W = 540, H = 180, n = s.p.length; let g = '';
  s.p.forEach((v, i) => { const x = 30 + i * 125; g += '<rect x="' + x + '" y="' + (150 - v * 120) + '" width="40" height="' + v * 120 + '" fill="#79b8ff"/>' + txt(x + 20, 145 - v * 120, f3(v), { s: 11 });
    if (s.post[i] !== undefined) g += '<rect x="' + (x + 46) + '" y="' + (150 - s.post[i] * 120) + '" width="40" height="' + s.post[i] * 120 + '" fill="#7ee2a8"/>' + txt(x + 66, 145 - s.post[i] * 120, f3(s.post[i]), { s: 11 });
    g += txt(x + 43, 168, 'amigo ' + (i + 1), { s: 11 }); });
  return svgBox(g, W, H); });

V('Probability-Classic-Problems-Serval-and-Bonus-Problem', 'De lo continuo a contar órdenes', 'Arriba: n segmentos al azar en [0, 1] y el punto x (amarillo). Lo único que importa es el orden de los puntos, y todos los órdenes son igual de probables. Abajo: la estimación por simulación se acerca al valor exacto.', push => {
  const n = 2, k = 1; let hits = 0, tot = 0;
  const exact = { 1: 1 / 3, 2: 0 }; // se calcula abajo con la DP
  const dp = (() => { let f0 = [1, 0, 0], f1 = [0, 0, 0]; for (let i = 0; i < 2 * n + 1; i++) { const g0 = [0, 0, 0], g1 = [0, 0, 0];
    for (let j = 0; j <= n; j++) { if (j < n) { g0[j + 1] += f0[j]; g1[j + 1] += f1[j]; } if (j) { g0[j - 1] += f0[j] * j; g1[j - 1] += f1[j] * j; } if (j >= k) g1[j] += f0[j]; } f0 = g0; f1 = g1; }
    let num = f1[0]; for (let i = 1; i <= n; i++) num *= 2 * i; let den = 1; for (let i = 1; i <= 2 * n + 1; i++) den *= i; return num / den; })();
  for (let t = 1; t <= 12; t++) { const segs = Array.from({ length: n }, () => { const u = Math.random(), v = Math.random(); return [Math.min(u, v), Math.max(u, v)]; }), x = Math.random();
    const c = segs.filter(([a, b]) => a < x && x < b).length; tot++; if (c >= k) hits++;
    push('n = ' + n + ' segmentos, k = ' + k + '. Prueba ' + t + ': x queda cubierto por ' + pl(c, 'segmento', 'segmentos') + '. Estimación: ' + hits + '/' + tot + ' = ' + (hits / tot).toFixed(3) + '; valor exacto (DP sobre órdenes): ' + dp.toFixed(4), { segs, x, c }); }
}, s => { const X = v => 30 + v * 480; let g = '<line x1="' + X(0) + '" y1="40" x2="' + X(1) + '" y2="40" stroke="#888" stroke-width="2"/>' + txt(X(0), 58, '0') + txt(X(1), 58, 'l');
  s.segs.forEach(([a, b], i) => g += '<line x1="' + X(a) + '" y1="' + (80 + i * 22) + '" x2="' + X(b) + '" y2="' + (80 + i * 22) + '" stroke="' + (a < s.x && s.x < b ? '#2da44e' : '#1f6feb') + '" stroke-width="6" stroke-linecap="round"/>');
  g += '<line x1="' + X(s.x) + '" y1="25" x2="' + X(s.x) + '" y2="140" stroke="#d4a72c" stroke-width="2" stroke-dasharray="4 3"/>' + '<circle cx="' + X(s.x) + '" cy="40" r="6" fill="#d4a72c"/>';
  return svgBox(g, 540, 150); });


// =================== Temas avanzados: teoría de números, juegos y polinomios ===================
const TN = 'FunctionalTools-Number-Theory-', JG = 'FunctionalTools-Games-', PO = 'FunctionalTools-Polynomials-';
V(TN + 'ExtendedEuclid', 'Euclides extendido paso a paso', 'Bajando: a, b y el cociente q. Subiendo: x, y con a·x + b·y = gcd. Cada fila sale de la de abajo: x = y\', y = x\' − q·y\'.', push => {
  let a = R(20, 99), b = R(10, a - 1); const filas = [];
  while (true) { filas.push({ a, b, q: b ? Math.floor(a / b) : '—', x: null, y: null }); if (!b) break; [a, b] = [b, a % b]; }
  const cls = () => filas.map(() => ['', '', '', '', '']);
  for (let i = 0; i < filas.length; i++) { const c = cls(); c[i] = ['a', 'a', 'a', '', ''];
    push(filas[i].b ? 'gcd(' + filas[i].a + ', ' + filas[i].b + ') = gcd(' + filas[i].b + ', ' + filas[i].a + ' mod ' + filas[i].b + '); q = ' + filas[i].q + '.' : 'b = 0: el gcd es ' + filas[i].a + ', y ' + filas[i].a + '·1 + 0·0 = ' + filas[i].a + '.', { filas, c }); }
  const g = filas[filas.length - 1].a; filas[filas.length - 1].x = 1; filas[filas.length - 1].y = 0;
  for (let i = filas.length - 2; i >= 0; i--) { const d = filas[i + 1]; filas[i].x = d.y; filas[i].y = d.x - filas[i].q * d.y; const c = cls(); c[i] = ['', '', '', 'g', 'g']; c[i + 1] = ['', '', '', 'b', 'b'];
    const P = v => v < 0 ? '(' + v + ')' : v; push('x = ' + d.y + ', y = ' + d.x + ' − ' + filas[i].q + '·' + P(d.y) + ' = ' + filas[i].y + '. Comprobación: ' + filas[i].a + '·' + P(filas[i].x) + ' + ' + filas[i].b + '·' + P(filas[i].y) + ' = ' + g + '.', { filas, c }); }
}, s => table(s.filas.map(f => [f.a, f.b, f.q, f.x, f.y]), s.c, null, ['a', 'b', 'q', 'x', 'y']));

V(TN + 'CRT', 'Teorema chino del resto', 'Se recorren los números x ≡ a (mód n): a, a + n, a + 2n, … hasta que uno cumpla x ≡ b (mód m). El código hace ese salto de una vez con Euclides extendido.', push => {
  const n = R(3, 9), m = R(3, 9), g = gcdF(n, m), a = R(0, n - 1); const b = Math.random() < 0.75 ? (a + n * R(0, m)) % m : R(0, m - 1);
  const L = n * m / g, xs = [], ok = []; push('Buscar x con x ≡ ' + a + ' (mód ' + n + ') y x ≡ ' + b + ' (mód ' + m + '). gcd(' + n + ', ' + m + ') = ' + g + ', mcm = ' + L + '.', { xs, ok, m, hit: -1 });
  for (let x = a; x < L; x += n) { xs.push(x); ok.push(x % m === b); if (x % m === b) { push(x + ' mód ' + m + ' = ' + b + ': ¡sirve! Las soluciones son x ≡ ' + x + ' (mód ' + L + ').', { xs, ok, m, hit: xs.length - 1 }); return; }
    push(x + ' mód ' + m + ' = ' + (x % m) + ' ≠ ' + b + '.', { xs, ok, m, hit: -1 }); }
  push('Se probaron los ' + xs.length + ' candidatos hasta el mcm y ninguno sirve: como ' + b + ' − ' + a + ' no es múltiplo de gcd = ' + g + ', no hay solución.', { xs, ok, m, hit: -1 });
}, s => rows([{ t: 'x', v: s.xs, c: s.xs.map((_, i) => i === s.hit ? 'g' : 'a') }, { t: 'x mód ' + s.m, v: s.xs.map(x => x % s.m), c: s.ok.map(o => o ? 'g' : 'r') }]));

V(TN + 'EulerPhi', 'Criba de φ de Euler', 'φ(n) empieza en n. Por cada primo p (los que nadie tocó) se multiplica por (1 − 1/p) a todos sus múltiplos: φ[j] −= φ[j] / p.', push => {
  const N = 30, phi = [...Array(N + 1).keys()]; push('φ[i] = i al empezar.', { phi, p: 0 });
  for (let p = 2; p <= N; p++) if (phi[p] === p) { for (let j = p; j <= N; j += p) phi[j] -= phi[j] / p; push('p = ' + p + ' es primo: sus múltiplos pierden la fracción 1/' + p + '.', { phi, p }); }
  push('Listo: por ejemplo φ(12) = ' + phi[12] + ' (1, 5, 7, 11) y φ(30) = ' + phi[30] + '.', { phi, p: 0 });
}, s => { const ids = [...Array(30).keys()].map(i => i + 1); return rows([{ t: 'n', v: ids.slice(0, 15), c: ids.slice(0, 15).map(v => s.p && v % s.p === 0 ? 'a' : '') }, { t: 'φ(n)', v: s.phi.slice(1, 16), c: ids.slice(0, 15).map(v => s.p && v % s.p === 0 ? 'g' : '') }, { t: 'n', v: ids.slice(15), c: ids.slice(15).map(v => s.p && v % s.p === 0 ? 'a' : '') }, { t: 'φ(n)', v: s.phi.slice(16), c: ids.slice(15).map(v => s.p && v % s.p === 0 ? 'g' : '') }]); });

const powmodS = (b, e, m) => { let r = 1n, B = BigInt(b) % BigInt(m), E = BigInt(e), M = BigInt(m); for (; E > 0n; E >>= 1n, B = B * B % M) if (E & 1n) r = r * B % M; return Number(r); };
V(TN + 'MillerRabin', 'Miller-Rabin con algunas bases', 'n − 1 = d·2^s. Para cada base a se mira la secuencia a^d, a^(2d), …, a^(n−1). Si n es primo, esa secuencia empieza en 1 o pasa por n − 1 (las únicas raíces de 1 módulo un primo son ±1).', push => {
  const n = pick([561, 1105, 1729, 2465, 97, 101, 7919, 221, 341, 8911]); let d = n - 1, s = 0; while (d % 2 === 0) { d /= 2; s++; }
  const filas = []; push('n = ' + n + ': n − 1 = ' + d + '·2^' + s + '.', { filas });
  for (const a of [2, 3, 5, 7]) { if (a % n === 0) continue; const seq = [powmodS(a, d, n)]; for (let i = 1; i < s; i++) seq.push(powmodS(seq[i - 1], 2, n));
    const pasa = seq[0] === 1 || seq.includes(n - 1); filas.push({ a, seq, pasa });
    push('Base ' + a + ': ' + seq.join(' → ') + (pasa ? '. Se comporta como primo.' : '. Nunca llega a ' + (n - 1) + ' ni empieza en 1: ' + a + ' es testigo, ' + n + ' es compuesto.'), { filas, n });
    if (!pasa) return; }
  push('Ninguna base es testigo: ' + n + ' es primo (con las 7 bases del código esto es seguro para todo n < 2^64).', { filas, n });
}, s => s.filas.length ? s.filas.map(f => cellsRow('a = ' + f.a, f.seq, f.seq.map(x => x === 1 || x === s.n - 1 ? 'g' : f.pasa ? '' : 'r'))).join('') : '<p class="note">Elige una base para empezar.</p>');

V(TN + 'PollardRho', 'Pollard rho: la tortuga y la liebre', 'x avanza un paso y y dos con f(v) = v² + c (mód n). Módulo un factor p la secuencia entra en un ciclo mucho antes (≈ √p pasos): ahí x ≡ y (mód p) y gcd(|x − y|, n) revela p. El código usa la variante de Brent, que hace lo mismo con menos gcd.', push => {
  const n = pick([8051, 10403, 2021, 4087, 1147]), c = 1, f = v => (v * v + c) % n; let x = 2, y = 2; const filas = [];
  push('n = ' + n + ', f(v) = v² + 1, empezando en 2.', { filas });
  for (let i = 1; i <= 40; i++) { x = f(x); y = f(f(y)); const g = gcdF(Math.abs(x - y), n); filas.push([i, x, y, Math.abs(x - y), g]);
    push('Paso ' + i + ': x = ' + x + ', y = ' + y + ', gcd(' + Math.abs(x - y) + ', ' + n + ') = ' + g + (g > 1 && g < n ? ': ¡factor encontrado! ' + n + ' = ' + g + ' · ' + n / g + '.' : g === n ? ': el ciclo se cerró sin separar los factores; el código prueba otra c.' : '.'), { filas: filas.slice(-8), hit: g > 1 && g < n });
    if (g > 1) return; }
}, s => s.filas.length ? table(s.filas, s.filas.map((_, i) => i === s.filas.length - 1 && s.hit ? ['', '', '', '', 'g'] : []), null, ['paso', 'x', 'y', '|x − y|', 'gcd']) : '<p class="note">—</p>');

V(JG + 'Nim', 'Nim: jugar con el xor', 'Barras = pilas. Si el xor no es 0, existe una pila a con a xor X < a: bajarla a ese valor deja xor 0. Quien recibe xor 0 pierde.', push => {
  const h = Array.from({ length: R(3, 4) }, () => R(1, 7)); let turno = 0; const X = () => h.reduce((a, b) => a ^ b, 0);
  push('Pilas ' + h.join(', ') + '. xor = ' + X() + (X() ? ' ≠ 0: gana quien empieza.' : ' = 0: gana el segundo.'), { h: h.slice(), hl: [] });
  for (let paso = 0; paso < 14 && h.some(x => x); paso++) { const x = X(); let i, nv;
    if (x) { i = h.findIndex(a => (a ^ x) < a); nv = h[i] ^ x; } else { i = h.findIndex(a => a > 0); nv = h[i] - 1; }
    const hl = h.map((_, k) => k === i ? 'a' : ''); h[i] = nv;
    push('Jugador ' + (turno + 1) + ': la pila ' + (i + 1) + ' baja a ' + nv + (x ? ' (deja xor 0).' : ' (con xor 0 no hay buena jugada: saca 1).') + ' xor ahora = ' + X() + '.', { h: h.slice(), hl }); turno ^= 1; }
  push('No quedan piedras: pierde el jugador ' + (turno + 1) + ', que ya no puede mover.', { h: h.slice(), hl: [] });
}, s => barras(s.h.map(x => x || 0.0001), s.hl, s.h.map((x, i) => 'pila ' + (i + 1) + ': ' + x + ' = ' + x.toString(2).padStart(3, '0')), 7));

V(JG + 'SpragueGrundy', 'Números de Grundy con mex', 'g[h] = mex de los g alcanzables con una jugada (el menor número que no aparece). g = 0 ⟺ posición perdedora. Varias pilas: se hace xor de sus g.', push => {
  const S = shuffle([1, 2, 3, 4, 5]).slice(0, R(2, 3)).sort((a, b) => a - b), N = 15, g = Array(N + 1).fill(null); g[0] = 0;
  push('Se pueden sacar ' + S.join(', ') + ' piedras. g[0] = 0: sin jugadas, pierde quien mueve.', { g, S, cur: 0, from: [] });
  for (let h = 1; h <= N; h++) { const from = S.filter(x => x <= h).map(x => h - x), al = new Set(from.map(v => g[v])); let v = 0; while (al.has(v)) v++; g[h] = v;
    push('h = ' + h + ': alcanza ' + (from.length ? from.map(v => 'g[' + v + '] = ' + g[v]).join(', ') : 'nada') + ' → mex = ' + v + '.', { g, S, cur: h, from }); }
}, s => rows([{ t: 'h', v: s.g.map((_, i) => i) }, { t: 'g[h]', v: s.g, c: s.g.map((v, i) => i === s.cur ? 'a' : s.from.includes(i) ? 'b' : v === 0 ? 'r' : v !== null ? 'g' : '') }]) + '<p class="note">Rojo = g = 0 (perdedora). Movidas: ' + s.S.join(', ') + '</p>');

const cplx = (re, im) => ({ re, im }), cmul = (a, b) => cplx(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
const cstr = z => { const r = Math.round(z.re * 100) / 100, i = Math.round(z.im * 100) / 100; return i === 0 ? '' + r : r === 0 ? i + 'i' : r + (i > 0 ? '+' : '−') + Math.abs(i) + 'i'; };
function dftSlow(a, inv) { const n = a.length; return a.map((_, k) => a.reduce((acc, x, j) => { const ang = (inv ? -1 : 1) * 2 * Math.PI * j * k / n, w = cplx(Math.cos(ang), Math.sin(ang)), t = cmul(x, w); return cplx(acc.re + t.re, acc.im + t.im); }, cplx(0, 0))); }
V(PO + 'FFT', 'Multiplicar polinomios: evaluar, multiplicar, interpolar', 'Con n = 8 raíces de la unidad ω^k = e^(2πik/8): los coeficientes se convierten en valores (FFT), los valores se multiplican uno a uno y la FFT inversa recupera los coeficientes. La FFT hace cada conversión en O(n log n) en vez de O(n²).', push => {
  const A = Array.from({ length: 3 }, () => R(0, 3)), B = Array.from({ length: 3 }, () => R(0, 3)); A[2] = A[2] || 1; B[2] = B[2] || 1;
  const pad = v => v.concat(Array(8 - v.length).fill(0)).map(x => cplx(x, 0)), fa = dftSlow(pad(A)), fb = dftSlow(pad(B)), fc = fa.map((z, i) => cmul(z, fb[i])), c = dftSlow(fc, true).map(z => Math.round(z.re / 8));
  const base = { A, B }; push('A(x) = ' + A.map((v, i) => v + 'x^' + i).join(' + ') + ' y B(x) = ' + B.map((v, i) => v + 'x^' + i).join(' + ') + '. Se rellenan con ceros hasta 8 coeficientes.', Object.assign({ r: [] }, base));
  push('FFT de A: A(ω^k) para k = 0 … 7.', Object.assign({ r: [['A(ω^k)', fa.map(cstr)]] }, base));
  push('FFT de B: B(ω^k).', Object.assign({ r: [['A(ω^k)', fa.map(cstr)], ['B(ω^k)', fb.map(cstr)]] }, base));
  push('Producto punto a punto: C(ω^k) = A(ω^k)·B(ω^k). Esto cuesta solo O(n).', Object.assign({ r: [['A(ω^k)', fa.map(cstr)], ['B(ω^k)', fb.map(cstr)], ['C(ω^k)', fc.map(cstr)]] }, base));
  push('FFT inversa (con ω^−k y dividiendo por 8): los coeficientes de C = A·B son ' + c.slice(0, 5).join(', ') + '.', Object.assign({ r: [['C(ω^k)', fc.map(cstr)], ['coef. de C', c]] }, base));
}, s => rows([{ t: 'A', v: s.A }, { t: 'B', v: s.B }].concat(s.r.map(([t, v], i) => ({ t, v, c: v.map(() => i === s.r.length - 1 ? 'g' : '') })))));

V(PO + 'NTT', 'NTT: la misma idea con enteros módulo un primo', 'Con p = 17 = 2^4 + 1, el 9 es raíz de la unidad de orden 8 (9^8 ≡ 1 y 9^4 ≡ −1 mód 17): hace el papel de ω sin errores de redondeo. El código usa p = 998244353 = 119·2^23 + 1 y raíz primitiva 3.', push => {
  const P = 17, W = 9, n = 8, pw = (b, e) => { let r = 1; for (let i = 0; i < e; i++) r = r * b % P; return r; };
  const ntt = (a, w) => a.map((_, k) => a.reduce((acc, x, j) => (acc + x * pw(w, j * k % n)) % P, 0));
  const A = [R(0, 2), R(0, 2), R(1, 2)], B = [R(0, 2), R(0, 2), R(1, 2)], pad = v => v.concat(Array(n - v.length).fill(0));
  const fa = ntt(pad(A), W), fb = ntt(pad(B), W), fc = fa.map((x, i) => x * fb[i] % P), inv8 = pw(8, 15), winv = pw(W, 7), c = ntt(fc, winv).map(x => x * inv8 % P);
  push('A = ' + A.join(', ') + ' y B = ' + B.join(', ') + ' (coeficientes). Potencias de 9 mód 17: ' + [...Array(8).keys()].map(k => pw(W, k)).join(', ') + '.', { A, B, r: [] });
  push('NTT de A: A(9^k) mód 17.', { A, B, r: [['A(9^k)', fa]] });
  push('NTT de B: B(9^k) mód 17.', { A, B, r: [['A(9^k)', fa], ['B(9^k)', fb]] });
  push('Producto punto a punto mód 17.', { A, B, r: [['A(9^k)', fa], ['B(9^k)', fb], ['C(9^k)', fc]] });
  push('Inversa: usar 9^−1 = ' + winv + ' y multiplicar por 8^−1 = ' + inv8 + '. Resultado: ' + c.slice(0, 5).join(', ') + ' (todos los coeficientes reales son < 17, así que coinciden).', { A, B, r: [['C(9^k)', fc], ['coef. de C', c]] });
}, s => rows([{ t: 'A', v: s.A }, { t: 'B', v: s.B }].concat(s.r.map(([t, v], i) => ({ t, v, c: v.map(() => i === s.r.length - 1 ? 'g' : '') })))));

// =================== Optimizaciones de DP y DP en árboles ===================
const DO_ = 'DP-Optimizations-', DT_ = 'DP-Trees-';
V(DO_ + 'ConvexHullTrick', 'Convex Hull Trick: la envolvente inferior de las rectas', 'Cada estado calculado agrega la recta y = m·x + dp. Para el siguiente se evalúa el mínimo en su x. Como las pendientes bajan y las consultas suben, las rectas inútiles salen por los extremos de la deque. Azul = rectas en la deque; gris = descartadas.', push => {
  const n = 5, x0 = R(8, 10), s = [], f = []; let v = R(1, 2); for (let i = 0; i < n; i++) { v += R(1, 3); s.push(v); }
  let fv = x0; for (let i = 0; i < n; i++) { fv = Math.max(1, fv - R(1, 3)); f.push(fv); }
  const lines = [{ m: x0, b: 0, id: 0 }], dq = [0], dead = []; const st = (q, best) => ({ lines, dq: dq.slice(), dead: dead.slice(), q, best, X: s[n - 1] + 1 });
  const ev = (l, x) => l.m * x + l.b, sobra = (a, b, c) => (c.b - a.b) * (a.m - b.m) <= (b.b - a.b) * (a.m - c.m);
  push('Consultas en x = ' + s.join(', ') + ' (crecientes); pendientes de las rectas nuevas: ' + f.join(', ') + ' (decrecientes). Recta inicial y = ' + x0 + '·x.', st(-1, -1)); let dp = 0;
  for (let i = 0; i < n; i++) {
    let sal = 0; while (dq.length >= 2 && ev(lines[dq[1]], s[i]) <= ev(lines[dq[0]], s[i])) { dead.push(dq.shift()); sal++; }
    dp = ev(lines[dq[0]], s[i]); push('Consulta ' + (i + 1) + ' (x = ' + s[i] + '): ' + (sal ? pl(sal, 'recta sale', 'rectas salen') + ' por el frente porque ya perdieron; ' : '') + 'la mejor es la del frente, y = ' + lines[dq[0]].m + 'x + ' + lines[dq[0]].b + ' → dp = ' + dp + '.', st(s[i], dq[0]));
    const nl = { m: f[i], b: dp, id: lines.length }; lines.push(nl);
    if (lines[dq[dq.length - 1]].m === nl.m && lines[dq[dq.length - 1]].b <= nl.b) { dead.push(nl.id); push('La recta nueva tiene la misma pendiente y es peor: no sirve.', st(-1, -1)); continue; }
    let fuera = 0; while (dq.length >= 2 && sobra(lines[dq[dq.length - 2]], lines[dq[dq.length - 1]], nl)) { dead.push(dq.pop()); fuera++; }
    dq.push(nl.id); push('Se agrega y = ' + nl.m + 'x + ' + nl.b + ' al final' + (fuera ? '; ' + pl(fuera, 'recta quedó tapada y sale', 'rectas quedaron tapadas y salen') + ' por el final.' : '; no tapa a ninguna.'), st(-1, -1));
  }
  push('Respuesta: ' + dp + ' (O(n) en total: cada recta entra y sale una vez).', st(-1, -1));
}, s => { const W = 540, H = 280, X = s.X, ys = s.lines.flatMap(l => [l.b, l.m * X + l.b]), Y = Math.max(...ys, 1), px = x => 30 + (W - 50) * x / X, py = y => H - 25 - (H - 45) * y / Y;
  let g = '<line x1="30" y1="' + (H - 25) + '" x2="' + (W - 20) + '" y2="' + (H - 25) + '" stroke="#888"/>';
  s.lines.forEach(l => { const on = s.dq.includes(l.id), col = l.id === s.best ? '#d4a72c' : on ? '#1f6feb' : '#bbb'; g += '<line x1="' + px(0) + '" y1="' + py(l.b) + '" x2="' + px(X) + '" y2="' + py(l.m * X + l.b) + '" stroke="' + col + '" stroke-width="' + (on ? 2.5 : 1.2) + '"' + (s.dead.includes(l.id) ? ' stroke-dasharray="4 3"' : '') + '/>'; });
  if (s.q >= 0) g += '<line x1="' + px(s.q) + '" y1="15" x2="' + px(s.q) + '" y2="' + (H - 25) + '" stroke="#2da44e" stroke-dasharray="5 4"/>' + txt(px(s.q), 12, 'x = ' + s.q, { s: 11 });
  return svgBox(g, W, H); });

V(DO_ + 'DivideAndConquerDP', 'Divide y vencerás sobre una capa de la DP', 'Se calcula dp[mid] probando los cortes p en [optl, optr] (azul). Su mejor corte (verde) parte el problema: la mitad izquierda solo prueba cortes ≤ ese, la derecha solo ≥. Cada nivel de la recursión cuesta O(n).', push => {
  const n = 8, k = 2, x = Array.from({ length: n }, () => R(1, 6)), pre = [0]; x.forEach(v => pre.push(pre[pre.length - 1] + v));
  const ant = Array(n + 1).fill(Infinity); ant[0] = 0; for (let i = 1; i <= n; i++) ant[i] = pre[i] * pre[i];
  const cur = Array(n + 1).fill(null), opt = Array(n + 1).fill(null); const st = (mid, l, r, best) => ({ x, ant: ant.slice(), cur: cur.slice(), opt: opt.slice(), mid, l, r, best });
  push('Arreglo ' + x.join(', ') + '. Capa 1 (un tramo): dp₁[i] = (suma de los primeros i)². Ahora la capa 2: dp₂[i] = min_p dp₁[p] + (suma de (p, i])².', st(-1, -1, -1, -1));
  const solve = (lo, hi, ol, or) => { if (lo > hi) return; const mid = (lo + hi) >> 1; let best = ol, bv = Infinity;
    for (let p = ol; p <= Math.min(mid - 1, or); p++) { const v = ant[p] + (pre[mid] - pre[p]) ** 2; if (v < bv) { bv = v; best = p; } }
    cur[mid] = bv; opt[mid] = best; push('mid = ' + mid + ': se prueban p ∈ [' + ol + ', ' + Math.min(mid - 1, or) + ']; el mejor es p = ' + best + ' con dp₂ = ' + bv + '.', st(mid, ol, Math.min(mid - 1, or), best));
    solve(lo, mid - 1, ol, best); solve(mid + 1, hi, best, or); };
  solve(1, n, 0, n - 1); push('Capa 2 lista. Fíjate en que los cortes óptimos (fila opt) nunca bajan: esa monotonía es lo que permite podar.', st(-1, -1, -1, -1));
}, s => rows([{ t: 'i', v: [...Array(s.x.length + 1).keys()], c: [...Array(s.x.length + 1).keys()].map(i => i === s.mid ? 'a' : i >= s.l && i <= s.r ? 'b' : '') }, { t: 'x', v: [null].concat(s.x) }, { t: 'dp₁', v: s.ant, c: s.ant.map((_, i) => i === s.best ? 'g' : '') }, { t: 'dp₂', v: s.cur, c: s.cur.map((v, i) => i === s.mid ? 'a' : v !== null ? 'g' : '') }, { t: 'opt', v: s.opt }]));

V(DO_ + 'KnuthOptimization', 'Optimización de Knuth', 'dp[i][j] = costo mínimo de partir el tramo [i, j] hasta dejar piezas sueltas. Solo se prueban los cortes entre opt[i][j−1] y opt[i+1][j], no todos. Amarillo = casilla que se calcula; azul = dp[i][j−1] y dp[i+1][j], de donde salen esos límites.', push => {
  const n = 5, x = Array.from({ length: n }, () => R(1, 9)), pre = [0]; x.forEach(v => pre.push(pre[pre.length - 1] + v));
  const dp = Array.from({ length: n }, () => Array(n).fill(null)), opt = Array.from({ length: n }, () => Array(n).fill(null)); for (let i = 0; i < n; i++) { dp[i][i] = 0; opt[i][i] = i; }
  const cl = (i, j) => dp.map((r, a) => r.map((_, b) => a === i && b === j ? 'a' : (a === i && b === j - 1) || (a === i + 1 && b === j) ? 'b' : dp[a][b] !== null ? 'g' : ''));
  push('Arreglo ' + x.join(', ') + '. Diagonal: un elemento solo ya es una pieza (costo 0).', { dp, cl: cl(-1, -1), x });
  for (let L = 2; L <= n; L++) for (let i = 0; i + L - 1 < n; i++) { const j = i + L - 1; let best = Infinity, bc = -1, lo = opt[i][j - 1], hi = Math.min(j - 1, opt[i + 1][j]);
    for (let c = lo; c <= hi; c++) { const v = dp[i][c] + dp[c + 1][j]; if (v < best) { best = v; bc = c; } }
    dp[i][j] = best + pre[j + 1] - pre[i]; opt[i][j] = bc;
    push('[' + (i + 1) + ', ' + (j + 1) + ']: cortes probados ' + (lo + 1) + '…' + (hi + 1) + ' (de ' + (j - i) + ' posibles); mejor después de ' + (bc + 1) + ' → ' + best + ' + suma ' + (pre[j + 1] - pre[i]) + ' = ' + dp[i][j] + '.', { dp, cl: cl(i, j), x }); }
  push('Respuesta: dp[1][' + n + '] = ' + dp[0][n - 1] + '.', { dp, cl: cl(0, n - 1), x });
}, s => table(s.dp, s.cl, s.x.map((v, i) => (i + 1) + ' (' + v + ')'), s.x.map((_, j) => j + 1)));

V(DO_ + 'SOSDP', 'Suma sobre subconjuntos, bit por bit', 'sub[m] cuenta los y ⊆ m. Al procesar el bit b, cada máscara con ese bit prendido suma lo de la máscara sin él. Después de los B bits, cada subconjunto se contó exactamente una vez: O(B·2^B) en vez de O(3^B).', push => {
  const B = 3, M = 1 << B, cnt = Array(M).fill(0); for (let i = 0; i < 6; i++) cnt[R(0, M - 1)]++;
  const sub = cnt.slice(); push('Cantidad de cada número (como máscaras de 3 bits).', { cnt, sub: sub.slice(), b: -1 });
  for (let b = 0; b < B; b++) { for (let m = 0; m < M; m++) if (m >> b & 1) sub[m] += sub[m ^ (1 << b)]; push('Bit ' + b + ': sub[m] += sub[m sin el bit ' + b + '] para las máscaras que lo tienen (amarillo).', { cnt, sub: sub.slice(), b }); }
  push('Listo: sub[m] = cuántos números son subconjunto de m. Por ejemplo sub[111] = ' + sub[M - 1] + ' = todos.', { cnt, sub: sub.slice(), b: -1 });
}, s => { const lab = [...Array(8).keys()].map(m => m.toString(2).padStart(3, '0')); return rows([{ t: 'máscara', v: lab, c: lab.map((_, m) => s.b >= 0 && m >> s.b & 1 ? 'a' : '') }, { t: 'cantidad', v: s.cnt }, { t: 'sub', v: s.sub, c: s.sub.map((_, m) => s.b >= 0 && m >> s.b & 1 ? 'g' : '') }]); });

V(DO_ + 'DigitDP', 'DP de dígitos: el camino pegado al límite', 'Se cuentan los números ≤ N con a lo sumo 3 dígitos no nulos. Se recorre N dígito por dígito: poner un dígito menor que el de N libera el resto, que se cuenta con una fórmula (libre). Poner el mismo dígito sigue "pegado".', push => {
  const N = R(1000, 99999), D = String(N).split('').map(Number), libre = (r, nz) => { if (nz > 3) return 0; if (!r) return 1; return libre(r - 1, nz) + 9 * libre(r - 1, nz + 1); };
  let total = 0, nz = 0; const filas = [];
  push('N = ' + N + '. Contar los números de [0, N] con ≤ 3 dígitos distintos de cero.', { D, pos: -1, filas: [], total });
  for (let p = 0; p < D.length; p++) { const resto = D.length - p - 1; let suma = 0; for (let d = 0; d < D[p]; d++) suma += libre(resto, nz + (d !== 0)); total += suma;
    filas.push(['pos ' + (p + 1), 'dígitos 0…' + (D[p] - 1), suma]); push('Posición ' + (p + 1) + ' (límite ' + D[p] + '): ' + (D[p] ? 'poner 0…' + (D[p] - 1) + ' libera ' + pl(resto, 'dígito', 'dígitos') : 'no hay dígitos menores que 0') + ' → suma ' + suma + '. Total = ' + total + '.', { D, pos: p, filas: filas.slice(), total });
    nz += D[p] !== 0; if (nz > 3) { push('Pegados a N ya hay ' + nz + ' dígitos no nulos: el camino se corta. Respuesta = ' + total + '.', { D, pos: p, filas: filas.slice(), total }); return; } }
  total++; push('Se llegó al final pegados: el propio N también cuenta. Respuesta = ' + total + '.', { D, pos: D.length, filas, total });
}, s => cellsRow('N', s.D, s.D.map((_, i) => i < s.pos ? 'g' : i === s.pos ? 'a' : '')) + (s.filas.length ? table(s.filas, null, null, ['dígito', 'opciones menores', 'se suman']) : ''));

V(DT_ + 'TreeMatching', 'Emparejamiento máximo en un árbol', 'Etiqueta = libre / usado: lo mejor en el subárbol sin usar el nodo, o usándolo con un hijo. Se calcula de las hojas a la raíz. Verde = parejas elegidas al final.', push => {
  const n = R(7, 10), { T, E, s } = treeState(n); const libre = Array(n).fill(0), usado = Array(n).fill(0), orden = [0]; for (const u of orden) T.kids[u].forEach(v => orden.push(v));
  push('Árbol con ' + n + ' nodos. Raíz = 1.', s);
  for (let k = n - 1; k >= 0; k--) { const u = orden[k]; let suma = 0, mej = -1; for (const v of T.kids[u]) { const m = Math.max(libre[v], usado[v]); suma += m; mej = Math.max(mej, libre[v] + 1 - m); }
    libre[u] = suma; usado[u] = mej >= 0 ? suma + mej : 0; s.ns[u] = libre[u] + ' / ' + usado[u]; s.nc[u] = 'b'; push('Nodo ' + (u + 1) + ': libre = ' + libre[u] + ', usado = ' + usado[u] + '.', s); s.nc[u] = ''; }
  const elegir = (u, puedeUsar) => { let mejorHijo = -1; if (puedeUsar && usado[u] > libre[u]) { let best = -1; for (const v of T.kids[u]) { const g = libre[v] + 1 - Math.max(libre[v], usado[v]); if (g > best) { best = g; mejorHijo = v; } } }
    for (const v of T.kids[u]) { if (v === mejorHijo) { s.ec[v - 1] = 'g'; s.nc[u] = s.nc[v] = 'g'; elegir(v, false); } else elegir(v, true); } };
  elegir(0, true); push('Respuesta: ' + Math.max(libre[0], usado[0]) + ' parejas.', s);
}, GR);

V(DT_ + 'Rerooting', 'Rerooting: la respuesta para todas las raíces', 'Primero una pasada hacia arriba (tamaños y suma de distancias desde 1). Luego, al mover la raíz del padre p al hijo v: los sz[v] nodos de su subárbol quedan 1 más cerca y los n − sz[v] restantes 1 más lejos.', push => {
  const n = R(7, 10), { T, s } = treeState(n), sz = Array(n).fill(1), ans = Array(n).fill(null), orden = [0]; for (const u of orden) T.kids[u].forEach(v => orden.push(v));
  for (let k = n - 1; k > 0; k--) sz[T.par[orden[k]]] += sz[orden[k]];
  s.ns = sz.map(x => 'sz ' + x); push('Pasada 1: tamaños de subárbol (etiquetas).', s);
  ans[0] = T.depth.reduce((a, b) => a + b, 0); s.ns[0] = 'Σ = ' + ans[0]; s.nc[0] = 'g'; push('Suma de distancias desde la raíz 1 = suma de profundidades = ' + ans[0] + '.', s);
  for (const u of orden.slice(1)) { const p = T.par[u]; ans[u] = ans[p] + n - 2 * sz[u]; s.nc[u] = 'a'; s.ns[u] = 'Σ = ' + ans[u];
    push('Nodo ' + (u + 1) + ': ' + ans[p] + ' + (' + n + ' − ' + sz[u] + ') − ' + sz[u] + ' = ' + ans[u] + '.', s); s.nc[u] = 'g'; }
  push('Las n respuestas en O(n), sin recorrer el árbol desde cada nodo.', s);
}, GR);

// =================== Grafos avanzados ===================
const GC = 'Graphs-Algorithms-Connectivity-', GF = 'Graphs-Algorithms-Flow-Algorithms-';
function lowLinkSteps(push, modo) {
  const n = R(7, 9), xy = circleLayout(n), E = [], has = new Set(), add = (a, b) => { const k = Math.min(a, b) + ',' + Math.max(a, b); if (a === b || has.has(k)) return; has.add(k); E.push({ a, b }); };
  // dos o tres "bloques" con ciclos unidos por aristas sueltas, para que haya puentes y articulaciones
  const ord = shuffle([...Array(n).keys()]), c1 = R(3, 4); for (let i = 0; i < c1; i++) add(ord[i], ord[(i + 1) % c1]);
  for (let i = c1; i < n; i++) add(ord[R(Math.max(0, i - 3), i - 1)], ord[i]); if (R(0, 1)) add(ord[n - 1], ord[n - 3]);
  const s = GS(xy, E), G = adjOf(n, E), tin = Array(n).fill(0), low = Array(n).fill(0), par = Array(n).fill(-1), pe = Array(n).fill(-1); let t = 0; const res = [];
  const lab = u => tin[u] ? tin[u] + '/' + low[u] : '';
  push('tin/low de cada nodo: tin = momento de descubrimiento; low = el menor tin alcanzable bajando por el árbol DFS y usando una arista de retroceso.', s);
  const dfs = u => { tin[u] = low[u] = ++t; s.nc[u] = 'a'; s.ns[u] = lab(u); push('Se descubre ' + (u + 1) + ' (tin = ' + tin[u] + ').', s); let hijos = 0;
    for (const [v, k] of G[u]) { if (k === pe[u]) continue;
      if (tin[v]) { if (tin[v] < low[u]) { low[u] = tin[v]; s.ec[k] = 'p'; s.ns[u] = lab(u); push('Arista de retroceso ' + (u + 1) + '–' + (v + 1) + ': low[' + (u + 1) + '] = ' + low[u] + '.', s); } continue; }
      par[v] = u; pe[v] = k; s.ec[k] = 'b'; hijos++; dfs(v); low[u] = Math.min(low[u], low[v]); s.ns[u] = lab(u);
      if (modo === 'puente' && low[v] > tin[u]) { s.ec[k] = 'r'; res.push((u + 1) + '–' + (v + 1)); push('low[' + (v + 1) + '] = ' + low[v] + ' > tin[' + (u + 1) + '] = ' + tin[u] + ': nada debajo de ' + (v + 1) + ' sube más arriba. ' + (u + 1) + '–' + (v + 1) + ' es puente.', s); }
      else if (modo === 'corte' && par[u] >= 0 && low[v] >= tin[u] && !res.includes(u + 1)) { res.push(u + 1); s.ring = u; push('low[' + (v + 1) + '] = ' + low[v] + ' ≥ tin[' + (u + 1) + '] = ' + tin[u] + ': el subárbol de ' + (v + 1) + ' solo sale pasando por ' + (u + 1) + '. Es punto de articulación.', s); }
      else push('Vuelve de ' + (v + 1) + ' a ' + (u + 1) + ': low[' + (u + 1) + '] = ' + low[u] + '.', s); }
    if (modo === 'corte' && par[u] < 0 && hijos >= 2) { res.push(u + 1); push('La raíz tiene ' + hijos + ' hijos en el árbol DFS: es punto de articulación.', s); }
    s.nc[u] = modo === 'corte' && res.includes(u + 1) ? 'r' : 'g'; };
  dfs(0); s.ring = undefined; s.nc = s.nc.map((_, u) => modo === 'corte' && res.includes(u + 1) ? 'r' : 'g');
  push(modo === 'puente' ? (res.length ? 'Puentes: ' + res.join(', ') + ' (rojo).' : 'No hay puentes: toda arista está en algún ciclo.') : (res.length ? 'Puntos de articulación: ' + res.join(', ') + ' (rojo).' : 'No hay puntos de articulación.'), s);
}
V(GC + 'Bridges', 'Puentes con tin y low', 'Azul = arista del árbol DFS; morado = arista de retroceso que baja low; rojo = puente.', push => lowLinkSteps(push, 'puente'), GR);
V(GC + 'ArticulationPoints', 'Puntos de articulación con tin y low', 'Igual que con puentes, pero la condición es low[hijo] ≥ tin[u] (con ≥: el hijo puede volver a u, pero no más arriba). La raíz es especial: es de corte si tiene 2 o más hijos en el DFS.', push => lowLinkSteps(push, 'corte'), GR);

V('Graphs-Algorithms-Trees-HLD', 'Heavy-light: cadenas pesadas y saltos', 'Cada nodo continúa su cadena por el hijo de subárbol más grande (aristas de color). Un camino cualquiera cruza O(log n) cadenas, y cada tramo de cadena es un rango contiguo del Segment Tree.', push => {
  const n = R(11, 14), { T, E, s } = treeState(n, 540, 280), sz = Array(n).fill(1), orden = [0]; for (const u of orden) T.kids[u].forEach(v => orden.push(v));
  for (let k = n - 1; k > 0; k--) sz[T.par[orden[k]]] += sz[orden[k]];
  const pes = Array(n).fill(-1); for (let u = 0; u < n; u++) { let b = -1; for (const v of T.kids[u]) if (b < 0 || sz[v] > sz[b]) b = v; pes[u] = b; }
  const cab = Array(n).fill(-1), pos = Array(n).fill(0); let t = 0, ci = 0; const colC = ['b', 'g', 'o', 'p', 'a', 'r'];
  s.ns = sz.map(x => 'sz ' + x); push('Tamaños de subárbol.', s);
  for (const u of orden) if (u === 0 || pes[T.par[u]] !== u) { const col = colC[ci++ % colC.length]; for (let v = u; v >= 0; v = pes[v]) { cab[v] = u; pos[v] = t++; s.nc[v] = col; if (v) s.ec[v - 1] = v === u ? '' : col; }
    push('Cadena que empieza en ' + (u + 1) + ': ' + (function () { const L = []; for (let v = u; v >= 0; v = pes[v]) L.push(v + 1); return L.join(' → '); })() + ' (posiciones consecutivas).', s); }
  s.ns = pos.map(p => 'pos ' + p); push('Etiqueta = posición en el arreglo del Segment Tree.', s);
  let a = R(1, n - 1), b = R(1, n - 1); while (b === a) b = R(0, n - 1); const A0 = a, B0 = b; const tramos = [];
  s.ring = a; push('Consulta en el camino ' + (a + 1) + ' – ' + (b + 1) + '.', s);
  while (cab[a] !== cab[b]) { if (T.depth[cab[a]] < T.depth[cab[b]]) [a, b] = [b, a]; tramos.push('[' + pos[cab[a]] + ', ' + pos[a] + ']'); s.ring = a;
    push('Las cabezas son distintas: se toma el tramo ' + tramos[tramos.length - 1] + ' de la cadena de ' + (a + 1) + ' y se salta al padre de su cabeza.', s); a = T.par[cab[a]]; }
  if (T.depth[a] > T.depth[b]) [a, b] = [b, a]; tramos.push('[' + pos[a] + ', ' + pos[b] + ']'); s.ring = b;
  push('Misma cadena: último tramo ' + tramos[tramos.length - 1] + '. El camino ' + (A0 + 1) + '–' + (B0 + 1) + ' se respondió con ' + pl(tramos.length, 'consulta', 'consultas') + ' de rango: ' + tramos.join(', ') + '.', s);
}, GR);

V(GF + 'HopcroftKarp', 'Hopcroft-Karp: muchos caminos aumentantes por fase', 'Cada fase hace un BFS desde todos los izquierdos libres (etiqueta = capa) y luego aumenta por caminos disjuntos de largo mínimo. Verde = emparejado.', push => {
  const L = 5, Rr = 5, xy = []; for (let i = 0; i < L; i++) xy.push({ x: 140, y: 30 + i * 58 }); for (let j = 0; j < Rr; j++) xy.push({ x: 400, y: 30 + j * 58 });
  const E = []; for (let i = 0; i < L; i++) shuffle([...Array(Rr).keys()]).slice(0, R(1, 3)).forEach(j => E.push({ a: i, b: L + j }));
  const s = GS(xy, E); s.lab = [...Array(L).keys()].map(i => 'I' + (i + 1)).concat([...Array(Rr).keys()].map(j => 'D' + (j + 1)));
  const mL = Array(L).fill(-1), mR = Array(Rr).fill(-1), paint = () => { s.ec = E.map(e => mL[e.a] === e.b - L ? 'g' : ''); s.nc = s.nc.map((_, v) => (v < L ? mL[v] >= 0 : mR[v - L] >= 0) ? 'g' : ''); };
  push('Izquierda y derecha; las líneas son las parejas posibles.', s); let K = 0;
  for (let fase = 1; fase <= 6; fase++) { const dist = Array(L).fill(-1), q = []; for (let a = 0; a < L; a++) if (mL[a] < 0) { dist[a] = 0; q.push(a); } let hay = false;
    for (const a of q) for (const e of E) if (e.a === a) { const c = mR[e.b - L]; if (c < 0) hay = true; else if (dist[c] < 0) { dist[c] = dist[a] + 1; q.push(c); } }
    s.ns = dist.map(d => d < 0 ? '' : 'capa ' + d).concat(Array(Rr).fill('')); paint();
    if (!hay) { push('Fase ' + fase + ': el BFS no llega a ningún derecho libre. Emparejamiento máximo = ' + K + '.', s); return; }
    push('Fase ' + fase + ': BFS por capas desde los izquierdos libres.', s); let nuevos = 0;
    const dfs = a => { for (const e of E) { if (e.a !== a) continue; const c = mR[e.b - L]; if (c < 0 || (dist[c] === dist[a] + 1 && dfs(c))) { mL[a] = e.b - L; mR[e.b - L] = a; return true; } } dist[a] = -1; return false; };
    for (let a = 0; a < L; a++) if (mL[a] < 0 && dfs(a)) { K++; nuevos++; paint(); push('Se aumenta desde I' + (a + 1) + ' (camino alternante de largo mínimo). Total: ' + K + '.', s); }
    push('Fin de la fase ' + fase + ': ' + pl(nuevos, 'camino', 'caminos') + ' en una sola fase.', s); }
}, GR);

V(GF + 'MinCut', 'Corte mínimo a partir del flujo máximo', 'Se calcula el flujo máximo; después, los nodos que S todavía alcanza en el residual (verde) forman un lado del corte. Las aristas rojas cruzan de verde a naranja: son las que hay que cortar.', push => { const { n, xy, E } = flowNet(); augmentSteps(push, n, xy, E, true, 'Flujo terminado'); }, GR);

V(GF + 'LowerBoundFlow', 'Cotas inferiores: mandar lo obligatorio y reparar', 'Cada tubo [l, c] manda primero l "por obligación" y queda con capacidad c − l. Eso deja nodos con exceso (+) o con déficit (−). Una fuente nueva S\' reparte los excesos y un sumidero T\' recoge los déficits: hay circulación válida si el flujo máximo de S\' a T\' los satisface todos.', push => {
  const n = 4, xy = circleLayout(n, 540, 240), base = [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2]], E = base.map(([a, b]) => { const l = R(0, 3); return { a, b, l, w: l + R(0, 3) }; });
  const s = GS(xy, E, true); s.el = E.map(e => '[' + e.l + ', ' + e.w + ']'); push('Tubos con [mínimo, máximo]. Hay que elegir un flujo dentro de cada rango que se conserve en todos los nodos.', s);
  const ex = Array(n).fill(0); E.forEach(e => { ex[e.b] += e.l; ex[e.a] -= e.l; }); s.ns = ex.map(x => x > 0 ? '+' + x : '' + x); s.el = E.map(e => 'libre ' + (e.w - e.l));
  push('Se manda l en cada tubo. Etiqueta del nodo = lo que le sobra (+) o le falta (−). A cada tubo le queda c − l libre.', s);
  // flujo máximo de S' a T' con Edmonds-Karp sobre la red auxiliar
  const N = n + 2, S = n, T = n + 1, cap = {}, adj = Array.from({ length: N }, () => new Set()), add = (a, b, c) => { cap[a + ',' + b] = (cap[a + ',' + b] || 0) + c; cap[b + ',' + a] = cap[b + ',' + a] || 0; adj[a].add(b); adj[b].add(a); };
  E.forEach(e => add(e.a, e.b, e.w - e.l)); let need = 0; ex.forEach((x, v) => { if (x > 0) { add(S, v, x); need += x; } else if (x < 0) add(v, T, -x); });
  let fl = 0; while (true) { const prev = Array(N).fill(-1); prev[S] = S; const q = [S]; for (const u of q) for (const v of adj[u]) if (prev[v] < 0 && cap[u + ',' + v] > 0) { prev[v] = u; q.push(v); } if (prev[T] < 0) break; let b = Infinity; for (let v = T; v !== S; v = prev[v]) b = Math.min(b, cap[prev[v] + ',' + v]); for (let v = T; v !== S; v = prev[v]) { cap[prev[v] + ',' + v] -= b; cap[v + ',' + prev[v]] += b; } fl += b; }
  const ok = fl === need, f = E.map(e => e.l + (e.w - e.l - cap[e.a + ',' + e.b]));   // l + lo que pasó por el tubo
  s.ec = E.map(() => ok ? 'g' : 'r'); s.el = E.map((e, k) => ok ? f[k] + ' ∈ [' + e.l + ', ' + e.w + ']' : '[' + e.l + ', ' + e.w + ']'); s.ns = ex.map(() => '');
  push(ok ? 'El flujo de S\' a T\' vale ' + fl + ' = suma de excesos: todos se satisfacen. Flujo de cada tubo = l + lo que pasó (verde).' : 'El flujo de S\' a T\' vale ' + fl + ' < ' + need + ': algún exceso no se puede repartir. No hay circulación válida.', s);
}, GR);

V(GF + 'Hungarian', 'Algoritmo húngaro: potenciales y costos reducidos', 'Se muestra el costo reducido c[i][j] − u[i] − v[j] (nunca negativo). Las casillas en 0 son las aristas "ajustadas"; verde = asignación actual. Al agregar cada fila se suben/bajan los potenciales lo justo para crear un camino de ceros.', push => {
  const n = 4, c = Array.from({ length: n }, () => Array.from({ length: n }, () => R(1, 9))); const u = Array(n + 1).fill(0), v = Array(n + 1).fill(0), p = Array(n + 1).fill(0), way = Array(n + 1).fill(0);
  const st = fila => { const red = c.map((r, i) => r.map((x, j) => x - u[i + 1] - v[j + 1])); const cls = red.map((r, i) => r.map((x, j) => p[j + 1] === i + 1 ? 'g' : x === 0 ? 'b' : '')); if (fila >= 0) cls[fila] = cls[fila].map(x => x || 'a'); return { red, cls, u: u.slice(1), v: v.slice(1), c }; };
  push('Matriz de costos (empleado × tarea). Potenciales en 0.', st(-1));
  for (let i = 1; i <= n; i++) { p[0] = i; let j0 = 0; const minv = Array(n + 1).fill(Infinity), used = Array(n + 1).fill(false);
    do { used[j0] = true; const i0 = p[j0]; let delta = Infinity, j1 = 0; for (let j = 1; j <= n; j++) if (!used[j]) { const cur = c[i0 - 1][j - 1] - u[i0] - v[j]; if (cur < minv[j]) { minv[j] = cur; way[j] = j0; } if (minv[j] < delta) { delta = minv[j]; j1 = j; } }
      for (let j = 0; j <= n; j++) if (used[j]) { u[p[j]] += delta; v[j] -= delta; } else minv[j] -= delta; j0 = j1; } while (p[j0] !== 0);
    do { const j1 = way[j0]; p[j0] = p[j1]; j0 = j1; } while (j0);
    push('Fila ' + i + ' agregada: los potenciales se movieron y apareció un camino de ceros que la asigna (amarillo = fila nueva).', st(i - 1)); }
  let tot = 0; for (let j = 1; j <= n; j++) tot += c[p[j] - 1][j - 1]; push('Asignación óptima (verde) con costo total ' + tot + ' = Σu + Σv: los potenciales prueban que no hay nada mejor (dualidad).', st(-1));
}, s => table(s.red, s.cls, s.u.map((x, i) => 'E' + (i + 1) + ' u=' + x), s.v.map((x, j) => 'T' + (j + 1) + ' v=' + x)) + '<p class="note">Costos originales: ' + s.c.map(r => r.join(' ')).join(' | ') + '</p>');

// =================== Estructuras y cadenas avanzadas ===================
V('Data-Structures-Algorithms-PersistentSegmentTree', 'Segment Tree persistente: versiones que comparten nodos', 'Cada caja es un nodo con su número y su suma. Un cambio no modifica nada: crea copias de los nodos del camino raíz → hoja (amarillo) y reutiliza todo lo demás (mismo número = mismo nodo en memoria).', push => {
  const a = Array.from({ length: 4 }, () => R(1, 9)); let cnt = 0; const nodos = {};
  const build = (l, r) => { const id = ++cnt; if (l === r) nodos[id] = { l, r, s: a[l], L: 0, R: 0 }; else { const m = (l + r) >> 1, L = build(l, m), Rr = build(m + 1, r); nodos[id] = { l, r, s: nodos[L].s + nodos[Rr].s, L, R: Rr }; } return id; };
  const cambiar = (u, pos, x) => { const o = nodos[u], id = ++cnt; if (o.l === o.r) { nodos[id] = { l: o.l, r: o.r, s: x, L: 0, R: 0 }; return id; } const m = (o.l + o.r) >> 1; const L = pos <= m ? cambiar(o.L, pos, x) : o.L, Rr = pos > m ? cambiar(o.R, pos, x) : o.R; nodos[id] = { l: o.l, r: o.r, s: nodos[L].s + nodos[Rr].s, L, R: Rr }; return id; };
  const raices = [build(0, 3)]; const st = nuevo => ({ nodos, raices: raices.slice(), nuevo: nuevo || [] });
  push('Versión 1 del arreglo ' + a.join(', ') + ': 7 nodos.', st());
  for (let v = 0; v < 2; v++) { const pos = R(0, 3), x = R(1, 9), antes = cnt; raices.push(cambiar(raices[raices.length - 1], pos, x)); const nuevos = []; for (let i = antes + 1; i <= cnt; i++) nuevos.push(i);
    push('Versión ' + raices.length + ' = versión ' + (raices.length - 1) + ' con a[' + (pos + 1) + '] = ' + x + ': solo ' + nuevos.length + ' nodos nuevos (' + nuevos.join(', ') + '); los otros se comparten.', st(nuevos)); }
  push('Total: ' + cnt + ' nodos para 3 versiones, en vez de 21. Cada versión sigue respondiendo consultas desde su propia raíz.', st());
}, s => { let g = ''; const W = 540, w3 = W / 3;
  s.raices.forEach((rt, v) => { const x0 = v * w3; const dib = (u, x, y, dx) => { const o = s.nodos[u]; if (o.L) { g += '<line x1="' + x + '" y1="' + y + '" x2="' + (x - dx) + '" y2="' + (y + 60) + '" stroke="#999"/><line x1="' + x + '" y1="' + y + '" x2="' + (x + dx) + '" y2="' + (y + 60) + '" stroke="#999"/>'; dib(o.L, x - dx, y + 60, dx / 2); dib(o.R, x + dx, y + 60, dx / 2); }
      const nuevo = s.nuevo.includes(u); g += '<rect x="' + (x - 20) + '" y="' + (y - 14) + '" width="40" height="28" rx="6" fill="' + (nuevo ? '#ffd33d' : 'var(--card)') + '" stroke="#666"/>' + txt(x, y - 1, '#' + u, { s: 9, c: nuevo ? '#111' : undefined }) + txt(x, y + 10, 'Σ ' + o.s, { s: 10, b: 1, c: nuevo ? '#111' : undefined }); };
    g += txt(x0 + w3 / 2, 16, 'versión ' + (v + 1), { b: 1 }); dib(rt, x0 + w3 / 2, 44, w3 / 4); });
  return svgBox(g, W, 230); });

V('Data-Structures-Algorithms-Treap', 'Treap implícito: cortar y pegar', 'El árbol es de búsqueda por posición (en orden da la cadena) y un heap por prioridad (el número pequeño sobre cada nodo; arriba siempre queda la mayor). split parte por posición y merge une poniendo arriba la prioridad mayor; ambos bajan por una sola rama: O(log n) esperado.', push => {
  const str = shuffle('ABCDEFG'.split('')).join('').slice(0, 7), n = str.length, pr = shuffle([...Array(n).keys()].map(i => (i + 1) * 7 % 50 + R(0, 4))), nodos = str.split('').map((c, i) => ({ c, p: pr[i], l: -1, r: -1 }));
  const merge = (a, b) => { if (a < 0) return b; if (b < 0) return a; if (nodos[a].p > nodos[b].p) { nodos[a].r = merge(nodos[a].r, b); return a; } nodos[b].l = merge(a, nodos[b].l); return b; };
  const size = u => u < 0 ? 0 : 1 + size(nodos[u].l) + size(nodos[u].r);
  const split = (u, k) => { if (u < 0) return [-1, -1]; if (size(nodos[u].l) < k) { const [a, b] = split(nodos[u].r, k - size(nodos[u].l) - 1); nodos[u].r = a; return [u, b]; } const [a, b] = split(nodos[u].l, k); nodos[u].l = b; return [a, u]; };
  const inord = u => u < 0 ? [] : inord(nodos[u].l).concat([u], inord(nodos[u].r));
  let raiz = -1; for (let i = 0; i < n; i++) raiz = merge(raiz, i);
  const st = (rs, hl) => ({ nodos: clone(nodos), rs, hl: hl || [] });
  push('Cadena ' + str + ' con prioridades al azar.', st([raiz]));
  for (let op = 0; op < 2; op++) { const cur = inord(raiz).map(u => nodos[u].c).join(''), a = R(1, n - 1), b = R(a, n);
    const [x, y0] = split(raiz, a - 1), [y, z] = split(y0, b - a + 1); const tramo = inord(y);
    push('Cortar [' + a + ', ' + b + '] de ' + cur + ': dos splits dejan tres treaps (el del medio en amarillo).', st([x, y, z].filter(t => t >= 0), tramo));
    raiz = merge(merge(x, z), y); push('merge(merge(izquierda, derecha), tramo): ' + inord(raiz).map(u => nodos[u].c).join('') + '.', st([raiz], tramo)); }
}, s => { let g = ''; const W = 540, ts = s.rs; let col = 0; const total = ts.reduce((acc, t) => { const c = u => u < 0 ? 0 : 1 + c(s.nodos[u].l) + c(s.nodos[u].r); return acc + c(t); }, 0), dx = (W - 60) / Math.max(total - 1 + 0.8 * (ts.length - 1), 1);
  ts.forEach(t => { const pos = []; const ino = (u, d) => { if (u < 0) return; ino(s.nodos[u].l, d + 1); pos[u] = [30 + dx * col++, 30 + d * 44]; ino(s.nodos[u].r, d + 1); }; ino(t, 0);
    const lin = u => { if (u < 0) return; for (const v of [s.nodos[u].l, s.nodos[u].r]) if (v >= 0) { g += '<line x1="' + pos[u][0] + '" y1="' + pos[u][1] + '" x2="' + pos[v][0] + '" y2="' + pos[v][1] + '" stroke="#999"/>'; lin(v); } }; lin(t);
    col += 0.8; pos.forEach((p, u) => { if (!p) return; const hl = s.hl.includes(u); g += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="15" fill="' + (hl ? '#ffd33d' : 'var(--card)') + '" stroke="#666"/>' + txt(p[0], p[1] + 4, s.nodos[u].c, { b: 1, c: hl ? '#111' : undefined }) + txt(p[0], p[1] - 19, s.nodos[u].p, { s: 9 }); }); });
  const prof = u => u < 0 ? 0 : 1 + Math.max(prof(s.nodos[u].l), prof(s.nodos[u].r)); return svgBox(g, W, Math.max(200, 30 + Math.max(...ts.map(prof)) * 44)); });

V('Data-Structures-Algorithms-OrderedSet', 'Josephus con un conjunto ordenado', 'Quedan los niños en orden; find_by_order(pos) da el niño en la posición pos en O(log n). Amarillo = el que sale.', push => {
  const n = R(7, 10), k = R(1, 4), vivos = [...Array(n).keys()].map(i => i + 1), salen = []; let pos = 0;
  push(n + ' niños, se saltan ' + k + ' cada vez.', { vivos: vivos.slice(), salen: [], hl: -1 });
  while (vivos.length) { pos = (pos + k) % vivos.length; push('pos = (pos + ' + k + ') mód ' + vivos.length + ' = ' + pos + ': find_by_order(' + pos + ') = ' + vivos[pos] + '.', { vivos: vivos.slice(), salen: salen.slice(), hl: pos }); salen.push(vivos.splice(pos, 1)[0]); }
  push('Orden de salida: ' + salen.join(' ') + '.', { vivos: [], salen, hl: -1 });
}, s => rows([{ t: 'quedan', v: s.vivos.length ? s.vivos : ['—'], c: s.vivos.map((_, i) => i === s.hl ? 'a' : '') }, { t: 'salieron', v: s.salen.length ? s.salen : ['—'] }]));

V('Strings-Algorithms-AhoCorasick', 'Aho-Corasick: trie con enlaces de fallo', 'Líneas grises = trie; punteadas moradas = enlace de fallo (el sufijo propio más largo que también está en el trie). Al leer el texto, si no hay transición se sigue el fallo, igual que KMP. Verde = nodo final de un patrón encontrado.', push => {
  const pats = pick([['he', 'she', 'his', 'hers'], ['ab', 'bab', 'bc', 'ca'], ['aa', 'ab', 'ba', 'bb']]), text = pick({ 0: ['ushers', 'ahishers'], 1: ['abcab', 'babca'], 2: ['aabba', 'abab'] }[['he', 'ab', 'aa'].indexOf(pats[0])]);
  const ch = [{}], fin = []; const par = [-1], letra = ['']; pats.forEach(p => { let u = 0; for (const c of p) { if (ch[u][c] === undefined) { ch[u][c] = ch.length; ch.push({}); par.push(u); letra.push(c); } u = ch[u][c]; } fin.push(u); });
  const N = ch.length, link = Array(N).fill(0), depth = Array(N).fill(0), orden = []; const q = Object.values(ch[0]); q.forEach(v => depth[v] = 1);
  while (q.length) { const u = q.shift(); orden.push(u); for (const [c, v] of Object.entries(ch[u])) { let f = link[u]; while (f && ch[f][c] === undefined) f = link[f]; const w = ch[f][c]; link[v] = w !== undefined && w !== v ? w : 0; depth[v] = depth[u] + 1; q.push(v); } }
  const porNivel = {}; for (let u = 0; u < N; u++) (porNivel[depth[u]] = porNivel[depth[u]] || []).push(u);
  const xy = Array(N); Object.entries(porNivel).forEach(([d, us]) => us.forEach((u, i) => xy[u] = { x: Math.round(40 + (460) * (us.length > 1 ? i / (us.length - 1) : 0.5)), y: 30 + d * 62 }));
  const E = []; for (let u = 1; u < N; u++) E.push({ a: par[u], b: u, w: letra[u] }); const nT = E.length; for (let u = 1; u < N; u++) if (link[u]) E.push({ a: u, b: link[u], w: '' });
  const s = GS(xy, E, true); s.lab = [...Array(N).keys()].map(u => { let t = '', v = u; while (v > 0) { t = letra[v] + t; v = par[v]; } return t || '∅'; }); s.ec = E.map((_, k) => k >= nT ? 'p' : ''); E.forEach((e, k) => { if (k >= nT) e.bend = 18; });
  push('Patrones: ' + pats.join(', ') + '. Trie con sus enlaces de fallo.', s); let u = 0, enc = new Set();
  for (let i = 0; i < text.length; i++) { const c = text[i]; while (u && ch[u][c] === undefined) u = link[u]; u = ch[u][c] !== undefined ? ch[u][c] : 0;
    for (let v = u; v; v = link[v]) fin.forEach((f, k) => { if (f === v) enc.add(pats[k]); });
    s.nc = s.nc.map((_, v) => v === u ? 'a' : fin.includes(v) && [...enc].some(p => fin[pats.indexOf(p)] === v) ? 'g' : '');
    push('Texto "' + text + '", letra ' + (i + 1) + ' (' + c + '): se está en el nodo "' + s.lab[u] + '". Encontrados: ' + ([...enc].join(', ') || 'ninguno') + '.', s); }
}, GR);

V('Strings-Algorithms-SuffixAutomaton', 'Autómata de sufijos, letra por letra', 'Cada estado agrupa subcadenas que terminan en las mismas posiciones; etiqueta = len (la más larga del estado). Flechas = transiciones; morado punteado = enlace de sufijo. Naranja = estado clonado.', push => {
  const str = pick(['abab', 'aabb', 'abcbc', 'abba', 'aaba']); const len = [0], link = [-1], nxt = [{}], clon = [false]; let last = 0;
  const snap = msg => { const N = len.length, porLen = {}; for (let v = 0; v < N; v++) (porLen[len[v]] = porLen[len[v]] || []).push(v);
    const xy = Array(N); Object.entries(porLen).forEach(([L, vs]) => vs.forEach((v, i) => xy[v] = { x: 40 + (+L) * (460 / Math.max(1, str.length)), y: 60 + i * 110 }));
    const E = []; for (let v = 0; v < N; v++) for (const [c, w] of Object.entries(nxt[v])) E.push({ a: v, b: w, w: c, bend: 10 }); const nT = E.length; for (let v = 1; v < N; v++) E.push({ a: v, b: link[v], w: '', bend: -30 });
    const s = GS(xy, E, true); s.lab = len.map(String); s.ec = E.map((_, k) => k >= nT ? 'p' : ''); s.nc = clon.map((c, v) => c ? 'o' : v === last ? 'a' : ''); s.ns = len.map((_, v) => v === 0 ? 'inicio' : ''); push(msg, s); };
  snap('Autómata de la cadena vacía: un solo estado.');
  for (const c of str) { const cur = len.length; len.push(len[last] + 1); link.push(-1); nxt.push({}); clon.push(false); let p = last;
    while (p !== -1 && nxt[p][c] === undefined) { nxt[p][c] = cur; p = link[p]; }
    let msg = 'Se agrega "' + c + '": estado nuevo de len ' + len[cur] + '.';
    if (p === -1) link[cur] = 0; else { const q = nxt[p][c]; if (len[p] + 1 === len[q]) link[cur] = q; else { const cl = len.length; len.push(len[p] + 1); link.push(link[q]); nxt.push(Object.assign({}, nxt[q])); clon.push(true);
      while (p !== -1 && nxt[p][c] === q) { nxt[p][c] = cl; p = link[p]; } link[q] = link[cur] = cl; msg += ' Hubo que clonar un estado para separar subcadenas de distinto largo.'; } }
    last = cur; snap(msg); }
  let tot = 0; for (let v = 1; v < len.length; v++) tot += len[v] - len[link[v]];
  snap('"' + str + '" tiene ' + tot + ' subcadenas distintas: Σ (len[v] − len[link[v]]) sobre los estados. Hay ' + len.length + ' estados (siempre ≤ 2n − 1).');
}, GR);

// =================== Probabilidad con ciclos ===================
V('Probability-Algorithms-GaussianExpectation', 'Esperanza con ciclos: Gauss', 'Paseo al azar en un grafo hasta llegar al nodo final. E[v] = 1 + promedio de E[vecinos] crea un sistema con ciclos (no hay orden para una DP). Se resuelve con eliminación de Gauss: amarillo = pivote de la columna.', push => {
  const n = 4, adj = [[1, 2], [0, 2, 3], [0, 1, 3], [1, 2]]; const V_ = n - 1;
  const A = Array.from({ length: V_ }, (_, v) => { const row = Array(V_ + 1).fill(0); row[v] = 1; row[V_] = 1; adj[v].forEach(w => { if (w < V_) row[w] -= 1 / adj[v].length; }); return row; });
  const f = x => Math.abs(x) < 1e-9 ? 0 : Math.round(x * 1000) / 1000;
  const st = (piv) => ({ A: A.map(r => r.map(f)), piv });
  push('Grafo 1–2, 1–3, 2–3, 2–4, 3–4; se busca E[pasos] desde cada nodo hasta 4. Fila v: E[v] − Σ E[w]/grado = 1.', st(-1));
  for (let c = 0; c < V_; c++) { let p = c; for (let r = c + 1; r < V_; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r; [A[c], A[p]] = [A[p], A[c]];
    const d = A[c][c]; for (let k = c; k <= V_; k++) A[c][k] /= d; for (let r = 0; r < V_; r++) if (r !== c && A[r][c]) { const m = A[r][c]; for (let k = c; k <= V_; k++) A[r][k] -= m * A[c][k]; }
    push('Columna ' + (c + 1) + ': se normaliza la fila del pivote y se elimina E[' + (c + 1) + '] de las demás filas.', st(c)); }
  push('Solución: E[1] = ' + f(A[0][V_]) + ', E[2] = ' + f(A[1][V_]) + ', E[3] = ' + f(A[2][V_]) + ' pasos.', st(-1));
}, s => table(s.A, s.A.map((r, i) => r.map((_, j) => i === s.piv && j === s.piv ? 'a' : j === r.length - 1 ? 'g' : '')), s.A.map((_, i) => 'fila ' + (i + 1)), ['E[1]', 'E[2]', 'E[3]', '= b']));

// =================== Geometría avanzada ===================
const GA = 'Geometry-Advanced-';
const distPS = (p, a, b) => { const ab = [b[0] - a[0], b[1] - a[1]], ap = [p[0] - a[0], p[1] - a[1]], L = ab[0] ** 2 + ab[1] ** 2; let t = L ? (ap[0] * ab[0] + ap[1] * ab[1]) / L : 0; t = Math.max(0, Math.min(1, t)); const q = [a[0] + t * ab[0], a[1] + t * ab[1]]; return { d: Math.hypot(p[0] - q[0], p[1] - q[1]), q, t }; };
V(GA + 'SegmentDistance', 'Distancia entre dos segmentos', 'Si no se cortan, la distancia mínima siempre se alcanza en un extremo: se prueban los 4 extremos contra el otro segmento. Para cada uno, la proyección se recorta a [0, 1] (si cae fuera, el más cercano es un extremo).', push => {
  let A, B, C, D; do { A = [R(-9, -1), R(-5, 5)]; B = [R(-4, 3), R(-5, 5)]; C = [R(0, 6), R(-5, 5)]; D = [R(3, 10), R(-5, 5)]; } while ((A[0] === B[0] && A[1] === B[1]) || (C[0] === D[0] && C[1] === D[1]));
  const cand = [[A, C, D, 'A'], [B, C, D, 'B'], [C, A, B, 'C'], [D, A, B, 'D']], hechos = [];
  push('Segmentos AB (azul) y CD (naranja).', { A, B, C, D, hechos: [], best: -1 });
  cand.forEach(([p, a, b, nm]) => { const r = distPS(p, a, b); hechos.push({ p, q: r.q, d: r.d }); push('Desde ' + nm + ': ' + (r.t === 0 || r.t === 1 ? 'la proyección cae fuera, se usa el extremo' : 'la proyección cae dentro (t = ' + f3(r.t) + ')') + '. Distancia ' + f3(r.d) + '.', { A, B, C, D, hechos: hechos.slice(), best: -1 }); });
  let bi = 0; hechos.forEach((h, i) => { if (h.d < hechos[bi].d) bi = i; }); push('Mínimo: ' + f3(hechos[bi].d) + ' (verde). (Si los segmentos se cortaran, la respuesta sería 0.)', { A, B, C, D, hechos, best: bi });
}, s => { let g = gridBg() + seg(s.A, s.B, '#1f6feb', 3) + seg(s.C, s.D, '#fb8f44', 3); s.hechos.forEach((h, i) => g += seg(h.p, h.q, i === s.best ? '#2da44e' : '#999', i === s.best ? 3 : 1.5, i !== s.best));
  return svgBox(g + dot(s.A, '#1f6feb', 5, 'A') + dot(s.B, '#1f6feb', 5, 'B') + dot(s.C, '#fb8f44', 5, 'C') + dot(s.D, '#fb8f44', 5, 'D'), G0.W, G0.H); });

V(GA + 'LineIntersection', 'Intersección de dos rectas', 'Recta 1: A + t·r; recta 2: C + u·s. Cruzando la ecuación A + t·r = C + u·s con s se despeja t = cross(C − A, s) / cross(r, s). Si cross(r, s) = 0 son paralelas (o la misma recta).', push => {
  const A = [R(-9, -3), R(-5, 5)], B = [R(-2, 4), R(-5, 5)], C = [R(-8, 8), R(-5, -1)], par = Math.random() < 0.25; const D = par ? [C[0] + B[0] - A[0], C[1] + B[1] - A[1]] : [R(-8, 8), R(1, 5)];
  const r = [B[0] - A[0], B[1] - A[1]], sv = [D[0] - C[0], D[1] - C[1]], den = r[0] * sv[1] - r[1] * sv[0];
  push('Recta por A y B (azul), recta por C y D (naranja). r = (' + r + '), s = (' + sv + ').', { A, B, C, D, P: null });
  push('cross(r, s) = ' + den + (den ? '' : ': direcciones paralelas.'), { A, B, C, D, P: null });
  if (!den) { const same = r[0] * (C[1] - A[1]) - r[1] * (C[0] - A[0]) === 0; push(same ? 'Además C está sobre la primera recta: son la misma (SAME).' : 'C no está sobre la primera recta: no se cortan (PARALLEL).', { A, B, C, D, P: null }); return; }
  const num = (C[0] - A[0]) * sv[1] - (C[1] - A[1]) * sv[0], t = num / den, P = [A[0] + t * r[0], A[1] + t * r[1]];
  push('cross(C − A, s) = ' + num + ', así que t = ' + num + ' / ' + den + ' = ' + f3(t) + '. Punto = A + t·r = (' + f3(P[0]) + ', ' + f3(P[1]) + ').', { A, B, C, D, P });
}, s => { const ext = (a, b) => { const d = [b[0] - a[0], b[1] - a[1]]; return [[a[0] - 30 * d[0], a[1] - 30 * d[1]], [a[0] + 30 * d[0], a[1] + 30 * d[1]]]; }; const [a1, a2] = ext(s.A, s.B), [c1, c2] = ext(s.C, s.D);
  let g = gridBg() + seg(a1, a2, '#1f6feb', 2) + seg(c1, c2, '#fb8f44', 2) + dot(s.A, '#1f6feb', 4, 'A') + dot(s.B, '#1f6feb', 4, 'B') + dot(s.C, '#fb8f44', 4, 'C') + dot(s.D, '#fb8f44', 4, 'D');
  if (s.P) g += dot(s.P, '#2da44e', 7, 'P'); return svgBox(g, G0.W, G0.H); });

V(GA + 'CircleIntersection', 'Intersección de dos circunferencias', 'La cantidad de puntos se decide con enteros comparando d² con (r1 + r2)² y (r1 − r2)². Luego a = (r1² − r2² + d²) / (2d) ubica el punto medio M de la cuerda y h = √(r1² − a²) da la mitad de la cuerda.', push => {
  const c1 = [R(-5, -1), R(-2, 2)], r1 = R(2, 5), tipo = R(0, 3); let c2, r2;
  if (tipo === 0) { c2 = [c1[0] + 3, c1[1] + 4]; r2 = Math.max(1, 5 - r1) === 5 - r1 ? 5 - r1 : r1 + 5; } else if (tipo === 1) { c2 = [c1[0] + R(8, 10), c1[1]]; r2 = R(1, 3); } else { c2 = [R(0, 5), R(-2, 2)]; r2 = R(2, 5); }
  const dx = c2[0] - c1[0], dy = c2[1] - c1[1], d2 = dx * dx + dy * dy, S = (r1 + r2) ** 2, Df = (r1 - r2) ** 2;
  push('C1 = (' + c1 + '), r1 = ' + r1 + '; C2 = (' + c2 + '), r2 = ' + r2 + '. d² = ' + d2 + '.', { c1, c2, r1, r2, pts: [], M: null });
  if (d2 === 0 || d2 > S || d2 < Df) { push(d2 === 0 ? 'Mismo centro: ' + (r1 === r2 ? 'son la misma circunferencia (infinitos puntos).' : 'una dentro de la otra, 0 puntos.') : d2 > S ? 'd² = ' + d2 + ' > (r1 + r2)² = ' + S + ': están separadas, 0 puntos.' : 'd² = ' + d2 + ' < (r1 − r2)² = ' + Df + ': una dentro de la otra, 0 puntos.', { c1, c2, r1, r2, pts: [], M: null }); return; }
  const d = Math.sqrt(d2), a = (r1 * r1 - r2 * r2 + d2) / (2 * d), h = Math.sqrt(Math.max(0, r1 * r1 - a * a)), M = [c1[0] + a * dx / d, c1[1] + a * dy / d];
  push('(r1 − r2)² ≤ d² ≤ (r1 + r2)²: se cortan' + (d2 === S || d2 === Df ? ' en un solo punto (tangentes).' : '.') + ' a = ' + f3(a) + ', M = (' + f3(M[0]) + ', ' + f3(M[1]) + ').', { c1, c2, r1, r2, pts: [], M });
  const pts = [[M[0] - h * dy / d, M[1] + h * dx / d]]; if (h > 1e-9) pts.push([M[0] + h * dy / d, M[1] - h * dx / d]);
  push('h = ' + f3(h) + '. Puntos: ' + pts.map(p => '(' + f3(p[0]) + ', ' + f3(p[1]) + ')').join(' y ') + '.', { c1, c2, r1, r2, pts, M });
}, s => { const C = (c, r, col) => { const P = toS(c); return '<circle cx="' + P[0] + '" cy="' + P[1] + '" r="' + r * 22 + '" fill="none" stroke="' + col + '" stroke-width="2.5"/>'; };
  let g = gridBg() + C(s.c1, s.r1, '#1f6feb') + C(s.c2, s.r2, '#fb8f44') + dot(s.c1, '#1f6feb', 4, 'C1') + dot(s.c2, '#fb8f44', 4, 'C2');
  if (s.M) g += seg(s.c1, s.c2, '#999', 1.5, true) + dot(s.M, '#8250df', 4, 'M'); s.pts.forEach(p => g += dot(p, '#2da44e', 6)); return svgBox(g, G0.W, G0.H); });

const hullJS = P => { const p = P.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]).filter((q, i, A) => !i || q[0] !== A[i - 1][0] || q[1] !== A[i - 1][1]); if (p.length < 3) return p; const lo = [], up = [];
  for (const q of p) { while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); } for (const q of p.slice().reverse()) { while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  return lo.slice(0, -1).concat(up.slice(0, -1)); };
V(GA + 'RotatingCalipers', 'Rotating calipers: el par más lejano', 'Para cada arista i → i+1 de la envolvente (azul) se busca el vértice j más lejano de su recta (antípoda). Al girar la arista, j solo avanza: en total O(h). El par más lejano siempre es uno de esos pares antípodas.', push => {
  let P, H; do { P = Array.from({ length: 12 }, () => [R(-10, 10), R(-5, 5)]); H = hullJS(P); } while (H.length < 4);
  const n = H.length, d2 = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2; let j = 1, best = 0, bp = null;
  push('Puntos y su envolvente convexa (' + n + ' vértices).', { P, H, i: -1, j: -1, bp });
  for (let i = 0; i < n; i++) { const a = H[i], b = H[(i + 1) % n]; while (cross(a, b, H[(j + 1) % n]) > cross(a, b, H[j])) j = (j + 1) % n;
    for (const q of [a, b]) if (d2(q, H[j]) > best) { best = d2(q, H[j]); bp = [q, H[j]]; }
    push('Arista ' + (i + 1) + ': su antípoda es el vértice ' + (j + 1) + '. Mejor distancia hasta ahora: √' + best + ' = ' + f3(Math.sqrt(best)) + '.', { P, H, i, j, bp }); }
  push('Diámetro = ' + f3(Math.sqrt(best)) + ' (verde).', { P, H, i: -1, j: -1, bp });
}, s => { let g = gridBg() + poly(s.H, '#1f6feb22', '#1f6feb'); s.P.forEach(p => g += dot(p, '#888', 3));
  if (s.i >= 0) { const a = s.H[s.i], b = s.H[(s.i + 1) % s.H.length]; g += seg(a, b, '#d4a72c', 4) + dot(s.H[s.j], '#cf222e', 6, 'j'); }
  if (s.bp) g += seg(s.bp[0], s.bp[1], '#2da44e', 3); return svgBox(g, G0.W, G0.H); });

const clipJS = (pol, a, b) => { const res = []; for (let i = 0; i < pol.length; i++) { const c = pol[i], d = pol[(i + 1) % pol.length], sc = cross(a, b, c), sd = cross(a, b, d); if (sc >= 0) res.push(c); if ((sc > 0 && sd < 0) || (sc < 0 && sd > 0)) { const t = sc / (sc - sd); res.push([c[0] + (d[0] - c[0]) * t, c[1] + (d[1] - c[1]) * t]); } } return res; };
const areaJS = p => Math.abs(p.reduce((acc, q, i) => acc + q[0] * p[(i + 1) % p.length][1] - q[1] * p[(i + 1) % p.length][0], 0)) / 2;
V(GA + 'HalfPlaneIntersection', 'Intersección de semiplanos', 'Se conserva el lado izquierdo de cada recta dirigida (la flecha). El algoritmo ordena las rectas por ángulo y mantiene en una deque solo las que aportan un lado; aquí se dibuja la región que queda (verde) a medida que se agregan.', push => {
  const B = 11, caja = [[-B, -6], [B, -6], [B, 6], [-B, 6]]; // rectas tangentes a circunferencias alrededor del origen, con el origen a la izquierda: la región nunca queda vacía
  const lines = Array.from({ length: R(4, 6) }, () => { const t = Math.random() * 2 * Math.PI, r = R(2, 5), p = [r * 1.6 * Math.cos(t), r * Math.sin(t)], d = [-Math.sin(t), Math.cos(t)]; return [p, [p[0] + 3 * d[0], p[1] + 3 * d[1]]]; });
  lines.sort((x, y) => Math.atan2(x[1][1] - x[0][1], x[1][0] - x[0][0]) - Math.atan2(y[1][1] - y[0][1], y[1][0] - y[0][0]));
  let reg = caja.slice(); push(lines.length + ' semiplanos, ordenados por el ángulo de su recta. Se empieza con la caja que acota todo.', { lines, k: -1, reg });
  lines.forEach(([a, b], k) => { reg = clipJS(reg, a, b); push('Recta ' + (k + 1) + ' (ángulo ' + Math.round(Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI) + '°): queda ' + (reg.length >= 3 ? 'una región de área ' + f3(areaJS(reg)) : 'vacío') + '.', { lines, k, reg }); });
}, s => { let g = gridBg(); if (s.reg.length >= 3) g += poly(s.reg, '#2da44e44', '#2da44e');
  s.lines.forEach(([a, b], k) => { const d = [b[0] - a[0], b[1] - a[1]]; g += seg([a[0] - 6 * d[0], a[1] - 6 * d[1]], [a[0] + 6 * d[0], a[1] + 6 * d[1]], k <= s.k ? (k === s.k ? '#d4a72c' : '#1f6feb') : '#ccc', k === s.k ? 3 : 1.5, k > s.k);
    const A = toS(a), Bp = toS(b); g += '<line x1="' + A[0] + '" y1="' + A[1] + '" x2="' + Bp[0] + '" y2="' + Bp[1] + '" stroke="' + (k <= s.k ? '#1f6feb' : '#bbb') + '" stroke-width="2.5" marker-end="url(#hp-ar)"/>'; });
  return svgBox('<defs><marker id="hp-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#1f6feb"/></marker></defs>' + g, G0.W, G0.H); });

V(GA + 'PolygonCut', 'Cortar un polígono convexo con una recta', 'Se recorren las aristas: los vértices a la izquierda de la recta se conservan (verde), los de la derecha se descartan (rojo) y, cada vez que una arista cruza la recta, se agrega el punto de cruce (morado).', push => {
  let P; do { P = hullJS(Array.from({ length: 9 }, () => [R(-8, 8), R(-5, 5)])); } while (P.length < 4);
  const a = [R(-9, -5), R(-5, 5)], b = [R(5, 9), R(-5, 5)], res = [], lados = P.map(p => cross(a, b, p));
  push('Polígono de ' + P.length + ' vértices y recta dirigida (se conserva la izquierda).', { P, a, b, res: [], i: -1, lados });
  for (let i = 0; i < P.length; i++) { const c = P[i], d = P[(i + 1) % P.length], sc = lados[i], sd = lados[(i + 1) % P.length]; let m = 'Vértice ' + (i + 1) + ': ' + (sc >= 0 ? 'a la izquierda, se conserva.' : 'a la derecha, se descarta.');
    if (sc >= 0) res.push(c); if ((sc > 0 && sd < 0) || (sc < 0 && sd > 0)) { const t = sc / (sc - sd); res.push([c[0] + (d[0] - c[0]) * t, c[1] + (d[1] - c[1]) * t]); m += ' La arista hacia el siguiente cruza la recta: se agrega el cruce.'; }
    push(m, { P, a, b, res: res.slice(), i, lados }); }
  push('Pedazo izquierdo con área ' + f3(areaJS(res)) + ' de ' + f3(areaJS(P)) + '.', { P, a, b, res, i: -2, lados });
}, s => { const d = [s.b[0] - s.a[0], s.b[1] - s.a[1]]; let g = gridBg() + poly(s.P, '#8882', '#888'); if (s.i === -2 && s.res.length >= 3) g += poly(s.res, '#2da44e55', '#2da44e');
  g += seg([s.a[0] - 3 * d[0], s.a[1] - 3 * d[1]], [s.a[0] + 3 * d[0], s.a[1] + 3 * d[1]], '#d4a72c', 2.5);
  s.P.forEach((p, i) => g += dot(p, i <= s.i || s.i === -2 ? (s.lados[i] >= 0 ? '#2da44e' : '#cf222e') : '#888', i === s.i ? 7 : 5, '' + (i + 1)));
  s.res.forEach(p => { if (!s.P.some(q => q[0] === p[0] && q[1] === p[1])) g += dot(p, '#8250df', 5); }); return svgBox(g, G0.W, G0.H); });

V(GA + 'PointInConvexPolygon', 'Punto en polígono convexo en O(log n)', 'Desde el vértice 1 el polígono se ve como un abanico de triángulos. Con búsqueda binaria por producto cruz se encuentra el triángulo cuyo ángulo contiene al punto, y una última orientación contra la arista de afuera decide.', push => {
  let P; do { P = hullJS(Array.from({ length: 14 }, () => [R(-9, 9), R(-5, 5)])); } while (P.length < 6);
  const q = Math.random() < 0.6 ? [R(-4, 4), R(-3, 3)] : [R(-10, 10), R(-6, 6)], n = P.length, c = (o, a, b) => cross(o, a, b);
  push('Polígono de ' + n + ' vértices (antihorario) y el punto Q (amarillo).', { P, q, lo: -1, hi: -1, res: null });
  if (c(P[0], P[1], q) <= 0 || c(P[0], P[n - 1], q) >= 0) { push('Q queda fuera del abanico visto desde el vértice 1: está afuera (o en el borde).', { P, q, lo: -1, hi: -1, res: false }); return; }
  let lo = 1, hi = n - 1; push('Q está entre los rayos 1→2 y 1→' + n + '. Búsqueda binaria en [' + (lo + 1) + ', ' + (hi + 1) + '].', { P, q, lo, hi, res: null });
  while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (c(P[0], P[mid], q) > 0) lo = mid; else hi = mid; push('Rayo 1→' + (mid + 1) + ': Q está ' + (lo === mid ? 'a su izquierda, lo = ' + (mid + 1) : 'a su derecha (o encima), hi = ' + (mid + 1)) + '.', { P, q, lo, hi, res: null }); }
  const ok = c(P[lo], P[lo + 1], q) > 0; push('Triángulo 1, ' + (lo + 1) + ', ' + (lo + 2) + '. Contra la arista ' + (lo + 1) + '→' + (lo + 2) + ' Q está ' + (ok ? 'a la izquierda: DENTRO.' : 'a la derecha o encima: FUERA (o en el borde).'), { P, q, lo, hi: lo + 1, res: ok });
}, s => { let g = gridBg() + poly(s.P, '#1f6feb18', '#1f6feb'); for (let i = 2; i < s.P.length - 1; i++) g += seg(s.P[0], s.P[i], '#1f6feb55', 1, true);
  if (s.lo >= 0) g += poly([s.P[0], s.P[s.lo], s.P[s.hi]], s.res === null ? '#d4a72c33' : s.res ? '#2da44e55' : '#cf222e44', '#d4a72c');
  s.P.forEach((p, i) => g += dot(p, '#1f6feb', 4, '' + (i + 1))); return svgBox(g + dot(s.q, s.res === false ? '#cf222e' : s.res ? '#2da44e' : '#d4a72c', 7, 'Q'), G0.W, G0.H); });


// =================== Lecciones de finales (fase B) ===================
// ---- álgebra lineal (ejemplos con un primo pequeño para que los números se lean) ----
const modp = (x, p) => ((x % p) + p) % p;
const invp = (a, p) => { let r = 1, b = modp(a, p), e = p - 2; while (e) { if (e & 1) r = r * b % p; b = b * b % p; e >>= 1; } return r; };
V('FunctionalTools-Linear-Algebra-GaussMod', 'Gauss-Jordan módulo 7', 'Para que los números se lean, el ejemplo usa módulo 7 (el código usa 10⁹ + 7). Amarillo = pivote; azul = fila que se modifica.', push => {
  const p = 7, n = 3, m = 3, x = Array.from({ length: m }, () => R(0, 6));
  const A = Array.from({ length: n }, () => { const r = Array.from({ length: m }, () => R(0, 6)); r.push(modp(r.reduce((s, v, j) => s + v * x[j], 0), p)); return r; });
  const st = (pr, pc, mod) => ({ A, pr, pc, mod });
  push('Sistema de ' + n + ' ecuaciones (última columna = término independiente). Hay al menos una solución: x = (' + x.join(', ') + ').', st(-1, -1, -1));
  let row = 0; const piv = [];
  for (let c = 0; c < m && row < n; c++) {
    const r = A.findIndex((rw, i) => i >= row && rw[c] % p);
    if (r < 0) { push('Columna ' + (c + 1) + ': no hay pivote; x' + (c + 1) + ' queda libre (se pone en 0).', st(-1, c, -1)); continue; }
    [A[row], A[r]] = [A[r], A[row]];
    const iv = invp(A[row][c], p); push('Columna ' + (c + 1) + ': pivote ' + A[row][c] + ' (fila ' + (row + 1) + '). Su inverso módulo 7 es ' + iv + '.', st(row, c, -1));
    for (let j = 0; j <= m; j++) A[row][j] = A[row][j] * iv % p;
    push('Se multiplica la fila por ' + iv + ': el pivote queda en 1.', st(row, c, row));
    for (let i = 0; i < n; i++) if (i !== row && A[i][c]) { const f = A[i][c]; for (let j = 0; j <= m; j++) A[i][j] = modp(A[i][j] - f * A[row][j], p); push('Fila ' + (i + 1) + ' −= ' + f + ' · fila ' + (row + 1) + ': se anula la columna ' + (c + 1) + '.', st(row, c, i)); }
    piv.push([row, c]); row++;
  }
  const sol = Array(m).fill(0); piv.forEach(([r, c]) => sol[c] = A[r][m]);
  push('Cada fila con pivote da su variable: x = (' + sol.join(', ') + ') módulo 7.', st(-1, -1, -1));
}, s => table(s.A, s.A.map((r, i) => r.map((_, j) => i === s.pr && j === s.pc ? 'a' : i === s.mod ? 'b' : j === r.length - 1 ? 'g' : '')), s.A.map((_, i) => 'ec. ' + (i + 1)), ['x1', 'x2', 'x3', 'b']));

V('FunctionalTools-Linear-Algebra-XorBasis', 'Base xor de números de 5 bits', 'Cada fila de la base tiene un bit más alto distinto. Amarillo = número que se inserta; verde = representante usado.', push => {
  const B = 5, a = Array.from({ length: 6 }, () => R(1, 31)), base = Array(B).fill(0);
  const bin = v => v.toString(2).padStart(B, '0').split('');
  const st = (cur, hl, res) => ({ base: base.slice(), cur, hl, res });
  push('Números: ' + a.join(', ') + '. La base empieza vacía.', st(null, -1, null));
  for (const v0 of a) { let v = v0;
    for (let b = B - 1; b >= 0; b--) { if (!(v >> b & 1)) continue;
      if (base[b]) { push('Insertar ' + v0 + ': tiene el bit ' + b + ' y ya hay representante ' + base[b] + ' → ' + v + ' xor ' + base[b] + ' = ' + (v ^ base[b]) + '.', st(v, b, null)); v ^= base[b]; }
      else { base[b] = v; push('Insertar ' + v0 + ': el bit ' + b + ' no tiene representante; ' + v + ' queda en la base.', st(v, b, null)); v = -1; break; } }
    if (v === 0) push(v0 + ' se redujo a 0: ya se podía formar con la base (no aporta nada).', st(0, -1, null)); }
  let res = 0; for (let b = B - 1; b >= 0; b--) if (base[b] && (res ^ base[b]) > res) { res ^= base[b]; push('Máximo: usar el representante del bit ' + b + ' mejora → ' + res + '.', st(null, b, res)); }
  push('El máximo xor de un subconjunto es ' + res + ' (' + res.toString(2) + ' en binario).', st(null, -1, res));
}, s => table(s.base.map((v, b) => [b].concat(v ? s.base[b].toString(2).padStart(5, '0').split('') : ['', '', '', '', '']).concat([v || '—'])).reverse(), s.base.map((v, b) => Array(7).fill(b === s.hl ? 'g' : v ? '' : '')).reverse(), null, ['bit', '16', '8', '4', '2', '1', 'valor'])
  + (s.cur !== null ? '<p class="note">Número actual: <b>' + s.cur + '</b> = ' + s.cur.toString(2).padStart(5, '0') + '</p>' : '') + (s.res !== null ? '<p class="note">Resultado parcial: <b>' + s.res + '</b></p>' : ''));

V('FunctionalTools-Linear-Algebra-Determinant', 'Determinante por eliminación (módulo 7)', 'Amarillo = pivote. Cada intercambio de filas cambia el signo; el determinante es el producto de la diagonal.', push => {
  const p = 7, n = 3, A = Array.from({ length: n }, () => Array.from({ length: n }, () => R(0, 6)));
  let det = 1, sign = 1;
  const st = (pr, pc) => ({ A, pr, pc, det, sign });
  push('Matriz 3 × 3 con entradas módulo 7.', st(-1, -1));
  for (let c = 0; c < n; c++) {
    const r = A.findIndex((rw, i) => i >= c && rw[c]);
    if (r < 0) { det = 0; push('La columna ' + (c + 1) + ' no tiene pivote: el determinante es 0.', st(-1, c)); return; }
    if (r !== c) { [A[c], A[r]] = [A[r], A[c]]; sign = -sign; push('Se intercambian las filas ' + (c + 1) + ' y ' + (r + 1) + ': el signo pasa a ' + (sign > 0 ? '+' : '−') + '.', st(c, c)); }
    det = det * A[c][c] % p; push('Pivote ' + A[c][c] + ': producto acumulado = ' + det + '.', st(c, c));
    const iv = invp(A[c][c], p);
    for (let i = c + 1; i < n; i++) if (A[i][c]) { const f = A[i][c] * iv % p; for (let j = c; j < n; j++) A[i][j] = modp(A[i][j] - f * A[c][j], p); push('Fila ' + (i + 1) + ' −= ' + f + ' · fila ' + (c + 1) + ' (no cambia el determinante).', st(c, c)); }
  }
  det = modp(sign * det, p); push('Determinante = ' + (sign > 0 ? '' : '−') + 'producto de la diagonal = ' + det + ' (módulo 7).', st(-1, -1));
}, s => table(s.A, s.A.map((r, i) => r.map((_, j) => i === s.pr && j === s.pc ? 'a' : i === j ? 'g' : j < i ? 'b' : ''))) + '<p class="note">Signo: ' + (s.sign > 0 ? '+' : '−') + ' · producto: ' + s.det + '</p>');

V('FunctionalTools-Linear-Algebra-Simplex', 'Símplex en 2 variables', 'La región gris es factible. El símplex salta de vértice en vértice (amarillo) mientras el objetivo mejore.', push => {
  let cons, verts;
  for (let t = 0; t < 50; t++) {
    cons = Array.from({ length: 3 }, () => { const a = R(1, 4), b = R(1, 4); return [a, b, a * R(2, 6) + b * R(1, 4)]; });
    const lines = cons.concat([[-1, 0, 0], [0, -1, 0]]), pts = [];
    for (let i = 0; i < lines.length; i++) for (let j = i + 1; j < lines.length; j++) {
      const [a1, b1, c1] = lines[i], [a2, b2, c2] = lines[j], d = a1 * b2 - a2 * b1; if (!d) continue;
      const x = (c1 * b2 - c2 * b1) / d, y = (a1 * c2 - a2 * c1) / d;
      if (lines.every(([a, b, c]) => a * x + b * y <= c + 1e-9)) pts.push([x, y]); }
    verts = pts.filter((q, i) => pts.findIndex(r => Math.abs(r[0] - q[0]) + Math.abs(r[1] - q[1]) < 1e-9) === i);
    if (verts.length >= 4) break; }
  const cx = verts.reduce((s, q) => s + q[0], 0) / verts.length, cy = verts.reduce((s, q) => s + q[1], 0) / verts.length;
  verts.sort((a, b) => Math.atan2(a[1] - cy, a[0] - cx) - Math.atan2(b[1] - cy, b[0] - cx));
  const c = [R(1, 5), R(1, 5)], val = q => c[0] * q[0] + c[1] * q[1];
  let k = verts.findIndex(q => Math.abs(q[0]) + Math.abs(q[1]) < 1e-9); const path = [k];
  const st = () => ({ cons, verts, path: path.slice(), c });
  push('Maximizar ' + c[0] + 'x + ' + c[1] + 'y. Se empieza en el origen, que es un vértice factible.', st());
  while (true) { const n = verts.length, nb = [(k + 1) % n, (k + n - 1) % n].filter(j => val(verts[j]) > val(verts[k]) + 1e-9);
    if (!nb.length) break; const j = nb.sort((a, b) => val(verts[b]) - val(verts[a]))[0];
    push('Desde (' + verts[k].map(f3).join(', ') + ') con valor ' + f3(val(verts[k])) + ', el vecino (' + verts[j].map(f3).join(', ') + ') vale ' + f3(val(verts[j])) + ': se pivotea.', (path.push(j), k = j, st())); }
  push('Ningún vecino mejora: el óptimo es ' + f3(val(verts[k])) + ' en (' + verts[k].map(f3).join(', ') + ').', st());
}, s => { const mx = Math.max(...s.verts.map(q => Math.max(q[0], q[1])), 1), sc = 240 / mx, P = q => [40 + q[0] * sc, 270 - q[1] * sc];
  let g = '<line x1="40" y1="270" x2="520" y2="270" stroke="#888"/><line x1="40" y1="270" x2="40" y2="10" stroke="#888"/>';
  g += '<polygon points="' + s.verts.map(q => P(q).join(',')).join(' ') + '" fill="#8884" stroke="#888"/>';
  s.cons.forEach(([a, b, c], i) => { const A = P([c / a, 0]), B = P([0, c / b]); g += '<line x1="' + A[0] + '" y1="' + A[1] + '" x2="' + B[0] + '" y2="' + B[1] + '" stroke="' + COL.b + '" stroke-dasharray="4 3"/>'; });
  for (let i = 1; i < s.path.length; i++) { const A = P(s.verts[s.path[i - 1]]), B = P(s.verts[s.path[i]]); g += '<line x1="' + A[0] + '" y1="' + A[1] + '" x2="' + B[0] + '" y2="' + B[1] + '" stroke="' + COL.a + '" stroke-width="4"/>'; }
  s.verts.forEach((q, i) => { const A = P(q); g += '<circle cx="' + A[0] + '" cy="' + A[1] + '" r="' + (i === s.path[s.path.length - 1] ? 7 : 4) + '" fill="' + (i === s.path[s.path.length - 1] ? COL.a : '#666') + '"/>'; });
  return svgBox(g, 540, 290); });

// ---- combinatoria y teoría de números ----
V('FunctionalTools-Combinatorics-Lucas', 'Teorema de Lucas', 'n y k se escriben en base p; el binomial es el producto de los binomiales dígito a dígito.', push => {
  const p = pick([3, 5, 7]), n = R(p * p, p * p * p), k = R(0, n);
  const dig = v => { const d = []; while (v) { d.push(v % p); v = Math.floor(v / p); } return d; };
  const C = (a, b) => { if (b > a) return 0; let r = 1; for (let i = 0; i < b; i++) r = r * (a - i) / (i + 1); return r; };
  const dn = dig(n), dk = dig(k); while (dk.length < dn.length) dk.push(0);
  let res = 1; const parts = [];
  push('C(' + n + ', ' + k + ') módulo ' + p + '. En base ' + p + ': n = ' + dn.slice().reverse().join('') + ', k = ' + dk.slice().reverse().join('') + '.', { dn, dk, i: -1, parts: [], res });
  for (let i = 0; i < dn.length; i++) { const c = C(dn[i], dk[i]) % p; res = res * c % p; parts.push(c);
    push('Dígito ' + i + ': C(' + dn[i] + ', ' + dk[i] + ') = ' + C(dn[i], dk[i]) + (dk[i] > dn[i] ? ' (k_i > n_i)' : '') + ' ≡ ' + c + '. Producto = ' + res + '.', { dn, dk, i, parts: parts.slice(), res }); }
  push('C(' + n + ', ' + k + ') ≡ ' + res + ' (mód ' + p + ').', { dn, dk, i: -1, parts, res });
}, s => rows([{ t: 'posición', v: s.dn.map((_, i) => 'p^' + i) }, { t: 'n_i', v: s.dn, c: s.dn.map((_, i) => i === s.i ? 'a' : '') }, { t: 'k_i', v: s.dk, c: s.dk.map((_, i) => i === s.i ? 'a' : '') }, { t: 'C(n_i, k_i)', v: s.dn.map((_, i) => i < s.parts.length ? s.parts[i] : null), c: s.dn.map((_, i) => i < s.parts.length ? (s.parts[i] ? 'g' : 'r') : '') }]));

V('FunctionalTools-Combinatorics-Mobius', 'Pares coprimos con Möbius', 'Para cada d: μ(d) · (pares con d dividiendo a ambos). Verde suma, rojo resta, gris μ = 0.', push => {
  const a = Array.from({ length: 6 }, () => R(2, 12)), V0 = 12;
  const mu = Array(V0 + 1).fill(1); mu[0] = 0; for (let i = 2; i <= V0; i++) { let x = i, c = 0, sq = false; for (let q = 2; q * q <= x; q++) if (x % q === 0) { x /= q; c++; if (x % q === 0) sq = true; while (x % q === 0) x /= q; } if (x > 1) c++; mu[i] = sq ? 0 : (c % 2 ? -1 : 1); }
  const ds = [], cnt = [], ct = []; let tot = 0;
  push('Números: ' + a.join(', ') + '. Se recorre d = 1 … ' + V0 + '.', { ds: [], mu: [], cnt: [], ct: [], tot, cur: -1 });
  for (let d = 1; d <= V0; d++) { const c = a.filter(x => x % d === 0).length, pr = c * (c - 1) / 2; ds.push(d); cnt.push(c); ct.push(mu[d] * pr); tot += mu[d] * pr;
    if (c >= 2 || d === 1) push('d = ' + d + ': μ = ' + mu[d] + ', ' + c + ' múltiplos → ' + pr + ' pares; aporte ' + mu[d] * pr + '. Total = ' + tot + '.', { ds: ds.slice(), mu: ds.map(x => mu[x]), cnt: cnt.slice(), ct: ct.slice(), tot, cur: ds.length - 1 }); }
  push('Hay ' + tot + ' pares coprimos.', { ds, mu: ds.map(x => mu[x]), cnt, ct, tot, cur: -1 });
}, s => rows([{ t: 'd', v: s.ds }, { t: 'μ(d)', v: s.mu }, { t: 'múltiplos', v: s.cnt }, { t: 'aporte', v: s.ct, c: s.ct.map((x, i) => i === s.cur ? 'a' : s.mu[i] === 0 ? '' : x > 0 ? 'g' : x < 0 ? 'r' : '') }]) + '<p class="note">Total: <b>' + s.tot + '</b></p>');

V('FunctionalTools-Combinatorics-Burnside', 'Collares con Burnside', 'Rotar k posiciones deja fijas las coloraciones constantes en cada uno de sus gcd(k, n) ciclos.', push => {
  const n = R(4, 8), m = R(2, 3), gcd = (a, b) => b ? gcd(b, a % b) : a; let sum = 0; const fx = [];
  push('Collares de ' + n + ' perlas con ' + m + ' colores. Hay ' + n + ' rotaciones.', { n, k: -1, fx: [], sum, m });
  for (let k = 0; k < n; k++) { const g = gcd(k, n), f = m ** g; sum += f; fx.push(f);
    push('Rotar ' + k + ': ' + g + ' ciclos (colores en la imagen) → ' + m + '^' + g + ' = ' + f + ' coloraciones fijas. Suma = ' + sum + '.', { n, k, fx: fx.slice(), sum, m }); }
  push('Collares distintos = ' + sum + ' / ' + n + ' = ' + sum / n + '.', { n, k: -1, fx, sum, m });
}, s => { const g = (a, b) => b ? g(b, a % b) : a, cyc = s.k >= 0 ? g(s.k, s.n) : 0, cols = ['#2da44e', '#1f6feb', '#d4a72c', '#cf222e', '#8250df', '#fb8f44', '#57606a', '#0aa'];
  let h = ''; for (let i = 0; i < s.n; i++) { const t = 2 * Math.PI * i / s.n - Math.PI / 2, x = 130 + 85 * Math.cos(t), y = 120 + 85 * Math.sin(t); h += '<circle cx="' + x + '" cy="' + y + '" r="16" fill="' + (s.k >= 0 ? cols[i % cyc] : 'var(--card)') + '" stroke="#666"/>' + txt(x, y + 4, i, { c: s.k >= 0 ? '#fff' : 'currentColor' }); }
  if (s.k >= 0) h += txt(130, 124, 'k = ' + s.k, { b: 1 });
  return svgBox(h, 270, 240) + rows([{ t: 'rotación', v: s.fx.map((_, i) => i) }, { t: 'fijas', v: s.fx, c: s.fx.map((_, i) => i === s.k ? 'a' : 'g') }]); });

V('FunctionalTools-Number-Theory-DiscreteLog', 'Baby-step giant-step', 'Pasos de bebé: Y·X^j en una tabla. Pasos de gigante: (X^s)^i hasta encontrar uno igual.', push => {
  const ps = [23, 29, 31, 37, 41, 43, 47], M = pick(ps), X = R(2, M - 1), K = R(3, M - 2); let Y = 1; for (let i = 0; i < K; i++) Y = Y * X % M;
  const s = Math.ceil(Math.sqrt(M)), baby = []; let cur = Y;
  push('Buscar K con ' + X + '^K ≡ ' + Y + ' (mód ' + M + '). s = ⌈√' + M + '⌉ = ' + s + '.', { baby: [], giant: [], hit: -1, s });
  for (let j = 0; j < s; j++) { baby.push([j, cur]); cur = cur * X % M; }
  push('Pasos de bebé: Y·X^j para j = 0 … ' + (s - 1) + '.', { baby, giant: [], hit: -1, s });
  let Xs = 1; for (let i = 0; i < s; i++) Xs = Xs * X % M;
  const giant = []; let g = 1;
  for (let i = 1; i <= s + 1; i++) { g = g * Xs % M; giant.push([i, g]); const jj = baby.filter(b => b[1] === g).map(b => b[0]); 
    if (jj.length) { const j = Math.max(...jj); push('Gigante i = ' + i + ': (X^s)^i = ' + g + ' coincide con j = ' + j + ' → K = i·s − j = ' + (i * s - j) + '.', { baby, giant: giant.slice(), hit: g, s }); return; }
    push('Gigante i = ' + i + ': (X^s)^i = ' + g + ' no está en la tabla.', { baby, giant: giant.slice(), hit: -1, s }); }
}, s => rows([{ t: 'j', v: s.baby.map(b => b[0]) }, { t: 'Y·X^j', v: s.baby.map(b => b[1]), c: s.baby.map(b => b[1] === s.hit ? 'g' : 'b') }, { t: 'i', v: s.giant.map(b => b[0]) }, { t: '(X^s)^i', v: s.giant.map(b => b[1]), c: s.giant.map(b => b[1] === s.hit ? 'g' : 'a') }]));

V('FunctionalTools-Polynomials-Lagrange', 'Interpolación de Lagrange', 'Con los valores en x = 0 … d se evalúa el polinomio en cualquier x sin conocer sus coeficientes.', push => {
  const kk = R(1, 2), d = kk + 1, n = R(8, 15), P = x => { let s = 0; for (let i = 1; i <= x; i++) s += i ** kk; return s; };
  const ys = Array.from({ length: d + 1 }, (_, i) => P(i));
  push('S(x) = 1^' + kk + ' + … + x^' + kk + ' es un polinomio de grado ' + d + '. Se calculan S(0) … S(' + d + ') a mano.', { ys, terms: [], n, tot: null, cur: -1 });
  let tot = 0; const terms = [];
  for (let i = 0; i <= d; i++) { let num = 1, den = 1; for (let j = 0; j <= d; j++) if (j !== i) { num *= n - j; den *= i - j; } const t = ys[i] * num / den; tot += t; terms.push(t);
    push('Término ' + i + ': S(' + i + ') · Π(' + n + ' − j)/(' + i + ' − j) = ' + ys[i] + ' · ' + num + ' / ' + den + ' = ' + t + '.', { ys, terms: terms.slice(), n, tot: null, cur: i }); }
  push('Suma de los términos: S(' + n + ') = ' + Math.round(tot) + ' (comprobación directa: ' + P(n) + ').', { ys, terms, n, tot: Math.round(tot), cur: -1 });
}, s => rows([{ t: 'x', v: s.ys.map((_, i) => i) }, { t: 'S(x)', v: s.ys, c: s.ys.map((_, i) => i === s.cur ? 'a' : 'g') }, { t: 'término', v: s.ys.map((_, i) => i < s.terms.length ? f3(s.terms[i]) : null), c: s.ys.map((_, i) => i === s.cur ? 'a' : '') }]) + (s.tot !== null ? '<p class="note">S(' + s.n + ') = <b>' + s.tot + '</b></p>' : ''));

V('FunctionalTools-Polynomials-BerlekampMassey', 'Berlekamp-Massey (módulo 97)', 'Se procesa término a término. Si la recurrencia actual falla (discrepancia ≠ 0), se corrige con la última que falló.', push => {
  const p = 97, c1 = R(1, 9), c2 = R(1, 9), a = [R(1, 9), R(1, 9)]; while (a.length < 8) a.push((c1 * a[a.length - 1] + c2 * a[a.length - 2]) % p);
  let C = [1], B = [1], L = 0, m = 1, b = 1;
  const show = (i, dd) => ({ a, i, C: C.slice(1).map(x => modp(-x, p)), L, dd });
  push('Secuencia generada por a_i = ' + c1 + '·a_{i−1} + ' + c2 + '·a_{i−2} (mód 97). El algoritmo no lo sabe.', show(-1, null));
  for (let i = 0; i < a.length; i++) {
    let d = a[i]; for (let j = 1; j <= L; j++) d = modp(d + C[j] * a[i - j], p);
    if (d === 0) { m++; push('a_' + i + ' = ' + a[i] + ': la recurrencia actual lo predice (discrepancia 0).', show(i, 0)); continue; }
    const T = C.slice(), coef = d * invp(b, p) % p; while (C.length < B.length + m) C.push(0);
    for (let j = 0; j < B.length; j++) C[j + m] = modp(C[j + m] - coef * B[j], p);
    if (2 * L <= i) { L = i + 1 - L; B = T; b = d; m = 1; } else m++;
    while (C.length > L + 1) C.pop();
    push('a_' + i + ' = ' + a[i] + ': discrepancia ' + d + '. Se corrige; ahora la recurrencia tiene largo ' + L + '.', show(i, d));
  }
  push('Recurrencia encontrada: a_i = ' + C.slice(1).map((x, j) => modp(-x, p) + '·a_{i−' + (j + 1) + '}').join(' + ') + '.', show(-1, null));
}, s => rows([{ t: 'i', v: s.a.map((_, i) => i) }, { t: 'a_i', v: s.a, c: s.a.map((_, i) => i === s.i ? (s.dd ? 'r' : 'g') : i < s.i ? 'g' : '') }, { t: 'coeficientes', v: s.C.length ? s.C : [null], c: s.C.map(() => 'b') }]) + '<p class="note">Largo L = ' + s.L + '</p>');

V('FunctionalTools-Polynomials-NTTAnyMod', 'Convolución con tres primos', 'Cada coeficiente se calcula módulo tres primos NTT; con sus restos se recupera el valor exacto y se reduce módulo 10⁹ + 7.', push => {
  const P = [998244353n, 167772161n, 469762049n], MOD = 1000000007n;
  const a = Array.from({ length: 3 }, () => BigInt(R(1e8, 1e9))), b = Array.from({ length: 3 }, () => BigInt(R(1e8, 1e9)));
  const c = Array(5).fill(0n); a.forEach((x, i) => b.forEach((y, j) => c[i + j] += x * y));
  const st = (k, r) => ({ a: a.map(String), b: b.map(String), c: c.map(String), k, r });
  push('Los coeficientes reales llegan a ~10¹⁸: no caben en un solo primo NTT (≈ 10⁹).', st(-1, null));
  for (let k = 0; k < 5; k++) { const r = P.map(p => (c[k] % p).toString()); push('c_' + k + ': restos ' + r.join(', ') + ' → chino del resto → ' + c[k] + ' → módulo 10⁹ + 7 = ' + (c[k] % MOD) + '.', st(k, r)); }
  push('El producto de los tres primos (~7.8·10²⁶) supera cualquier coeficiente, así que la reconstrucción es exacta.', st(-1, null));
}, s => rows([{ t: 'a', v: s.a }, { t: 'b', v: s.b }, { t: 'c (exacto)', v: s.c, c: s.c.map((_, i) => i === s.k ? 'a' : '') }]) + (s.r ? '<p class="note">mód 998244353 = ' + s.r[0] + ' · mód 167772161 = ' + s.r[1] + ' · mód 469762049 = ' + s.r[2] + '</p>' : ''));
// ---- estructuras y técnicas offline ----
V('Data-Structures-Offline-DynamicConnectivity', 'Conectividad dinámica offline', 'Cada arista vive en un intervalo de tiempo (filas). El DFS sobre el árbol del tiempo une al entrar a un nodo (amarillo) y deshace al salir.', push => {
  const n = 5, T = 6, E = []; const used = new Set();
  while (E.length < 4) { const a = R(1, n), b = R(1, n); if (a === b || used.has(Math.min(a, b) + '-' + Math.max(a, b))) continue; used.add(Math.min(a, b) + '-' + Math.max(a, b)); const l = R(0, T - 2); E.push({ a, b, l, r: R(l, T - 1) }); }
  const par = [...Array(n + 1).keys()], hist = []; let comps = n; const res = Array(T).fill(null);
  const find = x => { while (par[x] !== x) x = par[x]; return x; };
  const seg = {}; const add = (u, l, r, e) => { if (e.r < l || r < e.l) return; if (e.l <= l && r <= e.r) { (seg[u] = seg[u] || []).push(e); return; } const m = (l + r) >> 1; add(2 * u, l, m, e); add(2 * u + 1, m + 1, r, e); };
  E.forEach(e => add(1, 0, T - 1, e));
  const st = (l, r) => ({ E, T, l, r, res: res.slice(), comps });
  push('Cada arista existe durante un intervalo de tiempo. Se cuelga de los nodos del árbol del tiempo que cubren su intervalo.', st(-1, -1));
  const dfs = (u, l, r) => { const mark = hist.length, es = seg[u] || [];
    for (const e of es) { const x = find(e.a), y = find(e.b); if (x !== y) { par[y] = x; hist.push(y); comps--; } }
    push('Nodo [' + l + ', ' + r + ']' + (es.length ? ': se unen ' + es.map(e => e.a + '–' + e.b).join(', ') : ': sin aristas propias') + '. Componentes: ' + comps + '.', st(l, r));
    if (l === r) res[l] = comps; else { const m = (l + r) >> 1; dfs(2 * u, l, m); dfs(2 * u + 1, m + 1, r); }
    if (hist.length > mark) { while (hist.length > mark) { const y = hist.pop(); par[y] = y; comps++; } push('Se sale de [' + l + ', ' + r + ']: se deshacen sus uniones (componentes = ' + comps + ').', st(l, r)); } };
  dfs(1, 0, T - 1);
  push('Componentes en cada instante: ' + res.join(', ') + '.', st(-1, -1));
}, s => rows(s.E.map(e => ({ t: 'arista ' + e.a + '–' + e.b, v: [...Array(s.T).keys()].map(t => t >= e.l && t <= e.r ? '■' : ''), c: [...Array(s.T).keys()].map(t => t >= s.l && t <= s.r ? (t >= e.l && t <= e.r ? 'a' : 'b') : (t >= e.l && t <= e.r ? 'g' : '')) })).concat([{ t: 'tiempo', v: [...Array(s.T).keys()] }, { t: 'componentes', v: s.res, c: s.res.map(x => x === null ? '' : 'g') }])));

V('Data-Structures-Offline-CDQ', 'CDQ: dominancia en 3D', 'Puntos ordenados por a. En cada mezcla, los de la izquierda (azul) entran al Fenwick por c y los de la derecha (amarillo) consultan.', push => {
  const n = 8; let P = Array.from({ length: n }, (_, i) => ({ id: i, a: R(1, 6), b: R(1, 6), c: R(1, 6), ans: 0 }));
  P.sort((x, y) => x.a - y.a || x.b - y.b || x.c - y.c); P.forEach((p, i) => p.id = i + 1);
  // para la visual se evitan repetidos exactos
  const st = (l, m, r) => ({ P: clone(P), l, m, r });
  push('Puntos ordenados por a (la primera dimensión ya está resuelta por el orden).', st(-1, -1, -1));
  const rec = (l, r) => { if (r - l <= 1) return; const m = (l + r) >> 1; rec(l, m); rec(m, r);
    const L = P.slice(l, m), Rr = P.slice(m, r), out = []; let i = 0; const bit = [];
    for (const q of Rr) { while (i < L.length && L[i].b <= q.b) { bit.push(L[i].c); out.push(L[i++]); } q.ans += bit.filter(c => c <= q.c).length; out.push(q); }
    while (i < L.length) out.push(L[i++]);
    for (let t = 0; t < out.length; t++) P[l + t] = out[t];
    push('Mezcla [' + (l + 1) + ', ' + m + '] con [' + (m + 1) + ', ' + r + ']: cada punto derecho suma los izquierdos con b y c menores o iguales. Queda ordenado por b.', st(l, m, r)); };
  rec(0, n);
  push('ans = cuántos puntos dominan a cada uno (con a, b, c ≤).', st(-1, -1, -1));
}, s => table(s.P.map(p => ['#' + p.id, p.a, p.b, p.c, p.ans]), s.P.map((_, i) => Array(5).fill(i >= s.l && i < s.m ? 'b' : i >= s.m && i < s.r ? 'a' : '')), null, ['punto', 'a', 'b', 'c', 'domina a']));

V('Data-Structures-Offline-ParallelBinarySearch', 'Búsqueda binaria paralela', 'En cada ronda, todas las consultas se revisan en una sola pasada por las operaciones. Amarillo = rango [lo, hi] actual.', push => {
  const K = 8, add = Array.from({ length: K }, () => R(1, 4)), Q = Array.from({ length: 4 }, () => R(3, 22));
  const lo = Q.map(() => 1), hi = Q.map(() => K + 1); let ronda = 0;
  const pref = add.reduce((a, x) => (a.push(a[a.length - 1] + x), a), [0]);
  const st = () => ({ K, add, Q, lo: lo.slice(), hi: hi.slice(), ronda });
  push('Operación t suma ' + add.join(', ') + '. Cada consulta busca el primer t con total ≥ su meta.', st());
  while (lo.some((x, i) => x < hi[i])) { ronda++;
    for (let i = 0; i < Q.length; i++) if (lo[i] < hi[i]) { const m = (lo[i] + hi[i]) >> 1; if (pref[m] >= Q[i]) hi[i] = m; else lo[i] = m + 1; }
    push('Ronda ' + ronda + ': una pasada por las ' + K + ' operaciones; cada consulta mira su punto medio y achica su rango.', st()); }
  push('Respuestas: ' + lo.map(x => x > K ? 'nunca' : x).join(', ') + ' (en ' + ronda + ' rondas en lugar de una simulación por consulta).', st());
}, s => rows([{ t: 't', v: [...Array(s.K).keys()].map(i => i + 1) }, { t: 'suma', v: s.add }].concat(s.Q.map((q, i) => ({ t: 'meta ' + q, v: [...Array(s.K).keys()].map(t => t + 1 === s.lo[i] && s.lo[i] === s.hi[i] ? '✓' : ''), c: [...Array(s.K).keys()].map(t => t + 1 >= s.lo[i] && t + 1 <= Math.min(s.hi[i], s.K) ? (s.lo[i] === s.hi[i] ? 'g' : 'a') : '') })))));

V('Data-Structures-Algorithms-SegmentTreeBeats', 'Segment Tree Beats: chmin', 'Cada nodo muestra máximo / segundo máximo. Verde = se aplica la marca en O(1); rojo = hay que bajar (beats).', push => {
  const n = 8, a = Array.from({ length: n }, () => R(1, 9)), T = [];
  const build = (u, l, r) => { T[u] = { l, r }; if (l < r) { const m = (l + r) >> 1; build(2 * u, l, m); build(2 * u + 1, m + 1, r); } };
  build(1, 0, n - 1);
  const info = u => { const v = a.slice(T[u].l, T[u].r + 1), m1 = Math.max(...v), m2 = Math.max(-1, ...v.filter(x => x < m1)); return [m1, m2]; };
  const st = (col, q) => ({ a: a.slice(), T, info: T.map((_, u) => u ? info(u) : null), col, q });
  push('Arreglo inicial: ' + a.join(', ') + '.', st({}, null));
  for (let it = 0; it < 3; it++) { const x = R(0, n - 2), y = R(x + 1, n - 1), t = R(2, 7), col = {};
    const go = u => { const [m1, m2] = info(u); if (T[u].r < x || y < T[u].l || m1 <= t) return; if (x <= T[u].l && T[u].r <= y && m2 < t) { col[u] = 'g'; return; } col[u] = 'r'; if (T[u].l < T[u].r) { go(2 * u); go(2 * u + 1); } };
    go(1); push('chmin(' + (x + 1) + '…' + (y + 1) + ', ' + t + '): verde = solo cambian los máximos del nodo; rojo = segundo máximo ≥ ' + t + ', se baja.', st(col, [x, y, t]));
    for (let i = x; i <= y; i++) a[i] = Math.min(a[i], t);
    push('Resultado: ' + a.join(', ') + '.', st({}, [x, y, t])); }
}, s => { const nodes = [], edges = []; for (let u = 1; u < s.T.length; u++) { if (!s.T[u]) continue; const d = Math.floor(Math.log2(u)), k = u - (1 << d), W = 540, cnt = 1 << d; nodes[u - 1] = { x: Math.round(W * (k + 0.5) / cnt), y: 30 + d * 60, l: s.info[u][0] + '/' + (s.info[u][1] < 0 ? '–' : s.info[u][1]), c: s.col[u] }; if (u > 1) edges.push({ a: (u >> 1) - 1, b: u - 1 }); }
  return graph({ nodes: nodes.map(v => v || { hide: true, x: 0, y: 0, l: '' }), edges, H: 230 }) + rows([{ t: 'a', v: s.a, c: s.a.map((_, i) => s.q && i >= s.q[0] && i <= s.q[1] ? 'a' : '') }]); });

V('Data-Structures-Algorithms-LinkCutTree', 'Caminos preferidos de un link-cut tree', 'Cada color es un camino preferido (en el código, un splay tree). access(v) hace que el camino de la raíz llegue justo hasta v.', push => {
  const n = 9, { T, E } = treeState(n), pref = Array(n).fill(-1), s = GS(T.xy, E);
  const paint = hl => { const col = Array(n).fill(''), ec = E.map(() => 'x'); let c = 0; const cols = ['b', 'g', 'o', 'p', 'r', 'a', 'k'];
    for (let v = 0; v < n; v++) if (v === 0 || pref[T.par[v]] !== v) { const cc = cols[c++ % cols.length]; for (let x = v; x !== -1; x = pref[x]) { col[x] = cc; if (pref[x] >= 0) ec[pref[x] - 1] = cc; } }
    s.nc = col; s.ec = ec; s.ring = hl; };
  paint(-1); push('Al principio cada vértice es su propio camino preferido.', s);
  for (let it = 0; it < 4; it++) { const v = R(1, n - 1); pref[v] = -1; let changes = 0;
    for (let x = v; T.par[x] !== -1; x = T.par[x]) { if (pref[T.par[x]] !== x) changes++; pref[T.par[x]] = x; }
    paint(v); push('access(' + (v + 1) + '): el camino desde la raíz hasta ' + (v + 1) + ' queda en un solo color (' + pl(changes, 'cambio', 'cambios') + ' de camino preferido; amortizado O(log n)).', s); }
  push('Con el camino raíz → v en un solo splay tree, su suma o máximo está en la raíz del splay. link y cut se arman con access y makeRoot.', s);
}, GR);

V('Data-Structures-Algorithms-WaveletTree', 'Wavelet tree: k-ésimo menor en un rango', 'Cada nivel separa valores bajos (0, a la izquierda) y altos (1). Amarillo = el rango que se sigue al bajar.', push => {
  const n = 8, a = Array.from({ length: n }, () => R(0, 7)), l = R(0, 3), r = R(l + 2, n), k = R(0, r - l - 1);
  const levels = []; const build = (seq, lo, hi, d, path) => { if (lo === hi || !seq.length) return; const mid = (lo + hi) >> 1; (levels[d] = levels[d] || []).push({ seq, lo, hi, mid, path }); build(seq.filter(x => x <= mid), lo, mid, d + 1, path + 'L'); build(seq.filter(x => x > mid), mid + 1, hi, d + 1, path + 'R'); };
  build(a, 0, 7, 0, '');
  const st = (path, L, Rr, kk) => ({ levels, path, L, R: Rr, kk });
  push('Arreglo ' + a.join(', ') + '. Se pide el ' + (k + 1) + '.º menor de las posiciones ' + l + '…' + (r - 1) + '.', st('', l, r, k));
  let L = l, Rr = r, kk = k, lo = 0, hi = 7, path = '', d = 0;
  while (lo < hi) { const node = levels[d].find(x => x.path === path), mid = node.mid, pre = i => node.seq.slice(0, i).filter(x => x <= mid).length, e = pre(Rr) - pre(L);
    if (kk < e) { push('Nivel ' + d + ': en el rango hay ' + e + ' valores ≤ ' + mid + '; como k = ' + kk + ' < ' + e + ', se baja a la izquierda.', st(path, L, Rr, kk)); [L, Rr] = [pre(L), pre(Rr)]; hi = mid; path += 'L'; }
    else { push('Nivel ' + d + ': solo ' + e + ' valores ≤ ' + mid + '; k = ' + kk + ' ≥ ' + e + ': se baja a la derecha con k = ' + (kk - e) + '.', st(path, L, Rr, kk)); [L, Rr] = [L - pre(L), Rr - pre(Rr)]; kk -= e; lo = mid + 1; path += 'R'; }
    d++; }
  push('Se llegó a la hoja del valor ' + lo + ': es la respuesta (comprobación: ' + a.slice(l, r).sort((x, y) => x - y)[k] + ').', st(path, L, Rr, kk));
}, s => s.levels.map((lv, d) => '<div class="vrow"><span class="vlab">nivel ' + d + '</span>' + lv.map(nd => '<div class="cells" style="margin:3px 8px 3px 0;display:inline-flex">' + nd.seq.map((x, i) => '<div class="cell ' + (nd.path === s.path && i >= s.L && i < s.R ? 'a' : x <= nd.mid ? 'b' : 'g') + '">' + x + '</div>').join('') + '</div>').join('') + '</div>').join('') + '<p class="note">Azul = va a la izquierda (≤ mitad); verde = va a la derecha.</p>');

V('Graphs-Algorithms-Trees-SmallToLarge', 'Small to large', 'Etiqueta = tamaño del mapa de colores de cada nodo. Al juntar hijos, el nodo adopta el mapa más grande (verde) y vuelca los otros (amarillo).', push => {
  const n = 10, { T, E, s } = treeState(n), col = Array.from({ length: n }, () => R(1, 3)), mp = Array(n).fill(null); let moved = 0;
  s.lab = col.map((c, i) => (i + 1) + '·c' + c);
  push('Cada nodo tiene un color (c1, c2, c3). Se procesan los hijos antes que el padre.', s);
  const order = []; const q = [0]; for (const u of q) { order.push(u); q.push(...T.kids[u]); }
  for (const u of order.reverse()) { let big = null; for (const v of T.kids[u]) if (!big || mp[v].size > mp[big].size) big = v;
    const m = big !== null ? mp[big] : new Map(); s.nc = s.nc.map(() => ''); if (big !== null) s.nc[big] = 'g';
    let mv = 1; for (const v of T.kids[u]) if (v !== big) { s.nc[v] = 'a'; for (const [c, k] of mp[v]) { m.set(c, (m.get(c) || 0) + k); mv++; } }
    m.set(col[u], (m.get(col[u]) || 0) + 1); mp[u] = m; moved += mv; s.ns[u] = 'tam ' + [...m.values()].reduce((a, b) => a + b, 0); s.ring = u;
    const best = Math.max(...m.values()); push('Nodo ' + (u + 1) + ': ' + (big !== null ? 'adopta el mapa de ' + (big + 1) + ' y ' : '') + 'mueve ' + mv + ' elementos. Color más frecuente del subárbol: ' + [...m].filter(([, k]) => k === best).map(([c]) => 'c' + c).join(', ') + '.', s); }
  s.nc = s.nc.map(() => ''); s.ring = -1; push('En total se movieron ' + moved + ' elementos; nunca más de n·log n.', s);
}, GR);

V('Graphs-Algorithms-Trees-VirtualTree', 'Árbol virtual', 'Rojo = nodos de la consulta; morado = LCA agregados. Las líneas punteadas son las aristas del árbol virtual.', push => {
  const n = 12, { T, E, s } = treeState(n, 540, 300); const imp = shuffle([...Array(n).keys()]).slice(0, 4);
  const anc = v => { const r = []; for (let x = v; x !== -1; x = T.par[x]) r.push(x); return r; }, lca = (a, b) => { const A = anc(a); return anc(b).find(x => A.includes(x)); };
  const tin = []; let t = 0; const dfs = u => { tin[u] = t++; T.kids[u].forEach(dfs); }; dfs(0);
  imp.forEach(v => s.nc[v] = 'r'); push('Consulta: nodos ' + imp.map(v => v + 1).join(', ') + '. Se ordenan por tiempo de entrada del DFS.', s);
  const srt = imp.slice().sort((a, b) => tin[a] - tin[b]); const nodes = new Set(srt); nodes.add(0);
  for (let i = 0; i + 1 < srt.length; i++) { const w = lca(srt[i], srt[i + 1]); if (!nodes.has(w)) { nodes.add(w); s.nc[w] = 'p'; } push('LCA(' + (srt[i] + 1) + ', ' + (srt[i + 1] + 1) + ') = ' + (w + 1) + '.', s); }
  if (s.nc[0] === '') s.nc[0] = 'p';
  const V2 = [...nodes].sort((a, b) => tin[a] - tin[b]), pila = [], VE = [];
  for (const v of V2) { while (pila.length && !anc(v).includes(pila[pila.length - 1])) pila.pop(); if (pila.length) VE.push({ a: pila[pila.length - 1], b: v }); pila.push(v); }
  s.ec = E.map(() => 'x'); s.E = E.concat(VE.map(e => Object.assign({ bend: 18 }, e))); s.ec = s.ec.concat(VE.map(() => 'b')); s.el = s.el.concat(VE.map(() => ''));
  push('Con una pila se cuelga cada nodo de su último ancestro: el árbol virtual (azul) tiene ' + V2.length + ' nodos en vez de ' + n + '.', s);
}, s => GR(s).replace(/stroke="#1f6feb" stroke-width="3.5"/g, 'stroke="#1f6feb" stroke-width="3" stroke-dasharray="6 4"'));
// ---- grafos de finales ----
// flujo genérico con caminos BFS sobre un grafo dibujado (s, t dados); devuelve el lado de la fuente
function flowGen(push, s, E, S, Tt, msg) {
  const n = s.xy.length, f = E.map(() => 0), cap = e => e.w === Infinity ? Infinity : e.w; let total = 0;
  const lab = () => E.map((e, k) => (f[k]) + '/' + (e.w === Infinity ? '∞' : e.w));
  s.el = lab(); push(msg, s);
  for (let it = 0; it < 20; it++) { const prev = Array(n).fill(null); prev[S] = [-1, 0]; const q = [S];
    for (const u of q) E.forEach((e, k) => { if (e.a === u && !prev[e.b] && f[k] < cap(e)) { prev[e.b] = [k, 1]; q.push(e.b); } if (e.b === u && !prev[e.a] && f[k] > 0) { prev[e.a] = [k, -1]; q.push(e.a); } });
    if (!prev[Tt]) break; let b = Infinity, path = []; for (let v = Tt; v !== S;) { const [k, d] = prev[v]; path.push([k, d]); b = Math.min(b, d > 0 ? cap(E[k]) - f[k] : f[k]); v = d > 0 ? E[k].a : E[k].b; }
    s.ec = E.map(() => ''); path.forEach(([k]) => s.ec[k] = 'a'); push('Camino aumentante con cuello de botella ' + b + '.', s); path.forEach(([k, d]) => f[k] += d * b); total += b; s.el = lab(); }
  const seen = Array(n).fill(false); seen[S] = true; const q = [S]; for (const u of q) E.forEach((e, k) => { if (e.a === u && !seen[e.b] && f[k] < cap(e)) { seen[e.b] = true; q.push(e.b); } if (e.b === u && !seen[e.a] && f[k] > 0) { seen[e.a] = true; q.push(e.a); } });
  s.ec = E.map(e => seen[e.a] && !seen[e.b] ? 'r' : 'x'); return { total, seen };
}
V('Graphs-Algorithms-Flow-Algorithms-ProjectSelection', 'Selección de proyectos con corte mínimo', 'Proyectos P (ganancia) a la izquierda, herramientas H (costo) a la derecha. Lo que queda del lado de S (verde) es lo que conviene hacer.', push => {
  const np = 3, nh = 3, gain = Array.from({ length: np }, () => R(3, 9)), cost = Array.from({ length: nh }, () => R(2, 7));
  const xy = [{ x: 40, y: 150 }].concat(gain.map((_, i) => ({ x: 190, y: 50 + i * 100 })), cost.map((_, i) => ({ x: 360, y: 50 + i * 100 })), [{ x: 500, y: 150 }]), T = np + nh + 1, E = [];
  gain.forEach((g, i) => E.push({ a: 0, b: 1 + i, w: g })); cost.forEach((c, j) => E.push({ a: 1 + np + j, b: T, w: c }));
  for (let i = 0; i < np; i++) { const need = shuffle([...Array(nh).keys()]).slice(0, R(1, 2)); need.forEach(j => E.push({ a: 1 + i, b: 1 + np + j, w: Infinity })); }
  const s = GS(xy, E, true); s.lab = ['S'].concat(gain.map((_, i) => 'P' + (i + 1)), cost.map((_, j) => 'H' + (j + 1)), ['T']);
  const { total, seen } = flowGen(push, s, E, 0, T, 'S → P: ganancia; P → H: ∞ (el proyecto exige la herramienta); H → T: costo.');
  s.nc = seen.map(x => x ? 'g' : 'o'); const tot = gain.reduce((a, b) => a + b, 0);
  push('Corte mínimo = ' + total + '. Ganancia = ' + tot + ' − ' + total + ' = ' + (tot - total) + ': hacer ' + (s.lab.filter((_, i) => seen[i] && i >= 1 && i <= np).join(', ') || 'nada') + ' y comprar ' + (s.lab.filter((_, i) => seen[i] && i > np && i < T).join(', ') || 'nada') + '.', s);
}, GR);

V('Graphs-Algorithms-Flow-Algorithms-MinPathCover', 'Cobertura por caminos de un DAG', 'Cada arco elegido (amarillo) une dos caminos en uno. Caminos = n − arcos elegidos.', push => {
  const n = 7, ord = shuffle([...Array(n).keys()]), E = [], has = new Set();
  for (let t = 0; t < 11; t++) { const i = R(0, n - 2), j = R(i + 1, n - 1), a = ord[i], b = ord[j]; if (!has.has(a + ',' + b)) { has.add(a + ',' + b); E.push({ a, b }); } }
  const s = GS(circleLayout(n), E, true), mL = Array(n).fill(-1), mR = Array(n).fill(-1);
  push('DAG con ' + n + ' vértices: al principio, ' + n + ' caminos de un solo vértice.', s);
  const kuhn = (u, vis) => { for (const e of E) if (e.a === u && !vis[e.b]) { vis[e.b] = true; if (mR[e.b] < 0 || kuhn(mR[e.b], vis)) { mR[e.b] = u; mL[u] = e.b; return true; } } return false; };
  let M = 0;
  for (let u = 0; u < n; u++) if (kuhn(u, Array(n).fill(false))) { M++; s.ec = E.map(e => mL[e.a] === e.b ? 'a' : ''); push('Desde ' + (u + 1) + ' se encontró un camino aumentante: ' + M + ' arcos elegidos → ' + (n - M) + ' caminos.', s); }
  const cols = ['g', 'b', 'o', 'p', 'r', 'a', 'k']; let c = 0;
  for (let u = 0; u < n; u++) if (mR[u] < 0) { const cc = cols[c++ % cols.length]; for (let x = u; x >= 0; x = mL[x]) s.nc[x] = cc; }
  s.ec = E.map(e => mL[e.a] === e.b ? s.nc[e.a] : 'x'); push('Mínimo: ' + (n - M) + ' caminos disjuntos (cada color es uno).', s);
}, GR);

V('Graphs-Algorithms-Flow-Algorithms-StoerWagner', 'Stoer-Wagner', 'Etiqueta = peso que conecta al vértice con el conjunto. Amarillo = agregados en la fase; los dos últimos se fusionan.', push => {
  const n = 6, E = randGraph(n, 4, { wmax: 6 }), s = GS(circleLayout(n), E), W = Array.from({ length: n }, () => Array(n).fill(0));
  E.forEach(e => { W[e.a][e.b] += e.w; W[e.b][e.a] += e.w; });
  const grp = [...Array(n).keys()].map(i => [i]), alive = Array(n).fill(true); let best = Infinity;
  s.lab = grp.map(g => g.map(x => x + 1).join('')); push('Grafo no dirigido con pesos. Se buscará el corte mínimo global.', s);
  for (let ph = 1; ph < n; ph++) { const w = Array(n).fill(0), inA = Array(n).fill(false); let sv = -1, tv = -1;
    for (let it = 0; it < n - ph + 1; it++) { let u = -1; for (let v = 0; v < n; v++) if (alive[v] && !inA[v] && (u < 0 || w[v] > w[u])) u = v; inA[u] = true; sv = tv; tv = u; for (let v = 0; v < n; v++) if (alive[v] && !inA[v]) w[v] += W[u][v]; }
    s.nc = [...Array(n).keys()].map(v => !alive[v] ? '' : v === tv ? 'r' : v === sv ? 'o' : 'a'); s.ns = w.map((x, v) => alive[v] && v !== tv ? '' : ''); s.ns[tv] = 'w = ' + w[tv];
    const prevBest = best; best = Math.min(best, w[tv]);
    push('Fase ' + ph + ': el último es ' + s.lab[tv] + ' con w = ' + w[tv] + ' (corte de la fase). Mejor hasta ahora: ' + best + (best < prevBest ? ' (nuevo)' : '') + '.', s);
    for (let v = 0; v < n; v++) { W[sv][v] += W[tv][v]; W[v][sv] = W[sv][v]; } alive[tv] = false; grp[sv] = grp[sv].concat(grp[tv]); s.lab[sv] = grp[sv].map(x => x + 1).join(''); s.lab[tv] = '·';
    s.ec = E.map(e => { const ga = grp.findIndex((g, i) => alive[i] && g.includes(e.a)), gb = grp.findIndex((g, i) => alive[i] && g.includes(e.b)); return ga === gb ? 'x' : ''; }); s.ns = s.ns.map(() => '');
    s.nc = s.nc.map(() => ''); push('Se fusiona ' + s.lab[sv] + ' (las aristas internas, en gris, ya no cuentan).', s); }
  push('Corte mínimo global = ' + best + '.', s);
}, GR);

V('Graphs-Algorithms-Flow-Algorithms-GomoryHu', 'Árbol de Gomory-Hu (Gusfield)', 'Arriba, el grafo; abajo, el árbol que se construye. Cada vértice i se corta contra su padre actual.', push => {
  const n = 5, E = randGraph(n, 3, { wmax: 6 }), xy = circleLayout(n, 540, 200), par = Array(n).fill(0), w = Array(n).fill(0);
  const cutOf = mask => E.reduce((s, e) => s + (((mask >> e.a) & 1) !== ((mask >> e.b) & 1) ? e.w : 0), 0);
  const st = (hl, side) => ({ g: Object.assign(GS(xy, E), { nc: [...Array(n).keys()].map(v => side ? (side >> v & 1 ? 'g' : 'o') : v === hl ? 'a' : '') }), par: par.slice(), w: w.slice(), hl });
  push('Se empieza con todos los vértices colgando del vértice 1.', st(-1, 0));
  for (let i = 1; i < n; i++) { let best = Infinity, bm = 0; for (let m = 0; m < (1 << n); m++) if ((m >> i & 1) && !(m >> par[i] & 1)) { const c = cutOf(m); if (c < best) { best = c; bm = m; } }
    w[i] = best; const pi = par[i]; for (let j = i + 1; j < n; j++) if (par[j] === pi && (bm >> j & 1)) par[j] = i;
    push('Vértice ' + (i + 1) + ' contra ' + (pi + 1) + ': corte mínimo ' + best + ' (verde = lado de ' + (i + 1) + '). Los que estaban con ' + (pi + 1) + ' y quedan del lado de ' + (i + 1) + ' pasan a colgar de él.', st(i, bm)); }
  push('Listo: el corte mínimo entre dos vértices es la arista más liviana del camino entre ellos en el árbol.', st(-1, 0));
}, s => { const tx = circleLayout(s.par.length, 540, 170); const TE = s.par.slice(1).map((p, i) => ({ a: p, b: i + 1, w: s.w[i + 1] })).filter((e, i) => s.w[i + 1] > 0 || true);
  return GR(s.g) + '<p class="note">Árbol de Gomory-Hu (hasta ahora):</p>' + graph({ nodes: tx.map((p, i) => ({ x: p.x, y: p.y, l: i + 1, c: i === s.hl ? 'a' : '' })), edges: TE.map((e, k) => ({ a: e.a, b: e.b, l: s.w[e.b] || '?', c: s.w[e.b] ? 'g' : '' })), H: 180 }); });

V('Graphs-Algorithms-Flow-Algorithms-Blossom', 'Edmonds: emparejamiento con flores', 'Verde = aristas del emparejamiento. Cuando el BFS cierra un ciclo impar (morado), se contrae a su base y la búsqueda sigue.', push => {
  const n = 8, xy = circleLayout(n); let E;
  for (;;) { E = randGraph(n, 4); if (E.length >= 9) break; }
  const s = GS(xy, E), g = adjOf(n, E), mate = Array(n).fill(-1);
  const paint = () => { s.ec = E.map(e => mate[e.a] === e.b ? 'g' : ''); s.nc = mate.map(m => m >= 0 ? 'g' : ''); };
  push('Grafo general (puede tener ciclos impares).', s);
  for (let root = 0; root < n; root++) { if (mate[root] >= 0) continue;
    const p = Array(n).fill(-1), base = [...Array(n).keys()], used = Array(n).fill(false); used[root] = true; const q = [root]; let found = false;
    const lca = (a, b) => { const mk = Array(n).fill(false); for (;;) { a = base[a]; mk[a] = true; if (mate[a] < 0) break; a = p[mate[a]]; } for (;;) { b = base[b]; if (mk[b]) return b; b = p[mate[b]]; } };
    const mark = (v, b, ch, bl) => { while (base[v] !== b) { bl[base[v]] = bl[base[mate[v]]] = true; p[v] = ch; ch = mate[v]; v = p[mate[v]]; } };
    for (let qi = 0; qi < q.length && !found; qi++) { const v = q[qi];
      for (const [to] of g[v]) { if (base[v] === base[to] || mate[v] === to) continue;
        if (to === root || (mate[to] >= 0 && p[mate[to]] >= 0)) { const cb = lca(v, to), bl = Array(n).fill(false); mark(v, cb, to, bl); mark(to, cb, v, bl);
          for (let i = 0; i < n; i++) if (bl[base[i]]) { base[i] = cb; if (!used[i]) { used[i] = true; q.push(i); } }
          paint(); s.nc = s.nc.map((c, i) => base[i] === cb ? 'p' : c); s.ring = root; push('Desde ' + (root + 1) + ': la arista ' + (v + 1) + '–' + (to + 1) + ' cierra un ciclo impar. Se contrae a la base ' + (cb + 1) + ' (morado).', s); }
        else if (p[to] < 0) { p[to] = v; if (mate[to] < 0) { let u = to; while (u >= 0) { const pv = p[u], ppv = mate[pv]; mate[u] = pv; mate[pv] = u; u = ppv; } found = true; paint(); s.ring = root; push('Desde ' + (root + 1) + ': camino aumentante hasta ' + (to + 1) + '; se invierte y el emparejamiento crece.', s); break; }
          used[mate[to]] = true; q.push(mate[to]); } } }
    if (!found) { paint(); s.ring = root; push('Desde ' + (root + 1) + ' no hay camino aumentante.', s); } }
  s.ring = -1; push('Emparejamiento máximo: ' + mate.filter((m, i) => m > i).length + ' parejas.', s);
}, GR);

V('Graphs-Algorithms-Connectivity-DominatorTree', 'Dominadores', 'Grafo dirigido desde el vértice 1. Amarillo = vértice actual; morado = sus dominadores (si se quita uno, deja de ser alcanzable).', push => {
  const n = 7, E = randGraph(n, 4, { dir: true }).filter(() => true), xy = circleLayout(n);
  // asegurar que 1 alcance a todos: árbol dirigido desde 0
  const E2 = []; const ord = [0].concat(shuffle([...Array(n).keys()].slice(1))); for (let i = 1; i < n; i++) E2.push({ a: ord[R(0, i - 1)], b: ord[i] });
  for (let t = 0; t < 5; t++) { const a = R(0, n - 1), b = R(1, n - 1); if (a !== b && !E2.some(e => e.a === a && e.b === b)) E2.push({ a, b }); }
  const s = GS(xy, E2, true), reach = ban => { const seen = Array(n).fill(false); if (ban === 0) return seen; seen[0] = true; const q = [0]; for (const u of q) E2.forEach(e => { if (e.a === u && e.b !== ban && !seen[e.b]) { seen[e.b] = true; q.push(e.b); } }); return seen; };
  const dom = [...Array(n).keys()].map(v => [...Array(n).keys()].filter(d => d !== v && (d === 0 || !reach(d)[v])));
  const idom = dom.map((ds, v) => v === 0 ? -1 : ds.find(d => ds.every(e => e === d || dom[d].includes(e) || e === d)));
  push('El vértice 1 es la raíz.', s);
  for (let v = 1; v < n; v++) { s.nc = s.nc.map((_, i) => i === v ? 'a' : dom[v].includes(i) ? 'p' : ''); s.ec = E2.map(e => idom[e.b] === e.a && e.b < v + 1 ? 'g' : '');
    push('Vértice ' + (v + 1) + ': lo dominan ' + dom[v].map(x => x + 1).join(', ') + '. Dominador inmediato (el más cercano): ' + (idom[v] + 1) + '.', s); }
  s.nc = s.nc.map(() => ''); const extra = [...Array(n).keys()].slice(1).map(v => ({ a: idom[v], b: v })); s.E = E2.concat(extra.map(e => Object.assign({ bend: 20 }, e))); s.ec = E2.map(() => 'x').concat(extra.map(() => 'g')); s.el = s.E.map(() => '');
  push('Árbol de dominadores (verde): cada vértice cuelga de su dominador inmediato.', s);
}, GR);

V('Graphs-Algorithms-Connectivity-BlockCutTree', 'Bloques biconexos', 'Etiqueta = tin/low. Cuando un hijo v cumple low[v] ≥ tin[u], lo apilado desde v más u es un bloque (un color por bloque).', push => {
  const n = 9, E = randGraph(n, 3), s = GS(circleLayout(n), E), g = adjOf(n, E), tin = Array(n).fill(-1), low = Array(n).fill(0), pila = []; let t = 0, nb = 0;
  const cols = ['g', 'b', 'o', 'p', 'r', 'a', 'k'], bloque = Array(E.length).fill('');
  push('Grafo conexo. Se hace un DFS desde 1 apilando vértices.', s);
  const dfs = (u, pe) => { tin[u] = low[u] = t++; pila.push(u); s.ns[u] = tin[u] + '/' + low[u]; s.nc[u] = s.nc[u] || 'a';
    for (const [v, k] of g[u]) { if (k === pe) continue; if (tin[v] >= 0) { low[u] = Math.min(low[u], tin[v]); continue; }
      dfs(v, k); low[u] = Math.min(low[u], low[v]); s.ns[u] = tin[u] + '/' + low[u];
      if (low[v] >= tin[u]) { const b = [u]; for (;;) { const x = pila.pop(); b.push(x); if (x === v) break; } const c = cols[nb++ % cols.length];
        E.forEach((e, kk) => { if (b.includes(e.a) && b.includes(e.b) && !bloque[kk]) bloque[kk] = c; }); s.ec = bloque.slice(); b.forEach(x => s.nc[x] = c);
        push('low[' + (v + 1) + '] = ' + low[v] + ' ≥ tin[' + (u + 1) + '] = ' + tin[u] + ': bloque {' + b.map(x => x + 1).join(', ') + '}' + (u !== 0 || g[0].length > 1 ? (u === 0 ? '' : '; ' + (u + 1) + ' es punto de articulación') : '') + '.', s); } } };
  dfs(0, -1);
  push('Hay ' + nb + ' bloques. Los vértices que están en más de uno son puntos de articulación; con ellos se arma el block-cut tree.', s);
}, GR);

V('Graphs-Algorithms-MST-DirectedMST', 'Arborescencia mínima (Chu-Liu/Edmonds)', 'Cada vértice elige su arco de entrada más barato (amarillo). Si forman un ciclo (rojo), se contrae; al final, verde = arborescencia óptima.', push => {
  const n = 5, xy = circleLayout(n); let E, cyc;
  for (let t = 0; t < 300; t++) { const ord = [0].concat(shuffle([1, 2, 3, 4])); E = [];
    for (let i = 1; i < n; i++) E.push({ a: ord[R(0, i - 1)], b: ord[i], w: R(3, 9) });
    for (let x = 0; x < 4; x++) { const a = R(1, n - 1), b = R(1, n - 1); if (a !== b && !E.some(e => e.a === a && e.b === b)) E.push({ a, b, w: R(1, 5) }); }
    const best = Array(n).fill(-1);
    for (let v = 1; v < n; v++) E.forEach((e, k) => { if (e.b === v && (best[v] < 0 || e.w < E[best[v]].w)) best[v] = k; });
    E.best = best; cyc = null;
    for (let v = 1; v < n && !cyc; v++) { const path = []; let x = v; while (x !== 0 && !path.includes(x)) { path.push(x); x = E[best[x]].a; } if (x !== 0) cyc = path.slice(path.indexOf(x)); }
    if (cyc) break; }
  const s = GS(xy, E, true); s.lab = ['R', 2, 3, 4, 5]; push('Raíz R. Se busca el conjunto de arcos de costo mínimo para llegar a todos.', s);
  s.ec = E.map((_, k) => E.best.includes(k) ? 'a' : ''); push('Cada vértice toma su arco de entrada más barato.', s);
  if (cyc) { s.ec = E.map((e, k) => E.best.includes(k) && cyc.includes(e.b) && cyc.includes(e.a) ? 'r' : s.ec[k]); s.nc = s.nc.map((_, i) => cyc.includes(i) ? 'r' : ''); push('Ciclo ' + cyc.map(x => s.lab[x]).join(' → ') + ': se contrae a un solo vértice. Los arcos que entran al ciclo en v bajan su costo en el del arco que v ya eligió.', s); }
  // óptimo por fuerza bruta
  const inc = [...Array(n).keys()].map(v => E.map((e, k) => e.b === v ? k : -1).filter(k => k >= 0)); let bestC = Infinity, bestSel = null;
  const rec = (v, sel) => { if (v === n) { for (let x = 1; x < n; x++) { let y = x, c = 0; while (y !== 0 && c <= n) { y = E[sel[y - 1]].a; c++; } if (y !== 0) return; } const c = sel.reduce((a, k) => a + E[k].w, 0); if (c < bestC) { bestC = c; bestSel = sel.slice(); } return; } for (const k of inc[v]) { sel.push(k); rec(v + 1, sel); sel.pop(); } };
  rec(1, []); s.nc = s.nc.map(() => ''); s.ec = E.map((_, k) => bestSel.includes(k) ? 'g' : 'x');
  push('Al deshacer la contracción se obtiene la arborescencia mínima: costo ' + bestC + '.', s);
}, GR);

V('Graphs-Algorithms-Miscellaneous-MinMeanCycle', 'Karp: ciclo de media mínima', 'D[k][v] = menor peso de un camino de exactamente k arcos que termina en v.', push => {
  const n = 4; let E; for (;;) { E = randGraph(n, 3, { dir: true, wmax: 9, wmin: 1 }); E.push({ a: E[0].b, b: E[0].a, w: R(1, 9), bend: 16 }); break; }
  const D = Array.from({ length: n + 1 }, (_, k) => Array(n).fill(k ? Infinity : 0));
  const st = (k, best) => ({ D: D.map(r => r.map(fmt)), k, best, E });
  push('Arcos: ' + E.map(e => (e.a + 1) + '→' + (e.b + 1) + ' (' + e.w + ')').join(', ') + '. D[0][v] = 0.', st(0, null));
  for (let k = 1; k <= n; k++) { for (const e of E) if (D[k - 1][e.a] < Infinity) D[k][e.b] = Math.min(D[k][e.b], D[k - 1][e.a] + e.w); push('Capa k = ' + k + ': relajar cada arco desde la capa anterior.', st(k, null)); }
  let best = Infinity; for (let v = 0; v < n; v++) { if (D[n][v] === Infinity) continue; let w = -Infinity; for (let k = 0; k < n; k++) if (D[k][v] < Infinity) w = Math.max(w, (D[n][v] - D[k][v]) / (n - k)); best = Math.min(best, w); }
  push(best === Infinity ? 'Ningún D[n][v] es finito: no hay ciclos.' : 'min_v max_k (D[n][v] − D[k][v])/(n − k) = ' + f3(best) + ': es la menor media de un ciclo.', st(-1, best));
}, s => table(s.D, s.D.map((_, k) => s.D[0].map(() => k === s.k ? 'a' : ''))
  , s.D.map((_, k) => 'k=' + k), s.D[0].map((_, v) => 'v=' + (v + 1))));
// ---- cadenas, DP y geometría de finales ----
V('Strings-Algorithms-Eertree', 'Construcción del eertree', 'Cada letra agrega a lo sumo un palíndromo nuevo: el sufijo palíndromo más largo. Amarillo = letra actual.', push => {
  const s0 = Array.from({ length: R(7, 10) }, () => pick('ab')).join('') + pick(['a', 'b', 'ba']);
  const len = [-1, 0], link = [0, 0], nxt = [{}, {}], name = ['(−1)', '(vacío)'], cnt = [0, 0]; let last = 1;
  const st = (i, nuevo) => ({ s: s0, i, nodes: name.slice(2).map((nm, k) => [nm, len[k + 2], name[link[k + 2]], cnt[k + 2]]), nuevo });
  push('Cadena ' + s0 + '. Dos raíces: longitud −1 (para impares) y 0 (para pares).', st(-1, -1));
  for (let i = 0; i < s0.length; i++) { const c = s0[i]; let v = last; const ok = v => i - 1 - len[v] >= 0 && s0[i - 1 - len[v]] === c;
    while (!ok(v)) v = link[v]; let nu = -1;
    if (!nxt[v][c]) { let lk = 1; if (v !== 0) { let w = link[v]; while (!ok(w)) w = link[w]; lk = nxt[w][c]; }
      len.push(len[v] + 2); link.push(lk); nxt.push({}); cnt.push(0); name.push(s0.slice(i - len[v] - 1, i + 1)); nxt[v][c] = len.length - 1; nu = len.length - 3; }
    last = nxt[v][c]; cnt[last]++;
    push('Letra ' + (i + 1) + ' («' + c + '»): ' + (nu >= 0 ? 'palíndromo nuevo «' + name[last] + '», enlace a «' + name[link[last]] + '».' : 'el sufijo palíndromo más largo «' + name[last] + '» ya existía.'), st(i, nu)); }
  for (let v = len.length - 1; v >= 2; v--) cnt[link[v]] += cnt[v];
  push('Acumulando hacia los enlaces, la última columna dice cuántas veces aparece cada palíndromo.', st(-1, -1));
}, s => cellsRow('cadena', s.s.split(''), s.s.split('').map((_, i) => i === s.i ? 'a' : i < s.i ? 'g' : '')) + table(s.nodes, s.nodes.map((_, k) => Array(4).fill(k === s.nuevo ? 'a' : '')), null, ['palíndromo', 'largo', 'enlace', 'apariciones']));

V('Strings-Algorithms-Lyndon', 'Duval: factorización de Lyndon', 'Azul = bloque actual desde i; amarillo = j (la letra que se compara) y k (la letra del período con que se compara).', push => {
  const s = Array.from({ length: R(9, 12) }, () => pick('aab' + (R(0, 1) ? 'c' : ''))).join(''), n = s.length, cuts = [0]; let i = 0;
  const st = (i, j, k) => ({ s, i, j, k, cuts: cuts.slice() });
  push('Cadena ' + s + '.', st(-1, -1, -1));
  while (i < n) { let j = i + 1, k = i;
    while (j < n && s[k] <= s[j]) { push(s[k] < s[j] ? 's[k] = ' + s[k] + ' < s[j] = ' + s[j] + ': la palabra de Lyndon se alarga hasta j (k vuelve a i).' : 's[k] = s[j] = ' + s[j] + ': se repite el período.', st(i, j, k)); k = s[k] < s[j] ? i : k + 1; j++; }
    push(j < n ? 's[k] = ' + s[k] + ' > s[j] = ' + s[j] + ': se cierran las copias completas del período (largo ' + (j - k) + ').' : 'Fin de la cadena: se cierran las copias del período (largo ' + (j - k) + ').', st(i, j, k));
    while (i <= k) { i += j - k; cuts.push(i); } }
  push('Factorización: ' + cuts.slice(1).map((c, t) => s.slice(cuts[t], c)).join(' ≥ ') + '.', st(-1, -1, -1));
}, s => { const part = []; let p = 0; for (let t = 1; t < s.cuts.length; t++) for (let x = s.cuts[t - 1]; x < s.cuts[t]; x++) part[x] = t; return cellsRow('s', s.s.split(''), s.s.split('').map((_, x) => x === s.j || x === s.k ? 'a' : part[x] ? (part[x] % 2 ? 'g' : 'p') : s.i >= 0 && x >= s.i ? 'b' : '')) + '<p class="note">Cortes: ' + s.cuts.join(', ') + '</p>'; });

V('DP-Optimizations-Aliens', 'Truco de Aliens: búsqueda sobre λ', 'Cada subarreglo cuesta λ. Al subir λ se usan menos subarreglos; se busca el menor λ que usa ≤ k.', push => {
  const n = 10, a = Array.from({ length: n }, () => R(-6, 8)), k = R(1, 3), tried = [];
  const solve = lam => { let fv = 0, fc = 0, dv = -1e18, dc = 0; const better = (x, xc, y, yc) => x > y || (x === y && xc < yc);
    for (const x of a) { const av = fv - lam + x, ac = fc + 1, sv = dv + x, sc = dc; const [ndv, ndc] = better(av, ac, sv, sc) ? [av, ac] : [sv, sc]; if (better(dv, dc, fv, fc)) { fv = dv; fc = dc; } dv = ndv; dc = ndc; }
    return better(dv, dc, fv, fc) ? [dv, dc] : [fv, fc]; };
  push('Arreglo ' + a.join(', ') + '. Hasta k = ' + k + ' subarreglos disjuntos. Con λ = 0 la DP usa los que quiera.', { a, tried: [], k, fin: null });
  let lo = 0, hi = 60;
  while (lo < hi) { const mid = (lo + hi) >> 1, [v, c] = solve(mid); tried.push([mid, c, v, v + mid * k]); push('λ = ' + mid + ': la DP sin límite usa ' + c + ' subarreglos (valor penalizado ' + v + '). ' + (c <= k ? 'Sirve: se prueba un λ menor.' : 'Usa demasiados: hay que subir λ.'), { a, tried: tried.slice(), k, fin: null }); if (c <= k) hi = mid; else lo = mid + 1; }
  const [v] = solve(lo); push('λ* = ' + lo + ': respuesta = ' + v + ' + λ*·k = ' + (v + lo * k) + '.', { a, tried, k, fin: v + lo * k });
}, s => cellsRow('a', s.a) + table(s.tried.map(t => [t[0], t[1], t[2], t[1] <= s.k ? 'sí' : 'no']), s.tried.map(t => Array(4).fill(t[1] <= s.k ? 'g' : 'r')), null, ['λ', 'subarreglos', 'valor penalizado', '≤ k']) + (s.fin !== null ? '<p class="note">Respuesta: <b>' + s.fin + '</b></p>' : ''));

V('DP-Optimizations-SlopeTrick', 'Slope trick con un heap', 'Para hacer el arreglo no decreciente. Amarillo = valor que entra; si el máximo del heap es mayor, se paga la diferencia.', push => {
  const a = Array.from({ length: 8 }, () => R(1, 12)), heap = []; let ans = 0;
  push('Arreglo ' + a.join(', ') + ' (en el problema estricto se resta i antes; aquí se pide no decreciente).', { a, i: -1, heap: [], ans });
  a.forEach((x, i) => { heap.push(x); heap.sort((p, q) => q - p);
    if (heap[0] > x) { const top = heap.shift(); ans += top - x; heap.push(x); heap.sort((p, q) => q - p); push(x + ' < máximo ' + top + ': costo += ' + (top - x) + ' (total ' + ans + '); el quiebre ' + top + ' baja a ' + x + '.', { a, i, heap: heap.slice(), ans }); }
    else push(x + ' ≥ máximo del heap: no cuesta nada, solo se agrega como quiebre.', { a, i, heap: heap.slice(), ans }); });
  push('Costo mínimo: ' + ans + '.', { a, i: -1, heap, ans });
}, s => rows([{ t: 'a', v: s.a, c: s.a.map((_, i) => i === s.i ? 'a' : i < s.i ? 'g' : '') }, { t: 'heap (máx → mín)', v: s.heap.length ? s.heap : [null], c: s.heap.map((_, i) => i === 0 ? 'b' : '') }]) + '<p class="note">Costo: <b>' + s.ans + '</b></p>');

V('DP-Algorithms-BrokenProfile', 'DP de perfil roto', 'La cuadrícula se llena celda por celda (amarillo). La tabla muestra las máscaras posibles de la frontera y de cuántas formas se llega a cada una.', push => {
  const n = 3, m = R(3, 4); let dp = new Map([[0, 1]]);
  const st = (r, c) => ({ n, m, r, c, dp: [...dp].sort((x, y) => x[0] - y[0]).map(([k, v]) => [k.toString(2).padStart(n, '0').split('').reverse().join(''), v]) });
  push('Tablero de ' + n + ' × ' + m + '. Bit r de la máscara = la celda de la fila r en la columna siguiente ya está ocupada.', st(-1, -1));
  for (let c = 0; c < m; c++) for (let r = 0; r < n; r++) { const nd = new Map(), ad = (k, v) => nd.set(k, (nd.get(k) || 0) + v);
    for (const [mask, v] of dp) { if (mask >> r & 1) { ad(mask ^ (1 << r), v); continue; } ad(mask | (1 << r), v); if (r + 1 < n && !(mask >> (r + 1) & 1)) ad(mask | (1 << (r + 1)), v); }
    dp = nd; push('Celda (' + (r + 1) + ', ' + (c + 1) + '): ya ocupada, ficha horizontal o ficha vertical. ' + pl(dp.size, 'máscara posible', 'máscaras posibles') + '.', st(r, c)); }
  push('Formas de cubrir el tablero: ' + (dp.get(0) || 0) + '. Solo vale la máscara 000: las demás tienen fichas que se salen del tablero.', Object.assign(st(-1, -1), { fin: true }));
}, s => { let g = ''; for (let c = 0; c < s.m; c++) for (let r = 0; r < s.n; r++) { const done = c < s.c || (c === s.c && r <= s.r) || s.fin; g += '<rect x="' + (10 + c * 40) + '" y="' + (10 + r * 40) + '" width="36" height="36" rx="5" fill="' + (c === s.c && r === s.r ? FILL.a : done ? FILL.g : 'var(--card)') + '" stroke="#888"/>'; }
  return svgBox(g, 20 + s.m * 40, 20 + s.n * 40) + table(s.dp, s.dp.map(() => ['b', 'g']), null, ['máscara (fila 1 → ' + s.n + ')', 'formas']); });

V('Geometry-Advanced-Minkowski', 'Suma de Minkowski', 'Azul y verde: los dos polígonos. Las aristas de la suma (amarillo) son las de ambos, mezcladas por ángulo.', push => {
  const mk = () => { for (;;) { const P = hullJS(Array.from({ length: 5 }, () => [R(-2, 2), R(-2, 2)])); if (P.length >= 3) return P; } };
  const low = P => { let k = 0; P.forEach((p, i) => { if (p[1] < P[k][1] || (p[1] === P[k][1] && p[0] < P[k][0])) k = i; }); return P.slice(k).concat(P.slice(0, k)); };
  const A = low(mk()).map(p => [p[0] - 6, p[1] + 2]), B = low(mk()).map(p => [p[0] + 1, p[1] - 3]);
  const res = []; let i = 0, j = 0; const n = A.length, m = B.length, a = A.concat(A.slice(0, 2)), b = B.concat(B.slice(0, 2));
  const st = () => ({ A, B, res: res.slice(), i, j });
  push('Se empieza por los vértices más bajos de cada polígono; su suma es el vértice más bajo del resultado.', st());
  while (i < n || j < m) { res.push([a[i][0] + b[j][0], a[i][1] + b[j][1]]); const c = cross([0, 0], [a[i + 1][0] - a[i][0], a[i + 1][1] - a[i][1]], [b[j + 1][0] - b[j][0], b[j + 1][1] - b[j][1]]);
    const which = j >= m || (i < n && c > 0) ? 'A' : (i >= n || c < 0) ? 'B' : 'ambos'; if (which === 'A') i++; else if (which === 'B') j++; else { i++; j++; }
    push('Vértice ' + res.length + ' de la suma. La siguiente arista con menor ángulo es la de ' + (which === 'ambos' ? 'ambos (paralelas)' : which === 'A' ? 'A (azul)' : 'B (verde)') + '.', st()); }
  push('A + B tiene ' + res.length + ' vértices: a lo sumo |A| + |B|.', Object.assign(st(), { fin: true }));
}, s => { const T = p => [p[0] * 0.75, p[1] * 0.75]; let g = gridBg() + poly(s.A.map(T), '#1f6feb33', COL.b) + poly(s.B.map(T), '#2da44e33', COL.g);
  if (s.res.length > 1) g += '<' + (s.fin ? 'polygon' : 'polyline') + ' points="' + s.res.map(p => toS(T(p)).join(',')).join(' ') + '" fill="' + (s.fin ? '#d4a72c33' : 'none') + '" stroke="' + COL.a + '" stroke-width="3"/>';
  s.res.forEach(p => g += dot(T(p), COL.a, 4)); return svgBox(g, G0.W, G0.H); });

V('Geometry-Advanced-AngularSort', 'Orden angular sin atan2', 'Los puntos se numeran en el orden final. Grupo 0 = abajo (y < 0), 1 = eje x positivo, 2 = arriba y eje x negativo.', push => {
  const P = Array.from({ length: 9 }, () => [R(-5, 5), R(-5, 5)]), grp = ([x, y]) => y < 0 ? 0 : (y === 0 && x >= 0 ? 1 : 2);
  const ord = P.slice().sort((a, b) => grp(a) - grp(b) || (grp(a) === 1 ? 0 : -(a[0] * b[1] - a[1] * b[0])));
  push('Puntos alrededor del origen.', { P, ord: [] });
  for (let i = 0; i < ord.length; i++) push('Posición ' + (i + 1) + ': (' + ord[i].join(', ') + '), grupo ' + grp(ord[i]) + (i ? '; respecto al anterior, cross = ' + (ord[i - 1][0] * ord[i][1] - ord[i - 1][1] * ord[i][0]) + (grp(ord[i - 1]) !== grp(ord[i]) ? ' (cambia de grupo)' : ' ≥ 0') : '') + '.', { P, ord: ord.slice(0, i + 1) });
  push('Orden completo desde −π hasta π, solo con enteros.', { P, ord });
}, s => { let g = gridBg() + seg([-12, 0], [12, 0], '#888', 1) + seg([0, -7], [0, 7], '#888', 1);
  s.P.forEach(p => g += dot(p, '#999', 4)); s.ord.forEach((p, i) => { g += seg([0, 0], p, COL.b, 1.5) + dot(p, i === s.ord.length - 1 ? COL.a : COL.b, 5, String(i + 1)); }); return svgBox(g, G0.W, G0.H); });

})();
