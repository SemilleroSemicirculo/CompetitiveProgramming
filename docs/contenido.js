// Explicaciones de cada algoritmo para la guía.
// nivel: 1 = Básico, 2 = Intermedio, 3 = Avanzado, 4 = Finales mundiales
// extra (opcional): { pq: «¿Por qué funciona?», err: [errores típicos] }
window.CONTENIDO = {};
function C(id, nivel, idea, texto, cuando, pasos, extra) { window.CONTENIDO[id] = Object.assign({ nivel, idea, texto, cuando, pasos }, extra || {}); }

// ---------- Programación dinámica ----------
C("DP-Algorithms-CoinChange", 1, "Para cada cantidad, guarda cuántas monedas como mínimo se necesitan, y construye las grandes a partir de las pequeñas.",
  "Si sabes cuántas monedas necesitas para pagar 7, pagar 10 con una moneda de 3 cuesta eso más una. La programación dinámica aprovecha esto: en vez de probar todas las combinaciones, resuelve primero las cantidades pequeñas y las reutiliza.",
  "Cuando hay que formar un total con piezas que se pueden repetir y quieres el mínimo de piezas.",
  ["dp[0] = 0: pagar 0 no necesita monedas.", "Para cada moneda c y cada cantidad x ≥ c: dp[x] = min(dp[x], dp[x − c] + 1).", "La respuesta es dp[objetivo], o −1 si nunca se alcanzó."]);
C("DP-Algorithms-CoinCombinations", 1, "Cuenta de cuántas formas se puede formar cada cantidad, sumando las formas de las cantidades más pequeñas.",
  "Es la versión de conteo de las monedas. Un detalle importa mucho: si recorres las monedas por fuera, cada combinación se cuenta una sola vez (2+3 y 3+2 son la misma). Si recorres las cantidades por fuera, cuentas el orden también.",
  "Cuando preguntan «¿de cuántas formas…?» con piezas repetibles.",
  ["dp[0] = 1: hay una forma de no pagar nada.", "Para cada moneda c y cada x ≥ c: dp[x] += dp[x − c].", "Se toma el resultado módulo 10⁹+7 porque crece muy rápido."]);
C("DP-Algorithms-Knapsack", 2, "Con un presupuesto limitado, decide para cada objeto si lo tomas o no, guardando el mejor valor para cada presupuesto.",
  "El problema de la mochila: cada libro tiene precio y páginas, y quieres el máximo de páginas sin pasarte del dinero. Para cada libro hay dos opciones, comprarlo o no. La tabla dp[w] guarda lo mejor que se logra gastando como mucho w. Se recorre el presupuesto de mayor a menor para no comprar el mismo libro dos veces.",
  "Cuando cada objeto se usa a lo sumo una vez y hay un límite de peso, dinero o espacio.",
  ["dp[w] = 0 para todo w al inicio.", "Para cada libro, recorrer w desde x hasta su precio.", "dp[w] = max(dp[w], dp[w − precio] + páginas)."]);
C("DP-Algorithms-Kadane1D", 1, "Recorre el arreglo una vez, decidiendo en cada número si continúas el subarreglo actual o empiezas uno nuevo.",
  "Si la suma que llevas es negativa, solo estorba: es mejor empezar de cero en el número actual. Con esa idea basta una pasada para encontrar la mayor suma de un tramo seguido del arreglo.",
  "Cuando buscas el subarreglo contiguo con mayor suma.",
  ["curr = mejor suma que termina en la posición actual.", "curr = max(a[i], curr + a[i]).", "best guarda el mayor curr visto."]);
C("DP-Algorithms-Kadane2D", 2, "Fija qué filas forman el rectángulo, aplasta esas filas en un arreglo de sumas por columna y aplica Kadane.",
  "Un rectángulo queda determinado por su fila de arriba, su fila de abajo y sus columnas. Si fijas las dos filas, sumar cada columna entre ellas convierte el problema en el de un arreglo, que Kadane resuelve en tiempo lineal.",
  "Cuando buscas la submatriz con mayor suma.",
  ["Elegir la fila superior top.", "Ir bajando la fila inferior y acumular colSum[j].", "Aplicar Kadane sobre colSum y guardar el mejor."]);
C("DP-Algorithms-LIS-I", 1, "Para cada posición, mira todas las anteriores más pequeñas y extiende la mejor subsecuencia.",
  "Una subsecuencia creciente no tiene que ser contigua. DP[i] es la más larga que termina en a[i]: se obtiene extendiendo la mejor de las anteriores con valor menor. Es fácil de entender pero cuesta n² operaciones, así que solo sirve para n pequeños (unos 5000).",
  "Para aprender la idea o cuando n es pequeño.",
  ["DP[i] = 1 al inicio.", "Para cada j < i con a[j] < a[i]: DP[i] = max(DP[i], DP[j] + 1).", "La respuesta es el máximo DP[i]."]);
C("DP-Algorithms-LIS-II", 2, "Mantiene, para cada longitud, el menor final posible y usa búsqueda binaria para ubicar cada número.",
  "Una subsecuencia que termina en un número más pequeño es mejor, porque deja más opciones para crecer. El arreglo R guarda esos finales y siempre está ordenado, así que cada número nuevo se coloca con búsqueda binaria. Baja la complejidad de n² a n log n.",
  "Cuando necesitas la subsecuencia creciente más larga con n grande (10⁵ o más).",
  ["Buscar en R la primera posición con valor ≥ a[i].", "Si no existe, agregar a[i] al final: la LIS crece.", "Si existe, reemplazarla por a[i]."]);
C("DP-Algorithms-LCS", 2, "Compara dos secuencias desde el inicio y, en cada par de posiciones, decide si los elementos coinciden o descartas uno.",
  "LCS[i][j] es la subsecuencia común más larga entre los primeros i elementos de a y los primeros j de b. Si los últimos coinciden, la respuesta crece en uno; si no, se descarta el último de alguna de las dos. Al final se camina la tabla hacia atrás para recuperar la secuencia.",
  "Cuando hay que comparar dos secuencias o textos (diferencias entre archivos, ADN…).",
  ["Llenar la tabla fila por fila.", "Si a[i] = b[j]: LCS[i][j] = LCS[i−1][j−1] + 1.", "Si no: el máximo entre quitar uno u otro.", "Reconstruir desde (n, m)."]);
C("DP-Algorithms-EditDistance", 2, "Calcula cuántas ediciones (insertar, borrar o cambiar letras) convierten una palabra en otra.",
  "La tabla dp[i][j] dice cuánto cuesta convertir las primeras i letras de a en las primeras j de b. Cada casilla sale de tres vecinas: borrar, insertar o reemplazar (gratis si las letras son iguales). Es lo que usan los correctores ortográficos.",
  "Cuando preguntan qué tan parecidas son dos cadenas.",
  ["dp[i][0] = i y dp[0][j] = j (casos base).", "dp[i][j] = min(borrar, insertar, reemplazar).", "La respuesta es dp[n][m]."]);
C("DP-Algorithms-BitmaskDP", 3, "Representa cada grupo de personas como un número binario y resuelve el problema para cada grupo posible.",
  "Con n ≤ 20 hay solo 2ⁿ (≈ un millón) subconjuntos, y cada uno cabe en un entero: el bit i encendido indica que la persona i está incluida. Para cada subconjunto se prueba quién subió último al ascensor y se guarda el mejor par (viajes, peso del último viaje).",
  "Cuando n es pequeño (≤ 20) y el problema depende de qué elementos ya usaste.",
  ["dp[0] = (1 viaje, 0 kg).", "Para cada máscara, probar quitar cada persona i.", "Si cabe, se suma al último viaje; si no, se abre otro."]);
C("Probability-Classic-Problems-Campeonato", 1, "La probabilidad de ganar se calcula a partir de lo que falta: un partido más acerca a uno de los dos equipos.",
  "P[i][j] es la probabilidad de que A gane si le faltan i victorias y a B le faltan j. Después de un partido, o A ganó (le falta una menos) o ganó B. Así cada casilla sale de dos más pequeñas, con los casos base cuando alguno ya ganó.",
  "Cuando hay que calcular probabilidades de procesos que avanzan por etapas.",
  ["P[0][j] = 1 (A ya ganó) y P[i][0] = 0.", "P[i][j] = p·P[i−1][j] + q·P[i][j−1].", "La respuesta es P[n][n]."]);

// ---------- Estructuras de datos ----------
C("Data-Structures-Algorithms-Deque", 2, "Una deque (double-ended queue) es una fila con dos puertas: se puede meter y sacar por adelante y por atrás, todo en O(1).",
  "Es la generalización de la pila y la cola. Con push_back y pop_back se comporta como una pila; con push_back y pop_front, como una cola. Además permite mirar el frente y el final sin sacarlos. En C++ es std::deque y en Python collections.deque (appendleft, append, popleft, pop). El uso clásico en competencia es la deque monótona: para el mínimo de una ventana que se desliza, se guardan solo los candidatos en orden creciente; los nuevos sacan por atrás a los mayores y los que salen de la ventana se quitan por el frente. Cada elemento entra y sale una sola vez, así que todo es lineal.",
  "Cuando necesitas sacar elementos por los dos extremos: ventanas deslizantes, BFS 0-1 o simular una pila y una cola a la vez.",
  ["push_front(x) / push_back(x): meter por adelante o por atrás. O(1).", "pop_front() / pop_back(): sacar por adelante o por atrás. O(1).", "front() / back(): mirar los extremos sin sacar.", "En la ventana deslizante: sacar por atrás los ≥ al nuevo, meterlo atrás, quitar del frente los que salieron; el frente es el mínimo."]);
C("Data-Structures-Algorithms-Stack", 1, "Una pila (stack) es una colección donde solo se toca el elemento de arriba: el último que entra es el primero que sale (LIFO).",
  "Piensa en una torre de platos: pones uno encima (push), quitas el de encima (pop) o miras cuál está arriba (top). No puedes sacar uno del medio. A cambio de esa restricción, las tres operaciones cuestan O(1). En C++ es std::stack (o un vector con push_back/pop_back); en Python, una lista con append y pop. Las pilas aparecen cuando hay que «deshacer» o volver al último pendiente: el botón atrás del navegador, revisar paréntesis balanceados, la recursión y el DFS. El código de esta lección usa una pila monótona: para cada número busca el menor más cercano a su izquierda, sacando de la pila los que ya nunca podrán ser respuesta.",
  "Cuando lo que importa es lo más reciente: deshacer, emparejar paréntesis, recorrer en profundidad o encontrar el menor/mayor más cercano a un lado.",
  ["push(x): x se pone encima del tope. O(1).", "pop(): se quita el tope. O(1).", "top(): se mira el tope sin quitarlo. O(1).", "En la pila monótona: antes de meter a[i], sacar los que sean ≥ a[i]; lo que quede arriba es la respuesta."]);
C("Data-Structures-Algorithms-Heap", 1, "Un heap (montículo o cola de prioridad) te da siempre el elemento más pequeño (o el más grande) de un conjunto que va cambiando.",
  "Es un árbol binario casi completo guardado en un arreglo: los hijos de la posición i están en 2i+1 y 2i+2. Solo cumple una regla: cada padre es menor o igual que sus hijos, así que la raíz es el mínimo. Para insertar, el elemento se pone al final y «sube» intercambiándose con su padre mientras sea menor. Para sacar el mínimo, el último pasa a la raíz y «baja» intercambiándose con su hijo menor. Como el árbol tiene altura log n, ambas operaciones cuestan O(log n) y ver el mínimo cuesta O(1). En C++ es std::priority_queue (por defecto da el máximo; usa greater<> para el mínimo) y en Python el módulo heapq. En esta lección se usa para saber qué habitación de hotel se desocupa primero.",
  "Cuando necesitas sacar muchas veces el menor (o mayor) de un conjunto que cambia: Dijkstra, Prim, simulaciones por eventos, las k mejores combinaciones.",
  ["push(x): poner x al final y subirlo mientras sea menor que su padre. O(log n).", "top(): la raíz es el mínimo. O(1).", "pop(): quitar la raíz, poner el último en su lugar y bajarlo hacia el hijo menor. O(log n).", "En el problema: ordenar clientes por llegada y reutilizar la habitación cuya salida (la raíz del heap) ya pasó."]);
C("Data-Structures-Algorithms-FenwickTree", 2, "Un arreglo donde cada casilla guarda la suma de un bloque, para sumar prefijos y actualizar en log n.",
  "Sumar un rango recorriendo el arreglo tarda n pasos. El Fenwick Tree (o BIT) usa los bits del índice para dividir el arreglo en bloques de tamaño potencia de 2. Una suma de prefijo junta pocos bloques, y una actualización toca pocos bloques.",
  "Sumas de rangos con valores que cambian.",
  ["add(i, v): subir por i += i & −i.", "query(i): bajar por i −= i & −i acumulando.", "Rango [l, r] = query(r) − query(l − 1)."]);
C("Data-Structures-Algorithms-SparseTable", 2, "Precalcula el mínimo de todos los rangos de longitud potencia de 2 y responde cada consulta en O(1).",
  "Cualquier rango [l, r] se puede cubrir con dos bloques de longitud 2ᵏ que se solapan. Para el mínimo el solape no importa. Como la tabla no se puede actualizar fácilmente, solo sirve si el arreglo no cambia.",
  "Mínimos, máximos o gcd de rangos en un arreglo fijo, con muchas consultas.",
  ["st[0] = el arreglo.", "st[j][i] = min(st[j−1][i], st[j−1][i + 2^(j−1)]).", "Consulta: k = log2(largo), min de los dos bloques."]);
C("Data-Structures-Algorithms-SegmentTree", 2, "Un árbol donde cada nodo guarda el resultado de una operación sobre un tramo del arreglo. Sirve para cualquier operación asociativa (suma, mínimo, máximo, gcd, xor…), con consultas de rango y cambios puntuales en O(log n).",
  "Las hojas son los elementos del arreglo y cada nodo guarda combinar(hijo izquierdo, hijo derecho), así que la raíz tiene el resultado de todo el arreglo. Para consultar [l, r] se juntan los pocos nodos (a lo sumo unos 2·log n) cuyos tramos cubren exactamente el rango. Para cambiar a[i] se actualiza la hoja y se recalcula solo el camino hasta la raíz. ¿Con qué operaciones funciona? Con cualquiera que cumpla dos condiciones. Primera: ser asociativa, (a ∘ b) ∘ c = a ∘ (b ∘ c), porque el árbol agrupa los elementos de otra forma que el orden de izquierda a derecha. Segunda: tener un elemento neutro e, con e ∘ x = x, para los tramos que no aportan nada: 0 para la suma, +∞ para el mínimo, −∞ para el máximo, 0 para gcd y xor, 1 para el producto. No hace falta que se pueda «deshacer» (como la resta en Fenwick) ni que sea idempotente (como en la Sparse Table). Si la operación no es conmutativa (por ejemplo, multiplicar matrices), funciona igual siempre que se combine en orden izquierda → derecha. No sirve directamente para cosas que no se pueden resumir en un valor combinable, como la mediana o contar valores distintos. El código de esta lección usa el mínimo; para que sea de sumas basta cambiar la función de combinar y el neutro. Si además hay que modificar rangos enteros, se necesita la siguiente lección: Lazy Segment Tree.",
  "Cuando hay muchas consultas de rango (suma, mínimo, máximo, gcd…) mezcladas con cambios de elementos individuales.",
  ["Elegir la operación ∘ (asociativa) y su neutro e. Ejemplos: suma con 0, mínimo con +∞, máximo con −∞, gcd con 0.", "build: las hojas son el arreglo; cada padre = hijo izquierdo ∘ hijo derecho. O(n).", "update(i, x): cambiar la hoja i y recalcular sus ancestros. O(log n).", "query(l, r): si un nodo está completamente dentro, se usa su valor; si está fuera, aporta e; si está a medias, se baja a sus hijos. O(log n).", "En el código: ∘ = mínimo y e = +∞ (CSES Dynamic Range Minimum Queries)."]);
C("Data-Structures-Algorithms-LazySegmentTree", 3, "La extensión del Segment Tree para modificar rangos completos (sumar x o asignar x a todo [l, r]) en O(log n): la modificación se deja pendiente en los nodos y solo se baja cuando hace falta.",
  "En un Segment Tree normal, sumar x a todo un rango obligaría a cambiar cada hoja: O(n). La propagación perezosa (lazy) aprovecha los mismos nodos que usa una consulta: si un nodo cubre por completo el rango, se actualiza su valor directamente y se le pone una etiqueta «a mis hijos les falta esta modificación». Solo cuando una operación posterior necesita entrar a sus hijos, la etiqueta se empuja un nivel abajo (push). Para que funcione con una operación y un tipo de modificación hacen falta dos cosas. Primera: poder aplicar la modificación al resumen de un nodo sin mirar sus hojas. Con suma y «sumar x», la suma crece en x · (largo del tramo). Con mínimo y «sumar x», el mínimo crece en x. Con suma y «asignar x», la suma pasa a ser x · largo. Segunda: poder componer dos etiquetas pendientes en una sola. Sumar a y luego b es sumar a + b. Asignar x y luego sumar b es asignar x + b. Cualquier cosa seguida de asignar x es asignar x. El código de esta lección mantiene sumas con dos tipos de modificación de rango: sumar y asignar.",
  "Cuando hay modificaciones de rangos enteros y consultas de rango al mismo tiempo.",
  ["Cada nodo guarda su valor (aquí, la suma del tramo) y una etiqueta pendiente.", "apply(nodo, modificación): actualizar el valor del nodo y componer la etiqueta.", "push(nodo): antes de entrar a los hijos, aplicarles la etiqueta y borrarla.", "update(l, r, modificación): en los nodos totalmente dentro, apply y parar; en los parciales, push, recursión y recalcular.", "query(l, r): igual que en el Segment Tree normal, pero haciendo push al bajar."]);
C("Data-Structures-Algorithms-MoAlgorithm", 3, "Ordena las consultas de forma inteligente para mover una ventana poco a poco en vez de recalcular cada una.",
  "Si respondes las consultas en el orden dado, la ventana salta de un lado a otro. Mo agrupa las consultas por bloques de tamaño √n y las ordena, de modo que los extremos se mueven en total unas (n + q)·√n veces. Funciona con cualquier dato que se pueda agregar y quitar de a uno.",
  "Consultas de rango sin actualizaciones, cuando no hay una estructura directa (por ejemplo, valores distintos).",
  ["Comprimir valores.", "Ordenar consultas por bloque del extremo izquierdo.", "Mover L y R agregando o quitando elementos."]);
C("Data-Structures-Algorithms-SweepLine", 1, "Convierte cada intervalo en dos eventos (entrada y salida) y los recorre en orden de tiempo.",
  "En vez de revisar cada instante, solo importan los momentos en que algo cambia. Se ordenan los eventos y se lleva un contador de cuántos clientes hay; el mayor valor del contador es la respuesta.",
  "Problemas de intervalos que se solapan.",
  ["+1 al llegar, −1 al salir.", "Ordenar por tiempo.", "Recorrer acumulando y guardar el máximo."]);
C("Data-Structures-Algorithms-TwoPointers", 1, "Dos índices en los extremos de un arreglo ordenado que se acercan según la suma sea grande o pequeña.",
  "Con el arreglo ordenado, si la suma es menor que x conviene subir el izquierdo; si es mayor, bajar el derecho. Cada paso descarta un elemento, así que basta una pasada.",
  "Buscar pares con alguna condición en un arreglo ordenado.",
  ["Ordenar guardando los índices originales.", "l = 0, r = n − 1.", "Mover l o r según la suma."]);
C("Data-Structures-Classic-Problems-K-Smallest-Sums", 2, "Mezcla listas ordenadas con un heap, quedándote siempre con las k sumas más pequeñas.",
  "Elegir un número de cada fila da muchísimas sumas. Pero al combinar dos listas ordenadas, las k menores sumas se encuentran explorando desde (0, 0) y avanzando a los vecinos con un heap, como si fuera un Dijkstra sobre una cuadrícula.",
  "Cuando necesitas las k mejores combinaciones de varias listas.",
  ["Ordenar cada fila.", "Mezclar de a dos filas con el heap.", "Guardar solo las k menores."]);
C("Data-Structures-Classic-Problems-Team-Queue", 1, "Una cola (queue) es la fila del banco: se entra por el final y se sale por el frente; el primero en llegar es el primero en salir (FIFO).",
  "Una cola tiene dos operaciones principales: enqueue (entrar por el final) y dequeue (salir por el frente), además de mirar quién está al frente. Todas cuestan O(1). En C++ es std::queue y en Python collections.deque (append y popleft; evita list.pop(0), que es O(n)). Las colas sirven siempre que hay que atender en orden de llegada: turnos, buffers y, sobre todo, BFS. El problema Team Queue lleva la idea un paso más allá con una cola de colas: cada equipo tiene su propia cola, y la cola general guarda equipos. Quien llega se pone al final de su equipo si este ya está en la fila; si no, su equipo entra al final de la cola general.",
  "Cuando hay que procesar cosas en el mismo orden en que llegaron: BFS, simulaciones de turnos o filas con grupos.",
  ["enqueue(x): x entra por el final. O(1).", "dequeue(): sale el del frente. O(1).", "front(): mirar quién está al frente.", "En Team Queue: una cola por equipo + una cola general de equipos; al salir, sale el primero del equipo del frente y, si su equipo se vacía, el equipo deja la cola general."]);

// ---------- Grafos ----------
const G = "Graphs-Algorithms-";
C(G+"Graph-Traversal-BFS", 1, "Explora el grafo por capas desde el inicio: primero los vecinos, luego los vecinos de los vecinos…",
  "Como una onda en el agua, BFS visita los nodos en orden de distancia. Por eso, la primera vez que llega a un nodo lo hace por el camino con menos aristas. Guardando de dónde vino cada nodo se puede reconstruir ese camino.",
  "Caminos más cortos cuando todas las aristas valen lo mismo (laberintos, redes).",
  ["Meter el inicio en una cola.", "Sacar un nodo y meter sus vecinos no visitados.", "dist[v] = dist[u] + 1 y parent[v] = u."]);
C(G+"Graph-Traversal-DFS", 1, "Explora el grafo yendo lo más profundo posible antes de retroceder.",
  "DFS es como recorrer un laberinto con la mano pegada a la pared. Sirve para descubrir todo lo que está conectado a un nodo. Aquí se usa para contar componentes: cada vez que encuentras un nodo sin visitar, empieza una componente nueva.",
  "Para recorrer, contar componentes o detectar estructura en grafos.",
  ["Marcar el nodo como visitado.", "Llamar dfs en cada vecino no visitado.", "Cada dfs desde fuera = una componente nueva."]);
C(G+"Graph-Traversal-DSU", 1, "Mantiene grupos que se van uniendo y responde rápido si dos elementos están en el mismo grupo.",
  "Cada grupo es un árbol y su raíz lo representa. Para saber el grupo de alguien se sube hasta la raíz (y se acorta el camino para la próxima). Para unir dos grupos se cuelga el pequeño del grande. Ambas operaciones son casi O(1).",
  "Cuando se van agregando conexiones y preguntas si dos cosas quedaron conectadas.",
  ["find: subir a la raíz con compresión de caminos.", "unite: colgar el árbol pequeño del grande.", "Contar componentes restando 1 en cada unión exitosa."]);
C(G+"Graph-Traversal-Dijkstra", 2, "Expande siempre el nodo más cercano todavía no definitivo, como BFS pero con pesos.",
  "Si todas las aristas tienen peso positivo, el nodo con menor distancia tentativa ya no puede mejorar. Dijkstra lo fija y relaja sus aristas. Una cola de prioridad da ese nodo rápido. No funciona con pesos negativos.",
  "Camino más corto desde un origen con pesos no negativos (mapas, rutas).",
  ["dist[origen] = 0, el resto ∞.", "Sacar del heap el nodo con menor distancia.", "Relajar: si dist[u] + w < dist[v], actualizar."]);
C(G+"Graph-Traversal-BellmanFord", 2, "Relaja todas las aristas n veces; si aún algo mejora, hay un ciclo negativo.",
  "Un camino más corto tiene a lo sumo n − 1 aristas, así que n − 1 rondas de relajar todas las aristas bastan. Si en la ronda n alguna distancia todavía baja, existe un ciclo que reduce el costo sin fin. Retrocediendo por los padres se encuentra ese ciclo.",
  "Cuando hay pesos negativos o quieres detectar ciclos negativos.",
  ["Inicializar distancias (aquí todas en 0).", "Repetir n veces: relajar todas las aristas.", "Si la última ronda mejoró, reconstruir el ciclo."]);
C(G+"Graph-Traversal-FloydWarshall", 2, "Calcula la distancia entre todos los pares probando cada nodo como punto intermedio.",
  "Tres bucles anidados: para cada nodo k, se pregunta si ir de i a j pasando por k es mejor. Al terminar, la matriz tiene todas las distancias mínimas. Cuesta n³, ideal para n hasta unos 500.",
  "Cuando necesitas distancias entre muchos pares y el grafo es pequeño.",
  ["dist[i][i] = 0 y las aristas directas.", "Para cada k, i, j: dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]).", "Usar un infinito que no desborde al sumar."]);
C(G+"Graph-Traversal-TopologicalSort", 1, "Ordena tareas con dependencias: siempre se hace primero una que no depende de nada pendiente.",
  "Algoritmo de Kahn: se cuentan cuántas dependencias tiene cada tarea. Las que tienen cero pueden hacerse ya; al hacerlas, sus dependientes pierden una dependencia. Si al final quedaron tareas sin hacer, hay un ciclo y no existe orden.",
  "Planificar cursos, compilación, cualquier orden con requisitos.",
  ["Contar el grado de entrada.", "Encolar los de grado 0.", "Al sacar uno, restar a sus vecinos y encolar los que lleguen a 0."]);
