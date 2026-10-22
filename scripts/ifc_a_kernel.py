import argparse
import json
import sys

import ifcopenshell
import ifcopenshell.geom
from shapely.geometry import MultiPoint, Polygon
from shapely.ops import unary_union

settings = ifcopenshell.geom.settings()
settings.set(settings.USE_WORLD_COORDS, True)

TIPOS_HUELLA = ["IfcWall", "IfcWallStandardCase", "IfcSlab", "IfcColumn", "IfcFooting"]


def extraer(ifc_path, origen_xy=None, salida="tests/fixtures/extracto-ifc.json"):
    file = ifcopenshell.open(ifc_path)
    coordenadas_locales = False

    storeys = sorted(file.by_type("IfcBuildingStorey"), key=lambda s: s.Elevation or 0)
    if not storeys:
        raise SystemExit("IFC sin IfcBuildingStorey")
    base = storeys[0].Elevation or 0
    plantas_sobre_rasante = [s for s in storeys if (s.Elevation or 0) >= base - 0.01]
    numero_plantas = len(plantas_sobre_rasante)

    productos = [p for p in file.by_type("IfcBuildingElement") if any(p.is_a(t) for t in TIPOS_HUELLA)]
    if not productos:
        raise SystemExit("IFC sin elementos de huella (muros/losas)")

    max_z = -sys.float_info.max
    min_z = sys.float_info.max
    poligonos = []
    for p in productos:
        forma = ifcopenshell.geom.create_shape(settings, p)
        verts = forma.geometry.verts
        xs = []
        ys = []
        for i in range(0, len(verts), 3):
            x, y, z = verts[i], verts[i + 1], verts[i + 2]
            xs.append(x)
            ys.append(y)
            max_z = max(max_z, z)
            min_z = min(min_z, z)
        puntos = list(zip(xs, ys))
        if len(puntos) >= 3:
            poligonos.append(MultiPoint(puntos).convex_hull)

    union = unary_union(poligonos).buffer(0)
    if union.geom_type == "MultiPolygon":
        mayor = max(union.geoms, key=lambda g: g.area)
        union = mayor
    huella = list(union.exterior.coords)
    huella = [{"x": round(x, 3), "y": round(y, 3)} for x, y in huella]
    if len(huella) > 1 and abs(huella[0]["x"] - huella[-1]["x"]) < 0.01 and abs(huella[0]["y"] - huella[-1]["y"]) < 0.01:
        huella.pop()

    altura_maxima = round(max_z - base, 2)
    area_huella = round(union.area, 1)

    site = file.by_type("IfcSite")
    georref = None
    if site and site[0].RefLatitude and site[0].RefLongitude:
        lat = sum(v * 10 ** (-3 * i) for i, v in enumerate(site[0].RefLatitude[:3]))
        lon = -sum(v * 10 ** (-3 * i) for i, v in enumerate(site[0].RefLongitude[:3]))
        georref = {"lat": round(lat, 7), "lon": round(lon, 7)}

    if georref:
        origen = utm_desde_geografica(georref["lat"], georref["lon"])
    elif origen_xy:
        partes = origen_xy.split(",")
        origen = {"x": float(partes[0]), "y": float(partes[1])}
    else:
        origen = {"x": 0.0, "y": 0.0}
        coordenadas_locales = True

    extracto = {
        "fuente": {"ifc": ifc_path.split("\\")[-1].split("/")[-1], "extractor": "ifcopenshell 0.9"},
        "crs": "EPSG:25830",
        "origenUTM": {"x": origen["x"], "y": origen["y"]},
        "georreferencia": georref,
        "coordenadasLocales": coordenadas_locales,
        "edificio": {
            "huella": [{"x": p["x"] + origen["x"], "y": p["y"] + origen["y"]} for p in huella],
            "numeroPlantas": numero_plantas,
            "alturaMaxima": altura_maxima,
            "superficieOcupadaProyectada": area_huella,
            "superficieEdificadaTotal": round(area_huella * numero_plantas, 1),
        },
    }
    extracto["nota"] = "superficieEdificadaTotal = huella x plantas (simplificacion v0; el computo legal 7.3.13 pendiente de conectar)"

    with open(salida, "w", encoding="utf-8") as f:
        json.dump(extracto, f, indent=2)
    print(f"Extracto: {len(huella)} vertices, {area_huella} m2, {numero_plantas} plantas, altura {altura_maxima} m")
    print(f"Origen UTM: ({origen['x']:.1f}, {origen['y']:.1f}) -> {salida}")


def utm_desde_geografica(lat, lon):
    import math

    a = 6378137.0
    f = 1 / 298.257223563
    k0 = 0.9996
    zona = int((lon + 180) / 6) + 1
    lon0 = math.radians(zona * 6 - 183)
    phi = math.radians(lat)
    lam = math.radians(lon)
    e2 = f * (2 - f)
    ep2 = e2 / (1 - e2)
    N = a / math.sqrt(1 - e2 * math.sin(phi) ** 2)
    T = math.tan(phi) ** 2
    C = ep2 * math.cos(phi) ** 2
    A = (lam - lon0) * math.cos(phi)
    e4 = e2 * e2
    e6 = e4 * e2
    M = (
        a
        * (
            (1 - e2 / 4 - 3 * e4 / 64 - 5 * e6 / 256) * phi
            - (3 * e2 / 8 + 3 * e4 / 32 + 45 * e6 / 1024) * math.sin(2 * phi)
            + (15 * e4 / 256 + 45 * e6 / 1024) * math.sin(4 * phi)
            - (35 * e6 / 3072) * math.sin(6 * phi)
        )
    )
    x = k0 * N * (A + (1 - T + C) * A ** 3 / 6 + (5 - 18 * T + T * T + 72 * C - 58 * ep2) * A ** 5 / 120) + 500000
    y = k0 * (M + N * math.tan(phi) * (A * A / 2 + (5 - T + 9 * C + 4 * C * C) * A ** 4 / 24 + (61 - 58 * T + T * T + 600 * C - 330 * ep2) * A ** 6 / 720))
    return {"x": x, "y": y}


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("ifc")
    parser.add_argument("--origen", dest="origen", default=None)
    parser.add_argument("--salida", dest="salida", default="tests/fixtures/extracto-ifc.json")
    args = parser.parse_args()
    extraer(args.ifc, args.origen, args.salida)
