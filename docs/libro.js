// Modo libro: curso ordenado de algoritmos y optimización.
// Supone que el lector ya sabe lo básico de Python (variables, listas, ciclos, funciones).
// Formato de cada capítulo:
//   t: título, obj: objetivos, clase: bloques de la clase
//      (texto | {h: subtítulo} | {py: código} | {nota: recuadro}),
//   algs: lecciones (ids de algoritmos en orden), teo: [carpeta, teorema] de la sección Teoría,
//   preguntas: [{q, a}] para pensar antes de seguir, cierre: resumen final.
// En el texto, `así` se ve como código y **así** en negrita.
window.LIBRO = [
 {
  "parte": "I. Fundamentos",
  "caps": [
   {
    "t": "Cómo medir un algoritmo",
    "obj": [
     "Estimar si una idea entra en el tiempo límite antes de programarla.",
     "Leer la entrada rápido en Python.",
     "Entender la plantilla que usan todos los códigos del repositorio."
    ],
    "clase": [
     "Bienvenido. Antes de aprender un solo algoritmo hay que aprender a **medirlos**, porque en competencia casi nunca basta con que el programa sea correcto: tiene que terminar a tiempo. Un juez típico te da entre 1 y 2 segundos, y la pregunta que debes hacerte siempre es: ¿cuántas operaciones va a hacer mi idea con la entrada más grande permitida?",
     {
      "h": "La notación O grande"
     },
     "Decimos que un algoritmo es `O(f(n))` si, para entradas grandes, la cantidad de pasos crece como mucho como `f(n)` multiplicado por una constante. No nos importan las constantes ni los términos pequeños: `3n² + 5n + 7` es simplemente `O(n²)`. Lo que nos importa es la **forma** del crecimiento.",
     {
      "py": "# O(n): una pasada\ntotal = 0\nfor x in a:\n    total += x\n\n# O(n²): todos los pares\nfor i in range(n):\n    for j in range(i + 1, n):\n        if a[i] + a[j] == x:\n            print(i, j)\n\n# O(log n): cada paso parte el problema a la mitad\nwhile n > 1:\n    n //= 2"
     },
     {
      "h": "La regla de oro"
     },
     "Un computador hace del orden de `10^8` operaciones simples por segundo en C++. En Python puro la cuenta es mucho menor, más o menos `10^7`, y con PyPy (muchos jueces lo ofrecen además de CPython; elígelo al enviar si existe) se acerca a C++ en ciclos sencillos. Con eso puedes leer las restricciones como un mapa:",
     {
      "nota": "n ≤ 20 → alcanza O(2ⁿ) · n ≤ 500 → O(n³) · n ≤ 5000 → O(n²) · n ≤ 2·10⁵ → O(n log n) · n ≤ 10⁷ → O(n) · n ≤ 10¹⁸ → O(log n) o una fórmula."
     },
     "Esto es lo más útil que vas a aprender en todo el curso: **las restricciones te dicen qué algoritmo buscar**. Si n ≤ 20, el autor del problema te está invitando a probar subconjuntos; si n ≤ 2·10⁵, está pidiendo algo con ordenamiento, búsqueda binaria o un árbol de segmentos.",
     {
      "h": "Leer rápido en Python"
     },
     "La función `input()` es lenta cuando hay cientos de miles de números. Por eso los códigos en Python de este repositorio nunca usan el `input()` normal: usan `sys.stdin.readline` y, cuando la entrada es grande, leen todo de una vez con `sys.stdin.buffer.read()` y lo parten en números. También juntan la salida en una lista y la imprimen de una sola vez.",
     {
      "py": "import sys\n\ndef main():\n    data = sys.stdin.buffer.read().split()\n    n = int(data[0])\n    a = list(map(int, data[1:1 + n]))\n    out = []\n    out.append(str(sum(a)))\n    sys.stdout.write(\"\\n\".join(out) + \"\\n\")\n\nmain()"
     },
     "Poner el código dentro de `main()` no es solo estilo: en Python las variables locales se acceden más rápido que las globales. Es la primera de muchas optimizaciones pequeñas que verás en el curso."
    ],
    "algs": [],
    "teo": [
     [
      "Data Structures",
      "Análisis amortizado"
     ]
    ],
    "preguntas": [
     {
      "q": "Tienes n ≤ 2·10⁵ y una idea O(n²). ¿Entra en 1 segundo?",
      "a": "No: son 4·10¹⁰ operaciones, cientos de veces más de lo permitido. Hay que buscar algo O(n log n)."
     },
     {
      "q": "¿Por qué decimos que O(n log n) y O(n) \"casi\" son lo mismo en la práctica?",
      "a": "Porque log₂(2·10⁵) ≈ 18: el factor extra es pequeño. Entre O(n) y O(n²), en cambio, hay un factor de n."
     },
     {
      "q": "Si duplicas n en un algoritmo O(n²), ¿cuánto crece el tiempo?",
      "a": "Se multiplica por 4, porque (2n)² = 4n²."
     }
    ],
    "cierre": "Desde ahora, antes de programar algo, estima su complejidad y compárala con las restricciones. Ese hábito te ahorra la mitad de los errores."
   },
   {
    "t": "Búsqueda binaria y dos punteros",
    "obj": [
     "Buscar en un arreglo ordenado en O(log n).",
     "Reconocer cuándo la respuesta es \"monótona\" para buscarla con bisección.",
     "Usar el orden para eliminar trabajo con dos punteros."
    ],
    "clase": [
     "Ordenar cuesta O(n log n), y es una de las mejores inversiones que puedes hacer: un arreglo ordenado permite descartar la mitad de los candidatos con una sola pregunta. Esa es la idea de la **búsqueda binaria**.",
     {
      "h": "El invariante"
     },
     "La forma más segura de escribirla es pensar en un invariante: mantenemos `lo` en una posición donde la condición es falsa y `hi` donde es verdadera. Mientras estén separados por más de uno, miramos el punto medio y movemos el extremo que corresponda. Al terminar, `hi` es la primera posición verdadera.",
     {
      "py": "def primera_verdadera(lo, hi, ok):\n    # ok(lo) es False y ok(hi) es True\n    while hi - lo > 1:\n        mid = (lo + hi) // 2\n        if ok(mid):\n            hi = mid\n        else:\n            lo = mid\n    return hi"
     },
     "Python ya trae esto en el módulo `bisect`: `bisect_left(a, x)` devuelve la primera posición con `a[i] >= x`. Lo verás en la lección de la librería.",
     {
      "h": "Buscar la respuesta"
     },
     "El salto conceptual grande de este capítulo es que **no hace falta tener un arreglo**. Si te preguntan el menor tiempo t en el que se pueden fabricar k productos, la función \"¿se alcanzan k productos en t?\" es falsa y luego verdadera para siempre. Eso basta para buscar t con bisección. Muchos problemas de optimización \"minimiza el máximo\" o \"maximiza el mínimo\" se resuelven así.",
     "La búsqueda ternaria es la prima para funciones que suben y luego bajan (unimodales): en vez de una condición verdadera o falsa, comparas dos puntos y descartas un tercio.",
     {
      "h": "Dos punteros"
     },
     "Cuando el arreglo está ordenado y buscas un par con suma x, no hace falta probar todos los pares. Con un índice al inicio y otro al final: si la suma es pequeña, avanzas el izquierdo; si es grande, retrocedes el derecho. Cada paso descarta un elemento para siempre, así que el total es O(n)."
    ],
    "algs": [
     "FunctionalTools-Codes-BS",
     "FunctionalTools-Codes-BS-library",
     "FunctionalTools-Codes-BinarySearchAnswer",
     "FunctionalTools-Classic-Problems-Array-Division",
     "FunctionalTools-Codes-TS",
     "Data-Structures-Algorithms-TwoPointers"
    ],
    "teo": [
     [
      "FunctionalTools",
      "Correctitud de la búsqueda binaria"
     ]
    ],
    "preguntas": [
     {
      "q": "¿Cuántas iteraciones hace la búsqueda binaria sobre 10⁹ valores posibles?",
      "a": "Unas 30, porque 2³⁰ ≈ 10⁹."
     },
     {
      "q": "En \"búsqueda de la respuesta\", ¿qué propiedad debe tener la función ok(t)?",
      "a": "Debe ser monótona: si ok(t) es verdadera, también lo es para todo t mayor."
     },
     {
      "q": "¿Por qué dos punteros nunca se salta la pareja correcta?",
      "a": "Si la suma es menor que x, el elemento izquierdo no puede formar pareja con nadie a la izquierda del derecho, así que descartarlo es seguro (y lo simétrico para el derecho)."
     }
    ],
    "cierre": "Siempre que veas \"mínimo valor tal que…\" pregúntate si la condición es monótona. Si lo es, ya tienes la mitad de la solución."
   },
   {
    "t": "Matemáticas para programar",
    "obj": [
     "Encontrar todos los primos hasta 10⁷.",
     "Calcular potencias e inversos módulo un primo.",
     "Acelerar recurrencias lineales con matrices."
    ],
    "clase": [
     "Muchos problemas piden la respuesta \"módulo 10⁹ + 7\". No es capricho: los números reales de la respuesta tienen miles de dígitos, y trabajar módulo un primo grande mantiene todo pequeño sin perder información para el juez.",
     {
      "h": "La criba"
     },
     "Para saber qué números son primos hasta N, en vez de probar divisores uno por uno, se tachan los múltiplos de cada primo. El costo total es `N/2 + N/3 + N/5 + …`, que da O(N log log N): prácticamente lineal.",
     {
      "h": "Exponenciación binaria"
     },
     "Para calcular `a^b mod m` con b de hasta 10¹⁸ no puedes multiplicar b veces. Pero `a^b = (a^(b/2))²` si b es par. Mirando los bits de b, bastan unos 60 productos. En Python existe `pow(a, b, m)`, que hace exactamente esto.",
     {
      "py": "def binpow(a, b, m):\n    r = 1\n    a %= m\n    while b:\n        if b & 1:\n            r = r * a % m\n        a = a * a % m\n        b >>= 1\n    return r"
     },
     {
      "h": "Dividir módulo un primo"
     },
     "No se puede dividir directamente, pero el **pequeño teorema de Fermat** dice que si p es primo, `a^(p-1) ≡ 1 (mod p)`. Por lo tanto el inverso de a es `a^(p-2)`. Con factoriales e inversos precalculados, cualquier coeficiente binomial sale en O(1).",
     {
      "h": "Matrices"
     },
     "Una recurrencia como Fibonacci, `F(n) = F(n-1) + F(n-2)`, se puede escribir como una matriz 2×2 que multiplica al vector (F(n-1), F(n-2)). Elevar esa matriz a la n con exponenciación binaria da F(n) en O(log n), incluso para n = 10¹⁸."
    ],
    "algs": [
     "FunctionalTools-Codes-Sieve",
     "FunctionalTools-Classic-Problems-Counting-Divisors",
     "FunctionalTools-Codes-ModArithmetic",
     "FunctionalTools-Classic-Problems-Exponentiation",
     "FunctionalTools-Codes-MatrixExponentiation",
     "FunctionalTools-Classic-Problems-Distributing-Apples",
     "FunctionalTools-Classic-Problems-Prime-Multiples"
    ],
    "teo": [
     [
      "FunctionalTools",
      "Criba de Eratóstenes"
     ],
     [
      "FunctionalTools",
      "Exponenciación binaria"
     ],
     [
      "FunctionalTools",
      "Pequeño teorema de Fermat"
     ],
     [
      "FunctionalTools",
      "Algoritmo de Euclides e identidad de Bézout"
     ],
     [
      "FunctionalTools",
      "Teorema fundamental de la aritmética"
     ],
     [
      "FunctionalTools",
      "Inverso modular"
     ],
     [
      "FunctionalTools",
      "Fórmula de Legendre"
     ]
    ],
    "preguntas": [
     {
      "q": "¿Por qué en la criba basta empezar a tachar desde p²?",
      "a": "Los múltiplos menores de p² tienen un factor primo menor que p, así que ya fueron tachados."
     },
     {
      "q": "¿Cuántas multiplicaciones hace binpow con b = 10¹⁸?",
      "a": "Alrededor de 2·60 = 120, porque 10¹⁸ tiene unos 60 bits."
     },
     {
      "q": "¿Funciona el truco de Fermat para el inverso si el módulo no es primo?",
      "a": "No en general. Para módulos compuestos se usa Euclides extendido, y solo existe inverso si a y m son coprimos."
     }
    ],
    "cierre": "Guarda en tu cabeza tres herramientas: criba, pow(a, b, m) y factoriales con inversos. Aparecen en todas partes."
   },
   {
    "t": "Estructuras lineales",
    "obj": [
     "Usar pilas, colas y deques según el orden de salida que necesites.",
     "Mantener el mínimo o máximo de una ventana en O(1) amortizado.",
     "Usar heaps para sacar siempre el mejor elemento.",
     "Procesar eventos en orden con una línea de barrido."
    ],
    "clase": [
     "Una estructura de datos es un acuerdo: tú prometes usar solo ciertas operaciones, y a cambio la estructura las hace rápido. Elegir la estructura correcta es la mitad del diseño de un algoritmo.",
     {
      "h": "Pila, cola y deque"
     },
     "La **pila** saca primero lo último que entró; la **cola**, lo primero. En Python, una lista sirve de pila (`append` y `pop`), pero para colas usa `collections.deque`: `list.pop(0)` cuesta O(n) y `deque.popleft()` cuesta O(1).",
     "La pila monótona es una técnica fundamental: para encontrar el \"valor menor más cercano a la izquierda\" de cada posición, se sacan de la pila los elementos que ya nunca podrán ser respuesta. Cada elemento entra y sale una vez, así que el total es O(n) aunque haya un `while` dentro del `for`. Eso es **análisis amortizado**.",
     {
      "h": "Heaps"
     },
     "Un heap mantiene a la mano el elemento más pequeño, con inserción y extracción en O(log n). En Python es `heapq`. Es la base de Dijkstra, de los problemas de \"las k mejores combinaciones\" y de cualquier simulación por eventos.",
     {
      "py": "import heapq\nh = []\nheapq.heappush(h, 5)\nheapq.heappush(h, 2)\nheapq.heappush(h, 8)\nprint(heapq.heappop(h))  # 2"
     },
     {
      "nota": "Truco de rendimiento del repositorio: en Python, guardar tuplas en el heap es lento. Si los valores caben, se codifica (valor, índice) en un solo entero como valor * N + índice."
     },
     {
      "h": "Línea de barrido"
     },
     "Muchos problemas de intervalos se simplifican si conviertes cada intervalo en dos eventos (entra y sale), los ordenas y recorres el tiempo. Solo importan los instantes en que algo cambia."
    ],
    "algs": [
     "Data-Structures-Algorithms-Stack",
     "Data-Structures-Algorithms-Deque",
     "Data-Structures-Classic-Problems-Team-Queue",
     "Data-Structures-Algorithms-Heap",
     "Data-Structures-Classic-Problems-K-Smallest-Sums",
     "Data-Structures-Algorithms-SweepLine"
    ],
    "teo": [
     [
      "Data Structures",
      "Análisis amortizado"
     ],
     [
      "Data Structures",
      "Propiedad del heap"
     ]
    ],
    "preguntas": [
     {
      "q": "La pila monótona tiene un while dentro de un for. ¿Por qué no es O(n²)?",
      "a": "Porque cada elemento se apila una vez y se desapila a lo sumo una vez: el while hace como mucho n iteraciones en total."
     },
     {
      "q": "¿Qué estructura usarías para atender pedidos siempre por el de mayor prioridad?",
      "a": "Un heap (en Python, heapq con prioridades negadas para tener un máximo)."
     }
    ],
    "cierre": "Pila, cola, deque y heap son tus herramientas diarias. El análisis amortizado explica por qué muchos ciclos anidados en realidad son lineales."
   },
   {
    "t": "Búsqueda exhaustiva inteligente",
    "obj": [
     "Recorrer los 2ⁿ subconjuntos de forma ordenada.",
     "Partir una búsqueda exponencial en dos mitades."
    ],
    "clase": [
     "A veces no hay atajo y hay que probar todo. La pregunta es cómo probarlo con el menor costo posible. Con n ≤ 20, los 2²⁰ ≈ un millón de subconjuntos se pueden revisar uno por uno; cada subconjunto es un número cuyos bits encendidos dicen qué elementos lo forman.",
     {
      "py": "for mask in range(1 << n):\n    suma = 0\n    for i in range(n):\n        if mask >> i & 1:\n            suma += a[i]"
     },
     "El **código Gray** ordena los subconjuntos para que cada uno difiera del anterior en un solo elemento: así puedes actualizar la suma en O(1) en vez de recalcularla.",
     {
      "h": "Meet in the middle"
     },
     "Con n = 40, 2⁴⁰ es demasiado. Pero puedes partir los elementos en dos mitades de 20, listar las sumas de cada mitad (2²⁰ cada una) y combinarlas con un diccionario o con dos punteros. Pasas de 2ⁿ a 2^(n/2): la raíz cuadrada del trabajo. Es un ejemplo perfecto de cómo un poco de memoria compra muchísimo tiempo."
    ],
    "algs": [
     "FunctionalTools-Codes-GrayCode",
     "FunctionalTools-Codes-MeetInTheMiddle"
    ],
    "teo": [
     [
      "FunctionalTools",
      "Meet in the middle"
     ]
    ],
    "preguntas": [
     {
      "q": "¿Cuántos subconjuntos tiene un conjunto de 40 elementos y cuántos revisa meet in the middle?",
      "a": "2⁴⁰ ≈ 10¹² contra 2·2²⁰ ≈ 2·10⁶ (más el costo de combinarlos)."
     },
     {
      "q": "Escribe el i-ésimo código Gray.",
      "a": "i ^ (i >> 1)."
     }
    ],
    "cierre": "Cuando n es pequeño, la fuerza bruta es una opción válida y elegante. Cuando es un poco grande, piensa si puedes partirla en dos."
   }
  ]
 },
 {
  "parte": "II. Programación dinámica",
  "caps": [
   {
    "t": "Introducción a la programación dinámica",
    "obj": [
     "Definir un estado y una transición.",
     "Pasar de una recursión exponencial a una tabla.",
     "Resolver problemas de monedas y mochila."
    ],
    "clase": [
     "La programación dinámica (DP) es la técnica más importante de la programación competitiva y, honestamente, la que más cuesta al principio. La idea es simple: **si un problema grande se arma con respuestas de problemas pequeños, y esos pequeños se repiten, guarda sus respuestas**.",
     {
      "h": "Estado y transición"
     },
     "Diseñar una DP es responder dos preguntas. Primero, ¿qué información mínima describe un subproblema? Eso es el **estado**. Segundo, ¿de qué estados más pequeños sale la respuesta? Eso es la **transición**. Por ejemplo, en \"menor número de monedas para formar x\", el estado es la cantidad x y la transición es probar cuál fue la última moneda usada.",
     {
      "py": "INF = float(\"inf\")\ndp = [0] + [INF] * x\nfor s in range(1, x + 1):\n    for c in monedas:\n        if c <= s and dp[s - c] + 1 < dp[s]:\n            dp[s] = dp[s - c] + 1"
     },
     "El costo de una DP casi siempre es **número de estados × costo de cada transición**. Aquí son x estados y n monedas: O(n·x).",
     {
      "h": "El orden de los ciclos importa"
     },
     "Contar formas de pagar x es casi el mismo código, pero si el ciclo de monedas va por fuera, cuentas combinaciones (sin importar el orden); si va por dentro, cuentas secuencias ordenadas. Esta sutileza es un clásico de examen: entiende por qué antes de seguir.",
     {
      "h": "Mochila"
     },
     "En la mochila 0/1 cada objeto se usa a lo sumo una vez. El truco para hacerlo con un solo arreglo es recorrer las capacidades **de mayor a menor**, para no reutilizar el objeto que acabas de poner. Nota que O(n·x) depende del **valor** de x, no de su número de dígitos: por eso se dice que es pseudo-polinomial.",
     {
      "h": "Kadane"
     },
     "El subarreglo de suma máxima es la DP más corta que existe: la mejor suma que termina en i es `max(a[i], mejor[i-1] + a[i])`. Una línea, O(n)."
    ],
    "algs": [
     "DP-Classic-Problems-Dice-Combinations",
     "DP-Classic-Problems-Grid-Paths-I",
     "DP-Algorithms-Kadane1D",
     "DP-Algorithms-CoinChange",
     "DP-Algorithms-CoinCombinations",
     "DP-Algorithms-Knapsack",
     "DP-Classic-Problems-Money-Sums"
    ],
    "teo": [
     [
      "DP",
      "Principio de optimalidad de Bellman"
     ],
     [
      "DP",
      "Número de estados × costo de transición"
     ],
     [
      "DP",
      "Mochila: pseudo-polinomial"
     ]
    ],
    "preguntas": [
     {
      "q": "En mochila 0/1 con un solo arreglo, ¿qué pasa si recorres la capacidad de menor a mayor?",
      "a": "Cada objeto puede usarse varias veces: obtienes la mochila \"sin límite\" en vez de la 0/1."
     },
     {
      "q": "¿Cuál es el estado de Kadane y cuál su transición?",
      "a": "Estado: mejor suma de un subarreglo que termina en i. Transición: o empiezas en i, o extiendes el mejor que termina en i − 1."
     }
    ],
    "cierre": "Toda DP se diseña igual: estado, transición, casos base y orden de cálculo. Escríbelos en papel antes de programar."
   },
   {
    "t": "DP sobre secuencias",
    "obj": [
     "Encontrar la subsecuencia creciente más larga en O(n²) y en O(n log n).",
     "Comparar dos cadenas con tablas 2D (LCS y distancia de edición).",
     "Extender Kadane a matrices."
    ],
    "clase": [
     "Ahora los estados tienen dos dimensiones o necesitan una estructura extra para ser rápidos. Este capítulo es el puente entre la DP de juguete y la DP de competencia.",
     {
      "h": "LIS: dos versiones"
     },
     "La versión O(n²) define `dp[i]` = la LIS más larga que termina en i, y prueba todos los j < i. La versión O(n log n) cambia la pregunta: `t[k]` = el menor final posible de una subsecuencia creciente de largo k + 1. Ese arreglo siempre está ordenado, así que cada elemento nuevo se ubica con búsqueda binaria. Es un ejemplo hermoso de **optimizar cambiando el estado**, no el código.",
     {
      "py": "from bisect import bisect_left\nt = []\nfor x in a:\n    k = bisect_left(t, x)\n    if k == len(t):\n        t.append(x)\n    else:\n        t[k] = x\nprint(len(t))"
     },
     {
      "h": "Dos cadenas, una tabla"
     },
     "Para LCS y distancia de edición, el estado es (i, j): \"los primeros i caracteres de una y los primeros j de la otra\". Cada casilla mira a sus vecinas de arriba, izquierda y diagonal. Reconstruir la respuesta es caminar la tabla hacia atrás siguiendo de dónde vino cada valor.",
     {
      "h": "Kadane en 2D"
     },
     "Fijar un par de filas convierte la matriz en un arreglo de sumas de columna, y sobre él corres Kadane. Es una técnica general: **fijar una dimensión para reducir el problema a uno que ya sabes resolver**."
    ],
    "algs": [
     "DP-Algorithms-LIS-I",
     "DP-Algorithms-LIS-II",
     "DP-Algorithms-LCS",
     "DP-Algorithms-EditDistance",
     "DP-Algorithms-Kadane2D",
     "DP-Classic-Problems-Removal-Game"
    ],
    "teo": [
     [
      "DP",
      "Cota inferior de la LIS"
     ],
     [
      "DP",
      "Teorema de Erdős–Szekeres"
     ],
     [
      "DP",
      "Teorema de Dilworth (y su dual de Mirsky)"
     ]
    ],
    "preguntas": [
     {
      "q": "En LIS O(n log n), ¿el arreglo t es una subsecuencia creciente real?",
      "a": "No necesariamente: solo su longitud es correcta. Para reconstruir la secuencia hay que guardar de qué posición vino cada elemento."
     },
     {
      "q": "¿Cuántos estados tiene la distancia de edición entre cadenas de largo n y m?",
      "a": "(n + 1)(m + 1)."
     }
    ],
    "cierre": "Cuando una DP es lenta, antes de micro-optimizar pregúntate si hay otro estado con mejor estructura (ordenado, monótono) que permita usar búsqueda binaria o una estructura de datos."
   },
   {
    "t": "DP avanzada",
    "obj": [
     "Usar subconjuntos como estados.",
     "Contar números con DP de dígitos.",
     "Conocer las optimizaciones que aparecen en finales."
    ],
    "clase": [
     "Con bitmasks, el estado es un subconjunto codificado en un entero. Con n ≤ 20 hay 2ⁿ estados, y por cada uno se prueban n transiciones: O(2ⁿ·n), que es justo el límite. El problema del ascensor muestra además que un estado puede guardar **un par** (viajes, peso del último viaje) que se compara lexicográficamente.",
     "La **DP de dígitos** cuenta los números de [a, b] que cumplen algo (aquí: sin dos dígitos vecinos iguales). Se cuenta f(b) − f(a − 1), y el estado es (posición, último dígito, ¿ya soy menor que el límite?, ¿ya empecé?). La bandera \"ajustado\" es la clave: mientras sigas pegado al límite, el siguiente dígito no puede superarlo.",
     {
      "h": "Hacia las finales"
     },
     "En niveles altos, la DP no cambia de idea, pero las transiciones se aceleran con estructura matemática: si la función de costo cumple la desigualdad del cuadrángulo, el punto óptimo de corte es monótono (Knuth, divide y vencerás); si las transiciones son rectas, el **Convex Hull Trick** las responde en O(log n); y si hay una restricción de \"exactamente k\", el **truco de Aliens** la convierte en una penalización lagrangiana. Lee esas entradas de teoría: son el puente entre este curso y la optimización matemática."
    ],
    "algs": [
     "DP-Algorithms-BitmaskDP",
     "DP-Classic-Problems-Counting-Numbers"
    ],
    "teo": [
     [
      "DP",
      "DP sobre subconjuntos y SOS (suma sobre subconjuntos)"
     ],
     [
      "DP",
      "Principio de optimalidad de Bellman"
     ],
     [
      "DP",
      "Número de estados × costo de transición"
     ]
    ],
    "preguntas": [
     {
      "q": "¿Cuántos estados y transiciones tiene una DP de bitmask con n = 20?",
      "a": "2²⁰ ≈ 10⁶ estados con 20 transiciones cada uno: unos 2·10⁷ pasos."
     },
     {
      "q": "¿Qué relación tiene el truco de Aliens con la optimización continua?",
      "a": "Es relajación lagrangiana: se quita la restricción \"exactamente k\" y se cobra una penalización λ por cada elemento, ajustando λ con búsqueda binaria."
     }
    ],
    "cierre": "Ya tienes las bases de DP. En las finales, la DP se combina con convexidad y dualidad: conceptos de optimización que vale la pena estudiar formalmente."
   },
   {
    "t": "Optimizaciones de DP",
    "obj": [
     "Contar números en rangos enormes con DP de dígitos genérica.",
     "Sumar sobre subconjuntos en O(B·2^B).",
     "Acelerar transiciones lineales con el Convex Hull Trick.",
     "Bajar un factor n con divide y vencerás y con Knuth."
    ],
    "clase": [
     "Muchas DP de finales tienen una solución O(n²) u O(n³) evidente que no entra en el tiempo. La idea no cambia: se acelera la **transición** aprovechando estructura matemática. Este capítulo reúne las cinco aceleraciones que más aparecen.",
     {
      "h": "Dígitos y subconjuntos"
     },
     "La **DP de dígitos** cuenta f(N) recorriendo el camino \"pegado\" a N: cada vez que se pone un dígito menor, el resto queda libre y se cuenta con una tabla que no depende de N. La **SOS DP** suma sobre subconjuntos procesando un bit a la vez: O(B·2^B) en vez de O(3^B).",
     {
      "h": "Convex Hull Trick"
     },
     "Si la transición es `dp[i] = min_j (m_j·x_i + b_j)`, cada j es una recta y la consulta es el punto más bajo en x_i. Con pendientes y consultas monótonas, una deque da O(n) en total; si no, Li Chao o búsqueda binaria en la envolvente.",
     {
      "py": "# dp[i] = min_j dp[j] + s[i]*f[j]: la recta de j es y = f[j]*x + dp[j]\n# consultar en x = s[i] el mínimo de todas las rectas ya agregadas"
     },
     {
      "h": "Monotonía del corte óptimo"
     },
     "Si el mejor corte `opt(i)` no baja al crecer i, una capa de la DP se calcula con **divide y vencerás** en O(n log n). En DP de intervalos, si `opt[i][j−1] ≤ opt[i][j] ≤ opt[i+1][j]` (**Knuth**), la suma de los rangos probados telescopa y todo baja de O(n³) a O(n²). Ambas monotonías salen de la **desigualdad del cuadrángulo** del costo.",
     {
      "nota": "Antes de usar D&C o Knuth, verifica la monotonía con una DP lenta en casos pequeños al azar: es la forma práctica de \"demostrarla\" en competencia."
     }
    ],
    "algs": [
     "DP-Optimizations-DigitDP",
     "DP-Optimizations-SOSDP",
     "DP-Optimizations-ConvexHullTrick",
     "DP-Optimizations-DivideAndConquerDP",
     "DP-Optimizations-KnuthOptimization"
    ],
    "teo": [
     [
      "DP",
      "DP sobre subconjuntos y SOS (suma sobre subconjuntos)"
     ],
     [
      "DP",
      "Convex Hull Trick y Li Chao"
     ],
     [
      "DP",
      "Divide y vencerás para DP"
     ],
     [
      "DP",
      "Desigualdad del cuadrángulo y optimización de Knuth"
     ],
     [
      "DP",
      "Truco de Aliens (WQS / relajación lagrangiana)"
     ]
    ],
    "preguntas": [
     {
      "q": "¿Por qué en la DP de dígitos no se memorizan los estados \"pegados\"?",
      "a": "Porque dependen del número límite N; los estados libres solo dependen de cuántos dígitos faltan y del estado, y se reutilizan para todas las consultas."
     },
     {
      "q": "Con pendientes decrecientes y consultas crecientes, ¿por qué una recta que sale por el frente de la deque no vuelve a servir?",
      "a": "Porque perdió contra la siguiente en un x y, como las consultas solo crecen y la siguiente tiene pendiente menor, seguirá perdiendo para todo x mayor."
     },
     {
      "q": "¿Cuánto cuesta en total una capa con divide y vencerás?",
      "a": "O(n log n): cada nivel de la recursión prueba O(n) cortes en total y hay log n niveles."
     }
    ],
    "cierre": "Las cinco aceleraciones comparten una idea: encontrar orden (en los dígitos, en los bits, en las rectas o en los cortes óptimos) y no volver a revisar lo que ese orden ya descarta."
   },
   {
    "t": "DP de finales: perfil roto, Aliens y slope trick",
    "obj": [
     "Llenar tableros angostos con una máscara de frontera.",
     "Quitar una restricción de cantidad con una penalización λ.",
     "Representar una DP convexa solo por sus puntos de quiebre."
    ],
    "clase": [
     "En finales aparecen DP cuyo estado ingenuo es demasiado grande. Las tres técnicas de este capítulo comparten una idea: guardar solo lo que el futuro necesita.",
     {
      "h": "Perfil roto"
     },
     "En un tablero de n × m con n pequeño, lo único que importa para seguir llenando es qué celdas de la frontera ya están ocupadas. Avanzar celda por celda (en vez de columna por columna) deja a lo sumo dos o tres transiciones por estado y el costo baja a O(n·m·2ⁿ).",
     {
      "h": "Aliens (relajación lagrangiana)"
     },
     "Si piden «exactamente k» o «a lo sumo k» y la respuesta f(k) es cóncava, se cobra λ por cada uso y se resuelve sin límite; la DP pierde una dimensión. Una búsqueda binaria sobre λ encuentra el valor para el que la DP elige k usos. Antes de usarlo, convéncete de la concavidad (probándola con fuerza bruta en casos pequeños si hace falta).",
     {
      "nota": "Desempata siempre por la cantidad (la menor) dentro de la DP penalizada; sin eso la búsqueda binaria sobre λ deja de ser monótona."
     },
     {
      "h": "Slope trick"
     },
     "dp(x) convexa y lineal por tramos se describe por los x donde cambia la pendiente. Sumar |x − a| agrega un quiebre; tomar mínimo prefijo elimina la parte creciente. Un heap mantiene todo en O(n log n), aunque los valores de x sean enormes."
    ],
    "algs": [
     "DP-Algorithms-BrokenProfile",
     "DP-Optimizations-Aliens",
     "DP-Optimizations-SlopeTrick"
    ],
    "teo": [
     [
      "DP",
      "Truco de Aliens (WQS / relajación lagrangiana)"
     ],
     [
      "DP",
      "Slope trick"
     ]
    ],
    "preguntas": [
     {
      "q": "¿Por qué el perfil roto recorre la dimensión pequeña dentro de la grande y no al revés?",
      "a": "La máscara tiene un bit por fila de la dimensión que se recorre por dentro; con n = 10 son 1024 estados, con m = 1000 serían 2^1000."
     },
     {
      "q": "Con Aliens, ¿qué pasa si f(k) no es cóncava?",
      "a": "Algunos k nunca son elegidos por ningún λ y la respuesta sale mal sin aviso: hay que comprobar la concavidad antes."
     }
    ],
    "cierre": "Estado = lo mínimo que el futuro necesita saber. Si el estado sigue siendo grande, busca convexidad (Aliens, slope trick) o una frontera (perfil)."
   }
  ]
 },
 {
  "parte": "III. Estructuras de datos: consultas en rangos",
  "caps": [
   {
    "t": "Consultas en rangos: prefijos, Sparse Table y Fenwick",
    "obj": [
     "Responder sumas de rangos en O(1) con prefijos (1D y 2D).",
     "Responder mínimos de rangos en O(1) con Sparse Table.",
     "Sumar con actualizaciones puntuales usando Fenwick."
    ],
    "clase": [
     "Muchos problemas se reducen a \"dame la suma (o el mínimo) entre las posiciones l y r\", repetido cientos de miles de veces. Recorrer el rango cada vez cuesta O(n) por consulta: demasiado. Esta parte es una escalera de estructuras, cada una más general que la anterior; en este capítulo están los tres primeros peldaños.",
     {
      "h": "Sumas de prefijos"
     },
     "Si el arreglo no cambia, guarda `p[i] = a[0] + … + a[i-1]` y entonces la suma de [l, r) es `p[r] - p[l]`. O(1) por consulta. En 2D, `p[i][j]` es la suma del rectángulo de (0,0) a (i−1, j−1) y un rectángulo cualquiera sale con inclusión-exclusión de cuatro prefijos.",
     {
      "py": "p = [0]\nfor x in a:\n    p.append(p[-1] + x)\n# suma de a[l..r] inclusive\nprint(p[r + 1] - p[l])"
     },
     {
      "h": "Sparse Table"
     },
     "Para mínimos no puedes \"restar\". Pero el mínimo es **idempotente**: tomar un elemento dos veces no cambia el resultado. Así que basta guardar los mínimos de los bloques de largo 2^k y cubrir cualquier rango con dos bloques que se solapan. O(n log n) de preparación y O(1) por consulta.",
     {
      "h": "Fenwick"
     },
     "Cuando hay actualizaciones, se necesita un árbol. El Fenwick guarda en `bit[i]` la suma de un tramo de largo `i & -i` que termina en i; subir y bajar por esos tramos toca a lo sumo log n casillas. Es compacto y rapidísimo para sumas, pero necesita poder \"restar\" para sacar un rango de dos prefijos. Con el truco de las diferencias (`d[l] += x`, `d[r+1] -= x`) también suma en rangos y consulta puntos."
    ],
    "algs": [
     "Data-Structures-Classic-Problems-Static-Range-Sum-Queries",
     "Data-Structures-Classic-Problems-Forest-Queries",
     "Data-Structures-Algorithms-SparseTable",
     "Data-Structures-Algorithms-FenwickTree",
     "Data-Structures-Classic-Problems-Range-Update-Queries"
    ],
    "teo": [
     [
      "Data Structures",
      "Operaciones idempotentes en Sparse Table"
     ],
     [
      "Data Structures",
      "Cota de Fenwick"
     ]
    ],
    "preguntas": [
     {
      "q": "¿Por qué la Sparse Table no sirve para sumas con dos bloques solapados?",
      "a": "Porque la suma no es idempotente: los elementos de la zona común se contarían dos veces."
     },
     {
      "q": "Con Fenwick, ¿cómo sumas x a todo [l, r] y luego preguntas el valor de una posición?",
      "a": "Guardas el arreglo de diferencias: sumas x en l y restas x en r + 1; el valor de la posición i es la suma de prefijo hasta i."
     }
    ],
    "cierre": "Sin cambios: prefijos para sumas y Sparse Table para mínimos. Con cambios puntuales y sumas: Fenwick. Para lo demás, el siguiente capítulo."
   },
   {
    "t": "Segment Tree, propagación perezosa y Mo",
    "obj": [
     "Usar el Segment Tree con cualquier operación asociativa.",
     "Descender por el árbol para buscar la primera posición que cumple algo.",
     "Modificar rangos enteros con Lazy Segment Tree.",
     "Reordenar consultas con el algoritmo de Mo."
    ],
    "clase": [
     {
      "h": "Segment Tree"
     },
     "El Segment Tree es la navaja suiza: cada nodo guarda el resultado de una operación sobre su tramo, y funciona con **cualquier operación asociativa que tenga neutro** (suma con 0, mínimo con +∞, máximo con −∞, gcd con 0, xor con 0…). No necesita restar ni que la operación sea idempotente. Todo rango se descompone en a lo sumo unos 2 log n nodos: ese es el teorema que hace funcionar todo.",
     "Los nodos no tienen que guardar un solo número. Para responder el mejor prefijo de un rango, cada nodo guarda dos (la suma y el mejor prefijo) y la combinación es `(s1 + s2, max(p1, s1 + p2))`. Diseñar qué guarda cada nodo y cómo se combinan dos hijos es el 90 % del trabajo.",
     {
      "h": "Descender por el árbol"
     },
     "Para encontrar la primera posición con valor ≥ x (por ejemplo, el primer contenedor con espacio suficiente), en vez de búsqueda binaria más consultas (O(log² n)), se baja desde la raíz: si el hijo izquierdo tiene un máximo suficiente, se va a la izquierda; si no, a la derecha. O(log n).",
     {
      "h": "Lazy Segment Tree"
     },
     "Si además hay que modificar rangos enteros (sumar x o asignar x a [l, r]), se agrega **propagación perezosa**: la modificación se anota en los nodos que cubren el rango y se baja a los hijos solo cuando hace falta. Así las modificaciones de rango también cuestan O(log n). La parte delicada es componer dos marcas pendientes (por ejemplo, \"asignar 5\" y luego \"sumar 2\" es \"asignar 7\").",
     {
      "h": "Mo: cuando ninguna estructura sirve"
     },
     "Si la operación es difícil de combinar (por ejemplo, contar valores distintos), Mo ordena las consultas por bloques de tamaño √n para que los extremos se muevan poco en total: O((n + q)√n). Es un algoritmo **offline**: necesita conocer todas las consultas de antemano."
    ],
    "algs": [
     "Data-Structures-Algorithms-SegmentTree",
     "Data-Structures-Classic-Problems-Hotel-Queries",
     "Data-Structures-Classic-Problems-Prefix-Sum-Queries",
     "Data-Structures-Algorithms-LazySegmentTree",
     "Data-Structures-Algorithms-MoAlgorithm"
    ],
    "teo": [
     [
      "Data Structures",
      "Descomposición canónica del Segment Tree"
     ],
     [
      "Data Structures",
      "Algoritmo de Mo"
     ],
     [
      "Data Structures",
      "Estructuras persistentes"
     ]
    ],
    "preguntas": [
     {
      "q": "¿Qué guarda la \"marca perezosa\" de un nodo?",
      "a": "Una actualización que aplica a todo su rango y que aún no se ha bajado a los hijos; se empuja solo cuando hace falta visitarlos."
     },
     {
      "q": "Si las consultas llegan una por una y dependen de la respuesta anterior, ¿puedes usar Mo?",
      "a": "No: Mo es offline, necesita reordenar las consultas."
     },
     {
      "q": "¿Qué tienen que guardar los nodos para responder \"suma máxima de un subarreglo\" en un rango?",
      "a": "Cuatro valores: suma total, mejor prefijo, mejor sufijo y mejor subarreglo. Al combinar, el mejor puede cruzar el medio: sufijo izquierdo + prefijo derecho."
     }
    ],
    "cierre": "Escalera para recordar: prefijos (sin cambios) → Sparse Table (mínimos sin cambios) → Fenwick (sumas con cambios) → Segment Tree (casi todo) → Lazy (cambios en rangos) → Mo (lo que no se combina)."
   },
   {
    "t": "Estructuras avanzadas: orden, persistencia y treaps",
    "obj": [
     "Usar un conjunto ordenado con k-ésimo elemento (pb_ds).",
     "Guardar todas las versiones de un arreglo con un Segment Tree persistente.",
     "Cortar, pegar e invertir secuencias con un treap implícito."
    ],
    "clase": [
     {
      "h": "Conjunto ordenado con posiciones"
     },
     "El `tree` de pb_ds (extensión de GNU C++) es un `set` que además responde `find_by_order(k)` y `order_of_key(x)` en O(log n). En Python no existe: un Fenwick de 0/1 con descenso binario hace lo mismo.",
     {
      "h": "Persistencia"
     },
     "Un cambio en un Segment Tree solo toca el camino raíz–hoja. Si en vez de modificar esos nodos se crean copias, la versión vieja queda intacta y la nueva comparte todo lo demás: O(log n) memoria por cambio. Con una versión por prefijo del arreglo se responde \"k-ésimo menor en [l, r]\" restando dos versiones.",
     {
      "h": "Treap"
     },
     "Un árbol de búsqueda con prioridades aleatorias (heap en la prioridad) tiene altura esperada O(log n). Con **split** y **merge** se arma todo lo demás; si la clave es la posición (treap implícito), una secuencia se corta y se pega como si fuera una lista, en O(log n)."
    ],
    "algs": [
     "Data-Structures-Algorithms-OrderedSet",
     "Data-Structures-Algorithms-PersistentSegmentTree",
     "Data-Structures-Algorithms-Treap"
    ],
    "teo": [
     [
      "Data Structures",
      "Estructuras persistentes"
     ],
     [
      "Data Structures",
      "Técnica de los más pequeños (small to large)"
     ]
    ],
    "preguntas": [
     {
      "q": "¿Cuántos nodos nuevos crea una actualización en un Segment Tree persistente con n = 2^17?",
      "a": "18: uno por nivel, desde la raíz hasta la hoja."
     },
     {
      "q": "¿Qué pasa con la altura de un treap si las prioridades no son aleatorias sino crecientes?",
      "a": "Degenera en una lista de altura n: cada operación cuesta O(n)."
     }
    ],
    "cierre": "Cuando el Segment Tree no alcanza: ordered_set para posiciones, persistencia para versiones y treap para secuencias que se cortan y se pegan."
   },
   {
    "t": "Técnicas offline y estructuras de finales",
    "obj": [
     "Usar el orden del tiempo o de las consultas como una dimensión más.",
     "Elegir entre CDQ, búsqueda binaria paralela y divide y vencerás sobre el tiempo.",
     "Conocer wavelet trees, Segment Tree Beats y link-cut trees."
    ],
    "clase": [
     "Cuando todas las consultas se conocen antes de responder (offline), se pueden reordenar. Muchas estructuras «imposibles» se vuelven fáciles así.",
     {
      "h": "Tres técnicas offline"
     },
     "**Divide y vencerás sobre el tiempo**: cada elemento vive en un intervalo, se cuelga de un segment tree sobre el tiempo y una estructura con deshacer (DSU sin compresión) recorre el árbol. **CDQ**: divide por una dimensión y resuelve las interacciones izquierda → derecha con un barrido; quita una dimensión por nivel de recursión. **Búsqueda binaria paralela**: muchas consultas monótonas sobre la misma secuencia de operaciones comparten cada pasada.",
     {
      "h": "Estructuras de finales"
     },
     "El **wavelet tree** responde k-ésimo y conteos por valor en rangos con O(log V). **Segment Tree Beats** permite chmin/chmax en rangos con sumas, gracias a un argumento de potencial. El **link-cut tree** mantiene un bosque que cambia (unir, cortar, consultar caminos) en O(log n) amortizado.",
     {
      "nota": "En un contest, prueba primero si una solución offline alcanza: suele ser más corta y menos propensa a errores que una estructura online."
     }
    ],
    "algs": [
     "Data-Structures-Offline-DynamicConnectivity",
     "Data-Structures-Offline-CDQ",
     "Data-Structures-Offline-ParallelBinarySearch",
     "Data-Structures-Algorithms-WaveletTree",
     "Data-Structures-Algorithms-SegmentTreeBeats",
     "Data-Structures-Algorithms-LinkCutTree"
    ],
    "teo": [
     [
      "Data Structures",
      "Divide y vencerás sobre el tiempo"
     ],
     [
      "Data Structures",
      "Potencial de Segment Tree Beats"
     ],
     [
      "Data Structures",
      "Splay trees y link-cut trees"
     ]
    ],
    "preguntas": [
     {
      "q": "¿Por qué el DSU de la conectividad dinámica no usa compresión de caminos?",
      "a": "Porque hay que deshacer cada unión en O(1) restaurando un solo puntero; la compresión cambia muchos punteros. La unión por tamaño ya da find en O(log n)."
     },
     {
      "q": "Si las consultas llegan online (cada una depende de la anterior), ¿qué técnicas de este capítulo siguen sirviendo?",
      "a": "El wavelet tree, Segment Tree Beats y el link-cut tree; CDQ, la búsqueda paralela y el divide y vencerás sobre el tiempo necesitan conocer todo antes."
     }
    ],
    "cierre": "Pregunta siempre: ¿conozco todas las consultas antes? Si sí, el orden es tuyo."
   }
  ]
 },
 {
  "parte": "IV. Grafos",
  "caps": [
   {
    "t": "Recorridos de grafos",
    "obj": [
     "Representar un grafo con listas de adyacencia.",
     "Recorrer con DFS y BFS y saber cuándo usar cada uno.",
     "Detectar ciclos, bipartición y orden topológico."
    ],
    "clase": [
     "Un grafo es un conjunto de nodos unidos por aristas: ciudades y carreteras, personas y amistades, tareas y dependencias. Una parte enorme de la programación competitiva consiste en **ver el grafo escondido** en el enunciado.",
     {
      "h": "Representación"
     },
     "En Python, la forma estándar es una lista de listas: `g[u]` contiene los vecinos de u. Ocupa O(n + m) y permite recorrer los vecinos de un nodo en tiempo proporcional a su grado.",
     {
      "py": "g = [[] for _ in range(n)]\nfor _ in range(m):\n    a, b = siguiente(), siguiente()\n    g[a - 1].append(b - 1)\n    g[b - 1].append(a - 1)"
     },
     {
      "h": "DFS y BFS"
     },
     "La **DFS** se adentra lo más posible antes de retroceder; es ideal para componentes, ciclos y todo lo que dependa de \"terminar\" un nodo. La **BFS** avanza por capas, así que el primer momento en que llega a un nodo es por el camino con menos aristas. En Python, evita la DFS recursiva en grafos grandes: el límite de recursión es bajo y es lenta. Todos los códigos del repositorio usan una pila explícita. En C++ la recursión es rápida, pero la pila del programa también se acaba: una DFS recursiva sobre un camino de 10⁶ nodos puede dar *stack overflow* (en Codeforces la pila es grande; en otros jueces y en tu máquina puede ser de 8 MB). Si el grafo puede ser una línea larga, usa pila explícita o sube el límite de pila.",
     {
      "h": "Lo que un recorrido revela"
     },
     "Con un solo recorrido puedes saber si el grafo es **bipartito** (dos colores sin conflicto ⇔ no hay ciclos impares), si tiene **ciclos** (una arista que vuelve a un ancestro en el camino actual) o, si es dirigido y sin ciclos, un **orden topológico** que respeta todas las dependencias."
    ],
    "algs": [
     "Graphs-Algorithms-Graph-Traversal-DFS",
     "Graphs-Classic-Problems-Counting-Rooms",
     "Graphs-Algorithms-Graph-Traversal-BFS",
     "Graphs-Classic-Problems-Labyrinth",
     "Graphs-Algorithms-Graph-Traversal-Bipartite",
     "Graphs-Algorithms-Miscellaneous-CycleFindingUndirected",
     "Graphs-Algorithms-Miscellaneous-CycleFindingDirected",
     "Graphs-Algorithms-Graph-Traversal-TopologicalSort",
     "Graphs-Classic-Problems-Longest-Flight-Route"
    ],
    "teo": [
     [
      "Graphs",
      "Lema del apretón de manos"
     ],
     [
      "Graphs",
      "BFS da caminos más cortos"
     ],
     [
      "Graphs",
      "Bipartito ⇔ sin ciclos impares"
     ],
     [
      "Graphs",
      "Ordenamiento topológico ⇔ DAG"
     ]
    ],
    "preguntas": [
     {
      "q": "En un grafo dirigido, ¿por qué no basta \"llegar a un nodo ya visitado\" para decir que hay ciclo?",
      "a": "Porque ese nodo puede estar ya terminado en otra rama. Hay ciclo solo si está en el camino actual de la DFS."
     },
     {
      "q": "¿Cuánto cuesta recorrer un grafo con listas de adyacencia?",
      "a": "O(n + m): cada nodo se visita una vez y cada arista se mira una o dos veces."
     }
    ],
    "cierre": "Antes de pensar en algoritmos sofisticados, pregúntate si un DFS o BFS ya resuelve el problema. Muchas veces sí."
   },
   {
    "t": "Caminos más cortos",
    "obj": [
     "Elegir entre Dijkstra, Bellman-Ford y Floyd-Warshall según el grafo.",
     "Entender por qué Dijkstra falla con pesos negativos.",
     "Detectar ciclos negativos."
    ],
    "clase": [
     "BFS resuelve caminos más cortos cuando todas las aristas pesan lo mismo. Con pesos, necesitamos ideas nuevas, y la elección depende de tres preguntas: ¿hay pesos negativos?, ¿necesito distancias desde un nodo o entre todos los pares?, ¿qué tan grande es el grafo?",
     {
      "h": "Dijkstra: avaricia correcta"
     },
     "Dijkstra saca siempre el nodo no fijado con menor distancia y lo da por definitivo. Funciona porque, con pesos no negativos, ningún camino que pase por nodos más lejanos puede volver a bajar la distancia. Con un heap, cuesta O((n + m) log n).",
     {
      "py": "import heapq\ndist = [INF] * n\ndist[s] = 0\nh = [(0, s)]\nwhile h:\n    d, u = heapq.heappop(h)\n    if d > dist[u]:\n        continue  # entrada vieja del heap\n    for v, w in g[u]:\n        if d + w < dist[v]:\n            dist[v] = d + w\n            heapq.heappush(h, (dist[v], v))"
     },
     {
      "h": "Bellman-Ford y Floyd-Warshall"
     },
     "Bellman-Ford relaja todas las aristas n − 1 veces; tolera pesos negativos y una ronda extra que todavía mejore algo delata un ciclo negativo. Floyd-Warshall calcula todos los pares con tres ciclos anidados, O(n³), ideal para n ≤ 500. Su estado es una DP: \"distancia de i a j usando solo los primeros k nodos como intermedios\".",
     {
      "nota": "Resumen: pesos ≥ 0 → Dijkstra. Pesos negativos → Bellman-Ford. Todos los pares con n pequeño → Floyd-Warshall. Pesos 0/1 → BFS con deque."
     }
    ],
    "algs": [
     "Graphs-Algorithms-Graph-Traversal-Dijkstra",
     "Graphs-Classic-Problems-Flight-Discount",
     "Graphs-Algorithms-Graph-Traversal-BellmanFord",
     "Graphs-Algorithms-Graph-Traversal-FloydWarshall"
    ],
    "teo": [
     [
      "Graphs",
      "Correctitud de Dijkstra"
     ]
    ],
    "preguntas": [
     {
      "q": "¿Por qué el código de Dijkstra salta las entradas con d > dist[u]?",
      "a": "Porque heapq no permite bajar prioridades: se insertan duplicados y las entradas viejas se ignoran al salir."
     },
     {
      "q": "Floyd-Warshall es una DP. ¿Cuál es su estado?",
      "a": "D_k[i][j] = distancia de i a j usando como intermedios solo los nodos 1..k."
     }
    ],
    "cierre": "Elegir bien el algoritmo de caminos más cortos es una decisión de una línea que separa un AC de un TLE."
   },
   {
    "t": "Conectividad y árboles de expansión",
    "obj": [
     "Unir conjuntos con DSU en tiempo casi constante.",
     "Construir árboles de expansión mínima con Kruskal y Prim."
    ],
    "clase": [
     "El **DSU** (Union-Find) responde \"¿están u y v en el mismo grupo?\" mientras se van uniendo grupos. Con dos optimizaciones, compresión de caminos y unión por tamaño, cada operación cuesta α(n), una función que es menor que 5 para cualquier n que puedas imaginar.",
     {
      "py": "def find(x):\n    while p[x] != x:\n        p[x] = p[p[x]]  # compresión a la mitad\n        x = p[x]\n    return x"
     },
     {
      "h": "Árbol de expansión mínima"
     },
     "Conectar todas las ciudades con la menor cantidad total de carretera es un problema de optimización con una solución avariciosa sorprendente: **Kruskal** ordena las aristas de menor a mayor y toma cada una que no forme ciclo (lo decide el DSU). **Prim** crece un solo árbol tomando siempre la arista más barata que sale de él. Ambos son correctos por la **propiedad del corte**: la arista más barata que cruza cualquier corte pertenece a algún árbol mínimo."
    ],
    "algs": [
     "Graphs-Algorithms-Graph-Traversal-DSU",
     "Graphs-Algorithms-MST-Kruskal",
     "Graphs-Algorithms-MST-Prim"
    ],
    "teo": [
     [
      "Data Structures",
      "Union-Find: α(n)"
     ],
     [
      "Graphs",
      "Corte y ciclo en árboles de expansión mínima"
     ],
     [
      "Graphs",
      "Caracterización de árboles"
     ]
    ],
    "preguntas": [
     {
      "q": "¿Cuándo preferirías Prim sobre Kruskal?",
      "a": "En grafos muy densos (m ≈ n²) dados como matriz: Prim sin heap cuesta O(n²), mejor que O(m log m) de Kruskal. Con heap, como en el código del repositorio, ambos cuestan O(m log n)."
     },
     {
      "q": "¿Cuántas aristas tiene un árbol de expansión de n nodos?",
      "a": "n − 1."
     }
    ],
    "cierre": "El MST es tu primer ejemplo de un algoritmo avaricioso con demostración. Aprende la propiedad del corte: es el argumento que usarás para justificar muchos otros."
   },
   {
    "t": "Componentes fuertes, 2-SAT y caminos eulerianos",
    "obj": [
     "Encontrar componentes fuertemente conexas con Tarjan y Kosaraju.",
     "Resolver 2-SAT con el grafo de implicaciones.",
     "Construir caminos que usen cada arista una vez."
    ],
    "clase": [
     "En grafos dirigidos, \"estar conectados\" tiene que ir en los dos sentidos. Una **componente fuertemente conexa** es un grupo donde todos llegan a todos. Si contraes cada componente en un nodo, lo que queda es un DAG: la estructura global del grafo.",
     "Kosaraju lo hace con dos DFS (una en el grafo y otra en el grafo invertido, en orden inverso de salida). Tarjan lo hace con una sola DFS que lleva, para cada nodo, el menor tiempo de descubrimiento alcanzable (`low`).",
     {
      "h": "2-SAT"
     },
     "Tienes variables booleanas y condiciones de la forma \"a o b\". Cada condición equivale a dos implicaciones: \"si no a, entonces b\" y \"si no b, entonces a\". Con esas flechas, la fórmula es satisfacible **si y solo si** ninguna variable queda en la misma componente fuerte que su negación. Es el ejemplo más elegante de reducir lógica a grafos.",
     {
      "h": "Caminos eulerianos"
     },
     "Un camino que usa cada arista exactamente una vez existe solo si los grados cumplen una condición simple (todos pares para un circuito; en dirigidos, entradas = salidas salvo en el inicio y el final). Hierholzer lo construye en O(n + m) pegando ciclos."
    ],
    "algs": [
     "Graphs-Algorithms-Graph-Traversal-Kosaraju",
     "Graphs-Algorithms-Graph-Traversal-Tarjan",
     "Graphs-Algorithms-Miscellaneous-2-SAT",
     "Graphs-Algorithms-Graph-Traversal-EulerianCycle",
     "Graphs-Algorithms-Graph-Traversal-HierholzerDirected"
    ],
    "teo": [
     [
      "Graphs",
      "2-SAT con componentes fuertes"
     ],
     [
      "Graphs",
      "Teorema de Euler (caminos eulerianos)"
     ]
    ],
    "preguntas": [
     {
      "q": "En 2-SAT, ¿cómo se elige el valor de cada variable una vez que hay solución?",
      "a": "Se toma el literal cuya componente aparece más tarde en el orden topológico del grafo de componentes."
     },
     {
      "q": "¿Un grafo con exactamente dos nodos de grado impar tiene circuito euleriano?",
      "a": "No tiene circuito, pero sí un camino euleriano que empieza en uno de ellos y termina en el otro."
     }
    ],
    "cierre": "Contraer componentes fuertes y trabajar en el DAG resultante es una técnica que reaparece constantemente en problemas difíciles."
   },
   {
    "t": "Puentes y puntos de articulación",
    "obj": [
     "Calcular tin y low en un DFS sin recursión.",
     "Encontrar las aristas puente y los vértices de corte.",
     "Entender por qué en grafos no dirigidos no hay aristas cruzadas."
    ],
    "clase": [
     "Una red es frágil si quitar una sola conexión (o un solo nodo) la parte en dos. Esas aristas son **puentes** y esos nodos son **puntos de articulación**. Los dos se encuentran con un único DFS, guardando dos números por nodo.",
     {
      "h": "tin y low"
     },
     "`tin[u]` es el momento en que el DFS descubre u. `low[u]` es el menor `tin` al que se puede llegar desde el subárbol de u usando una arista de retroceso. En un grafo no dirigido el DFS solo deja aristas de árbol y de retroceso, así que `low` mide exactamente \"hasta dónde puede escapar\" un subárbol.",
     {
      "h": "Las dos condiciones"
     },
     "La arista p–v es puente si `low[v] > tin[p]` (el subárbol de v no llega ni a p). El nodo p (que no es la raíz) es de articulación si algún hijo cumple `low[v] ≥ tin[p]` (llega a p, pero no más arriba). La raíz es de articulación si tiene dos o más hijos en el árbol DFS.",
     {
      "nota": "Con aristas repetidas, no se debe saltar \"al padre\" por número de nodo sino por el id de la arista: la segunda copia de una arista paralela sí es un camino de escape."
     }
    ],
    "algs": [
     "Graphs-Algorithms-Connectivity-Bridges",
     "Graphs-Algorithms-Connectivity-ArticulationPoints"
    ],
    "teo": [
     [
      "Graphs",
      "Puentes, articulaciones y low-link"
     ],
     [
      "Graphs",
      "Teorema de Menger"
     ]
    ],
    "preguntas": [
     {
      "q": "En un ciclo de 5 nodos, ¿cuántos puentes y puntos de articulación hay?",
      "a": "Ninguno: toda arista está en el ciclo y quitar un nodo deja un camino conexo."
     },
     {
      "q": "¿Por qué la condición de articulación usa ≥ y la de puente usa >?",
      "a": "Si el subárbol de v llega justo a p, quitar la arista p–v no lo desconecta (hay otra arista hacia p), pero quitar el nodo p sí."
     }
    ],
    "cierre": "Con tin y low se resuelven los problemas de \"qué es indispensable\" en una red, y son la base de las componentes biconexas y 2-arista-conexas."
   },
   {
    "t": "Árboles",
    "obj": [
     "Calcular el diámetro y las distancias máximas.",
     "Subir k niveles y encontrar ancestros comunes en O(log n).",
     "Aplanar un árbol para usar estructuras de rangos.",
     "Dividir árboles por centroides y compararlos por forma."
    ],
    "clase": [
     "Un árbol es un grafo conexo sin ciclos: entre dos nodos hay exactamente un camino. Esa unicidad lo hace mucho más manejable que un grafo general, y por eso hay tantas técnicas específicas.",
     {
      "h": "Diámetro"
     },
     "Dos BFS bastan: desde cualquier nodo al más lejano A, y desde A al más lejano B. El camino A–B es el diámetro, y además, para **cualquier** nodo, el más lejano de él es A o B (uno de los dos, no necesariamente ambos).",
     {
      "h": "Binary lifting y LCA"
     },
     "Guardar el ancestro 2^k de cada nodo permite subir cualquier cantidad de niveles mirando los bits de k. Con eso, el ancestro común más cercano sale igualando alturas y subiendo ambos nodos con saltos que no los junten. Con el LCA calculas distancias: `prof[u] + prof[v] − 2·prof[lca]`.",
     {
      "h": "Euler tour"
     },
     "Si numeras los nodos en el orden en que la DFS los visita, **cada subárbol queda en un tramo contiguo**. Una pregunta sobre subárboles se vuelve una pregunta de rangos, y ahí entran Fenwick y Segment Tree de la parte III (consultas en rangos). Es el ejemplo perfecto de combinar técnicas.",
     {
      "h": "Centroides"
     },
     "El centroide es el nodo que al quitarlo deja pedazos de tamaño a lo sumo n/2. Quitarlo y repetir en cada pedazo produce una jerarquía de profundidad O(log n): la **descomposición por centroides**, que permite contar caminos con alguna propiedad en O(n log n). El centroide también sirve de raíz canónica para comparar árboles sin raíz (isomorfismo)."
    ],
    "algs": [
     "Graphs-Classic-Problems-Subordinates",
     "Graphs-Algorithms-Graph-Traversal-Diameter",
     "Graphs-Algorithms-Trees-TreeDistances",
     "Graphs-Algorithms-Trees-BinaryLifting",
     "Graphs-Algorithms-Trees-LCA",
     "Graphs-Algorithms-Trees-EulerTour",
     "Graphs-Algorithms-Trees-Centroid",
     "Graphs-Algorithms-Trees-CentroidDecomposition",
     "Graphs-Algorithms-Trees-TreeIsomorphismRooted",
     "Graphs-Algorithms-Trees-TreeIsomorphism"
    ],
    "teo": [
     [
      "Graphs",
      "Caracterización de árboles"
     ],
     [
      "Data Structures",
      "Descomposición heavy-light"
     ],
     [
      "Data Structures",
      "Técnica de los más pequeños (small to large)"
     ]
    ],
    "preguntas": [
     {
      "q": "¿Por qué la descomposición por centroides tiene profundidad O(log n)?",
      "a": "Porque cada pedazo tiene a lo sumo la mitad de los nodos del anterior."
     },
     {
      "q": "Con el Euler tour, ¿cómo sumas los valores de un subárbol con actualizaciones?",
      "a": "Con un Fenwick sobre el arreglo aplanado, consultando el tramo [entrada, salida] del nodo."
     }
    ],
    "cierre": "Los árboles son el lugar donde se juntan todas las ideas del curso: recorridos, DP, potencias de 2 y estructuras de rangos."
   },
   {
    "t": "Árboles avanzados: DP en árboles, rerooting y heavy-light",
    "obj": [
     "Diseñar DP con pocos estados por nodo.",
     "Responder la misma DP para todas las raíces en O(n).",
     "Responder consultas en caminos con heavy-light y un Segment Tree."
    ],
    "clase": [
     {
      "h": "DP en árboles"
     },
     "Una vez decidido qué pasa con un nodo, los subárboles de sus hijos son independientes. Por eso basta con pocos estados por nodo (libre/usado, color, ¿tomado?) y se combinan los hijos de las hojas a la raíz.",
     {
      "h": "Rerooting"
     },
     "Cuando piden la respuesta para cada nodo como raíz, se calcula con raíz 1 y luego se \"mueve\" la raíz de padre a hijo ajustando solo lo que cambia. En suma de distancias: `ans[v] = ans[p] + n − 2·sz[v]`.",
     {
      "h": "Heavy-light"
     },
     "Cada nodo sigue por su hijo de subárbol más grande. Bajar por una arista liviana al menos divide el tamaño entre dos, así que cualquier camino cruza O(log n) cadenas. Numerando las cadenas de forma contigua, un camino se vuelve O(log n) rangos de un Segment Tree: O(log² n) por consulta."
    ],
    "algs": [
     "DP-Trees-TreeMatching",
     "DP-Trees-Rerooting",
     "Graphs-Algorithms-Trees-HLD"
    ],
    "teo": [
     [
      "Data Structures",
      "Descomposición heavy-light"
     ],
     [
      "Data Structures",
      "Técnica de los más pequeños (small to large)"
     ],
     [
      "Graphs",
      "DP en árboles y rerooting"
     ]
    ],
    "preguntas": [
     {
      "q": "En un árbol que es una línea de n nodos, ¿cuántas cadenas pesadas hay?",
      "a": "Una sola: cada nodo tiene un único hijo, que es el pesado."
     },
     {
      "q": "¿Por qué el rerooting de suma de distancias necesita long long?",
      "a": "Porque la suma de distancias desde un extremo de una línea de 2·10^5 nodos es del orden de 2·10^10."
     }
    ],
    "cierre": "DP en árboles para decidir, rerooting para todas las raíces y heavy-light para consultas en caminos: con eso se cubren casi todos los problemas de árboles de un regional."
   },
   {
    "t": "Grafos de finales: bloques, dominadores y árboles comprimidos",
    "obj": [
     "Descomponer un grafo en bloques biconexos y usar el block-cut tree.",
     "Calcular dominadores en grafos dirigidos.",
     "Responder consultas sobre subconjuntos de nodos con árboles virtuales y small to large.",
     "Resolver arborescencias mínimas y ciclos de media mínima."
    ],
    "clase": [
     "Este capítulo junta herramientas que convierten un grafo complicado en un árbol, donde todo es más fácil.",
     {
      "h": "Bloques y dominadores"
     },
     "Los **bloques** biconexos y los puntos de articulación forman un árbol: «¿todo camino de a a b pasa por c?» se vuelve una pregunta de caminos en ese árbol. En grafos dirigidos con raíz, los **dominadores** cumplen el mismo papel: el árbol de dominadores dice qué vértices son obligatorios para llegar a cada uno.",
     {
      "h": "Comprimir árboles"
     },
     "Si una consulta menciona k nodos, el **árbol virtual** con esos nodos y sus LCA (menos de 2k) basta para hacer la DP. Si hay que juntar conjuntos de los hijos, **small to large** garantiza O(n log n) movimientos.",
     {
      "h": "Dos clásicos dirigidos"
     },
     "La **arborescencia mínima** (Chu-Liu/Edmonds) reemplaza a Kruskal en grafos dirigidos. El **ciclo de media mínima** de Karp sale de caminos con exactamente k arcos."
    ],
    "algs": [
     "Graphs-Algorithms-Connectivity-BlockCutTree",
     "Graphs-Algorithms-Connectivity-DominatorTree",
     "Graphs-Algorithms-Trees-VirtualTree",
     "Graphs-Algorithms-Trees-SmallToLarge",
     "Graphs-Algorithms-MST-DirectedMST",
     "Graphs-Algorithms-Miscellaneous-MinMeanCycle"
    ],
    "teo": [
     [
      "Graphs",
      "Puentes, articulaciones y low-link"
     ],
     [
      "Graphs",
      "Semidominadores (Lengauer-Tarjan)"
     ],
     [
      "Data Structures",
      "Técnica de los más pequeños (small to large)"
     ],
     [
      "Graphs",
      "Teorema de Karp (ciclo de media mínima)"
     ]
    ],
    "preguntas": [
     {
      "q": "¿Por qué Kruskal falla en un grafo dirigido?",
      "a": "Porque cada vértice necesita exactamente un arco de entrada y la dirección importa: el arco más barato global puede entrar a un vértice que ya tiene otro mejor, y la estructura no es un matroide gráfico."
     },
     {
      "q": "¿Cuántos nodos tiene como máximo el árbol virtual de k nodos?",
      "a": "2k − 1: los k nodos más a lo sumo k − 1 LCA de pares consecutivos en orden DFS."
     }
    ],
    "cierre": "Si el grafo es difícil, busca el árbol escondido: bloques, dominadores o un árbol comprimido."
   }
  ]
 },
 {
  "parte": "V. Optimización en redes",
  "caps": [
   {
    "t": "Flujos, emparejamientos y costo mínimo",
    "obj": [
     "Calcular el flujo máximo con caminos aumentantes.",
     "Entender el teorema de flujo máximo = corte mínimo.",
     "Modelar asignaciones como emparejamientos.",
     "Optimizar costo además de cantidad."
    ],
    "clase": [
     "Llegamos al capítulo donde los algoritmos se encuentran con la **optimización matemática**. Un problema de flujo es un programa lineal con una estructura tan especial que tiene algoritmos combinatorios exactos y rápidos.",
     {
      "h": "Flujo máximo"
     },
     "Cada arista tiene una capacidad. Queremos mandar lo máximo posible de S a T. La idea es buscar un camino con capacidad sobrante, mandar por él lo que permita su cuello de botella y repetir. El detalle crucial son las **aristas de regreso**: mandar flujo de u a v crea la posibilidad de \"devolverlo\", y eso permite corregir decisiones malas. Edmonds-Karp elige siempre el camino más corto (BFS) y así garantiza O(V·E²). Dinic agrupa por niveles y manda varios caminos por fase; hay a lo sumo V fases, así que cuesta O(V²·E) en general y O(E·√V) en redes unitarias.",
     {
      "h": "Dualidad: el corte mínimo"
     },
     "Cuando ya no hay caminos aumentantes, los nodos alcanzables desde S forman un corte, y su capacidad es exactamente el flujo enviado. Ese es el **teorema de flujo máximo = corte mínimo**, y es un caso de la dualidad de programación lineal: el máximo de un problema coincide con el mínimo de su dual.",
     {
      "h": "Emparejamientos"
     },
     "Asignar trabajadores a tareas, parejas de baile o casillas de un tablero son emparejamientos bipartitos. Es flujo con capacidades 1, y el algoritmo de Kuhn lo hace directamente con caminos alternantes. El **teorema de Kőnig** dice que el emparejamiento máximo es igual a la cobertura mínima por vértices en grafos bipartitos.",
     {
      "h": "Costo mínimo"
     },
     "Si además cada unidad de flujo cuesta, se aumenta siempre por el camino **más barato** (Bellman-Ford o Dijkstra con potenciales). Si el problema pide exactamente K unidades, se aumenta igual pero se para al llegar a K (y si el flujo máximo es menor que K, la respuesta es imposible). Aquí reaparece la dualidad: los potenciales son las variables duales del problema."
    ],
    "algs": [
     "Graphs-Algorithms-Flow-Algorithms-EdmondsKarp",
     "Graphs-Algorithms-Flow-Algorithms-Dinic",
     "Graphs-Algorithms-Flow-Algorithms-BipartiteMatching",
     "Graphs-Algorithms-Flow-Algorithms-MinCostMaxFlow",
     "Graphs-Algorithms-Flow-Algorithms-MinCostAnyFlow"
    ],
    "teo": [
     [
      "Graphs",
      "Flujo máximo = corte mínimo"
     ],
     [
      "Graphs",
      "Teorema de Kőnig"
     ],
     [
      "Graphs",
      "Teorema de Hall"
     ],
     [
      "Graphs",
      "Teorema de Menger"
     ],
     [
      "Graphs",
      "Complejidad de Dinic"
     ],
     [
      "Graphs",
      "Criterio de optimalidad en flujo de costo mínimo"
     ]
    ],
    "preguntas": [
     {
      "q": "¿Para qué sirven las aristas de regreso en la red residual?",
      "a": "Permiten deshacer flujo enviado antes; sin ellas, el método avaricioso puede quedarse en un flujo que no es máximo."
     },
     {
      "q": "Si el flujo máximo vale 7, ¿qué sabes del corte mínimo?",
      "a": "Que su capacidad también es 7."
     },
     {
      "q": "¿Cómo se modela un emparejamiento bipartito como flujo?",
      "a": "Fuente → cada nodo izquierdo, cada izquierdo → sus derechos posibles y cada derecho → sumidero, todo con capacidad 1."
     }
    ],
    "cierre": "Los flujos son el puente natural hacia la programación lineal, la dualidad y la optimización combinatoria. En el siguiente capítulo se ve cómo leer el corte mínimo, emparejar más rápido, imponer mínimos y asignar con costo mínimo."
   },
   {
    "t": "Flujos avanzados: cortes, Hopcroft-Karp, cotas y asignación",
    "obj": [
     "Reconstruir el corte mínimo a partir del flujo.",
     "Emparejar en O(E·√V) con Hopcroft-Karp.",
     "Modelar cotas inferiores en las aristas.",
     "Resolver asignación con el algoritmo húngaro y entender sus potenciales."
    ],
    "clase": [
     {
      "h": "El corte que deja el flujo"
     },
     "Al terminar el flujo máximo, los nodos que la fuente todavía alcanza en el residual forman un lado del corte mínimo. Muchos problemas piden el corte, no el flujo: qué calles cerrar, qué proyectos descartar.",
     {
      "h": "Hopcroft-Karp"
     },
     "Es Dinic especializado en grafos bipartitos con capacidades 1: por fases, aumenta a la vez por un conjunto maximal de caminos disjuntos de largo mínimo. Hay O(√V) fases.",
     {
      "h": "Cotas inferiores"
     },
     "Si una arista debe llevar al menos l, se manda l por obligación y se reparan los desbalances con una fuente y un sumidero nuevos. Es la forma de modelar mínimos obligatorios, demandas y circulaciones.",
     {
      "h": "Asignación y dualidad"
     },
     "El algoritmo húngaro mantiene potenciales u, v con `u[i] + v[j] ≤ c[i][j]` y solo usa aristas donde vale la igualdad. Al terminar, el costo es Σu + Σv: el dual certifica que la asignación es óptima. Es el mismo principio que los potenciales de costo mínimo."
    ],
    "algs": [
     "Graphs-Algorithms-Flow-Algorithms-MinCut",
     "Graphs-Algorithms-Flow-Algorithms-HopcroftKarp",
     "Graphs-Algorithms-Flow-Algorithms-LowerBoundFlow",
     "Graphs-Algorithms-Flow-Algorithms-Hungarian"
    ],
    "teo": [
     [
      "Graphs",
      "Flujo máximo = corte mínimo"
     ],
     [
      "Graphs",
      "Hopcroft-Karp: O(√V) fases"
     ],
     [
      "Graphs",
      "Circulaciones con demandas"
     ],
     [
      "Graphs",
      "Dualidad en el problema de asignación"
     ]
    ],
    "preguntas": [
     {
      "q": "Si el flujo máximo vale 3, ¿cuántas aristas tiene el corte que se reconstruye en una red con capacidades 1?",
      "a": "Exactamente 3: el corte tiene capacidad igual al flujo y cada arista aporta 1."
     },
     {
      "q": "¿Cómo se convierte un flujo s–t con cotas inferiores en una circulación?",
      "a": "Agregando una arista t → s de capacidad infinita; después se resuelve la circulación con S' y T'."
     }
    ],
    "cierre": "Terminaste la parte de redes. Los flujos son el puente hacia la programación lineal y la dualidad: cuando un problema parece un LP con estructura de grafo, probablemente es un flujo."
   },
   {
    "t": "Cortes y emparejamientos en grafos generales",
    "obj": [
     "Modelar decisiones con dependencias como corte mínimo (selección de proyectos).",
     "Cubrir DAGs con caminos usando emparejamientos.",
     "Calcular cortes mínimos globales y entre todos los pares.",
     "Emparejar en grafos no bipartitos."
    ],
    "clase": [
     "Muchos problemas de finales son de flujo disfrazados. La habilidad clave es modelar: qué es nodo, qué es arista y qué significa cada corte.",
     {
      "h": "Selección de proyectos"
     },
     "Si elegir A obliga a elegir B, se pone una arista A → B de capacidad infinita. Con ganancias desde la fuente y costos hacia el sumidero, el corte mínimo es lo que se pierde. Sirve para subgrafos de peso máximo, decisiones binarias con penalizaciones por pares y mucho más.",
     {
      "h": "Caminos y cortes"
     },
     "Cubrir un DAG con la menor cantidad de caminos es n − emparejamiento máximo (y con la clausura transitiva, Dilworth). El corte mínimo global de un grafo no dirigido sale con **Stoer-Wagner** sin elegir fuente; el **árbol de Gomory-Hu** resume los cortes mínimos de todos los pares con n − 1 flujos.",
     {
      "h": "Grafos generales"
     },
     "Sin bipartición, los ciclos impares rompen el BFS alternante. El algoritmo de **flores de Edmonds** los contrae y sigue buscando caminos aumentantes.",
     {
      "nota": "Antes de escribir un flujo, dibuja la red en papel con un ejemplo pequeño y verifica que cada corte finito corresponde a una solución válida."
     }
    ],
    "algs": [
     "Graphs-Algorithms-Flow-Algorithms-ProjectSelection",
     "Graphs-Algorithms-Flow-Algorithms-MinPathCover",
     "Graphs-Algorithms-Flow-Algorithms-StoerWagner",
     "Graphs-Algorithms-Flow-Algorithms-GomoryHu",
     "Graphs-Algorithms-Flow-Algorithms-Blossom"
    ],
    "teo": [
     [
      "Graphs",
      "Flujo máximo = corte mínimo"
     ],
     [
      "DP",
      "Teorema de Dilworth (y su dual de Mirsky)"
     ],
     [
      "Graphs",
      "Árbol de Gomory-Hu"
     ],
     [
      "Graphs",
      "Teorema de Berge"
     ]
    ],
    "preguntas": [
     {
      "q": "En selección de proyectos, ¿por qué la respuesta es la suma de todas las ganancias menos el corte?",
      "a": "El corte cuenta las ganancias de los proyectos que no se hacen más los costos de lo que se compra; restarlo de todas las ganancias deja ganancia obtenida menos costo pagado."
     },
     {
      "q": "¿Por qué no basta el algoritmo bipartito en un grafo con un triángulo?",
      "a": "Un ciclo impar hace que un vértice se alcance con ambas paridades; el BFS alternante puede declarar que no hay camino aumentante cuando sí lo hay."
     }
    ],
    "cierre": "Modelar es el 80 % del trabajo: el algoritmo de flujo ya está en el notebook."
   }
  ]
 },
 {
  "parte": "VI. Probabilidad",
  "caps": [
   {
    "t": "Probabilidad y valor esperado",
    "obj": [
     "Calcular probabilidades combinando la regla de la suma y la del producto.",
     "Usar la linealidad de la esperanza y las variables indicadoras.",
     "Calcular esperanzas de máximos y de funciones no lineales."
    ],
    "clase": [
     "En programación competitiva aparecen dos tipos de preguntas con azar: **¿qué tan probable es que pase algo?** y **¿cuánto vale en promedio?** (el valor esperado o esperanza). Casi nunca se resuelven listando todos los casos, que suelen ser una cantidad astronómica, sino con dos o tres ideas que conviene dominar.",
     {
      "h": "Probabilidades por pasos"
     },
     "Si un proceso avanza por pasos independientes, la probabilidad de una secuencia es el **producto** de las de cada paso, y la de un estado es la **suma** sobre todos los caminos que llegan a él. Eso es exactamente una DP donde cada casilla guarda una probabilidad en lugar de un conteo. Con dados: `p[d][s]` es la probabilidad de que d dados sumen s.",
     {
      "py": "p = [1.0]\nfor _ in range(n):\n    q = [0.0] * (len(p) + 6)\n    for s, ps in enumerate(p):\n        for c in range(1, 7):\n            q[s + c] += ps / 6\n    p = q\nprint(sum(p[a:b + 1]))"
     },
     {
      "h": "Linealidad de la esperanza"
     },
     "La idea más poderosa del tema: **E[X + Y] = E[X] + E[Y] siempre**, aunque X e Y dependan una de la otra. Para un conteo, se escribe como suma de **indicadores** (1 si pasa algo, 0 si no), y la esperanza de un indicador es su probabilidad. Así, el número esperado de inversiones es la suma de P(x_i > x_j) sobre los pares; y si en un árbol se borran subárboles eligiendo nodos al azar, cada nodo cuenta como paso con probabilidad 1/profundidad.",
     {
      "h": "Máximos y funciones no lineales"
     },
     "Para el máximo de variables independientes, «el máximo es ≤ m» equivale a «todas son ≤ m», que es un producto. Para un cuadrado, E[X²] no es E[X]²: se mira cuánto **aumenta** el valor en cada paso ((L+1)² − L² = 2L + 1) y a esa expresión lineal sí se le aplica la linealidad."
    ],
    "algs": [
     "Probability-Algorithms-ProbabilityDP",
     "Probability-Classic-Problems-Campeonato",
     "Probability-Algorithms-LinearityOfExpectation",
     "Probability-Algorithms-ExpectedMaximum",
     "Probability-Classic-Problems-Journey",
     "Probability-Classic-Problems-Game-on-Tree",
     "Probability-Classic-Problems-Lets-Play-Osu"
    ],
    "teo": [
     [
      "Probability",
      "Regla de la suma y del producto"
     ],
     [
      "Probability",
      "Linealidad de la esperanza"
     ],
     [
      "Probability",
      "Variables indicadoras"
     ],
     [
      "Probability",
      "Máximo y mínimo de variables independientes"
     ],
     [
      "Probability",
      "Esperanza de un cuadrado"
     ]
    ],
    "preguntas": [
     {
      "q": "¿La linealidad de la esperanza necesita que las variables sean independientes?",
      "a": "No. E[X + Y] = E[X] + E[Y] vale siempre; la independencia solo se necesita para multiplicar: E[X·Y] = E[X]·E[Y]."
     },
     {
      "q": "Si lanzas 3 dados, ¿cuál es el valor esperado de la suma?",
      "a": "3 · 3.5 = 10.5, por linealidad, sin calcular la distribución."
     },
     {
      "q": "¿Cuál es P(máx ≤ m) para n números independientes uniformes en [1, k]?",
      "a": "(m/k)^n, porque todos deben ser ≤ m."
     }
    ],
    "cierre": "Ante cualquier «valor esperado de un conteo», la primera pregunta es: ¿de qué indicadores es suma este conteo? Muchas veces el problema se resuelve ahí mismo."
   },
   {
    "t": "Procesos aleatorios y probabilidad modular",
    "obj": [
     "Modelar procesos con estados y transiciones aleatorias (cadenas de Markov).",
     "Hacer DP de probabilidades sobre estados que se achican, incluso subconjuntos.",
     "Expresar probabilidades y esperanzas módulo un primo."
    ],
    "clase": [
     "Muchos problemas describen un proceso que cambia de estado al azar: un robot que se mueve, una fila que avanza, peces que se comen, ratones que saltan. La pregunta es siempre la misma: **¿cuál es el estado mínimo que describe la situación?** Con eso se arma una DP sobre la distribución de probabilidades.",
     {
      "h": "Cadenas de Markov"
     },
     "Si el siguiente estado solo depende del actual, basta llevar la distribución p (la probabilidad de estar en cada estado) y aplicar las transiciones paso a paso. Si los pasos son muchísimos, la misma transición se escribe como una matriz y se eleva a la k con exponenciación rápida.",
     {
      "h": "Estados que se achican"
     },
     "Si se sacan objetos al azar de una bolsa, el estado es cuántos quedan de cada tipo y cada ronda quita alguno; si se eliminan participantes de un torneo al azar, el estado es el conjunto de vivos (una máscara de bits) y cada encuentro quita uno. Como el estado siempre se achica, se recorre de los estados grandes a los pequeños repartiendo la probabilidad, sin ciclos.",
     {
      "h": "Respuestas módulo un primo"
     },
     "Cuando la respuesta es una fracción p/q, muchos jueces piden p · q⁻¹ mód 998244353. Como el módulo es primo, q⁻¹ = q^(M−2), y una probabilidad como 37/100 se guarda como 37 · 100⁻¹. Toda la cuenta se hace con sumas y productos modulares, sin decimales.",
     {
      "py": "MOD = 998244353\ninv100 = pow(100, MOD - 2, MOD)\nq = 37 * inv100 % MOD      # 0.37 representado módulo MOD\nprint(q * 100 % MOD)       # 37: la fracción se recupera"
     },
     {
      "h": "Cuando hay ciclos: Gauss"
     },
     "Si un estado puede volver a sí mismo (un paseo que regresa, un juego que puede repetirse), no hay orden para una DP: las ecuaciones E[v] = 1 + Σ P(v → w)·E[w] forman un sistema lineal. Con hasta unos 500 estados se resuelve con eliminación de Gauss en O(V³), eligiendo siempre el pivote de mayor valor absoluto."
    ],
    "algs": [
     "Probability-Algorithms-MarkovChain",
     "Probability-Classic-Problems-Ilya-and-Escalator",
     "Probability-Classic-Problems-Bag-of-Mice",
     "Probability-Classic-Problems-Fish",
     "Probability-Algorithms-ModularExpectation",
     "Probability-Algorithms-GaussianExpectation"
    ],
    "teo": [
     [
      "Probability",
      "Probabilidad condicional y probabilidad total"
     ],
     [
      "Probability",
      "Cadenas de Markov y matriz de transición"
     ],
     [
      "Probability",
      "Esperanza de una variable geométrica"
     ],
     [
      "Probability",
      "Fracciones módulo un primo"
     ],
     [
      "Probability",
      "Esperanza con ciclos: sistema de ecuaciones"
     ]
    ],
    "preguntas": [
     {
      "q": "Un intento tiene éxito con probabilidad 1/4. ¿Cuántos intentos se esperan hasta el primer éxito?",
      "a": "4: la variable es geométrica y su esperanza es 1/p."
     },
     {
      "q": "¿Por qué en Fish se recorren las máscaras de mayor a menor?",
      "a": "Porque cada encuentro quita un pez: la probabilidad solo pasa de un conjunto a otro más pequeño, así que cuando se procesa un conjunto ya se sumó todo lo que llega a él."
     },
     {
      "q": "¿Cómo se representa 1/2 módulo 998244353?",
      "a": "Como 2^(M−2) mód M = 499122177, porque 2 · 499122177 ≡ 1."
     }
    ],
    "cierre": "Con probabilidades, la DP es la misma de siempre: estado, transición y orden. Lo único que cambia es que cada transición se multiplica por su probabilidad."
   },
   {
    "t": "Distribuciones: binomial, geométrica, condicional y continua",
    "obj": [
     "Reconocer las distribuciones que aparecen en competencia y sus esperanzas.",
     "Usar probabilidad condicional y Bayes cuando el enunciado dice «sabiendo que…».",
     "Resolver problemas continuos midiendo áreas o contando órdenes."
    ],
    "clase": [
     "En competencia no se usan tablas de distribuciones: casi siempre basta con reconocer **qué proceso** genera la variable y calcular su distribución con una DP o una fórmula corta. Estas son las que más aparecen.",
     {
      "h": "Binomial (y su versión con probabilidades distintas)"
     },
     "n ensayos independientes de sí/no con probabilidad p: P(X = k) = C(n, k)·pᵏ·(1 − p)ⁿ⁻ᵏ, E = np. Si cada ensayo tiene su propia pᵢ ya no hay fórmula bonita, pero la misma DP ensayo por ensayo funciona: cada ensayo reparte la probabilidad entre «un éxito más» y «igual». Sin reposición (cartas, urnas) la distribución es la hipergeométrica.",
     {
      "py": "d = [1.0]  # d[i] = P(i éxitos)\nfor p in probabilidades:\n    d = [a * (1 - p) + b * p for a, b in zip(d + [0.0], [0.0] + d)]"
     },
     {
      "h": "Geométrica: esperar un éxito"
     },
     "Si cada intento sale bien con probabilidad p, se esperan 1/p intentos. El coleccionista de cupones es una suma de geométricas: con c tipos vistos se esperan n/(n − c) compras para el siguiente, y en total n·H_n ≈ n ln n.",
     {
      "h": "Condicional y Bayes"
     },
     "P(A | B) = P(A y B) / P(B). Cuando el enunciado da información («sabiendo que exactamente r compraron»), la respuesta es una división: la probabilidad del caso favorable junto con el dato, entre la probabilidad del dato. Bayes es la misma idea leída al revés: P(A | B) = P(B | A)·P(A) / P(B).",
     {
      "h": "Continua"
     },
     "Con números reales al azar, la probabilidad es una medida: longitud, área o volumen favorable sobre el total. Dos consecuencias muy útiles: los empates tienen probabilidad 0, así que **todos los órdenes de n puntos uniformes son igual de probables** (lo continuo se vuelve conteo), y el k-ésimo menor de n uniformes en [0, 1] tiene esperanza k/(n + 1). La distribución normal y otras continuas prácticamente no aparecen, porque los jueces piden respuestas exactas."
    ],
    "algs": [
     "Probability-Distributions-Binomial",
     "Probability-Distributions-CouponCollector",
     "Probability-Classic-Problems-Probability-Given",
     "Probability-Distributions-ContinuousUniform",
     "Probability-Classic-Problems-Serval-and-Bonus-Problem"
    ],
    "teo": [
     [
      "Probability",
      "Distribución binomial"
     ],
     [
      "Probability",
      "Distribución hipergeométrica"
     ],
     [
      "Probability",
      "Coleccionista de cupones"
     ],
     [
      "Probability",
      "Teorema de Bayes"
     ],
     [
      "Probability",
      "Probabilidad continua y probabilidad geométrica"
     ],
     [
      "Probability",
      "Estadísticos de orden de uniformes"
     ]
    ],
    "preguntas": [
     {
      "q": "Se lanzan 10 monedas justas. ¿Cuál es P(exactamente 5 caras)?",
      "a": "C(10, 5)/2¹⁰ = 252/1024 ≈ 0.246."
     },
     {
      "q": "¿Cuántas compras se esperan para juntar 3 tipos de cupón equiprobables?",
      "a": "3·(1 + 1/2 + 1/3) = 5.5."
     },
     {
      "q": "x e y son uniformes en [0, 1]. ¿Cuál es P(x + y ≤ 1)?",
      "a": "1/2: el triángulo bajo la recta x + y = 1 ocupa la mitad del cuadrado."
     }
    ],
    "cierre": "Antes de buscar una fórmula, pregúntate qué proceso genera la variable: casi siempre la distribución sale de una DP con dos o tres transiciones."
   }
  ]
 },
 {
  "parte": "VII. Cadenas",
  "caps": [
   {
    "t": "Cadenas: búsqueda de patrones y hashing",
    "obj": [
     "Calcular bordes con la función de prefijos (KMP) y la función Z.",
     "Buscar un patrón en tiempo lineal.",
     "Comparar subcadenas en O(1) con hashing.",
     "Encontrar todos los palíndromos con Manacher."
    ],
    "clase": [
     "Buscar un patrón de largo m en un texto de largo n comparando en cada posición cuesta O(n·m). Todos los algoritmos de este capítulo tienen la misma idea central: **cuando una comparación falla, ya sabes algo del texto; no lo vuelvas a leer**.",
     {
      "h": "Bordes y la función de prefijos"
     },
     "Un borde es un prefijo que también es sufijo. KMP calcula para cada posición el borde más largo, y cuando falla una comparación salta a ese borde en vez de empezar de cero. La función Z hace lo mismo desde otro ángulo: `z[i]` es cuánto coincide el texto desde i con su propio inicio. El truco clásico es correr cualquiera de las dos sobre `patrón + \"#\" + texto`.",
     {
      "h": "Hashing"
     },
     "Rabin-Karp convierte cada ventana en un número y compara números en O(1). Es probabilístico: dos cadenas distintas pueden tener el mismo hash. Con un módulo de unos 10⁹ y muchas comparaciones (por la paradoja del cumpleaños) las colisiones sí ocurren, por eso se usan dos módulos o uno de 61 bits, y una **base aleatoria** para que nadie pueda preparar un caso en contra.",
     {
      "h": "Palíndromos"
     },
     "**Manacher** encuentra todos los palíndromos en O(n) reutilizando la simetría del palíndromo que llega más a la derecha: dentro de él, el radio en i es por lo menos el radio en su espejo."
    ],
    "algs": [
     "Strings-Algorithms-KMP-I",
     "Strings-Algorithms-KMP-II",
     "Strings-Classic-Problems-Finding-Borders",
     "Strings-Algorithms-ZFunction",
     "Strings-Classic-Problems-Finding-Periods",
     "Strings-Algorithms-RabinKarp",
     "Strings-Algorithms-Manacher"
    ],
    "teo": [
     [
      "Strings",
      "Función de prefijos (KMP)"
     ],
     [
      "Strings",
      "Período y borde"
     ],
     [
      "Strings",
      "Probabilidad de colisión del hashing"
     ]
    ],
    "preguntas": [
     {
      "q": "¿Por qué se pone un separador como \"#\" entre el patrón y el texto?",
      "a": "Para que ninguna coincidencia pueda cruzar del patrón al texto: así z[i] o el borde nunca superan el largo del patrón."
     },
     {
      "q": "¿Qué relación hay entre el borde más largo y el período de una cadena?",
      "a": "El período mínimo es n − (borde más largo)."
     },
     {
      "q": "Comparas 10⁶ pares de subcadenas con un solo módulo de 10⁹ + 7. ¿Es seguro?",
      "a": "Para pocas comparaciones sí, pero si guardas 10⁶ hashes en un conjunto buscando repetidos, por la paradoja del cumpleaños la probabilidad de alguna colisión ya es alta. Usa dos módulos o 2⁶¹ − 1."
     }
    ],
    "cierre": "KMP o Z para buscar, hashing para comparar rápido y Manacher para palíndromos."
   },
   {
    "t": "Cadenas: trie, arreglo de sufijos y conteo",
    "obj": [
     "Guardar diccionarios en un trie y combinarlo con DP.",
     "Encontrar la rotación mínima en O(n).",
     "Ordenar todos los sufijos y usar el LCP.",
     "Contar subsecuencias y cadenas con un patrón con DP."
    ],
    "clase": [
     {
      "h": "Trie"
     },
     "El **trie** guarda palabras compartiendo prefijos: cada camino desde la raíz deletrea un prefijo. Combina muy bien con DP: desde cada posición del texto se baja por el trie y cada palabra completa encontrada es una transición.",
     {
      "h": "Rotación mínima"
     },
     "La rotación mínima se encuentra comparando dos candidatos y descartando al perdedor junto con todo lo que ya se comparó. Es O(n) y da la forma canónica de una cadena circular.",
     {
      "h": "Arreglo de sufijos"
     },
     "El **arreglo de sufijos** ordena todos los sufijos duplicando la longitud comparada en cada ronda. Junto con el arreglo LCP (Kasai, O(n)) responde casi todo sobre subcadenas: la repetida más larga es el mayor LCP entre vecinos, y el número de subcadenas distintas es n(n+1)/2 − Σ LCP.",
     {
      "h": "Contar con DP"
     },
     "Para contar subsecuencias distintas se duplican las que había y se restan las que se repiten, usando la última aparición de cada letra. Para contar cadenas de largo n que contienen (o evitan) un patrón, se combina KMP con DP: el estado es \"cuánto del patrón llevo emparejado\", que es exactamente el autómata de la función de prefijos."
    ],
    "algs": [
     "Strings-Algorithms-PrefixTrie",
     "Strings-Algorithms-MinimalRotation",
     "Strings-Algorithms-SuffixArray",
     "Strings-Classic-Problems-Repeating-Substring",
     "Strings-Classic-Problems-Distinct-Subsequences",
     "Strings-Classic-Problems-Required-Substring"
    ],
    "teo": [
     [
      "Strings",
      "Subcadenas distintas con Suffix Array"
     ],
     [
      "Strings",
      "Aho–Corasick"
     ]
    ],
    "preguntas": [
     {
      "q": "¿Cuántas subcadenas distintas tiene \"aaa\"?",
      "a": "Tres: \"a\", \"aa\" y \"aaa\". Con el arreglo de sufijos: 3·4/2 − (1 + 2) = 3."
     },
     {
      "q": "Al contar cadenas que contienen un patrón, ¿por qué el estado es \"cuánto del patrón llevo\" y no la cadena completa?",
      "a": "Porque para saber si el patrón aparecerá solo importa el borde más largo del texto escrito que es prefijo del patrón; eso es justo lo que calcula KMP."
     }
    ],
    "cierre": "Trie para diccionarios, arreglo de sufijos para preguntas sobre subcadenas, y KMP dentro de una DP cuando hay que contar cadenas que contienen (o evitan) un patrón."
   },
   {
    "t": "Cadenas avanzadas: Aho-Corasick y autómata de sufijos",
    "obj": [
     "Buscar muchos patrones a la vez con Aho-Corasick.",
     "Construir el autómata de sufijos y contar subcadenas distintas.",
     "Elegir entre suffix array, autómata de sufijos y hashing."
    ],
    "clase": [
     {
      "h": "Aho-Corasick"
     },
     "Es KMP para un diccionario: un trie con enlaces de fallo que apuntan al sufijo más largo que también está en el trie. Recorrer el texto es moverse una vez por letra en un autómata. Combinado con DP sobre los nodos, resuelve \"cuántas cadenas de largo n evitan todas estas palabras\".",
     {
      "h": "Autómata de sufijos"
     },
     "Agrupa las subcadenas que terminan en las mismas posiciones: a lo sumo 2n − 1 estados y 3n transiciones. Se construye agregando letras y clonando un estado cuando hace falta separar subcadenas de distinto largo. Cada estado aporta `len[v] − len[link[v]]` subcadenas distintas.",
     {
      "nota": "Regla práctica: para una sola cadena y preguntas de orden (k-ésima subcadena, LCP), suffix array; para conteos y recorridos en línea, autómata de sufijos; para comparar rápido, hashing."
     }
    ],
    "algs": [
     "Strings-Algorithms-AhoCorasick",
     "Strings-Algorithms-SuffixAutomaton"
    ],
    "teo": [
     [
      "Strings",
      "Aho–Corasick"
     ],
     [
      "Strings",
      "Tamaño del autómata de sufijos"
     ],
     [
      "Strings",
      "Subcadenas distintas con Suffix Array"
     ]
    ],
    "preguntas": [
     {
      "q": "¿Cuántas subcadenas distintas tiene \"aaaa\"?",
      "a": "Cuatro: a, aa, aaa, aaaa. El autómata tiene 5 estados en línea y cada uno aporta 1."
     },
     {
      "q": "¿Qué representa el enlace de fallo de un nodo del trie?",
      "a": "El sufijo propio más largo de su cadena que también es prefijo de algún patrón."
     }
    ],
    "cierre": "Con Aho-Corasick y el autómata de sufijos ya tienes las estructuras de cadenas que aparecen en finales; casi todo lo demás es combinarlas con DP."
   },
   {
    "t": "Palíndromos y palabras de Lyndon",
    "obj": [
     "Construir el eertree y contar palíndromos con sus apariciones.",
     "Factorizar una cadena en palabras de Lyndon con Duval."
    ],
    "clase": [
     "Dos estructuras lineales sobre cadenas que aparecen en finales y casi nunca en cursos.",
     {
      "h": "Eertree"
     },
     "Una cadena de largo n tiene a lo sumo n palíndromos distintos, porque cada letra nueva crea a lo sumo uno. El eertree guarda un nodo por palíndromo con enlaces de sufijo, se construye en O(n) amortizado y permite contar apariciones, palíndromos por prefijo y factorizaciones en palíndromos.",
     {
      "h": "Lyndon y Duval"
     },
     "Toda cadena se parte de forma única en palabras de Lyndon no crecientes. Duval las encuentra con dos punteros en O(n) y memoria O(1); de ahí sale también la rotación mínima."
    ],
    "algs": [
     "Strings-Algorithms-Eertree",
     "Strings-Algorithms-Lyndon"
    ],
    "teo": [
     [
      "Strings",
      "Cantidad de palíndromos distintos"
     ],
     [
      "Strings",
      "Factorización de Lyndon (Chen–Fox–Lyndon)"
     ]
    ],
    "preguntas": [
     {
      "q": "¿Por qué al agregar una letra aparece a lo sumo un palíndromo nuevo?",
      "a": "Solo el sufijo palíndromo más largo puede ser nuevo: los más cortos son sufijos suyos y, por simetría, también prefijos, así que ya habían aparecido."
     },
     {
      "q": "¿Cuál es la factorización de Lyndon de «abab»?",
      "a": "«ab» · «ab»: dos copias de la misma palabra de Lyndon (la secuencia es no creciente)."
     }
    ],
    "cierre": "Palíndromos: piensa en el eertree. Rotaciones y comparaciones cíclicas: piensa en Lyndon."
   }
  ]
 },
 {
  "parte": "VIII. Geometría",
  "caps": [
   {
    "t": "Geometría: producto cruz y polígonos",
    "obj": [
     "Usar el producto cruz para orientación, áreas e intersecciones.",
     "Decidir si un punto está dentro de un polígono.",
     "Contar puntos enteros con el teorema de Pick."
    ],
    "clase": [
     "La geometría en competencia es casi toda **álgebra con vectores** y una regla de oro: usa enteros siempre que puedas. Los flotantes acumulan errores y una comparación con `==` puede fallar por 10⁻¹⁵. Cuando no se puede evitar, se compara con una tolerancia `eps`.",
     {
      "h": "El producto cruz"
     },
     "Para vectores (x1, y1) y (x2, y2), `x1·y2 − y1·x2` es positivo si el segundo gira a la izquierda del primero, negativo si gira a la derecha y cero si son paralelos. Con esta sola operación se deciden orientaciones, se calculan áreas (fórmula del Shoelace) y se detectan intersecciones de segmentos. Con coordenadas hasta 10⁹ las diferencias llegan a 2·10⁹ y el producto cruz a unos 8·10¹⁸: cabe en `long long` (hasta 9,2·10¹⁸) por muy poco, así que no lo sumes ni lo multipliques otra vez sin pasar a `__int128`.",
     {
      "py": "def cross(o, a, b):\n    return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])"
     },
     {
      "h": "Intersección de segmentos"
     },
     "Dos segmentos se cortan si los extremos de cada uno quedan en lados distintos del otro. Los casos con orientación 0 (colineales o extremos que tocan) son la fuente número uno de WA: ahí hay que revisar además que las cajas de los segmentos se solapen.",
     {
      "h": "Polígonos"
     },
     "El Shoelace da el doble del área con enteros, S = 2A. El **teorema de Pick** relaciona área, puntos interiores y puntos en el borde: `A = I + B/2 − 1`, y los puntos del borde de un lado son `gcd(|dx|, |dy|)`. Para saber si un punto está dentro, se lanza un rayo y se cuentan los cruces, revisando antes si está sobre el borde."
    ],
    "algs": [
     "Geometry-Point",
     "Geometry-Classic-Problems-Point-Location-Test",
     "Geometry-Shoelace",
     "Geometry-SegmentIntersection",
     "Geometry-PointInPolygon",
     "Geometry-PolygonLatticePoints"
    ],
    "teo": [
     [
      "Geometry",
      "Producto cruz y orientación"
     ],
     [
      "Geometry",
      "Fórmula del Shoelace"
     ],
     [
      "Geometry",
      "Teorema de Pick"
     ]
    ],
    "preguntas": [
     {
      "q": "Un triángulo con vértices enteros tiene área 10 y 6 puntos en el borde. ¿Cuántos puntos enteros tiene dentro?",
      "a": "Por Pick: 10 = I + 3 − 1, así que I = 8."
     },
     {
      "q": "¿Por qué conviene comparar distancias al cuadrado?",
      "a": "Para evitar la raíz cuadrada y trabajar solo con enteros exactos."
     },
     {
      "q": "Los segmentos (0,0)–(1,0) y (2,0)–(3,0) tienen las cuatro orientaciones en 0. ¿Se cortan?",
      "a": "No: son colineales pero no se solapan. Por eso, con orientación 0, hay que revisar las cajas."
     }
    ],
    "cierre": "Con el producto cruz y enteros resuelves la mayoría de los problemas de geometría básicos; los casos colineales son los que hay que probar siempre."
   },
   {
    "t": "Geometría de uso diario: distancias, rectas, circunferencias y cortes",
    "obj": [
     "Medir la distancia de un punto a un segmento y entre segmentos.",
     "Cortar rectas entre sí y circunferencias entre sí.",
     "Cortar un polígono convexo con una recta.",
     "Decidir punto en polígono convexo en O(log n)."
    ],
    "clase": [
     "Estas son las funciones que todo equipo tiene en su notebook y copia sin pensar. Vale la pena entenderlas una vez para poder adaptarlas cuando el problema cambia un detalle.",
     {
      "h": "Proyecciones"
     },
     "La proyección de P sobre la recta AB es A + t·(B − A) con t = (P − A)·(B − A) / |B − A|². Recortando t a [0, 1] se obtiene el punto más cercano del segmento.",
     {
      "h": "Rectas y circunferencias"
     },
     "Dos rectas paramétricas se cortan en t = cross(C − A, s) / cross(r, s). Dos circunferencias se cortan en 0, 1 o 2 puntos según d² frente a (r1 ± r2)²; los puntos salen del punto medio de la cuerda.",
     {
      "h": "Cortes y convexos"
     },
     "Cortar un polígono convexo con una recta es recorrer sus aristas conservando un lado y agregando los cruces. Y en un convexo, la pregunta \"¿está el punto dentro?\" se responde con búsqueda binaria en el abanico desde un vértice.",
     {
      "nota": "Decide los casos especiales (paralelas, tangentes, colineales) con enteros exactos y usa flotantes solo para calcular el punto final."
     }
    ],
    "algs": [
     "Geometry-Advanced-SegmentDistance",
     "Geometry-Advanced-LineIntersection",
     "Geometry-Advanced-CircleIntersection",
     "Geometry-Advanced-PolygonCut",
     "Geometry-Advanced-PointInConvexPolygon"
    ],
    "teo": [
     [
      "Geometry",
      "Producto cruz y orientación"
     ],
     [
      "Geometry",
      "Distancia punto-segmento"
     ],
     [
      "Geometry",
      "Eje radical"
     ]
    ],
    "preguntas": [
     {
      "q": "Las circunferencias de centros (0, 0) y (3, 4) con radios 2 y 3, ¿cuántos puntos comunes tienen?",
      "a": "Uno: d² = 25 = (2 + 3)², son tangentes exteriores."
     },
     {
      "q": "¿Por qué para segmentos que no se cortan basta revisar los 4 extremos?",
      "a": "Porque la distancia es convexa en los parámetros y su mínimo está en el borde del cuadrado [0, 1]², es decir, en un extremo."
     }
    ],
    "cierre": "Con estas primitivas y el producto cruz, el resto de la geometría de competencia es combinar piezas conocidas."
   },
   {
    "t": "Geometría: envolvente convexa, barridos y estructuras",
    "obj": [
     "Construir la envolvente convexa.",
     "Encontrar el par más cercano.",
     "Resolver problemas con una línea de barrido.",
     "Mantener rectas con Li Chao."
    ],
    "clase": [
     {
      "h": "Envolvente convexa"
     },
     "La envolvente convexa se construye ordenando los puntos y manteniendo una pila que solo gira en un sentido: O(n log n), óptimo cuando la envolvente tiene muchos puntos. Hay dos versiones clásicas: Graham (ordena por ángulo) y la cadena monótona (ordena por x y arma la parte de arriba y la de abajo); la segunda evita comparar ángulos.",
     {
      "h": "Par más cercano y Manhattan"
     },
     "El par más cercano usa divide y vencerás o una línea de barrido con una franja de ancho d: cada punto solo se compara con un número constante de vecinos. Para distancias Manhattan, el truco es rotar 45°: `|dx| + |dy| = max(|u1 − u2|, |v1 − v2|)` con `u = x + y`, `v = x − y`.",
     {
      "h": "Línea de barrido"
     },
     "Se recorre el plano con una recta vertical imaginaria y se procesan eventos ordenados por x: inicios y finales de segmentos, de rectángulos, consultas. Lo que la recta corta en cada momento vive en una estructura (Fenwick, Segment Tree). Así se cuentan intersecciones de segmentos horizontales y verticales o se mide el área de una unión de rectángulos.",
     {
      "h": "Li Chao"
     },
     "Para insertar rectas y preguntar el mínimo en un x, el árbol de Li Chao guarda en cada nodo la recta que gana en el punto medio; la perdedora solo puede ganar en una mitad y baja por ella. O(log C) por operación."
    ],
    "algs": [
     "Geometry-ConvexHull",
     "Geometry-ClosestPair",
     "Geometry-Advanced-RotatingCalipers",
     "Geometry-Classic-Problems-Maximum-Manhattan-Distances",
     "Geometry-Classic-Problems-Intersection-Points",
     "Geometry-Classic-Problems-Area-of-Rectangles",
     "Geometry-Classic-Problems-Lines-and-Queries-I",
     "Geometry-Advanced-HalfPlaneIntersection"
    ],
    "teo": [
     [
      "Geometry",
      "Cota inferior de la envolvente convexa"
     ],
     [
      "Geometry",
      "Rotating calipers"
     ],
     [
      "Geometry",
      "Intersección de semiplanos"
     ],
     [
      "Geometry",
      "Suma de Minkowski"
     ]
    ],
    "preguntas": [
     {
      "q": "¿Qué pasa con los puntos colineales del borde en la envolvente?",
      "a": "Depende de lo que pida el problema: algunos piden incluirlos y otros no, y por eso el código tiene la opción include_collinear y un caso especial para el último tramo."
     },
     {
      "q": "En Li Chao, ¿por qué la recta perdedora baja solo por una mitad?",
      "a": "Dos rectas se cruzan a lo sumo una vez; si una gana en el medio, la otra solo puede ganar a un lado del cruce."
     }
    ],
    "cierre": "Envolvente, barrido y una buena estructura de datos: con eso se resuelve la geometría de nivel regional."
   },
   {
    "t": "Geometría de finales: orden angular y Minkowski",
    "obj": [
     "Ordenar por ángulo de forma exacta, sin atan2.",
     "Sumar polígonos convexos y usarlo para «elegir un punto de cada figura»."
    ],
    "clase": [
     "Con coordenadas enteras grandes, los flotantes fallan justo en los empates. Estas dos técnicas trabajan solo con productos cruz.",
     {
      "h": "Orden angular"
     },
     "Separar en semiplanos y comparar con el producto cruz da un orden total exacto. Es la base de los barridos radiales y de muchos algoritmos de geometría.",
     {
      "h": "Suma de Minkowski"
     },
     "Las aristas de A + B son las de A y las de B mezcladas por ángulo: O(n + m). Preguntas como «¿existe a ∈ A, b ∈ B con a + b = h?» o «¿chocan estos polígonos si uno se traslada?» se vuelven punto en polígono convexo.",
     {
      "nota": "Con coordenadas hasta 10^9, los productos cruz de sumas pueden pasar de 9·10^18: usa __int128 en C++."
     }
    ],
    "algs": [
     "Geometry-Advanced-AngularSort",
     "Geometry-Advanced-Minkowski"
    ],
    "teo": [
     [
      "Geometry",
      "Orden angular por semiplanos"
     ],
     [
      "Geometry",
      "Suma de Minkowski"
     ]
    ],
    "preguntas": [
     {
      "q": "¿Por qué no basta comparar con el signo del producto cruz en todo el círculo?",
      "a": "Porque no es transitivo: tres vectores separados 120° se ordenan en ciclo. Dentro de un semiplano sí es transitivo."
     },
     {
      "q": "¿Cuántos vértices tiene a lo sumo A + B?",
      "a": "|A| + |B|, porque cada arista viene de uno de los dos."
     }
    ],
    "cierre": "En geometría de finales: enteros, productos cruz y cuidado con los desbordes."
   }
  ]
 },
 {
  "parte": "IX. Matemáticas avanzadas",
  "caps": [
   {
    "t": "Teoría de números para finales",
    "obj": [
     "Resolver ecuaciones a·x + b·y = c y sistemas de congruencias.",
     "Calcular φ para todos los números hasta N.",
     "Probar primalidad y factorizar números de hasta 10^18."
    ],
    "clase": [
     "La teoría de números de competencia descansa en tres herramientas: **Euclides extendido** (combinaciones lineales e inversos), la **criba** (información de todos los números pequeños) y la **aritmética modular rápida** (exponenciación y multiplicación en 128 bits).",
     {
      "h": "Bézout y el chino del resto"
     },
     "a·x + b·y = c tiene solución entera si y solo si gcd(a, b) divide a c, y Euclides extendido la construye. Con eso se combinan dos congruencias en una sola módulo el mcm, incluso si los módulos no son coprimos.",
     {
      "h": "φ de Euler"
     },
     "φ(n) = n·Π(1 − 1/p). Una criba la calcula para todos los números hasta N, y el teorema de Euler a^φ(m) ≡ 1 (mód m) reduce exponentes gigantes.",
     {
      "h": "Números grandes"
     },
     "Miller-Rabin decide primalidad con 7 bases (determinista para n < 2^64) y Pollard rho encuentra un factor en unos n^(1/4) pasos usando la paradoja del cumpleaños.",
     {
      "py": "def ext_gcd(a, b):\n    if b == 0:\n        return a, 1, 0\n    g, x, y = ext_gcd(b, a % b)\n    return g, y, x - (a // b) * y"
     }
    ],
    "algs": [
     "FunctionalTools-Number-Theory-ExtendedEuclid",
     "FunctionalTools-Number-Theory-CRT",
     "FunctionalTools-Number-Theory-EulerPhi",
     "FunctionalTools-Number-Theory-MillerRabin",
     "FunctionalTools-Number-Theory-PollardRho"
    ],
    "teo": [
     [
      "FunctionalTools",
      "Algoritmo de Euclides e identidad de Bézout"
     ],
     [
      "FunctionalTools",
      "Teorema chino del resto"
     ],
     [
      "FunctionalTools",
      "Teorema de Euler y función φ"
     ],
     [
      "FunctionalTools",
      "Miller–Rabin determinístico"
     ],
     [
      "FunctionalTools",
      "Pollard rho"
     ]
    ],
    "preguntas": [
     {
      "q": "¿Tiene solución entera 6x + 9y = 7?",
      "a": "No: gcd(6, 9) = 3 no divide a 7."
     },
     {
      "q": "¿Por qué Fermat solo no basta para probar primalidad?",
      "a": "Por los números de Carmichael, como 561, que cumplen a^(n−1) ≡ 1 para toda base coprima."
     },
     {
      "q": "x ≡ 2 (mód 4) y x ≡ 3 (mód 6), ¿tiene solución?",
      "a": "No: gcd(4, 6) = 2 y 3 − 2 = 1 no es par."
     }
    ],
    "cierre": "Con estas cinco piezas ya puedes leer casi cualquier problema de teoría de números de un regional y reconocer qué herramienta pide."
   },
   {
    "t": "Juegos combinatorios",
    "obj": [
     "Decidir quién gana en Nim con el xor.",
     "Calcular números de Grundy con mex.",
     "Combinar juegos independientes."
    ],
    "clase": [
     "En los juegos de dos jugadores con información completa y sin azar, cada posición es ganadora (N) o perdedora (P) para quien mueve: P si todas las jugadas llevan a N, y N si alguna lleva a P.",
     {
      "h": "Nim"
     },
     "En Nim, las posiciones perdedoras son exactamente las de xor 0. Es el ejemplo base porque **todo** juego imparcial se reduce a él.",
     {
      "h": "Sprague-Grundy"
     },
     "El número de Grundy de una posición es el mex de los Grundy alcanzables: la posición se comporta como una pila de Nim de ese tamaño. Para varios juegos simultáneos, se hace xor de sus Grundy.",
     {
      "nota": "Truco de competencia: si no ves el patrón, calcula los Grundy de los estados pequeños con fuerza bruta e imprímelos. Muchas veces son periódicos o tienen una forma cerrada."
     }
    ],
    "algs": [
     "FunctionalTools-Games-Nim",
     "FunctionalTools-Games-SpragueGrundy"
    ],
    "teo": [
     [
      "FunctionalTools",
      "Teorema de Sprague–Grundy"
     ]
    ],
    "preguntas": [
     {
      "q": "Pilas 3, 5, 6: ¿quién gana?",
      "a": "3 xor 5 xor 6 = 0: gana el segundo jugador."
     },
     {
      "q": "Si solo se pueden sacar 1, 2 o 3 piedras de una pila, ¿cuál es su Grundy?",
      "a": "h mód 4."
     }
    ],
    "cierre": "Ganadoras, perdedoras, mex y xor: ese es todo el lenguaje de los juegos imparciales."
   },
   {
    "t": "Polinomios: FFT y NTT",
    "obj": [
     "Entender por qué evaluar en raíces de la unidad acelera la multiplicación.",
     "Multiplicar polinomios en O(n log n) con FFT y con NTT.",
     "Reconocer conteos que son convoluciones."
    ],
    "clase": [
     "Multiplicar dos polinomios de grado n con la escuela cuesta O(n²). La FFT lo hace en O(n log n) cambiando de representación: de coeficientes a valores en puntos bien elegidos.",
     {
      "h": "Por qué raíces de la unidad"
     },
     "En las raíces n-ésimas de la unidad, la evaluación se parte en pares e impares sobre las raíces (n/2)-ésimas: A(w) = Par(w²) + w·Impar(w²). Esa recursión da O(n log n), y la inversa es la misma transformada con w⁻¹.",
     {
      "h": "NTT"
     },
     "Módulo 998244353 = 119·2^23 + 1 existen raíces de la unidad de orden 2^k exactas, así que se hace lo mismo sin flotantes. Es la opción por defecto cuando la respuesta se pide módulo ese primo.",
     {
      "h": "Convoluciones escondidas"
     },
     "\"¿De cuántas formas se puede obtener cada suma con un elemento de A y uno de B?\" es multiplicar los polinomios de frecuencias. Lo mismo para coincidencias de cadenas con comodines o para sumas de dados."
    ],
    "algs": [
     "FunctionalTools-Polynomials-FFT",
     "FunctionalTools-Polynomials-NTT"
    ],
    "teo": [
     [
      "FunctionalTools",
      "Convolución con FFT / NTT"
     ]
    ],
    "preguntas": [
     {
      "q": "Si A tiene grado 5 y B grado 7, ¿de qué tamaño mínimo debe ser la FFT?",
      "a": "El producto tiene grado 12, o sea 13 coeficientes: la potencia de 2 siguiente es 16."
     },
     {
      "q": "¿Por qué no sirve NTT módulo 10^9 + 7?",
      "a": "Porque 10^9 + 6 = 2·500000003 no tiene un factor 2^k grande: no hay raíces de la unidad de orden potencia de 2 suficientemente grandes."
     }
    ],
    "cierre": "Cada vez que veas \"para cada suma posible, cuántas formas\", piensa en una convolución."
   },
   {
    "t": "Álgebra lineal para competencias",
    "obj": [
     "Resolver sistemas y calcular determinantes módulo un primo.",
     "Usar bases xor sobre GF(2).",
     "Saber cuándo aparece la programación lineal y usar el símplex."
    ],
    "clase": [
     "Gauss es la herramienta de álgebra lineal que más aparece: sistemas de ecuaciones de probabilidades, rangos, determinantes (Kirchhoff) y, sobre bits, bases xor.",
     {
      "h": "Gauss módulo p"
     },
     "La eliminación es la de siempre, pero dividiendo con inversos modulares: no hay errores de redondeo. Un pivote nulo en una columna significa variable libre (en un sistema) o determinante 0.",
     {
      "h": "Bases xor"
     },
     "Sobre GF(2), sumar es xor. Guardar un representante por bit alto permite saber qué números se forman y cuál es el máximo xor, en O(bits) por número.",
     {
      "h": "Programación lineal"
     },
     "Si el problema es maximizar algo lineal con restricciones lineales y variables reales, el símplex lo resuelve, y la dualidad da cotas y certificados. Es raro en contest, pero cuando aparece no hay otra salida."
    ],
    "algs": [
     "FunctionalTools-Linear-Algebra-GaussMod",
     "FunctionalTools-Linear-Algebra-Determinant",
     "FunctionalTools-Linear-Algebra-XorBasis",
     "FunctionalTools-Linear-Algebra-Simplex"
    ],
    "teo": [
     [
      "Graphs",
      "Teorema de Kirchhoff (matriz-árbol)"
     ],
     [
      "FunctionalTools",
      "Dualidad de programación lineal"
     ]
    ],
    "preguntas": [
     {
      "q": "¿Cómo detecta Gauss que un sistema no tiene solución?",
      "a": "Al final queda una fila con todos los coeficientes en 0 y término independiente distinto de 0."
     },
     {
      "q": "¿Cuántos números puede tener a lo sumo una base xor de números de 60 bits?",
      "a": "60, uno por bit más alto posible."
     }
    ],
    "cierre": "Si ves ecuaciones lineales, ecuaciones sobre bits o un determinante, piensa en Gauss."
   },
   {
    "t": "Combinatoria y teoría de números avanzadas",
    "obj": [
     "Calcular binomiales con n enorme (Lucas).",
     "Contar con Möbius y con simetrías (Burnside).",
     "Resolver logaritmos discretos."
    ],
    "clase": [
     "Las preguntas de conteo de finales combinan varias de estas piezas con aritmética modular.",
     {
      "h": "Lucas"
     },
     "Con un primo pequeño, los factoriales se anulan; Lucas reduce C(n, k) a binomiales de dígitos en base p.",
     {
      "h": "Möbius y Burnside"
     },
     "Möbius es inclusión-exclusión sobre divisores: convierte «gcd = 1» en una suma sobre múltiplos. Burnside cuenta objetos salvo simetrías promediando los puntos fijos de cada simetría.",
     {
      "h": "Logaritmo discreto"
     },
     "Baby-step giant-step resuelve a^x ≡ b en O(√m), incluso con módulo compuesto si primero se separan los factores comunes."
    ],
    "algs": [
     "FunctionalTools-Combinatorics-Lucas",
     "FunctionalTools-Combinatorics-Mobius",
     "FunctionalTools-Combinatorics-Burnside",
     "FunctionalTools-Number-Theory-DiscreteLog"
    ],
    "teo": [
     [
      "FunctionalTools",
      "Teorema de Lucas"
     ],
     [
      "FunctionalTools",
      "Inclusión–exclusión e inversión de Möbius"
     ],
     [
      "FunctionalTools",
      "Lema de Burnside"
     ],
     [
      "FunctionalTools",
      "Logaritmo discreto (baby-step giant-step)"
     ]
    ],
    "preguntas": [
     {
      "q": "¿Cuántos collares de 4 perlas con 2 colores hay salvo rotación?",
      "a": "(2⁴ + 2 + 2² + 2)/4 = 24/4 = 6."
     },
     {
      "q": "¿Por qué μ(d) = 0 cuando d tiene un primo al cuadrado?",
      "a": "Porque en la inclusión-exclusión esos términos se cancelan: solo cuentan los productos de primos distintos."
     }
    ],
    "cierre": "Contar salvo simetría: Burnside. Contar con gcd: Möbius. Binomial con n gigante: Lucas."
   },
   {
    "t": "Polinomios avanzados",
    "obj": [
     "Convolucionar con cualquier módulo.",
     "Evaluar polinomios conocidos por sus valores (Lagrange).",
     "Encontrar recurrencias lineales a partir de términos (Berlekamp-Massey)."
    ],
    "clase": [
     "La FFT y la NTT son la base; este capítulo agrega lo que hace falta cuando el módulo no ayuda o cuando el polinomio no se conoce explícitamente.",
     {
      "h": "Cualquier módulo"
     },
     "Tres NTT con primos distintos y el teorema chino del resto reconstruyen coeficientes de hasta ~10^26 y luego se reducen al módulo pedido.",
     {
      "h": "Lagrange y Berlekamp-Massey"
     },
     "Si sabes que la respuesta es un polinomio de grado d en n, calcula d + 1 valores y evalúa con Lagrange en O(d). Si sospechas que es una recurrencia lineal, calcula unos cientos de términos con fuerza bruta y Berlekamp-Massey encuentra la recurrencia.",
     {
      "nota": "Berlekamp-Massey es un arma de contest: con 2d términos correctos, recupera cualquier recurrencia de orden d, aunque no sepas deducirla."
     }
    ],
    "algs": [
     "FunctionalTools-Polynomials-NTTAnyMod",
     "FunctionalTools-Polynomials-Lagrange",
     "FunctionalTools-Polynomials-BerlekampMassey"
    ],
    "teo": [
     [
      "FunctionalTools",
      "Convolución con FFT / NTT"
     ],
     [
      "FunctionalTools",
      "Interpolación de Lagrange"
     ],
     [
      "FunctionalTools",
      "Teorema de Cayley–Hamilton y recurrencias lineales"
     ]
    ],
    "preguntas": [
     {
      "q": "¿Cuántos valores necesitas para 1^k + … + n^k con Lagrange?",
      "a": "k + 2, porque la suma es un polinomio de grado k + 1 en n."
     },
     {
      "q": "¿Por qué tres primos y no dos para módulo 10^9 + 7 con n = 10^6?",
      "a": "Cada coeficiente puede llegar a 10^6 · 10^18 = 10^24, más que el producto de dos primos (~10^18)."
     }
    ],
    "cierre": "Antes de deducir una fórmula, pregúntate si basta con calcular términos y dejar que Lagrange o Berlekamp-Massey hagan el resto."
   }
  ]
 },
 {
  "parte": "X. Hacia las finales: el oficio del ICPC",
  "caps": [
   {
    "t": "Competir en equipo: el oficio del ICPC",
    "obj": [
     "Organizar un equipo de tres con un solo computador.",
     "Preparar y usar un notebook de 25 páginas.",
     "Encontrar errores con stress testing.",
     "Resolver problemas interactivos y usar aleatorización con seguridad.",
     "Conocer los recursos de C++ que ahorran tiempo."
    ],
    "clase": [
     "En el ICPC compiten equipos de **tres personas con un solo computador** durante cinco horas, con un notebook impreso (en las finales mundiales el límite ha sido de 25 páginas; revisa la regla vigente de tu competencia). Saber algoritmos es necesario, pero en las finales la diferencia la hace el oficio: cómo se reparte el trabajo, cómo se depura y cómo se evita perder tiempo.",
     {
      "h": "Roles y estrategia"
     },
     "Al empezar, los tres leen problemas distintos y anotan dificultad estimada y tema. El computador nunca debe estar libre: mientras uno escribe código, los otros piensan en papel o preparan casos. Se programa en el computador solo con la solución pensada completa. Si un problema lleva 40 minutos sin avance, se cambia de manos o se deja. Mira el marcador: los problemas que muchos equipos resolvieron suelen ser más fáciles de lo que parecen.",
     {
      "h": "El notebook"
     },
     "El notebook es la memoria compartida del equipo: plantilla, estructuras (DSU, Fenwick, Segment Tree lazy, treap), grafos (Dinic, costo mínimo, SCC, puentes, HLD), cadenas (KMP, Z, SA, Aho-Corasick, autómata de sufijos), matemáticas (CRT, Miller-Rabin, Pollard, NTT, Gauss) y geometría. Cada código debe estar probado y tener una línea que diga qué entra y qué sale. KACTL es el ejemplo de referencia de cómo se ve uno bueno.",
     {
      "h": "Stress testing"
     },
     "Cuando un envío da WA y no ves el error, escribe una **fuerza bruta** obviamente correcta y un **generador** de casos pequeños al azar, y compáralos en un ciclo hasta encontrar un caso que difiera. Es la técnica más eficaz para depurar en competencia (es la que se usó para verificar los códigos de esta guía: los generadores, las fuerzas brutas y el script están en la carpeta tests/ del repositorio).",
     {
      "py": "# stress.py: compara solucion y bruta con casos al azar\nimport random, subprocess\nfor it in range(1000):\n    n = random.randint(1, 8)\n    caso = f\"{n}\\n\" + \" \".join(str(random.randint(1, 10)) for _ in range(n)) + \"\\n\"\n    a = subprocess.run([\"./sol\"], input=caso, capture_output=True, text=True).stdout\n    b = subprocess.run([\"./bruta\"], input=caso, capture_output=True, text=True).stdout\n    if a.split() != b.split():\n        print(\"Caso que falla:\\n\" + caso, \"sol:\", a, \"bruta:\", b)\n        break"
     },
     {
      "h": "Problemas interactivos"
     },
     "En un problema interactivo tu programa conversa con el juez: imprime una pregunta, lee la respuesta y decide. Hay que **vaciar la salida** después de cada pregunta (`cout << endl` o `cout.flush()` en C++, `print(..., flush=True)` en Python), no exceder el número de preguntas y leer exactamente lo que el juez manda. Casi siempre la idea es una búsqueda binaria o un descarte por mitades.",
     {
      "h": "Aleatorización"
     },
     "Muchas soluciones usan azar: hashing con base aleatoria, treaps, Pollard rho, mezclar la entrada antes de un algoritmo con mal peor caso. Usa `mt19937_64 rng(chrono::steady_clock::now().time_since_epoch().count())` y nunca `rand()`: en Codeforces otros participantes pueden ver tu código y construir casos contra semillas fijas (*hacks*). Para `unordered_map`, usa un hash propio con semilla aleatoria.",
     {
      "h": "C++ que ahorra tiempo"
     },
     "`__int128` para productos de 64 bits, `bitset` para dividir por 64 el costo de DP booleanas, `__builtin_popcountll` y `__builtin_ctzll` para bits, `pb_ds` para conjuntos ordenados con k-ésimo, `lower_bound` sobre vectores ordenados en vez de `set` cuando no hay inserciones. Y compila siempre con `-Wall -Wextra -fsanitize=address,undefined` mientras practicas: encuentra lecturas fuera de rango que de otra forma darían WA aleatorio.",
     {
      "nota": "Rutina antes de enviar: probar los ejemplos, probar el caso mínimo (n = 1), el caso máximo (para el tiempo), revisar desbordes (¿long long?) y el formato de salida. Cada envío incorrecto suma 20 minutos de penalización si al final resuelves ese problema (los rechazos de problemas que nunca resuelves no cuentan, pero sí el tiempo perdido). Y recuerda que el marcador se congela en la última hora: lo que ves ahí ya no es la tabla real."
     },
     {
      "h": "Entrenar hacia las finales"
     },
     "El camino típico: una colección clásica completa (como CSES) como base, luego problemas de Codeforces en la banda de 1900 a 2400 (y después 2400–3000), y contests virtuales de regionales en equipo, con la misma duración y el mismo notebook. Después de cada contest, se **cierra** cada problema que no salió (se lee la solución y se programa). En la sección Practicar están los problemas de la banda alta y regionales latinoamericanos para empezar."
    ],
    "algs": [],
    "teo": [
     [
      "Strings",
      "Probabilidad de colisión del hashing"
     ],
     [
      "Probability",
      "Paradoja del cumpleaños"
     ]
    ],
    "preguntas": [
     {
      "q": "Tu solución da WA en el caso 37 y los ejemplos pasan. ¿Qué haces primero?",
      "a": "Revisar desbordes y casos borde; si no aparece el error, escribir una fuerza bruta y un generador de casos pequeños y comparar (stress testing)."
     },
     {
      "q": "En un interactivo te da Idleness Limit Exceeded. ¿Cuál es el error más probable?",
      "a": "No vaciar la salida después de imprimir la pregunta: el juez nunca la recibió."
     },
     {
      "q": "¿Por qué usar una semilla basada en el reloj y no una fija?",
      "a": "Porque con una semilla fija el comportamiento es predecible y alguien puede construir un caso que haga fallar el hashing o volver lento el algoritmo."
     }
    ],
    "cierre": "Terminaste el libro. El siguiente paso es practicar en equipo con contests virtuales completos. Vuelve al modo libre cuando necesites repasar un algoritmo, y a Practicar para seguir subiendo de nivel."
   }
  ]
 }
];
