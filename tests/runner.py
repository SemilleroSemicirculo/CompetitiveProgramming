# Verificación de los códigos de la guía contra fuerza bruta.
# Uso (desde la raíz del repositorio):  python3 tests/runner.py t_dp [n_aleatorias] [Nombre1,Nombre2]
# Cada módulo t_*.py define TESTS = { nombre: {dir, sample_in, sample_out, gen, brute, [check], [maxgen]} }:
#   gen(rnd) genera un caso pequeño al azar, brute(entrada) da la respuesta correcta por fuerza bruta
#   y maxgen(rnd) un caso del tamaño máximo para medir el tiempo de C++ y de Python.
import importlib, subprocess, sys, time, os, random, tempfile
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
mod = importlib.import_module(sys.argv[1]); N = int(sys.argv[2]) if len(sys.argv) > 2 else 200
if len(sys.argv) > 3:
    keep = sys.argv[3].split(',')
    for k in list(mod.TESTS):
        if k not in keep: del mod.TESTS[k]
REPO = os.path.dirname(HERE)
TMP = tempfile.mkdtemp()
def run(cmd, inp, tl=20):
    t = time.time(); p = subprocess.run(cmd, input=inp.encode(), capture_output=True, timeout=tl)
    if p.returncode: raise RuntimeError(p.stderr.decode()[-500:])
    return p.stdout.decode(), time.time() - t
norm = lambda s: ' '.join(s.split())
for name, T in mod.TESTS.items():
    base = os.path.join(REPO, T['dir'], name)
    exe = os.path.join(TMP, 'bin_' + name.replace(' ', '_'))
    c = subprocess.run(['g++', '-O2', '-std=c++17', '-o', exe, base + '.cpp'], capture_output=True)
    if c.returncode: print('COMPILA MAL', name, c.stderr.decode()[:1500]); continue
    sols = {'cpp': [exe], 'py': ['python3', base + '.py']}
    ok = True
    chk = T.get('check') or (lambda i, o, e: norm(o) == norm(e))
    for k, cmd in sols.items():
        out, _ = run(cmd, T['sample_in'])
        if not chk(T['sample_in'], out, T['sample_out']): ok = False; print('  EJEMPLO FALLA', name, k, repr(out[:200]))
    rnd = random.Random(12345); bad = 0
    for it in range(N):
        inp = T['gen'](rnd); exp = T['brute'](inp)
        for k, cmd in sols.items():
            out, _ = run(cmd, inp)
            if not chk(inp, out, exp):
                bad += 1
                if bad <= 2: print('  DIFIERE', name, k, '\nIN:', inp[:300], '\nOUT:', out[:200], '\nESPERADO:', exp[:200])
    tm = {}
    if 'maxgen' in T:
        big = T['maxgen'](random.Random(7)); res = {}
        for k, cmd in sols.items():
            try: out, t = run(cmd, big, 30); tm[k] = round(t, 2); res[k] = out
            except subprocess.TimeoutExpired: tm[k] = '>30'
        if len(res) == 2 and not chk(big, res['py'], res['cpp']): print('  MAX: cpp y py no coinciden', name); ok = False
    print(('OK ' if ok and not bad else 'FALLA ') + name, f'aleatorias={N} fallos={bad}', 'tiempos(max):', tm)
