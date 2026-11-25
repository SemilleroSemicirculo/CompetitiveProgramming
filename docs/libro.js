// Modo libro: curso ordenado de algoritmos y optimización.
// Supone que el lector ya sabe lo básico de Python (variables, listas, ciclos, funciones).
// Formato de cada capítulo:
//   t: título, obj: objetivos, clase: bloques de la clase
//      (texto | {h: subtítulo} | {py: código} | {nota: recuadro}),
//   algs: lecciones (ids de algoritmos en orden), teo: [carpeta, teorema] de la sección Teoría,
//   preguntas: [{q, a}] para pensar antes de seguir, cierre: resumen final.
// En el texto, `así` se ve como código y **así** en negrita.
window.LIBRO = [
{ parte: 'I. Fundamentos', caps: [

{ t: 'Cómo medir un algoritmo',
  obj: ['Estimar si una idea entra en el tiempo límite antes de programarla.', 'Leer la entrada rápido en Python.', 'Entender la plantilla que usan todos los códigos del repositorio.'],
  clase: [
    'Bienvenido. Antes de aprender un solo algoritmo hay que aprender a **medirlos**, porque en competencia casi nunca basta con que el programa sea correcto: tiene que terminar a tiempo. Un juez como CSES te da cerca de 1 segundo, y la pregunta que debes hacerte siempre es: ¿cuántas operaciones va a hacer mi idea con la entrada más grande permitida?',
    { h: 'La notación O grande' },
    'Decimos que un algoritmo es `O(f(n))` si, para entradas grandes, la cantidad de pasos crece como mucho como `f(n)` multiplicado por una constante. No nos importan las constantes ni los términos pequeños: `3n² + 5n + 7` es simplemente `O(n²)`. Lo que nos importa es la **forma** del crecimiento.',
    { py: '# O(n): una pasada\ntotal = 0\nfor x in a:\n    total += x\n\n# O(n²): todos los pares\nfor i in range(n):\n    for j in range(i + 1, n):\n        if a[i] + a[j] == x:\n            print(i, j)\n\n# O(log n): cada paso parte el problema a la mitad\nwhile n > 1:\n    n //= 2' },
    { h: 'La regla de oro' },
    'Un computador hace del orden de `10^8` operaciones simples por segundo en C++. En Python puro la cuenta es mucho menor, más o menos `10^7`, y con PyPy (el intérprete que usa CSES para Python) se acerca a C++ en ciclos sencillos. Con eso puedes leer las restricciones como un mapa:',
    { nota: 'n ≤ 20 → se vale O(2ⁿ) · n ≤ 500 → O(n³) · n ≤ 5000 → O(n²) · n ≤ 2·10⁵ → O(n log n) · n ≤ 10⁷ → O(n) · n ≤ 10¹⁸ → O(log n) o una fórmula.' },
    'Esto es lo más útil que vas a aprender en todo el curso: **las restricciones te dicen qué algoritmo buscar**. Si n ≤ 20, el autor del problema te está invitando a probar subconjuntos; si n ≤ 2·10⁵, está pidiendo algo con ordenamiento, búsqueda binaria o un árbol de segmentos.',
    { h: 'Leer rápido en Python' },
    'La función `input()` es lenta cuando hay cientos de miles de números. Por eso todos los códigos en Python de este repositorio leen toda la entrada de una vez con `sys.stdin.buffer.read()` y la parten en números. También juntan la salida en una lista y la imprimen con un solo `write`.',
    { py: 'import sys\n\ndef main():\n    data = sys.stdin.buffer.read().split()\n    n = int(data[0])\n    a = list(map(int, data[1:1 + n]))\n    out = []\n    out.append(str(sum(a)))\n    sys.stdout.write("\\n".join(out) + "\\n")\n\nmain()' },
    'Poner el código dentro de `main()` no es solo estilo: en Python las variables locales se acceden más rápido que las globales. Es la primera de muchas optimizaciones pequeñas que verás en el curso.'
  ],
  algs: [],
  teo: [['Data Structures', 'Análisis amortizado']],
  preguntas: [
    { q: 'Tienes n ≤ 2·10⁵ y una idea O(n²). ¿Entra en 1 segundo?', a: 'No: son 4·10¹⁰ operaciones, cientos de veces más de lo permitido. Hay que buscar algo O(n log n).' },
    { q: '¿Por qué decimos que O(n log n) y O(n) "casi" son lo mismo en la práctica?', a: 'Porque log₂(2·10⁵) ≈ 18: el factor extra es pequeño. Entre O(n) y O(n²), en cambio, hay un factor de n.' },
    { q: 'Si duplicas n en un algoritmo O(n²), ¿cuánto crece el tiempo?', a: 'Se multiplica por 4, porque (2n)² = 4n².' }
  ],
  cierre: 'Desde ahora, antes de programar algo, estima su complejidad y compárala con las restricciones. Ese hábito te ahorra la mitad de los errores.' },

{ t: 'Búsqueda binaria y dos punteros',
  obj: ['Buscar en un arreglo ordenado en O(log n).', 'Reconocer cuándo la respuesta es "monótona" para buscarla con bisección.', 'Usar el orden para eliminar trabajo con dos punteros.'],
  clase: [
    'Ordenar cuesta O(n log n), y es una de las mejores inversiones que puedes hacer: un arreglo ordenado permite descartar la mitad de los candidatos con una sola pregunta. Esa es la idea de la **búsqueda binaria**.',
    { h: 'El invariante' },
    'La forma más segura de escribirla es pensar en un invariante: mantenemos `lo` en una posición donde la condición es falsa y `hi` donde es verdadera. Mientras estén separados por más de uno, miramos el punto medio y movemos el extremo que corresponda. Al terminar, `hi` es la primera posición verdadera.',
    { py: 'def primera_verdadera(lo, hi, ok):\n    # ok(lo) es False y ok(hi) es True\n    while hi - lo > 1:\n        mid = (lo + hi) // 2\n        if ok(mid):\n            hi = mid\n        else:\n            lo = mid\n    return hi' },
    'Python ya trae esto en el módulo `bisect`: `bisect_left(a, x)` devuelve la primera posición con `a[i] >= x`. Lo verás en la lección de la librería.',
    { h: 'Buscar la respuesta' },
    'El salto conceptual grande de este capítulo es que **no hace falta tener un arreglo**. Si te preguntan el menor tiempo t en el que se pueden fabricar k productos, la función "¿se alcanzan k productos en t?" es falsa y luego verdadera para siempre. Eso basta para buscar t con bisección. Muchos problemas de optimización "minimiza el máximo" o "maximiza el mínimo" se resuelven así.',
    'La búsqueda ternaria es la prima para funciones que suben y luego bajan (unimodales): en vez de una condición verdadera o falsa, comparas dos puntos y descartas un tercio.',
    { h: 'Dos punteros' },
    'Cuando el arreglo está ordenado y buscas un par con suma x, no hace falta probar todos los pares. Con un índice al inicio y otro al final: si la suma es pequeña, avanzas el izquierdo; si es grande, retrocedes el derecho. Cada paso descarta un elemento para siempre, así que el total es O(n).'
  ],
  algs: ['FunctionalTools-Codes-BS', 'FunctionalTools-Codes-BS-library', 'FunctionalTools-Codes-BinarySearchAnswer', 'FunctionalTools-Codes-TS', 'Data-Structures-Algorithms-TwoPointers'],
  teo: [['FunctionalTools', 'Correctitud de la búsqueda binaria']],
  preguntas: [
    { q: '¿Cuántas iteraciones hace la búsqueda binaria sobre 10⁹ valores posibles?', a: 'Unas 30, porque 2³⁰ ≈ 10⁹.' },
    { q: 'En "búsqueda de la respuesta", ¿qué propiedad debe tener la función ok(t)?', a: 'Debe ser monótona: si ok(t) es verdadera, también lo es para todo t mayor.' },
    { q: '¿Por qué dos punteros nunca se salta la pareja correcta?', a: 'Si la suma es menor que x, el elemento izquierdo no puede formar pareja con nadie a la izquierda del derecho, así que descartarlo es seguro (y lo simétrico para el derecho).' }
  ],
  cierre: 'Siempre que veas "mínimo valor tal que…" pregúntate si la condición es monótona. Si lo es, ya tienes la mitad de la solución.' },

{ t: 'Matemáticas para programar',
  obj: ['Encontrar todos los primos hasta 10⁷.', 'Calcular potencias e inversos módulo un primo.', 'Acelerar recurrencias lineales con matrices.'],
  clase: [
    'Muchos problemas piden la respuesta "módulo 10⁹ + 7". No es capricho: los números reales de la respuesta tienen miles de dígitos, y trabajar módulo un primo grande mantiene todo pequeño sin perder información para el juez.',
    { h: 'La criba' },
    'Para saber qué números son primos hasta N, en vez de probar divisores uno por uno, se tachan los múltiplos de cada primo. El costo total es `N/2 + N/3 + N/5 + …`, que da O(N log log N): prácticamente lineal.',
    { h: 'Exponenciación binaria' },
    'Para calcular `a^b mod m` con b de hasta 10¹⁸ no puedes multiplicar b veces. Pero `a^b = (a^(b/2))²` si b es par. Mirando los bits de b, bastan unos 60 productos. En Python existe `pow(a, b, m)`, que hace exactamente esto.',
    { py: 'def binpow(a, b, m):\n    r = 1\n    a %= m\n    while b:\n        if b & 1:\n            r = r * a % m\n        a = a * a % m\n        b >>= 1\n    return r' },
    { h: 'Dividir módulo un primo' },
    'No se puede dividir directamente, pero el **pequeño teorema de Fermat** dice que si p es primo, `a^(p-1) ≡ 1 (mod p)`. Por lo tanto el inverso de a es `a^(p-2)`. Con factoriales e inversos precalculados, cualquier coeficiente binomial sale en O(1).',
    { h: 'Matrices' },
    'Una recurrencia como Fibonacci, `F(n) = F(n-1) + F(n-2)`, se puede escribir como una matriz 2×2 que multiplica al vector (F(n-1), F(n-2)). Elevar esa matriz a la n con exponenciación binaria da F(n) en O(log n), incluso para n = 10¹⁸.'
  ],
  algs: ['FunctionalTools-Codes-Sieve', 'FunctionalTools-Codes-ModArithmetic', 'FunctionalTools-Codes-MatrixExponentiation'],
  teo: [['FunctionalTools', 'Criba de Eratóstenes'], ['FunctionalTools', 'Exponenciación binaria'], ['FunctionalTools', 'Pequeño teorema de Fermat'], ['FunctionalTools', 'Algoritmo de Euclides e identidad de Bézout'], ['FunctionalTools', 'Teorema fundamental de la aritmética'], ['FunctionalTools', 'Inverso modular'], ['FunctionalTools', 'Fórmula de Legendre']],
  preguntas: [
    { q: '¿Por qué en la criba basta empezar a tachar desde p²?', a: 'Los múltiplos menores de p² tienen un factor primo menor que p, así que ya fueron tachados.' },
    { q: '¿Cuántas multiplicaciones hace binpow con b = 10¹⁸?', a: 'Alrededor de 2·60 = 120, porque 10¹⁸ tiene unos 60 bits.' },
    { q: '¿Funciona el truco de Fermat para el inverso si el módulo no es primo?', a: 'No en general. Para módulos compuestos se usa Euclides extendido, y solo existe inverso si a y m son coprimos.' }
  ],
  cierre: 'Guarda en tu cabeza tres herramientas: criba, pow(a, b, m) y factoriales con inversos. Aparecen en todas partes.' },

{ t: 'Estructuras lineales',
  obj: ['Usar pilas, colas y deques según el orden de salida que necesites.', 'Mantener el mínimo o máximo de una ventana en O(1) amortizado.', 'Usar heaps para sacar siempre el mejor elemento.', 'Procesar eventos en orden con una línea de barrido.'],
  clase: [
    'Una estructura de datos es un acuerdo: tú prometes usar solo ciertas operaciones, y a cambio la estructura las hace rápido. Elegir la estructura correcta es la mitad del diseño de un algoritmo.',
    { h: 'Pila, cola y deque' },
    'La **pila** saca primero lo último que entró; la **cola**, lo primero. En Python, una lista sirve de pila (`append` y `pop`), pero para colas usa `collections.deque`: `list.pop(0)` cuesta O(n) y `deque.popleft()` cuesta O(1).',
    'La pila monótona es una técnica fundamental: para encontrar el "valor menor más cercano a la izquierda" de cada posición, se sacan de la pila los elementos que ya nunca podrán ser respuesta. Cada elemento entra y sale una vez, así que el total es O(n) aunque haya un `while` dentro del `for`. Eso es **análisis amortizado**.',
    { h: 'Heaps' },
    'Un heap mantiene a la mano el elemento más pequeño, con inserción y extracción en O(log n). En Python es `heapq`. Es la base de Dijkstra, de los problemas de "las k mejores combinaciones" y de cualquier simulación por eventos.',
    { py: 'import heapq\nh = []\nheapq.heappush(h, 5)\nheapq.heappush(h, 2)\nheapq.heappush(h, 8)\nprint(heapq.heappop(h))  # 2' },
    { nota: 'Truco de rendimiento del repositorio: en Python, guardar tuplas en el heap es lento. Si los valores caben, se codifica (valor, índice) en un solo entero como valor * N + índice.' },
    { h: 'Línea de barrido' },
    'Muchos problemas de intervalos se simplifican si conviertes cada intervalo en dos eventos (entra y sale), los ordenas y recorres el tiempo. Solo importan los instantes en que algo cambia.'
  ],
  algs: ['Data-Structures-Algorithms-Stack', 'Data-Structures-Algorithms-Deque', 'Data-Structures-Classic-Problems-Team-Queue', 'Data-Structures-Algorithms-Heap', 'Data-Structures-Classic-Problems-K-Smallest-Sums', 'Data-Structures-Algorithms-SweepLine'],
  teo: [['Data Structures', 'Análisis amortizado'], ['Data Structures', 'Propiedad del heap']],
  preguntas: [
    { q: 'La pila monótona tiene un while dentro de un for. ¿Por qué no es O(n²)?', a: 'Porque cada elemento se apila una vez y se desapila a lo sumo una vez: el while hace como mucho n iteraciones en total.' },
    { q: '¿Qué estructura usarías para atender pedidos siempre por el de mayor prioridad?', a: 'Un heap (en Python, heapq con prioridades negadas para tener un máximo).' }
  ],
  cierre: 'Pila, cola, deque y heap son tus herramientas diarias. El análisis amortizado explica por qué muchos ciclos anidados en realidad son lineales.' },

{ t: 'Búsqueda exhaustiva inteligente',
  obj: ['Recorrer los 2ⁿ subconjuntos de forma ordenada.', 'Partir una búsqueda exponencial en dos mitades.'],
  clase: [
    'A veces no hay atajo y hay que probar todo. La pregunta es cómo probarlo con el menor costo posible. Con n ≤ 20, los 2²⁰ ≈ un millón de subconjuntos se pueden revisar uno por uno; cada subconjunto es un número cuyos bits encendidos dicen qué elementos lo forman.',
    { py: 'for mask in range(1 << n):\n    suma = 0\n    for i in range(n):\n        if mask >> i & 1:\n            suma += a[i]' },
    'El **código Gray** ordena los subconjuntos para que cada uno difiera del anterior en un solo elemento: así puedes actualizar la suma en O(1) en vez de recalcularla.',
    { h: 'Meet in the middle' },
    'Con n = 40, 2⁴⁰ es demasiado. Pero puedes partir los elementos en dos mitades de 20, listar las sumas de cada mitad (2²⁰ cada una) y combinarlas con un diccionario o con dos punteros. Pasas de 2ⁿ a 2^(n/2): la raíz cuadrada del trabajo. Es un ejemplo perfecto de cómo un poco de memoria compra muchísimo tiempo.'
  ],
  algs: ['FunctionalTools-Codes-GrayCode', 'FunctionalTools-Codes-MeetInTheMiddle'],
  teo: [['FunctionalTools', 'Meet in the middle']],
  preguntas: [
    { q: '¿Cuántos subconjuntos tiene un conjunto de 40 elementos y cuántos revisa meet in the middle?', a: '2⁴⁰ ≈ 10¹² contra 2·2²⁰ ≈ 2·10⁶ (más el costo de combinarlos).' },
    { q: 'Escribe el i-ésimo código Gray.', a: 'i ^ (i >> 1).' }
  ],
  cierre: 'Cuando n es pequeño, la fuerza bruta es una opción válida y elegante. Cuando es un poco grande, piensa si puedes partirla en dos.' }
]},

{ parte: 'II. Programación dinámica', caps: [

{ t: 'Introducción a la programación dinámica',
  obj: ['Definir un estado y una transición.', 'Pasar de una recursión exponencial a una tabla.', 'Resolver problemas de monedas y mochila.'],
  clase: [
    'La programación dinámica (DP) es la técnica más importante de la programación competitiva y, honestamente, la que más cuesta al principio. La idea es simple: **si un problema grande se arma con respuestas de problemas pequeños, y esos pequeños se repiten, guarda sus respuestas**.',
    { h: 'Estado y transición' },
    'Diseñar una DP es responder dos preguntas. Primero, ¿qué información mínima describe un subproblema? Eso es el **estado**. Segundo, ¿de qué estados más pequeños sale la respuesta? Eso es la **transición**. Por ejemplo, en "menor número de monedas para formar x", el estado es la cantidad x y la transición es probar cuál fue la última moneda usada.',
    { py: 'INF = float("inf")\ndp = [0] + [INF] * x\nfor s in range(1, x + 1):\n    for c in monedas:\n        if c <= s and dp[s - c] + 1 < dp[s]:\n            dp[s] = dp[s - c] + 1' },
    'El costo de una DP casi siempre es **número de estados × costo de cada transición**. Aquí son x estados y n monedas: O(n·x).',
    { h: 'El orden de los ciclos importa' },
    'Contar formas de pagar x es casi el mismo código, pero si el ciclo de monedas va por fuera, cuentas combinaciones (sin importar el orden); si va por dentro, cuentas secuencias ordenadas. Esta sutileza es un clásico de examen: entiende por qué antes de seguir.',
    { h: 'Mochila' },
    'En la mochila 0/1 cada objeto se usa a lo sumo una vez. El truco para hacerlo con un solo arreglo es recorrer las capacidades **de mayor a menor**, para no reutilizar el objeto que acabas de poner. Nota que O(n·x) depende del **valor** de x, no de su número de dígitos: por eso se dice que es pseudo-polinomial.',
    { h: 'Kadane' },
    'El subarreglo de suma máxima es la DP más corta que existe: la mejor suma que termina en i es `max(a[i], mejor[i-1] + a[i])`. Una línea, O(n).'
  ],
  algs: ['DP-Algorithms-Kadane1D', 'DP-Algorithms-CoinChange', 'DP-Algorithms-CoinCombinations', 'DP-Algorithms-Knapsack'],
  teo: [['DP', 'Principio de optimalidad de Bellman'], ['DP', 'Número de estados × costo de transición'], ['DP', 'Mochila: pseudo-polinomial']],
  preguntas: [
    { q: 'En mochila 0/1 con un solo arreglo, ¿qué pasa si recorres la capacidad de menor a mayor?', a: 'Cada objeto puede usarse varias veces: obtienes la mochila "sin límite" en vez de la 0/1.' },
    { q: '¿Cuál es el estado de Kadane y cuál su transición?', a: 'Estado: mejor suma de un subarreglo que termina en i. Transición: o empiezas en i, o extiendes el mejor que termina en i − 1.' }
  ],
  cierre: 'Toda DP se diseña igual: estado, transición, casos base y orden de cálculo. Escríbelos en papel antes de programar.' },

{ t: 'DP sobre secuencias',
  obj: ['Encontrar la subsecuencia creciente más larga en O(n²) y en O(n log n).', 'Comparar dos cadenas con tablas 2D (LCS y distancia de edición).', 'Extender Kadane a matrices.'],
  clase: [
    'Ahora los estados tienen dos dimensiones o necesitan una estructura extra para ser rápidos. Este capítulo es el puente entre la DP de juguete y la DP de competencia.',
    { h: 'LIS: dos versiones' },
    'La versión O(n²) define `dp[i]` = la LIS más larga que termina en i, y prueba todos los j < i. La versión O(n log n) cambia la pregunta: `t[k]` = el menor final posible de una subsecuencia creciente de largo k + 1. Ese arreglo siempre está ordenado, así que cada elemento nuevo se ubica con búsqueda binaria. Es un ejemplo hermoso de **optimizar cambiando el estado**, no el código.',
    { py: 'from bisect import bisect_left\nt = []\nfor x in a:\n    k = bisect_left(t, x)\n    if k == len(t):\n        t.append(x)\n    else:\n        t[k] = x\nprint(len(t))' },
    { h: 'Dos cadenas, una tabla' },
    'Para LCS y distancia de edición, el estado es (i, j): "los primeros i caracteres de una y los primeros j de la otra". Cada casilla mira a sus vecinas de arriba, izquierda y diagonal. Reconstruir la respuesta es caminar la tabla hacia atrás siguiendo de dónde vino cada valor.',
    { h: 'Kadane en 2D' },
    'Fijar un par de filas convierte la matriz en un arreglo de sumas de columna, y sobre él corres Kadane. Es una técnica general: **fijar una dimensión para reducir el problema a uno que ya sabes resolver**.'
  ],
  algs: ['DP-Algorithms-LIS-I', 'DP-Algorithms-LIS-II', 'DP-Algorithms-LCS', 'DP-Algorithms-EditDistance', 'DP-Algorithms-Kadane2D'],
  teo: [['DP', 'Cota inferior de la LIS'], ['DP', 'Teorema de Erdős–Szekeres'], ['DP', 'Teorema de Dilworth (y su dual de Mirsky)']],
  preguntas: [
    { q: 'En LIS O(n log n), ¿el arreglo t es una subsecuencia creciente real?', a: 'No necesariamente: solo su longitud es correcta. Para reconstruir la secuencia hay que guardar de qué posición vino cada elemento.' },
    { q: '¿Cuántos estados tiene la distancia de edición entre cadenas de largo n y m?', a: '(n + 1)(m + 1).' }
  ],
  cierre: 'Cuando una DP es lenta, antes de micro-optimizar pregúntate si hay otro estado con mejor estructura (ordenado, monótono) que permita usar búsqueda binaria o una estructura de datos.' },

{ t: 'DP avanzada',
  obj: ['Usar subconjuntos como estados.', 'Modelar probabilidades con DP.', 'Conocer las optimizaciones que aparecen en finales.'],
  clase: [
    'Con bitmasks, el estado es un subconjunto codificado en un entero. Con n ≤ 20 hay 2ⁿ estados, y por cada uno se prueban n transiciones: O(2ⁿ·n), que es justo el límite. El problema del ascensor muestra además que un estado puede guardar **un par** (viajes, peso del último viaje) que se compara lexicográficamente.',
    'Las probabilidades también encajan en DP: si `P[i][j]` es la probabilidad de ganar cuando faltan i y j victorias, cada partido lleva a un estado más pequeño.',
    { h: 'Hacia las finales' },
    'En niveles altos, la DP no cambia de idea, pero las transiciones se aceleran con estructura matemática: si la función de costo cumple la desigualdad del cuadrángulo, el punto óptimo de corte es monótono (Knuth, divide y vencerás); si las transiciones son rectas, el **Convex Hull Trick** las responde en O(log n); y si hay una restricción de "exactamente k", el **truco de Aliens** la convierte en una penalización lagrangiana. Lee esas entradas de teoría: son el puente entre este curso y la optimización matemática.'
  ],
  algs: ['DP-Algorithms-BitmaskDP', 'DP-Classic-Problems-Campeonato'],
  teo: [['DP', 'DP sobre subconjuntos y SOS (suma sobre subconjuntos)'], ['DP', 'Desigualdad del cuadrángulo y optimización de Knuth'], ['DP', 'Divide y vencerás para DP'], ['DP', 'Convex Hull Trick y Li Chao'], ['DP', 'Truco de Aliens (WQS / relajación lagrangiana)']],
  preguntas: [
    { q: '¿Cuántos estados y transiciones tiene una DP de bitmask con n = 20?', a: '2²⁰ ≈ 10⁶ estados con 20 transiciones cada uno: unos 2·10⁷ pasos.' },
    { q: '¿Qué relación tiene el truco de Aliens con la optimización continua?', a: 'Es relajación lagrangiana: se quita la restricción "exactamente k" y se cobra una penalización λ por cada elemento, ajustando λ con búsqueda binaria.' }
  ],
  cierre: 'Ya tienes las bases de DP. En las finales, la DP se combina con convexidad y dualidad: conceptos de optimización que vale la pena estudiar formalmente.' }
]},

{ parte: 'III. Consultas en rangos', caps: [

{ t: 'Consultas en rangos',
  obj: ['Responder mínimos de rangos en O(1) con Sparse Table.', 'Sumas con actualizaciones usando Fenwick.', 'Dominar el Segment Tree, incluida la propagación perezosa.', 'Reordenar consultas con el algoritmo de Mo.'],
  clase: [
    'Muchos problemas se reducen a "dame la suma (o el mínimo) entre las posiciones l y r", repetido cientos de miles de veces. Recorrer el rango cada vez cuesta O(n) por consulta: demasiado. Este capítulo es una escalera de estructuras, cada una más general que la anterior.',
    { h: 'Sumas de prefijos' },
    'Si el arreglo no cambia, guarda `p[i] = a[0] + … + a[i-1]` y entonces la suma de [l, r) es `p[r] - p[l]`. O(1) por consulta. Es la idea más simple y más usada del capítulo.',
    { py: 'p = [0]\nfor x in a:\n    p.append(p[-1] + x)\n# suma de a[l..r] inclusive\nprint(p[r + 1] - p[l])' },
    { h: 'Sparse Table' },
    'Para mínimos no puedes "restar". Pero el mínimo es **idempotente**: tomar un elemento dos veces no cambia el resultado. Así que basta guardar los mínimos de los bloques de largo 2^k y cubrir cualquier rango con dos bloques que se solapan. O(n log n) de preparación y O(1) por consulta.',
    { h: 'Fenwick y Segment Tree' },
    'Cuando hay actualizaciones, se necesita un árbol. El Fenwick es compacto y rapidísimo para sumas; el Segment Tree es la navaja suiza: cualquier operación asociativa, búsquedas dentro del árbol y, con **propagación perezosa**, actualizaciones de rangos enteros en O(log n). Todo rango se descompone en a lo sumo unos 2 log n nodos: ese es el teorema que hace funcionar todo.',
    { h: 'Mo: cuando ninguna estructura sirve' },
    'Si la operación es difícil de combinar (por ejemplo, contar valores distintos), Mo ordena las consultas por bloques de tamaño √n para que los extremos se muevan poco en total: O((n + q)√n). Es un algoritmo **offline**: necesita conocer todas las consultas de antemano.'
  ],
  algs: ['Data-Structures-Algorithms-SparseTable', 'Data-Structures-Algorithms-FenwickTree', 'Data-Structures-Algorithms-SegmentTreeMin', 'Data-Structures-Algorithms-SegmentTree', 'Data-Structures-Algorithms-MoAlgorithm'],
  teo: [['Data Structures', 'Operaciones idempotentes en Sparse Table'], ['Data Structures', 'Cota de Fenwick'], ['Data Structures', 'Descomposición canónica del Segment Tree'], ['Data Structures', 'Algoritmo de Mo'], ['Data Structures', 'Estructuras persistentes']],
  preguntas: [
    { q: '¿Por qué la Sparse Table no sirve para sumas con dos bloques solapados?', a: 'Porque la suma no es idempotente: los elementos de la zona común se contarían dos veces.' },
    { q: '¿Qué guarda la "marca perezosa" de un nodo?', a: 'Una actualización que aplica a todo su rango y que aún no se ha bajado a los hijos; se empuja solo cuando hace falta visitarlos.' },
    { q: 'Si las consultas llegan una por una y dependen de la respuesta anterior, ¿puedes usar Mo?', a: 'No: Mo es offline, necesita reordenar las consultas.' }
  ],
  cierre: 'Escalera para recordar: prefijos (sin cambios) → Sparse Table (mínimos sin cambios) → Fenwick (sumas con cambios) → Segment Tree (casi todo) → Mo (lo que no se combina).' }
]},

{ parte: 'IV. Grafos', caps: [

{ t: 'Recorridos de grafos',
  obj: ['Representar un grafo con listas de adyacencia.', 'Recorrer con DFS y BFS y saber cuándo usar cada uno.', 'Detectar ciclos, bipartición y orden topológico.'],
  clase: [
    'Un grafo es un conjunto de nodos unidos por aristas: ciudades y carreteras, personas y amistades, tareas y dependencias. Una parte enorme de la programación competitiva consiste en **ver el grafo escondido** en el enunciado.',
    { h: 'Representación' },
    'En Python, la forma estándar es una lista de listas: `g[u]` contiene los vecinos de u. Ocupa O(n + m) y permite recorrer los vecinos de un nodo en tiempo proporcional a su grado.',
    { py: 'g = [[] for _ in range(n)]\nfor _ in range(m):\n    a, b = siguiente(), siguiente()\n    g[a - 1].append(b - 1)\n    g[b - 1].append(a - 1)' },
    { h: 'DFS y BFS' },
    'La **DFS** se adentra lo más posible antes de retroceder; es ideal para componentes, ciclos y todo lo que dependa de "terminar" un nodo. La **BFS** avanza por capas, así que el primer momento en que llega a un nodo es por el camino con menos aristas. En Python, evita la DFS recursiva en grafos grandes: el límite de recursión es bajo y es lenta. Todos los códigos del repositorio usan una pila explícita.',
    { h: 'Lo que un recorrido revela' },
    'Con un solo recorrido puedes saber si el grafo es **bipartito** (dos colores sin conflicto ⇔ no hay ciclos impares), si tiene **ciclos** (una arista que vuelve a un ancestro en el camino actual) o, si es dirigido y sin ciclos, un **orden topológico** que respeta todas las dependencias.'
  ],
  algs: ['Graphs-Algorithms-Graph-Traversal-DFS', 'Graphs-Algorithms-Graph-Traversal-BFS', 'Graphs-Algorithms-Graph-Traversal-Bipartite', 'Graphs-Algorithms-Miscellaneous-CycleFindingUndirected', 'Graphs-Algorithms-Miscellaneous-CycleFindingDirected', 'Graphs-Algorithms-Graph-Traversal-TopologicalSort'],
  teo: [['Graphs', 'Lema del apretón de manos'], ['Graphs', 'BFS da caminos más cortos'], ['Graphs', 'Bipartito ⇔ sin ciclos impares'], ['Graphs', 'Ordenamiento topológico ⇔ DAG']],
  preguntas: [
    { q: 'En un grafo dirigido, ¿por qué no basta "llegar a un nodo ya visitado" para decir que hay ciclo?', a: 'Porque ese nodo puede estar ya terminado en otra rama. Hay ciclo solo si está en el camino actual de la DFS.' },
    { q: '¿Cuánto cuesta recorrer un grafo con listas de adyacencia?', a: 'O(n + m): cada nodo se visita una vez y cada arista se mira una o dos veces.' }
  ],
  cierre: 'Antes de pensar en algoritmos sofisticados, pregúntate si un DFS o BFS ya resuelve el problema. Muchas veces sí.' },

{ t: 'Caminos más cortos',
  obj: ['Elegir entre Dijkstra, Bellman-Ford y Floyd-Warshall según el grafo.', 'Entender por qué Dijkstra falla con pesos negativos.', 'Detectar ciclos negativos.'],
  clase: [
    'BFS resuelve caminos más cortos cuando todas las aristas pesan lo mismo. Con pesos, necesitamos ideas nuevas, y la elección depende de tres preguntas: ¿hay pesos negativos?, ¿necesito distancias desde un nodo o entre todos los pares?, ¿qué tan grande es el grafo?',
    { h: 'Dijkstra: avaricia correcta' },
    'Dijkstra saca siempre el nodo no fijado con menor distancia y lo da por definitivo. Funciona porque, con pesos no negativos, ningún camino que pase por nodos más lejanos puede volver a bajar la distancia. Con un heap, cuesta O((n + m) log n).',
    { py: 'import heapq\ndist = [INF] * n\ndist[s] = 0\nh = [(0, s)]\nwhile h:\n    d, u = heapq.heappop(h)\n    if d > dist[u]:\n        continue  # entrada vieja del heap\n    for v, w in g[u]:\n        if d + w < dist[v]:\n            dist[v] = d + w\n            heapq.heappush(h, (dist[v], v))' },
    { h: 'Bellman-Ford y Floyd-Warshall' },
    'Bellman-Ford relaja todas las aristas n − 1 veces; tolera pesos negativos y una ronda extra que todavía mejore algo delata un ciclo negativo. Floyd-Warshall calcula todos los pares con tres ciclos anidados, O(n³), ideal para n ≤ 500. Su estado es una DP: "distancia de i a j usando solo los primeros k nodos como intermedios".',
    { nota: 'Resumen: pesos ≥ 0 → Dijkstra. Pesos negativos → Bellman-Ford. Todos los pares con n pequeño → Floyd-Warshall. Pesos 0/1 → BFS con deque.' }
  ],
  algs: ['Graphs-Algorithms-Graph-Traversal-Djikstra', 'Graphs-Algorithms-Graph-Traversal-BellmanFord', 'Graphs-Algorithms-Graph-Traversal-FloydWarshall'],
  teo: [['Graphs', 'Correctitud de Dijkstra']],
  preguntas: [
    { q: '¿Por qué el código de Dijkstra salta las entradas con d > dist[u]?', a: 'Porque heapq no permite bajar prioridades: se insertan duplicados y las entradas viejas se ignoran al salir.' },
    { q: 'Floyd-Warshall es una DP. ¿Cuál es su estado?', a: 'D_k[i][j] = distancia de i a j usando como intermedios solo los nodos 1..k.' }
  ],
  cierre: 'Elegir bien el algoritmo de caminos más cortos es una decisión de una línea que separa un AC de un TLE.' },

{ t: 'Conectividad y árboles de expansión',
  obj: ['Unir conjuntos con DSU en tiempo casi constante.', 'Construir árboles de expansión mínima con Kruskal y Prim.'],
  clase: [
    'El **DSU** (Union-Find) responde "¿están u y v en el mismo grupo?" mientras se van uniendo grupos. Con dos optimizaciones, compresión de caminos y unión por tamaño, cada operación cuesta α(n), una función que es menor que 5 para cualquier n que puedas imaginar.',
    { py: 'def find(x):\n    while p[x] != x:\n        p[x] = p[p[x]]  # compresión a la mitad\n        x = p[x]\n    return x' },
    { h: 'Árbol de expansión mínima' },
    'Conectar todas las ciudades con la menor cantidad total de carretera es un problema de optimización con una solución avariciosa sorprendente: **Kruskal** ordena las aristas de menor a mayor y toma cada una que no forme ciclo (lo decide el DSU). **Prim** crece un solo árbol tomando siempre la arista más barata que sale de él. Ambos son correctos por la **propiedad del corte**: la arista más barata que cruza cualquier corte pertenece a algún árbol mínimo.'
  ],
  algs: ['Graphs-Algorithms-Graph-Traversal-DSU', 'Graphs-Algorithms-MST-Kruskal', 'Graphs-Algorithms-MST-Prim'],
  teo: [['Data Structures', 'Union-Find: α(n)'], ['Graphs', 'Corte y ciclo en árboles de expansión mínima'], ['Graphs', 'Caracterización de árboles']],
  preguntas: [
    { q: '¿Cuándo preferirías Prim sobre Kruskal?', a: 'En grafos muy densos (m ≈ n²), donde Prim con matriz cuesta O(n²) y no hay que ordenar todas las aristas.' },
    { q: '¿Cuántas aristas tiene un árbol de expansión de n nodos?', a: 'n − 1.' }
  ],
  cierre: 'El MST es tu primer ejemplo de un algoritmo avaricioso con demostración. Aprende la propiedad del corte: es el argumento que usarás para justificar muchos otros.' },

{ t: 'Componentes fuertes, 2-SAT y caminos eulerianos',
  obj: ['Encontrar componentes fuertemente conexas con Tarjan y Kosaraju.', 'Resolver 2-SAT con el grafo de implicaciones.', 'Construir caminos que usen cada arista una vez.'],
  clase: [
    'En grafos dirigidos, "estar conectados" tiene que ir en los dos sentidos. Una **componente fuertemente conexa** es un grupo donde todos llegan a todos. Si contraes cada componente en un nodo, lo que queda es un DAG: la estructura global del grafo.',
    'Kosaraju lo hace con dos DFS (una en el grafo y otra en el grafo invertido, en orden inverso de salida). Tarjan lo hace con una sola DFS que lleva, para cada nodo, el menor tiempo de descubrimiento alcanzable (`low`).',
    { h: '2-SAT' },
    'Tienes variables booleanas y condiciones de la forma "a o b". Cada condición equivale a dos implicaciones: "si no a, entonces b" y "si no b, entonces a". Con esas flechas, la fórmula es satisfacible **si y solo si** ninguna variable queda en la misma componente fuerte que su negación. Es el ejemplo más elegante de reducir lógica a grafos.',
    { h: 'Caminos eulerianos' },
    'Un camino que usa cada arista exactamente una vez existe solo si los grados cumplen una condición simple (todos pares para un circuito; en dirigidos, entradas = salidas salvo en el inicio y el final). Hierholzer lo construye en O(n + m) pegando ciclos.'
  ],
  algs: ['Graphs-Algorithms-Graph-Traversal-Kosaraju', 'Graphs-Algorithms-Graph-Traversal-Tarjan', 'Graphs-Algorithms-Miscellaneous-2-SAT', 'Graphs-Algorithms-Graph-Traversal-EulerianCycle', 'Graphs-Algorithms-Graph-Traversal-HierholzerDirected'],
  teo: [['Graphs', '2-SAT con componentes fuertes'], ['Graphs', 'Teorema de Euler (caminos eulerianos)']],
  preguntas: [
    { q: 'En 2-SAT, ¿cómo se elige el valor de cada variable una vez que hay solución?', a: 'Se toma el literal cuya componente aparece más tarde en el orden topológico del grafo de componentes.' },
    { q: '¿Un grafo con exactamente dos nodos de grado impar tiene circuito euleriano?', a: 'No tiene circuito, pero sí un camino euleriano que empieza en uno de ellos y termina en el otro.' }
  ],
  cierre: 'Contraer componentes fuertes y trabajar en el DAG resultante es una técnica que reaparece constantemente en problemas difíciles.' },

{ t: 'Árboles',
  obj: ['Calcular el diámetro y las distancias máximas.', 'Subir k niveles y encontrar ancestros comunes en O(log n).', 'Aplanar un árbol para usar estructuras de rangos.', 'Dividir árboles por centroides y compararlos por forma.'],
  clase: [
    'Un árbol es un grafo conexo sin ciclos: entre dos nodos hay exactamente un camino. Esa unicidad lo hace mucho más manejable que un grafo general, y por eso hay tantas técnicas específicas.',
    { h: 'Diámetro' },
    'Dos BFS bastan: desde cualquier nodo al más lejano A, y desde A al más lejano B. El camino A–B es el diámetro, y además A y B son los nodos más lejanos de **cualquier** nodo.',
    { h: 'Binary lifting y LCA' },
    'Guardar el ancestro 2^k de cada nodo permite subir cualquier cantidad de niveles mirando los bits de k. Con eso, el ancestro común más cercano sale igualando alturas y subiendo ambos nodos con saltos que no los junten. Con el LCA calculas distancias: `prof[u] + prof[v] − 2·prof[lca]`.',
    { h: 'Euler tour' },
    'Si numeras los nodos en el orden en que la DFS los visita, **cada subárbol queda en un tramo contiguo**. Una pregunta sobre subárboles se vuelve una pregunta de rangos, y ahí entran Fenwick y Segment Tree del capítulo III. Es el ejemplo perfecto de combinar técnicas.',
    { h: 'Centroides' },
    'El centroide es el nodo que al quitarlo deja pedazos de tamaño a lo sumo n/2. Quitarlo y repetir en cada pedazo produce una jerarquía de profundidad O(log n): la **descomposición por centroides**, que permite contar caminos con alguna propiedad en O(n log n). El centroide también sirve de raíz canónica para comparar árboles sin raíz (isomorfismo).'
  ],
  algs: ['Graphs-Algorithms-Graph-Traversal-Diameter', 'Graphs-Algorithms-Trees-TreeDistances', 'Graphs-Algorithms-Trees-BinaryLifting', 'Graphs-Algorithms-Trees-LCA', 'Graphs-Algorithms-Trees-EulerTour', 'Graphs-Algorithms-Trees-Centroid', 'Graphs-Algorithms-Trees-CentroidDecomposition', 'Graphs-Algorithms-Trees-TreeIsomorfismRooted', 'Graphs-Algorithms-Trees-TreeIsomorfism'],
  teo: [['Graphs', 'Caracterización de árboles'], ['Data Structures', 'Descomposición heavy-light'], ['Data Structures', 'Técnica de los más pequeños (small to large)']],
  preguntas: [
    { q: '¿Por qué la descomposición por centroides tiene profundidad O(log n)?', a: 'Porque cada pedazo tiene a lo sumo la mitad de los nodos del anterior.' },
    { q: 'Con el Euler tour, ¿cómo sumas los valores de un subárbol con actualizaciones?', a: 'Con un Fenwick sobre el arreglo aplanado, consultando el tramo [entrada, salida] del nodo.' }
  ],
  cierre: 'Los árboles son el lugar donde se juntan todas las ideas del curso: recorridos, DP, potencias de 2 y estructuras de rangos.' }
]},

{ parte: 'V. Cadenas', caps: [

{ t: 'Algoritmos de cadenas',
  obj: ['Buscar un patrón en tiempo lineal (KMP, Z, hashing).', 'Guardar diccionarios de palabras en un trie.', 'Encontrar palíndromos y rotaciones mínimas en O(n).', 'Ordenar todos los sufijos de un texto.'],
  clase: [
    'Buscar un patrón de largo m en un texto de largo n comparando en cada posición cuesta O(n·m). Todos los algoritmos de este capítulo tienen la misma idea central: **cuando una comparación falla, ya sabes algo del texto; no lo vuelvas a leer**.',
    { h: 'Bordes y la función de prefijos' },
    'Un borde es un prefijo que también es sufijo. KMP calcula para cada posición el borde más largo, y cuando falla una comparación salta a ese borde en vez de empezar de cero. La función Z hace lo mismo desde otro ángulo: `z[i]` es cuánto coincide el texto desde i con su propio inicio. El truco clásico es correr cualquiera de las dos sobre `patrón + "#" + texto`.',
    { h: 'Hashing' },
    'Rabin-Karp convierte cada ventana en un número y compara números en O(1). Es probabilístico: dos cadenas distintas pueden tener el mismo hash, pero con un módulo grande la probabilidad es despreciable. En Python los enteros grandes ayudan: un módulo de 61 bits casi elimina las colisiones.',
    { h: 'Estructuras' },
    'El **trie** guarda palabras compartiendo prefijos y combina muy bien con DP. **Manacher** encuentra todos los palíndromos en O(n) reutilizando la simetría del palíndromo más a la derecha. La **rotación mínima** se encuentra comparando dos candidatos y descartando al perdedor junto con todo lo que ya se comparó. El **arreglo de sufijos** ordena todos los sufijos duplicando la longitud comparada en cada ronda; con él se responden casi todas las preguntas sobre subcadenas.'
  ],
  algs: ['Strings-Algorithms-KMP-I', 'Strings-Algorithms-KMP-II', 'Strings-Algorithms-ZFunction', 'Strings-Algorithms-RabinKarp', 'Strings-Algorithms-PrefixTrie', 'Strings-Algorithms-Manacher', 'Strings-Algorithms-MinimalRotation', 'Strings-Algorithms-SuffixArray'],
  teo: [['Strings', 'Función de prefijos (KMP)'], ['Strings', 'Período y borde'], ['Strings', 'Probabilidad de colisión del hashing'], ['Strings', 'Subcadenas distintas con Suffix Array'], ['Strings', 'Aho–Corasick']],
  preguntas: [
    { q: '¿Por qué se pone un separador como "#" entre el patrón y el texto?', a: 'Para que ninguna coincidencia pueda cruzar del patrón al texto: así z[i] o el borde nunca superan el largo del patrón.' },
    { q: '¿Qué relación hay entre el borde más largo y el período de una cadena?', a: 'El período mínimo es n − (borde más largo).' }
  ],
  cierre: 'KMP o Z para buscar, hashing para comparar rápido, trie para diccionarios y arreglo de sufijos para todo lo demás.' }
]},

{ parte: 'VI. Geometría', caps: [

{ t: 'Geometría computacional',
  obj: ['Usar el producto cruz para orientación, áreas e intersecciones.', 'Contar puntos enteros con el teorema de Pick.', 'Construir la envolvente convexa y encontrar el par más cercano.'],
  clase: [
    'La geometría en competencia es casi toda **álgebra con vectores** y una regla de oro: usa enteros siempre que puedas. Los flotantes acumulan errores y una comparación con `==` puede fallar por 10⁻¹⁵.',
    { h: 'El producto cruz' },
    'Para vectores (x1, y1) y (x2, y2), `x1·y2 − y1·x2` es positivo si el segundo gira a la izquierda del primero, negativo si gira a la derecha y cero si son paralelos. Con esta sola operación se deciden orientaciones, se calculan áreas (fórmula del Shoelace) y se detectan intersecciones de segmentos.',
    { py: 'def cross(o, a, b):\n    return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])' },
    { h: 'Polígonos' },
    'El Shoelace da el doble del área con enteros. El **teorema de Pick** relaciona área, puntos interiores y puntos en el borde: `A = I + B/2 − 1`, y los puntos del borde de un lado son `gcd(|dx|, |dy|)`. Para saber si un punto está dentro, se lanza un rayo y se cuentan los cruces.',
    { h: 'Envolvente convexa y par más cercano' },
    'La envolvente convexa se construye ordenando los puntos y manteniendo una pila que solo gira en un sentido: O(n log n), y se demuestra que no se puede mejorar. El par más cercano usa divide y vencerás o una línea de barrido con una franja de ancho d.'
  ],
  algs: ['Geometry-Point', 'Geometry-Shoelace', 'Geometry-SegmentIntersection', 'Geometry-PointInPolygon', 'Geometry-PolygonLatticePoints', 'Geometry-ConvexHull', 'Geometry-ClosestPair'],
  teo: [['Geometry', 'Producto cruz y orientación'], ['Geometry', 'Fórmula del Shoelace'], ['Geometry', 'Teorema de Pick'], ['Geometry', 'Cota inferior de la envolvente convexa'], ['Geometry', 'Rotating calipers']],
  preguntas: [
    { q: 'Un triángulo con vértices enteros tiene área 10 y 6 puntos en el borde. ¿Cuántos puntos enteros tiene dentro?', a: 'Por Pick: 10 = I + 3 − 1, así que I = 8.' },
    { q: '¿Por qué conviene comparar distancias al cuadrado?', a: 'Para evitar la raíz cuadrada y trabajar solo con enteros exactos.' }
  ],
  cierre: 'Con el producto cruz y enteros resuelves el 80 % de los problemas de geometría de competencia.' }
]},

{ parte: 'VII. Optimización en redes', caps: [

{ t: 'Flujos, emparejamientos y costo mínimo',
  obj: ['Calcular el flujo máximo con caminos aumentantes.', 'Entender el teorema de flujo máximo = corte mínimo.', 'Modelar asignaciones como emparejamientos.', 'Optimizar costo además de cantidad.'],
  clase: [
    'Llegamos al capítulo donde los algoritmos se encuentran con la **optimización matemática**. Un problema de flujo es un programa lineal con una estructura tan especial que tiene algoritmos combinatorios exactos y rápidos.',
    { h: 'Flujo máximo' },
    'Cada arista tiene una capacidad. Queremos mandar lo máximo posible de S a T. La idea es buscar un camino con capacidad sobrante, mandar por él lo que permita su cuello de botella y repetir. El detalle crucial son las **aristas de regreso**: mandar flujo de u a v crea la posibilidad de "devolverlo", y eso permite corregir decisiones malas. Edmonds-Karp elige siempre el camino más corto (BFS) y así garantiza O(V·E²). Dinic agrupa por niveles y manda varios caminos por fase: O(V²·E) en general y mucho mejor en redes unitarias.',
    { h: 'Dualidad: el corte mínimo' },
    'Cuando ya no hay caminos aumentantes, los nodos alcanzables desde S forman un corte, y su capacidad es exactamente el flujo enviado. Ese es el **teorema de flujo máximo = corte mínimo**, y es un caso de la dualidad de programación lineal: el máximo de un problema coincide con el mínimo de su dual.',
    { h: 'Emparejamientos' },
    'Asignar trabajadores a tareas, parejas de baile o casillas de un tablero son emparejamientos bipartitos. Es flujo con capacidades 1, y el algoritmo de Kuhn lo hace directamente con caminos alternantes. El **teorema de Kőnig** dice que el emparejamiento máximo es igual a la cobertura mínima por vértices en grafos bipartitos.',
    { h: 'Costo mínimo' },
    'Si además cada unidad de flujo cuesta, se aumenta siempre por el camino **más barato** (Bellman-Ford o Dijkstra con potenciales). Si no es obligatorio mandar el máximo, se para cuando el siguiente camino ya no tiene costo negativo. Aquí reaparece la dualidad: los potenciales son las variables duales del problema.'
  ],
  algs: ['Graphs-Algorithms-Flow-Algoritms-EdmonsKarp', 'Graphs-Algorithms-Flow-Algoritms-Dinic', 'Graphs-Algorithms-Flow-Algoritms-BipartiteMatching', 'Graphs-Algorithms-Flow-Algoritms-MinCostMaxFlow', 'Graphs-Algorithms-Flow-Algoritms-MinCostAnyFlow'],
  teo: [['Graphs', 'Flujo máximo = corte mínimo'], ['Graphs', 'Teorema de Kőnig'], ['Graphs', 'Teorema de Hall'], ['Graphs', 'Teorema de Menger'], ['Graphs', 'Complejidad de Dinic'], ['Graphs', 'Dualidad en flujo de costo mínimo']],
  preguntas: [
    { q: '¿Para qué sirven las aristas de regreso en la red residual?', a: 'Permiten deshacer flujo enviado antes; sin ellas, el método avaricioso puede quedarse en un flujo que no es máximo.' },
    { q: 'Si el flujo máximo vale 7, ¿qué sabes del corte mínimo?', a: 'Que su capacidad también es 7.' },
    { q: '¿Cómo se modela un emparejamiento bipartito como flujo?', a: 'Fuente → cada nodo izquierdo, cada izquierdo → sus derechos posibles y cada derecho → sumidero, todo con capacidad 1.' }
  ],
  cierre: 'Terminaste el curso. Los flujos son el puente natural hacia la programación lineal, la dualidad y la optimización combinatoria: si quieres seguir, ese es el siguiente libro. Vuelve al modo libre para practicar en cualquier orden.' }
]}
];
