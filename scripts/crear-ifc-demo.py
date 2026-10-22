import json
import math
from ifcopenshell import guid

LARGO_PERFIL = 0.3
ALTURA_PLANTA = 3.2
ANCHO_EDIFICIO = 15.0
LARGO_EDIFICIO = 12.0
NUM_PLANTAS = 2


def punto_anclaje_parcela():
    with open("tests/fixtures/parcela-real.json", encoding="utf-8") as f:
        parcela = json.load(f)
    contorno = parcela["parcela"]["contorno"]
    cx = sum(p["x"] for p in contorno) / len(contorno)
    cy = sum(p["y"] for p in contorno) / len(contorno)
    vertice = max(contorno, key=lambda p: math.hypot(p["x"] - cx, p["y"] - cy))
    return vertice, (cx, cy)


def crear_ifc(camino):
    entidades = []

    def add(txt):
        entidades.append(txt)
        return len(entidades)

    siunit = add("IFCSIUNIT(*,.LENGTHUNIT.,$,.METRE.)")
    punto0 = add("IFCCARTESIANPOINT((0.,0.,0.))")
    axis3d = add(f"IFCAXIS2PLACEMENT3D(#{punto0},$,$)")
    ctx = add(f"IFCGEOMETRICREPRESENTATIONCONTEXT($,'Model',3,1.E-05,#{axis3d},$)")
    subctx = add(f"IFCGEOMETRICREPRESENTATIONSUBCONTEXT('Body','Model',#{ctx},.MODEL_VIEW.,$)")
    unitassign = add(f"IFCUNITASSIGNMENT((#{siunit}))")
    proyecto = add(f"IFCPROJECT('{guid.new()}',$,'MonoLite Demo',$,$,$,$,(#{ctx}),#{unitassign})")

    pl_site = add(f"IFCLOCALPLACEMENT($,#{axis3d})")
    site = add(f"IFCSITE('{guid.new()}',$,'Lote demo',$,$,#{pl_site},$,$,.ELEMENT.,$,$,0.,$,$)")
    pl_building = add(f"IFCLOCALPLACEMENT(#{pl_site},#{axis3d})")
    building = add(f"IFCBUILDING('{guid.new()}',$,'Edificio demo',$,$,#{pl_building},$,$,.ELEMENT.,$,$,$)")

    pl_storey0 = add(f"IFCLOCALPLACEMENT(#{pl_building},IFCAXIS2PLACEMENT3D(IFCCARTESIANPOINT((0.,0.,0.)),$,$))")
    storey0 = add(f"IFCBUILDINGSTOREY('{guid.new()}',$,'Planta baja',$,$,#{pl_storey0},$,$,.ELEMENT.,0.)")
    elev1 = ALTURA_PLANTA * (NUM_PLANTAS - 1)
    pl_storey1 = add(f"IFCLOCALPLACEMENT(#{pl_building},IFCAXIS2PLACEMENT3D(IFCCARTESIANPOINT((0.,0.,{elev1:.4f})),$,$))")
    storey1 = add(f"IFCBUILDINGSTOREY('{guid.new()}',$,'Planta primera',$,$,#{pl_storey1},$,$,.ELEMENT.,{elev1:.4f})")

    add(f"IFCRELAGGREGATES('{guid.new()}',$,$,#{proyecto},(#{site}))")
    add(f"IFCRELAGGREGATES('{guid.new()}',$,$,#{site},(#{building}))")
    add(f"IFCRELAGGREGATES('{guid.new()}',$,$,#{building},(#{storey0},#{storey1}))")

    def elemento(clase, nombre, x, y, w, h, z, profundidad, pl_storey):
        pl_perfil = add(f"IFCAXIS2PLACEMENT2D(IFCCARTESIANPOINT(({x + w / 2:.4f},{y + h / 2:.4f})),$)")
        perfil = add(f"IFCRECTANGLEPROFILEDEF(.AREA.,$,#{pl_perfil},{w:.4f},{h:.4f})")
        solido = add(f"IFCEXTRUDEDAREASOLID(#{perfil},IFCAXIS2PLACEMENT3D(IFCCARTESIANPOINT((0.,0.,{z:.4f})),$,$),IFCDIRECTION((0.,0.,1.)),{profundidad:.4f})")
        rep = add(f"IFCSHAPEREPRESENTATION(#{subctx},'Body','SweptSolid',(#{solido}))")
        shape = add(f"IFCPRODUCTDEFINITIONSHAPE($,$,(#{rep}))")
        pl_elem = add(f"IFCLOCALPLACEMENT(#{pl_storey},IFCAXIS2PLACEMENT3D(IFCCARTESIANPOINT((0.,0.,0.)),$,$))")
        producto = add(f"{clase}('{guid.new()}',$,'{nombre}',$,$,#{pl_elem},#{shape},$)")
        return producto

    ids = []
    ids.append(elemento("IFCSLAB", "Forjado PB", 0, 0, ANCHO_EDIFICIO, LARGO_EDIFICIO, 0, LARGO_PERFIL, pl_storey0))
    ids.append(elemento("IFCWALL", "Muro sur", 0, 0, ANCHO_EDIFICIO, LARGO_PERFIL, 0, ALTURA_PLANTA * NUM_PLANTAS, pl_storey0))
    ids.append(elemento("IFCWALL", "Muro norte", 0, LARGO_EDIFICIO - LARGO_PERFIL, ANCHO_EDIFICIO, LARGO_PERFIL, 0, ALTURA_PLANTA * NUM_PLANTAS, pl_storey0))
    ids.append(elemento("IFCWALL", "Muro oeste", 0, 0, LARGO_PERFIL, LARGO_EDIFICIO, 0, ALTURA_PLANTA * NUM_PLANTAS, pl_storey0))
    ids.append(elemento("IFCWALL", "Muro este", ANCHO_EDIFICIO - LARGO_PERFIL, 0, LARGO_PERFIL, LARGO_EDIFICIO, 0, ALTURA_PLANTA * NUM_PLANTAS, pl_storey0))
    if NUM_PLANTAS > 1:
        ids.append(elemento("IFCSLAB", "Forjado P1", 0, 0, ANCHO_EDIFICIO, LARGO_EDIFICIO, elev1, LARGO_PERFIL, pl_storey1))
    add(f"IFCRELCONTAINEDINSPATIALSTRUCTURE('{guid.new()}',$,$,({','.join(f'#{i}' for i in ids)}),#{storey0})")

    contenido = "\n".join(f"#{i + 1}={e}" for i, e in enumerate(entidades))
    iso = "ISO-10303-21;\nHEADER;\nFILE_DESCRIPTION(('ViewDefinition [Model]'),'2;1');\n"
    iso += f"FILE_NAME('{camino.replace(chr(92), '/').split('/')[-1]}','2026-10-20T09:00:00',('MonoLite'),('MonoLite'),'ifcopenshell','MonoLite','');\n"
    iso += "FILE_SCHEMA(('IFC4'));\nENDSEC;\nDATA;\n" + contenido + "\nENDSEC;\nEND-ISO-10303-21;\n"
    with open(camino, "w", encoding="utf-8") as f:
        f.write(iso)


def main():
    vertice, centro = punto_anclaje_parcela()
    vx, vy = vertice["x"], vertice["y"]
    dx, dy = centro[0] - vx, centro[1] - vy
    norm = math.hypot(dx, dy)
    dx, dy = dx / norm, dy / norm
    d = 8.5
    origen = (vx + dx * d - ANCHO_EDIFICIO / 2, vy + dy * d - LARGO_EDIFICIO / 2)
    crear_ifc("tests/fixtures/demo-edificio.ifc")
    print(f"vertice anclaje: ({vx:.1f},{vy:.1f})")
    print(f"origen edificio (mundo): ({origen[0]:.3f},{origen[1]:.3f})")
    with open("tests/fixtures/origen-ifc-demo.json", "w", encoding="utf-8") as f:
        json.dump({"origenX": round(origen[0], 3), "origenY": round(origen[1], 3)}, f, indent=2)


if __name__ == "__main__":
    main()
