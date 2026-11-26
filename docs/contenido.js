// Explicaciones de cada algoritmo para la guía.
// nivel: 1 = Básico, 2 = Intermedio, 3 = Avanzado
window.CONTENIDO = {};
function C(id, nivel, idea, texto, cuando, pasos) { window.CONTENIDO[id] = { nivel, idea, texto, cuando, pasos }; }

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
