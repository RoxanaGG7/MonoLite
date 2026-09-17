import type { Lindero, Punto } from "./kernel.js";

export function distanciaPuntoSegmento(p: Punto, a: Punto, b: Punto): number {
  const abx = b.x - a.x;
  const aby = b.y - a.y;
  const apx = p.x - a.x;
  const apy = p.y - a.y;
  const ab2 = abx * abx + aby * aby;
  if (ab2 === 0) return Math.hypot(apx, apy);
  const t = (apx * abx + apy * aby) / ab2;
  const tClamped = Math.max(0, Math.min(1, t));
  return Math.hypot(p.x - (a.x + tClamped * abx), p.y - (a.y + tClamped * aby));
}

function distanciaSegmentoAPoligono(a: Punto, b: Punto, poligono: Punto[]): number {
  let min = Infinity;
  for (const p of poligono) {
    min = Math.min(min, distanciaPuntoSegmento(p, a, b));
  }
  for (let i = 0; i < poligono.length; i++) {
    const q1 = poligono[i];
    const q2 = poligono[(i + 1) % poligono.length];
    min = Math.min(min, distanciaPuntoSegmento(a, q1, q2));
    min = Math.min(min, distanciaPuntoSegmento(b, q1, q2));
  }
  return min;
}

export function distanciaHuellaLindero(huella: Punto[], lindero: Lindero): number {
  return distanciaSegmentoAPoligono(lindero.a, lindero.b, huella);
}

export function distanciaMinimaLinderos(
  huella: Punto[],
  linderos: Lindero[]
): number | undefined {
  if (huella.length < 3 || linderos.length === 0) return undefined;
  let min = Infinity;
  for (const lindero of linderos) {
    min = Math.min(min, distanciaHuellaLindero(huella, lindero));
  }
  return Number.isFinite(min) ? min : undefined;
}

export function distanciaSegmentoSegmento(a1: Punto, a2: Punto, b1: Punto, b2: Punto): number {
  return Math.min(
    distanciaPuntoSegmento(a1, b1, b2),
    distanciaPuntoSegmento(a2, b1, b2),
    distanciaPuntoSegmento(b1, a1, a2),
    distanciaPuntoSegmento(b2, a1, a2)
  );
}

export function distanciaEntrePoligonos(p1: Punto[], p2: Punto[]): number {
  let min = Infinity;
  for (let i = 0; i < p1.length; i++) {
    const a1 = p1[i];
    const a2 = p1[(i + 1) % p1.length];
    for (let j = 0; j < p2.length; j++) {
      min = Math.min(min, distanciaSegmentoSegmento(a1, a2, p2[j], p2[(j + 1) % p2.length]));
    }
  }
  return min;
}

export function areaPoligono(poligono: Punto[]): number {
  let area = 0;
  for (let i = 0; i < poligono.length; i++) {
    const p1 = poligono[i];
    const p2 = poligono[(i + 1) % poligono.length];
    area += p1.x * p2.y - p2.x * p1.y;
  }
  return Math.abs(area) / 2;
}
