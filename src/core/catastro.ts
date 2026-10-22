import type { Lindero, Punto } from "./kernel.js";
import { puntoEnPoligono } from "./geometry.js";

export interface ParcelaCatastro {
  ref: string;
  area: number;
  puntos: Punto[];
}

export function parsearParcelasGML(xml: string): ParcelaCatastro[] {
  const parcelas: ParcelaCatastro[] = [];
  const bloques = xml.match(/<cp:CadastralParcel[\s\S]*?<\/cp:CadastralParcel>/g) ?? [];
  for (const bloque of bloques) {
    const ref = bloque.match(/<cp:nationalCadastralReference>([^<]+)<\/cp:nationalCadastralReference>/)?.[1];
    const area = Number(bloque.match(/<cp:areaValue uom="m2">([\d.]+)</)?.[1] ?? 0);
    const posList = bloque.match(/<gml:posList[^>]*>([^<]+)<\/gml:posList>/)?.[1];
    if (!ref || !posList) continue;
    const coords = posList.trim().split(/\s+/).map(Number);
    const puntos: Punto[] = [];
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

export function tiparLinderos(puntos: Punto[]): Lindero[] {
  const lados = [];
  for (let i = 0; i < puntos.length; i++) {
    const a = puntos[i];
    const b = puntos[(i + 1) % puntos.length];
    lados.push({ a, b, longitud: Math.hypot(b.x - a.x, b.y - a.y) });
  }
  const frontal = lados.reduce((max, l) => (l.longitud > max.longitud ? l : max), lados[0]);
  const medioFrontal = { x: (frontal.a.x + frontal.b.x) / 2, y: (frontal.a.y + frontal.b.y) / 2 };
  let testero: { a: Punto; b: Punto; longitud: number } | undefined;
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

export function compacidad(parcela: ParcelaCatastro): number {
  const xs = parcela.puntos.map((q) => q.x);
  const ys = parcela.puntos.map((q) => q.y);
  const bbox = (Math.max(...xs) - Math.min(...xs)) * (Math.max(...ys) - Math.min(...ys));
  return bbox > 0 ? parcela.area / bbox : 0;
}

export function urlWFSParcelasPorPunto(x: number, y: number, radio: number, count = 30): string {
  const bbox = `${x - radio},${y - radio},${x + radio},${y + radio}`;
  return `https://ovc.catastro.meh.es/INSPIRE/wfsCP.aspx?request=GetFeature&typenames=cp:CadastralParcel&srsname=urn:ogc:def:crs:EPSG::25830&bbox=${bbox}&count=${count}`;
}

export function esRefEstandar(ref: string): boolean {
  return /^\d{5}[A-Z]/.test(ref);
}

export function seleccionarParcelaRepresentativa(parcelas: ParcelaCatastro[], minArea = 150, maxArea = 5000, punto?: Punto): ParcelaCatastro | undefined {
  if (punto) {
    const dentro = parcelas.filter((p) => p.puntos.length >= 3 && puntoEnPoligono(punto, p.puntos));
    if (dentro.length > 0) {
      const estandarDentro = dentro.filter((p) => esRefEstandar(p.ref));
      return (estandarDentro.length > 0 ? estandarDentro : dentro)[0];
    }
  }
  const candidatas = parcelas.filter((p) => p.area >= minArea && p.area <= maxArea && p.puntos.length >= 3);
  if (candidatas.length === 0) return undefined;
  const estandar = candidatas.filter((p) => esRefEstandar(p.ref));
  const pool = estandar.length > 0 ? estandar : candidatas;
  return pool.sort((a, b) => compacidad(b) - compacidad(a))[0];
}
