// Demostraciones interactivas. window.DEMOS[id](contenedor)
(function(){
const D = window.DEMOS = {};
const el = (h) => { const d = document.createElement('div'); d.innerHTML = h; return d.firstElementChild; };
const rnd = (n, lo, hi) => Array.from({length:n}, () => lo + Math.floor(Math.random()*(hi-lo+1)));

function bs(box){
  let a = rnd(14,1,60).sort((x,y)=>x-y), lo, hi, t, fin;
  const w = el('<div class="demo"><h3>Búsqueda binaria paso a paso</h3><div class="row"><label>Buscar <input id="t" type="number" style="width:70px"></label><button class="btn" id="n">Nuevo arreglo</button><button class="btn" id="p">Paso ▶</button><button class="btn" id="r">Reiniciar</button></div><div class="cells" id="c"></div><div class="msg" id="m"></div><p class="note">Amarillo = mitad actual · azul = rango activo · tachado = descartado.</p></div>');
  box.appendChild(w);
  const $ = s => w.querySelector(s);
  function reset(){ lo=0; hi=a.length-1; fin=false; t=+$('#t').value; $('#m').textContent='Pulsa «Paso» para empezar.'; draw(-1); }
  function draw(mid, hit){ $('#c').innerHTML = a.map((v,i)=>'<div class="cell '+(fin&&i===hit?'g':i===mid?'a':(i<lo||i>hi)?'r':'b')+'">'+v+'</div>').join(''); }
  function nuevo(){ a=rnd(14,1,60).sort((x,y)=>x-y); $('#t').value=a[Math.floor(Math.random()*a.length)]; reset(); }
  $('#n').onclick=nuevo; $('#r').onclick=reset;
  $('#p').onclick=()=>{ if(fin) return; if(lo>hi){fin=true;$('#m').textContent='No está en el arreglo (NOT FOUND).';draw(-1);return;}
    const mid=lo+Math.floor((hi-lo)/2);
    if(a[mid]===t){fin=true;$('#m').textContent='Encontrado en el índice '+mid+'.';draw(mid,mid);}
    else{ if(a[mid]<t){$('#m').textContent=a[mid]+' < '+t+': se descarta la izquierda.';lo=mid+1;} else {$('#m').textContent=a[mid]+' > '+t+': se descarta la derecha.';hi=mid-1;} draw(mid); } };
  nuevo();
}
D['FunctionalTools-Codes-BS']=bs; D['FunctionalTools-Codes-BS-library']=bs;

D['FunctionalTools-Codes-Sieve']=function(box){
  const w=el('<div class="demo"><h3>Criba de Eratóstenes</h3><div class="row"><label>N <input id="n" type="number" value="60" min="10" max="150" style="width:70px"></label><button class="btn" id="p">Siguiente primo ▶</button><button class="btn" id="r">Reiniciar</button></div><div class="cells" id="c"></div><div class="msg" id="m"></div></div>');
  box.appendChild(w); const $=s=>w.querySelector(s); let N,m,p;
  function reset(){N=Math.max(10,Math.min(150,+$('#n').value||60));m=Array(N+1).fill(true);m[0]=m[1]=false;p=2;$('#m').textContent='Se tachan los múltiplos de cada primo.';draw();}
  function draw(c){let h='';for(let i=2;i<=N;i++)h+='<div class="cell '+(!m[i]?'r':i===c?'a':'')+'" style="min-width:34px">'+i+'</div>';$('#c').innerHTML=h;}
  $('#r').onclick=reset;
  $('#p').onclick=()=>{while(p<=N&&!m[p])p++; if(p*p>N){$('#m').textContent='Listo: los que no están tachados son primos.';draw();return;}
    for(let x=p*p;x<=N;x+=p)m[x]=false; $('#m').textContent='Primo '+p+': se tachan sus múltiplos desde '+p*p+'.'; draw(p); p++;};
  reset();
};

D['DP-Algorithms-Kadane1D']=function(box){
  let a,i,cur,best,ini,bi,bj;
  const w=el('<div class="demo"><h3>Kadane paso a paso</h3><div class="row"><button class="btn" id="n">Nuevo arreglo</button><button class="btn" id="p">Paso ▶</button></div><div class="cells" id="c"></div><div class="msg" id="m"></div></div>');
  box.appendChild(w);const $=s=>w.querySelector(s);
  function draw(){ $('#c').innerHTML=a.map((v,k)=>'<div class="cell '+(k>=bi&&k<=bj?'g':(k>=ini&&k<=i)?'b':'')+'">'+v+'</div>').join(''); }
  function nuevo(){a=rnd(12,-9,9);cur=best=a[0];ini=bi=bj=0;i=0;$('#m').textContent='curr = best = '+a[0];draw();}
  $('#n').onclick=nuevo;
  $('#p').onclick=()=>{ if(i>=a.length-1){$('#m').textContent='Fin: la mejor suma es '+best+' (verde).';return;} i++;
    if(a[i]>cur+a[i]){cur=a[i];ini=i;$('#m').textContent='a[i] solo vale más que extender: se empieza aquí. curr = '+cur;} else {cur+=a[i];$('#m').textContent='Se extiende el subarreglo. curr = '+cur;}
    if(cur>best){best=cur;bi=ini;bj=i;} draw(); };
  nuevo();
};

D['Graphs-Algorithms-Graph-Traversal-BFS']=function(box){
  const R=10,C=16; let wall,s,e,dist,q,fin,mode='w';
  const w=el('<div class="demo"><h3>BFS en una cuadrícula</h3><div class="row"><button class="btn" id="w">Dibujar muros</button><button class="btn" id="a">Mover inicio</button><button class="btn" id="b">Mover meta</button><button class="btn" id="p">Paso ▶</button><button class="btn" id="g">Ejecutar todo</button><button class="btn" id="r">Reiniciar</button></div><div class="grid" id="g1" style="grid-template-columns:repeat('+C+',1fr);max-width:640px"></div><div class="msg" id="m"></div><p class="note">Haz clic en las celdas para poner muros, o mover inicio/meta según el modo.</p></div>');
  box.appendChild(w);const $=x=>w.querySelector(x);
  function reset(keep){ if(!keep){wall=Array.from({length:R},()=>Array(C).fill(false));s=[1,1];e=[R-2,C-2];}
    dist=Array.from({length:R},()=>Array(C).fill(-1));dist[s[0]][s[1]]=0;q=[s];fin=false;$('#m').textContent='';draw();}
  function draw(path){ let h='';for(let i=0;i<R;i++)for(let j=0;j<C;j++){let c='gc',t='';
      if(wall[i][j])c+=' w';else if(path&&path.has(i+','+j))c+=' p';else if(dist[i][j]>=0){c+=' v';t=dist[i][j];}
      if(i===s[0]&&j===s[1]){c='gc s';t='S';} if(i===e[0]&&j===e[1]){c='gc e';t='E';}
      h+='<div class="'+c+'" data-i="'+i+'" data-j="'+j+'">'+t+'</div>';}
    $('#g1').innerHTML=h; }
  $('#g1').onclick=ev=>{const c=ev.target.closest('.gc');if(!c)return;const i=+c.dataset.i,j=+c.dataset.j;
    if(mode==='w'&&!(i===s[0]&&j===s[1])&&!(i===e[0]&&j===e[1]))wall[i][j]=!wall[i][j];
    else if(mode==='a'&&!wall[i][j])s=[i,j]; else if(mode==='b'&&!wall[i][j])e=[i,j]; reset(true);};
  $('#w').onclick=()=>mode='w';$('#a').onclick=()=>mode='a';$('#b').onclick=()=>mode='b';$('#r').onclick=()=>reset(false);
  function step(){ if(fin)return false; if(!q.length){fin=true;$('#m').textContent='IMPOSSIBLE: no hay camino.';draw();return false;}
    const [i,j]=q.shift(); for(const [di,dj] of [[1,0],[-1,0],[0,1],[0,-1]]){const x=i+di,y=j+dj;
      if(x<0||y<0||x>=R||y>=C||wall[x][y]||dist[x][y]>=0)continue;dist[x][y]=dist[i][j]+1;q.push([x,y]);}
    if(dist[e[0]][e[1]]>=0){fin=true;const p=new Set();let [x,y]=e;p.add(x+','+y);
      while(dist[x][y]>0){for(const [di,dj] of [[1,0],[-1,0],[0,1],[0,-1]]){const u=x+di,v=y+dj;if(u>=0&&v>=0&&u<R&&v<C&&dist[u][v]===dist[x][y]-1&&!wall[u][v]){x=u;y=v;p.add(x+','+y);break;}}}
      $('#m').textContent='Camino mínimo: '+dist[e[0]][e[1]]+' pasos.';draw(p);return false;}
    draw();return true;}
  $('#p').onclick=step; $('#g').onclick=()=>{let n=0;while(step()&&n++<2000);};
  reset(false);
};

D['Graphs-Algorithms-Graph-Traversal-DSU']=function(box){
  const n=10; let par,sz;
  const w=el('<div class="demo"><h3>Union-Find</h3><div class="row"><label>unir <input id="a" type="number" min="0" max="9" value="0" style="width:56px"> y <input id="b" type="number" min="0" max="9" value="1" style="width:56px"></label><button class="btn" id="u">Unir</button><button class="btn" id="r">Reiniciar</button></div><div class="cells" id="c"></div><div class="msg" id="m"></div><p class="note">Cada casilla muestra su padre. Los que tienen el mismo color pertenecen al mismo conjunto (la raíz es su propio padre).</p></div>');
  box.appendChild(w);const $=s=>w.querySelector(s);
  const find=x=>par[x]===x?x:(par[x]=find(par[x]));
  const col=r=>'hsl('+(r*47%360)+',70%,70%)';
  function draw(){$('#c').innerHTML=par.map((p,i)=>'<div class="cell" style="background:'+col(find(i))+'55"><small>'+i+'</small><br>→ '+p+'</div>').join('');}
  function reset(){par=Array.from({length:n},(_,i)=>i);sz=Array(n).fill(1);$('#m').textContent='';draw();}
  $('#r').onclick=reset;
  $('#u').onclick=()=>{let a=find(+$('#a').value),b=find(+$('#b').value);if(a===b){$('#m').textContent='Ya estaban en el mismo conjunto.';return;}
    if(sz[a]<sz[b])[a,b]=[b,a];par[b]=a;sz[a]+=sz[b];$('#m').textContent='Unidos: la raíz es '+a+' (tamaño '+sz[a]+').';draw();};
  reset();
};
})();