C(G+"Graph-Traversal-Tarjan", 3, "Encuentra las componentes fuertemente conexas con una sola DFS usando tiempos de descubrimiento.",
  "En un grafo dirigido, una componente fuertemente conexa es un grupo donde todos llegan a todos. Tarjan anota cuándo descubre cada nodo (disc) y low[v]: el menor tiempo de descubrimiento que se puede alcanzar desde el subárbol DFS de v usando a lo sumo una arista hacia un nodo que todavía está en la pila. Si low[v] es su propio tiempo, v es la cabeza de una componente y se sacan de la pila sus miembros.",
  "Para saber qué partes de un grafo dirigido están mutuamente conectadas.",
  ["DFS asignando discovered y low.", "Actualizar low con hijos y con nodos en la pila.", "Si low[v] = discovered[v], cerrar una SCC."]);
C(G+"Graph-Traversal-Kosaraju", 2, "Dos DFS: la primera ordena los nodos, la segunda sobre el grafo invertido descubre las componentes.",
  "Es la alternativa más intuitiva a Tarjan. Primero se anota el orden en que terminan los nodos. Luego, en el grafo con las flechas al revés, se recorre desde el que terminó último: todo lo que se alcanza es una componente.",
  "Igual que Tarjan: componentes fuertemente conexas.",
  ["DFS 1 guardando orden de salida.", "Invertir las aristas.", "DFS 2 en orden de salida decreciente."]);
C(G+"Graph-Traversal-Bipartite", 1, "Colorea los nodos con dos colores alternando; si dos vecinos quedan iguales, no se puede dividir.",
  "Un grafo es bipartito si se puede separar en dos grupos sin aristas dentro de cada grupo. Con BFS se pinta cada vecino del color contrario. Encontrar dos vecinos del mismo color significa que hay un ciclo de longitud impar.",
  "Dividir en dos equipos, detectar ciclos impares.",
  ["Pintar el inicio de color 1.", "Vecinos del color 3 − color.", "Conflicto → IMPOSSIBLE."]);
C(G+"Graph-Traversal-EulerianCycle", 2, "Recorre cada arista exactamente una vez y vuelve al inicio (como dibujar sin levantar el lápiz).",
  "Existe ese recorrido si todos los nodos con aristas están conectados y todos tienen grado par. El algoritmo de Hierholzer avanza por aristas sin usar y, cuando se queda sin salida, agrega el nodo al circuito al retroceder.",
  "Rutas de reparto o dibujos que usan cada calle una sola vez.",
  ["Verificar grados pares y conexión.", "Avanzar por aristas no usadas con una pila.", "Al quedarse sin salidas, agregar el nodo al circuito."]);
C(G+"Graph-Traversal-HierholzerDirected", 2, "Camino que usa cada arista dirigida una vez, de un inicio a un final dados.",
  "En un grafo dirigido, el camino de 1 a n existe si 1 tiene una salida más que entradas, n una entrada más que salidas y el resto están balanceados. Hierholzer arma el camino igual que en el caso no dirigido.",
  "Caminos eulerianos en grafos dirigidos.",
  ["Revisar grados de entrada y salida.", "Hierholzer iterativo desde 1.", "Verificar que se usaron las m aristas."]);
C(G+"Graph-Traversal-Diameter", 1, "Desde cualquier nodo, el más lejano es un extremo del diámetro; desde ese extremo, el más lejano es el otro.",
  "El diámetro de un árbol es el camino más largo entre dos nodos. Basta con dos recorridos: uno para encontrar un extremo y otro desde ese extremo para medir la distancia máxima.",
  "Distancia máxima en un árbol.",
  ["DFS desde 1: nodo más lejano A.", "DFS desde A: distancia máxima.", "Esa distancia es el diámetro."]);
C(G+"MST-Kruskal", 2, "Toma las aristas de la más barata a la más cara, saltando las que formarían un ciclo.",
  "Para conectar todas las ciudades con el menor costo, la arista más barata que une dos grupos distintos siempre es segura. Union-Find dice si dos nodos ya están conectados.",
  "Conectar todo al mínimo costo (árbol de expansión mínima).",
  ["Ordenar aristas por peso.", "Si une componentes distintas, usarla.", "Si se usaron n − 1, todo quedó conectado."]);
C(G+"MST-Prim", 2, "Hace crecer un árbol desde un nodo, agregando siempre la arista más barata que sale de él.",
  "Es como Dijkstra pero comparando el peso de una sola arista y no la distancia total. Una cola de prioridad da la arista más barata hacia afuera del árbol.",
  "Lo mismo que Kruskal; cómodo en grafos densos.",
  ["Empezar en el nodo 1.", "Sacar la arista más barata hacia un nodo nuevo.", "Agregar sus aristas al heap."]);
C(G+"Miscellaneous-CycleFindingUndirected", 1, "Una DFS que encuentra un ciclo cuando llega a un nodo ya visitado que no es su padre.",
  "En un grafo no dirigido, volver a un ancestro por una arista distinta de la que se usó para bajar significa que hay un ciclo. Los padres guardados permiten escribirlo.",
  "Detectar y mostrar un ciclo en grafos no dirigidos.",
  ["DFS guardando parent.", "Ignorar la arista al padre.", "Ancestro visitado → reconstruir el ciclo."]);
C(G+"Miscellaneous-CycleFindingDirected", 2, "Una DFS que detecta un ciclo cuando una flecha apunta a un nodo que todavía está en el camino actual.",
  "En grafos dirigidos no basta con «ya visitado»: el nodo tiene que estar en el camino que se está explorando (on_stack). Así se distinguen los ciclos reales de caminos que solo se cruzan.",
  "Detectar dependencias circulares.",
  ["DFS marcando on_stack.", "Arista a un nodo on_stack → ciclo.", "Al salir, quitar on_stack."]);
C(G+"Miscellaneous-2-SAT", 3, "Convierte cada condición «a o b» en flechas «si no a entonces b» y busca contradicciones con SCC.",
  "Cada variable tiene dos nodos: verdadera y falsa. Una cláusula (a ∨ b) obliga a que si a es falsa, b sea verdadera (y al revés). Si una variable y su negación quedan en la misma componente fuertemente conexa, se implican mutuamente y no hay solución. Si no, el orden de las componentes da la asignación.",
  "Problemas de sí/no con restricciones de a dos.",
  ["Crear el grafo de implicaciones.", "Calcular SCC con Tarjan.", "x y ¬x en la misma SCC → imposible.", "Elegir según el orden topológico."]);
C(G+"Trees-LCA", 2, "Encuentra el ancestro común más cercano de dos nodos saltando de a potencias de 2.",
  "Primero se sube el nodo más profundo hasta la misma altura que el otro. Luego ambos suben a la vez, dando el salto más grande que no los junte. Con la tabla up[v][j] (ancestro 2ʲ arriba) cada consulta toma log n.",
  "Distancias en árboles, jefes comunes, consultas sobre caminos.",
  ["Precalcular depth y up.", "Igualar profundidades.", "Subir juntos mientras los ancestros difieran."]);
C(G+"Trees-BinaryLifting", 2, "Precalcula a dónde llegas tras 1, 2, 4, 8… pasos para responder «tras k pasos» en log k.",
  "Cualquier k se escribe en binario, así que k pasos son unos pocos saltos de potencias de 2. La tabla se construye duplicando: dos saltos de 2ʲ son uno de 2ʲ⁺¹.",
  "Saltos muy largos en funciones o árboles.",
  ["up[0][v] = siguiente de v.", "up[j][v] = up[j−1][up[j−1][v]].", "Para cada bit encendido de k, saltar."]);
C(G+"Trees-Centroid", 2, "Encuentra el nodo que, al quitarlo, deja todas las partes con a lo sumo la mitad de los nodos.",
  "Se calcula el tamaño de cada subárbol. Desde la raíz se baja siempre al hijo que tiene más de la mitad de los nodos. Donde ya no hay hijo así, se llegó al centroide.",
  "Base de la descomposición por centroides y de problemas de balance en árboles.",
  ["Calcular tamaños de subárboles.", "Bajar al hijo con tamaño > n/2.", "Parar cuando no exista."]);
C(G+"Trees-CentroidDecomposition", 3, "Parte el árbol por su centroide una y otra vez, contando los caminos que pasan por cada centro.",
  "Todo camino o pasa por el centroide o queda dentro de una de las partes. Se cuentan los que pasan por el centro con un arreglo de profundidades y se repite en cada parte. Como cada parte tiene a lo sumo la mitad, hay solo log n niveles.",
  "Contar caminos con propiedades en árboles grandes.",
  ["Hallar el centroide.", "Contar caminos que lo cruzan.", "Quitarlo y repetir en cada parte."]);
C(G+"Trees-EulerTour", 2, "Aplana el árbol en un arreglo donde cada subárbol ocupa un tramo seguido.",
  "Al recorrer el árbol con DFS, los nodos de un subárbol se visitan todos seguidos. Anotando cuándo entra (tin) y cuándo termina (tout) cada nodo, una consulta sobre un subárbol se vuelve una consulta de rango, que un Fenwick Tree resuelve.",
  "Consultas o actualizaciones sobre subárboles.",
  ["DFS asignando tin y tout.", "Guardar el valor de v en la posición tin[v].", "Subárbol de v = rango [tin, tout]."]);
C(G+"Trees-TreeDistances", 2, "La distancia máxima desde cualquier nodo es hacia uno de los dos extremos del diámetro.",
  "Se encuentran los extremos A y B del diámetro con dos BFS. Una tercera BFS desde B da todas las distancias a B. Para cada nodo, la respuesta es la mayor entre su distancia a A y a B.",
  "Distancia al nodo más lejano para todos los nodos.",
  ["BFS desde 1 → A.", "BFS desde A → B.", "Respuesta = max(dist a A, dist a B)."]);
C(G+"Trees-TreeIsomorphismRooted", 2, "Da a cada subárbol un número según la forma de sus hijos; dos árboles son iguales si sus raíces reciben el mismo número.",
  "Una hoja tiene un número; un nodo cuyos hijos tienen ciertos números recibe el número asignado a esa lista ordenada. Así, dos subárboles con la misma forma reciben el mismo número sin importar cómo estén etiquetados.",
  "Comparar la forma de dos árboles con raíz.",
  ["Procesar de las hojas a la raíz.", "Ordenar los números de los hijos.", "Asignar un id a cada lista distinta."]);
C(G+"Trees-TreeIsomorphism", 3, "Como el isomorfismo con raíz, pero probando como raíz los centroides de cada árbol.",
  "Si los árboles no tienen raíz, hay que elegir una de forma canónica. Todo árbol tiene uno o dos centroides, así que basta con probar esas pocas combinaciones y comparar los ids canónicos.",
  "Comparar la forma de dos árboles sin raíz.",
  ["Hallar los centroides de cada árbol.", "Calcular ids canónicos desde cada centroide.", "Iguales para algún par → YES."]);
C(G+"Flow-Algorithms-EdmondsKarp", 2, "Busca con BFS caminos con capacidad libre y envía flujo por ellos hasta que no quede ninguno.",
  "Piensa en tuberías: cada una deja pasar una cantidad máxima. Mientras exista un camino de la fuente al destino con espacio, se envía lo que permite su tubería más estrecha. Las aristas inversas permiten «deshacer» decisiones malas.",
  "Flujo máximo en grafos pequeños o medianos.",
  ["BFS para un camino aumentante.", "Enviar el cuello de botella.", "Actualizar capacidades y sus inversas."]);
C(G+"Flow-Algorithms-Dinic", 3, "Flujo máximo por fases: organiza el grafo en niveles y empuja todo el flujo posible en cada fase.",
  "Dinic mejora a Edmonds-Karp: con un BFS arma niveles desde la fuente y luego con DFS manda flujo solo hacia adelante en los niveles, hasta bloquear todos los caminos. Cada fase aumenta estrictamente la distancia de s a t, así que hay a lo sumo V fases; en la práctica son muchas menos, y en redes unitarias O(√V).",
  "Flujo máximo en grafos grandes; también emparejamientos.",
  ["BFS de niveles.", "DFS de flujo bloqueante con it[].", "Repetir mientras t sea alcanzable."]);
C(G+"Flow-Algorithms-BipartiteMatching", 2, "Empareja elementos de dos grupos; si alguien está ocupado, intenta reubicarlo en otra pareja.",
  "El algoritmo de Kuhn intenta emparejar a cada chico. Si la chica que le gusta ya tiene pareja, pregunta si esa pareja puede cambiarse a otra chica libre. Esa cadena de cambios es un camino aumentante.",
  "Asignaciones uno a uno: trabajos, parejas, horarios.",
  ["Para cada u, buscar con DFS.", "Si v está libre o su pareja se reubica, emparejar.", "Contar los éxitos."]);
C(G+"Flow-Algorithms-MinCostMaxFlow", 3, "Envía el máximo flujo posible, eligiendo siempre el camino más barato disponible.",
  "Cada tubería además tiene un costo por unidad. El algoritmo busca el camino más barato en el grafo residual (Dijkstra con potenciales para manejar costos negativos) y envía todo lo que puede por él, hasta que no haya más caminos.",
  "Transporte, asignaciones con costos.",
  ["Potenciales iniciales con Bellman-Ford.", "Dijkstra para el camino más barato.", "Enviar el cuello de botella y repetir."]);
C(G+"Flow-Algorithms-MinCostAnyFlow", 3, "Igual que el flujo de costo mínimo, pero se detiene al enviar exactamente K unidades.",
  "Usa el mismo motor que el de flujo máximo con costo mínimo, solo que el límite es K. Si el grafo no puede transportar K unidades, se informa que es imposible.",
  "Cuando la cantidad a transportar está fija.",
  ["Mismo algoritmo con límite K.", "Si se envió menos de K → IMPOSSIBLE.", "Si no, imprimir el costo."]);

// ---------- Cadenas ----------
const S = "Strings-Algorithms-";
C(S+"KMP-I", 2, "Precalcula cuánto del patrón se puede reutilizar tras un fallo para no volver a empezar de cero.",
  "Aquí t es el patrón y s el texto. LP[i] es el borde más largo de (t + '#' + s)[0..i]: el mayor prefijo que también es sufijo. Si pegas patrón + # + texto, cada posición con LP igual al largo del patrón marca una aparición.",
  "Buscar un patrón en un texto en tiempo lineal.",
  ["Concatenar t + '#' + s.", "Calcular LP.", "Contar posiciones con LP = |t|."]);
C(S+"KMP-II", 2, "Recorre el texto una vez usando la tabla del patrón para saber dónde seguir tras cada fallo.",
  "En lugar de concatenar, se calcula LP solo del patrón y se avanza por el texto con un índice j en el patrón. Al fallar, j retrocede a LP[j−1], nunca el texto. Usa menos memoria que la versión I.",
  "Buscar patrones con poca memoria extra.",
  ["Calcular LP del patrón.", "Avanzar j mientras coincida.", "Al completar el patrón, contar y j = LP[j−1]."]);
C(S+"ZFunction", 2, "Para cada posición, mide cuánto coincide la cadena desde ahí con su propio inicio.",
  "z[i] dice cuántos caracteres desde i coinciden con el principio. El truco es reutilizar el tramo [l, r) más a la derecha que ya se sabe que coincide, lo que hace el cálculo lineal.",
  "Búsqueda de patrones, periodos y prefijos repetidos.",
  ["Mantener el intervalo [l, r).", "Iniciar z[i] con lo ya conocido.", "Extender comparando."]);
C(S+"RabinKarp", 2, "Convierte cada trozo del texto en un número (hash) y compara números en vez de letras.",
  "Un hash es como una huella digital de la cadena. Con hashes de prefijos, el hash de cualquier trozo se obtiene en O(1). Se usan dos módulos para que sea casi imposible que dos cadenas distintas coincidan.",
  "Comparar subcadenas rápido, búsqueda de patrones, igualdad de trozos.",
  ["Precalcular potencias de la base.", "Hash de cada prefijo.", "Comparar el hash de cada ventana con el patrón."]);
C(S+"PrefixTrie", 2, "Un árbol donde cada camino desde la raíz deletrea una palabra; las palabras con el mismo inicio comparten camino.",
  "Insertar y buscar cuesta solo el largo de la palabra, y el trie tiene a lo sumo (suma de largos + 1) nodos. Aquí se combina con DP: desde cada posición del texto se baja por el trie y cada palabra completa encontrada suma las formas de construir el resto.",
  "Diccionarios, autocompletado, partir un texto en palabras.",
  ["Insertar palabras letra por letra.", "dp[n] = 1.", "Desde i, bajar por el trie y sumar dp[j + 1] en cada palabra."]);
C(S+"Manacher", 3, "Encuentra el palíndromo más largo reutilizando la simetría de los palíndromos ya encontrados.",
  "Dentro de un palíndromo, lo que pasa a un lado del centro se refleja al otro. Manacher guarda el palíndromo que llega más a la derecha y lo usa para empezar cada nuevo cálculo con ventaja. Se calculan por separado los de largo impar (d1) y par (d2).",
  "Palíndromos más largos o conteo de palíndromos.",
  ["Para cada centro, empezar con el valor reflejado.", "Expandir mientras coincidan.", "Actualizar el intervalo [l, r]."]);
C(S+"MinimalRotation", 3, "Método de los dos índices (distinto de Booth y de Duval, que también son O(n)): compara dos candidatos a rotación mínima y descarta de un salto todas las posiciones que no pueden ganar.",
  "La rotación mínima es una subcadena de s + s. Con dos índices i y j se comparan carácter a carácter; al encontrar una diferencia, el que pierde puede saltar k + 1 posiciones porque ninguna de ellas puede ser mejor.",
  "Forma canónica de cadenas circulares.",
  ["t = s + s.", "Comparar t[i + k] con t[j + k].", "Saltar el peor; la respuesta es min(i, j)."]);
C(S+"SuffixArray", 3, "Ordena todos los sufijos de la cadena; las subcadenas repetidas quedan juntas.",
  "Cada subcadena es el inicio de algún sufijo. Si los sufijos están ordenados, los que comparten prefijo quedan vecinos, y el arreglo LCP (prefijo común entre vecinos) dice cuántas subcadenas se repiten. Las distintas son el total menos esa suma.",
  "Problemas avanzados de subcadenas: distintas, repetidas, comunes.",
  ["Ordenar por los primeros 1, 2, 4… caracteres.", "Calcular LCP con Kasai.", "Distintas = n(n+1)/2 − suma de LCP."]);

// ---------- Geometría ----------
C("Geometry-Point", 1, "Las operaciones básicas con vectores: suma, producto punto, producto cruz, norma y proyección.",
  "Casi toda la geometría competitiva se construye con estas piezas. El producto punto mide qué tan alineados están dos vectores; el producto cruz dice si uno está a la izquierda o a la derecha del otro.",
  "Base de cualquier problema de geometría.",
  ["Definir el punto con operadores.", "dot y cross como funciones.", "Usar EPS al comparar reales."]);
C("Geometry-Shoelace", 1, "Calcula el área de un polígono multiplicando coordenadas en cruz, como los cordones de un zapato.",
  "Sumando x_i·y_{i+1} − x_{i+1}·y_i alrededor del polígono se obtiene el doble del área (con signo según el sentido). Con coordenadas enteras todo es exacto.",
  "Área de cualquier polígono simple.",
  ["Recorrer los vértices en orden.", "Sumar los productos cruzados.", "Valor absoluto: doble del área."]);
C("Geometry-ConvexHull", 2, "Encuentra el «elástico» que rodea a todos los puntos: el menor polígono convexo que los contiene.",
  "Graham scan ordena los puntos por ángulo alrededor del más bajo y los recorre con una pila. Si los tres últimos giran hacia el lado equivocado, el del medio queda adentro y se saca. El producto cruz decide el giro. En el código del repositorio el orden es horario: se conservan los giros horarios (cw) y se saca el punto ante un giro antihorario.",
  "Envolventes, puntos extremos, base de muchos problemas geométricos.",
  ["Elegir el punto más bajo.", "Ordenar por ángulo.", "Pila: sacar mientras el giro sea incorrecto."]);
C("Geometry-PointInPolygon", 2, "Lanza un rayo desde el punto y cuenta cuántas veces cruza el borde: impar = adentro.",
  "Si caminas en línea recta desde un punto interior hacia afuera, cruzas el borde un número impar de veces. Antes se revisa si el punto está justo sobre una arista, que es el caso BOUNDARY.",
  "Saber si un punto está dentro de un polígono.",
  ["¿Está sobre alguna arista? → BOUNDARY.", "Contar cruces del rayo horizontal.", "Impar → INSIDE."]);
C("Geometry-SegmentIntersection", 2, "Dos segmentos se cortan si los extremos de cada uno quedan a lados distintos del otro.",
  "El signo del producto cruz dice de qué lado de una recta está un punto. Si los extremos de cada segmento están en lados estrictamente opuestos del otro, se cortan. Si alguna orientación es 0 (un extremo sobre la recta del otro), además hay que revisar que las cajas que encierran a los segmentos se solapen: sin ese chequeo, dos segmentos colineales pero separados parecerían cortarse.",
  "Cruces de caminos, colisiones.",
  ["Calcular las cuatro orientaciones o1..o4.", "Si o1 ≠ o2 y o3 ≠ o4 con signos estrictos → YES.", "Si hay un cero, el punto debe estar dentro de la caja del otro segmento (colineales)."]);
C("Geometry-PolygonLatticePoints", 2, "Con el teorema de Pick, el área y los puntos del borde dan los puntos enteros interiores.",
  "Pick dice que A = I + B/2 − 1. El Shoelace da con enteros el doble del área, S = 2A, y los puntos del borde de cada arista son gcd(|dx|, |dy|). Despejando, 2I = S − B + 2, sin contar punto por punto y sin fracciones.",
  "Contar puntos enteros dentro de polígonos.",
  ["Área doble con Shoelace.", "B = suma de gcd por arista.", "I = (S − B + 2) / 2, con S = 2A."]);
C("Geometry-ClosestPair", 3, "Barre los puntos de izquierda a derecha y solo compara con los que están en una franja cercana.",
  "Comparar todos los pares cuesta n². Si ya conoces una distancia d, solo importan los puntos a menos de d en x, y entre ellos los que están a menos de d en y. Un set ordenado por y los encuentra rápido, y son muy pocos.",
  "Par de puntos más cercano con muchos puntos.",
  ["Ordenar por x.", "Mantener la franja en un set por y.", "Comparar solo con los de y en ±d."]);

// ---------- Herramientas ----------
const T = "FunctionalTools-Codes-";
C(T+"BS", 1, "En un arreglo ordenado, mira la mitad y descarta la mitad donde no puede estar el valor.",
  "Como buscar una palabra en un diccionario: abres por la mitad y sabes si ir a la izquierda o a la derecha. Cada paso reduce el espacio a la mitad, así que en un millón de elementos bastan unos 20 pasos.",
  "Buscar en datos ordenados.",
  ["lo = 0, hi = n − 1.", "mid = lo + (hi − lo) / 2.", "Mover lo o hi según la comparación."]);
C(T+"BS-library", 1, "La misma búsqueda binaria, pero con las funciones listas de C++.",
  "binary_search dice si el valor existe; lower_bound da la primera posición con valor mayor o igual. Usarlas evita errores de índices en competencia.",
  "Siempre que el arreglo esté ordenado y quieras escribir poco.",
  ["Ordenar si hace falta.", "binary_search para existencia.", "lower_bound / upper_bound para posiciones."]);
C(T+"BinarySearchAnswer", 2, "Si puedes verificar rápido «¿alcanza con t?», busca binariamente el menor t que sirve.",
  "Muchos problemas de optimizar son difíciles de resolver directamente, pero fáciles de verificar. Si la respuesta es monótona (si t sirve, t + 1 también), la búsqueda binaria sobre t encuentra el mínimo.",
  "Minimizar tiempos, máximos, capacidades.",
  ["Elegir un rango [lo, hi] seguro.", "Verificar mid.", "Si alcanza, hi = mid; si no, lo = mid + 1."]);
C(T+"TS", 2, "Para una función que sube y luego baja, compara dos puntos y descarta un tercio del intervalo.",
  "Si f(m1) < f(m2), el máximo no puede estar a la izquierda de m1. Ojo: necesita que la función sea estrictamente unimodal; con tramos planos (f(m1) = f(m2) sin estar en el pico) puede descartar el tercio equivocado. Cada paso deja dos tercios, y al quedar pocos valores se revisan todos.",
  "Máximos o mínimos de funciones unimodales.",
  ["Elegir m1 y m2 en los tercios.", "Descartar el tercio peor.", "Revisar los últimos valores a mano."]);
C(T+"Sieve", 1, "Tacha los múltiplos de cada primo; lo que queda sin tachar son los primos.",
  "Empezando en 2, cada número no tachado es primo y se tachan todos sus múltiplos. Basta llegar hasta √N. La criba segmentada aplica la misma idea a un rango [L, R] lejano usando los primos pequeños.",
  "Listar o verificar muchos primos.",
  ["Marcar todos como primos.", "Para cada p ≤ √N primo, tachar desde p².", "Segmentada: tachar múltiplos dentro de [L, R]."]);
C(T+"ModArithmetic", 2, "Cuentas con números gigantes quedándose solo con el residuo, incluyendo divisiones con inversos modulares.",
  "Los resultados de combinatoria crecen demasiado, así que se trabaja módulo un primo. Sumar y multiplicar es directo; dividir se hace multiplicando por el inverso, que por el pequeño teorema de Fermat es a^(MOD−2).",
  "Combinatoria y conteo con módulo.",
  ["Exponenciación rápida binpow.", "Precalcular factoriales e inversos.", "C(n, k) = n! · inv(k!) · inv((n−k)!)."]);
