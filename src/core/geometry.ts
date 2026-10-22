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

function orientarCCW(poligono: Punto[]): Punto[] {
  let area = 0;
  for (let i = 0; i < poligono.length; i++) {
    const p1 = poligono[i];
    const p2 = poligono[(i + 1) % poligono.length];
    area += p1.x * p2.y - p2.x * p1.y;
  }
  return area < 0 ? [...poligono].reverse() : [...poligono];
}

function clipSemiPlano(poligono: Punto[], px: number, py: number, nx: number, ny: number): Punto[] {
  const dentro = (p: Punto) => (p.x - px) * nx + (p.y - py) * ny >= 0;
  const salida: Punto[] = [];
  for (let i = 0; i < poligono.length; i++) {
    const a = poligono[i];
    const b = poligono[(i + 1) % poligono.length];
    const enA = dentro(a);
    const enB = dentro(b);
    if (enA) salida.push(a);
    if (enA !== enB) {
      const t = ((px - a.x) * nx + (py - a.y) * ny) / ((b.x - a.x) * nx + (b.y - a.y) * ny);
      salida.push({ x: a.x + t * (b.x - a.x), y: a.y + t * (b.y - a.y) });
    }
  }
  return salida;
}

export function poligonoInset(poligono: Punto[], d: number): Punto[] {
  if (poligono.length < 3) return [];
  if (d <= 0) return orientarCCW(poligono);
  const pts = orientarCCW(poligono);
  let actual = pts;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    const ex = b.x - a.x;
    const ey = b.y - a.y;
    const len = Math.hypot(ex, ey);
    if (len === 0) continue;
    const nx = -ey / len;
    const ny = ex / len;
    actual = clipSemiPlano(actual, a.x + nx * d, a.y + ny * d, nx, ny);
    if (actual.length < 3) return [];
  }
  return actual;
}

export function puntoEnPoligono(p: Punto, poligono: Punto[]): boolean {
  let dentro = false;
  for (let i = 0, j = poligono.length - 1; i < poligono.length; j = i++) {
    const pi = poligono[i];
    const pj = poligono[j];
    if (
      pi.y > p.y !== pj.y > p.y &&
      p.x < ((pj.x - pi.x) * (p.y - pi.y)) / (pj.y - pi.y) + pi.x
    ) {
      dentro = !dentro;
    }
  }
  return dentro;
}

function distanciaPoligonoContorno(p: Punto, contorno: Punto[]): number {
  let min = Infinity;
  for (let i = 0; i < contorno.length; i++) {
    min = Math.min(min, distanciaPuntoSegmento(p, contorno[i], contorno[(i + 1) % contorno.length]));
  }
  return min;
}

import ClipperLib from "clipper-lib";

const CLIPPER_ESCALA = 1000;

export function deGeograficaAUTM(latGrados: number, lonGrados: number): { x: number; y: number } {
  const a = 6378137;
  const f = 1 / 298.257223563;
  const k0 = 0.9996;
  const zona = Math.floor((lonGrados + 180) / 6) + 1;
  const lon0 = (zona * 6 - 183) * (Math.PI / 180);
  const phi = latGrados * (Math.PI / 180);
  const lam = lonGrados * (Math.PI / 180);
  const e2 = f * (2 - f);
  const ep2 = e2 / (1 - e2);
  const N = a / Math.sqrt(1 - e2 * Math.sin(phi) ** 2);
  const T = Math.tan(phi) ** 2;
  const C = ep2 * Math.cos(phi) ** 2;
  const A = (lam - lon0) * Math.cos(phi);
  const e4 = e2 * e2;
  const e6 = e4 * e2;
  const M =
    a *
    ((1 - e2 / 4 - (3 * e4) / 64 - (5 * e6) / 256) * phi -
      ((3 * e2) / 8 + (3 * e4) / 32 + (45 * e6) / 1024) * Math.sin(2 * phi) +
      ((15 * e4) / 256 + (45 * e6) / 1024) * Math.sin(4 * phi) -
      ((35 * e6) / 3072) * Math.sin(6 * phi));
  const x =
    k0 * N * (A + ((1 - T + C) * A ** 3) / 6 + ((5 - 18 * T + T * T + 72 * C - 58 * ep2) * A ** 5) / 120) + 500000;
  const y =
    k0 *
    (M +
      N *
        Math.tan(phi) *
        ((A * A) / 2 +
          ((5 - T + 9 * C + 4 * C * C) * A ** 4) / 24 +
          ((61 - 58 * T + T * T + 600 * C - 330 * ep2) * A ** 6) / 720));
  return { x, y };
}

interface ClipperPuntoEntero {
  X: number;
  Y: number;
}

function aClipper(puntos: Punto[]): ClipperPuntoEntero[] {
  return puntos.map((p) => ({ X: Math.round(p.x * CLIPPER_ESCALA), Y: Math.round(p.y * CLIPPER_ESCALA) }));
}

function desdeClipper(puntos: ClipperPuntoEntero[]): Punto[] {
  return puntos.map((p) => ({ x: p.X / CLIPPER_ESCALA, y: p.Y / CLIPPER_ESCALA }));
}

export function poligonoOffsetInterior(poligono: Punto[], d: number): Punto[] {
  if (poligono.length < 3) return [];
  if (d <= 0) return orientarCCW(poligono);
  const clipper = new ClipperLib.ClipperOffset(2, 0.25 * CLIPPER_ESCALA);
  clipper.AddPath(aClipper(orientarCCW(poligono)), ClipperLib.JoinType.jtMiter, ClipperLib.EndType.etClosedPolygon);
  const solucion = new ClipperLib.Paths();
  clipper.Execute(solucion, -d * CLIPPER_ESCALA);
  let mejor: Punto[] = [];
  let mejorArea = 0;
  for (const camino of solucion) {
    if (camino.length < 3) continue;
    const puntos = desdeClipper(camino);
    const area = areaPoligono(puntos);
    if (area > mejorArea) {
      mejor = puntos;
      mejorArea = area;
    }
  }
  return mejor;
}
