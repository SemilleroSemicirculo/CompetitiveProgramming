#!/usr/bin/env python3
"""Genera docs/data.js con todos los algoritmos C++ del repositorio.

Uso: python3 scripts/generar_pagina.py
Lee el bloque de documentación de cada .cpp (Algoritmo / Problema / Entrada /
Salida / Complejidad) y el código, y los guarda para la guía interactiva.
"""
import json, os, re

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CARPETAS = ["DP", "Data Structures", "Graphs", "Strings", "Geometry", "FunctionalTools"]
NOMBRES = {"DP": "Programación dinámica", "Data Structures": "Estructuras de datos",
           "Graphs": "Grafos", "Strings": "Cadenas", "Geometry": "Geometría",
           "FunctionalTools": "Herramientas"}

def leer(ruta):
    codigo = open(ruta, encoding="utf-8").read()
    m = re.search(r"/\*(.*?)\*/", codigo, re.S)
    campos = {}
    if m:
        for linea in m.group(1).splitlines():
            linea = linea.strip().lstrip("*").strip()
            k = re.match(r"(Algoritmo|Problema|Entrada|Salida|Complejidad)\s*:\s*(.*)", linea)
            if k:
                campos[k.group(1)] = k.group(2)
    return codigo, campos

def main():
    items = []
    for carpeta in CARPETAS:
        for base, _, archivos in sorted(os.walk(os.path.join(RAIZ, carpeta))):
            for a in sorted(archivos):
                if not a.endswith(".cpp"):
                    continue
                ruta = os.path.join(base, a)
                rel = os.path.relpath(ruta, RAIZ).replace(os.sep, "/")
                codigo, c = leer(ruta)
                partes = rel.split("/")
                sub = "/".join(partes[1:-1]) or "-"
                url = re.search(r"https://cses\.fi/problemset/task/\d+", c.get("Problema", ""))
                items.append({
                    "id": re.sub(r"[^A-Za-z0-9]+", "-", rel[:-4]).strip("-"),
                    "carpeta": carpeta, "area": NOMBRES[carpeta], "sub": sub,
                    "archivo": rel, "nombre": a[:-4],
                    "algoritmo": c.get("Algoritmo", a[:-4]),
                    "problema": c.get("Problema", ""),
                    "cses": url.group(0) if url else "",
                    "entrada": c.get("Entrada", ""), "salida": c.get("Salida", ""),
                    "complejidad": c.get("Complejidad", ""), "codigo": codigo,
                })
    with open(os.path.join(RAIZ, "docs", "data.js"), "w", encoding="utf-8") as f:
        f.write("window.ALGORITMOS = " + json.dumps(items, ensure_ascii=False) + ";\n")
    print(len(items), "algoritmos")

if __name__ == "__main__":
    main()