C(T+"MatrixExponentiation", 3, "Escribe la recurrencia como una matriz y elévala a n con exponenciación rápida.",
  "Fibonacci cumple que [F(n+1), F(n)] = M · [F(n), F(n−1)]. Entonces el término n es M elevada a n, y elevar una matriz se puede hacer en log n multiplicaciones, aunque n sea 10¹⁸.",
  "Recurrencias lineales con n enorme.",
  ["Armar la matriz de transición.", "Exponenciación binaria de matrices.", "Leer la respuesta de la matriz resultante."]);
C(T+"MeetInTheMiddle", 3, "Divide los elementos en dos mitades, resuelve cada una por fuerza bruta y combina los resultados.",
  "Con n = 40, probar 2⁴⁰ subconjuntos es imposible, pero 2²⁰ por mitad sí. Para cada suma de la izquierda se buscan en la derecha (ordenada) las que completan x.",
  "Problemas de subconjuntos con n hasta ~40.",
  ["Generar sumas de cada mitad.", "Ordenar las de la derecha.", "Contar complementos con búsqueda binaria."]);
C(T+"GrayCode", 1, "Lista todos los números de n bits de modo que cada uno difiere del anterior en un solo bit.",
  "La fórmula i XOR (i >> 1) da el i-ésimo código Gray. Se usa en electrónica y para recorrer subconjuntos cambiando un elemento a la vez.",
  "Recorridos donde cada paso cambia una sola cosa.",
  ["Para i de 0 a 2ⁿ − 1.", "g = i ^ (i >> 1).", "Imprimir g con n bits."]);

// ---------- Problemas clásicos de CSES (uno por técnica) ----------
C("DP-Classic-Problems-Dice-Combinations", 1, "Para contar las formas de llegar a n, suma las formas de llegar a n−1, n−2, …, n−6: el último dado decide de dónde vienes.",
  "Es el ejemplo más limpio de DP de conteo. Toda secuencia de lanzamientos que suma s termina con una cara k entre 1 y 6, y antes de ese lanzamiento la suma era s − k. Por eso dp[s] = dp[s−1] + … + dp[s−6], con dp[0] = 1 (no lanzar nada). Como cada valor depende solo de los seis anteriores, en Python se puede llevar una ventana con esa suma.",
  "Cuando hay que contar secuencias ordenadas (importa el orden) que suman un total.",
  ["dp[0] = 1.", "dp[s] = Σ dp[s − k] para k = 1..6 con s − k ≥ 0.", "Tomar todo módulo 10^9+7; la respuesta es dp[n]."]);
C("DP-Classic-Problems-Grid-Paths-I", 1, "Los caminos que llegan a una celda son los que llegan desde arriba más los que llegan desde la izquierda.",
  "Como solo se puede ir a la derecha o abajo, cada camino que llega a (i, j) pasó justo antes por (i−1, j) o por (i, j−1). Las trampas tienen 0 caminos. Basta recorrer la cuadrícula fila por fila, y como cada fila solo usa la anterior, se puede guardar una sola fila.",
  "Cuadrículas con movimientos que solo avanzan (derecha/abajo) y obstáculos.",
  ["dp[0][0] = 1 si no es trampa.", "dp[i][j] = dp[i−1][j] + dp[i][j−1], o 0 si es trampa.", "La respuesta es dp[n−1][n−1]."]);
C("DP-Classic-Problems-Money-Sums", 2, "Lleva el conjunto de sumas alcanzables como bits: agregar una moneda x es hacer can |= can << x.",
  "Es la mochila de «¿se puede formar s?». Con una tabla de booleanos, cada moneda recorre todas las sumas; con un bitset, la misma operación se hace con un corrimiento y un OR, 64 sumas a la vez. En Python un entero grande sirve como bitset y la operación es igual de corta.",
  "Para saber qué sumas (o pesos) se pueden formar con un subconjunto, cuando la suma total es moderada.",
  ["can = {0}.", "Para cada moneda x: can = can ∪ (can + x), es decir can |= can << x.", "Listar los bits encendidos distintos de 0."]);
C("DP-Classic-Problems-Removal-Game", 2, "DP de intervalos: en el tramo [l, r] guarda la ventaja (mi puntaje − el del rival) del que juega primero.",
  "Si me toca jugar en [l, r], tomo x[l] y el rival queda jugando primero en [l+1, r], o tomo x[r] y queda en [l, r−1]. Lo que el rival gane de ventaja me lo resta, así que d[l][r] = max(x[l] − d[l+1][r], x[r] − d[l][r−1]). Con la ventaja final y la suma total se despeja mi puntaje: (total + d) / 2. Los tramos se calculan por largo creciente.",
  "Juegos de dos jugadores que quitan de los extremos, y en general DP sobre subarreglos [l, r].",
  ["d[i][i] = x[i].", "Por largo creciente: d[l][r] = max(x[l] − d[l+1][r], x[r] − d[l][r−1]).", "Respuesta = (suma total + d[0][n−1]) / 2."]);
C("DP-Classic-Problems-Counting-Numbers", 3, "DP de dígitos: cuenta los números válidos en [0, x] y responde f(b) − f(a−1).",
  "Contar en [a, b] directamente es imposible (hasta 10^18 números). Se cuenta en [0, x] dígito por dígito: los números con menos cifras que x se cuentan con una fórmula (9 opciones para el primero, 9 para cada siguiente porque debe ser distinto al anterior), y los que tienen tantas cifras como x se cuentan copiando un prefijo de x y poniendo en la siguiente posición un dígito menor. Si x mismo tiene dos dígitos vecinos iguales, se corta ahí.",
  "Contar números hasta un límite enorme que cumplen una propiedad sobre sus dígitos.",
  ["f(x) cuenta [0, x]; f(−1) = 0 y f(0) = 1.", "Sumar 9^largo para cada largo menor que el de x.", "Recorrer x: en la posición i probar cada dígito menor (distinto al anterior) y sumar 9^(restantes).", "Respuesta = f(b) − f(a − 1)."]);
C("Data-Structures-Classic-Problems-Static-Range-Sum-Queries", 1, "Precalcula sumas de prefijos: la suma de [a, b] es p[b] − p[a−1].",
  "Si el arreglo no cambia, guardar p[i] = x_1 + … + x_i permite responder cada consulta en O(1): todo lo que hay hasta b menos lo que hay antes de a. Es la base de casi todas las estructuras de rangos.",
  "Muchas consultas de suma sobre un arreglo que no cambia.",
  ["p[0] = 0 y p[i] = p[i−1] + x_i.", "Cada consulta [a, b] responde p[b] − p[a−1]."]);
C("Data-Structures-Classic-Problems-Forest-Queries", 1, "Sumas de prefijos en 2D: cualquier rectángulo se obtiene con cuatro valores e inclusión-exclusión.",
  "p[i][j] guarda cuántos árboles hay en el rectángulo de (1,1) a (i,j). Se construye con p[i−1][j] + p[i][j−1] − p[i−1][j−1] + celda (la esquina se resta porque se sumó dos veces). Un rectángulo cualquiera es el grande menos las franjas de arriba y de la izquierda, más la esquina que se restó de más.",
  "Consultas de suma o conteo en rectángulos de una matriz fija.",
  ["Construir p con inclusión-exclusión.", "Respuesta = p[y2][x2] − p[y1−1][x2] − p[y2][x1−1] + p[y1−1][x1−1]."]);
C("Data-Structures-Classic-Problems-Range-Update-Queries", 2, "Sumar u a un rango es poner +u al inicio y −u después del final en el arreglo de diferencias; el valor de una posición es una suma de prefijo.",
  "Es el truco inverso a las sumas de prefijos. Si d es el arreglo de diferencias, el valor de x_k es el original más d_1 + … + d_k. Sumar u a [a, b] solo cambia dos posiciones de d. Con un Fenwick Tree sobre d, ambas operaciones cuestan O(log n).",
  "Actualizaciones de rango con consultas puntuales (o al revés).",
  ["Fenwick sobre las diferencias, inicialmente en 0.", "1 a b u: add(a, u) y add(b+1, −u).", "2 k: x_k original + sum(k)."]);
C("Data-Structures-Classic-Problems-Hotel-Queries", 2, "Un Segment Tree de máximos permite encontrar el primer hotel con espacio bajando siempre por la izquierda si alcanza.",
  "Cada nodo guarda el máximo de cuartos libres de su tramo. Para un grupo que pide r cuartos: si la raíz tiene menos de r, ninguno sirve. Si no, se baja: si el hijo izquierdo tiene máximo ≥ r, el primer hotel que sirve está ahí; si no, está a la derecha. Al llegar a la hoja se restan los cuartos y se recalcula el camino. Es el «descenso» en Segment Tree.",
  "Encontrar la primera posición que cumple una condición monótona sobre un tramo, con actualizaciones.",
  ["Construir el árbol de máximos.", "Si t[raíz] < r responder 0.", "Bajar: izquierda si t[izq] ≥ r, si no derecha.", "Restar r en la hoja y recalcular hacia arriba."]);
C("Data-Structures-Classic-Problems-Prefix-Sum-Queries", 3, "Un Segment Tree cuyos nodos guardan dos datos (suma y mejor prefijo) que se combinan de forma asociativa.",
  "Es el ejemplo típico de que el Segment Tree no es solo para sumas o mínimos. Para unir un tramo izquierdo L con uno derecho R: la suma es L.suma + R.suma y el mejor prefijo es max(L.prefijo, L.suma + R.prefijo). Esa combinación es asociativa (pero no conmutativa), así que la consulta debe juntar los nodos en orden de izquierda a derecha.",
  "Cuando la respuesta de un rango se puede armar con un pequeño resumen de cada mitad.",
  ["Hoja: (x, max(0, x)).", "comb(L, R) = (L.s + R.s, max(L.p, L.s + R.p)).", "Actualizar una hoja y recalcular el camino.", "Consultar juntando nodos de izquierda a derecha."]);
C("Graphs-Classic-Problems-Counting-Rooms", 1, "Cada vez que encuentras piso sin visitar hay un cuarto nuevo: píntalo entero con BFS o DFS.",
  "La cuadrícula es un grafo: cada celda de piso es un nodo y se conecta con sus vecinas de arriba, abajo, izquierda y derecha. Contar cuartos es contar componentes conexas. Se recorre la cuadrícula y, al hallar piso no visitado, se lanza un recorrido que marca todo su cuarto (flood fill).",
  "Contar o etiquetar regiones conectadas en cuadrículas o grafos.",
  ["Recorrer todas las celdas.", "Si es piso sin visitar: rooms++ y recorrer (BFS/DFS) marcando todo lo alcanzable.", "Responder rooms."]);
C("Graphs-Classic-Problems-Labyrinth", 1, "BFS desde A da el camino más corto; guardando por dónde llegaste a cada celda se reconstruye el camino.",
  "En un grafo sin pesos, BFS visita las celdas por distancia creciente, así que la primera vez que llega a B es por un camino más corto. Para imprimirlo se guarda en cada celda la dirección con la que se llegó, y al final se camina desde B hacia atrás hasta A.",
  "Camino más corto en grafos o cuadrículas sin pesos, cuando además hay que mostrar el camino.",
  ["BFS desde A guardando from[celda] = dirección de llegada.", "Si B no se visitó: NO.", "Desde B, retroceder con las direcciones y voltear la lista."]);
C("Graphs-Classic-Problems-Flight-Discount", 2, "Dijkstra desde 1 y Dijkstra desde n en el grafo invertido; el cupón va en algún vuelo a → b: d1[a] + c/2 + dn[b].",
  "La ruta con cupón se parte en tres: un camino normal de 1 a a, el vuelo a → b a mitad de precio y un camino normal de b a n. Con las distancias desde 1 y las distancias hacia n (Dijkstra en el grafo con las aristas al revés) se prueba cada vuelo como el del descuento. Otra forma equivalente es Dijkstra sobre estados (ciudad, ya usé el cupón).",
  "Caminos más cortos con una modificación que se usa una sola vez.",
  ["d1 = Dijkstra desde 1.", "dn = Dijkstra desde n en el grafo invertido.", "Respuesta = min sobre cada vuelo (a, b, c) de d1[a] + ⌊c/2⌋ + dn[b]."]);
C("Graphs-Classic-Problems-Longest-Flight-Route", 2, "En un grafo sin ciclos, procesa los nodos en orden topológico y haz DP del camino más largo.",
  "El camino más largo es difícil en general, pero en un DAG es fácil: si procesas cada ciudad después de todas las que llegan a ella (orden topológico), ya conoces el mejor camino hasta ella y puedes extenderlo a sus vecinas. Guardando el anterior de cada ciudad se reconstruye la ruta.",
  "Caminos más largos, conteo de caminos o cualquier DP sobre un grafo dirigido acíclico.",
  ["Orden topológico con Kahn (grados de entrada).", "best[1] = 1, el resto −∞.", "En orden: best[v] = max(best[v], best[u] + 1) guardando par[v] = u.", "Si best[n] es −∞: IMPOSSIBLE; si no, reconstruir con par."]);
C("Graphs-Classic-Problems-Subordinates", 1, "El número de subordinados es el tamaño del subárbol menos 1; se calcula de las hojas hacia la raíz.",
  "La empresa es un árbol con raíz en el director. Si se procesa a cada empleado después de todos sus subordinados (por ejemplo, en orden BFS al revés), basta sumarle a su jefe sus propios subordinados más 1. Evitar la recursión hace que funcione sin problemas con árboles muy profundos.",
  "Tamaños de subárbol, la base de muchas técnicas en árboles.",
  ["Armar la lista de hijos de cada jefe.", "Orden BFS desde el director.", "Recorrer al revés: sub[jefe] += sub[v] + 1."]);
C("Strings-Classic-Problems-Finding-Borders", 2, "Los bordes de una cadena son el mayor borde, el mayor borde de ese borde, y así: se leen de la función de prefijos.",
  "La función de prefijos π[i] es el largo del mayor borde de s[0..i]. Un borde de un borde también es borde de la cadena, y todos se obtienen así. Por eso, empezando en π[n−1] y saltando b → π[b−1] se recorren todos los bordes, de mayor a menor.",
  "Bordes, periodos y búsqueda de patrones (KMP).",
  ["Calcular π.", "b = π[n−1]; mientras b > 0 guardar b y hacer b = π[b−1].", "Imprimir en orden creciente."]);
C("Strings-Classic-Problems-Finding-Periods", 2, "p es periodo si la cadena corrida p posiciones coincide con su prefijo hasta el final: z[p] = n − p.",
  "La función Z dice, para cada posición i, cuánto coincide la cadena que empieza en i con el prefijo. Si desde p coincide todo lo que queda (z[p] = n − p), repetir el prefijo de largo p genera la cadena. Otra forma de verlo: los periodos son n − b para cada borde b, más n.",
  "Periodos, repeticiones y comparaciones de prefijos en tiempo lineal.",
  ["Calcular la función Z.", "Cada p con z[p] = n − p es periodo.", "n siempre es periodo."]);
C("Strings-Classic-Problems-Distinct-Subsequences", 2, "Cada caracter duplica las subsecuencias, pero hay que restar las que ya terminaban en ese mismo caracter.",
  "Si con el prefijo hay T subsecuencias distintas (contando la vacía), al agregar c cada una puede o no llevar c al final: 2T. Pero las que terminan en c y ya existían se cuentan dos veces; son exactamente las que había justo antes de la última aparición de c. Por eso T' = 2T − last[c], y last[c] pasa a ser T.",
  "Contar subsecuencias distintas o, en general, conteos donde hay que evitar duplicados.",
  ["T = 1 (la vacía), last[c] = 0.", "Por cada c: T' = 2T − last[c]; last[c] = T; T = T'.", "Respuesta = T − 1."]);
C("Strings-Classic-Problems-Repeating-Substring", 3, "La subcadena repetida más larga es el mayor LCP entre sufijos vecinos del suffix array.",
  "Dos apariciones de una subcadena son dos sufijos que empiezan igual. Al ordenar todos los sufijos (suffix array), los que comparten el prefijo más largo quedan juntos, así que basta mirar el prefijo común (LCP) entre vecinos. La versión en Python usa otra idea: si un largo L se repite, cualquier largo menor también, así que se busca el mayor L con búsqueda binaria y se revisa cada L con hashing (O(n log n) en total). El suffix array por duplicación con sort cuesta O(n log² n); con counting sort baja a O(n log n).",
  "Repeticiones, subcadenas comunes y conteo de subcadenas distintas.",
  ["Construir el suffix array y el LCP (Kasai).", "Tomar el mayor LCP y su posición.", "Si es 0 imprimir −1."]);
C("Strings-Classic-Problems-Required-Substring", 3, "Cuenta las cadenas que NO contienen el patrón con una DP sobre el autómata de KMP y réstalas del total 26^n.",
  "Al leer una cadena letra por letra, lo único que importa para saber si aparecerá el patrón es cuántos caracteres del patrón llevo emparejados (el estado de KMP). Con la función de prefijos se arma la transición go[k][c]. Se cuentan las cadenas que nunca llegan al estado m (patrón completo) y se restan de 26^n.",
  "Contar cadenas que contienen o evitan patrones (autómatas + DP).",
  ["Función de prefijos del patrón y transiciones go[k][c].", "dp[0] = 1; por cada letra: dp'[go[k][c]] += dp[k] si go[k][c] < m.", "Respuesta = 26^n − Σ dp."]);
C("Geometry-Classic-Problems-Point-Location-Test", 1, "El signo del producto cruz de (p2 − p1) y (p3 − p1) dice si p3 está a la izquierda, a la derecha o sobre la recta.",
  "El producto cruz de dos vectores es positivo si el segundo gira en sentido antihorario respecto al primero, negativo si gira en sentido horario y cero si son colineales. Es la operación más usada de la geometría computacional: orientación, intersección de segmentos, envolventes convexas, áreas.",
  "Cada vez que hay que saber de qué lado de una recta está un punto.",
  ["cr = (x2 − x1)(y3 − y1) − (y2 − y1)(x3 − x1).", "cr > 0: LEFT; cr < 0: RIGHT; cr = 0: TOUCH."]);
C("Geometry-Classic-Problems-Maximum-Manhattan-Distances", 2, "Con u = x + y y v = x − y, la distancia Manhattan es max(|Δu|, |Δv|): solo importan los extremos de u y de v.",
  "Rotar los ejes 45° convierte la distancia Manhattan en la distancia de Chebyshev. Así, la mayor distancia entre dos puntos del conjunto es el mayor rango entre (máximo de u − mínimo de u) y (máximo de v − mínimo de v), que se actualiza en O(1) por cada punto nuevo.",
  "Problemas con distancia Manhattan: máximos, vecinos, rotaciones de ejes.",
  ["Por cada punto: u = x + y, v = x − y.", "Actualizar mínimos y máximos de u y v.", "Imprimir max(maxU − minU, maxV − minV)."]);
C("Geometry-Classic-Problems-Intersection-Points", 2, "Barre de izquierda a derecha: los horizontales activos están en un Fenwick por altura y cada vertical cuenta cuántos cruza.",
  "Un segmento vertical en x cruza a los horizontales que están «activos» en ese x (empezaron antes y no han terminado) y cuya altura cae entre sus extremos. Al barrer por x: el inicio de un horizontal suma 1 en su altura, el final resta 1, y cada vertical consulta la suma en [y1, y2].",
  "Contar cruces o eventos en el plano reduciéndolos a consultas de rango en una dimensión.",
  ["Eventos: inicio horizontal, vertical, fin horizontal, ordenados por x.", "Inicio: add(y, 1); fin: add(y, −1).", "Vertical: total += sum(y1..y2)."]);
C("Geometry-Classic-Problems-Area-of-Rectangles", 3, "Barrido en x con un Segment Tree que sabe cuánto largo en y está cubierto: el área es la suma de franjas.",
  "Entre dos eventos consecutivos en x, el largo cubierto en el eje y no cambia, así que el área de esa franja es largo × ancho. El Segment Tree sobre las alturas comprimidas guarda en cada nodo cuántos rectángulos lo cubren entero y cuánto largo está cubierto en su tramo; no necesita propagación perezosa porque cada inicio tiene su final.",
  "Área de unión de rectángulos y problemas de cobertura con barrido.",
  ["Comprimir las y.", "Eventos (x, +1/−1, y1, y2) ordenados por x.", "Antes de cada evento: área += cubierto × (x − x_anterior).", "Actualizar el árbol en [y1, y2)."]);
C("Geometry-Classic-Problems-Lines-and-Queries-I", 3, "Li Chao Tree: cada nodo guarda la recta que gana en el centro de su tramo; la perdedora baja solo a una mitad.",
  "Dos rectas se cruzan a lo sumo una vez, así que en un tramo, la que pierde en el centro solo puede ganar en una de las dos mitades. Al insertar se compara en el centro, el nodo se queda con la mejor y la otra baja hacia la mitad donde todavía puede ganar. Para consultar x se mira cada recta del camino de la raíz a la hoja de x.",
  "Máximo o mínimo de funciones lineales (optimización de DP con convex hull trick).",
  ["Insertar: comparar en el centro, quedarse con la mejor y bajar la otra a la mitad correcta.", "Consultar x: máximo de las rectas del camino hasta la hoja x."]);
C("FunctionalTools-Classic-Problems-Exponentiation", 1, "Exponenciación binaria: a^b se calcula con O(log b) multiplicaciones usando los bits de b.",
  "a^b = (a^2)^(b/2) si b es par, y a · a^(b−1) si es impar. En la práctica se recorren los bits de b: en cada paso la base se eleva al cuadrado y, si el bit está encendido, se multiplica en la respuesta. Todo módulo 10^9+7. En Python, pow(a, b, m) ya lo hace.",
  "Potencias grandes módulo m, inversos modulares y exponenciación de matrices.",
  ["res = 1.", "Mientras b > 0: si b es impar res = res·a; a = a·a; b = b/2.", "Todo módulo 10^9+7."]);
C("FunctionalTools-Classic-Problems-Counting-Divisors", 1, "Con la criba del menor factor primo, factorizas cada x rápido y usas d(x) = (e1+1)(e2+1)…",
  "Si x = p1^e1 · p2^e2 · …, cada divisor elige un exponente de 0 a e_i para cada primo, así que hay (e1+1)(e2+1)… divisores. Con una criba que guarda el menor factor primo de cada número hasta 10^6, factorizar cualquier x cuesta O(log x).",
  "Muchas factorizaciones de números pequeños (hasta ~10^6 en Python, ~10^7 en C++).",
  ["Criba spf hasta 10^6.", "Factorizar x dividiendo por spf[x] repetidamente.", "Multiplicar (exponente + 1) de cada primo."]);
C("FunctionalTools-Classic-Problems-Distributing-Apples", 2, "Estrellas y barras: repartir m objetos iguales entre n personas es C(m + n − 1, n − 1).",
  "Pon las m manzanas en fila y n − 1 separadores: cada orden de estrellas y barras corresponde a un reparto (lo que queda entre separadores es para cada niño). Hay m + n − 1 posiciones y se eligen las de los separadores. El coeficiente binomial se calcula módulo primo con factoriales e inversos de Fermat.",
  "Repartos de objetos idénticos, soluciones enteras no negativas de x1 + … + xn = m.",
  ["Respuesta = C(m + n − 1, n − 1).", "Factoriales módulo 10^9+7.", "Inverso de k! con k!^(M−2) (Fermat)."]);
C("FunctionalTools-Classic-Problems-Array-Division", 2, "Búsqueda binaria sobre la respuesta: si una suma máxima L sirve, cualquier L mayor también; verificar L es una pasada golosa.",
  "En vez de buscar la partición, se pregunta «¿se puede con suma máxima L?». Para eso basta llenar cada parte golosamente hasta que no quepa el siguiente número y contar cuántas partes salen. Como la respuesta es monótona en L, se busca el menor L que sirve entre max(x) y la suma total.",
  "Minimizar un máximo (o maximizar un mínimo) cuando verificar una respuesta candidata es fácil.",
  ["lo = max(x), hi = suma total.", "cabe(L): partes golosas, ¿son ≤ k?", "Búsqueda binaria del menor L con cabe(L)."]);
C("FunctionalTools-Classic-Problems-Prime-Multiples", 2, "Inclusión-exclusión: suma ⌊n / producto⌋ de cada subconjunto de primos con signo + si es impar y − si es par.",
  "Contar los múltiplos de al menos uno es contar una unión de conjuntos. Los múltiplos de un producto de primos distintos son la intersección de sus conjuntos, y hay ⌊n / producto⌋. Con 2^k subconjuntos (k ≤ 20) alcanza; los productos que pasan de n aportan 0 y se descartan antes de desbordar.",
  "Contar elementos que cumplen al menos una de varias condiciones.",
  ["Para cada subconjunto no vacío S: prod = Π primos de S (descartar si > n).", "Sumar ⌊n / prod⌋ si |S| es impar, restarlo si es par."]);

// ---------- Probabilidad ----------
C("Probability-Algorithms-ProbabilityDP", 1, "Una DP de probabilidades: en vez de contar formas, cada estado guarda qué tan probable es, y cada transición multiplica por la probabilidad de ese paso.",
  "Es la misma idea que contar formas de sumar con dados, pero dividiendo entre 6 en cada lanzamiento: p[d][s] es la probabilidad de que tras d dados la suma sea s, y p[d][s] = Σ p[d−1][s−c] / 6 para c = 1..6. Al final se suman las probabilidades de las sumas en [a, b]. Funciona porque los dados son independientes: la probabilidad de una secuencia es el producto de las de cada paso, y los caminos distintos que llegan al mismo estado se suman (regla de la suma para eventos disjuntos).",
  "Cuando un proceso avanza por pasos aleatorios independientes y se pregunta la probabilidad de terminar en cierto estado.",
  ["p[0][0] = 1.", "p[d][s] = Σ_{c=1..6} p[d−1][s−c] / 6.", "Respuesta = Σ_{s=a..b} p[n][s], impresa con seis decimales."]);
