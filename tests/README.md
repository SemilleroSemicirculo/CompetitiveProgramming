# Pruebas de los códigos

Cada código de la guía se verifica así:

1. Se compila el `.cpp` (g++ -O2 -std=c++17).
2. Se corren el `.cpp` y el `.py` con el ejemplo del problema.
3. Se generan cientos de casos pequeños al azar y se comparan contra una **fuerza bruta** obviamente correcta (en problemas con varias respuestas válidas, un verificador revisa la salida).
4. Se mide el tiempo con un caso del tamaño máximo.

```sh
python3 tests/runner.py t_nt 300            # un módulo, 300 casos al azar
python3 tests/runner.py t_g2 300 HLD,MinCut  # solo algunas lecciones
sh tests/run_all.sh 100                      # todo
```

| Módulo | Tema |
|---|---|
| `t_base1.py`, `t_base2.py`, `t_base3.py` | Lecciones base: DP y estructuras, grafos, cadenas, geometría y herramientas |
| `t_dp.py`, `t_do.py` | Programación dinámica y sus optimizaciones |
| `t_ds.py`, `t_ds2.py` | Estructuras de datos |
| `t_gr.py`, `t_g2.py` | Grafos y flujos |
| `t_st.py` | Cadenas |
| `t_ge.py`, `t_ge2.py` | Geometría |
| `t_ft.py`, `t_nt.py` | Herramientas, teoría de números, juegos y polinomios |
| `t_pr.py`, `t_di.py` | Probabilidad y distribuciones |

Es la misma técnica de *stress testing* que explica el capítulo «Competir en equipo» del libro.
