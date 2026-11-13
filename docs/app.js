(function(){
const A = window.ALGORITMOS, nav = document.getElementById('nav'), main = document.getElementById('main');
const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const KW = 'if else for while do return break continue struct class const static void int long double bool char auto using namespace typedef template typename public private new delete switch case true false operator define include';
const TY = 'vector map set queue stack deque priority_queue pair tuple array string ll ld cin cout sort unique min max abs swap';
function resaltar(src){
  const re = /(\/\*[\s\S]*?\*\/|\/\/[^\n]*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(#\w+)|\b(\d+\.?\d*)\b|\b([A-Za-z_]\w*)\b/g;
  let out='', last=0, m;
  const kw=new Set(KW.split(' ')), ty=new Set(TY.split(' '));
  while((m=re.exec(src))){
    out += esc(src.slice(last,m.index)); last = re.lastIndex;
    if(m[1]) out += '<span class="c">'+esc(m[1])+'</span>';
    else if(m[2]) out += '<span class="s">'+esc(m[2])+'</span>';
    else if(m[3]) out += '<span class="k">'+esc(m[3])+'</span>';
    else if(m[4]) out += '<span class="n">'+m[4]+'</span>';
    else if(kw.has(m[5])) out += '<span class="k">'+m[5]+'</span>';
    else if(ty.has(m[5])) out += '<span class="t">'+m[5]+'</span>';
    else out += m[5];
  }
  return out + esc(src.slice(last));
}
function menu(filtro){
  const f=(filtro||'').toLowerCase(); let html='', cur='', sub='';
  const orden=['DP','Data Structures','Graphs','Strings','Geometry','FunctionalTools'];
  for(const c of orden){
    const items=A.filter(a=>a.carpeta===c && (!f || (a.nombre+' '+a.algoritmo).toLowerCase().includes(f)));
    if(!items.length) continue;
    html+='<h4>'+items[0].area+'</h4>'; sub='';
    for(const a of items){
      if(a.sub!==sub){sub=a.sub; if(sub!=='-') html+='<h5>'+esc(sub)+'</h5>';}
      html+='<a href="#/'+a.id+'" data-id="'+a.id+'">'+esc(a.nombre)+'</a>';
    }
  }
  nav.innerHTML = html || '<p class="note">Sin resultados.</p>';
  marcar();
}
function marcar(){const id=location.hash.slice(2);nav.querySelectorAll('a').forEach(a=>a.classList.toggle('on',a.dataset.id===id));}
function inicio(){
  const grupos={};A.forEach(a=>(grupos[a.carpeta]=grupos[a.carpeta]||[]).push(a));
  let h='<h1>Guía de Programación Competitiva</h1><p>Algoritmos clásicos en C++ del <b>Semillero Semicírculo</b>, cada uno explicado en su propia página, con su complejidad, el código comentado y, en varios casos, una demostración interactiva. Todos fueron probados en <a href="https://cses.fi/problemset/">CSES</a>.</p><div class="grid-home">';
  for(const c of Object.keys(grupos)) h+='<a class="card" href="#/'+grupos[c][0].id+'"><b>'+grupos[c][0].area+'</b><br><small>'+grupos[c].length+' algoritmos</small></a>';
  h+='</div><p class="note" style="margin-top:24px">Usa el menú de la izquierda o el buscador. Los marcados con ▶ tienen demostración interactiva.</p>';
  main.innerHTML=h;
}
function pagina(a){
  const dem = window.DEMOS && window.DEMOS[a.id];
  let h='<div class="crumb">'+esc(a.area)+(a.sub!=='-'?' › '+esc(a.sub):'')+'</div><h1>'+esc(a.nombre)+'</h1><p><span class="badge">ACABADO</span> '+esc(a.algoritmo)+'</p><div class="meta">';
  h+='<div><b>Complejidad</b>'+esc(a.complejidad)+'</div>';
  h+='<div><b>Problema</b>'+(a.cses?'<a href="'+a.cses+'" target="_blank" rel="noopener">'+esc(a.problema.replace(/\s*\(https?:[^)]*\)/,''))+'</a>':esc(a.problema))+'</div>';
  h+='<div><b>Entrada</b>'+esc(a.entrada)+'</div><div><b>Salida</b>'+esc(a.salida)+'</div></div>';
  h+='<div id="demo"></div><h2>Código (C++)</h2><div class="row"><button class="btn" id="copiar">Copiar código</button><a class="btn" style="text-decoration:none" href="https://github.com/SemilleroSemicirculo/CompetitiveProgramming/blob/main/'+encodeURI(a.archivo)+'" target="_blank" rel="noopener">Ver en GitHub</a></div><pre><code>'+resaltar(a.codigo)+'</code></pre>';
  main.innerHTML=h;
  document.getElementById('copiar').onclick=e=>{navigator.clipboard.writeText(a.codigo);e.target.textContent='¡Copiado!';setTimeout(()=>e.target.textContent='Copiar código',1500);};
  if(dem) dem(document.getElementById('demo'));
}
function ruta(){
  const id=location.hash.slice(2), a=A.find(x=>x.id===id);
  a?pagina(a):inicio(); marcar(); window.scrollTo(0,0); nav.classList.remove('open');
}
document.getElementById('buscar').oninput=e=>menu(e.target.value);
document.getElementById('menu').onclick=()=>nav.classList.toggle('open');
window.addEventListener('hashchange',ruta);
if(window.DEMOS) A.forEach(a=>{if(window.DEMOS[a.id]) a.nombre=a.nombre; });
menu(); ruta();
// marca ▶ en el menú de las páginas con demo
if(window.DEMOS) nav.querySelectorAll('a').forEach(a=>{if(window.DEMOS[a.dataset.id]) a.textContent='▶ '+a.textContent;});
document.getElementById('buscar').addEventListener('input',()=>{if(window.DEMOS) nav.querySelectorAll('a').forEach(a=>{if(window.DEMOS[a.dataset.id]&&!a.textContent.startsWith('▶')) a.textContent='▶ '+a.textContent;});});
})();