C("Probability-Algorithms-LinearityOfExpectation", 1, "Linealidad de la esperanza: el número esperado de inversiones es la suma, par por par, de la probabilidad de que ese par sea una inversión.",
  "La esperanza de una suma es la suma de las esperanzas, incluso si las variables NO son independientes (la varianza, en cambio, solo se suma si lo son). Se escribe el total como suma de indicadores (1 si el par (i, j) es inversión, 0 si no); la esperanza de un indicador es su probabilidad. Así, un problema sobre todos los arreglos posibles (un número enorme) se vuelve n² problemas pequeños: P(x_i > x_j) contando los casos favorables entre r_i · r_j.",
  "Cada vez que piden un valor esperado de un conteo (pares, inversiones, casillas, pasos): descomponerlo en indicadores.",
  ["Escribir X = Σ indicadores I_{ij}.", "E[X] = Σ P(I_{ij} = 1) por linealidad.", "P(x_i > x_j) = (Σ_{v=1..r_i} min(v−1, r_j)) / (r_i · r_j)."]);
C("Probability-Algorithms-ExpectedMaximum", 2, "Para el máximo se usa la función de distribución: P(máx ≤ m) = (m/k)^n porque todos deben ser ≤ m; restando se obtiene P(máx = m).",
  "Calcular directamente la probabilidad de que el máximo sea exactamente m es incómodo, pero «el máximo es ≤ m» equivale a «todos son ≤ m», y como los niños son independientes, esa probabilidad es un producto: (m/k)^n. Entonces P(máx = m) = (m/k)^n − ((m−1)/k)^n y E[máx] = Σ m · P(máx = m). Equivalente: E[máx] = Σ_{m≥1} P(máx ≥ m).",
  "Esperanzas de máximos, mínimos u órdenes de variables independientes.",
  ["F(m) = P(máx ≤ m) = (m/k)^n.", "P(máx = m) = F(m) − F(m−1).", "E = Σ_{m=1..k} m · P(máx = m)."]);
C("Probability-Algorithms-MarkovChain", 2, "Cada robot es una cadena de Markov: su distribución tras k pasos sale de aplicar k veces las probabilidades de transición.",
  "En una cadena de Markov, el siguiente estado solo depende del actual. Si p es la distribución de un robot (probabilidad de estar en cada casilla), un paso reparte la probabilidad de cada casilla en partes iguales entre sus vecinas válidas. Tras k pasos se conoce p para cada robot inicial. Como los robots son independientes, P(casilla c vacía) = Π (1 − p_robot(c)), y por linealidad el número esperado de vacías es la suma de esas probabilidades. Con k muy grande, el mismo paso se puede hacer con potencias de la matriz de transición.",
  "Procesos aleatorios por pasos (caminatas, juegos, máquinas de estados) y valores esperados sobre ellos.",
  ["Para cada robot: p = indicadora de su casilla inicial.", "k veces: q[v] += p[c] / grado(c) para cada vecino v de c.", "vacía[c] *= 1 − p[c].", "Respuesta = Σ vacía[c]."]);
C("Probability-Algorithms-ModularExpectation", 3, "Cuando la esperanza es una fracción p/q, se imprime p · q^(−1) módulo un primo; toda la cuenta se hace en aritmética modular.",
  "Muchos problemas piden la respuesta «módulo 998244353»: como el módulo es primo, cada fracción p/q tiene un representante p · q^(M−2). Probabilidades como p_i/100 se convierten en p_i · inv(100) y se opera normal (sumas y productos módulo M). Aquí, un intento llega al espejo i solo si los anteriores dijeron que sí, así que los días esperados de un intento son 1 + q1 + q1q2 + … + q1⋯q_{n−1}; cada intento tiene éxito con probabilidad q1⋯qn y los intentos se repiten como una geométrica, así que se divide entre q1⋯qn.",
  "Siempre que una probabilidad o esperanza se pida «como p·q⁻¹ mód M».",
  ["inv100 = 100^(M−2) mód M.", "num = Σ_{i=0}^{n−1} (q1⋯qi), con el producto vacío = 1.", "Respuesta = num · (q1⋯qn)^(M−2) mód M."]);
C("Probability-Classic-Problems-Bag-of-Mice", 2, "DP sobre (blancos, negros): cada extracción y cada ratón que salta llevan a un estado más pequeño con su probabilidad.",
  "P[w][b] es la probabilidad de que gane la princesa si le toca sacar. Ella gana de una con w/(w+b). Si saca negro, el dragón también debe sacar negro (si no, gana él) y después salta un ratón al azar, blanco o negro, y vuelve a sacar la princesa con un ratón menos de ese color. Se combinan las ramas multiplicando probabilidades y sumando los casos disjuntos.",
  "Juegos por turnos con azar donde el estado se achica en cada ronda.",
  ["P[w][0] = 1 (w ≥ 1), P[0][b] = 0.", "P[w][b] = w/t + (b/t)·((b−1)/(t−1))·[ (w/(t−2))·P[w−1][b−2] + ((b−2)/(t−2))·P[w][b−3] ].", "Respuesta = P[W][B]."]);
C("Probability-Classic-Problems-Ilya-and-Escalator", 2, "DP sobre el tiempo: d[i] = probabilidad de que haya i personas en la escalera; cada segundo entra una con probabilidad p.",
  "Cada segundo el primero de la fila entra con probabilidad p o se queda con 1 − p. Si ya entraron los n, no cambia nada. Llevando la distribución completa segundo a segundo, al final la esperanza es Σ i · d[i]. Es un ejemplo de cadena de Markov en una línea: muy común en problemas de colas y procesos.",
  "Procesos que avanzan un paso con cierta probabilidad durante un tiempo fijo.",
  ["d[0] = 1.", "Cada segundo: d'[i+1] += d[i]·p, d'[i] += d[i]·(1−p) para i < n, d'[n] += d[n].", "Respuesta = Σ i·d[i]."]);
C("Probability-Classic-Problems-Fish", 3, "DP de probabilidades sobre subconjuntos: P[mask] = probabilidad de que en algún momento queden vivos exactamente esos peces.",
  "Desde un conjunto de k peces vivos, cada uno de los k(k−1)/2 pares se encuentra con la misma probabilidad, y del par (i, j) muere j con probabilidad a[i][j]. Así, P[mask sin j] recibe P[mask] · a[i][j] / pares por cada i vivo. Como cada paso quita un pez, se recorren las máscaras de mayor a menor. La respuesta para el pez i es P[{i}].",
  "Procesos aleatorios con n ≤ 20 elementos donde el estado es qué elementos quedan.",
  ["P[todos] = 1.", "Para cada mask (de mayor a menor) con k ≥ 2: para cada j vivo, P[mask − j] += P[mask] · Σ_{i vivo} a[i][j] / (k(k−1)/2).", "Imprimir P[{i}] para cada i."]);
C("Probability-Classic-Problems-Journey", 1, "La probabilidad de pasar por un nodo es la de su padre dividida entre los hijos del padre; el largo esperado es Σ prob(hoja) · profundidad(hoja).",
  "El caballo empieza en la raíz y en cada ciudad elige uniformemente entre los hijos (las ciudades no visitadas). Con un BFS desde la raíz, prob[hijo] = prob[padre] / (número de hijos). El viaje termina en una hoja, así que la esperanza del largo es la suma sobre hojas de prob · profundidad. También se puede ver como E[v] = 1 + promedio de E[hijos].",
  "Caminatas aleatorias en árboles y esperanzas de profundidad.",
  ["BFS desde 1 calculando profundidad y prob.", "prob[hijo] = prob[u] / hijos(u).", "Respuesta = Σ hojas prob · profundidad."]);
C("Probability-Classic-Problems-Game-on-Tree", 2, "Con indicadores: un nodo cuenta como paso solo si se elige antes que todos sus ancestros, y eso pasa con probabilidad 1 / profundidad.",
  "El número de pasos es la cantidad de nodos que se eligen directamente. Un nodo v se elige directamente si, entre él y sus ancestros (depth(v) nodos en total), es el primero en ser escogido; por simetría, cada uno de ellos es el primero con la misma probabilidad. ¿Por qué hay simetría? Elegir al azar entre los nodos que quedan equivale a fijar desde el inicio una permutación aleatoria de todos los nodos y recorrerla saltando los que ya se borraron: saltar nodos muertos no cambia el orden relativo de los vivos. En esa permutación, v se elige directamente justo cuando aparece antes que todos sus ancestros. Por linealidad de la esperanza, E[pasos] = Σ_v 1/depth(v). Es el ejemplo clásico de cómo un indicador bien elegido convierte un proceso complicado en una suma simple.",
  "Esperanzas de procesos con eliminaciones aleatorias: busca un indicador por elemento.",
  ["Profundidades con BFS (raíz = 1).", "Respuesta = Σ 1 / depth(v)."]);
C("Probability-Classic-Problems-Lets-Play-Osu", 3, "Para la esperanza de un cuadrado se usa (L+1)² − L² = 2L + 1: basta llevar E[L], el largo esperado del bloque actual.",
  "El puntaje no es lineal (es una suma de cuadrados), así que no se puede sumar probabilidades directamente. El truco es mirar cuánto sube el puntaje en cada clic: si el bloque de aciertos que termina en i−1 tiene largo L y el clic i acierta, el puntaje sube 2L + 1. Por linealidad, E[subida] = p_i · (2·E[L] + 1), y E[L] se actualiza como p_i · (E[L] + 1). Todo en O(n).",
  "Esperanzas de funciones no lineales (cuadrados, productos) de procesos secuenciales.",
  ["len = 0, res = 0.", "Para cada p: res += p·(2·len + 1); len = p·(len + 1).", "Imprimir res."]);

// ---------- Probabilidad: distribuciones ----------
C("Probability-Distributions-Binomial", 1, "La binomial cuenta los éxitos en n ensayos independientes con probabilidad p: P(X = k) = C(n, k)·pᵏ·(1−p)ⁿ⁻ᵏ, con E = np y Var = np(1−p).",
  "Un ensayo de Bernoulli es un sí/no con probabilidad p. Si se repite n veces de forma independiente, el número de éxitos X tiene distribución binomial. La fórmula sale de elegir cuáles k ensayos son éxitos (C(n, k)) y multiplicar probabilidades. En competencia conviene más armarla con una DP ensayo por ensayo: d[i] = probabilidad de i éxitos, y cada ensayo hace d'[i] = d[i]·(1−p) + d[i−1]·p. Así no hay que calcular binomiales gigantes y funciona igual si cada ensayo tiene su propia probabilidad pᵢ (la «binomial de Poisson», muy común en problemas). E = np sale directo por linealidad: X es la suma de n indicadores. Si en vez de ensayos independientes se sacan objetos sin reponerlos, la distribución es la hipergeométrica: P = C(K, k)·C(N−K, n−k) / C(N, n).",
  "Contar éxitos entre ensayos independientes: aciertos, personas que compran, monedas que salen cara.",
  ["d[0] = 1.", "Por cada ensayo: d'[i] = d[i]·(1 − p) + d[i − 1]·p.", "P(X = k) = d[k]; P(X ≥ k) = Σ_{i ≥ k} d[i].", "E[X] = np (linealidad) y Var(X) = np(1 − p) (las varianzas se suman porque los ensayos son independientes)."]);
C("Probability-Distributions-CouponCollector", 2, "Esperar el primer éxito es una geométrica (esperanza 1/p); juntar los n tipos de cupón es una suma de geométricas: E = n·(1 + 1/2 + … + 1/n).",
  "Si cada intento tiene éxito con probabilidad p, el número de intentos hasta el primer éxito sigue una distribución geométrica: P(T = t) = (1−p)^(t−1)·p y E[T] = 1/p. En el coleccionista de cupones, con c tipos ya vistos, cada compra trae uno nuevo con probabilidad (n − c)/n, así que esperar el siguiente nuevo es una geométrica de esperanza n/(n − c). Sumando por linealidad: E = n·H_n ≈ n·ln n. Para la probabilidad de terminar en t compras se usa la cadena de Markov sobre «cuántos tipos llevo», o inclusión-exclusión: Σ (−1)^i·C(n, i)·(1 − i/n)^t.",
  "Tiempos de espera: intentos hasta un éxito, compras hasta completar un álbum, pasos hasta visitar todo.",
  ["Geométrica: E = 1/p.", "Cupones: E = Σ_{c=0}^{n−1} n/(n − c) = n·H_n.", "P(terminar en ≤ t): DP d'[c] = d[c]·c/n + d[c−1]·(n−c+1)/n."]);
C("Probability-Distributions-ContinuousUniform", 2, "En probabilidad continua, la probabilidad de un evento es una medida: con variables uniformes es longitud, área o volumen favorable dividido entre el total.",
  "Si x es uniforme en [0, a], cada subintervalo tiene probabilidad proporcional a su largo; un punto exacto tiene probabilidad 0. Con dos variables independientes, (x, y) es uniforme en el rectángulo [0, a] × [0, b] y la probabilidad de un evento es el área de su región sobre a·b («probabilidad geométrica»). Para x + y ≤ s, la región es un triángulo recortado por el rectángulo y su área sale por inclusión-exclusión de triángulos. Otros resultados que aparecen mucho: el mínimo de n uniformes en [0, 1] tiene esperanza 1/(n+1) y, en general, el k-ésimo menor tiene esperanza k/(n+1). Y como empatar tiene probabilidad 0, todos los órdenes de n puntos uniformes son igual de probables: muchos problemas continuos se vuelven problemas de contar órdenes (ver Serval and Bonus Problem).",
  "Cuando los valores son reales al azar en un intervalo: puntos en un segmento, tiempos de llegada, cortes al azar.",
  ["P(evento) = área favorable / (a · b).", "Área de {x + y ≤ s} = T(s) − T(s − a) − T(s − b) + T(s − a − b), con T(c) = c²/2 si c > 0.", "Recordar: E[k-ésimo menor de n uniformes] = k/(n + 1)."]);
C("Probability-Classic-Problems-Probability-Given", 2, "Teorema de Bayes: P(i compró | r compraron) = P(i compró y r compraron) / P(r compraron); ambas probabilidades salen de una DP binomial.",
  "Saber que exactamente r personas compraron cambia la probabilidad de cada una: es probabilidad condicional. El numerador es p_i por la probabilidad de que entre los demás compren exactamente r − 1 (son independientes); el denominador es la probabilidad de que compren exactamente r entre todos. Ambos se calculan con la misma DP de la binomial con probabilidades distintas (cada persona agrega «compra» con p_i o «no compra» con 1 − p_i). Es la forma típica en que aparece Bayes en competencia: actualizar probabilidades cuando se conoce un dato.",
  "Cuando el enunciado dice «sabiendo que…» o «dado que…»: probabilidad condicional y Bayes.",
  ["total = P(exactamente r compran) con la DP de conteo.", "Para cada i: conjunta = p_i · P(exactamente r − 1 entre los demás).", "Respuesta = conjunta / total."]);
C("Probability-Classic-Problems-Serval-and-Bonus-Problem", 3, "Problema continuo que se vuelve combinatorio: la longitud esperada es l · P(un punto al azar quede cubierto), y con puntos uniformes todos los órdenes son igual de probables.",
  "Elegir segmentos con extremos reales al azar parece requerir integrales, pero hay dos trucos. Primero, la longitud esperada cubierta por ≥ k segmentos es l veces la probabilidad de que un punto x uniforme lo esté. Segundo, los 2n extremos y x son 2n + 1 puntos uniformes independientes, así que cualquier orden relativo es igual de probable y solo importa contar órdenes. Se recorre de izquierda a derecha con una DP: cuántos segmentos están abiertos y si ya se colocó x (solo se puede colocar con ≥ k abiertos). Al final se ajusta por las etiquetas (n!·2ⁿ) y se divide por el total de órdenes (2n + 1)!, todo módulo 998244353.",
  "Problemas con puntos reales al azar en un segmento: convertir a órdenes relativos y contar.",
  ["E = l · P(x cubierto por ≥ k).", "DP sobre los 2n + 1 puntos: abrir (j → j+1), cerrar (j → j−1, j formas), colocar x si j ≥ k.", "Respuesta = f[0][con x] · n! · 2ⁿ / (2n + 1)! · l mód M."]);

// ---------- Temas avanzados (hacia las finales) ----------
// El 7.º argumento opcional agrega «¿Por qué funciona?» (pq) y «Errores típicos» (err).
C("FunctionalTools-Number-Theory-ExtendedEuclid", 2, "Además del gcd, Euclides puede devolver x, y con a·x + b·y = gcd(a, b); con eso se resuelven ecuaciones a·x + b·y = c en enteros.",
  "Euclides cambia (a, b) por (b, a mod b) hasta que b = 0. Si ya sabes escribir el gcd con el par de abajo, b·x' + (a mod b)·y' = g, basta reemplazar a mod b = a − ⌊a/b⌋·b para escribirlo con (a, b): x = y', y = x' − ⌊a/b⌋·y'. La ecuación a·x + b·y = c tiene solución entera si y solo si g divide a c (lema de Bézout); una solución es (x·c/g, y·c/g) y todas las demás se obtienen sumando k·(b/g) a x y restando k·(a/g) a y.",
  "Ecuaciones diofánticas, inversos modulares cuando el módulo no es primo y el teorema chino del resto.",
  ["Bajar con Euclides hasta b = 0 (ahí x = 1, y = 0).", "Subir: x = y', y = x' − ⌊a/b⌋·y'.", "Si g no divide a c, no hay solución; si sí, multiplicar por c/g."],
  { pq: "Todo número de la forma a·x + b·y es múltiplo de g, así que c debe serlo. Y el algoritmo construye explícitamente una combinación igual a g, porque cada paso de Euclides es una combinación lineal de los dos números anteriores.",
    err: ["Olvidar los signos: el código trabaja con |A| y |B| y luego cambia el signo de x o y.", "Desbordar al multiplicar x por c/g: aquí cabe porque |x| ≤ |B|/g, pero en general conviene revisar la cota o usar __int128.", "Pensar que la solución es única: hay infinitas, separadas por (b/g, −a/g)."] });
C("FunctionalTools-Number-Theory-CRT", 3, "Dos congruencias x ≡ a (mód n) y x ≡ b (mód m) se combinan en una sola módulo mcm(n, m), si son compatibles.",
  "Se escribe x = a + n·t y se pide que a + n·t ≡ b (mód m), es decir n·t ≡ b − a (mód m). Con g = gcd(n, m) hay solución solo si g divide a b − a; en ese caso Euclides extendido da el inverso de n/g módulo m/g y t queda determinado módulo m/g. La respuesta es única módulo mcm(n, m). Para más de dos congruencias se combinan de a dos.",
  "Sistemas de congruencias, calendarios y ciclos que se repiten con periodos distintos, reconstruir un número a partir de sus restos.",
  ["g = gcd(n, m); si (b − a) no es múltiplo de g, no hay solución.", "t = (b − a)/g · inv(n/g, m/g) mód (m/g).", "x = a + n·t mód mcm(n, m)."],
  { pq: "Si x e y cumplen las dos congruencias, x − y es múltiplo de n y de m, o sea de su mcm: por eso la solución es única módulo el mcm. Y la condición g | (b − a) es necesaria porque x − a y x − b son múltiplos de g.",
    err: ["Suponer que los módulos son coprimos y usar la fórmula del CRT clásico.", "Desbordar: el mcm puede llegar a 10^18 y n·t a 10^27; el código usa __int128.", "Dejar x negativo: hay que normalizar a [0, mcm)."] });
C("FunctionalTools-Number-Theory-EulerPhi", 2, "φ(n) cuenta los números de 1 a n coprimos con n. Con una criba se calculan todos hasta N en O(N log log N).",
  "Si n = p₁^a₁ ⋯ p_k^a_k, entonces φ(n) = n·(1 − 1/p₁)⋯(1 − 1/p_k): de los n números se quitan los múltiplos de cada primo, con inclusión-exclusión. La criba empieza con φ[i] = i y, por cada primo p (un número que nadie modificó), resta φ[j]/p a todos sus múltiplos j: eso es multiplicar por (1 − 1/p) sin usar fracciones.",
  "El teorema de Euler a^φ(m) ≡ 1 (mód m), contar fracciones irreducibles, sumas de gcd y muchas preguntas de conteo con coprimos.",
  ["φ[i] = i para todo i.", "Para cada p con φ[p] = p (primo): para j múltiplo de p, φ[j] −= φ[j]/p.", "Responder consultas en O(1)."],
  { pq: "Cuando se procesa el primo p, φ[j] ya fue multiplicado por (1 − 1/q) para los primos q < p que dividen a j, y sigue siendo múltiplo de p (porque j tiene el factor p completo y se le quitaron fracciones de otros primos), así que la división φ[j]/p es exacta.",
    err: ["Escribir φ[j] = φ[j]·(p − 1)/p con enteros y desbordar o redondear en el orden equivocado.", "Usar la fórmula con todos los divisores en vez de solo los primos.", "Olvidar que φ(1) = 1."] });
C("FunctionalTools-Number-Theory-MillerRabin", 3, "Prueba si un número de hasta 10^18 es primo con unas pocas exponenciaciones modulares, sin buscar divisores.",
  "Si n es primo, Fermat dice a^(n−1) ≡ 1 y además las únicas raíces cuadradas de 1 son ±1. Escribiendo n − 1 = d·2^s, la secuencia a^d, a^(2d), …, a^(n−1) debe empezar en 1 o pasar por n − 1 justo antes de llegar a 1. Una base a que no cumpla eso es un testigo: prueba que n es compuesto. Para n < 2^64 está demostrado que basta con las 7 bases del código; así la prueba es determinista.",
  "Primalidad de números grandes, el paso previo de Pollard rho, buscar el siguiente primo.",
  ["Quitar los casos pequeños y n par.", "n − 1 = d·2^s.", "Para cada base: x = a^d; elevar al cuadrado hasta s − 1 veces buscando n − 1."],
  { pq: "Módulo un primo, x² ≡ 1 implica (x − 1)(x + 1) ≡ 0, así que x ≡ ±1. Para un compuesto impar, al menos 3/4 de las bases son testigos (Rabin), y para n < 2^64 se verificó por computador que esas 7 bases detectan a todos los compuestos.",
    err: ["Multiplicar a·b mód n con long long: a·b llega a 10^36. Hay que usar __int128.", "Usar solo Fermat: los números de Carmichael (561, 1105, …) lo engañan.", "No tratar la base a ≡ 0 (mód n), que no dice nada."] });
C("FunctionalTools-Number-Theory-PollardRho", 4, "Factoriza números de hasta 10^18 encontrando un ciclo en la secuencia x ← x² + c módulo n: el ciclo módulo un factor p aparece mucho antes.",
  "La secuencia x_{i+1} = x_i² + c (mód n) se comporta como aleatoria. Mirada módulo un factor primo p, solo tiene p valores, así que por la paradoja del cumpleaños se repite en unos √p pasos. Cuando x_i ≡ x_j (mód p) pero no módulo n, gcd(|x_i − x_j|, n) es un divisor propio. Se detecta con dos punteros a distinta velocidad (Floyd) o, como en el código, con la variante de Brent que agrupa 128 diferencias en un producto y hace un solo gcd. Con Miller-Rabin se decide cuándo parar.",
  "Factorizar números grandes (divisores, φ, raíces primitivas, problemas de teoría de números con n ≤ 10^18).",
  ["Si n es primo (Miller-Rabin), terminar.", "Buscar un divisor d con rho (si falla, cambiar c).", "Factorizar d y n/d recursivamente."],
  { pq: "Si n tiene un factor p ≤ √n, el ciclo módulo p aparece en O(√p) = O(n^(1/4)) pasos esperados, y mientras tanto los x no coinciden módulo n (con alta probabilidad), así que el gcd da un divisor propio.",
    err: ["Olvidar sacar el factor 2: con n par la secuencia puede no separar nada.", "Quedarse en un bucle si el gcd da n: hay que reintentar con otra c (y otra semilla).", "Usar rand() con poca aleatoriedad o una c fija que los casos de prueba ya conocen."] });
C("FunctionalTools-Games-Nim", 2, "En Nim gana quien empieza si y solo si el xor de todas las pilas es distinto de 0.",
  "Se llama posición perdedora (P) a una donde quien mueve pierde si el rival juega bien. Con xor = 0 toda jugada cambia una sola pila y por eso rompe el xor; con xor = X ≠ 0 hay una pila a cuyo bit más alto coincide con el de X, y bajarla a a xor X deja xor 0. Así, quien recibe xor 0 siempre entrega xor ≠ 0 y quien recibe xor ≠ 0 siempre puede devolver 0, hasta que el primero se queda sin piedras.",
  "Juegos de dos jugadores imparciales, y como base del teorema de Sprague-Grundy.",
  ["Calcular X = xor de las pilas.", "X ≠ 0 → gana el primero; X = 0 → gana el segundo.", "La jugada ganadora es bajar una pila a a xor X < a."],
  { pq: "Es una inducción: las posiciones con xor 0 solo llevan a posiciones con xor ≠ 0, y desde toda posición con xor ≠ 0 existe una jugada a xor 0. La posición final (todo en 0) tiene xor 0 y es perdedora para quien debe mover.",
    err: ["Sumar en vez de hacer xor.", "Aplicarlo a la versión misère (pierde quien toma la última): ahí la regla cambia cuando todas las pilas son de tamaño 1.", "Aplicarlo cuando las jugadas no son las de Nim: entonces hace falta Grundy."] });
