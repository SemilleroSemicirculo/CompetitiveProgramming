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
C("DP-Classic-Problems-Campeonato", 1, "La probabilidad de ganar se calcula a partir de lo que falta: un partido más acerca a uno de los dos equipos.",
  "P[i][j] es la probabilidad de que A gane si le faltan i victorias y a B le faltan j. Después de un partido, o A ganó (le falta una menos) o ganó B. Así cada casilla sale de dos más pequeñas, con los casos base cuando alguno ya ganó.",
  "Cuando hay que calcular probabilidades de procesos que avanzan por etapas.",
  ["P[0][j] = 1 (A ya ganó) y P[i][0] = 0.", "P[i][j] = p·P[i−1][j] + q·P[i][j−1].", "La respuesta es P[n][n]."]);

// ---------- Estructuras de datos ----------
C("Data-Structures-Algorithms-Deque", 2, "Una fila que guarda solo los candidatos a mínimo de la ventana, en orden creciente.",
  "Si llega un número más pequeño, todos los mayores que están antes nunca volverán a ser el mínimo, así que se descartan. El frente de la deque siempre es el mínimo de la ventana, y cada elemento entra y sale una sola vez: tiempo lineal.",
  "Para mínimos o máximos de ventanas deslizantes.",
  ["Quitar por atrás los valores ≥ al nuevo.", "Agregar el índice nuevo atrás.", "Quitar del frente los que ya salieron de la ventana.", "El frente es el mínimo."]);
C("Data-Structures-Algorithms-Stack", 1, "Una pila que guarda los posibles «menores a la izquierda»; los que ya no sirven se sacan.",
  "Al ver a[i], cualquier número anterior que sea mayor o igual ya no puede ser la respuesta para nadie que venga después, porque a[i] está más cerca y es menor. Se sacan de la pila, y lo que queda arriba es la respuesta.",
  "Para encontrar el elemento menor o mayor más cercano a cada lado.",
  ["Sacar de la pila los ≥ a[i].", "El tope (si hay) es la respuesta de i.", "Meter i en la pila."]);
C("Data-Structures-Algorithms-Heap", 1, "Una cola de prioridad que siempre te da la habitación que se libera más pronto.",
  "Se atiende a los clientes por hora de llegada. El heap (montículo) guarda las habitaciones ocupadas ordenadas por hora de salida. Si la que sale primero ya está libre cuando llega el cliente, se reutiliza; si no, se abre una nueva.",
  "Cuando necesitas sacar repetidamente el menor (o mayor) elemento de un conjunto que cambia.",
  ["Ordenar clientes por llegada.", "Mirar la habitación con salida más temprana.", "Reutilizarla si ya salió; si no, abrir otra."]);
C("Data-Structures-Algorithms-FenwickTree", 2, "Un arreglo donde cada casilla guarda la suma de un bloque, para sumar prefijos y actualizar en log n.",
  "Sumar un rango recorriendo el arreglo tarda n pasos. El Fenwick Tree (o BIT) usa los bits del índice para dividir el arreglo en bloques de tamaño potencia de 2. Una suma de prefijo junta pocos bloques, y una actualización toca pocos bloques.",
  "Sumas de rangos con valores que cambian.",
  ["add(i, v): subir por i += i & −i.", "query(i): bajar por i −= i & −i acumulando.", "Rango [l, r] = query(r) − query(l − 1)."]);
C("Data-Structures-Algorithms-SparseTable", 2, "Precalcula el mínimo de todos los rangos de longitud potencia de 2 y responde cada consulta en O(1).",
  "Cualquier rango [l, r] se puede cubrir con dos bloques de longitud 2ᵏ que se solapan. Para el mínimo el solape no importa. Como la tabla no se puede actualizar fácilmente, solo sirve si el arreglo no cambia.",
  "Mínimos, máximos o gcd de rangos en un arreglo fijo, con muchas consultas.",
  ["st[0] = el arreglo.", "st[j][i] = min(st[j−1][i], st[j−1][i + 2^(j−1)]).", "Consulta: k = log2(largo), min de los dos bloques."]);
C("Data-Structures-Algorithms-SegmentTreeMin", 2, "Un árbol donde cada nodo guarda el mínimo de un tramo, y se puede cambiar un valor en log n.",
  "Las hojas son los elementos y cada nodo padre guarda el mínimo de sus dos hijos. Al cambiar un valor solo se recalcula el camino hasta la raíz. Para consultar un rango se juntan los pocos nodos que lo cubren. Esta versión es iterativa, corta y rápida.",
  "Mínimo (o suma, máximo…) de rangos con actualizaciones puntuales.",
  ["Hojas en t[n..2n).", "update: cambiar la hoja y subir.", "query: subir l y r juntando nodos."]);
