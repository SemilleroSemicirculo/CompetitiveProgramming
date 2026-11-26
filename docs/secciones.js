// Cómo se agrupan las lecciones en el modo libre (menú lateral y «Algoritmos»): por técnica y de lo básico a lo avanzado.
// Las carpetas del repositorio no cambian; esto solo define cómo se muestran. Toda lección nueva debe agregarse a un grupo.
window.CARPETAS = {
 "FunctionalTools": "Herramientas y matemáticas",
 "Data Structures": "Estructuras de datos",
 "DP": "Programación dinámica",
 "Graphs": "Grafos",
 "Probability": "Probabilidad",
 "Strings": "Cadenas",
 "Geometry": "Geometría"
};
window.SECCIONES = {
"FunctionalTools": [
  {"t": "Búsquedas", "d": "Encontrar un valor o la mejor respuesta sin revisar todo.", "ids": ["FunctionalTools-Codes-BS", "FunctionalTools-Codes-BS-library", "FunctionalTools-Codes-BinarySearchAnswer", "FunctionalTools-Classic-Problems-Array-Division", "FunctionalTools-Codes-TS"]},
  {"t": "Teoría de números", "d": "Primos, divisores y aritmética modular.", "ids": ["FunctionalTools-Codes-Sieve", "FunctionalTools-Classic-Problems-Counting-Divisors", "FunctionalTools-Codes-ModArithmetic", "FunctionalTools-Classic-Problems-Exponentiation", "FunctionalTools-Codes-MatrixExponentiation"]},
  {"t": "Combinatoria", "d": "Contar sin listar: binomiales e inclusión-exclusión.", "ids": ["FunctionalTools-Classic-Problems-Distributing-Apples", "FunctionalTools-Classic-Problems-Prime-Multiples"]},
  {"t": "Bits y búsqueda exhaustiva", "d": "Recorrer subconjuntos de forma inteligente.", "ids": ["FunctionalTools-Codes-GrayCode", "FunctionalTools-Codes-MeetInTheMiddle"]},
  {"t": "Teoría de números avanzada", "d": "Euclides extendido, chino del resto, φ y factorización de números grandes.", "ids": ["FunctionalTools-Number-Theory-ExtendedEuclid", "FunctionalTools-Number-Theory-CRT", "FunctionalTools-Number-Theory-EulerPhi", "FunctionalTools-Number-Theory-MillerRabin", "FunctionalTools-Number-Theory-PollardRho"]},
  {"t": "Juegos", "d": "Nim, posiciones ganadoras y números de Grundy.", "ids": ["FunctionalTools-Games-Nim", "FunctionalTools-Games-SpragueGrundy"]},
  {"t": "Polinomios", "d": "Multiplicar polinomios rápido: FFT y NTT.", "ids": ["FunctionalTools-Polynomials-FFT", "FunctionalTools-Polynomials-NTT"]}
],
"Data Structures": [
  {"t": "Estructuras lineales", "d": "Pila, cola, deque y heap.", "ids": ["Data-Structures-Algorithms-Stack", "Data-Structures-Algorithms-Deque", "Data-Structures-Classic-Problems-Team-Queue", "Data-Structures-Algorithms-Heap", "Data-Structures-Classic-Problems-K-Smallest-Sums"]},
  {"t": "Prefijos, punteros y barridos", "d": "Precalcular o recorrer una sola vez.", "ids": ["Data-Structures-Classic-Problems-Static-Range-Sum-Queries", "Data-Structures-Classic-Problems-Forest-Queries", "Data-Structures-Algorithms-TwoPointers", "Data-Structures-Algorithms-SweepLine"]},
  {"t": "Consultas en rangos", "d": "Responder y actualizar rangos en O(log n) o O(1).", "ids": ["Data-Structures-Algorithms-SparseTable", "Data-Structures-Algorithms-FenwickTree", "Data-Structures-Classic-Problems-Range-Update-Queries", "Data-Structures-Algorithms-SegmentTree", "Data-Structures-Classic-Problems-Hotel-Queries", "Data-Structures-Classic-Problems-Prefix-Sum-Queries", "Data-Structures-Algorithms-LazySegmentTree"]},
  {"t": "Consultas offline", "d": "Reordenar las consultas cuando ninguna estructura sirve.", "ids": ["Data-Structures-Algorithms-MoAlgorithm"]},
  {"t": "Estructuras avanzadas", "d": "Conjuntos con k-ésimo, versiones persistentes y treaps.", "ids": ["Data-Structures-Algorithms-OrderedSet", "Data-Structures-Algorithms-PersistentSegmentTree", "Data-Structures-Algorithms-Treap"]}
],
"DP": [
  {"t": "Conteo y mochila", "d": "Formas de sumar, monedas y mochila.", "ids": ["DP-Classic-Problems-Dice-Combinations", "DP-Algorithms-CoinChange", "DP-Algorithms-CoinCombinations", "DP-Classic-Problems-Money-Sums", "DP-Algorithms-Knapsack"]},
  {"t": "Subarreglos y subsecuencias", "d": "Kadane, LIS, LCS y distancia de edición.", "ids": ["DP-Algorithms-Kadane1D", "DP-Algorithms-Kadane2D", "DP-Algorithms-LIS-I", "DP-Algorithms-LIS-II", "DP-Algorithms-LCS", "DP-Algorithms-EditDistance"]},
  {"t": "Cuadrículas e intervalos", "d": "Estados en 2D y tramos [l, r].", "ids": ["DP-Classic-Problems-Grid-Paths-I", "DP-Classic-Problems-Removal-Game"]},
  {"t": "Técnicas avanzadas", "d": "Subconjuntos y dígitos.", "ids": ["DP-Algorithms-BitmaskDP", "DP-Classic-Problems-Counting-Numbers"]},
  {"t": "DP en árboles", "d": "Estados por subárbol y respuestas para todas las raíces.", "ids": ["DP-Trees-TreeMatching", "DP-Trees-Rerooting"]},
  {"t": "Optimizaciones de DP", "d": "Dígitos, subconjuntos, Convex Hull Trick, divide y vencerás y Knuth.", "ids": ["DP-Optimizations-DigitDP", "DP-Optimizations-SOSDP", "DP-Optimizations-ConvexHullTrick", "DP-Optimizations-DivideAndConquerDP", "DP-Optimizations-KnuthOptimization"]}
],
"Graphs": [
  {"t": "Recorridos", "d": "BFS, DFS, ciclos y bipartición.", "ids": ["Graphs-Algorithms-Graph-Traversal-DFS", "Graphs-Classic-Problems-Counting-Rooms", "Graphs-Algorithms-Graph-Traversal-BFS", "Graphs-Classic-Problems-Labyrinth", "Graphs-Algorithms-Graph-Traversal-Bipartite", "Graphs-Algorithms-Miscellaneous-CycleFindingUndirected", "Graphs-Algorithms-Miscellaneous-CycleFindingDirected"]},
  {"t": "Caminos más cortos", "d": "Con y sin pesos negativos, de uno o de todos.", "ids": ["Graphs-Algorithms-Graph-Traversal-Dijkstra", "Graphs-Classic-Problems-Flight-Discount", "Graphs-Algorithms-Graph-Traversal-BellmanFord", "Graphs-Algorithms-Graph-Traversal-FloydWarshall"]},
  {"t": "DAGs y componentes", "d": "Orden topológico, componentes y 2-SAT.", "ids": ["Graphs-Algorithms-Graph-Traversal-TopologicalSort", "Graphs-Classic-Problems-Longest-Flight-Route", "Graphs-Algorithms-Graph-Traversal-DSU", "Graphs-Algorithms-Graph-Traversal-Kosaraju", "Graphs-Algorithms-Graph-Traversal-Tarjan", "Graphs-Algorithms-Miscellaneous-2-SAT"]},
  {"t": "Puentes y articulaciones", "d": "Aristas y nodos cuya eliminación desconecta el grafo.", "ids": ["Graphs-Algorithms-Connectivity-Bridges", "Graphs-Algorithms-Connectivity-ArticulationPoints"]},
  {"t": "Árbol de expansión mínima", "d": "Kruskal y Prim.", "ids": ["Graphs-Algorithms-MST-Kruskal", "Graphs-Algorithms-MST-Prim"]},
  {"t": "Caminos eulerianos", "d": "Usar cada arista una vez.", "ids": ["Graphs-Algorithms-Graph-Traversal-EulerianCycle", "Graphs-Algorithms-Graph-Traversal-HierholzerDirected"]},
  {"t": "Árboles", "d": "Subárboles, diámetro, LCA, centroides, isomorfismo y heavy-light.", "ids": ["Graphs-Classic-Problems-Subordinates", "Graphs-Algorithms-Graph-Traversal-Diameter", "Graphs-Algorithms-Trees-TreeDistances", "Graphs-Algorithms-Trees-EulerTour", "Graphs-Algorithms-Trees-BinaryLifting", "Graphs-Algorithms-Trees-LCA", "Graphs-Algorithms-Trees-Centroid", "Graphs-Algorithms-Trees-CentroidDecomposition", "Graphs-Algorithms-Trees-TreeIsomorphismRooted", "Graphs-Algorithms-Trees-TreeIsomorphism", "Graphs-Algorithms-Trees-HLD"]},
  {"t": "Flujos y emparejamientos", "d": "Flujo máximo, corte mínimo, emparejamientos, cotas inferiores, asignación y costo mínimo.", "ids": ["Graphs-Algorithms-Flow-Algorithms-EdmondsKarp", "Graphs-Algorithms-Flow-Algorithms-Dinic", "Graphs-Algorithms-Flow-Algorithms-BipartiteMatching", "Graphs-Algorithms-Flow-Algorithms-MinCostMaxFlow", "Graphs-Algorithms-Flow-Algorithms-MinCostAnyFlow", "Graphs-Algorithms-Flow-Algorithms-MinCut", "Graphs-Algorithms-Flow-Algorithms-HopcroftKarp", "Graphs-Algorithms-Flow-Algorithms-LowerBoundFlow", "Graphs-Algorithms-Flow-Algorithms-Hungarian"]}
],
"Probability": [
  {"t": "Probabilidad y esperanza", "d": "Regla de la suma y del producto, linealidad e indicadores.", "ids": ["Probability-Algorithms-ProbabilityDP", "Probability-Classic-Problems-Campeonato", "Probability-Algorithms-LinearityOfExpectation", "Probability-Algorithms-ExpectedMaximum", "Probability-Classic-Problems-Game-on-Tree", "Probability-Classic-Problems-Lets-Play-Osu"]},
  {"t": "Procesos aleatorios", "d": "Cadenas de Markov y DP sobre estados que cambian al azar.", "ids": ["Probability-Algorithms-MarkovChain", "Probability-Classic-Problems-Ilya-and-Escalator", "Probability-Classic-Problems-Journey", "Probability-Classic-Problems-Bag-of-Mice", "Probability-Classic-Problems-Fish", "Probability-Algorithms-GaussianExpectation"]},
  {"t": "Distribuciones", "d": "Binomial, geométrica, condicional (Bayes) y continua uniforme.", "ids": ["Probability-Distributions-Binomial", "Probability-Distributions-CouponCollector", "Probability-Classic-Problems-Probability-Given", "Probability-Distributions-ContinuousUniform", "Probability-Classic-Problems-Serval-and-Bonus-Problem"]},
  {"t": "Probabilidad modular", "d": "Respuestas p · q⁻¹ módulo un primo.", "ids": ["Probability-Algorithms-ModularExpectation"]}
],
"Strings": [
  {"t": "Prefijos, bordes y periodos", "d": "Función de prefijos (KMP) y función Z.", "ids": ["Strings-Algorithms-KMP-I", "Strings-Algorithms-KMP-II", "Strings-Classic-Problems-Finding-Borders", "Strings-Algorithms-ZFunction", "Strings-Classic-Problems-Finding-Periods"]},
  {"t": "Hashing", "d": "Comparar cadenas como números.", "ids": ["Strings-Algorithms-RabinKarp"]},
  {"t": "Palíndromos y rotaciones", "d": "Manacher y rotación mínima.", "ids": ["Strings-Algorithms-Manacher", "Strings-Algorithms-MinimalRotation"]},
  {"t": "Estructuras de cadenas", "d": "Trie, suffix array, Aho-Corasick y autómata de sufijos.", "ids": ["Strings-Algorithms-PrefixTrie", "Strings-Algorithms-SuffixArray", "Strings-Classic-Problems-Repeating-Substring", "Strings-Algorithms-AhoCorasick", "Strings-Algorithms-SuffixAutomaton"]},
  {"t": "Conteo sobre cadenas", "d": "DP que cuenta subsecuencias o cadenas con un patrón.", "ids": ["Strings-Classic-Problems-Distinct-Subsequences", "Strings-Classic-Problems-Required-Substring"]}
],
"Geometry": [
  {"t": "Fundamentos", "d": "Vectores, producto cruz, áreas y puntos en polígonos.", "ids": ["Geometry-Point", "Geometry-Classic-Problems-Point-Location-Test", "Geometry-Shoelace", "Geometry-SegmentIntersection", "Geometry-PointInPolygon", "Geometry-PolygonLatticePoints"]},
  {"t": "Primitivas de uso diario", "d": "Distancias, cortes de rectas y circunferencias, cortar polígonos.", "ids": ["Geometry-Advanced-SegmentDistance", "Geometry-Advanced-LineIntersection", "Geometry-Advanced-CircleIntersection", "Geometry-Advanced-PolygonCut", "Geometry-Advanced-PointInConvexPolygon"]},
  {"t": "Algoritmos clásicos", "d": "Envolvente convexa, par más cercano y distancia Manhattan.", "ids": ["Geometry-ConvexHull", "Geometry-ClosestPair", "Geometry-Classic-Problems-Maximum-Manhattan-Distances", "Geometry-Advanced-RotatingCalipers"]},
  {"t": "Barridos y estructuras", "d": "Línea de barrido, segment tree y Li Chao en el plano.", "ids": ["Geometry-Classic-Problems-Intersection-Points", "Geometry-Classic-Problems-Area-of-Rectangles", "Geometry-Classic-Problems-Lines-and-Queries-I", "Geometry-Advanced-HalfPlaneIntersection"]}
]
};
window.NOMBRE_VISTA = {
 "FunctionalTools-Codes-BS": "Búsqueda binaria",
 "FunctionalTools-Codes-BS-library": "Búsqueda binaria (librería)",
 "FunctionalTools-Codes-TS": "Búsqueda ternaria",
 "Graphs-Algorithms-Graph-Traversal-Dijkstra": "Dijkstra",
 "Graphs-Algorithms-Flow-Algorithms-EdmondsKarp": "Edmonds-Karp",
 "Graphs-Algorithms-Trees-TreeIsomorphism": "Tree Isomorphism",
 "Graphs-Algorithms-Trees-TreeIsomorphismRooted": "Tree Isomorphism (con raíz)",
 "Probability-Classic-Problems-Lets-Play-Osu": "Let's Play Osu!",
 "Probability-Classic-Problems-Game-on-Tree": "Game on Tree",
 "Probability-Algorithms-ProbabilityDP": "DP de probabilidades",
 "Probability-Algorithms-LinearityOfExpectation": "Linealidad de la esperanza",
 "Probability-Algorithms-ExpectedMaximum": "Esperanza del máximo",
 "Probability-Algorithms-MarkovChain": "Cadenas de Markov",
 "Probability-Algorithms-ModularExpectation": "Esperanza modular",
 "Probability-Distributions-Binomial": "Distribución binomial",
 "Probability-Distributions-CouponCollector": "Geométrica y cupones",
 "Probability-Distributions-ContinuousUniform": "Uniforme continua",
 "Probability-Classic-Problems-Probability-Given": "Probability|Given (Bayes)",
 "FunctionalTools-Number-Theory-ExtendedEuclid": "Euclides extendido",
 "FunctionalTools-Number-Theory-CRT": "Teorema chino del resto",
 "FunctionalTools-Number-Theory-EulerPhi": "Función φ de Euler",
 "FunctionalTools-Number-Theory-MillerRabin": "Miller-Rabin",
 "FunctionalTools-Number-Theory-PollardRho": "Pollard rho",
 "FunctionalTools-Games-Nim": "Nim",
 "FunctionalTools-Games-SpragueGrundy": "Sprague-Grundy",
 "FunctionalTools-Polynomials-FFT": "FFT",
 "FunctionalTools-Polynomials-NTT": "NTT",
 "Data-Structures-Algorithms-OrderedSet": "Conjunto ordenado (pb_ds)",
 "Data-Structures-Algorithms-PersistentSegmentTree": "Segment Tree persistente",
 "Data-Structures-Algorithms-Treap": "Treap implícito",
 "DP-Trees-TreeMatching": "DP en árboles (Tree Matching)",
 "DP-Trees-Rerooting": "Rerooting",
 "DP-Optimizations-DigitDP": "DP de dígitos",
 "DP-Optimizations-SOSDP": "SOS DP",
 "DP-Optimizations-ConvexHullTrick": "Convex Hull Trick",
 "DP-Optimizations-DivideAndConquerDP": "DP con divide y vencerás",
 "DP-Optimizations-KnuthOptimization": "Optimización de Knuth",
 "Graphs-Algorithms-Connectivity-Bridges": "Puentes",
 "Graphs-Algorithms-Connectivity-ArticulationPoints": "Puntos de articulación",
 "Graphs-Algorithms-Trees-HLD": "Heavy-light (HLD)",
 "Graphs-Algorithms-Flow-Algorithms-MinCut": "Corte mínimo",
 "Graphs-Algorithms-Flow-Algorithms-HopcroftKarp": "Hopcroft-Karp",
 "Graphs-Algorithms-Flow-Algorithms-LowerBoundFlow": "Flujo con cotas inferiores",
 "Graphs-Algorithms-Flow-Algorithms-Hungarian": "Algoritmo húngaro",
 "Probability-Algorithms-GaussianExpectation": "Esperanza con ciclos (Gauss)",
 "Strings-Algorithms-AhoCorasick": "Aho-Corasick",
 "Strings-Algorithms-SuffixAutomaton": "Autómata de sufijos",
 "Geometry-Advanced-SegmentDistance": "Distancia entre segmentos",
 "Geometry-Advanced-LineIntersection": "Intersección de rectas",
 "Geometry-Advanced-CircleIntersection": "Intersección de circunferencias",
 "Geometry-Advanced-PolygonCut": "Cortar un polígono",
 "Geometry-Advanced-PointInConvexPolygon": "Punto en convexo O(log n)",
 "Geometry-Advanced-RotatingCalipers": "Rotating calipers",
 "Geometry-Advanced-HalfPlaneIntersection": "Intersección de semiplanos"
};