C("FunctionalTools-Games-SpragueGrundy", 3, "Todo juego imparcial equivale a una pila de Nim de tamaño g (su número de Grundy); varios juegos a la vez se combinan con xor.",
  "Un juego es imparcial si las jugadas disponibles no dependen de quién mueve. El número de Grundy de una posición es el mex (mínimo excluido) de los números de Grundy de las posiciones a las que se llega en una jugada. g = 0 significa posición perdedora. El teorema de Sprague-Grundy dice que una suma de juegos independientes (en cada turno se mueve en uno de ellos) tiene como Grundy el xor de los Grundy de cada parte, igual que en Nim.",
  "Juegos con varias pilas o tableros independientes, juegos de partir pilas (Grundy's Game), juegos sobre grafos dirigidos acíclicos.",
  ["g[estado sin jugadas] = 0.", "g[x] = mex{ g[y] : y alcanzable desde x }.", "Varias partes: gana el primero si el xor de los g es distinto de 0."],
  { pq: "Desde una posición con Grundy g se puede ir a posiciones con cualquier Grundy menor que g (por la definición de mex) y nunca a una con Grundy g: exactamente como bajar una pila de Nim de tamaño g. Por eso todo el argumento de Nim se traslada.",
    err: ["Sumar los Grundy en vez de hacer xor.", "Calcular el mex con un conjunto que no se limpia entre estados.", "Usarlo en juegos no imparciales (como el ajedrez), donde no aplica."] });
C("FunctionalTools-Polynomials-FFT", 4, "Multiplica dos polinomios de grado n en O(n log n): los evalúa en las raíces de la unidad, multiplica los valores y vuelve a los coeficientes.",
  "Un polinomio de grado < n queda determinado por sus valores en n puntos. Si los puntos son las raíces n-ésimas de la unidad, la evaluación se parte en la de los coeficientes pares y la de los impares, que son dos problemas de tamaño n/2 en las raíces (n/2)-ésimas: A(w) = Par(w²) + w·Impar(w²) y A(−w) = Par(w²) − w·Impar(w²). Eso da O(n log n). Multiplicar polinomios equivale a multiplicar los valores punto a punto, y la transformada inversa es la misma FFT con w⁻¹ dividiendo por n. Muchos conteos de pares (sumas posibles, coincidencias de cadenas con comodines) son convoluciones.",
  "Contar pares por suma, multiplicar números enormes, coincidencia de cadenas con comodines, sumas de subconjuntos con generatrices.",
  ["Rellenar con ceros hasta una potencia de 2 ≥ grado del producto + 1.", "FFT de A y de B.", "Multiplicar punto a punto, FFT inversa, redondear."],
  { pq: "Evaluar en las raíces de la unidad es multiplicar por la matriz de Vandermonde V con V_jk = w^(jk), cuya inversa es (1/n)·V con w⁻¹. La recursión par/impar funciona porque los cuadrados de las raíces n-ésimas son las raíces (n/2)-ésimas, cada una repetida dos veces.",
    err: ["Tamaño insuficiente: el producto tiene grado n + m − 2, así que hacen falta n + m − 1 posiciones; si no, los coeficientes se enciman (convolución circular).", "Errores de redondeo con valores grandes: si los coeficientes del resultado pasan de ~10^15, usar NTT o partir los números.", "Olvidar dividir por n en la inversa o redondear con (long long)x en vez de llround."] });
C("FunctionalTools-Polynomials-NTT", 4, "La FFT con enteros módulo un primo especial (998244353): mismo algoritmo, sin errores de redondeo.",
  "La FFT solo necesita una raíz n-ésima de la unidad w con w^(n/2) = −1. Módulo p = 998244353 = 119·2^23 + 1, el grupo de unidades tiene orden p − 1, que es divisible por 2^23, y 3 es raíz primitiva: w = 3^((p−1)/n) cumple lo necesario para n hasta 2^23. Todo se hace con aritmética modular exacta. Es la herramienta estándar cuando la respuesta se pide módulo 998244353.",
  "Convoluciones con respuesta módulo 998244353, polinomios generatrices, conteos combinatorios grandes.",
  ["Rellenar hasta potencia de 2.", "NTT de A y de B con w = 3^((p−1)/len).", "Multiplicar, NTT inversa con w⁻¹ y multiplicar por n⁻¹."],
  { pq: "Las únicas propiedades de e^(2πi/n) que usa la FFT son w^n = 1 y w^(n/2) = −1 (para que las raíces se repitan al elevar al cuadrado). Una raíz primitiva módulo p de orden n las cumple igual.",
    err: ["Usar un módulo como 10^9 + 7, que no tiene raíces de orden 2^k grandes.", "Olvidar el n⁻¹ de la inversa.", "Para otro módulo cualquiera hace falta NTT con tres primos y el CRT, o FFT partiendo los números."] });
C("DP-Optimizations-ConvexHullTrick", 4, "Cuando la transición es dp[i] = min_j (m_j·x_i + b_j), cada j es una recta y la respuesta es el punto más bajo de la envolvente inferior en x_i.",
  "Una DP O(n²) del tipo min sobre j de (algo de j)·(algo de i) + (otra cosa de j) se lee como: cada estado j aporta la recta y = m_j·x + b_j y la consulta i pregunta el mínimo en x = x_i. Solo sirven las rectas de la envolvente inferior. Si las pendientes llegan en orden y las consultas también, una deque basta: las rectas nuevas entran por un lado (sacando las que quedan tapadas) y las viejas que ya no ganan salen por el otro. Si las consultas no son monótonas se hace búsqueda binaria en la envolvente, y si ni las pendientes lo son se usa Li Chao.",
  "DP con transiciones lineales en n ≤ 2·10^5: costos de la forma a_i·b_j, problemas de partir arreglos, Monster Game, Frog 3.",
  ["Escribir la transición como recta y = m·x + b.", "Consultar: sacar del frente mientras la segunda recta sea mejor en x.", "Insertar: sacar del final mientras la penúltima quede tapada."],
  { pq: "Para pendientes decrecientes, la recta que da el mínimo cambia de una a la siguiente a medida que x crece. La recta del medio de tres consecutivas sobra si la tercera corta a la primera antes que ella; esa comparación de intersecciones se hace con productos cruzados (sin dividir).",
    err: ["Comparar intersecciones con división de flotantes y equivocarse por redondeo; mejor productos cruzados con __int128.", "Pendientes repetidas: hay que quedarse con la de menor intercepto antes de la prueba de \"sobra\".", "Usar la versión de deque cuando las consultas no son monótonas."] });
C("DP-Optimizations-DivideAndConquerDP", 4, "Si el mejor corte opt(i) de una capa de la DP no baja al crecer i, la capa se calcula en O(n log n) con divide y vencerás.",
  "En dp[k][i] = min_{p < i} dp[k−1][p] + costo(p, i), sea opt(i) el p que da el mínimo. Si opt(i) ≤ opt(i + 1), se calcula primero el punto medio (probando todos sus p posibles), y luego la mitad izquierda solo necesita p ≤ opt(mid) y la derecha p ≥ opt(mid). En cada nivel de la recursión los rangos de p se tocan solo en los extremos, así que suman O(n), y hay log n niveles. La monotonía se cumple, por ejemplo, cuando el costo satisface la desigualdad del cuadrángulo (como el cuadrado de la suma de un tramo).",
  "Partir un arreglo en k tramos minimizando una suma de costos: Subarray Squares, Ciel and Gondolas, guardianes de una prisión.",
  ["Capa base dp[0].", "Para cada capa: resolver(lo, hi, optl, optr) calculando mid y su opt.", "Recursión en (lo, mid − 1, optl, opt) y (mid + 1, hi, opt, optr)."],
  { pq: "Cada nivel de la recursión recorre rangos de candidatos que, juntos, cubren [0, n] con solapes solo en los extremos. Por eso cuesta O(n) por nivel y O(n log n) por capa.",
    err: ["Aplicarlo sin verificar que opt es monótono (comparar con la DP lenta en casos pequeños).", "Desbordar el costo: aquí (suma)² llega a ~10^17.", "Recursión profunda en Python: el código usa una pila explícita."] });
C("DP-Optimizations-KnuthOptimization", 4, "En DP de intervalos dp[i][j] = min_c dp[i][c] + dp[c+1][j] + w(i, j), el corte óptimo cumple opt[i][j−1] ≤ opt[i][j] ≤ opt[i+1][j] y la DP baja de O(n³) a O(n²).",
  "Cuando w cumple la desigualdad del cuadrángulo y es monótona respecto a la inclusión de intervalos, el mejor corte se mueve de forma ordenada al agrandar el intervalo. Para cada intervalo solo se prueban los cortes entre opt[i][j−1] y opt[i+1][j]. Sumando sobre todos los intervalos de un mismo largo, esos rangos forman una suma telescópica de tamaño O(n), así que todo cuesta O(n²).",
  "Unir piedras o archivos (costo = suma), árbol binario de búsqueda óptimo, Knuth Division.",
  ["opt[i][i] = i, dp[i][i] = 0.", "Por largo creciente: probar c en [opt[i][j−1], opt[i+1][j]].", "dp[i][j] = mejor + w(i, j)."],
  { pq: "Para un largo fijo L, la suma de (opt[i+1][i+L] − opt[i][i+L−1] + 1) sobre i telescopa a opt[último] − opt[primero] + (número de intervalos) = O(n).",
    err: ["Recorrer los intervalos en un orden en que opt[i+1][j] todavía no se calculó (hay que ir por largo).", "Memoria: con n = 5000 son 25·10^6 entradas; usar int para opt.", "Asumir que vale para cualquier costo: verificar la desigualdad del cuadrángulo."] });
C("DP-Optimizations-SOSDP", 3, "Calcula para todas las máscaras m la suma de f(y) sobre los y ⊆ m en O(B·2^B), procesando un bit a la vez.",
  "La forma directa recorre los subconjuntos de cada máscara: O(3^B). La DP sobre subconjuntos procesa los bits en orden: después de procesar los bits 0…b, sub[m] contiene la suma de f(y) para los y que coinciden con m en los bits mayores que b y son subconjunto en los demás. Al pasar al bit b + 1, las máscaras con ese bit prendido suman lo de la máscara sin él. Lo mismo, al revés, da sumas sobre superconjuntos. Con eso se cuentan pares con x | y = x, x & y = x o x & y ≠ 0.",
  "Conteos sobre máscaras (subconjuntos y superconjuntos), transformada zeta y de Möbius, AND/OR-convoluciones.",
  ["sub[m] = cantidad de veces que aparece m.", "Para cada bit b y cada m con el bit: sub[m] += sub[m sin b].", "Superconjuntos: sup[m sin b] += sup[m]."],
  { pq: "Cada subconjunto y de m se alcanza desde m apagando sus bits faltantes en orden creciente, por un único camino de transiciones: se cuenta exactamente una vez.",
    err: ["Iterar las máscaras por fuera y los bits por dentro: entonces sí se cuentan caminos repetidos.", "Olvidar que x & y ≠ 0 es el complemento de \"y ⊆ ~x\".", "Tamaño 2^B: con B = 20 son 10^6 casillas, bien; con B = 25 ya no."] });
C("DP-Optimizations-DigitDP", 3, "Cuenta números de un rango que cumplen una propiedad de sus dígitos, recorriéndolos de izquierda a derecha con un estado pequeño y una bandera de \"sigo pegado al límite\".",
  "Se cuenta f(N) = cuántos números de [0, N] cumplen, y la respuesta para [L, R] es f(R) − f(L − 1). Mientras los dígitos puestos coinciden con los de N (estado \"pegado\"), el siguiente no puede superar el dígito de N. En cuanto se pone uno menor, el resto queda libre y su conteo solo depende de (dígitos que faltan, estado), así que se memoriza. El estado guarda lo mínimo que hace falta: aquí, cuántos dígitos no nulos van; en otros problemas, la suma de dígitos módulo k, el último dígito o si ya empezó el número.",
  "Contar números en rangos gigantes (hasta 10^18) con condiciones de dígitos: suma de dígitos, dígitos distintos, sin vecinos iguales, divisibilidad.",
  ["f(N) con N como cadena.", "Recorrer el camino pegado sumando, para cada dígito menor, la cantidad libre.", "Sumar 1 si N mismo cumple; responder f(R) − f(L − 1)."],
  { pq: "Todo número ≤ N coincide con N en un prefijo y luego tiene un dígito menor (o es N). Agrupar por la longitud de ese prefijo reparte los números sin repetir, y dentro de cada grupo el resto es libre.",
    err: ["Memorizar también los estados pegados: dependen de N y no se pueden reutilizar entre consultas.", "Olvidar los ceros a la izquierda cuando importan (por ejemplo, para \"dígitos vecinos distintos\").", "Calcular f(L − 1) con L = 0."] });
C("DP-Trees-TreeMatching", 2, "DP en árboles con dos estados por nodo: lo mejor en su subárbol si el nodo queda libre y si se empareja con un hijo.",
  "En un árbol, la decisión sobre un nodo solo interactúa con su padre y sus hijos. libre[u] = suma de max(libre[v], usado[v]) sobre los hijos v; usado[u] = libre[u] + la mejor ganancia de emparejar u con un hijo v, que es libre[v] + 1 − max(libre[v], usado[v]). Se procesan los nodos de las hojas a la raíz, con un orden DFS al revés para no usar recursión.",
  "Conjuntos independientes, coberturas por vértices, emparejamientos y coloraciones en árboles.",
  ["Orden DFS desde la raíz.", "De atrás hacia adelante: libre[u] y usado[u] con los hijos.", "Respuesta: max(libre[raíz], usado[raíz])."],
  { pq: "Los subárboles de hijos distintos son independientes una vez que se decide si u se empareja y con quién: por eso basta con dos números por nodo.",
    err: ["Recursión profunda en un árbol que es una línea de 2·10^5 nodos.", "Emparejar u con un hijo que también está usado en su subárbol: hay que usar libre[v].", "Confundir el padre al recorrer listas de adyacencia no dirigidas."] });
C("DP-Trees-Rerooting", 3, "Calcula una DP de árbol para todas las raíces posibles en O(n): una pasada hacia abajo y otra que \"mueve\" la raíz de padre a hijo.",
  "Primero se calcula la respuesta con raíz 1 (aquí, la suma de distancias = suma de profundidades) y los tamaños de subárbol. Al mover la raíz de p a su hijo v, los sz[v] nodos del subárbol de v quedan a distancia uno menos y los n − sz[v] restantes a distancia uno más: ans[v] = ans[p] + n − 2·sz[v]. Para DP más complicadas (máximos, por ejemplo) se guarda para cada nodo el aporte de \"todo lo que está fuera de su subárbol\", combinando prefijos y sufijos de los hijos.",
  "Cualquier pregunta \"para cada nodo como raíz…\": suma o máximo de distancias, número de formas, mejor centro.",
  ["Pasada 1 (hijos antes que padres): sz y ans[1].", "Pasada 2 (padres antes que hijos): ans[v] a partir de ans[p].", "Imprimir todas."],
  { pq: "El cambio de raíz de p a v solo cambia la distancia de cada nodo en ±1 según de qué lado de la arista p–v esté; ese conteo es exactamente sz[v] y n − sz[v].",
    err: ["Usar int: la suma de distancias llega a ~2·10^10.", "Recalcular desde cero para cada raíz (O(n²)).", "En rerooting con máximos, olvidar excluir al propio hijo al pasar la información de los hermanos."] });
C("Graphs-Algorithms-Connectivity-Bridges", 3, "Una arista es puente si quitarla desconecta el grafo. Con un DFS y los valores tin/low se encuentran todos en O(n + m).",
  "Durante el DFS, tin[u] es el momento en que se descubre u y low[u] es el menor tin alcanzable desde el subárbol de u usando como mucho una arista de retroceso. La arista del árbol p–v es puente exactamente cuando low[v] > tin[p]: nada en el subárbol de v puede volver a p o más arriba sin pasar por esa arista. El código evita la recursión con una pila y un índice por nodo, y salta la arista por la que llegó (por su id, no por el vecino, para soportar aristas repetidas).",
  "Caminos críticos en redes, componentes 2-arista-conexas, orientar un grafo para que sea fuertemente conexo.",
  ["DFS asignando tin y low.", "Al volver de v a p: low[p] = min(low[p], low[v]).", "Si low[v] > tin[p], la arista p–v es puente."],
  { pq: "En un grafo no dirigido el DFS solo deja aristas de árbol y de retroceso (nunca cruzadas). Por eso, si el subárbol de v tiene otra salida, es una arista de retroceso hacia un ancestro de v, y aparece en low.",
    err: ["Saltar al padre por número de nodo: con aristas paralelas, la segunda copia sí cuenta.", "Comparar con ≥ (eso es para puntos de articulación).", "DFS recursivo con n = 10^5 en Python."] });
C("Graphs-Algorithms-Connectivity-ArticulationPoints", 3, "Un vértice es de articulación si quitarlo desconecta el grafo. Misma DFS con tin/low, con la condición low[hijo] ≥ tin[u].",
  "Un nodo u que no es la raíz es de articulación si tiene un hijo v en el árbol DFS con low[v] ≥ tin[u]: el subárbol de v solo llega hasta u, así que sin u queda aislado. La raíz es especial: es de articulación si y solo si tiene al menos dos hijos en el árbol DFS (cualquier camino entre esos subárboles tendría que pasar por ella).",
  "Ciudades críticas, componentes biconexas (bloques) y el árbol de bloques y cortes.",
  ["DFS con tin, low y número de hijos.", "Para u ≠ raíz: si low[v] ≥ tin[u] para algún hijo v, u es de corte.", "La raíz es de corte si tiene 2 o más hijos DFS."],
  { pq: "Igual que con puentes: las únicas salidas de un subárbol son aristas de retroceso. Con ≥ se permite que el subárbol vuelva justo a u (u sigue siendo necesario para salir de él).",
    err: ["Aplicar la regla general a la raíz.", "Contar un mismo nodo varias veces (se marca una vez).", "Usar > en vez de ≥."] });
C("Graphs-Algorithms-Trees-HLD", 4, "Parte el árbol en cadenas pesadas para que cualquier camino sea O(log n) rangos contiguos de un Segment Tree.",
  "Para cada nodo, su hijo pesado es el de subárbol más grande; las aristas hacia él son pesadas y las demás livianas. Al bajar por una arista liviana, el tamaño del subárbol al menos se divide entre dos, así que cualquier camino raíz–hoja cruza O(log n) aristas livianas. Si se numeran los nodos recorriendo primero el hijo pesado, cada cadena pesada ocupa posiciones consecutivas. Una consulta en el camino a–b sube siempre desde la cadena cuya cabeza es más profunda, consultando ese tramo en el Segment Tree, hasta que ambos quedan en la misma cadena.",
  "Consultas y actualizaciones en caminos de árboles (máximos, sumas, asignaciones), LCA, combinarlo con Lazy Segment Tree.",
  ["Tamaños y hijo pesado.", "Asignar cabeza y posición recorriendo primero el hijo pesado.", "Consulta: subir por cadenas, un rango del Segment Tree por cadena."],
  { pq: "Si u → v es liviana, sz[v] ≤ sz[u]/2 (si no, v sería el pesado). Partiendo de n, solo se puede dividir entre dos log n veces.",
    err: ["Comparar la profundidad de a y b en vez de la de sus cabezas.", "Olvidar el último tramo cuando ya están en la misma cadena.", "Si los valores están en las aristas, el último tramo es [pos[a] + 1, pos[b]]."] });
C("Graphs-Algorithms-Flow-Algorithms-HopcroftKarp", 4, "Emparejamiento bipartito máximo en O(E·√V): por fases, aumenta a la vez por muchos caminos disjuntos de largo mínimo.",
  "Cada fase hace un BFS desde todos los vértices libres de la izquierda, alternando aristas libres y emparejadas, y arma capas. Luego, con DFS que solo avanzan de una capa a la siguiente (como en Dinic), encuentra un conjunto maximal de caminos aumentantes disjuntos del largo mínimo y los aplica todos. Después de √V fases los caminos que quedan son largos, y como son disjuntos quedan pocos: en total O(√V) fases de O(E).",
  "Emparejamiento bipartito con 10^5 vértices, coberturas mínimas por vértices (Kőnig), cubrir un tablero con fichas de dominó.",
  ["BFS por capas desde los izquierdos libres.", "DFS por las capas con índice por nodo; los nodos sin salida se marcan.", "Repetir mientras el BFS encuentre un derecho libre."],
  { pq: "El largo del camino aumentante más corto crece estrictamente en cada fase. Tras √V fases mide más de √V; la diferencia con un emparejamiento máximo se descompone en caminos disjuntos, que entonces son menos de √V, y cada fase aumenta al menos en uno.",
    err: ["Reiniciar el índice de aristas dentro de una fase (pierde la garantía de tiempo).", "No marcar como inútiles los nodos de los que el DFS no salió.", "Usar Kuhn simple con 10^5 nodos: O(V·E) puede no alcanzar."] });
C("Graphs-Algorithms-Flow-Algorithms-MinCut", 3, "Después del flujo máximo, los nodos alcanzables desde la fuente en la red residual forman un corte mínimo; sus aristas hacia afuera son las que hay que cortar.",
  "Cuando no quedan caminos aumentantes, sea S el conjunto de nodos que la fuente todavía alcanza con capacidad sobrante. Toda arista de S hacia afuera está saturada (si no, su extremo estaría en S) y toda arista de afuera hacia S lleva flujo 0. Por eso el flujo que cruza el corte es exactamente la suma de capacidades de S hacia afuera: un corte con capacidad igual al flujo máximo, que por eso es mínimo. Para aristas no dirigidas se pone capacidad en los dos sentidos.",
  "Separar dos nodos con el menor costo, proyectos con prerrequisitos (clausura de peso máximo), segmentación de imágenes.",
  ["Flujo máximo (Dinic).", "DFS/BFS desde s por aristas con capacidad residual > 0.", "Imprimir las aristas originales con un extremo dentro y otro fuera."],
  { pq: "Para cualquier corte, flujo ≤ capacidad del corte. El corte construido iguala al flujo, así que los dos son óptimos a la vez: es el teorema de flujo máximo = corte mínimo.",
    err: ["Recorrer también aristas con capacidad 0 (aristas inversas vacías).", "Imprimir aristas del residual en vez de las originales.", "En grafos no dirigidos, modelar cada calle con una sola arista dirigida."] });
C("Graphs-Algorithms-Flow-Algorithms-LowerBoundFlow", 4, "Para pedir que cada arista lleve al menos l unidades, se manda l por obligación y se reparan los desbalances con una fuente y un sumidero nuevos.",
  "Si la arista u → v debe llevar entre l y c, se fija l en ella: v recibe l de más y u entrega l de más. Queda una red con capacidades c − l y nodos desbalanceados. Se agrega S' con una arista a cada nodo con exceso (tanta capacidad como su exceso) y T' desde cada nodo con déficit. Hay circulación válida si y solo si el flujo máximo S' → T' satura todas esas aristas. Para flujo s–t con cotas se agrega antes una arista t → s de capacidad infinita, y para el mínimo o máximo se ajusta con otro flujo después.",
  "Flujos con demandas, circulaciones, planificación con mínimos obligatorios, problemas de cobertura con cotas.",
  ["Para cada arista: capacidad c − l, exceso[v] += l, exceso[u] −= l.", "S' → nodos con exceso, nodos con déficit → T'.", "Válido si el flujo máximo = suma de excesos; flujo real = l + lo enviado."],
  { pq: "Una circulación válida f da, restando l, un flujo en la red nueva que repara exactamente los excesos, y viceversa: las dos cosas se corresponden una a una.",
    err: ["Olvidar sumar l al imprimir el flujo de cada arista.", "Comparar el flujo con la suma de excesos y déficits juntos (se cuenta dos veces).", "Para flujo s–t, olvidar la arista t → s."] });
C("Graphs-Algorithms-Flow-Algorithms-Hungarian", 4, "Asignación de costo mínimo (n personas a n tareas) en O(n³) manteniendo potenciales u, v con u[i] + v[j] ≤ c[i][j].",
  "Se agregan las filas una por una. Las aristas con u[i] + v[j] = c[i][j] (costo reducido 0) son las únicas que se usan. Para la fila nueva se busca un camino aumentante tipo Dijkstra sobre los costos reducidos; cuando no hay camino de ceros, se suben los potenciales de las filas visitadas y se bajan los de las columnas visitadas en el mínimo delta, lo que crea una arista nueva en 0 sin romper ninguna desigualdad. Al final, el costo total es Σu + Σv, y como toda asignación cuesta al menos eso, es óptima.",
  "Asignar trabajadores a tareas, emparejamiento bipartito de peso mínimo o máximo con n ≤ 500.",
  ["Para cada fila i: buscar camino en los costos reducidos (minv, way).", "Ajustar potenciales con delta hasta llegar a una columna libre.", "Aumentar por el camino; al final, p[j] da la fila de cada columna."],
  { pq: "Es el algoritmo primal-dual: u y v son una solución factible del dual del problema de asignación, y la asignación usa solo aristas ajustadas, así que el primal y el dual valen lo mismo (holgura complementaria).",
    err: ["Para maximizar, olvidar cambiar el signo de los costos.", "Matrices no cuadradas: rellenar con ceros o usar la versión n ≤ m.", "Usar INF pequeño: delta puede sumar varios costos."] });
C("Data-Structures-Algorithms-PersistentSegmentTree", 4, "Un Segment Tree donde cada actualización crea una versión nueva copiando solo los O(log n) nodos del camino; las versiones viejas siguen intactas.",
  "Al cambiar una posición, solo cambian los nodos del camino raíz–hoja. En vez de modificarlos, se crean copias nuevas que apuntan a los hijos viejos que no cambiaron. La raíz nueva representa la versión nueva y la vieja sigue igual. Copiar un arreglo completo es entonces O(1): basta con reutilizar su raíz. Se usa para \"k-ésimo menor en un rango\" (una versión por prefijo), consultas sobre el pasado y estructuras funcionales.",
  "Copias de arreglos, consultas sobre versiones anteriores, k-ésimo en rango (versiones por prefijo), conteos offline en 2D.",
  ["Construir la versión inicial (2n nodos).", "Actualizar: copiar cada nodo del camino y enlazar los hijos que no cambian.", "Consultar desde la raíz de la versión pedida."],
  { pq: "Un nodo nunca se modifica después de creado, así que cualquier raíz sigue describiendo exactamente el arreglo que describía. Cada cambio agrega log n + 1 nodos.",
    err: ["Reservar poca memoria: 2n + q·(log n + 1) nodos.", "Modificar un nodo compartido por error (por ejemplo, al hacer lazy sin copiar).", "Recursión en Python: el código usa pilas explícitas."] });