// ---- Demos adicionales ----
(function(){
const D=window.DEMOS; const el=h=>{const d=document.createElement('div');d.innerHTML=h;return d.firstElementChild;};

D['Strings-Algorithms-KMP-I']=D['Strings-Algorithms-KMP-II']=function(box){
  const w=el('<div class="demo"><h3>Prefix-function (KMP)</h3><div class="row"><label>Cadena <input id="s" value="abcabcabd" style="width:200px"></label><button class="btn" id="p">Paso ▶</button><button class="btn" id="r">Reiniciar</button></div><div class="cells" id="c"></div><div class="cells" id="l"></div><div class="msg" id="m"></div><p class="note">Debajo de cada letra: LP[i] = longitud del mayor prefijo que también es sufijo de s[0..i].</p></div>');
  box.appendChild(w);const $=x=>w.querySelector(x);let s,LP,i;
  function draw(){ $('#c').innerHTML=[...s].map((c,k)=>'<div class="cell '+(k===i?'a':'')+'">'+c+'</div>').join(''); $('#l').innerHTML=[...s].map((c,k)=>'<div class="cell '+(k<=i?'g':'')+'">'+(k<=i?LP[k]:'·')+'</div>').join(''); }
  function reset(){s=$('#s').value||'a';LP=Array(s.length).fill(0);i=0;$('#m').textContent='LP[0] = 0';draw();}
  $('#r').onclick=reset;
  $('#p').onclick=()=>{ if(i>=s.length-1){$('#m').textContent='Listo.';return;} i++; let j=LP[i-1],log=[];
    while(j>0&&s[i]!==s[j]){log.push('no coincide, j pasa de '+j+' a '+LP[j-1]);j=LP[j-1];}
    if(s[i]===s[j]){j++;log.push('coincide: j = '+j);} LP[i]=j; $('#m').textContent='i = '+i+': '+(log.join('; ')||'sin coincidencia')+' → LP['+i+'] = '+j; draw(); };
  reset();
};

D['DP-Algorithms-EditDistance']=function(box){
  const w=el('<div class="demo"><h3>Tabla de distancia de edición</h3><div class="row"><label>a <input id="a" value="kitten" style="width:110px"></label><label>b <input id="b" value="sitting" style="width:110px"></label><button class="btn" id="g">Calcular</button></div><div id="t" style="overflow:auto"></div><div class="msg" id="m"></div><p class="note">dp[i][j] = mínimo entre borrar, insertar o reemplazar. Pasa el cursor sobre una celda para ver de dónde sale.</p></div>');
  box.appendChild(w);const $=x=>w.querySelector(x);
  $('#g').onclick=()=>{ const a=$('#a').value.slice(0,12),b=$('#b').value.slice(0,12),n=a.length,m=b.length;
    const dp=Array.from({length:n+1},(_,i)=>Array.from({length:m+1},(_,j)=>i===0?j:j===0?i:0));
    for(let i=1;i<=n;i++)for(let j=1;j<=m;j++)dp[i][j]=Math.min(dp[i-1][j]+1,dp[i][j-1]+1,dp[i-1][j-1]+(a[i-1]!==b[j-1]?1:0));
    let h='<table style="border-collapse:collapse"><tr><td></td><td></td>'+[...b].map(c=>'<td class="cell">'+c+'</td>').join('')+'</tr>';
    for(let i=0;i<=n;i++){h+='<tr><td class="cell">'+(i?a[i-1]:'')+'</td>';for(let j=0;j<=m;j++)h+='<td class="cell '+(i===n&&j===m?'g':'')+'" data-i="'+i+'" data-j="'+j+'">'+dp[i][j]+'</td>';h+='</tr>';}
    $('#t').innerHTML=h+'</table>'; $('#m').textContent='Distancia = '+dp[n][m];
    $('#t').onmouseover=e=>{const c=e.target.closest('td[data-i]');if(!c)return;const i=+c.dataset.i,j=+c.dataset.j;
      $('#m').textContent=(i&&j)?('dp['+i+']['+j+'] = min(borrar '+(dp[i-1][j]+1)+', insertar '+(dp[i][j-1]+1)+', reemplazar/igual '+(dp[i-1][j-1]+(a[i-1]!==b[j-1]?1:0))+') = '+dp[i][j]):'Caso base.';}; };
  $('#g').click();
};

D['Geometry-ConvexHull']=function(box){
  const W=560,H=340;
  const w=el('<div class="demo"><h3>Envolvente convexa paso a paso (Graham scan)</h3><div class="row"><button class="btn" id="p">Paso ▶</button><button class="btn" id="a">Reproducir</button><button class="btn" id="r">Reiniciar</button><button class="btn" id="n">Puntos nuevos</button><button class="btn" id="c">Limpiar</button></div><svg id="v" width="100%" viewBox="0 0 '+W+' '+H+'" style="background:var(--bg);border:1px solid var(--line);border-radius:10px;cursor:crosshair;max-width:'+W+'px"></svg><div class="msg" id="m"></div><p class="note">Haz clic para agregar puntos. Verde = pila actual (la envolvente en construcción), amarillo = punto que se revisa, rojo = punto que se saca porque gira hacia adentro.</p></div>');
  box.appendChild(w);const $=x=>w.querySelector(x);
  let pts=[],order=[],st=[],i=0,phase='start',p0=null,popped=null,timer=null,done=false;
  // signo del producto cruz (b - a) x (c - a) en coordenadas de pantalla (y hacia abajo)
  const cr=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
  function prepare(){
    st=[];i=0;popped=null;done=false;phase='start';stop();
    if(pts.length<3){order=pts.slice();draw();$('#m').textContent='Agrega al menos 3 puntos.';return;}
    // punto más bajo (mayor y en pantalla); a igual altura, el de más a la izquierda
    p0=pts.reduce((b,p)=>(p[1]>b[1]||(p[1]===b[1]&&p[0]<b[0]))?p:b);
    const d2=p=>(p[0]-p0[0])**2+(p[1]-p0[1])**2;
    order=pts.filter(p=>p!==p0).sort((a,b)=>{const ang=x=>Math.atan2(p0[1]-x[1],x[0]-p0[0]);return ang(a)-ang(b)||d2(a)-d2(b);});
    order.unshift(p0);
    $('#m').textContent='1. Se toma el punto más bajo como inicio. Pulsa «Paso».';draw();
  }
  function step(){
    if(done||pts.length<3)return false;
    popped=null;
    if(phase==='start'){phase='sort';$('#m').textContent='2. Se ordenan los demás puntos por el ángulo que forman con el inicio (los números muestran el orden).';draw();return true;}
    if(i>=order.length){done=true;$('#m').textContent='Listo: la envolvente tiene '+st.length+' puntos. Ningún punto queda por fuera.';draw();return false;}
    const p=order[i];
    if(st.length>=2&&cr(st[st.length-2],st[st.length-1],p)>=0){
      // giro en sentido horario en pantalla = hacia adentro: el punto del medio sobra
      popped=st.pop();
      $('#m').textContent='Los últimos dos puntos de la pila y el punto amarillo giran hacia adentro: se saca el punto rojo.';
    }else{
      st.push(p);i++;
      $('#m').textContent=st.length<3?'Se agrega el punto a la pila.':'Gira hacia afuera (antihorario): el punto entra a la pila.';
    }
    draw();return true;
  }
  function draw(){
    let s='';
    const cur=(!done&&i<order.length&&phase!=='start')?order[i]:null;
    if(phase!=='start'&&p0)for(const p of order)s+='<line x1="'+p0[0]+'" y1="'+p0[1]+'" x2="'+p[0]+'" y2="'+p[1]+'" stroke="#8884" stroke-dasharray="3 4"/>';
    if(st.length>1){const path=st.concat(done?[st[0]]:[]);s+='<polyline points="'+path.map(p=>p.join(',')).join(' ')+'" fill="'+(done?'#2da44e22':'none')+'" stroke="#2da44e" stroke-width="3"/>';}
    if(cur&&st.length)s+='<line x1="'+st[st.length-1][0]+'" y1="'+st[st.length-1][1]+'" x2="'+cur[0]+'" y2="'+cur[1]+'" stroke="#d4a72c" stroke-width="2"/>';
    order.forEach((p,k)=>{
      let col='#888',r=5;
      if(st.includes(p))col='#2da44e';
      if(p===popped)col='#cf222e',r=7;
      if(p===cur)col='#d4a72c',r=7;
      if(p===p0)r=7;
      s+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+r+'" fill="'+col+'"/>';
      if(phase!=='start')s+='<text x="'+(p[0]+8)+'" y="'+(p[1]-6)+'" font-size="11" fill="currentColor">'+k+'</text>';
    });
    if(!order.length)for(const p of pts)s+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="5" fill="#888"/>';
    $('#v').innerHTML=s;
  }
  function stop(){if(timer){clearInterval(timer);timer=null;$('#a').textContent='Reproducir';}}
  $('#p').onclick=()=>{stop();step();};
  $('#a').onclick=()=>{if(timer){stop();return;}if(done)prepare();$('#a').textContent='Pausa';timer=setInterval(()=>{if(!step())stop();},700);};
  $('#r').onclick=prepare;
  $('#v').onclick=e=>{const b=$('#v').getBoundingClientRect();pts.push([Math.round((e.clientX-b.left)*W/b.width),Math.round((e.clientY-b.top)*H/b.height)]);prepare();};
  $('#n').onclick=()=>{pts=Array.from({length:14},()=>[40+Math.floor(Math.random()*(W-80)),40+Math.floor(Math.random()*(H-80))]);prepare();};
  $('#c').onclick=()=>{pts=[];prepare();};
  $('#n').click();
};

D['Graphs-Algorithms-Graph-Traversal-Djikstra']=function(box){
  const V=[[60,60],[200,40],[340,70],[80,200],[220,170],[360,210],[500,130]];
  const E=[[0,1,4],[0,3,2],[1,2,5],[1,4,10],[3,4,3],[4,2,2],[2,6,6],[4,5,4],[5,6,3],[3,5,12]];
  const w=el('<div class="demo"><h3>Dijkstra paso a paso</h3><div class="row"><button class="btn" id="p">Paso ▶</button><button class="btn" id="r">Reiniciar</button></div><svg id="v" viewBox="0 0 560 250" width="100%" style="max-width:560px"></svg><div class="msg" id="m"></div><p class="note">Origen = nodo 0. Verde = distancia ya definitiva; amarillo = nodo que se procesa.</p></div>');
  box.appendChild(w);const $=x=>w.querySelector(x);let dist,done,cur;
  function draw(){let s='';for(const [a,b,c] of E){const [x1,y1]=V[a],[x2,y2]=V[b];s+='<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="#999"/><text x="'+(x1+x2)/2+'" y="'+((y1+y2)/2-4)+'" font-size="12" fill="currentColor">'+c+'</text>';}
    V.forEach(([x,y],i)=>{s+='<circle cx="'+x+'" cy="'+y+'" r="17" fill="'+(i===cur?'#d4a72c':done[i]?'#2da44e':'#eee')+'" stroke="#555"/><text x="'+x+'" y="'+(y+4)+'" text-anchor="middle" font-size="12" fill="#000">'+i+'</text><text x="'+x+'" y="'+(y-24)+'" text-anchor="middle" font-size="12" fill="currentColor">'+(dist[i]===Infinity?'∞':dist[i])+'</text>';});
    $('#v').innerHTML=s;}
  function reset(){dist=V.map(()=>Infinity);dist[0]=0;done=V.map(()=>false);cur=-1;$('#m').textContent='';draw();}
  $('#r').onclick=reset;
  $('#p').onclick=()=>{let u=-1;for(let i=0;i<V.length;i++)if(!done[i]&&dist[i]<Infinity&&(u<0||dist[i]<dist[u]))u=i;
    if(u<0){cur=-1;$('#m').textContent='Listo: distancias mínimas desde 0.';draw();return;}
    done[u]=true;cur=u;const log=[];for(const [a,b,c] of E){const v=a===u?b:b===u?a:-1;if(v>=0&&!done[v]&&dist[u]+c<dist[v]){dist[v]=dist[u]+c;log.push(v+' → '+dist[v]);}}
    $('#m').textContent='Se procesa el nodo '+u+' (dist '+dist[u]+'). '+(log.length?'Mejora: '+log.join(', '):'Sin mejoras.');draw();};
  reset();
};

D['Graphs-Algorithms-MST-Kruskal']=function(box){
  const V=[[60,60],[200,40],[340,70],[80,200],[220,170],[360,210]];
  const E=[[0,1,4],[0,3,2],[1,2,5],[1,4,7],[3,4,3],[4,2,2],[4,5,4],[2,5,6]].sort((a,b)=>a[2]-b[2]);
  const w=el('<div class="demo"><h3>Kruskal paso a paso</h3><div class="row"><button class="btn" id="p">Siguiente arista ▶</button><button class="btn" id="r">Reiniciar</button></div><svg id="v" viewBox="0 0 420 250" width="100%" style="max-width:420px"></svg><div class="msg" id="m"></div></div>');
  box.appendChild(w);const $=x=>w.querySelector(x);let k,par,st,total;
  const f=x=>par[x]===x?x:(par[x]=f(par[x]));
  function draw(){let s='';E.forEach(([a,b,c],i)=>{const [x1,y1]=V[a],[x2,y2]=V[b];const t=st[i];s+='<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+(t===1?'#2da44e':t===2?'#cf222e':'#999')+'" stroke-width="'+(t===1?4:1.5)+'" stroke-dasharray="'+(t===2?'4':'')+'"/><text x="'+(x1+x2)/2+'" y="'+((y1+y2)/2-5)+'" font-size="12" fill="currentColor">'+c+'</text>';});
    V.forEach(([x,y],i)=>s+='<circle cx="'+x+'" cy="'+y+'" r="14" fill="#eee" stroke="#555"/><text x="'+x+'" y="'+(y+4)+'" text-anchor="middle" font-size="12" fill="#000">'+i+'</text>');$('#v').innerHTML=s;}
  function reset(){k=0;par=V.map((_,i)=>i);st=E.map(()=>0);total=0;$('#m').textContent='Aristas ordenadas por peso.';draw();}
  $('#r').onclick=reset;
  $('#p').onclick=()=>{if(k>=E.length){$('#m').textContent='Listo: costo total = '+total+'.';return;}const [a,b,c]=E[k];
    if(f(a)===f(b)){st[k]=2;$('#m').textContent='Arista '+a+'-'+b+' ('+c+') forma ciclo: se descarta.';}
    else{par[f(a)]=f(b);st[k]=1;total+=c;$('#m').textContent='Arista '+a+'-'+b+' ('+c+') une dos componentes: se usa. Total = '+total+'.';}k++;draw();};
  reset();
};
})();

// ---- Botón «Reproducir» para todas las demos paso a paso ----
// Envuelve cada demo: si tiene botón de paso (#p) y no trae su propio «Reproducir»,
// se agrega uno que pulsa «Paso» solo hasta que la demo deja de cambiar.
(function(){
const D=window.DEMOS;
const VEL={'Graphs-Algorithms-Graph-Traversal-BFS':120,'DP-Algorithms-EditDistance':350,'Graphs-Algorithms-Graph-Traversal-DSU':900};
function addPlay(w,id,stepFn,resetFn,doneFn){
  const row=w.querySelector('.row'); if(!row) return;
  const play=document.createElement('button'); play.className='btn'; play.textContent='Reproducir ⏵';
  const ref=w.querySelector('#p'); ref&&ref.nextSibling?row.insertBefore(play,ref.nextSibling):row.appendChild(play);
  let timer=null,ended=false;
  const sig=()=>[...w.querySelectorAll('.cells,.grid,svg,.msg,#t')].map(e=>e.innerHTML).join('|');
  const stop=()=>{if(timer){clearInterval(timer);timer=null;play.textContent='Reproducir ⏵';}};
  play.onclick=()=>{
    if(timer){stop();return;}
    if(ended&&resetFn)resetFn();
    ended=false; play.textContent='Pausa ⏸';
    timer=setInterval(()=>{
      if(!document.body.contains(w)){stop();return;}
      const a=sig(); stepFn();
      if(doneFn?doneFn():sig()===a){ended=true;stop();}
    },VEL[id]||750);
  };
  // cualquier otro botón o clic en el dibujo detiene la reproducción
  w.addEventListener('click',e=>{if(e.isTrusted&&e.target!==play&&e.target.closest('button,.grid,svg,input')&&timer){stop();ended=false;}},true);
  w.addEventListener('input',e=>{if(e.isTrusted){stop();ended=false;}});
}
Object.keys(D).forEach(id=>{
  const orig=D[id];
  D[id]=function(box){
    orig(box);
    const w=box.lastElementChild; if(!w||!w.classList.contains('demo'))return;
    if([...w.querySelectorAll('button')].some(b=>/Reproducir/.test(b.textContent)))return;
    const $=s=>w.querySelector(s);
    if($('#p')){
      addPlay(w,id,()=>$('#p').click(),()=>($('#r')||$('#n')).click(),id==='Graphs-Algorithms-Graph-Traversal-BFS'?()=>$('#m').textContent!=='':null);
    } else if($('#u')){ // Union-Find: uniones al azar hasta que todo sea un solo conjunto
      const par=()=>[...w.querySelectorAll('#c .cell')].map(c=>+c.textContent.split('→')[1]);
      const root=(P,x)=>{while(P[x]!==x)x=P[x];return x;};
      const sets=()=>{const P=par();return new Set(P.map((_,i)=>root(P,i))).size;};
      addPlay(w,id,()=>{const P=par(),n=P.length;let a,b,t=0;do{a=Math.floor(Math.random()*n);b=Math.floor(Math.random()*n);}while(root(P,a)===root(P,b)&&t++<100);$('#a').value=a;$('#b').value=b;$('#u').click();},
        ()=>$('#r').click(),()=>sets()<=1);
    } else if($('#g')&&$('#t')){ // Distancia de edición: llenar la tabla celda por celda
      let cells=[],k=0;
      const prep=()=>{$('#g').click();cells=[...w.querySelectorAll('#t td[data-i]')].filter(c=>+c.dataset.i>0&&+c.dataset.j>0);
        cells.forEach(c=>{c.style.visibility='hidden';c.classList.remove('a');});k=0;$('#m').textContent='Se llena la tabla fila por fila.';};
      const val=(i,j)=>+w.querySelector('#t td[data-i="'+i+'"][data-j="'+j+'"]').textContent;
      addPlay(w,id,()=>{
        if(k===0&&!cells.length)prep();
        if(k>=cells.length){return;}
        if(k>0)cells[k-1].classList.remove('a');
        const c=cells[k++],i=+c.dataset.i,j=+c.dataset.j; c.style.visibility='';c.classList.add('a');
        const a=w.querySelector('#t tr:nth-child('+(i+2)+') td').textContent,b=w.querySelector('#t tr td:nth-child('+(j+2)+')').textContent;
        $('#m').textContent='dp['+i+']['+j+'] ('+a+' vs '+b+') = min(borrar '+(val(i-1,j)+1)+', insertar '+(val(i,j-1)+1)+', '+(a===b?'igual ':'reemplazar ')+(val(i-1,j-1)+(a===b?0:1))+') = '+val(i,j)+(k===cells.length?' → Distancia = '+val(i,j):'');
      },()=>{cells=[];k=0;prep();},()=>k>=cells.length);
      w.querySelector('#g').addEventListener('click',()=>{cells=[];k=0;});
    }
  };
});
})();