C("Data-Structures-Algorithms-SegmentTree", 3, "Un segment tree que deja actualizaciones pendientes en los nodos (lazy) para modificar rangos completos rápido.",
  "Sumar x a todo un rango tocaría muchas hojas. La propagación perezosa anota «a este tramo le falta sumar x» en el nodo que lo cubre y solo baja la anotación a los hijos cuando realmente hace falta. Aquí se soportan dos tipos: sumar y asignar.",
  "Cuando hay actualizaciones y consultas sobre rangos al mismo tiempo.",
  ["apply: actualizar el nodo y guardar el pendiente.", "propagate: bajar el pendiente a los hijos.", "update/query: recursión que solo entra donde hace falta."]);
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
C("Data-Structures-Classic-Problems-Team-Queue", 1, "Una cola de colas: cada equipo tiene su propia fila y los equipos hacen fila entre ellos.",
  "Cuando alguien llega, se pone detrás de su equipo si ya hay alguien de su equipo esperando; si no, su equipo entra al final de la cola general. Con dos niveles de colas cada operación es O(1).",
  "Para simular colas con prioridades por grupo.",
  ["Mapear cada persona a su equipo.", "ENQUEUE: a la cola del equipo (y el equipo a la general si estaba vacío).", "DEQUEUE: sale el primero del equipo del frente."]);

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
C(G+"Graph-Traversal-Djikstra", 2, "Expande siempre el nodo más cercano todavía no definitivo, como BFS pero con pesos.",
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
  "En un grafo dirigido, una componente fuertemente conexa es un grupo donde todos llegan a todos. Tarjan anota cuándo descubre cada nodo y el nodo más antiguo que puede alcanzar (low). Si low[v] es su propio tiempo, v es la cabeza de una componente y se sacan de la pila sus miembros.",
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
C(G+"Trees-TreeIsomorfismRooted", 2, "Da a cada subárbol un número según la forma de sus hijos; dos árboles son iguales si sus raíces reciben el mismo número.",
  "Una hoja tiene un número; un nodo cuyos hijos tienen ciertos números recibe el número asignado a esa lista ordenada. Así, dos subárboles con la misma forma reciben el mismo número sin importar cómo estén etiquetados.",
  "Comparar la forma de dos árboles con raíz.",
  ["Procesar de las hojas a la raíz.", "Ordenar los números de los hijos.", "Asignar un id a cada lista distinta."]);
C(G+"Trees-TreeIsomorfism", 3, "Como el isomorfismo con raíz, pero probando como raíz los centroides de cada árbol.",
  "Si los árboles no tienen raíz, hay que elegir una de forma canónica. Todo árbol tiene uno o dos centroides, así que basta con probar esas pocas combinaciones y comparar los ids canónicos.",
  "Comparar la forma de dos árboles sin raíz.",
  ["Hallar los centroides de cada árbol.", "Calcular ids canónicos desde cada centroide.", "Iguales para algún par → YES."]);
C(G+"Flow-Algoritms-EdmonsKarp", 2, "Busca con BFS caminos con capacidad libre y envía flujo por ellos hasta que no quede ninguno.",
  "Piensa en tuberías: cada una deja pasar una cantidad máxima. Mientras exista un camino de la fuente al destino con espacio, se envía lo que permite su tubería más estrecha. Las aristas inversas permiten «deshacer» decisiones malas.",
  "Flujo máximo en grafos pequeños o medianos.",
  ["BFS para un camino aumentante.", "Enviar el cuello de botella.", "Actualizar capacidades y sus inversas."]);
C(G+"Flow-Algoritms-Dinic", 3, "Flujo máximo por fases: organiza el grafo en niveles y empuja todo el flujo posible en cada fase.",
  "Dinic mejora a Edmonds-Karp: con un BFS arma niveles desde la fuente y luego con DFS manda flujo solo hacia adelante en los niveles, hasta bloquear todos los caminos. Pocas fases bastan, por eso es mucho más rápido.",
  "Flujo máximo en grafos grandes; también emparejamientos.",
  ["BFS de niveles.", "DFS de flujo bloqueante con it[].", "Repetir mientras t sea alcanzable."]);
C(G+"Flow-Algoritms-BipartiteMatching", 2, "Empareja elementos de dos grupos; si alguien está ocupado, intenta reubicarlo en otra pareja.",
  "El algoritmo de Kuhn intenta emparejar a cada chico. Si la chica que le gusta ya tiene pareja, pregunta si esa pareja puede cambiarse a otra chica libre. Esa cadena de cambios es un camino aumentante.",
  "Asignaciones uno a uno: trabajos, parejas, horarios.",
  ["Para cada u, buscar con DFS.", "Si v está libre o su pareja se reubica, emparejar.", "Contar los éxitos."]);
C(G+"Flow-Algoritms-MinCostMaxFlow", 3, "Envía el máximo flujo posible, eligiendo siempre el camino más barato disponible.",
  "Cada tubería además tiene un costo por unidad. El algoritmo busca el camino más barato en el grafo residual (Dijkstra con potenciales para manejar costos negativos) y envía todo lo que puede por él, hasta que no haya más caminos.",
  "Transporte, asignaciones con costos.",
  ["Potenciales iniciales con Bellman-Ford.", "Dijkstra para el camino más barato.", "Enviar el cuello de botella y repetir."]);
C(G+"Flow-Algoritms-MinCostAnyFlow", 3, "Igual que el flujo de costo mínimo, pero se detiene al enviar exactamente K unidades.",
  "Usa el mismo motor que el de flujo máximo con costo mínimo, solo que el límite es K. Si el grafo no puede transportar K unidades, se informa que es imposible.",
  "Cuando la cantidad a transportar está fija.",
  ["Mismo algoritmo con límite K.", "Si se envió menos de K → IMPOSSIBLE.", "Si no, imprimir el costo."]);

// ---------- Cadenas ----------
const S = "Strings-Algorithms-";
C(S+"KMP-I", 2, "Precalcula cuánto del patrón se puede reutilizar tras un fallo para no volver a empezar de cero.",
  "LP[i] es el borde más largo de s[0..i]: el mayor prefijo que también es sufijo. Si pegas patrón + # + texto, cada posición con LP igual al largo del patrón marca una aparición.",
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
  "Insertar y buscar cuesta solo el largo de la palabra. Aquí se combina con DP: desde cada posición del texto se baja por el trie y cada palabra completa encontrada suma las formas de construir el resto.",
  "Diccionarios, autocompletado, partir un texto en palabras.",
  ["Insertar palabras letra por letra.", "dp[n] = 1.", "Desde i, bajar por el trie y sumar dp[j + 1] en cada palabra."]);
C(S+"Manacher", 3, "Encuentra el palíndromo más largo reutilizando la simetría de los palíndromos ya encontrados.",
  "Dentro de un palíndromo, lo que pasa a un lado del centro se refleja al otro. Manacher guarda el palíndromo que llega más a la derecha y lo usa para empezar cada nuevo cálculo con ventaja. Se calculan por separado los de largo impar (d1) y par (d2).",
  "Palíndromos más largos o conteo de palíndromos.",
  ["Para cada centro, empezar con el valor reflejado.", "Expandir mientras coincidan.", "Actualizar el intervalo [l, r]."]);
C(S+"MinimalRotation", 3, "Compara dos candidatos a rotación mínima y descarta de un salto todas las posiciones que no pueden ganar.",
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
  "Graham scan ordena los puntos por ángulo alrededor del más bajo y los recorre con una pila. Si los tres últimos giran hacia el lado equivocado, el del medio queda adentro y se saca. El producto cruz decide el giro.",
  "Envolventes, puntos extremos, base de muchos problemas geométricos.",
  ["Elegir el punto más bajo.", "Ordenar por ángulo.", "Pila: sacar mientras el giro sea incorrecto."]);
C("Geometry-PointInPolygon", 2, "Lanza un rayo desde el punto y cuenta cuántas veces cruza el borde: impar = adentro.",
  "Si caminas en línea recta desde un punto interior hacia afuera, cruzas el borde un número impar de veces. Antes se revisa si el punto está justo sobre una arista, que es el caso BOUNDARY.",
  "Saber si un punto está dentro de un polígono.",
  ["¿Está sobre alguna arista? → BOUNDARY.", "Contar cruces del rayo horizontal.", "Impar → INSIDE."]);
C("Geometry-SegmentIntersection", 2, "Dos segmentos se cortan si los extremos de cada uno quedan a lados distintos del otro.",
  "El signo del producto cruz dice de qué lado de una recta está un punto. Si los extremos de cada segmento están en lados opuestos (o sobre la recta) del otro, y sus cajas se solapan, se intersectan.",
  "Cruces de caminos, colisiones.",
  ["Calcular las cuatro orientaciones.", "Revisar que las cajas se solapen.", "Signos opuestos o cero → YES."]);
C("Geometry-PolygonLatticePoints", 2, "Con el teorema de Pick, el área y los puntos del borde dan los puntos enteros interiores.",
  "Pick dice que A = I + B/2 − 1. El área sale del Shoelace y los puntos del borde de cada arista son gcd(|dx|, |dy|). Despejando se obtiene I sin contar punto por punto.",
  "Contar puntos enteros dentro de polígonos.",
  ["Área doble con Shoelace.", "B = suma de gcd por arista.", "I = (2A − B + 2) / 2."]);
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
  "Si f(m1) < f(m2), el máximo no puede estar a la izquierda de m1. Cada paso deja dos tercios, y al quedar pocos valores se revisan todos.",
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