C("Data-Structures-Algorithms-Treap", 4, "Árbol binario con claves y prioridades aleatorias; con clave implícita (la posición) permite cortar, pegar e invertir partes de una secuencia en O(log n).",
  "Un treap es árbol de búsqueda en la clave y heap en la prioridad; con prioridades al azar su altura esperada es O(log n). Las dos operaciones básicas son split (partir en los primeros k y el resto) y merge (unir dos treaps donde todo el primero va antes). En el treap implícito la clave es la posición, que se deduce del tamaño de los subárboles: para cortar [a, b] y pegarlo al final se hacen dos splits y dos merges. Con marcas perezosas también se pueden invertir tramos o sumar a rangos.",
  "Cortar y pegar cadenas, invertir subarreglos, insertar en medio de una secuencia, conjuntos ordenados con k-ésimo.",
  ["split(u, k): bajar comparando k con el tamaño del hijo izquierdo.", "merge(a, b): sube el de mayor prioridad.", "Cada operación: split–split–merge–merge."],
  { pq: "Con prioridades aleatorias, el treap tiene la misma forma que un árbol de búsqueda construido insertando en orden aleatorio, cuya profundidad esperada es O(log n).",
    err: ["Olvidar recalcular el tamaño después de cambiar hijos.", "Usar prioridades no aleatorias (o la misma semilla que alguien puede atacar).", "Recursión: en C++ la profundidad es O(log n) y no hay problema; en Python el código es iterativo."] });
C("Data-Structures-Algorithms-OrderedSet", 3, "Un conjunto ordenado que además responde \"el k-ésimo menor\" y \"cuántos son menores que x\" en O(log n); en C++ viene en pb_ds.",
  "set de C++ no permite preguntar por posición. El tree de pb_ds (policy-based data structures de GNU) es un árbol rojo-negro que guarda el tamaño de cada subárbol, así que find_by_order(k) y order_of_key(x) bajan por el árbol en O(log n). En Josephus, los niños que quedan están en el conjunto y el siguiente en salir es el de posición (pos + k) mód tamaño. En Python no existe; la alternativa clásica es un Fenwick de 0/1 donde el k-ésimo se busca bajando por potencias de 2.",
  "Josephus, inversiones dinámicas, medianas con inserciones y borrados, ranking en línea.",
  ["Declarar ordered_set con tree_order_statistics_node_update.", "find_by_order(k) para el k-ésimo; order_of_key(x) para contar menores.", "Para multiconjuntos, guardar pares (valor, id)."],
  { pq: "Cada nodo guarda el tamaño de su subárbol; para buscar el k-ésimo se compara k con el tamaño del hijo izquierdo y se baja por un solo lado, como en una búsqueda binaria.",
    err: ["Usarlo como multiconjunto con less<T>: los repetidos se descartan.", "Usar less_equal para permitir repetidos: rompe erase y find.", "Olvidar que find_by_order cuenta desde 0."] });
C("Strings-Algorithms-AhoCorasick", 4, "Busca muchos patrones a la vez en un texto en tiempo lineal: un trie de los patrones con enlaces de fallo, como un KMP para varios patrones.",
  "Se insertan los patrones en un trie. El enlace de fallo de un nodo apunta al sufijo propio más largo de su cadena que también es un nodo del trie; se calcula por niveles con BFS usando el del padre, igual que la función de prefijos. Completando las transiciones que faltan con las del nodo de fallo, el trie se vuelve un autómata: leer el texto es moverse una vez por letra. Un patrón aparece si se visita su nodo o cualquier nodo cuya cadena de enlaces de fallo pase por él; eso se propaga al final de los nodos profundos a los superficiales.",
  "Buscar diccionarios en textos, contar apariciones de muchos patrones, DP sobre cadenas que deben evitar varias palabras prohibidas.",
  ["Trie de los patrones.", "BFS: link[v] = transición desde link[u] con la letra de v; completar transiciones.", "Recorrer el texto y propagar las visitas por los enlaces."],
  { pq: "Si en el texto se está en el nodo u, la cadena de u es el sufijo más largo de lo leído que es prefijo de algún patrón; los demás sufijos que también lo son están en la cadena de enlaces de fallo de u.",
    err: ["Recorrer la cadena de fallos en cada letra para reportar apariciones: puede ser O(n·√(Σ|p|)); mejor propagar al final.", "Patrones repetidos: varios patrones terminan en el mismo nodo.", "Memoria de 26 enteros por nodo con 10^6 nodos: usar int y no long long."] });
C("Strings-Algorithms-SuffixAutomaton", 4, "El menor autómata que reconoce todos los sufijos de s: tiene a lo sumo 2n − 1 estados y responde casi cualquier pregunta sobre subcadenas.",
  "Cada estado agrupa subcadenas que aparecen exactamente en las mismas posiciones finales (la misma clase endpos); guarda len, el largo de la más larga, y link, el estado de su sufijo más largo de otra clase. Se construye agregando letras: el estado nuevo recibe transiciones desde los sufijos que no la tenían, y si la transición existente salta a un estado con len demasiado grande, ese estado se clona para separar las subcadenas que ahora sí son sufijo. Cada estado v representa len[v] − len[link[v]] subcadenas distintas, así que contarlas es una suma.",
  "Subcadenas distintas, la k-ésima subcadena en orden, la subcadena común más larga de dos cadenas, conteo de apariciones.",
  ["Estado inicial con len 0 y link −1.", "extender(c): crear cur, recorrer links poniendo transición a cur, clonar si hace falta.", "Respuesta: Σ (len[v] − len[link[v]])."],
  { pq: "Las clases endpos forman un árbol por inclusión (el árbol de enlaces), y en cada clase los largos de sus subcadenas son un intervalo (len[link[v]], len[v]]. Agregar una letra solo puede partir una clase en dos, por eso basta con un clon.",
    err: ["Copiar las transiciones del estado original al clonar, pero no su link.", "Reservar memoria para 2n estados.", "Confundir el número de estados con el de subcadenas."] });
C("Probability-Algorithms-GaussianExpectation", 4, "Cuando los estados de un proceso aleatorio se pueden repetir (hay ciclos), las esperanzas o probabilidades forman un sistema lineal: se resuelve con eliminación de Gauss.",
  "En una DP de probabilidades cada estado depende de estados \"más pequeños\". Si un estado puede volver a sí mismo después de varios pasos, no hay orden y la ecuación E[v] = 1 + Σ P(v → w)·E[w] es un sistema lineal. En Museum los estados son los pares de cuartos (i, j) de los dos amigos: x[s] = número esperado de minutos en el estado s, que cumple x[s] = [s es el inicio] + Σ x[t]·P(t → s). Con V = n² variables se resuelve con Gauss-Jordan en O(V³), con pivoteo parcial (elegir la fila con el mayor valor absoluto) para que los errores no crezcan.",
  "Paseos aleatorios en grafos con ciclos, juegos con probabilidades que pueden durar para siempre, cadenas de Markov absorbentes.",
  ["Plantear una ecuación por estado.", "Gauss con pivoteo parcial.", "Leer la respuesta (aquí, la masa que llega a cada estado (k, k))."],
  { pq: "La matriz I − Q (Q = transiciones entre estados no absorbentes) es invertible cuando desde todo estado se puede llegar a uno absorbente, y su inversa cuenta las visitas esperadas a cada estado (matriz fundamental de la cadena de Markov).",
    err: ["Dividir por un pivote casi cero: siempre elegir el de mayor valor absoluto.", "Incluir transiciones que salen de los estados absorbentes.", "Usar Gauss con n² = 10^4 variables: O(10^12). Hay que buscar estructura (tridiagonal, por capas)."] });
C("Geometry-Advanced-SegmentDistance", 2, "La distancia entre dos segmentos es 0 si se cortan; si no, es la menor de las 4 distancias de un extremo al otro segmento.",
  "La distancia de un punto P a un segmento AB se calcula proyectando: t = (P − A)·(B − A) / |B − A|². Si t < 0 el más cercano es A, si t > 1 es B, y si no, la distancia es la altura |cruz(B − A, P − A)| / |B − A|. Para dos segmentos que no se cortan, el par más cercano siempre incluye un extremo (si los dos puntos fueran interiores, se podría mover alguno y acercarlos más, salvo que sean paralelos, y aun así hay un extremo con la misma distancia).",
  "Colisiones, distancias mínimas entre obstáculos, problemas de robots y corredores.",
  ["Si se cortan (con el chequeo de colineales), 0.", "Distancia de cada extremo al otro segmento, proyectando con t ∈ [0, 1].", "El mínimo de las 4."],
  { pq: "La distancia entre puntos de los dos segmentos es una función convexa de los parámetros (s, t) ∈ [0, 1]²; si no se anula, su mínimo está en el borde del cuadrado, es decir, con s o t en 0 o 1: un extremo.",
    err: ["Olvidar el caso de segmento degenerado (un punto): |B − A|² = 0.", "Comparar t con 0 y 1 después de dividir con flotantes; mejor comparar el producto punto con 0 y |B − A|².", "No revisar si se cortan: la respuesta sería positiva cuando debía ser 0."] });
C("Geometry-Advanced-LineIntersection", 2, "Con las rectas en forma paramétrica A + t·r y C + u·s, el punto de corte sale de t = cross(C − A, s) / cross(r, s).",
  "Igualando A + t·r = C + u·s y haciendo producto cruz con s a ambos lados se elimina u (porque s × s = 0): t·(r × s) = (C − A) × s. Si r × s = 0 las direcciones son paralelas: son la misma recta cuando además (C − A) × r = 0. Todos los productos se hacen con enteros y solo la división final es en flotante, así que los casos especiales se deciden sin errores.",
  "Intersecciones de rectas y segmentos, construcciones geométricas, centros de circunferencias.",
  ["r = B − A, s = D − C, den = r × s.", "den = 0: SAME o PARALLEL según (C − A) × r.", "t = ((C − A) × s) / den; punto = A + t·r."],
  { pq: "El producto cruz con s anula cualquier múltiplo de s, así que en la ecuación vectorial queda una sola incógnita escalar.",
    err: ["Decidir paralelismo con flotantes y una tolerancia mal elegida; con coordenadas enteras se compara den == 0 exacto.", "Imprimir −0.000000.", "Para segmentos, además hay que revisar 0 ≤ t ≤ 1 y 0 ≤ u ≤ 1."] });
C("Geometry-Advanced-CircleIntersection", 3, "Dos circunferencias se cortan en 0, 1 o 2 puntos según d² frente a (r1 ± r2)²; los puntos salen del punto medio de la cuerda y su semilongitud.",
  "Restando las dos ecuaciones |X − C1|² = r1² y |X − C2|² = r2² queda una recta (el eje radical). Sobre la línea de centros, el pie de esa recta está a distancia a = (r1² − r2² + d²) / (2d) de C1, y la mitad de la cuerda mide h = √(r1² − a²). Los puntos son M ± h·(perpendicular unitaria). El número de puntos se decide antes con enteros: separadas si d² > (r1 + r2)², una dentro de otra si d² < (r1 − r2)², tangentes en los casos de igualdad.",
  "Lugares geométricos, alcance de antenas, construir triángulos con lados dados.",
  ["d² con enteros; casos 0, 1, 2 o infinitos.", "a y h; M = C1 + a·(C2 − C1)/d.", "Puntos M ± h·(−dy, dx)/d."],
  { pq: "Los puntos comunes están en el eje radical, que es perpendicular a C1C2; el triángulo C1, M, P es rectángulo, de ahí h² = r1² − a².",
    err: ["Calcular √(negativo) por redondeo en tangencias: usar max(0, ·) o decidir la tangencia con enteros.", "Olvidar el caso de centros iguales (d = 0, división por cero).", "Imprimir dos veces el mismo punto cuando son tangentes."] });
C("Geometry-Advanced-RotatingCalipers", 3, "El par de puntos más lejano está entre pares antípodas de la envolvente convexa; recorriéndola con dos punteros que solo avanzan se encuentran todos en O(h).",
  "Primero la envolvente convexa (cadena monótona). Para cada arista i → i+1, el vértice j más lejano de su recta se encuentra avanzando j mientras el área del triángulo (i, i+1, j) crezca; al pasar a la siguiente arista, el antípoda nunca retrocede. El diámetro es el máximo de las distancias entre los extremos de cada arista y su antípoda. La misma técnica da el ancho mínimo, el rectángulo de área mínima que contiene los puntos y la distancia entre dos polígonos convexos.",
  "Par más lejano, ancho de un conjunto de puntos, rectángulo envolvente mínimo, distancia entre polígonos convexos.",
  ["Envolvente convexa antihoraria, sin colineales.", "Para cada arista, avanzar j mientras crezca el área.", "Actualizar con las distancias de los extremos a j."],
  { pq: "Para una dirección fija, el punto más lejano de un polígono convexo en esa dirección es un vértice, y al girar la dirección ese vértice avanza en el mismo sentido: el recorrido completo da una vuelta para cada puntero.",
    err: ["Envolvente con puntos repetidos o colineales que hacen que el área no crezca estrictamente.", "Casos con 1 o 2 puntos distintos.", "Usar raíces en las comparaciones; comparar distancias al cuadrado y sacar la raíz al final."] });
C("Geometry-Advanced-HalfPlaneIntersection", 4, "La intersección de n semiplanos es un polígono convexo; ordenando las rectas por ángulo y usando una deque se construye en O(n log n).",
  "Cada semiplano es el lado izquierdo de una recta dirigida. Se ordenan por ángulo y, entre las de igual ángulo, se deja la más restrictiva. Se recorren manteniendo en una deque las rectas que forman la frontera: antes de agregar una recta se sacan del final las rectas cuyo punto de corte con la anterior queda fuera del semiplano nuevo, y lo mismo del frente. Al terminar se limpia el final contra el frente. Los vértices son los cortes de rectas consecutivas. Una caja grande asegura que la intersección sea acotada.",
  "Núcleo de un polígono (desde dónde se ve todo), regiones factibles de programas lineales en 2D, zonas más cercanas a un punto (celdas de Voronoi).",
  ["Agregar la caja y ordenar por ángulo (atan2).", "Recorrer: sacar del final y del frente lo que quede fuera.", "Cerrar, calcular los vértices y el área con Shoelace."],
  { pq: "En orden angular, cada recta útil aporta exactamente un lado consecutivo del polígono convexo resultante; una recta se vuelve inútil cuando el vértice que formaba con su vecina queda fuera de un semiplano posterior, y entonces nunca vuelve a servir.",
    err: ["Rectas paralelas opuestas que dejan la región vacía: hay que detectarlo.", "Tolerancias: comparar ángulos y lados con un eps acorde a las coordenadas.", "Olvidar la caja: la intersección puede no ser acotada y el área es infinita."] });
C("Geometry-Advanced-PolygonCut", 3, "Cortar un polígono convexo con una recta en O(n): se conservan los vértices de un lado y se agregan los puntos donde las aristas cruzan la recta.",
  "Se recorren las aristas c → d. Si c está a la izquierda (o sobre la recta) se conserva. Si c y d están en lados estrictamente opuestos, la arista cruza la recta en c + (d − c)·sc/(sc − sd), donde sc y sd son los productos cruz (distancias con signo, sin normalizar). El resultado sigue siendo convexo. Es el paso básico de Sutherland-Hodgman, y repetirlo con cada semiplano da una intersección de semiplanos en O(n²), suficiente para n pequeño.",
  "Partir regiones, intersección de dos polígonos convexos, áreas a un lado de una recta, intersección de semiplanos con n pequeño.",
  ["Lado de cada vértice: s = cross(b − a, p − a).", "Conservar los de s ≥ 0.", "Agregar el cruce cuando los signos son opuestos."],
  { pq: "La proporción sc/(sc − sd) es la de las distancias de c y d a la recta (con signo), así que da exactamente el punto de la arista que está sobre la recta.",
    err: ["Agregar el cruce también cuando un extremo está justo sobre la recta (lo duplica).", "Usar el algoritmo para polígonos no convexos y esperar una sola pieza.", "Confundir el lado: la izquierda de a → b es cross > 0."] });
C("Geometry-Advanced-PointInConvexPolygon", 3, "Decide si un punto está dentro de un polígono convexo en O(log n): búsqueda binaria en el abanico de triángulos desde un vértice.",
  "Desde el vértice 0, los rayos hacia los demás vértices están ordenados por ángulo (el polígono es convexo). Primero se descarta todo lo que está fuera del ángulo entre el rayo 0→1 y el rayo 0→n−1. Luego, con búsqueda binaria usando el signo del producto cruz, se encuentra el triángulo (0, k, k+1) cuyo ángulo contiene al punto. Dentro de ese ángulo, el punto está en el polígono si queda a la izquierda de la arista k → k+1. Con m consultas el total es O(n + m log n).",
  "Muchas consultas de punto en polígono convexo, saber si un polígono está dentro de otro convexo.",
  ["Pasar el polígono a sentido antihorario.", "Descartar con los rayos 0→1 y 0→n−1.", "Búsqueda binaria del abanico y orientación final contra la arista."],
  { pq: "Para un polígono convexo, los vértices vistos desde el vértice 0 aparecen en orden angular, así que el signo de cross(P_i − P_0, Q − P_0) cambia una sola vez: es monótono y se puede buscar binariamente.",
    err: ["Polígono en sentido horario (aquí viene así y se invierte).", "Puntos sobre el borde: decidir si cuentan como dentro (aquí no, pide estrictamente dentro).", "Desbordar: con coordenadas de 10^9 el producto cruz llega a 8·10^18, justo dentro de long long."] });

// ---------- «¿Por qué funciona?» y «Errores típicos» de las lecciones base ----------
function E(id, pq, err) { Object.assign(window.CONTENIDO[id], { pq, err }); }
E("FunctionalTools-Codes-BS", "La búsqueda binaria mantiene una invariante: la respuesta siempre está en [lo, hi]. Como la condición es monótona (falsa, falsa, …, verdadera, verdadera), mirar el medio descarta una mitad entera sin perder la respuesta, y el intervalo se reduce a la mitad en cada paso.",
  ["Ciclo infinito con mid = (lo + hi) / 2 y lo = mid: usar lo = mid + 1 o mid = (lo + hi + 1) / 2 según el caso.", "Desbordar (lo + hi) con int; usar lo + (hi − lo) / 2 o long long.", "Aplicarla a una condición que no es monótona."]);
E("FunctionalTools-Codes-BS-library", "lower_bound busca en el intervalo semiabierto [lo, hi) la primera posición con a[i] ≥ x; upper_bound, la primera con a[i] > x. Por eso upper_bound − lower_bound cuenta las apariciones de x, y binary_search es lower_bound más una comparación.",
  ["Usar lower_bound sobre un arreglo que no está ordenado.", "Llamar std::lower_bound sobre un set (es O(n)); usar s.lower_bound(x).", "Desreferenciar el resultado cuando es end()."]);
E("FunctionalTools-Codes-BinarySearchAnswer", "Si \"¿se puede con valor x?\" es monótono en x (si se puede con x, se puede con cualquier valor más holgado), la respuesta óptima es la frontera entre falso y verdadero, y se encuentra con búsqueda binaria haciendo O(log rango) verificaciones.",
  ["Elegir mal el rango inicial (que no contenga la respuesta).", "Verificador que no es monótono por un detalle (por ejemplo, contar mal un tramo vacío).", "Con reales, iterar un número fijo de veces (100) en vez de comparar con un eps."]);
E("FunctionalTools-Codes-Sieve", "Todo compuesto n tiene un factor primo p ≤ √n, así que queda tachado al procesar p. Empezar a tachar desde p² basta porque los múltiplos menores ya tienen un factor primo más pequeño. La suma Σ n/p sobre los primos es O(n log log n).",
  ["Empezar en 2p en vez de p² (correcto pero más lento) o tachar desde p (tacha el propio primo).", "Usar int para p·p cuando p es grande.", "Olvidar que 0 y 1 no son primos."]);
E("FunctionalTools-Codes-ModArithmetic", "Módulo un primo p, todo a ≠ 0 tiene inverso, y por el pequeño teorema de Fermat a^(p−1) ≡ 1, así que a^(p−2) es el inverso. Sumas, restas y productos se pueden reducir en cualquier momento porque el resto es compatible con esas operaciones.",
  ["Restar y quedar con un resto negativo: usar ((a − b) % M + M) % M.", "Dividir directamente en vez de multiplicar por el inverso.", "Multiplicar dos números cercanos a 10^9 en int (desborda)."]);
E("FunctionalTools-Codes-MatrixExponentiation", "Una recurrencia lineal de orden k es multiplicar un vector de k estados por una matriz fija. Aplicarla n veces es multiplicar por M^n, y la potencia se calcula con exponenciación binaria en O(k³ log n), porque el producto de matrices es asociativo.",
  ["Orden de la multiplicación: M·v no es v·M.", "Olvidar el módulo dentro del triple ciclo.", "Usar exponenciación de matrices cuando k es grande (k³ crece rápido)."]);
E("FunctionalTools-Codes-MeetInTheMiddle", "Los 2^n subconjuntos se parten en (subconjunto de la mitad izquierda, subconjunto de la derecha). Fijada la parte izquierda con suma s, solo importan las de la derecha con suma x − s: se buscan en la lista ordenada en O(log). Así 2^n se vuelve 2·2^(n/2).",
  ["Generar las sumas con recursión lenta en vez de duplicar la lista por cada elemento.", "Contar solo la primera coincidencia en vez de todas (usar upper_bound − lower_bound).", "Memoria: 2^20 sumas de long long ya son 8 MB por mitad."]);
E("FunctionalTools-Codes-GrayCode", "El código de Gray de i es i xor (i >> 1). Dos números consecutivos i e i + 1 difieren en un bloque de bits que termina en el bit menos significativo apagado; al hacer xor con el corrimiento, ese bloque se cancela y solo cambia un bit.",
  ["Confundir el código de Gray con el número binario al imprimir.", "Imprimir sin ceros a la izquierda.", "Recorrer subconjuntos con Gray y olvidar actualizar el estado con el bit que cambió."]);
E("Data-Structures-Algorithms-TwoPointers", "Si al mover el extremo derecho la ventana solo puede empeorar (o mejorar) de forma monótona, el extremo izquierdo nunca necesita retroceder. Cada puntero avanza a lo sumo n veces, así que todo es O(n) aunque haya un while dentro del for.",
  ["Usarlo con números negativos en problemas de suma (la monotonía se rompe).", "Olvidar el caso de ventana vacía.", "Contar mal: el número de subarreglos que terminan en r es r − l + 1."]);
E("Data-Structures-Algorithms-SweepLine", "Al ordenar los eventos, el estado entre dos eventos consecutivos no cambia. Basta con procesarlos en orden y mantener lo que la línea corta en cada momento, en vez de revisar todas las parejas.",
  ["Empates entre un inicio y un final en la misma coordenada: decidir el orden según si los intervalos son abiertos o cerrados.", "Olvidar comprimir coordenadas antes de usar un Fenwick.", "Procesar el evento antes de actualizar la respuesta (o al revés) cuando importa."]);
E("Data-Structures-Algorithms-SparseTable", "Todo rango [l, r] se cubre con dos bloques de largo 2^k (k = ⌊log₂(r − l + 1)⌋) que empiezan en l y terminan en r. Se solapan, pero para operaciones idempotentes como mínimo, máximo o gcd eso no importa.",
  ["Usarla para sumas (los elementos del solape se cuentan dos veces).", "Calcular log₂ con flotantes; mejor precalcular lg[i] o usar __builtin_clz.", "Usarla con actualizaciones (no las soporta)."]);
E("Data-Structures-Algorithms-FenwickTree", "bit[i] guarda la suma de los últimos (i & −i) elementos que terminan en i. Un prefijo se parte en a lo sumo log n de esos tramos quitando el bit menos significativo, y una posición pertenece a a lo sumo log n tramos, que se recorren sumándolo.",
  ["Usar índice 0: i & −i = 0 y el ciclo no termina. El Fenwick va de 1 a n.", "Usarlo para mínimos con actualizaciones arbitrarias (no hay \"resta\").", "Olvidar que para sumar en rangos y consultar puntos se usa el arreglo de diferencias."]);
E("Data-Structures-Algorithms-SegmentTree", "Cada nodo guarda la operación sobre su tramo, y cualquier rango se escribe como la unión de a lo sumo unos 2 log n nodos disjuntos (la descomposición canónica). Funciona para cualquier operación asociativa con neutro, aunque no tenga inversa.",
  ["Tamaño del arreglo: 4n en la versión recursiva.", "Neutro equivocado (0 para mínimos, por ejemplo).", "Operaciones no conmutativas combinadas en el orden equivocado."]);
E("Data-Structures-Algorithms-MoAlgorithm", "Con bloques de tamaño √n y las consultas ordenadas por (bloque de l, r), el puntero derecho se mueve O(n) por bloque (O(n√n) en total) y el izquierdo O(√n) por consulta. Así se responden q consultas en O((n + q)√n) agregando y quitando un elemento a la vez.",
  ["Usarlo con consultas en línea (es offline).", "Agregar y quitar en un orden que deja el estado inconsistente (primero expandir, después contraer).", "Bloques mal elegidos; el truco de alternar el orden de r en bloques pares e impares ayuda bastante."]);
E("Graphs-Algorithms-Graph-Traversal-BFS", "La cola procesa los nodos por capas: todos los de distancia d antes que cualquiera de distancia d + 1. Por eso, la primera vez que se descubre un nodo es por un camino con el mínimo número de aristas.",
  ["Marcar como visitado al sacar de la cola en vez de al meter (un nodo entra muchas veces).", "Usarlo con pesos distintos de 1 (hace falta Dijkstra o 0-1 BFS).", "En cuadrículas, salirse de los bordes."]);
