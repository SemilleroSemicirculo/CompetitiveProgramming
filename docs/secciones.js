// Cómo se agrupan las lecciones en el modo libre (menú lateral y «Algoritmos»): por técnica y de lo básico a lo avanzado.
// Las carpetas del repositorio no cambian; esto solo define cómo se muestran. Toda lección nueva debe agregarse a un grupo.
window.CARPETAS = {
 "FunctionalTools": "Herramientas y matemáticas",
 "Data Structures": "Estructuras de datos",
 "DP": "Programación dinámica",
 "Probability": "Probabilidad",
 "Graphs": "Grafos",
 "Strings": "Cadenas",
 "Geometry": "Geometría"
};
window.SECCIONES = {
"FunctionalTools": [
  {"t": "Búsquedas", "d": "Encontrar un valor o la mejor respuesta sin revisar todo.", "ids": ["FunctionalTools-Codes-BS", "FunctionalTools-Codes-BS-library", "FunctionalTools-Codes-BinarySearchAnswer", "FunctionalTools-Classic-Problems-Array-Division", "FunctionalTools-Codes-TS"]},
  {"t": "Teoría de números", "d": "Primos, divisores y aritmética modular.", "ids": ["FunctionalTools-Codes-Sieve", "FunctionalTools-Classic-Problems-Counting-Divisors", "FunctionalTools-Codes-ModArithmetic", "FunctionalTools-Classic-Problems-Exponentiation", "FunctionalTools-Codes-MatrixExponentiation"]},
  {"t": "Combinatoria", "d": "Contar sin listar: binomiales e inclusión-exclusión.", "ids": ["FunctionalTools-Classic-Problems-Distributing-Apples", "FunctionalTools-Classic-Problems-Prime-Multiples"]},
  {"t": "Bits y búsqueda exhaustiva", "d": "Recorrer subconjuntos de forma inteligente.", "ids": ["FunctionalTools-Codes-GrayCode", "FunctionalTools-Codes-MeetInTheMiddle"]}
],
"Data Structures": [
  {"t": "Estructuras lineales", "d": "Pila, cola, deque y heap.", "ids": ["Data-Structures-Algorithms-Stack", "Data-Structures-Algorithms-Deque", "Data-Structures-Classic-Problems-Team-Queue", "Data-Structures-Algorithms-Heap", "Data-Structures-Classic-Problems-K-Smallest-Sums"]},
  {"t": "Prefijos, punteros y barridos", "d": "Precalcular o recorrer una sola vez.", "ids": ["Data-Structures-Classic-Problems-Static-Range-Sum-Queries", "Data-Structures-Classic-Problems-Forest-Queries", "Data-Structures-Algorithms-TwoPointers", "Data-Structures-Algorithms-SweepLine"]},
  {"t": "Consultas en rangos", "d": "Responder y actualizar rangos en O(log n) o O(1).", "ids": ["Data-Structures-Algorithms-SparseTable", "Data-Structures-Algorithms-FenwickTree", "Data-Structures-Classic-Problems-Range-Update-Queries", "Data-Structures-Algorithms-SegmentTree", "Data-Structures-Classic-Problems-Hotel-Queries", "Data-Structures-Classic-Problems-Prefix-Sum-Queries", "Data-Structures-Algorithms-LazySegmentTree"]},
  {"t": "Consultas offline", "d": "Reordenar las consultas cuando ninguna estructura sirve.", "ids": ["Data-Structures-Algorithms-MoAlgorithm"]}
],
"DP": [
  {"t": "Conteo y mochila", "d": "Formas de sumar, monedas y mochila.", "ids": ["DP-Classic-Problems-Dice-Combinations", "DP-Algorithms-CoinChange", "DP-Algorithms-CoinCombinations", "DP-Classic-Problems-Money-Sums", "DP-Algorithms-Knapsack"]},
  {"t": "Subarreglos y subsecuencias", "d": "Kadane, LIS, LCS y distancia de edición.", "ids": ["DP-Algorithms-Kadane1D", "DP-Algorithms-Kadane2D", "DP-Algorithms-LIS-I", "DP-Algorithms-LIS-II", "DP-Algorithms-LCS", "DP-Algorithms-EditDistance"]},
  {"t": "Cuadrículas e intervalos", "d": "Estados en 2D y tramos [l, r].", "ids": ["DP-Classic-Problems-Grid-Paths-I", "DP-Classic-Problems-Removal-Game"]},
  {"t": "Técnicas avanzadas", "d": "Subconjuntos, dígitos y probabilidades.", "ids": ["DP-Algorithms-BitmaskDP", "DP-Classic-Problems-Counting-Numbers", "DP-Classic-Problems-Campeonato"]}
],
"Probability": [
  {"t": "Probabilidad y esperanza", "d": "Regla de la suma y del producto, linealidad e indicadores.", "ids": ["Probability-Algorithms-ProbabilityDP", "Probability-Algorithms-LinearityOfExpectation", "Probability-Algorithms-ExpectedMaximum", "Probability-Classic-Problems-Game-on-Tree", "Probability-Classic-Problems-Lets-Play-Osu"]},
  {"t": "Procesos aleatorios", "d": "Cadenas de Markov y DP sobre estados que cambian al azar.", "ids": ["Probability-Algorithms-MarkovChain", "Probability-Classic-Problems-Ilya-and-Escalator", "Probability-Classic-Problems-Journey", "Probability-Classic-Problems-Bag-of-Mice", "Probability-Classic-Problems-Fish"]},
  {"t": "Probabilidad modular", "d": "Respuestas p · q⁻¹ módulo un primo.", "ids": ["Probability-Algorithms-ModularExpectation"]}
],
"Graphs": [
  {"t": "Recorridos", "d": "BFS, DFS, ciclos y bipartición.", "ids": ["Graphs-Algorithms-Graph-Traversal-DFS", "Graphs-Classic-Problems-Counting-Rooms", "Graphs-Algorithms-Graph-Traversal-BFS", "Graphs-Classic-Problems-Labyrinth", "Graphs-Algorithms-Graph-Traversal-Bipartite", "Graphs-Algorithms-Miscellaneous-CycleFindingUndirected", "Graphs-Algorithms-Miscellaneous-CycleFindingDirected"]},
  {"t": "Caminos más cortos", "d": "Con y sin pesos negativos, de uno o de todos.", "ids": ["Graphs-Algorithms-Graph-Traversal-Djikstra", "Graphs-Classic-Problems-Flight-Discount", "Graphs-Algorithms-Graph-Traversal-BellmanFord", "Graphs-Algorithms-Graph-Traversal-FloydWarshall"]},
  {"t": "DAGs y componentes", "d": "Orden topológico, componentes y 2-SAT.", "ids": ["Graphs-Algorithms-Graph-Traversal-TopologicalSort", "Graphs-Classic-Problems-Longest-Flight-Route", "Graphs-Algorithms-Graph-Traversal-DSU", "Graphs-Algorithms-Graph-Traversal-Kosaraju", "Graphs-Algorithms-Graph-Traversal-Tarjan", "Graphs-Algorithms-Miscellaneous-2-SAT"]},
  {"t": "Árbol de expansión mínima", "d": "Kruskal y Prim.", "ids": ["Graphs-Algorithms-MST-Kruskal", "Graphs-Algorithms-MST-Prim"]},
  {"t": "Caminos eulerianos", "d": "Usar cada arista una vez.", "ids": ["Graphs-Algorithms-Graph-Traversal-EulerianCycle", "Graphs-Algorithms-Graph-Traversal-HierholzerDirected"]},
  {"t": "Árboles", "d": "Subárboles, diámetro, LCA, centroides e isomorfismo.", "ids": ["Graphs-Classic-Problems-Subordinates", "Graphs-Algorithms-Graph-Traversal-Diameter", "Graphs-Algorithms-Trees-TreeDistances", "Graphs-Algorithms-Trees-EulerTour", "Graphs-Algorithms-Trees-BinaryLifting", "Graphs-Algorithms-Trees-LCA", "Graphs-Algorithms-Trees-Centroid", "Graphs-Algorithms-Trees-CentroidDecomposition", "Graphs-Algorithms-Trees-TreeIsomorfismRooted", "Graphs-Algorithms-Trees-TreeIsomorfism"]},
  {"t": "Flujos y emparejamientos", "d": "Flujo máximo, emparejamiento y costo mínimo.", "ids": ["Graphs-Algorithms-Flow-Algoritms-EdmonsKarp", "Graphs-Algorithms-Flow-Algoritms-Dinic", "Graphs-Algorithms-Flow-Algoritms-BipartiteMatching", "Graphs-Algorithms-Flow-Algoritms-MinCostMaxFlow", "Graphs-Algorithms-Flow-Algoritms-MinCostAnyFlow"]}
],
"Strings": [
  {"t": "Prefijos, bordes y periodos", "d": "Función de prefijos (KMP) y función Z.", "ids": ["Strings-Algorithms-KMP-I", "Strings-Algorithms-KMP-II", "Strings-Classic-Problems-Finding-Borders", "Strings-Algorithms-ZFunction", "Strings-Classic-Problems-Finding-Periods"]},
  {"t": "Hashing", "d": "Comparar cadenas como números.", "ids": ["Strings-Algorithms-RabinKarp"]},
  {"t": "Palíndromos y rotaciones", "d": "Manacher y rotación mínima.", "ids": ["Strings-Algorithms-Manacher", "Strings-Algorithms-MinimalRotation"]},
  {"t": "Estructuras de cadenas", "d": "Trie y suffix array.", "ids": ["Strings-Algorithms-PrefixTrie", "Strings-Algorithms-SuffixArray", "Strings-Classic-Problems-Repeating-Substring"]},
  {"t": "Conteo sobre cadenas", "d": "DP que cuenta subsecuencias o cadenas con un patrón.", "ids": ["Strings-Classic-Problems-Distinct-Subsequences", "Strings-Classic-Problems-Required-Substring"]}
],
"Geometry": [
  {"t": "Fundamentos", "d": "Vectores, producto cruz, áreas y puntos en polígonos.", "ids": ["Geometry-Point", "Geometry-Classic-Problems-Point-Location-Test", "Geometry-Shoelace", "Geometry-SegmentIntersection", "Geometry-PointInPolygon", "Geometry-PolygonLatticePoints"]},
  {"t": "Algoritmos clásicos", "d": "Envolvente convexa, par más cercano y distancia Manhattan.", "ids": ["Geometry-ConvexHull", "Geometry-ClosestPair", "Geometry-Classic-Problems-Maximum-Manhattan-Distances"]},
  {"t": "Barridos y estructuras", "d": "Línea de barrido, segment tree y Li Chao en el plano.", "ids": ["Geometry-Classic-Problems-Intersection-Points", "Geometry-Classic-Problems-Area-of-Rectangles", "Geometry-Classic-Problems-Lines-and-Queries-I"]}
]
};
window.NOMBRE_VISTA = {
 "FunctionalTools-Codes-BS": "Búsqueda binaria",
 "FunctionalTools-Codes-BS-library": "Búsqueda binaria (librería)",
 "FunctionalTools-Codes-TS": "Búsqueda ternaria",
 "Graphs-Algorithms-Graph-Traversal-Djikstra": "Dijkstra",
 "Graphs-Algorithms-Flow-Algoritms-EdmonsKarp": "Edmonds-Karp",
 "Graphs-Algorithms-Trees-TreeIsomorfism": "Tree Isomorphism",
 "Graphs-Algorithms-Trees-TreeIsomorfismRooted": "Tree Isomorphism (con raíz)",
 "Probability-Classic-Problems-Lets-Play-Osu": "Let's Play Osu!",
 "Probability-Classic-Problems-Game-on-Tree": "Game on Tree",
 "Probability-Algorithms-ProbabilityDP": "DP de probabilidades",
 "Probability-Algorithms-LinearityOfExpectation": "Linealidad de la esperanza",
 "Probability-Algorithms-ExpectedMaximum": "Esperanza del máximo",
 "Probability-Algorithms-MarkovChain": "Cadenas de Markov",
 "Probability-Algorithms-ModularExpectation": "Esperanza modular"
};
