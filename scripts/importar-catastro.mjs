const WFS = "https://ovc.catastro.meh.es/INSPIRE/wfsCP.aspx?request=GetFeature&typenames=cp:CadastralParcel&srsname=urn:ogc:def:crs:EPSG::25830";

const args = process.argv.slice(2);
const argDe = (nombre) => {
  const i = args.indexOf(`--${nombre}`);
  return i !== -1 ? args[i + 1] : undefined;
};

const bbox = argDe("bbox");
const maxArea = Number(argDe("max-area") ?? 3000);
const minArea = Number(argDe("min-area") ?? 0);
const refBuscada = argDe("ref");

if (!bbox && !refBuscada) {
  console.error("Uso: node scripts/importar-catastro.mjs --bbox x1,y1,x2,y2 [--max-area 3000] [--ref 18051A...] [--salida ruta.json]");
  process.exit(1);
}

function parsearParcelas(xml) {
  const parcelas = [];
  const bloques = xml.match(/<cp:CadastralParcel[\s\S]*?<\/cp:CadastralParcel>/g) ?? [];
  for (const bloque of bloques) {
    const ref = bloque.match(/<cp:nationalCadastralReference>([^<]+)<\/cp:nationalCadastralReference>/)?.[1];
    const area = Number(bloque.match(/<cp:areaValue uom="m2">([\d.]+)</)?.[1] ?? 0);
    const posList = bloque.match(/<gml:posList[^>]*>([^<]+)<\/gml:posList>/)?.[1];
    if (!ref || !posList) continue;
    const coords = posList.trim().split(/\s+/).map(Number);
    const puntos = [];
    for (let i = 0; i < coords.length - 1; i += 2) puntos.push({ x: coords[i], y: coords[i + 1] });
    if (puntos.length > 2) {
      const primero = puntos[0];
      const ultimo = puntos[puntos.length - 1];
      if (Math.abs(primero.x - ultimo.x) < 0.01 && Math.abs(primero.y - ultimo.y) < 0.01) puntos.pop();
    }
    parcelas.push({ ref, area, puntos });
  }
  return parcelas;
}

function tiparLinderos(puntos) {
  const lados = [];
  for (let i = 0; i < puntos.length; i++) {
    const a = puntos[i];
    const b = puntos[(i + 1) % puntos.length];
    lados.push({ a, b, longitud: Math.hypot(b.x - a.x, b.y - a.y) });
  }
  const frontal = lados.reduce((max, l) => (l.longitud > max.longitud ? l : max), lados[0]);
  const medioFrontal = { x: (frontal.a.x + frontal.b.x) / 2, y: (frontal.a.y + frontal.b.y) / 2 };
  let testero;
  let maxDist = -1;
  for (const lado of lados) {
    if (lado === frontal) continue;
    const medio = { x: (lado.a.x + lado.b.x) / 2, y: (lado.a.y + lado.b.y) / 2 };
    const dist = Math.hypot(medio.x - medioFrontal.x, medio.y - medioFrontal.y);
    if (dist > maxDist) {
      maxDist = dist;
      testero = lado;
    }
  }
  return lados.map((lado) => ({
    a: lado.a,
    b: lado.b,
    tipo: lado === frontal ? "frontal" : lado === testero ? "testero" : "lateral",
  }));
}

const url = refBuscada
  ? `${WFS}&count=1&filter=<fes:Filter xmlns:fes="http://www.opengis.net/fes/2.0"><fes:PropertyIsEqualTo><fes:ValueReference>cp:nationalCadastralReference</fes:ValueReference><fes:Literal>${refBuscada}</fes:Literal></fes:PropertyIsEqualTo></fes:Filter>`
  : `${WFS}&bbox=${bbox}&count=50`;

const respuesta = await fetch(url, { headers: { "User-Agent": "MonoLite-Importador/0.1" } });
if (!respuesta.ok) {
  console.error(`HTTP ${respuesta.status}`);
  process.exit(1);
}
const xml = await respuesta.text();
const parcelas = parsearParcelas(xml);

if (parcelas.length === 0) {
  console.error("Sin parcelas en la respuesta");
  process.exit(1);
}

const candidatas = parcelas.filter((p) => p.area >= minArea && p.area <= maxArea);
if (candidatas.length === 0) {
  console.error(`Todas las parcelas superan ${maxArea} m² (recibidas: ${parcelas.map((p) => `${p.ref}=${p.area}m²`).join(", ")})`);
  process.exit(1);
}
candidatas.sort((a, b) => compacidad(b) - compacidad(a));
const elegida = candidatas[0];

function compacidad(p) {
  const xs = p.puntos.map((q) => q.x);
  const ys = p.puntos.map((q) => q.y);
  const bbox = (Math.max(...xs) - Math.min(...xs)) * (Math.max(...ys) - Math.min(...ys));
  return bbox > 0 ? p.area / bbox : 0;
}

const kernel = {
  refCatastral: elegida.ref,
  crs: "EPSG:25830",
  fuente: "Catastro INSPIRE WFS CP",
  fechaConsulta: new Date().toISOString().slice(0, 10),
  areaCatastral: elegida.area,
  parcela: {
    id: elegida.ref,
    type: "parcela",
    crs: "EPSG:25830",
    superficie: 0,
    contorno: elegida.puntos,
    linderos: tiparLinderos(elegida.puntos),
    cotaReferencia: 0,
    calificacion: "RUAIS",
  },
  notaLinderos: "Tipado v1 automático: el lado más largo es frontal; el más alejado, testero; el resto laterales. Pendiente: marcado humano + inferencia de viales (v2).",
};

const salida = argDe("salida") ?? "tests/fixtures/parcela-real.json";
const { writeFileSync } = await import("node:fs");
const { resolve } = await import("node:path");
writeFileSync(resolve(process.cwd(), salida), JSON.stringify(kernel, null, 2) + "\n", "utf8");
console.log(`Parcela ${elegida.ref}: ${elegida.area} m², ${elegida.puntos.length} vértices, ${kernel.parcela.linderos.length} linderos → ${salida}`);