E("Graphs-Algorithms-Graph-Traversal-DFS", "El DFS visita todo lo alcanzable desde el inicio antes de volver, así que cada llamada desde un nodo no visitado descubre exactamente una componente. Cada nodo y arista se procesa una vez: O(n + m).",
  ["Recursión profunda: en Python siempre pila explícita; en C++ cuidado con caminos de 10^6 nodos.", "Olvidar recorrer desde todos los nodos para encontrar todas las componentes.", "En grafos no dirigidos, guardar cada arista en las dos listas."]);
E("Graphs-Algorithms-Graph-Traversal-Dijkstra", "Con pesos no negativos, el nodo con menor distancia tentativa no puede mejorar después: cualquier otro camino pasa por un nodo con distancia mayor o igual. Así que se fija para siempre, y cada arista se relaja una vez.",
  ["Pesos negativos: Dijkstra falla.", "No saltar las entradas viejas de la cola (if d > dist[u] continue): se vuelve O(n·m).", "Usar int para distancias que suman hasta 10^14."]);
E("Graphs-Algorithms-Graph-Traversal-BellmanFord", "Un camino más corto sin ciclos tiene a lo sumo n − 1 aristas, y después de la ronda k las distancias son correctas para todos los caminos de hasta k aristas. Si en la ronda n todavía algo mejora, hay un ciclo negativo alcanzable.",
  ["Relajar desde nodos con distancia infinita (INF + w puede desbordar o \"mejorar\").", "Detectar el ciclo pero no reconstruirlo (hay que retroceder n veces por los padres para caer dentro).", "Confundir \"hay ciclo negativo\" con \"afecta al destino\"."]);
E("Graphs-Algorithms-Graph-Traversal-FloydWarshall", "Después de procesar el nodo intermedio k, dist[i][j] es el mejor camino que solo usa intermedios en {1, …, k}. Agregar k solo puede servir pasando por él una vez: dist[i][k] + dist[k][j].",
  ["Poner el ciclo de k por dentro (debe ser el más externo).", "INF + INF desborda: usar un INF como 10^18 / 4 o revisar antes de sumar.", "Olvidar dist[i][i] = 0 y aristas repetidas (quedarse con la menor)."]);
E("Graphs-Algorithms-Graph-Traversal-TopologicalSort", "Un DAG siempre tiene un nodo sin aristas entrantes; quitarlo deja otro DAG. Kahn repite eso con una cola de nodos de grado de entrada 0. Si al final quedan nodos, había un ciclo.",
  ["No detectar el ciclo (contar los nodos procesados).", "Usar la cola cuando se pide el orden lexicográfico menor (hace falta cola de prioridad).", "Calcular mal los grados con aristas repetidas."]);
E("Graphs-Algorithms-Graph-Traversal-DSU", "Cada conjunto es un árbol y su raíz lo representa. Unir por tamaño mantiene la altura en O(log n) y la compresión de caminos aplana los árboles al buscar; juntas dan O(α(n)) amortizado, prácticamente constante.",
  ["Unir los nodos en vez de sus raíces.", "Olvidar la compresión o la unión por tamaño (puede volverse O(n) por consulta).", "Usarlo para borrar aristas (no lo permite; se trabaja offline al revés)."]);
E("Graphs-Algorithms-MST-Kruskal", "Propiedad del corte: la arista más barata que cruza cualquier corte pertenece a algún árbol de expansión mínima. Al revisar las aristas en orden, cada arista que une dos componentes es la más barata que cruza el corte entre ellas.",
  ["Olvidar revisar si el grafo es conexo (menos de n − 1 aristas usadas).", "Ordenar por el campo equivocado del arreglo de aristas.", "Usar int para el costo total."]);
E("Graphs-Algorithms-MST-Prim", "También usa la propiedad del corte, con el corte entre el árbol construido y el resto: la arista más barata que sale del árbol siempre es segura.",
  ["No saltar las entradas viejas de la cola de prioridad.", "Empezar sin revisar si quedan nodos sin alcanzar.", "Usar Prim con heap en grafos densos dados como matriz (la versión O(n²) sin heap es mejor)."]);
E("Graphs-Algorithms-Trees-BinaryLifting", "Cualquier k se escribe en binario, así que subir k niveles es subir 2^i niveles para cada bit prendido. up[j][v] = up[j−1][up[j−1][v]] se arma en O(n log n).",
  ["Olvidar que el ancestro de la raíz es la raíz (o −1) y salirse del arreglo.", "LOG demasiado pequeño para n.", "Mezclar índices desde 0 y desde 1."]);
E("Graphs-Algorithms-Trees-LCA", "Se igualan las profundidades subiendo el más profundo, y después se suben los dos a la vez con los saltos más grandes que todavía los dejan en nodos distintos; al final, el padre común es el LCA. Funciona porque \"tener el mismo ancestro a altura h\" es monótono en h.",
  ["Devolver un nodo de los dos saltos en vez del padre al final.", "No revisar si después de igualar alturas ya son el mismo nodo.", "Profundidades calculadas con recursión profunda."]);
E("Graphs-Algorithms-Trees-EulerTour", "En un recorrido DFS, el subárbol de u ocupa exactamente las posiciones [tin[u], tout[u]]: todos sus descendientes se visitan entre la entrada y la salida de u. Así una pregunta sobre un subárbol es una pregunta sobre un rango.",
  ["Usar tout como posición de salida cuando se numeró solo la entrada (o al revés).", "Actualizar en la posición del nodo y no en tin[nodo].", "Recursión profunda."]);
E("Strings-Algorithms-KMP-I", "Los bordes de s[0..i] son exactamente π[i], π[π[i] − 1], … Por eso, si una extensión falla, el siguiente candidato es el borde del borde, y el puntero del patrón solo puede bajar tantas veces como subió: O(n + m) amortizado.",
  ["Olvidar el separador # (las coincidencias cruzan del patrón al texto).", "Usar un separador que aparece en el texto.", "Confundir el índice de la aparición (termina en i, empieza en i − m + 1)."]);
E("Strings-Algorithms-KMP-II", "Es la misma función de prefijos, pero guardando cuánto del patrón se lleva emparejado mientras se lee el texto: cada aparición es un momento en que ese largo llega a m.",
  ["No reiniciar al borde después de una coincidencia completa (pierde apariciones solapadas).", "Comparar fuera del patrón cuando j = m.", "Usar strings de C con strlen dentro de un ciclo."]);
E("Strings-Algorithms-ZFunction", "Se mantiene el intervalo [l, r) que llega más a la derecha y coincide con un prefijo. Dentro de él, z[i] es por lo menos min(r − i, z[i − l]), así que solo se compara lo que pasa de r, y r solo avanza: O(n).",
  ["Olvidar z[0] (por convención 0 o n según el problema).", "No acotar con r − i al copiar z[i − l].", "Separador ausente al buscar patrón + texto."]);
E("Strings-Algorithms-RabinKarp", "Se interpreta la cadena como un número en base B módulo M, y el hash de cualquier subcadena sale de dos prefijos en O(1). Si las cadenas son distintas, la probabilidad de que choquen es como mucho largo/M para una base al azar, y con dos módulos (o 2^61 − 1) se vuelve despreciable.",
  ["Base y módulo fijos y conocidos: alguien puede construir un choque (anti-hash). Base aleatoria.", "Usar M = 2^64 implícito con unsigned: existen ataques conocidos (cadenas de Thue–Morse).", "Comparar 10^6 hashes con un solo módulo de 10^9 (paradoja del cumpleaños)."]);
E("Strings-Algorithms-Manacher", "Dentro del palíndromo que llega más a la derecha, el radio en i es por lo menos el de su espejo (limitado por el borde). Solo se expande más allá del borde, y el borde solo avanza, así que todo es O(n).",
  ["Olvidar los palíndromos pares (insertar separadores o calcular dos arreglos).", "Confundir radio con largo (largo = 2·radio − 1 o 2·radio).", "No acotar con el borde al copiar el radio del espejo."]);
E("Strings-Algorithms-SuffixArray", "Ordenar por los primeros 2^(k+1) caracteres es ordenar pares (rango de los primeros 2^k, rango de los siguientes 2^k), y esos rangos ya se conocen de la ronda anterior. Tras log n rondas todos los sufijos quedan ordenados.",
  ["Olvidar el carácter centinela o tratar mal los sufijos que se acaban.", "Recalcular rangos sin agrupar los iguales.", "Usar sort con comparaciones de cadenas completas (O(n² log n))."]);
E("Geometry-Point", "El producto cruz de A y B es |A|·|B|·sen θ: su signo dice si B está a la izquierda o a la derecha de A y su valor es el área del paralelogramo. El producto punto es |A|·|B|·cos θ: su signo dice si el ángulo es agudo u obtuso.",
  ["Usar flotantes cuando las coordenadas son enteras.", "Confundir el orden: A × B = −(B × A).", "Desbordar int con coordenadas hasta 10^9."]);
E("Geometry-Shoelace", "Cada término x_i·y_{i+1} − x_{i+1}·y_i es el doble del área con signo del triángulo (origen, P_i, P_{i+1}); sumando, las partes fuera del polígono se cancelan y queda el doble del área con signo.",
  ["Olvidar cerrar el polígono (el término de P_n con P_1).", "Dividir por 2 con enteros y perder el .5: imprimir 2A o usar el bit de paridad.", "Tomar el valor sin abs cuando la orientación no se conoce."]);
E("Geometry-PointInPolygon", "Por el teorema de la curva de Jordan, un rayo desde un punto interior cruza el borde un número impar de veces. Contando con cuidado los vértices (la regla \"un extremo arriba y el otro abajo\") cada cruce se cuenta exactamente una vez.",
  ["No revisar primero si el punto está sobre el borde.", "Contar dos veces un cruce por un vértice.", "Usar flotantes con tolerancias cuando todo es entero."]);
E("Geometry-ConvexHull", "Un punto está en la envolvente si y solo si no queda dentro de un triángulo de otros tres. Al recorrer los puntos ordenados, un giro en el sentido equivocado muestra que el punto del medio queda dentro y nunca volverá a servir: cada punto entra y sale de la pila una vez.",
  ["Puntos colineales: decidir si se incluyen y tratar el último tramo (como en el código).", "Puntos repetidos.", "Comparar ángulos con atan2 en vez de producto cruz."]);
E("Geometry-ClosestPair", "Si la mejor distancia hasta ahora es d, dentro de un rectángulo de d × 2d solo caben O(1) puntos a distancia ≥ d entre sí, así que cada punto se compara con un número constante de vecinos de la franja.",
  ["Comparar distancias con raíz en vez de al cuadrado.", "Puntos repetidos (la respuesta es 0).", "Mantener la franja con un set ordenado por x en vez de por y."]);
E("DP-Algorithms-Kadane1D", "El mejor subarreglo que termina en i es a[i] solo o a[i] más el mejor que termina en i − 1: si este último es negativo, conviene empezar de nuevo. La respuesta es el máximo sobre todos los finales.",
  ["Inicializar la respuesta en 0 cuando todos los números son negativos y se exige al menos un elemento.", "Usar int con sumas de hasta 2·10^14.", "Reiniciar en < 0 vs ≤ 0 cuando se pide el subarreglo más corto o más largo."]);
E("DP-Algorithms-LIS-II", "d[k] = el menor final posible de una subsecuencia creciente de largo k + 1. Ese arreglo siempre está ordenado, así que cada número nuevo reemplaza al primer d[k] ≥ x (lower_bound) o se agrega al final. El largo de d es la respuesta.",
  ["Usar upper_bound cuando se pide estrictamente creciente (o lower_bound para no decreciente).", "Creer que d es la subsecuencia (solo su largo es correcto).", "Reconstruir sin guardar padres."]);
E("DP-Algorithms-Knapsack", "dp[w] = la mejor página total con presupuesto w usando los libros vistos. Recorrer w de mayor a menor asegura que dp[w − precio] todavía no incluye el libro actual: cada libro se usa a lo sumo una vez.",
  ["Recorrer w de menor a mayor (eso es la mochila sin límite de copias).", "Tablas 2D innecesarias que no caben en memoria.", "Usar la mochila cuando W es 10^9 (hay que cambiar de dimensión: valor en vez de peso)."]);

// ---------- Segunda tanda: el resto de las lecciones ----------
E("DP-Algorithms-BitmaskDP", "Cada subconjunto es un número de n bits, así que todos los estados caben en un arreglo de tamaño 2^n y se pueden recorrer en orden creciente: un subconjunto siempre es menor que cualquier superconjunto, así que sus estados ya están calculados.",
  ["Usar bitmask con n > 20–22: 2^n ya no cabe.", "Precedencia de operadores: escribir (mask >> i) & 1 con paréntesis.", "Recorrer los subconjuntos de cada máscara con un ciclo de 2^n en vez de sub = (sub − 1) & mask."]);
E("DP-Algorithms-CoinChange", "Una forma óptima de pagar x termina con alguna moneda c, y lo que queda (x − c) también debe pagarse de forma óptima (principio de optimalidad). Por eso basta probar la última moneda.",
  ["Inicializar con 0 en vez de infinito y obtener siempre 0.", "Sumar 1 a infinito y desbordar.", "Pensar que la estrategia golosa (la moneda más grande) siempre funciona: falla con monedas 1, 3, 4 y x = 6."]);
E("DP-Algorithms-CoinCombinations", "Cada forma de pagar x se clasifica por su última moneda, y las clases no se solapan: sumando las formas de x − c sobre todas las monedas se cuenta cada forma una vez. Con las monedas por fuera, se cuentan combinaciones sin orden (cada moneda solo puede ir después de las anteriores).",
  ["Confundir el orden de los ciclos (cuenta ordenaciones o combinaciones).", "Olvidar el módulo en cada suma.", "Inicializar dp[0] = 0 en vez de 1."]);
E("DP-Algorithms-EditDistance", "En un alineamiento óptimo, la última columna es una de tres cosas: borrar la última letra de a, insertar la última de b, o emparejar las dos últimas (gratis si son iguales, 1 si no). Eso deja un problema más pequeño del mismo tipo.",
  ["Olvidar los casos base (convertir en la cadena vacía cuesta su largo).", "Usar una tabla n × m de long long con 5000 × 5000 (200 MB); basta int o dos filas.", "Confundir los índices desplazados en 1 de la tabla y de las cadenas."]);
E("DP-Algorithms-Kadane2D", "Todo rectángulo queda determinado por su fila de arriba, su fila de abajo y sus columnas. Fijando las filas, la suma del rectángulo es la suma de un tramo del arreglo de sumas por columna, y el mejor tramo es Kadane. O(n²·m) en total.",
  ["Recalcular las sumas por columna desde cero para cada par de filas (súmalas al bajar la fila de abajo).", "Elegir el lado largo como el de las filas (conviene que las filas sean la dimensión menor).", "Mismos errores de Kadane con todos negativos."]);
E("DP-Algorithms-LCS", "Si las últimas letras coinciden, alguna LCS óptima las usa juntas; si no, alguna LCS no usa al menos una de ellas, así que se puede quitar. Cada caso reduce el problema a prefijos más cortos.",
  ["Reconstruir la subsecuencia sin seguir el camino correcto en la tabla.", "Memoria cuadrática cuando solo se pide el largo (bastan dos filas).", "Confundir subsecuencia con subcadena (contigua)."]);
E("DP-Algorithms-LIS-I", "La mejor subsecuencia creciente que termina en i se arma con la mejor que termina en algún j < i con a[j] < a[i], más a[i]. Probando todos los j se cubren todos los casos: O(n²).",
  ["Usar ≤ en vez de < (o al revés) según si se pide estrictamente creciente.", "Responder dp[n − 1] en vez del máximo de todos.", "Usarla con n = 2·10^5 (hace falta la versión O(n log n))."]);
E("DP-Classic-Problems-Counting-Numbers", "Todo número ≤ x coincide con x en un prefijo y luego tiene un dígito menor (o es x). Una vez que es menor, el resto se puede llenar libremente respetando solo la regla de vecinos distintos, y eso se memoriza por (posición, último dígito).",
  ["Ceros a la izquierda: \"00\" no rompe la regla, porque no es parte del número.", "Calcular f(a − 1) con a = 0.", "Memorizar estados que dependen del límite."]);
E("DP-Classic-Problems-Dice-Combinations", "Cada secuencia de dados que suma n se clasifica por el valor del último dado (1 a 6), y quitando ese dado queda una secuencia que suma n − k. Las clases no se solapan: dp[n] = Σ dp[n − k].",
  ["Olvidar dp[0] = 1 (la secuencia vacía).", "Indices negativos para n < 6.", "No aplicar el módulo."]);
E("DP-Classic-Problems-Grid-Paths-I", "Todo camino que llega a una celda viene de la de arriba o de la de la izquierda, y esos dos conjuntos de caminos no se repiten. Las trampas simplemente valen 0.",
  ["Olvidar que la celda inicial puede ser trampa (respuesta 0).", "Recorrer la cuadrícula en un orden en que la celda de arriba aún no está calculada.", "No aplicar el módulo."]);
E("DP-Classic-Problems-Money-Sums", "Es la mochila de existencia: después de procesar las primeras k monedas, el bit s está prendido si alguna selección de ellas suma s. Agregar la moneda x da los viejos más los viejos corridos x posiciones.",
  ["Recorrer s de menor a mayor con un arreglo booleano (usaría la misma moneda varias veces).", "Imprimir también la suma 0.", "Tamaño del bitset menor que la suma total."]);
E("DP-Classic-Problems-Removal-Game", "Juego de suma cero: lo que gana uno lo pierde el otro. Si dp[l][r] es la ventaja del que mueve en [l, r], al tomar un extremo gana ese número y le deja al rival la ventaja del tramo restante: dp = max(a[l] − dp[l+1][r], a[r] − dp[l][r−1]). El puntaje del primero es (total + dp[0][n−1]) / 2.",
  ["Guardar el puntaje propio en vez de la ventaja y equivocarse en la recursión.", "Recorrer los intervalos por inicio en vez de por largo.", "Desbordar int al sumar."]);
E("Data-Structures-Algorithms-Deque", "Una deque guarda los elementos en bloques de memoria con un índice central, así que agregar o quitar en cualquiera de los dos extremos es O(1). Es la base de la ventana deslizante y del 0-1 BFS.",
  ["Usar list.pop(0) en Python (es O(n)); usar collections.deque.", "Acceder al frente de una deque vacía.", "En la ventana deslizante, guardar valores en vez de índices y no poder saber cuándo sale uno."]);
E("Data-Structures-Algorithms-Heap", "El heap es un árbol completo guardado en un arreglo donde cada padre es menor o igual que sus hijos. Al insertar se sube el elemento y al sacar el mínimo se baja el último, y la altura es log n.",
  ["En C++, priority_queue es de máximos; para mínimos usar greater<> o guardar el negativo.", "En Python, heapq es de mínimos; para máximos guardar −x.", "Intentar borrar un elemento del medio (se usa borrado perezoso)."]);
E("Data-Structures-Algorithms-LazySegmentTree", "Una actualización de rango se aplica entera a los O(log n) nodos que forman la descomposición canónica del rango, y se anota como pendiente. Antes de visitar los hijos de un nodo se empuja la marca. Así cada operación toca O(log n) nodos.",
  ["Olvidar empujar la marca antes de bajar.", "Componer mal dos marcas (asignar y luego sumar, o al revés).", "Al aplicar una suma a un nodo de suma, olvidar multiplicar por el largo del tramo."]);
E("Data-Structures-Algorithms-Stack", "Una pila solo toca el último elemento, así que meter y sacar son O(1). En problemas de \"el anterior más pequeño\", cada elemento entra y sale una sola vez, así que una pila monótona cuesta O(n) aunque tenga un while adentro.",
  ["Leer el tope de una pila vacía.", "Guardar valores cuando se necesitan índices.", "Usar < o ≤ en la pila monótona según cómo se traten los empates."]);
E("Data-Structures-Classic-Problems-Forest-Queries", "p[i][j] cuenta los árboles del rectángulo desde (1, 1) hasta (i, j). Un rectángulo cualquiera es el grande menos dos franjas, más la esquina que se restó dos veces: inclusión-exclusión.",
  ["Índices desplazados: usar prefijos desde 1 con una fila y columna de ceros.", "Olvidar sumar la esquina p[y1−1][x1−1].", "Leer la cuadrícula carácter por carácter con lecturas lentas."]);
E("Data-Structures-Classic-Problems-Hotel-Queries", "El nodo guarda el máximo de su tramo. Si el hijo izquierdo tiene un hotel con espacio suficiente, el primero está ahí; si no, está en el derecho. Se baja por un solo camino: O(log n) por grupo.",
  ["Hacer búsqueda binaria con consultas de rango (O(log² n)) cuando se puede bajar directo.", "Olvidar restar los cuartos y actualizar los máximos hacia arriba.", "Imprimir 0 cuando no hay hotel con espacio (revisar la raíz primero)."]);
E("Data-Structures-Classic-Problems-K-Smallest-Sums", "Las sumas forman listas ordenadas implícitas; la siguiente menor siempre es la siguiente de alguna lista ya usada. El heap guarda solo el frente de cada lista, así que nunca se generan todas las n² sumas.",
  ["Meter todas las sumas al heap (memoria y tiempo cuadráticos).", "Generar la misma suma por dos caminos (usar un conjunto de visitados o un orden de expansión fijo).", "Olvidar ordenar los arreglos de entrada."]);
E("Data-Structures-Classic-Problems-Prefix-Sum-Queries", "El mejor prefijo de la unión de dos tramos es el mejor del izquierdo, o toda la suma del izquierdo más el mejor del derecho. Esa combinación es asociativa, que es lo único que necesita el Segment Tree.",
  ["Combinar en el orden equivocado (la operación no es conmutativa).", "Usar el mejor prefijo no vacío cuando se permite el vacío (o al revés).", "Neutro mal definido para nodos fuera del rango."]);
E("Data-Structures-Classic-Problems-Range-Update-Queries", "Si d es el arreglo de diferencias, el valor de x_k es la suma de d[1..k]. Sumar u a [a, b] cambia solo d[a] (+u) y d[b+1] (−u), y el valor en k sale de una suma de prefijo con Fenwick.",
  ["Olvidar que d[b + 1] puede estar fuera del arreglo (reservar n + 2).", "Sumar el valor inicial dos veces.", "Usar int para valores que llegan a 10^14."]);
E("Data-Structures-Classic-Problems-Static-Range-Sum-Queries", "La suma de [a, b] es la de [1, b] menos la de [1, a − 1]; los prefijos se calculan una vez en O(n) y cada consulta es una resta.",
  ["Prefijos de int que desbordan.", "Confundir índices desde 0 y desde 1.", "Lectura lenta en Python (usar sys.stdin)."]);
E("Data-Structures-Classic-Problems-Team-Queue", "La fila de equipos es una cola de colas: cada equipo mantiene el orden de sus miembros y la cola principal mantiene el orden de los equipos. Entrar y salir son O(1).",
  ["Olvidar sacar al equipo de la cola principal cuando se vacía.", "Buscar el equipo de cada persona recorriendo listas en vez de un mapa.", "Reiniciar mal las estructuras entre casos de prueba."]);
E("Graphs-Algorithms-Flow-Algorithms-BipartiteMatching", "Un emparejamiento es máximo si y solo si no existe un camino aumentante (teorema de Berge). Kuhn busca uno desde cada vértice libre con DFS, reacomodando parejas por el camino: O(V·E).",
  ["No reiniciar el arreglo de visitados antes de cada búsqueda.", "Usarlo con 10^5 vértices (mejor Hopcroft-Karp).", "Mezclar índices de izquierda y derecha en un solo arreglo."]);
E("Graphs-Algorithms-Flow-Algorithms-Dinic", "Cada fase aumenta estrictamente la distancia de s a t en el residual, así que hay a lo sumo V fases, y una fase (flujo bloqueante con punteros por nodo) cuesta O(V·E). En redes con capacidades 1 son O(√V) fases.",
  ["No guardar el índice de arista por nodo (it[u]): la fase deja de ser O(VE).", "Olvidar la arista inversa con capacidad 0.", "Recursión profunda con muchos nodos en Python."]);
E("Graphs-Algorithms-Flow-Algorithms-EdmondsKarp", "Usar siempre el camino aumentante más corto (BFS) hace que las distancias en el residual nunca bajen, y cada arista puede ser cuello de botella O(V) veces. En total O(V·E) aumentos de O(E): O(V·E²), sin importar las capacidades.",
  ["Usar DFS (Ford-Fulkerson) con capacidades grandes: puede tardar tanto como el valor del flujo.", "Olvidar actualizar la arista inversa.", "Aristas no dirigidas modeladas con una sola dirección."]);
E("Graphs-Algorithms-Flow-Algorithms-MinCostAnyFlow", "Aumentar siempre por el camino más barato del residual mantiene un flujo de costo mínimo para la cantidad enviada hasta ese momento (no aparecen ciclos negativos en el residual). Por eso, parar exactamente al llegar a K da el costo mínimo para K unidades.",
  ["Enviar el cuello de botella completo del último camino y pasarse de K.", "No detectar que el flujo máximo es menor que K (imposible).", "Usar Dijkstra sin potenciales cuando hay costos negativos."]);
E("Graphs-Algorithms-Flow-Algorithms-MinCostMaxFlow", "Un flujo tiene costo mínimo para su valor si y solo si el residual no tiene ciclos de costo negativo. Aumentar por caminos más baratos conserva esa propiedad. Con potenciales (Johnson) los costos reducidos son no negativos y se puede usar Dijkstra.",
  ["Usar Dijkstra con costos negativos sin inicializar los potenciales con Bellman-Ford.", "Olvidar que la arista inversa tiene costo −c.", "Desbordar costo · flujo."]);
