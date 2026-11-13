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