E("Graphs-Algorithms-Graph-Traversal-Bipartite", "Un grafo es bipartito si y solo si no tiene ciclos de largo impar. El BFS colorea por paridad de la distancia, y una arista entre dos nodos del mismo color cierra justamente un ciclo impar.",
  ["Revisar solo la componente del nodo 1 (hay que recorrerlas todas).", "Colorear al sacar de la cola en vez de al meter.", "Usar recursión profunda."]);
E("Graphs-Algorithms-Graph-Traversal-Diameter", "En un árbol, el nodo más lejano de cualquier nodo es un extremo de algún diámetro: si no lo fuera, combinando caminos se armaría uno más largo que el diámetro. Por eso dos BFS bastan.",
  ["Aplicarlo en grafos que no son árboles (no vale).", "Con pesos negativos tampoco vale.", "Contar nodos en vez de aristas."]);
E("Graphs-Algorithms-Graph-Traversal-EulerianCycle", "Un grafo conexo tiene un ciclo euleriano si y solo si todos los grados son pares. Hierholzer avanza por aristas sin usar hasta trabarse (solo puede trabarse en el inicio) y va pegando los ciclos al volver; cada arista se usa una vez: O(m).",
  ["Olvidar verificar que todas las aristas quedaron en el recorrido (grafo no conexo).", "Marcar la arista usada en un solo sentido en grafos no dirigidos.", "Borrar de la lista de adyacencia en O(n) por arista."]);
E("Graphs-Algorithms-Graph-Traversal-HierholzerDirected", "En un grafo dirigido, existe un camino euleriano de s a t si cada nodo tiene grado de entrada igual al de salida, salvo s (sale uno más) y t (entra uno más), y todas las aristas son alcanzables. Hierholzer construye el recorrido al revés al retroceder.",
  ["No revisar la condición de grados antes.", "Imprimir el camino sin invertirlo.", "Olvidar que la cantidad de aristas recorridas debe ser m."]);
E("Graphs-Algorithms-Graph-Traversal-Kosaraju", "El nodo que termina último en la primera DFS está en una componente \"fuente\" del grafo de componentes. En el grafo invertido esa componente se vuelve sumidero, así que la segunda DFS desde él no puede escaparse de su componente.",
  ["Hacer la segunda DFS en el grafo original.", "Usar el orden de descubrimiento en vez del de salida.", "Recursión profunda: usar pila explícita."]);
E("Graphs-Algorithms-Graph-Traversal-Tarjan", "low[v] es el menor tiempo de descubrimiento alcanzable desde el subárbol DFS de v con una arista hacia un nodo que todavía está en la pila. Si low[v] = tin[v], nada del subárbol sale de v hacia arriba: v es la raíz de una componente y se saca de la pila todo lo que está encima.",
  ["Usar aristas hacia nodos ya asignados a otra componente para bajar low.", "Olvidar quitar el nodo de la pila (marca onStack).", "Recursión profunda."]);
E("Graphs-Algorithms-Miscellaneous-2-SAT", "Cada cláusula a ∨ b equivale a ¬a → b y ¬b → a. Hay contradicción exactamente cuando x y ¬x están en la misma componente fuerte. Si no, asignar a cada variable el literal cuya componente va después en orden topológico nunca viola una implicación.",
  ["Equivocarse con la numeración de x y ¬x.", "Agregar solo una de las dos implicaciones.", "Invertir el criterio de la asignación (comparar los números de componente al revés)."]);
E("Graphs-Algorithms-Miscellaneous-CycleFindingDirected", "En una DFS de un grafo dirigido, hay un ciclo si y solo si aparece una arista hacia un nodo que está en el camino actual (\"gris\"). Las aristas a nodos ya terminados (\"negros\") no forman ciclo.",
  ["Usar un solo booleano de visitado (confunde gris con negro).", "Reconstruir el ciclo sin seguir los padres desde el nodo actual.", "Recursión profunda."]);
E("Graphs-Algorithms-Miscellaneous-CycleFindingUndirected", "En un grafo no dirigido, la DFS solo tiene aristas de árbol y de retroceso. Cualquier arista hacia un nodo visitado que no sea el padre es de retroceso y cierra un ciclo con el camino del árbol.",
  ["Considerar al padre como ciclo (la arista de ida y vuelta).", "Con aristas repetidas, comparar por nodo y no por arista.", "Olvidar recorrer todas las componentes."]);
E("Graphs-Algorithms-Trees-Centroid", "Si un nodo tiene un hijo con más de n/2 nodos, moverse a ese hijo reduce el tamaño de la parte más grande. Ese movimiento solo puede ocurrir hacia el lado pesado y termina, y el nodo donde termina tiene todas sus partes ≤ n/2.",
  ["Olvidar contar la parte \"de arriba\" (n − sz[u]).", "Recursión profunda al calcular tamaños.", "Pensar que el centroide es único (puede haber dos)."]);
E("Graphs-Algorithms-Trees-CentroidDecomposition", "Al quitar el centroide, cada parte tiene a lo sumo la mitad de los nodos, así que cada nodo está en O(log n) niveles. Cada camino pasa por exactamente un centroide: el primero que lo corta. Contar por centroide no repite caminos.",
  ["Contar dos veces los caminos que se quedan en un mismo subárbol (hay que restarlos o procesar hijo por hijo).", "Volver a entrar en nodos ya eliminados.", "Recalcular tamaños con recursión profunda."]);
E("Graphs-Algorithms-Trees-TreeDistances", "Por la propiedad del diámetro, el nodo más lejano de cualquier v es uno de los dos extremos A o B. Con un BFS desde cada extremo, la respuesta de v es max(dA[v], dB[v]).",
  ["Usar un solo extremo.", "Hacer un BFS desde cada nodo (O(n²)).", "Encontrar mal los extremos (el primer BFS debe salir de cualquier nodo y el segundo del más lejano)."]);
E("Graphs-Algorithms-Trees-TreeIsomorphism", "El centro de un árbol (uno o dos centroides) es invariante: un isomorfismo debe mandar centroide a centroide. Así que basta comparar las formas canónicas con raíz en los centroides de cada árbol.",
  ["Probar solo un centroide cuando el otro árbol tiene dos.", "Comparar listas de hijos sin ordenarlas.", "Hash de forma con colisiones (mejor asignar identificadores a las tuplas ordenadas)."]);
E("Graphs-Algorithms-Trees-TreeIsomorphismRooted", "Dos árboles con raíz son iguales si y solo si sus raíces tienen el mismo multiconjunto de subárboles hijos. Dando un número a cada multiconjunto ordenado (con un mapa), los números de las raíces coinciden exactamente cuando los árboles son isomorfos.",
  ["No ordenar los identificadores de los hijos.", "Reiniciar el mapa entre los dos árboles (deben compartirlo).", "Recursión profunda."]);
E("Graphs-Classic-Problems-Counting-Rooms", "Cada recorrido iniciado en un piso no visitado visita exactamente su cuarto completo (su componente conexa), así que el número de recorridos es el número de cuartos.",
  ["Recursión profunda en una cuadrícula de 10^6 celdas.", "Salirse de los bordes.", "Marcar visitado al sacar de la cola en vez de al meter."]);
E("Graphs-Classic-Problems-Flight-Discount", "El camino óptimo usa el cupón en exactamente una arista a → b. Lo mejor antes de ella es d1[a] (desde 1) y lo mejor después es dn[b] (hasta n, calculado en el grafo invertido). Probar todas las aristas da la respuesta.",
  ["Correr el segundo Dijkstra en el grafo original.", "Dividir c entre 2 con redondeo distinto al que pide el problema (es ⌊c/2⌋).", "Sumar infinitos y desbordar."]);
E("Graphs-Classic-Problems-Labyrinth", "El BFS encuentra el camino más corto, y cada celda recuerda desde qué dirección se llegó por primera vez. Siguiendo esas direcciones desde B se reconstruye el camino al revés.",
  ["Imprimir el camino sin invertirlo.", "Guardar el camino completo en cada celda (memoria enorme).", "Lectura lenta de la cuadrícula."]);
E("Graphs-Classic-Problems-Longest-Flight-Route", "En un DAG, el orden topológico garantiza que al procesar un nodo ya se conoce el mejor camino hasta todos sus predecesores. El camino más largo es entonces una DP; en grafos con ciclos el problema es NP-difícil.",
  ["Usar Dijkstra con pesos negativos para el camino más largo.", "Inicializar todos en 0 (los nodos no alcanzables desde 1 no deben contar).", "Reconstruir sin guardar el padre."]);
E("Graphs-Classic-Problems-Subordinates", "Los subordinados de un empleado son los nodos de su subárbol menos él. Procesando en orden inverso al DFS (hijos antes que padres), cada tamaño se suma al del jefe una vez: O(n).",
  ["Recursión profunda (la jerarquía puede ser una línea).", "Contar al propio empleado.", "Recorrer desde cada empleado (O(n²))."]);
E("Strings-Algorithms-MinimalRotation", "Con dos candidatos i < j y k caracteres iguales, si s[i+k] > s[j+k], ninguna rotación que empiece entre i e i + k puede ser la mínima (cada una tiene una equivalente mejor que empieza k − t después de j). Así se descartan bloques enteros y el total es O(n).",
  ["Olvidar trabajar sobre s + s (o índices módulo n).", "Que i y j queden iguales (hay que mover j).", "Cadenas con todos los caracteres iguales."]);
E("Strings-Algorithms-PrefixTrie", "Las palabras que comparten un prefijo comparten el camino de ese prefijo, así que buscar o insertar cuesta solo el largo de la palabra y el trie tiene a lo sumo (suma de largos + 1) nodos.",
  ["Arreglos de 26 hijos por nodo con 10^6 nodos en Python (usar diccionarios).", "Olvidar marcar el fin de palabra.", "Con DP, recorrer el trie desde cada posición sin cortar cuando no hay hijo."]);
E("Strings-Classic-Problems-Distinct-Subsequences", "Agregar una letra c duplica las subsecuencias (cada una con o sin c al final), pero las que terminan en c y ya existían se cuentan dos veces: son exactamente las que se formaron la vez anterior que apareció c, y se restan.",
  ["Restar sin sumar el módulo y quedar negativo.", "Contar o no la subsecuencia vacía según lo que pida el problema.", "Guardar la última aparición antes de actualizarla."]);
E("Strings-Classic-Problems-Finding-Borders", "Si b es el borde más largo de s, todo borde más corto de s es también borde de b. Por eso los bordes son π[n−1], π[π[n−1] − 1], …: siguiendo la cadena de la función de prefijos se obtienen todos.",
  ["Incluir la propia cadena como borde.", "Imprimirlos en orden decreciente cuando se piden crecientes.", "Calcular π con un algoritmo O(n²)."]);
E("Strings-Classic-Problems-Finding-Periods", "p es periodo si s[i] = s[i + p] para todo i, es decir, si el sufijo que empieza en p coincide con un prefijo hasta el final: z[p] = n − p. El propio n siempre es periodo.",
  ["Olvidar el periodo n.", "Pedir que p divida a n (aquí no hace falta).", "Usar z[0]."]);
E("Strings-Classic-Problems-Repeating-Substring", "Una subcadena que aparece dos veces es prefijo común de dos sufijos. Entre todos los pares de sufijos, el mayor prefijo común se da entre vecinos en el orden del suffix array, que es el máximo del arreglo LCP.",
  ["Imprimir −1 cuando no hay repetidas (LCP máximo 0).", "Calcular el LCP con comparaciones directas (O(n²)); usar Kasai.", "Confundir posición en el SA con posición en la cadena."]);
E("Strings-Classic-Problems-Required-Substring", "Mientras se escribe la cadena, lo único que importa para saber si el patrón aparecerá es cuánto del patrón coincide con el final de lo escrito: eso es un estado del autómata de KMP. Se cuentan las cadenas que nunca llegan al estado m y se restan de 26^n.",
  ["Contar directamente las que contienen el patrón y contar dos veces las que lo contienen varias veces.", "Construir el autómata con O(m²·26) cuando se puede en O(m·26).", "Olvidar el módulo en la resta."]);
E("Geometry-PolygonLatticePoints", "Pick: para un polígono simple con vértices enteros, A = I + B/2 − 1. B se cuenta lado por lado con gcd(|dx|, |dy|), y 2A sale exacto del Shoelace; despejando, I = (2A − B + 2)/2 sin fracciones.",
  ["Dividir el área entre 2 antes de tiempo y perder el .5.", "Contar dos veces los vértices en B.", "Aplicarlo a polígonos con huecos o con vértices no enteros."]);
E("Geometry-SegmentIntersection", "Si los extremos de cada segmento están en lados estrictamente opuestos del otro, los segmentos se cruzan. Si alguna orientación es 0, un extremo está sobre la recta del otro y hay que revisar que esté dentro de su caja.",
  ["Olvidar el chequeo de cajas con colineales (segmentos alineados pero separados).", "Usar flotantes con coordenadas enteras.", "Desbordar el producto cruz con coordenadas de 10^9 en int."]);
E("Geometry-Classic-Problems-Area-of-Rectangles", "Entre dos eventos consecutivos en x, el conjunto de rectángulos que corta la recta no cambia, así que el área de esa franja es (ancho) · (largo cubierto en y). El Segment Tree mantiene ese largo con un contador de coberturas por nodo, sin propagación.",
  ["Olvidar comprimir las coordenadas y.", "Confundir celdas con puntos al comprimir (los tramos van entre coordenadas consecutivas).", "Usar int para el área."]);
E("Geometry-Classic-Problems-Intersection-Points", "Un vertical en x corta a los horizontales que están activos en x y cuya altura está en su rango. Ordenando los eventos por x (inicios antes que verticales antes que finales), un Fenwick sobre alturas cuenta esos horizontales en O(log n).",
  ["Orden de eventos con igual x (define si cuentan los extremos).", "No comprimir las alturas.", "Usar int para el total (hasta 10^10)."]);
E("Geometry-Classic-Problems-Lines-and-Queries-I", "Dos rectas se cruzan a lo sumo una vez. En cada nodo se deja la que gana en el punto medio; la perdedora solo puede ganar en una de las dos mitades, así que baja por una sola rama: O(log C) por inserción y por consulta.",
  ["Elegir la mitad equivocada para la perdedora.", "Rango de x mal definido (las consultas deben caer en el rango del árbol).", "Desbordar m·x + b."]);
E("Geometry-Classic-Problems-Maximum-Manhattan-Distances", "|dx| + |dy| = max(|du|, |dv|) con u = x + y y v = x − y (se prueba con los cuatro signos posibles). Así la distancia máxima a todos los puntos depende solo del máximo y del mínimo de u y de v.",
  ["Olvidar alguno de los cuatro casos de signo.", "Usar int para u y v.", "Pensar que el truco vale para distancia euclidiana."]);
E("Geometry-Classic-Problems-Point-Location-Test", "El producto cruz de (p2 − p1) y (p3 − p1) es el doble del área con signo del triángulo; es positivo si el giro p1 → p2 → p3 es antihorario (izquierda), negativo si es horario y cero si son colineales.",
  ["Usar int con coordenadas de 10^9.", "Invertir el orden de los vectores (cambia el signo).", "Usar flotantes y una tolerancia innecesaria."]);
E("FunctionalTools-Classic-Problems-Array-Division", "Si se puede partir con suma máxima L, también con cualquier L' ≥ L: la condición es monótona. Para un L fijo, lo mejor es llenar cada tramo lo más posible (golosa), y si así hacen falta más de k tramos, L no alcanza.",
  ["Límite inferior menor que el elemento más grande.", "Contar mal los tramos (empezar en 1 y no en 0).", "Usar int para la suma total."]);
E("FunctionalTools-Classic-Problems-Counting-Divisors", "Si x = p₁^e₁ ⋯ p_k^e_k, cada divisor elige independientemente un exponente de 0 a e_i para cada primo: (e₁ + 1)⋯(e_k + 1). La criba del menor factor primo factoriza x en O(log x) divisiones.",
  ["Probar divisores hasta √x para cada número (puede ser lento con 10^5 números).", "Olvidar el último primo cuando queda x > 1.", "Tamaño de la criba menor que el máximo x."]);
E("FunctionalTools-Classic-Problems-Distributing-Apples", "Un reparto es una fila de m estrellas (manzanas) y n − 1 barras (separadores entre niños). Cada fila distinta es un reparto distinto, y hay C(m + n − 1, n − 1) formas de elegir las posiciones de las barras.",
  ["Usar C(m − 1, n − 1) (eso es si cada niño recibe al menos una).", "Precalcular factoriales hasta un tamaño insuficiente (hace falta m + n).", "Dividir en vez de multiplicar por inversos modulares."]);
E("FunctionalTools-Classic-Problems-Exponentiation", "a^b = (a^(b/2))² si b es par y a·a^(b−1) si es impar. Recorriendo los bits de b se hacen O(log b) multiplicaciones, en vez de b.",
  ["0^0: el problema suele pedir 1.", "Multiplicar sin módulo y desbordar.", "Usar pow de flotantes (pierde precisión)."]);
E("FunctionalTools-Classic-Problems-Prime-Multiples", "Los números ≤ n divisibles por todos los primos de un subconjunto S son ⌊n / Π S⌋. Inclusión-exclusión suma los de tamaño impar y resta los de tamaño par, y cada número divisible por al menos un primo se cuenta exactamente una vez.",
  ["Desbordar el producto de primos (cortar si supera n).", "Equivocar el signo.", "Recorrer 2^k subconjuntos con k grande (aquí k ≤ 20)."]);
E("FunctionalTools-Codes-TS", "Si f es estrictamente unimodal, al comparar f(m1) y f(m2) el pico no puede estar en el tercio donde está el punto peor, así que se descarta y el intervalo se multiplica por 2/3 en cada paso.",
  ["Aplicarla a funciones con tramos planos.", "En enteros, terminar cuando hi − lo < 3 y revisar los que quedan.", "Iterar comparando con eps cuando conviene un número fijo de iteraciones."]);
E("Probability-Algorithms-ExpectedMaximum", "El máximo es ≤ m si y solo si todos son ≤ m, y por independencia P(máx ≤ m) = (m/k)^n. Restando P(máx ≤ m − 1) se obtiene P(máx = m), y E = Σ m·P(máx = m).",
  ["Pensar que E[máx] = máx de las esperanzas.", "Errores de precisión con potencias grandes (usar pow en flotante, no multiplicar n veces).", "Redondear distinto de lo que pide el problema."]);
E("Probability-Algorithms-LinearityOfExpectation", "La esperanza es lineal para cualquier conjunto de variables, aunque dependan entre sí. Escribir el total como suma de indicadores (uno por par) convierte la esperanza en una suma de probabilidades, y cada probabilidad solo involucra dos variables.",
  ["Suponer que también la varianza es lineal sin independencia.", "Multiplicar probabilidades de eventos que no son independientes.", "Olvidar los pares con probabilidad 0 o 1."]);
E("Probability-Algorithms-MarkovChain", "El futuro de una cadena de Markov solo depende del estado actual. Por eso la distribución tras un paso es la anterior multiplicada por la matriz de transición, y tras k pasos por la matriz a la k.",
  ["Multiplicar en el orden equivocado (fila por matriz vs matriz por columna).", "Filas de la matriz que no suman 1 (en bordes con menos vecinos).", "Usar exponenciación de matrices con estados innecesariamente grandes."]);
E("Probability-Algorithms-ModularExpectation", "Las operaciones con fracciones p/q (sumar, multiplicar) dan el mismo resultado si se hacen módulo un primo, reemplazando cada división por el inverso modular, siempre que los denominadores no sean múltiplos del primo.",
  ["Calcular con flotantes y convertir al final.", "Dividir con / en vez de multiplicar por el inverso.", "Denominador múltiplo del módulo (no tiene inverso)."]);
E("Probability-Algorithms-ProbabilityDP", "Por la regla de la probabilidad total, la probabilidad de un estado es la suma, sobre los estados anteriores, de su probabilidad por la probabilidad de la transición. Como los estados avanzan en un orden (número de dados lanzados), es una DP.",
  ["Olvidar que las transiciones de cada estado deben sumar 1.", "Sumar probabilidades de eventos que se solapan.", "Problemas de precisión al imprimir (usar suficientes decimales)."]);
E("Probability-Classic-Problems-Bag-of-Mice", "Cada turno quita al menos un ratón, así que el número de ratones baja y los estados forman un DAG. La probabilidad de ganar desde (b, n) es la suma ponderada de las de los estados siguientes, con las probabilidades de cada extracción y de cada ratón que salta.",
  ["Olvidar el caso en que salta un ratón blanco.", "Leer estados fuera de rango cuando n < 2 o n < 3.", "Recursión profunda: hacerlo iterativo."]);
E("Probability-Classic-Problems-Campeonato", "Cada partido deja una victoria menos por ganar a uno de los dos equipos, así que los estados (lo que le falta a cada uno) bajan y la probabilidad de ganar se calcula desde los estados terminales hacia el inicial con probabilidad total.",
  ["Confundir los casos base (si a uno le falta 0 ya ganó).", "Asumir probabilidad 1/2 por partido cuando el problema da otra.", "Imprimir con pocos decimales."]);
E("Probability-Classic-Problems-Fish", "Cada día se forma un par al azar entre los C(k, 2) pares vivos, así que P[mask sin j] recibe P[mask] · P(algún par con j se forma y j pierde). Los subconjuntos solo pierden elementos, así que se recorren de grande a pequeño.",
  ["Recorrer las máscaras de pequeño a grande.", "Usar k(k − 1) en vez de k(k − 1)/2 pares.", "Tiempo O(2^n · n²) con n = 18: hay que escribir los ciclos con cuidado."]);
E("Probability-Classic-Problems-Game-on-Tree", "El número de pasos es Σ indicadores de \"v se eligió directamente\". v se elige directamente si es el primero entre v y sus ancestros en la permutación aleatoria equivalente, lo que pasa con probabilidad 1/profundidad(v). Por linealidad, la esperanza es Σ 1/(prof(v)).",
  ["Usar profundidad desde 0 (la raíz tiene profundidad 1 en la fórmula).", "Pensar que hay que simular el juego.", "Recursión profunda para calcular profundidades."]);
E("Probability-Classic-Problems-Ilya-and-Escalator", "Cada segundo depende solo de cuántas personas ya subieron, así que d[t][i] (probabilidad de i personas tras t segundos) se calcula con dos transiciones: entra una con probabilidad p (si quedan) o no entra. La esperanza es Σ i·d[T][i].",
  ["Olvidar que cuando ya subieron todos, la probabilidad se queda en su lugar.", "Memoria T·n: basta una fila.", "Precisión al imprimir."]);
E("Probability-Classic-Problems-Journey", "El caballo pasa por un nodo con la probabilidad de pasar por su padre dividida entre los hijos del padre. El largo esperado es Σ (probabilidad de terminar en cada hoja) · profundidad, o equivalentemente la suma de las probabilidades de pasar por cada arista.",
  ["Dividir entre los vecinos en vez de entre los hijos (el padre no cuenta).", "Raíz con un solo vecino tratada como hoja.", "Recursión profunda."]);
E("Probability-Classic-Problems-Lets-Play-Osu", "El puntaje es Σ L² por bloques; escribirlo como suma de incrementos (L + 1)² − L² = 2L + 1 lo vuelve lineal en L, y por linealidad basta llevar E[L] (el largo esperado del bloque actual): E[L_i] = p_i (E[L_{i−1}] + 1).",
  ["Llevar E[L]² en vez de E[L²] (no son iguales).", "Reiniciar mal el bloque cuando hay un fallo.", "Precisión al imprimir."]);
E("Probability-Classic-Problems-Probability-Given", "Bayes: P(A | B) = P(A ∩ B) / P(B). Las dos probabilidades se calculan con DP sobre las personas, sumando todas las formas en que exactamente r compran (y, para el numerador, que i esté entre ellas).",
  ["Olvidar el caso P(B) = 0.", "Contar los subconjuntos en vez de sumar sus probabilidades.", "Problemas de precisión con muchos productos pequeños."]);
E("Probability-Classic-Problems-Serval-and-Bonus-Problem", "Por linealidad, la longitud esperada cubierta por al menos k segmentos es l · P(un punto al azar está cubierto). Entre los 2n + 1 puntos al azar (extremos más el punto), el orden relativo es uniforme, y eso lo vuelve un conteo combinatorio.",
  ["Integrar numéricamente en vez de usar la reducción a órdenes.", "Olvidar multiplicar por l al final.", "Contar mal los órdenes equivalentes (dividir por las permutaciones de cada segmento)."]);
E("Probability-Distributions-Binomial", "Cada secuencia con k éxitos y n − k fracasos tiene probabilidad pᵏ(1 − p)ⁿ⁻ᵏ por independencia, y hay C(n, k) secuencias así. La esperanza np sale por linealidad sumando n indicadores.",
  ["Calcular C(n, k)·pᵏ con factoriales en flotante para n grande (desborda); usar logaritmos o una DP.", "Aplicarla cuando los ensayos no son independientes (eso es hipergeométrica).", "Confundir \"al menos k\" con \"exactamente k\"."]);
E("Probability-Distributions-ContinuousUniform", "Con variables uniformes independientes, el par (X, Y) es uniforme en el rectángulo de valores, así que la probabilidad de un evento es el área de la región que lo cumple dividida entre el área total.",
  ["Olvidar recortar la región a los límites del rectángulo.", "Calcular P(X = Y) como positiva (en continuo es 0).", "Errores de signo al restar triángulos."]);
E("Probability-Distributions-CouponCollector", "Cuando ya hay i tipos, cada compra da uno nuevo con probabilidad (n − i)/n, así que la espera es geométrica de esperanza n/(n − i). Por linealidad, el total es Σ n/(n − i) = n·H_n ≈ n ln n.",
  ["Pensar que hacen falta n compras.", "Sumar las probabilidades en vez de las esperanzas.", "Precisión con n grande (usar doble precisión y sumar de forma estable)."]);
