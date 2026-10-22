import "./tokens.css";
import "./estilos.css";
import type { KernelModel, Lindero, Punto } from "../core/kernel.js";
import { buildModel } from "../core/derive.js";
import { poligonoOffsetInterior, puntoEnPoligono, distanciaPuntoSegmento, areaPoligono } from "../core/geometry.js";
import { deGeograficaAUTM } from "../core/geometry.js";
import {
  parsearParcelasGML,
  seleccionarParcelaRepresentativa,
  tiparLinderos,
  urlWFSParcelasPorPunto,
} from "../core/catastro.js";
import { evaluateRule } from "../engine/evaluator.js";
import { loadPack } from "../engine/loader.js";
import { estadoGlobal, pasos, fmt, type ResultadoRegla, type EstadoGlobal } from "./vista.js";
import { adaptar, sitioLind, sitioCal, esEvaluable } from "./acciones.js";
import { t, setIdioma, getIdioma, type Idioma } from "./i18n.js";
import pack from "../../tests/fixtures/granada-sample.json" with { type: "json" };
import parcelaRealJson from "../../tests/fixtures/parcela-real.json" with { type: "json" };
import calificacionesJson from "../../data/calificaciones-granada.json" with { type: "json" };

const todasReglas = (pack as { rules: ReturnType<typeof loadPack>["rules"] }).rules;
function retranqueoMin(): number {
  for (const r of todasReglas) {
    if (!r.id.startsWith("GR-RUAIS-02")) continue;
    for (const c of r.conditions.items as Array<{ parameter?: string; value?: unknown }>) {
      if (c.parameter === "edificio.distanciaMinimaLinderos" && typeof c.value === "number") return c.value;
    }
  }
  return 3;
}
function alturaLegal(plantas: number): { valor: number; articulo: string } | undefined {
  for (const r of todasReglas) {
    if (!r.id.startsWith("GR-RUAIS-01")) continue;
    const items = r.conditions.items as Array<{ parameter?: string; value?: unknown }>;
    const condPlantas = items.find((c) => c.parameter === "edificio.numeroPlantas");
    const condAltura = items.find((c) => c.parameter === "edificio.alturaMaxima");
    if (condPlantas && condAltura && condPlantas.value === plantas && typeof condAltura.value === "number") {
      return { valor: condAltura.value, articulo: r.source.article };
    }
  }
  return undefined;
}
function plantasMaximas(): { max: number; articulo: string } {
  let max = 1;
  let articulo = "";
  for (const r of todasReglas) {
    if (!r.id.startsWith("GR-RUAIS-01")) continue;
    for (const c of r.conditions.items as Array<{ parameter?: string; value?: unknown }>) {
      if (c.parameter === "edificio.numeroPlantas" && typeof c.value === "number" && c.value > max) {
        max = c.value;
        articulo = r.source.article;
      }
    }
  }
  return { max, articulo };
}

function calificacionDetectada(p: Punto): string | null {
  const fc = calificacionesJson as unknown as {
    features?: Array<{ properties?: { calificacion?: string }; geometry?: { type?: string; coordinates?: number[][][] } }>;
  };
  const todas = [...(fc.features ?? []), ...estado.capaNueva.map((f) => ({
    properties: f.properties,
    geometry: { type: f.geometry.type, coordinates: [f.geometry.coordinates] as number[][][] },
  }))];
  for (const f of todas) {
    if (f.geometry?.type !== "Polygon" || !f.geometry?.coordinates || !f.properties?.calificacion) continue;
    const anillo = f.geometry.coordinates[0];
    if (!anillo || anillo.length < 3) continue;
    if (puntoEnPoligono(p, anillo.map(([x, y]) => ({ x, y })))) return f.properties.calificacion;
  }
  return null;
}

interface ParcelaUI {
  id: string;
  nombre: string;
  refCatastral: string | null;
  areaCatastral: number | null;
  contorno: Punto[];
  linderos: Lindero[];
  huellaFija?: Punto[];
  deIFC?: boolean;
}

const demo: ParcelaUI = {
  id: "demo",
  nombre: "Parcela demo",
  refCatastral: null,
  areaCatastral: 300,
  contorno: [
    { x: 0, y: 0 }, { x: 20, y: 0 }, { x: 20, y: 15 }, { x: 0, y: 15 },
  ],
  linderos: [
    { tipo: "frontal", a: { x: 0, y: 0 }, b: { x: 20, y: 0 } },
    { tipo: "lateral", a: { x: 0, y: 0 }, b: { x: 0, y: 15 } },
    { tipo: "lateral", a: { x: 20, y: 0 }, b: { x: 20, y: 15 } },
    { tipo: "testero", a: { x: 20, y: 15 }, b: { x: 0, y: 15 } },
  ],
};

const real: ParcelaUI = {
  id: "real",
  nombre: "Calle Arabial, Granada",
  refCatastral: parcelaRealJson.refCatastral,
  areaCatastral: parcelaRealJson.areaCatastral,
  contorno: parcelaRealJson.parcela.contorno,
  linderos: tiparLinderos(parcelaRealJson.parcela.contorno),
};

const PARCELAS: ParcelaUI[] = [demo, real];

const estado = {
  parcela: null as ParcelaUI | null,
  plantas: 1,
  altura: alturaLegal(1)?.valor ?? 0,
  linderosRevisados: false,
  calificacion: "" as string,
  modoCapa: false,
  trazo: [] as Punto[],
  capaNueva: [] as Array<{ properties: { calificacion: string }; geometry: { type: string; coordinates: number[][] } }>,
  cargando: false,
  ifcMsg: "",
  abierto: "" as string,
  volumenes: [] as Punto[][],
  activo: null as number | null,
  ifcVol: null as number | null,
  modoDibujo: false,
  dibujo: [] as Punto[],
  modoGirar: false,
  modoAlinear: false,
  alinearPend: null as { vol: number; lado: number } | null,
};

const vistaObj = { minX: 0, maxY: 0, m: 2.5, baseW: 0, baseH: 0 };
let vbGuardada: { x: number; y: number; w: number; h: number } | null = null;

const $ = (id: string) => document.getElementById(id)!;

function volActivo(): Punto[] | null {
  return estado.activo !== null && estado.volumenes[estado.activo] ? estado.volumenes[estado.activo] : null;
}

function huella(): Punto[] {
  if (estado.volumenes.length > 0) {
    return estado.volumenes.reduce((mejor, v) => (areaPoligono(v) > areaPoligono(mejor) ? v : mejor), estado.volumenes[0]);
  }
  return [];
}

function zonaConstruible(): Punto[] {
  const zona = poligonoOffsetInterior(estado.parcela!.contorno, retranqueoMin());
  return zona.length >= 3 ? zona : estado.parcela!.contorno;
}

function cercaDeBordeZona(p: Punto, eps = 0.02): boolean {
  for (const s of segZona()) {
    const abx = s.b.x - s.a.x, aby = s.b.y - s.a.y;
    const ab2 = abx * abx + aby * aby || 1;
    const t = Math.max(0, Math.min(1, ((p.x - s.a.x) * abx + (p.y - s.a.y) * aby) / ab2));
    if (Math.hypot(p.x - (s.a.x + t * abx), p.y - (s.a.y + t * aby)) < eps) return true;
  }
  return false;
}

function dentroZona(p: Punto): boolean {
  return puntoEnPoligono(p, zonaConstruible()) || cercaDeBordeZona(p);
}

function orient(a: Punto, b: Punto, c: Punto): number {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

function seCruzan(p1: Punto, p2: Punto, q1: Punto, q2: Punto): boolean {
  const o1 = orient(p1, p2, q1), o2 = orient(p1, p2, q2);
  const o3 = orient(q1, q2, p1), o4 = orient(q1, q2, p2);
  return (o1 > 0) !== (o2 > 0) && (o3 > 0) !== (o4 > 0);
}

function contieneEnZona(h: Punto[]): boolean {
  if (h.length < 3 || !h.every(dentroZona)) return false;
  const zs = segZona();
  for (let i = 0; i < h.length; i++) {
    const a = h[i];
    const b = h[(i + 1) % h.length];
    for (const s of zs) {
      if (seCruzan(a, b, s.a, s.b)) return false;
    }
  }
  return true;
}

function segZona(): Array<{ a: Punto; b: Punto; nx: number; ny: number }> {
  const z = zonaConstruible();
  const segs: Array<{ a: Punto; b: Punto; nx: number; ny: number }> = [];
  for (let i = 0; i < z.length; i++) {
    const a = z[i];
    const b = z[(i + 1) % z.length];
    const dx = b.x - a.x, dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    segs.push({ a, b, nx: -dy / len, ny: dx / len });
  }
  return segs;
}

function contiene(h: Punto[]): boolean {
  return h.length >= 3 && h.every((p) => puntoEnPoligono(p, estado.parcela!.contorno));
}

function construirKernel(h: Punto[]): KernelModel {
  const k: KernelModel = {
    parcela: {
      id: estado.parcela!.id,
      type: "parcela",
      crs: "EPSG:25830",
      superficie: 0,
      contorno: estado.parcela!.contorno,
      linderos: estado.parcela!.linderos,
      cotaReferencia: 0,
      calificacion: "RUAIS",
    },
    edificio: {
      alturaMaxima: estado.altura,
      numeroPlantas: estado.plantas,
      superficieEdificadaTotal: 0,
      superficieOcupadaProyectada: 0,
      huella: h,
    },
    entities: [],
  };
  return k;
}

function carasDe(poligono: Punto[]): Array<{ a: Punto; b: Punto; dirx: number; diry: number }> {
  const caras: Array<{ dirx: number; diry: number; base: Punto; tmin: number; tmax: number }> = [];
  for (let i = 0; i < poligono.length; i++) {
    const la = poligono[i];
    const lb = poligono[(i + 1) % poligono.length];
    const dx = lb.x - la.x, dy = lb.y - la.y;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len, uy = dy / len;
    let cara = caras.find((c) =>
      Math.abs(c.dirx * uy - c.diry * ux) < 0.02 &&
      Math.abs((la.x - c.base.x) * c.diry - (la.y - c.base.y) * c.dirx) < 0.1);
    if (!cara) {
      caras.push({ dirx: ux, diry: uy, base: la, tmin: 0, tmax: len });
      continue;
    }
    const ta = (la.x - cara.base.x) * cara.dirx + (la.y - cara.base.y) * cara.diry;
    const tb = (lb.x - cara.base.x) * cara.dirx + (lb.y - cara.base.y) * cara.diry;
    cara.tmin = Math.min(cara.tmin, ta, tb);
    cara.tmax = Math.max(cara.tmax, ta, tb);
  }
  return caras.map((c) => ({
    a: { x: c.base.x + c.dirx * c.tmin, y: c.base.y + c.diry * c.tmin },
    b: { x: c.base.x + c.dirx * c.tmax, y: c.base.y + c.diry * c.tmax },
    dirx: c.dirx, diry: c.diry,
  }));
}

function carasLindero(): Array<{ a: Punto; b: Punto; dirx: number; diry: number }> {
  return carasDe(estado.parcela!.linderos.map((l) => l.a));
}

function carasZona(): Array<{ a: Punto; b: Punto; dirx: number; diry: number }> {
  return carasDe(zonaConstruible());
}

function masCercano(h: Punto[]): { lindero: Punto; huellaP: Punto; dist: number } | undefined {
  if (h.length < 3) return undefined;
  let mejor: { lindero: Punto; huellaP: Punto; dist: number } | undefined;
  for (const l of estado.parcela!.linderos) {
    for (const p of h) {
      const d = distanciaPuntoSegmento(p, l.a, l.b);
      if (!mejor || d < mejor.dist) {
        const t = Math.max(0, Math.min(1, ((p.x - l.a.x) * (l.b.x - l.a.x) + (p.y - l.a.y) * (l.b.y - l.a.y)) /
          ((l.b.x - l.a.x) ** 2 + (l.b.y - l.a.y) ** 2)));
        mejor = { lindero: { x: l.a.x + t * (l.b.x - l.a.x), y: l.a.y + t * (l.b.y - l.a.y), }, huellaP: p, dist: d };
      }
    }
  }
  return mejor;
}

interface Evaluacion {
  h: Punto[];
  sinEnvolvente: boolean;
  resultados: ResultadoRegla[];
  estado: EstadoGlobal;
  dist: number | undefined;
  huellaArea: number;
  superficie: number;
}

function evaluar(): Evaluacion {
  if (estado.calificacion && estado.calificacion !== "RUAIS") {
    return {
      h: [],
      sinEnvolvente: true,
      resultados: [],
      estado: "no-evaluable",
      dist: undefined,
      huellaArea: 0,
      superficie: 0,
    };
  }
  const h = huella();
  const sinEnvolvente = h.length < 3;
  const kernel = construirKernel(h);
  const huellaArea = estado.volumenes.length > 0
    ? estado.volumenes.reduce((a, v) => a + (v.length >= 3 ? areaPoligono(v) : 0), 0)
    : 0;
  if (sinEnvolvente) {
    delete (kernel.edificio as unknown as Record<string, number>).superficieOcupadaProyectada;
    delete (kernel.edificio as unknown as Record<string, number>).superficieEdificadaTotal;
  } else {
    (kernel.edificio as unknown as Record<string, number>).superficieEdificadaTotal = huellaArea * estado.plantas;
  }
  const model = buildModel(kernel);
  if (estado.volumenes.length > 0) {
    (model.edificio as unknown as Record<string, number>).superficieOcupadaProyectada = huellaArea;
  }
  const poligonos = estado.volumenes.length > 0 ? estado.volumenes : [h];
  let distMC: { dist: number; lindero: Punto; huellaP: Punto } | undefined;
  for (const v of poligonos) {
    const mc = masCercano(v);
    if (mc && (!distMC || mc.dist < distMC.dist)) distMC = mc;
  }
  const dist = distMC
    ? Math.round(distMC.dist * 100) / 100
    : (model.edificio as unknown as Record<string, number>).distanciaMinimaLinderos;
  if (distMC) (model.edificio as unknown as Record<string, number>).distanciaMinimaLinderos = dist;
  const superficie = (model.parcela as unknown as Record<string, number>).superficie;
  const edificada = huellaArea * estado.plantas;

  const activas = todasReglas.filter((r) => !r.scope || r.scope.calificacion === "RUAIS");
  const resultados: ResultadoRegla[] = [];
  for (const rule of activas) {
    if (!esEvaluable(rule, model)) continue;
    const violation = evaluateRule(rule, model);
    const r = adaptar(rule.id, { dist, altura: estado.altura, huella: huellaArea, superficie, edificada, plantas: estado.plantas }, violation === null, rule.severity);
    if (r) resultados.push(r);
  }
  resultados.push(sitioLind(estado.linderosRevisados));
  resultados.push(sitioCal(estado.calificacion === "RUAIS"));

  const p = pasos(resultados);
  const porId = new Map(p.map((x) => [x.id, x]));
  const paso02 = porId.get("GR-RUAIS-02");
  if (paso02 && distMC) paso02.anclaPlano = distMC.lindero;
  const paso03 = porId.get("GR-RUAIS-03");
  if (paso03 && h.length >= 3) paso03.anclaPlano = h[0];

  return { h, sinEnvolvente, resultados, estado: estadoGlobal(resultados, sinEnvolvente), dist, huellaArea, superficie };
}

const COLOR: Record<EstadoGlobal, string> = {
  rojo: "var(--ml-rojo)",
  ambar: "var(--ml-ambar)",
  verde: "var(--ml-verde)",
  "sin-envolvente": "var(--ml-neutro)",
  "no-evaluable": "var(--ml-neutro)",
};
const TINTE: Record<EstadoGlobal, string> = {
  rojo: "var(--ml-rojo-tinte)",
  ambar: "var(--ml-ambar-tinte)",
  verde: "var(--ml-verde-tinte)",
  "sin-envolvente": "var(--ml-neutro-tinte)",
  "no-evaluable": "var(--ml-neutro-tinte)",
};
const TINTA: Record<EstadoGlobal, string> = {
  rojo: "var(--ml-rojo-tinta)",
  ambar: "var(--ml-ambar-tinta)",
  verde: "var(--ml-verde-tinta)",
  "sin-envolvente": "var(--ml-sumi-2)",
  "no-evaluable": "var(--ml-sumi-2)",
};

function selloIcone(e: EstadoGlobal): string {
  if (e === "rojo") return `<svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="${TINTA.rojo}" stroke-width="2.2" stroke-linecap="round"/></svg>`;
  if (e === "ambar") return `<svg viewBox="0 0 24 24" fill="none"><path d="M12 5v10" stroke="${TINTA.ambar}" stroke-width="2.2" stroke-linecap="round"/><circle cx="12" cy="19" r="1.4" fill="${TINTA.ambar}"/></svg>`;
  if (e === "verde") return `<svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 5 10-12" stroke="${TINTA.verde}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  return `<svg viewBox="0 0 24 24" fill="none"><path d="M6 12h12" stroke="var(--ml-sumi-2)" stroke-width="2.2" stroke-linecap="round"/></svg>`;
}

function renderPlano(ev: Evaluacion): void {
  const svg = $("plano");
  const c = estado.parcela!.contorno;
  const xs = c.map((p) => p.x);
  const ys = c.map((p) => p.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const m = 2.5;
  vistaObj.minX = minX;
  vistaObj.maxY = maxY;
  vistaObj.m = m;
  vistaObj.baseW = maxX - minX + 2 * m;
  vistaObj.baseH = maxY - minY + 2 * m;
  const W = maxX - minX + 2 * m;
  const H = maxY - minY + 2 * m;
  const sx = (p: Punto) => p.x - minX + m;
  const sy = (p: Punto) => maxY - p.y + m;
  const svgPt = (p: Punto) => `${sx(p).toFixed(2)},${sy(p).toFixed(2)}`;
  const kT = 2.4;
  const mono = (t: string, x: number, y: number, tam: number, fill: string, anchor = "middle") =>
    `<text x="${x}" y="${y}" font-family="var(--ml-font-ui)" font-size="${(tam * kT).toFixed(3)}" fill="${fill}" text-anchor="${anchor}">${t}</text>`;

  let out = `<defs><pattern id="rayas-zona" width="1.6" height="1.6" patternTransform="rotate(45)" patternUnits="userSpaceOnUse"><rect width="1.6" height="1.6" fill="var(--ml-kinari)"/><line x1="0" y1="0" x2="0" y2="1.6" stroke="#DB9A2F" stroke-width="0.28"/></pattern></defs>`;
  out += `<polygon points="${c.map(svgPt).join(" ")}" fill="var(--ml-lamina)" stroke="none"/>`;
  estado.parcela!.linderos.forEach((l) => {
    const esFrontal = l.tipo === "frontal";
    out += `<line x1="${sx(l.a)}" y1="${sy(l.a)}" x2="${sx(l.b)}" y2="${sy(l.b)}" stroke="${esFrontal ? "var(--ml-rojo)" : "var(--ml-sumi)"}" stroke-width="${esFrontal ? 0.22 : 0.035}" ${l.tipo === "testero" ? 'stroke-dasharray="0.4 0.25"' : ""}></line>`;
  });

  {
    const zona = poligonoOffsetInterior(c, retranqueoMin());
    if (zona.length >= 3) {
      out += `<polygon data-zona="1" points="${zona.map(svgPt).join(" ")}" fill="url(#rayas-zona)" stroke="var(--ml-sumi-2)" stroke-width="0.05" stroke-dasharray="0.14 0.1" stroke-linecap="round"/>`;
    }
  }

  let mcGlobal: { lindero: Punto; huellaP: Punto; dist: number } | undefined;
  if (!ev.sinEnvolvente) {
    const e = ev.estado;
    if (estado.volumenes.length > 0) {
      estado.volumenes.forEach((v, i) => {
        const sel = estado.activo === i;
        out += `<polygon data-vol="${i}" id="vol-${i}" points="${v.map(svgPt).join(" ")}" fill="var(--ml-ail)" stroke="var(--ml-ail)" stroke-width="${sel ? 0.11 : 0.07}"/>`;
        const cx = v.reduce((a, p) => a + p.x, 0) / v.length;
        const cy = v.reduce((a, p) => a + p.y, 0) / v.length;
        if (esRectangulo(v)) {
          const lado1 = Math.hypot(v[1].x - v[0].x, v[1].y - v[0].y);
          const lado2 = Math.hypot(v[0].x - v[3].x, v[0].y - v[3].y);
          out += mono(`${fmt(lado1, 1)} × ${fmt(lado2, 1)}`, sx({ x: cx, y: cy }), sy({ x: cx, y: cy }) - 0.55 * kT, 0.42, "var(--ml-washi)").replace("<text ", `<text id="vol-dims-${i}" `);
        }
        out += mono(`${fmt(areaPoligono(v))} m²`, sx({ x: cx, y: cy }), sy({ x: cx, y: cy }) + 0.75 * kT, 0.34, "var(--ml-washi)").replace("<text ", `<text id="vol-area-${i}" `);
      });
    } else {
      out += `<polygon id="huella" points="${ev.h.map(svgPt).join(" ")}" fill="${TINTE[e]}" stroke="${COLOR[e]}" stroke-width="0.07"/>`;
      const cx = ev.h.reduce((a, p) => a + p.x, 0) / ev.h.length;
      const cy = ev.h.reduce((a, p) => a + p.y, 0) / ev.h.length;
      out += mono(`${fmt(ev.huellaArea)} m²`, sx({ x: cx, y: cy }), sy({ x: cx, y: cy }) + 0.1, 0.34, "var(--ml-sumi-3)");
    }

    let mc: { lindero: Punto; huellaP: Punto; dist: number } | undefined;
    for (const v of estado.volumenes.length > 0 ? estado.volumenes : [ev.h]) {
      const m = masCercano(v);
      if (m && (!mc || m.dist < mc.dist)) mc = m;
    }
    mcGlobal = mc;
  } else {
    const msg = ev.estado === "no-evaluable"
      ? `${t("zona-no-evaluable")} ${estado.calificacion}${t("no-pack-zona")}`
      : "";
    if (msg) out += `<text x="${W / 2}" y="${H / 2}" font-family="var(--ml-font-veredicto)" font-size="0.6" fill="var(--ml-sumi-2)" text-anchor="middle">${msg}</text>`;
  }

  for (const p of pasos(ev.resultados)) {
    if (!p.anclaPlano) continue;
    const col = COLOR[p.severidad === "bloqueo" ? "rojo" : "ambar"];
    out += `<circle cx="${sx(p.anclaPlano)}" cy="${sy(p.anclaPlano)}" r="${(0.28 * kT).toFixed(3)}" fill="var(--ml-lamina)" stroke="${col}" stroke-width="0.05"/>` +
      mono(String(p.n), sx(p.anclaPlano), sy(p.anclaPlano) + 0.14, 0.4, "var(--ml-sumi)");
  }

  if (estado.modoCapa && estado.trazo.length > 0) {
    const puntos = estado.trazo.map(svgPt).join(" ");
    out += `<polyline points="${puntos} ${svgPt(estado.trazo[0])}" fill="none" stroke="var(--ml-ail)" stroke-width="0.05" stroke-dasharray="0.2 0.15"/>`;
    for (const p of estado.trazo) {
      out += `<circle cx="${sx(p)}" cy="${sy(p)}" r="0.15" fill="var(--ml-ail)"/>`;
    }
  }

  if (estado.modoDibujo && estado.dibujo.length > 0) {
    const puntos = estado.dibujo.map(svgPt).join(" ");
    out += `<polyline points="${puntos} ${svgPt(estado.dibujo[0])}" fill="none" stroke="var(--ml-sumi-2)" stroke-width="0.04" stroke-dasharray="0.2 0.15"/>`;
    out += `<circle cx="${sx(estado.dibujo[0])}" cy="${sy(estado.dibujo[0])}" r="0.22" fill="var(--ml-ail)"/>`;
    for (const p of estado.dibujo) {
      out += `<circle cx="${sx(p)}" cy="${sy(p)}" r="0.15" fill="var(--ml-sumi-2)"/>`;
    }
  }

  if (estado.alinearPend) {
    const pv = estado.volumenes[estado.alinearPend.vol];
    if (pv) {
      const a = pv[estado.alinearPend.lado];
      const b = pv[(estado.alinearPend.lado + 1) % pv.length];
      out += `<line x1="${sx(a)}" y1="${sy(a)}" x2="${sx(b)}" y2="${sy(b)}" stroke="var(--ml-ambar)" stroke-width="0.14"/>`;
    }
  }

  const vAct = volActivo();
  out += `<g id="vol-verts">` + (vAct && !ev.sinEnvolvente && estado.activo !== estado.ifcVol
    ? vAct.map((p, i) =>
      `<circle data-vert="${i}" cx="${sx(p)}" cy="${sy(p)}" r="${(0.25 * kT).toFixed(3)}" fill="var(--ml-lamina)" stroke="var(--ml-ail)" stroke-width="0.06"/>`
    ).join("")
    : "") + `</g>`;

  if (!ev.sinEnvolvente) {
    const col = "var(--ml-ail)";
    const tick = 0.14;
    const caras = carasLindero();
    const pvsDibujados: Punto[] = [];
    for (const v of estado.volumenes) {
      const medidas = caras.map((f) => {
        const nx = -f.diry, ny = f.dirx;
        const lenF = Math.hypot(f.b.x - f.a.x, f.b.y - f.a.y);
        let mejor: { d: number; pl: Punto; pv: Punto } | undefined;
        for (const q of v) {
          const s = (q.x - f.a.x) * nx + (q.y - f.a.y) * ny;
          const along = (q.x - f.a.x) * f.dirx + (q.y - f.a.y) * f.diry;
          if (along < 0 || along > lenF) continue;
          const d = Math.abs(s);
          if (d >= 0.05 && (!mejor || d < mejor.d)) {
            mejor = { d, pv: q, pl: { x: q.x - s * nx, y: q.y - s * ny } };
          }
        }
        return mejor ? { ...mejor, dirx: f.dirx, diry: f.diry } : undefined;
      }).filter((m): m is { d: number; pl: Punto; pv: Punto; dirx: number; diry: number } => m !== undefined)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2);
      for (const c of medidas) {
        out += `<line x1="${sx(c.pl)}" y1="${sy(c.pl)}" x2="${sx(c.pv)}" y2="${sy(c.pv)}" stroke="${col}" stroke-width="0.022"/>` +
          `<line x1="${sx({ x: c.pl.x - c.dirx * tick, y: 0 })}" y1="${sy({ x: 0, y: c.pl.y - c.diry * tick })}" x2="${sx({ x: c.pl.x + c.dirx * tick, y: 0 })}" y2="${sy({ x: 0, y: c.pl.y + c.diry * tick })}" stroke="${col}" stroke-width="0.022"/>` +
          `<line x1="${sx({ x: c.pv.x - c.dirx * tick, y: 0 })}" y1="${sy({ x: 0, y: c.pv.y - c.diry * tick })}" x2="${sx({ x: c.pv.x + c.dirx * tick, y: 0 })}" y2="${sy({ x: 0, y: c.pv.y + c.diry * tick })}" stroke="${col}" stroke-width="0.022"/>`;
        const midX = (sx(c.pl) + sx(c.pv)) / 2;
        const midY = (sy(c.pl) + sy(c.pv)) / 2;
        const ddx = sx(c.pv) - sx(c.pl);
        const ddy = sy(c.pv) - sy(c.pl);
        const dl = Math.hypot(ddx, ddy) || 1;
        let pnx = -ddy / dl, pny = ddx / dl;
        if (pny > 0) { pnx = -pnx; pny = -pny; }
        const off = 0.34 * kT;
        const tx = midX + pnx * off;
        const ty = midY + pny * off;
        let ang = (Math.atan2(ddy, ddx) * 180) / Math.PI;
        if (ang > 90) ang -= 180;
        if (ang < -90) ang += 180;
        out += `<text x="${tx}" y="${ty}" font-family="var(--ml-font-ui)" font-size="${(0.42 * kT).toFixed(3)}" fill="${col}" text-anchor="middle" dominant-baseline="middle" transform="rotate(${ang.toFixed(1)} ${tx} ${ty})">${fmt(c.d, 1)} m</text>`;
        pvsDibujados.push(c.pv);
        pvsDibujados.push(c.pl);
      }
    }
    if (mcGlobal && !pvsDibujados.some((pv) =>
      Math.hypot(pv.x - mcGlobal!.huellaP.x, pv.y - mcGlobal!.huellaP.y) < 0.05 ||
      Math.hypot(pv.x - mcGlobal!.lindero.x, pv.y - mcGlobal!.lindero.y) < 0.3)) {
      const colR = ev.resultados.some((r) => r.id === "GR-RUAIS-02" && !r.cumple) ? "var(--ml-rojo-tinta)" : "var(--ml-sumi-2)";
      out += `<line x1="${sx(mcGlobal.lindero)}" y1="${sy(mcGlobal.lindero)}" x2="${sx(mcGlobal.huellaP)}" y2="${sy(mcGlobal.huellaP)}" stroke="${colR}" stroke-width="0.025"/>
        <circle cx="${sx(mcGlobal.lindero)}" cy="${sy(mcGlobal.lindero)}" r="0.06" fill="${colR}"/>
        <circle cx="${sx(mcGlobal.huellaP)}" cy="${sy(mcGlobal.huellaP)}" r="0.06" fill="${colR}"/>`;
      const mcx = (sx(mcGlobal.lindero) + sx(mcGlobal.huellaP)) / 2;
      const mcy = (sy(mcGlobal.lindero) + sy(mcGlobal.huellaP)) / 2;
      const ddxR = sx(mcGlobal.huellaP) - sx(mcGlobal.lindero);
      const ddyR = sy(mcGlobal.huellaP) - sy(mcGlobal.lindero);
      const dlR = Math.hypot(ddxR, ddyR) || 1;
      let pnxR = -ddyR / dlR, pnyR = ddxR / dlR;
      if (pnyR > 0) { pnxR = -pnxR; pnyR = -pnyR; }
      const offR = 0.34 * kT;
      const txR = mcx + pnxR * offR;
      const tyR = mcy + pnyR * offR;
      let angR = (Math.atan2(ddyR, ddxR) * 180) / Math.PI;
      if (angR > 90) angR -= 180;
      if (angR < -90) angR += 180;
      out += `<text x="${txR}" y="${tyR}" font-family="var(--ml-font-ui)" font-size="${(0.42 * kT).toFixed(3)}" fill="${colR}" text-anchor="middle" dominant-baseline="middle" transform="rotate(${angR.toFixed(1)} ${txR} ${tyR})">${fmt(mcGlobal.dist)} m</text>`;
    }
  }

  if (estado.cargando) {
    out += `<text x="${W / 2}" y="${H / 2}" font-family="var(--ml-font-ui)" font-size="0.42" fill="var(--ml-sumi-3)" text-anchor="middle">${t("consultando")}</text>`;
  }

  svg.setAttribute("viewBox", vbGuardada
    ? `${vbGuardada.x} ${vbGuardada.y} ${vbGuardada.w} ${vbGuardada.h}`
    : `0 0 ${W.toFixed(2)} ${H.toFixed(2)}`);
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", `Plano de parcela ${estado.parcela!.nombre}. Estado del proyecto: ${ev.estado}.`);
  svg.innerHTML = out;
}

function actualizarVolPlano(i: number): void {
  const v = estado.volumenes[i];
  if (!v) return;
  const poly = document.getElementById(`vol-${i}`);
  if (!poly) { recalcular(); return; }
  const sx = (p: Punto) => p.x - vistaObj.minX + vistaObj.m;
  const sy = (p: Punto) => vistaObj.maxY + vistaObj.m - p.y;
  const svgPt = (p: Punto) => `${sx(p).toFixed(2)},${sy(p).toFixed(2)}`;
  poly.setAttribute("points", v.map(svgPt).join(" "));
  const cx = v.reduce((a, p) => a + p.x, 0) / v.length;
  const cy = v.reduce((a, p) => a + p.y, 0) / v.length;
  const kT = 2.4;
  const dims = document.getElementById(`vol-dims-${i}`);
  if (dims) {
    if (v.length === 4 && esRectangulo(v)) {
      const l1 = Math.hypot(v[1].x - v[0].x, v[1].y - v[0].y);
      const l2 = Math.hypot(v[0].x - v[3].x, v[0].y - v[3].y);
      dims.textContent = `${fmt(l1, 1)} × ${fmt(l2, 1)}`;
      dims.setAttribute("x", String(sx({ x: cx, y: 0 })));
      dims.setAttribute("y", String(sy({ x: 0, y: cy }) - 0.55 * kT));
    } else {
      dims.textContent = "";
    }
  }
  const area = document.getElementById(`vol-area-${i}`);
  if (area) {
    area.textContent = `${fmt(areaPoligono(v))} m²`;
    area.setAttribute("x", String(sx({ x: cx, y: 0 })));
    area.setAttribute("y", String(sy({ x: 0, y: cy }) + 0.75 * kT));
  }
  const gVerts = document.getElementById("vol-verts");
  if (gVerts) {
    if (estado.activo === i && i !== estado.ifcVol) {
      gVerts.innerHTML = v.map((p, j) =>
        `<circle data-vert="${j}" cx="${sx(p).toFixed(2)}" cy="${sy(p).toFixed(2)}" r="${(0.25 * kT).toFixed(3)}" fill="var(--ml-lamina)" stroke="var(--ml-ail)" stroke-width="0.06"/>`
      ).join("");
    } else {
      gVerts.innerHTML = "";
    }
  }
}

function renderPanel(ev: Evaluacion): void {
  const nBloq = ev.resultados.filter((r) => !r.cumple && r.severidad === "bloqueo").length;
  const sub: Record<EstadoGlobal, string> = {
    rojo: `${nBloq} ${nBloq > 1 ? t("sub-rojo-plur") : t("sub-rojo-sing")}`,
    ambar: t("sub-ambar"),
    verde: t("sub-verde"),
    "sin-envolvente": estado.volumenes.length === 0
      ? t("sub-sin-modelo")
      : t("sub-no-huella"),
    "no-evaluable": t("sub-no-evaluable"),
  };
  const h1: Record<EstadoGlobal, string> = {
    rojo: t("h1-rojo"),
    ambar: t("h1-ambar"),
    verde: t("h1-verde"),
    "sin-envolvente": estado.volumenes.length === 0 ? t("h1-sin-modelo") : t("h1-no-cabe"),
    "no-evaluable": getIdioma() === "en" ? `Not evaluable: zone ${estado.calificacion}.` : `No evaluable: zona ${estado.calificacion}.`,
  };
  const overline: Record<EstadoGlobal, string> = {
    rojo: t("rojo"), ambar: t("ambar"), verde: t("verde"), "sin-envolvente": t("sin-modelo"), "no-evaluable": t("sin-pack"),
  };

  const nCumple = ev.resultados.filter((r) => r.cumple).length;
  const marks = ev.resultados
    .map((r) => {
      const col = r.cumple ? "var(--ml-verde)" : r.severidad === "bloqueo" ? "var(--ml-rojo)" : "var(--ml-ambar)";
      return `<span class="ml-marca-prog" style="background:${col}"></span>`;
    })
    .join("");

  const sinModelo = ev.estado === "sin-envolvente" && estado.volumenes.length === 0;
  const veredicto = sinModelo ? "" : `
    <div class="ml-veredicto" role="status" aria-live="polite">
      <div class="ml-sello" style="border-color:${COLOR[ev.estado]}">${selloIcone(ev.estado)}</div>
      <div class="ml-veredicto-texto" style="flex:1">
        <div class="ml-overline" style="color:${TINTA[ev.estado]}">${overline[ev.estado]}</div>
        <h1 class="ml-h1">${h1[ev.estado]}</h1>
        ${ev.estado === "no-evaluable" ? "" : `<div class="ml-progreso">${marks}<span>${t("cumple-de")} ${nCumple} ${t("de-articulos")} ${ev.resultados.length} · ${sub[ev.estado]}</span></div>`}
      </div>
    </div>`;

  const p = pasos(ev.resultados);
  const pasoModelo = sinModelo ? `
    <div class="ml-paso" data-abierto="0">
      <div class="ml-paso-cab">
        <span class="ml-circulo" style="border-color:${COLOR.ambar};color:${TINTA.ambar}">1</span>
        <span class="ml-paso-cuerpo">
          <span class="ml-accion">${t("paso-modelo")}</span>
          <span class="ml-detalle">${t("paso-modelo-det")}</span>
          <span class="ml-articulo">${t("paso-modelo-tools")}</span>
        </span>
      </div>
    </div>` : "";
  const desplz = sinModelo ? 1 : 0;
  const falta = (p.length === 0 && !sinModelo) ? "" : `
    <div class="ml-falta">
      <h2>${t("lo-que-falta")}</h2>
      ${pasoModelo}
      ${p.map((x) => `
        <div class="ml-paso" data-abierto="${estado.abierto === x.id ? "1" : "0"}">
          <button type="button" class="ml-paso-cab" data-paso="${x.id}" aria-expanded="${estado.abierto === x.id}">
            <span class="ml-circulo" style="border-color:${COLOR[x.severidad === "bloqueo" ? "rojo" : "ambar"]};color:${TINTA[x.severidad === "bloqueo" ? "rojo" : "ambar"]}">${x.n + desplz}</span>
            <span class="ml-paso-cuerpo">
              <span class="ml-accion">${x.accion}</span>
              <span class="ml-detalle">${t("exige")} ${x.exige} · ${t("tienes")} <b style="color:${TINTA[x.severidad === "bloqueo" ? "rojo" : "ambar"]}">${x.valorProyecto}</b></span>
              <span class="ml-articulo">${x.articulo}</span>
            </span>
            <span class="ml-flecha">â–¶</span>
          </button>
          ${estado.abierto === x.id ? `
          <div class="ml-norma">
            <div class="ml-norma-overline">${t("la-norma-dice")}</div>
            <p class="ml-norma-texto">${x.textoNorma}</p>
            <div class="ml-norma-fuente">${x.fuente}</div>
          </div>` : ""}
        </div>`).join("")}
    </div>`;

  $("panel").innerHTML = veredicto + falta;
}

function render(ev: Evaluacion): void {
  for (const id of ["altura", "cargar-ifc", "btn-informe", "vol-crear", "vol-vertices", "capa-crear"]) {
    ($(id) as HTMLButtonElement).disabled = false;
  }
  const inpAlt = $("altura") as HTMLInputElement;
  if (document.activeElement !== inpAlt) inpAlt.value = String(estado.altura).replace(".", ",");
  ($("parcela-nombre") as HTMLElement).textContent = estado.parcela!.nombre;
  ($("parcela-datos") as HTMLElement).textContent =
    `${estado.parcela!.refCatastral ? `Ref. ${estado.parcela!.refCatastral} · ` : ""}${estado.parcela!.areaCatastral ? `${estado.parcela!.areaCatastral} m²` : ""}`;
  ($("ifc-msg") as HTMLElement).textContent = estado.ifcMsg;
  (document.querySelector(".ml-leyenda") as HTMLElement).hidden = false;
  renderPlano(ev);
  renderPanel(ev);
  ($("valor-plantas") as HTMLElement).textContent = String(estado.plantas);
  const selPlantas = $("plantas") as HTMLSelectElement;
  if (document.activeElement !== selPlantas) selPlantas.value = String(estado.plantas);
  ($("plantas") as HTMLSelectElement).disabled = estado.parcela!.deIFC === true;
  const conVol = volActivo() !== null;
  const sinPack = ev.estado === "no-evaluable";
  const deIFC = estado.parcela!.deIFC === true;
  for (const id of ["vol-crear", "vol-vertices", "vol-girar", "vol-espejo-h", "vol-espejo-v", "vol-alinear", "vol-quitar"]) {
    ($(id) as HTMLButtonElement).disabled =
      sinPack
      || (id !== "vol-crear" && id !== "vol-vertices" && !conVol);
  }
  const al = alturaLegal(estado.plantas);
  ($("valor-max") as HTMLElement).textContent = al ? `${fmt(al.valor)} m` : "";
  ($("max-legal") as HTMLElement).textContent = al ? `${t("fija-norma")} ${al.articulo}` : t("sin-regla");
  const pm = plantasMaximas();
  ($("plantas-legal") as HTMLElement).textContent =
    `${t("max-construible")} ${pm.max} ${pm.max > 1 ? t("planta-plur") : t("planta-sing")}${pm.articulo ? ` · art. ${pm.articulo}` : ""}`;
}

function renderVacio(): void {
  ($("parcela-nombre") as HTMLElement).textContent = "";
  ($("parcela-datos") as HTMLElement).textContent = "";
  ($("ifc-msg") as HTMLElement).textContent = "";
  ($("msg") as HTMLElement).textContent = "";
  (document.querySelector(".ml-leyenda") as HTMLElement).hidden = true;
  const svg = $("plano") as unknown as SVGElement;
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("aria-label", t("plano-vacio"));
  svg.innerHTML = `<text x="50" y="50" text-anchor="middle" class="ml-vacio">${t("plano-vacio")}</text>`;
  ($("panel") as HTMLElement).innerHTML = `
    <div class="ml-veredicto" role="status" aria-live="polite">
      <div class="ml-veredicto-texto">
        <div class="ml-overline" style="color:var(--ml-sumi-3)">${t("empieza")}</div>
        <h1 class="ml-h1">${t("busca-parcela")}</h1>
        <div class="ml-progreso"><span>${t("busca-hint")}</span></div>
      </div>
    </div>`;
  for (const id of ["altura", "plantas", "cargar-ifc", "btn-informe", "capa-crear", "capa-descargar",
    "vol-crear", "vol-vertices", "vol-girar", "vol-espejo-h", "vol-espejo-v", "vol-alinear", "vol-quitar"]) {
    const el = $(id) as HTMLInputElement | HTMLButtonElement | HTMLSelectElement;
    el.disabled = true;
  }
  if ((estado.parcela) === null) {
    ($("valor-max") as HTMLElement).textContent = "";
    ($("valor-plantas") as HTMLElement).textContent = "";
    ($("max-legal") as HTMLElement).textContent = "";
    ($("plantas-legal") as HTMLElement).textContent = "";
    ($("altura") as HTMLInputElement).value = "";
    ($("plantas") as HTMLSelectElement).value = "";
  }
}

function recalcular(): void {
  if (!estado.parcela) { renderVacio(); return; }
  render(evaluar());
}

/* â”€â”€ Eventos: franja de instrumentos â”€â”€ */
($("altura") as HTMLInputElement).addEventListener("input", (e) => {
  const v = (e.target as HTMLInputElement).value.replace(",", ".");
  const n = Number(v);
  if (!Number.isNaN(n) && v.trim() !== "") { estado.altura = n; recalcular(); }
});
($("plantas") as HTMLSelectElement).addEventListener("change", (e) => {
  estado.plantas = Number((e.target as HTMLSelectElement).value);
  const al = alturaLegal(estado.plantas);
  if (al) estado.altura = al.valor;
  recalcular();
});
let linderoPendiente: number | null = null;
($("lindero-si") as HTMLButtonElement).addEventListener("click", () => {
  const i = linderoPendiente;
  if (i !== null && estado.parcela) {
    const ls = estado.parcela.linderos;
    const ref = ls[i];
    const ux = ref.b.x - ref.a.x, uy = ref.b.y - ref.a.y;
    const ul = Math.hypot(ux, uy) || 1;
    const mismos: number[] = [];
    ls.forEach((l, j) => {
      const paralelo = Math.abs((ux * (l.b.y - l.a.y) - uy * (l.b.x - l.a.x)) / (ul * (Math.hypot(l.b.x - l.a.x, l.b.y - l.a.y) || 1)));
      if (paralelo > 0.02) return;
      const mismaLinea = Math.abs((l.a.x - ref.a.x) * uy - (l.a.y - ref.a.y) * ux) / ul;
      if (mismaLinea > 0.1) return;
      mismos.push(j);
    });
    ls.forEach((l, j) => {
      if (l.tipo === "frontal" && !mismos.includes(j)) l.tipo = "lateral";
    });
    for (const j of mismos) ls[j].tipo = "frontal";
    estado.linderosRevisados = true;
  }
  linderoPendiente = null;
  ($("modal-lindero") as HTMLElement).hidden = true;
  recalcular();
});
($("lindero-no") as HTMLButtonElement).addEventListener("click", () => {
  linderoPendiente = null;
  ($("modal-lindero") as HTMLElement).hidden = true;
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !($("modal-lindero") as HTMLElement).hidden) {
    linderoPendiente = null;
    ($("modal-lindero") as HTMLElement).hidden = true;
  }
});

/* â”€â”€ Eventos: pasos expandibles (delegado) â”€â”€ */
$("panel").addEventListener("click", (e) => {
  const btn = (e.target as HTMLElement).closest("button[data-paso]") as HTMLElement | null;
  if (!btn) return;
  const id = btn.dataset.paso;
  estado.abierto = estado.abierto === id ? "" : id!;
  recalcular();
});

/* â”€â”€ Volumen: creación, edición, giro y espejo â”€â”€ */
function parseLado(id: string): number {
  return Number(($(id) as HTMLInputElement).value.replace(",", ".")) || 0;
}

function solapa(a: Punto[], b: Punto[]): boolean {
  if (a.some((p) => puntoEnPoligono(p, b))) return true;
  if (b.some((p) => puntoEnPoligono(p, a))) return true;
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      if (seCruzan(a[i], a[(i + 1) % a.length], b[j], b[(j + 1) % b.length])) return true;
    }
  }
  return false;
}

function crearRectangular(): void {
  const largo = parseLado("vol-largo");
  const ancho = parseLado("vol-ancho");
  if (largo <= 0 || ancho <= 0) return;
  const zona = zonaConstruible();
  const zs = zona.map((p) => ({ x: p.x, y: p.y }));
  const xs = zs.map((p) => p.x);
  const ys = zs.map((p) => p.y);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
  const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  const hacer = (px: number, py: number): Punto[] => [
    { x: px - largo / 2, y: py - ancho / 2 }, { x: px + largo / 2, y: py - ancho / 2 },
    { x: px + largo / 2, y: py + ancho / 2 }, { x: px - largo / 2, y: py + ancho / 2 },
  ];
  const cabe = (vol: Punto[]): boolean =>
    contieneEnZona(vol) && !estado.volumenes.some((w) => solapa(vol, w));
  let vol = hacer(cx, cy);
  if (!cabe(vol)) {
    const pasos = [1.5, 3, 4.5, 6, 7.5, 9];
    exterior:
    for (const d of pasos) {
      for (const sx of [0, 1, -1]) {
        for (const sy of [0, 1, -1]) {
          if (sx === 0 && sy === 0) continue;
          const cand = hacer(cx + sx * d, cy + sy * d);
          if (cabe(cand)) { vol = cand; break exterior; }
        }
      }
    }
  }
  if (!contieneEnZona(vol)) {
    ($("msg") as HTMLElement).textContent = t("no-cabe");
    return;
  }
  estado.volumenes.push(vol);
  estado.activo = estado.volumenes.length - 1;
  recalcular();
}

function addVerticeDibujo(p: Punto): void {
  if (!dentroZona(p)) return;
  if (estado.dibujo.length >= 3 && Math.hypot(p.x - estado.dibujo[0].x, p.y - estado.dibujo[0].y) < 0.6) {
    cerrarDibujo();
    return;
  }
  estado.dibujo.push(p);
  recalcular();
}

function cerrarDibujo(): void {
  if (estado.dibujo.length < 3) return;
  if (!contieneEnZona([...estado.dibujo])) {
    ($("msg") as HTMLElement).textContent = t("forma-se-sale");
    return;
  }
  estado.volumenes.push([...estado.dibujo]);
  estado.activo = estado.volumenes.length - 1;
  estado.dibujo = [];
  estado.modoDibujo = false;
  recalcular();
}

function cancelarDibujo(): void {
  estado.dibujo = [];
  estado.modoDibujo = false;
  recalcular();
}

function centroide(v: Punto[]): Punto {
  return {
    x: v.reduce((a, p) => a + p.x, 0) / v.length,
    y: v.reduce((a, p) => a + p.y, 0) / v.length,
  };
}

function esRectangulo(v: Punto[]): boolean {
  if (v.length !== 4) return false;
  const e = (i: number) => ({ x: v[(i + 1) % 4].x - v[i].x, y: v[(i + 1) % 4].y - v[i].y });
  const dot = (a: Punto, b: Punto) => a.x * b.x + a.y * b.y;
  return Math.abs(dot(e(0), e(1))) < 0.05 && Math.abs(dot(e(1), e(2))) < 0.05;
}

function transformarVol(fn: (p: Punto, c: Punto) => Punto): void {
  const v = volActivo();
  if (!v) return;
  const c = centroide(v);
  const nuevo = v.map((p) => fn(p, c));
  if (estado.activo !== estado.ifcVol && !contieneEnZona(nuevo)) return;
  estado.volumenes[estado.activo!] = nuevo;
  recalcular();
}

($("vol-crear") as HTMLButtonElement).addEventListener("click", crearRectangular);

function cerrarTrazo(): void {
  if (estado.trazo.length < 3) return;
  ($("modal-cal") as HTMLElement).hidden = false;
}
function cancelarTrazo(): void {
  estado.trazo = [];
  estado.modoCapa = false;
  ($("capa-crear") as HTMLElement).style.borderColor = "";
  ($("capa-crear") as HTMLElement).style.background = "";
  recalcular();
}
($("capa-crear") as HTMLButtonElement).addEventListener("click", () => {
  estado.modoCapa = !estado.modoCapa;
  estado.trazo = [];
  ($("capa-crear") as HTMLElement).style.borderColor = estado.modoCapa ? "var(--ml-sumi-2)" : "";
  ($("capa-crear") as HTMLElement).style.background = estado.modoCapa ? "var(--ml-washi)" : "";
  recalcular();
});
($("cal-anadir") as HTMLButtonElement).addEventListener("click", () => {
  if (estado.trazo.length >= 3) {
    const cal = ($("cal-nueva") as HTMLSelectElement).value;
    const anillo = estado.trazo.map((p) => [Number(p.x.toFixed(2)), Number(p.y.toFixed(2))]);
    anillo.push([...anillo[0]]);
    estado.capaNueva.push({ properties: { calificacion: cal }, geometry: { type: "Polygon", coordinates: anillo } });
    estado.trazo = [];
    estado.modoCapa = false;
    ($("capa-crear") as HTMLElement).style.borderColor = "";
    ($("capa-crear") as HTMLElement).style.background = "";
    ($("capa-descargar") as HTMLButtonElement).disabled = false;
    if (estado.parcela) {
      const cc = centroide(estado.parcela.contorno);
      const det = calificacionDetectada(cc);
      if (det) estado.calificacion = det;
    }
  }
  ($("modal-cal") as HTMLElement).hidden = true;
  recalcular();
});
($("cal-cancelar") as HTMLButtonElement).addEventListener("click", () => {
  estado.trazo = [];
  ($("modal-cal") as HTMLElement).hidden = true;
  recalcular();
});
($("capa-descargar") as HTMLButtonElement).addEventListener("click", () => {
  const fcBase = calificacionesJson as unknown as Record<string, unknown>;
  const todo = {
    ...fcBase,
    features: [
      ...((calificacionesJson as unknown as { features?: unknown[] }).features ?? []),
      ...estado.capaNueva.map((f) => ({
        type: "Feature",
        properties: f.properties,
        geometry: { type: "Polygon", coordinates: [f.geometry.coordinates] },
      })),
    ],
  };
  const blob = new Blob([JSON.stringify(todo, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "calificaciones-granada.json";
  a.click();
  URL.revokeObjectURL(a.href);
});

($("vol-vertices") as HTMLButtonElement).addEventListener("click", () => {
  cancelarDibujo();
  estado.modoDibujo = true;
  recalcular();
});
($("vol-girar") as HTMLButtonElement).addEventListener("click", () => {
  if (!volActivo()) return;
  estado.modoGirar = !estado.modoGirar;
  ($("vol-girar") as HTMLElement).style.borderColor = estado.modoGirar ? "var(--ml-sumi-2)" : "";
  ($("vol-girar") as HTMLElement).style.background = estado.modoGirar ? "var(--ml-washi)" : "";
  recalcular();
});
($("vol-espejo-h") as HTMLButtonElement).addEventListener("click", () =>
  transformarVol((p, c) => ({ x: 2 * c.x - p.x, y: p.y })));
($("vol-espejo-v") as HTMLButtonElement).addEventListener("click", () =>
  transformarVol((p, c) => ({ x: p.x, y: 2 * c.y - p.y })));

function ejecutarAlineacion(o: { vol: number; lado: number }, d: { vol: number; lado: number } | { zona: number }): void {
  const v = estado.volumenes[o.vol];
  const a1 = v[o.lado];
  const b1 = v[(o.lado + 1) % v.length];
  let a2: Punto, b2: Punto;
  let cRef: Punto;
  let haciaDentro: boolean;
  if ("zona" in d) {
    const z = carasZona();
    const f = z[d.zona % z.length];
    a2 = f.a;
    b2 = f.b;
    cRef = centroide(zonaConstruible());
    haciaDentro = true;
  } else {
    const w = estado.volumenes[d.vol];
    a2 = w[d.lado];
    b2 = w[(d.lado + 1) % w.length];
    cRef = centroide(w);
    haciaDentro = false;
  }
  const m1 = { x: (a1.x + b1.x) / 2, y: (a1.y + b1.y) / 2 };
  const m2 = { x: (a2.x + b2.x) / 2, y: (a2.y + b2.y) / 2 };
  let rot = Math.atan2(b2.y - a2.y, b2.x - a2.x) - Math.atan2(b1.y - a1.y, b1.x - a1.x);
  if (rot > Math.PI / 2) rot -= Math.PI;
  else if (rot < -Math.PI / 2) rot += Math.PI;
  const len2 = Math.hypot(b2.x - a2.x, b2.y - a2.y) || 1;
  const ex = (b2.x - a2.x) / len2, ey = (b2.y - a2.y) / len2;
  const nx = -ey, ny = ex;
  const sRef = (cRef.x - a2.x) * nx + (cRef.y - a2.y) * ny;
  const deseado = haciaDentro ? Math.sign(sRef) : -Math.sign(sRef);
  const candidatos = [0, Math.PI].map((extra) => {
    const cos = Math.cos(rot + extra), sin = Math.sin(rot + extra);
    let nuevo = v.map((p) => {
      const dx = p.x - m1.x, dy = p.y - m1.y;
      return { x: m1.x + dx * cos - dy * sin + (m2.x - m1.x), y: m1.y + dx * sin + dy * cos + (m2.y - m1.y) };
    });
    const na1 = nuevo[o.lado];
    const nb1 = nuevo[(o.lado + 1) % nuevo.length];
    const tA = (na1.x - a2.x) * ex + (na1.y - a2.y) * ey;
    const tB = (nb1.x - a2.x) * ex + (nb1.y - a2.y) * ey;
    const lo = Math.min(tA, tB), hi = Math.max(tA, tB);
    let dd = 0;
    if (lo < 0) dd = -lo;
    else if (hi > len2) dd = len2 - hi;
    if (dd !== 0) nuevo = nuevo.map((p) => ({ x: p.x + ex * dd, y: p.y + ey * dd }));
    return nuevo;
  });
  const ladoDe = (p: Punto[]) => Math.sign((centroide(p).x - a2.x) * nx + (centroide(p).y - a2.y) * ny);
  candidatos.sort((A, B) => (ladoDe(A) === deseado ? 0 : 1) - (ladoDe(B) === deseado ? 0 : 1));
  for (const nuevo of candidatos) {
    if (o.vol === estado.ifcVol || contieneEnZona(nuevo)) {
      estado.volumenes[o.vol] = nuevo;
      estado.activo = o.vol;
      return;
    }
    if (o.vol === estado.ifcVol) { estado.volumenes[o.vol] = nuevo; estado.activo = o.vol; return; }
    const xs = nuevo.map((p) => (p.x - a2.x) * ex + (p.y - a2.y) * ey);
    const emin = Math.min(...xs);
    const extent = Math.max(...xs) - emin;
    let aplicado: Punto[] | null = null;
    let mejorK = Infinity;
    const objetivo = (len2 - extent) / 2 - emin;
    for (let i = 0; i <= 24; i++) {
      const eminObj = -extent + (i / 24) * (len2 + extent);
      const dd = eminObj - emin;
      if (Math.abs(dd) < 1e-9) continue;
      const cand = nuevo.map((p) => ({ x: p.x + ex * dd, y: p.y + ey * dd }));
      if (contieneEnZona(cand)) {
        const k = Math.abs(dd - objetivo);
        if (k < mejorK) { aplicado = cand; mejorK = k; }
      }
    }
    if (aplicado) {
      estado.volumenes[o.vol] = aplicado;
      estado.activo = o.vol;
      return;
    }
  }
  ($("msg") as HTMLElement).textContent = t("alineacion-no-cabe");
}

function salirModoAlinear(): void {
  estado.modoAlinear = false;
  estado.alinearPend = null;
  ($("vol-alinear") as HTMLElement).style.borderColor = "";
  ($("vol-alinear") as HTMLElement).style.background = "";
}
($("vol-alinear") as HTMLButtonElement).addEventListener("click", () => {
  if (estado.modoAlinear) { salirModoAlinear(); recalcular(); return; }
  estado.modoAlinear = true;
  estado.alinearPend = null;
  ($("vol-alinear") as HTMLElement).style.borderColor = "var(--ml-sumi-2)";
  ($("vol-alinear") as HTMLElement).style.background = "var(--ml-washi)";
  recalcular();
});

($("vol-quitar") as HTMLButtonElement).addEventListener("click", () => {
  if (estado.parcela?.deIFC === true && estado.activo === estado.ifcVol) borrarIFC(); else quitarVolumen();
});
function quitarVolumen(): void {
  if (estado.activo !== null) {
    estado.volumenes.splice(estado.activo, 1);
    estado.activo = estado.volumenes.length > 0 ? Math.min(estado.activo, estado.volumenes.length - 1) : null;
  } else if (estado.volumenes.length > 0) {
    estado.volumenes.pop();
    estado.activo = null;
  }
  estado.modoGirar = false;
  ($("vol-girar") as HTMLElement).style.borderColor = "";
  ($("vol-girar") as HTMLElement).style.background = "";
  recalcular();
}
function borrarIFC(): void {
  const ifcIdx = PARCELAS.findIndex((x) => x.id === estado.parcela!.id);
  if (ifcIdx !== -1) PARCELAS.splice(ifcIdx, 1);
  const original = PARCELAS.find((x) => x.id === estado.parcela!.id.replace(/-ifc$/, ""));
  if (estado.ifcVol !== null) {
    estado.volumenes.splice(estado.ifcVol, 1);
    estado.ifcVol = null;
  }
  estado.activo = estado.volumenes.length > 0
    ? Math.min(estado.activo ?? estado.volumenes.length - 1, estado.volumenes.length - 1)
    : null;
  estado.ifcMsg = "";
  estado.plantas = 1;
  estado.altura = alturaLegal(1)?.valor ?? 0;
  if (original) estado.parcela = original;
  recalcular();
}
document.addEventListener("keydown", (e) => {
  if (estado.modoCapa) {
    if (e.key === "Enter") cerrarTrazo();
    if (e.key === "Escape") cancelarTrazo();
    return;
  }
  if (estado.modoDibujo) {
    if (e.key === "Enter") cerrarDibujo();
    if (e.key === "Escape") cancelarDibujo();
    return;
  }
  if (e.key !== "Escape") return;
  if (estado.modoAlinear) { salirModoAlinear(); recalcular(); return; }
  if (!($("dim-popup") as HTMLElement).hidden) { cerrarDimPopup(); return; }
  if ((e.target as HTMLElement).closest?.("input, select, textarea")) return;
  if (estado.volumenes.length === 0) return;
  if (estado.parcela!.deIFC === true && estado.activo === estado.ifcVol) borrarIFC(); else quitarVolumen();
});

function insertarVertice(p: Punto): boolean {
  const v = estado.modoDibujo ? estado.dibujo : volActivo();
  if (!v || v.length < 2) return false;
  let mejor: { idx: number; punto: Punto; dist: number } | undefined;
  for (let i = 0; i < v.length; i++) {
    const a = v[i];
    const b = v[(i + 1) % v.length];
    const abx = b.x - a.x, aby = b.y - a.y;
    const ab2 = abx * abx + aby * aby;
    if (ab2 === 0) continue;
    const t = Math.max(0, Math.min(1, ((p.x - a.x) * abx + (p.y - a.y) * aby) / ab2));
    const proy = { x: a.x + t * abx, y: a.y + t * aby };
    const d = Math.hypot(p.x - proy.x, p.y - proy.y);
    if (!mejor || d < mejor.dist) mejor = { idx: i, punto: proy, dist: d };
  }
  if (!mejor || mejor.dist > 0.8) return false;
  if (v.some((q) => Math.hypot(q.x - mejor!.punto.x, q.y - mejor!.punto.y) < 0.3)) return false;
  v.splice(mejor.idx + 1, 0, mejor.punto);
  recalcular();
  return true;
}

function ladosRect(v: Punto[]): { u1: Punto; u2: Punto; l1: number; l2: number } {
  const ax = v[1].x - v[0].x, ay = v[1].y - v[0].y;
  const bx = v[0].x - v[3].x, by = v[0].y - v[3].y;
  const l1 = Math.hypot(ax, ay) || 1;
  const l2 = Math.hypot(bx, by) || 1;
  return { u1: { x: ax / l1, y: ay / l1 }, u2: { x: bx / l2, y: by / l2 }, l1, l2 };
}

function abrirDimPopup(e: PointerEvent): void {
  const v = volActivo();
  if (!v) return;
  const esRect = v.length === 4 && esRectangulo(v);
  const { l1, l2 } = esRect ? ladosRect(v) : { l1: 0, l2: 0 };
  const w = esRect ? l1 : Math.max(...v.map((p) => p.x)) - Math.min(...v.map((p) => p.x));
  const h = esRect ? l2 : Math.max(...v.map((p) => p.y)) - Math.min(...v.map((p) => p.y));
  ($("vol-largo") as HTMLInputElement).value = String(Math.round(w * 100) / 100);
  ($("vol-ancho") as HTMLInputElement).value = String(Math.round(h * 100) / 100);
  const popup = $("dim-popup") as HTMLElement;
  const wrap = popup.parentElement as HTMLElement;
  const wr = wrap.getBoundingClientRect();
  let left = e.clientX - wr.left + 14;
  let top = e.clientY - wr.top + 14;
  left = Math.max(8, Math.min(left, wr.width - 260));
  top = Math.max(8, Math.min(top, wr.height - 70));
  popup.style.left = `${left}px`;
  popup.style.top = `${top}px`;
  popup.hidden = false;
  ($("vol-largo") as HTMLInputElement).focus();
}

function cerrarDimPopup(): void {
  ($("dim-popup") as HTMLElement).hidden = true;
}

function aplicarDims(): void {
  const v = volActivo();
  if (!v || estado.activo === estado.ifcVol) return;
  const largo = parseLado("vol-largo");
  const ancho = parseLado("vol-ancho");
  if (largo <= 0 || ancho <= 0) return;
  const c = centroide(v);
  let nuevo: Punto[];
  if (v.length === 4 && esRectangulo(v)) {
    const { u1, u2, l1, l2 } = ladosRect(v);
    const f1 = largo / l1, f2 = ancho / l2;
    const anclas: Punto[] = [
      ...v,
      ...v.map((q, i) => ({ x: (q.x + v[(i + 1) % 4].x) / 2, y: (q.y + v[(i + 1) % 4].y) / 2 })),
      c,
    ];
    let aplicable: Punto[] | null = null;
    for (const an of anclas) {
      const cand = v.map((p) => {
        const a = (p.x - an.x) * u1.x + (p.y - an.y) * u1.y;
        const b = (p.x - an.x) * u2.x + (p.y - an.y) * u2.y;
        return {
          x: an.x + u1.x * a * f1 + u2.x * b * f2,
          y: an.y + u1.y * a * f1 + u2.y * b * f2,
        };
      });
      if (contieneEnZona(cand)) { aplicable = cand; break; }
    }
    if (!aplicable) {
      ($("msg") as HTMLElement).textContent = t("no-cabe-medidas");
      return;
    }
    nuevo = aplicable;
  } else {
    const w = Math.max(...v.map((p) => p.x)) - Math.min(...v.map((p) => p.x));
    const h = Math.max(...v.map((p) => p.y)) - Math.min(...v.map((p) => p.y));
    nuevo = v.map((p) => ({
      x: c.x + (p.x - c.x) * (largo / (w || 1)),
      y: c.y + (p.y - c.y) * (ancho / (h || 1)),
    }));
  }
  if (!contieneEnZona(nuevo)) {
    ($("msg") as HTMLElement).textContent = t("no-cabe-medidas");
    return;
  }
  estado.volumenes[estado.activo!] = nuevo;
  cerrarDimPopup();
  recalcular();
}

($("dim-aplicar") as HTMLButtonElement).addEventListener("click", aplicarDims);
for (const id of ["vol-largo", "vol-ancho"]) {
  ($(id) as HTMLInputElement).addEventListener("keydown", (e) => {
    if (e.key === "Enter") aplicarDims();
    if (e.key === "Escape") cerrarDimPopup();
  });
}

/* â”€â”€ Interacción con el plano: capa de picking geométrico â”€â”€ */
(function configurarInteraccion() {
  const svg = $("plano") as unknown as SVGElement;
  let panMovio = false;
  let movioVol = false;
  let downPt = { x: 0, y: 0 };
  let activo:
    | null
    | { tipo: "mover"; inicio: { x: number; y: number }; origen: Punto[] }
    | { tipo: "girar"; c: Punto; a0: number; origen: Punto[] }
    | { tipo: "pan"; vb: { x: number; y: number; w: number; h: number }; inicio: { x: number; y: number } }
    | { tipo: "vertice"; idx: number }
    | null = null;
  const escala = () => {
    const vb = (svg.getAttribute("viewBox") ?? "0 0 1 1").split(" ").map(Number);
    return vb[2] / (svg as unknown as SVGGraphicsElement).getBoundingClientRect().width;
  };
  const aUTM = (e: { clientX: number; clientY: number }): Punto => {
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(
      (svg as unknown as SVGGraphicsElement).getScreenCTM()!.inverse()
    );
    return { x: pt.x + vistaObj.minX - vistaObj.m, y: vistaObj.maxY + vistaObj.m - pt.y };
  };
  const distSeg = (p: Punto, a: Punto, b: Punto): number => {
    const abx = b.x - a.x, aby = b.y - a.y;
    const ab2 = abx * abx + aby * aby || 1;
    const t = Math.max(0, Math.min(1, ((p.x - a.x) * abx + (p.y - a.y) * aby) / ab2));
    return Math.hypot(p.x - (a.x + t * abx), p.y - (a.y + t * aby));
  };
  type Pick =
    | { tipo: "vertice"; idx: number }
    | { tipo: "lado"; vol: number; lado: number }
    | { tipo: "vol"; vol: number }
    | { tipo: "zona"; lado: number }
    | { tipo: "lindero"; idx: number };
  const pick = (p: Punto, pxTol = 12): Pick | null => {
    const tol = pxTol * escala();
    const vA = volActivo();
    if (vA && estado.activo !== estado.ifcVol) {
      for (let i = 0; i < vA.length; i++) {
        if (Math.hypot(p.x - vA[i].x, p.y - vA[i].y) < tol) return { tipo: "vertice", idx: i };
      }
    }
    let mejorLado: { vol: number; lado: number; d: number } | undefined;
    estado.volumenes.forEach((v, i) => v.forEach((q, j) => {
      const d = distSeg(p, q, v[(j + 1) % v.length]);
      if (d < tol && (!mejorLado || d < mejorLado.d)) mejorLado = { vol: i, lado: j, d };
    }));
    if (mejorLado) return { tipo: "lado", vol: mejorLado.vol, lado: mejorLado.lado };
    for (let i = estado.volumenes.length - 1; i >= 0; i--) {
      if (puntoEnPoligono(p, estado.volumenes[i])) return { tipo: "vol", vol: i };
    }
    let mejorZona: { lado: number; d: number } | undefined;
    carasZona().forEach((f, j) => {
      const d = distSeg(p, f.a, f.b);
      if (d < tol && (!mejorZona || d < mejorZona.d)) mejorZona = { lado: j, d };
    });
    if (mejorZona) return { tipo: "zona", lado: mejorZona.lado };
    let mejorLin: { idx: number; d: number } | undefined;
    estado.parcela?.linderos.forEach((l, i) => {
      const d = distSeg(p, l.a, l.b);
      if (d < tol && (!mejorLin || d < mejorLin.d)) mejorLin = { idx: i, d };
    });
    if (mejorLin) return { tipo: "lindero", idx: mejorLin.idx };
    return null;
  };
  const marcaSel = (i: number): void => {
    estado.volumenes.forEach((_, j) => {
      const el = document.getElementById(`vol-${j}`);
      if (el) el.setAttribute("stroke-width", j === i ? "0.11" : "0.07");
    });
  };
  const volDe = (p: Punto, i: number): { vol: number; lado: number } => {
    const v = estado.volumenes[i];
    let mejor = { j: 0, d: Infinity };
    v.forEach((q, j) => {
      const d = distSeg(p, q, v[(j + 1) % v.length]);
      if (d < mejor.d) mejor = { j, d };
    });
    return { vol: i, lado: mejor.j };
  };
  svg.addEventListener("wheel", (e) => {
    if (!estado.parcela) return;
    e.preventDefault();
    const vb = (svg.getAttribute("viewBox") ?? "0 0 1 1").split(" ").map(Number);
    const [vx, vy, vw, vh] = vb;
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(
      (svg as unknown as SVGGraphicsElement).getScreenCTM()!.inverse()
    );
    const f = e.deltaY < 0 ? 0.85 : 1 / 0.85;
    const nw = Math.min(Math.max(vw * f, vistaObj.baseW / 12), vistaObj.baseW * 1.5);
    const nh = nw * (vh / vw);
    const nx = pt.x - (pt.x - vx) * (nw / vw);
    const ny = pt.y - (pt.y - vy) * (nh / vh);
    vbGuardada = { x: nx, y: ny, w: nw, h: nh };
    svg.setAttribute("viewBox", `${nx} ${ny} ${nw} ${nh}`);
  }, { passive: false });

  svg.addEventListener("pointerdown", (e) => {
    panMovio = false;
    movioVol = false;
    downPt = { x: e.clientX, y: e.clientY };
    if (estado.modoDibujo) { addVerticeDibujo(aUTM(e)); return; }
    if (estado.modoCapa) { estado.trazo.push(aUTM(e)); recalcular(); return; }
    if (estado.modoAlinear) return;
    const pk = pick(aUTM(e));
    if (pk?.tipo === "vertice" && estado.activo !== estado.ifcVol) {
      activo = { tipo: "vertice", idx: pk.idx };
      return;
    }
    if (pk && (pk.tipo === "vol" || pk.tipo === "lado")) {
      estado.activo = pk.vol;
      marcaSel(pk.vol);
      const vol = estado.volumenes[pk.vol];
      const c = centroide(vol);
      if (estado.modoGirar) {
        const p = aUTM(e);
        activo = { tipo: "girar", c, a0: Math.atan2(p.y - c.y, p.x - c.x), origen: vol.map((q) => ({ ...q })) };
      } else {
        activo = { tipo: "mover", inicio: { x: e.clientX, y: e.clientY }, origen: vol.map((p) => ({ ...p })) };
      }
      return;
    }
    if (estado.parcela) {
      const vb = (svg.getAttribute("viewBox") ?? "0 0 1 1").split(" ").map(Number);
      activo = { tipo: "pan", vb: { x: vb[0], y: vb[1], w: vb[2], h: vb[3] }, inicio: { x: e.clientX, y: e.clientY } };
      svg.style.cursor = "grabbing";
    }
  });
  svg.addEventListener("pointermove", (e) => {
    if (!activo) return;
    if (activo.tipo === "pan") {
      const k = activo.vb.w / (svg as unknown as SVGGraphicsElement).getBoundingClientRect().width;
      const nx = activo.vb.x - (e.clientX - activo.inicio.x) * k;
      const ny = activo.vb.y - (e.clientY - activo.inicio.y) * k;
      if (Math.hypot(e.clientX - activo.inicio.x, e.clientY - activo.inicio.y) > 4) panMovio = true;
      vbGuardada = { x: nx, y: ny, w: activo.vb.w, h: activo.vb.h };
      svg.setAttribute("viewBox", `${nx} ${ny} ${activo.vb.w} ${activo.vb.h}`);
      return;
    }
    const vAct = volActivo();
    if (!vAct) return;
    if (activo.tipo === "vertice") {
      const idx = activo.idx;
      let p = aUTM(e);
      const v = vAct;
      const construir = (t1: number, t2: number) => {
        const nuevo = v.map((q) => ({ ...q }));
        nuevo[(idx + 1) % 4] = { x: v[(idx + 2) % 4].x + (v[(idx + 1) % 4].x - v[(idx + 2) % 4].x) * t1, y: v[(idx + 2) % 4].y + (v[(idx + 1) % 4].y - v[(idx + 2) % 4].y) * t1 };
        nuevo[(idx + 3) % 4] = { x: v[(idx + 2) % 4].x + (v[(idx + 3) % 4].x - v[(idx + 2) % 4].x) * t2, y: v[(idx + 2) % 4].y + (v[(idx + 3) % 4].y - v[(idx + 2) % 4].y) * t2 };
        nuevo[idx] = { x: nuevo[(idx + 1) % 4].x + nuevo[(idx + 3) % 4].x - v[(idx + 2) % 4].x, y: nuevo[(idx + 1) % 4].y + nuevo[(idx + 3) % 4].y - v[(idx + 2) % 4].y };
        return nuevo;
      };
      if (v.length === 4 && esRectangulo(v)) {
        const opp = v[(idx + 2) % 4];
        const e1 = { x: v[(idx + 1) % 4].x - opp.x, y: v[(idx + 1) % 4].y - opp.y };
        const e2 = { x: v[(idx + 3) % 4].x - opp.x, y: v[(idx + 3) % 4].y - opp.y };
        const det = e1.x * e2.y - e2.x * e1.y;
        if (Math.abs(det) < 1e-9) return;
        const rx = p.x - opp.x, ry = p.y - opp.y;
        const t1o = Math.max(0.05, (rx * e2.y - ry * e2.x) / det);
        const t2o = Math.max(0.05, (e1.x * ry - e1.y * rx) / det);
        let t1 = t1o, t2 = t2o;
        if (!contieneEnZona(construir(t1o, t2o))) {
          let lo = 0, hi = 1;
          for (let i = 0; i < 10; i++) {
            const s = (lo + hi) / 2;
            if (contieneEnZona(construir(1 + s * (t1o - 1), 1 + s * (t2o - 1)))) lo = s; else hi = s;
          }
          t1 = 1 + lo * (t1o - 1);
          t2 = 1 + lo * (t2o - 1);
        }
        estado.volumenes[estado.activo!] = construir(t1, t2);
        actualizarVolPlano(estado.activo!);
        movioVol = true;
        return;
      }
      const p0 = v[idx];
      let cand = v.map((q, j) => (j === idx ? p : q));
      if (!dentroZona(p) || !contieneEnZona(cand)) {
        let lo = 0, hi = 1;
        const puntoS = (s: number) => ({ x: p0.x + (p.x - p0.x) * s, y: p0.y + (p.y - p0.y) * s });
        let mejor = puntoS(0);
        for (let i = 0; i < 10; i++) {
          const s = (lo + hi) / 2;
          const ps = puntoS(s);
          if (dentroZona(ps) && contieneEnZona(v.map((q, j) => (j === idx ? ps : q)))) { lo = s; mejor = ps; } else hi = s;
        }
        p = mejor;
        cand = v.map((q, j) => (j === idx ? p : q));
        if (!contieneEnZona(cand)) return;
      }
      estado.volumenes[estado.activo!] = cand;
      actualizarVolPlano(estado.activo!);
      movioVol = true;
    } else if (activo.tipo === "girar") {
      const { c, a0, origen } = activo;
      const p = aUTM(e);
      const da = Math.atan2(p.y - c.y, p.x - c.x) - a0;
      const cos = Math.cos(da), sin = Math.sin(da);
      const nuevo = origen.map((q) => ({
        x: c.x + (q.x - c.x) * cos - (q.y - c.y) * sin,
        y: c.y + (q.x - c.x) * sin + (q.y - c.y) * cos,
      }));
      if (estado.activo !== estado.ifcVol && !contieneEnZona(nuevo)) return;
      estado.volumenes[estado.activo!] = nuevo;
      actualizarVolPlano(estado.activo!);
      movioVol = true;
    } else if (activo.tipo === "mover") {
      const k = escala();
      const dx = (e.clientX - activo.inicio.x) * k;
      const dy = -((e.clientY - activo.inicio.y) * k);
      let nuevo = activo.origen.map((p) => ({ x: p.x + dx, y: p.y + dy }));
      if (estado.activo !== estado.ifcVol && !contieneEnZona(nuevo)) {
        let lo = 0, hi = 1;
        for (let i = 0; i < 12; i++) {
          const t = (lo + hi) / 2;
          const pr = activo.origen.map((p) => ({ x: p.x + dx * t, y: p.y + dy * t }));
          if (contieneEnZona(pr)) lo = t; else hi = t;
        }
        nuevo = activo.origen.map((p) => ({ x: p.x + dx * lo, y: p.y + dy * lo }));
        if (!contieneEnZona(nuevo)) return;
      }
      estado.volumenes[estado.activo!] = nuevo;
      actualizarVolPlano(estado.activo!);
      movioVol = true;
    }
  });
  svg.addEventListener("click", (e) => {
    const arrastro = panMovio || Math.hypot(e.clientX - downPt.x, e.clientY - downPt.y) > 4;
    if (arrastro) { panMovio = false; return; }
    const p = aUTM(e);
    const pk = pick(p);
    if (estado.modoGirar && !(pk && (pk.tipo === "vol" || pk.tipo === "lado"))) {
      estado.modoGirar = false;
      ($("vol-girar") as HTMLElement).style.borderColor = "";
      ($("vol-girar") as HTMLElement).style.background = "";
      recalcular();
      return;
    }
    if (estado.modoAlinear) {
      let sel: { vol: number; lado: number } | null = null;
      let selZona: number | null = null;
      if (pk?.tipo === "lado") {
        sel = { vol: pk.vol, lado: pk.lado };
      } else if (pk?.tipo === "vol") {
        sel = volDe(p, pk.vol);
      } else if (pk?.tipo === "vertice") {
        sel = volDe(p, estado.activo!);
      } else if (pk?.tipo === "zona") {
        selZona = pk.lado;
      }
      if (selZona !== null && estado.alinearPend) {
        ejecutarAlineacion(estado.alinearPend, { zona: selZona });
        salirModoAlinear();
        recalcular();
        return;
      }
      if (sel) {
        if (!estado.alinearPend) {
          estado.alinearPend = sel;
          recalcular();
          return;
        }
        if (sel.vol === estado.alinearPend.vol) {
          ($("msg") as HTMLElement).textContent = t("elige-otra-cara");
          return;
        }
        ejecutarAlineacion(estado.alinearPend, sel);
        salirModoAlinear();
        recalcular();
        return;
      }
      ($("msg") as HTMLElement).textContent = t("pulsa-cara");
      return;
    }
    if (pk?.tipo === "lindero" && !estado.modoDibujo && !estado.modoCapa && estado.parcela) {
      linderoPendiente = pk.idx;
      ($("modal-lindero") as HTMLElement).hidden = false;
    }
  });
  svg.addEventListener("dblclick", (e) => {
    if ((e.target as Element).closest(".ml-dim-popup")) return;
    const p = aUTM(e);
    if (estado.modoCapa) {
      estado.trazo.pop();
      cerrarTrazo();
      return;
    }
    if (estado.modoDibujo) { cerrarDibujo(); return; }
    if (!estado.parcela) return;
    if (insertarVertice(p)) return;
    for (let i = estado.volumenes.length - 1; i >= 0; i--) {
      if (puntoEnPoligono(p, estado.volumenes[i])) {
        if (i === estado.ifcVol) return;
        estado.activo = i;
        marcaSel(i);
        abrirDimPopup(e as PointerEvent);
        return;
      }
    }
  });
  svg.addEventListener("pointerup", () => {
    if (movioVol) { movioVol = false; recalcular(); }
    activo = null;
    svg.style.cursor = "";
  });
})();

/* â”€â”€ Eventos: buscador de parcela (en la barra) â”€â”€ */
($("buscar") as HTMLButtonElement).addEventListener("click", () => {
  const q = ($("q") as HTMLInputElement).value.trim();
  if (q) buscarDireccion(q);
});
($("q") as HTMLInputElement).addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const q = ($("q") as HTMLInputElement).value.trim();
    if (q) buscarDireccion(q);
  }
});

async function buscarDireccion(q: string): Promise<void> {
  estado.cargando = true;
  ($("msg") as HTMLElement).textContent = t("buscando");
  recalcular();
  try {
    let x: number;
    let y: number;
    let display_name = q;
    const m = q.match(/^\s*(\d+[.,]?\d*)\s*[,; ]\s*(\d+[.,]?\d*)\s*$/);
    if (m) {
      const a = Number(m[1].replace(",", "."));
      const b = Number(m[2].replace(",", "."));
      if (a <= 90 && b <= 90 && (a > 0 || b > 0) && q.includes(",")) {
        ({ x, y } = deGeograficaAUTM(a, b));
      } else {
        x = a;
        y = b;
      }
    } else {
      const geo = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`).then((r) => r.json());
      if (!Array.isArray(geo) || geo.length === 0) throw new Error("no encontrada");
      ({ lat: x, lon: y } = geo[0]);
      display_name = geo[0].display_name;
      ({ x, y } = deGeograficaAUTM(Number(x), Number(y)));
    }
    const gml = await fetch(urlWFSParcelasPorPunto(x, y, 30)).then((r) => r.text());
    const parcelas = parsearParcelasGML(gml);
    const lote = seleccionarParcelaRepresentativa(parcelas, 150, 5000, { x, y });
    if (!lote) throw new Error("sin parcela apta");
    const nueva: ParcelaUI = {
      id: "busqueda",
      nombre: `${getIdioma() === "en" ? "Search" : "Búsqueda"}: ${display_name.split(",").slice(0, 3).join(",")}`,
      refCatastral: lote.ref,
      areaCatastral: lote.area,
      contorno: lote.puntos,
      linderos: tiparLinderos(lote.puntos),
    };
    const idx = PARCELAS.findIndex((p) => p.id === "busqueda");
    if (idx !== -1) PARCELAS[idx] = nueva; else PARCELAS.push(nueva);
    estado.parcela = nueva;
    vbGuardada = null;
    estado.volumenes = [];
    estado.activo = null;
    estado.plantas = 1;
    estado.altura = alturaLegal(1)?.valor ?? 0;
    estado.linderosRevisados = false;
    estado.calificacion = "";
    const cx0 = lote.puntos.reduce((a, p) => a + p.x, 0) / lote.puntos.length;
    const cy0 = lote.puntos.reduce((a, p) => a + p.y, 0) / lote.puntos.length;
    const calDet = calificacionDetectada({ x: cx0, y: cy0 });
    let msgCal = "";
    if (calDet === "RUAIS") {
      estado.calificacion = "RUAIS";
      msgCal = t("cal-ruais");
    } else if (calDet) {
      msgCal = `${t("cal-otra")} ${calDet}${t("cal-otra2")}`;
    } else {
      msgCal = t("cal-sin");
    }
    ($("q") as HTMLInputElement).value = "";
    ($("msg") as HTMLElement).textContent = msgCal;
  } catch (error) {
    ($("msg") as HTMLElement).textContent = `${t("no-encontre")}: ${String(error)}`;
  } finally {
    estado.cargando = false;
    recalcular();
  }
}

/* â”€â”€ Eventos: carga de IFC â”€â”€ */
($("ifc-input") as HTMLInputElement).addEventListener("change", (e) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) cargarIFC(file);
  (e.target as HTMLInputElement).value = "";
});

async function cargarIFC(file: File): Promise<void> {
  estado.ifcMsg = "";
  try {
    const extracto = await fetch("http://localhost:8788/extracto", { method: "POST", body: file }).then((r) => r.json()) as {
      error?: string;
      coordenadasLocales?: boolean;
      edificio: { huella: Punto[]; numeroPlantas: number; alturaMaxima: number };
    };
    if (extracto.error) throw new Error(extracto.error);
    let h = extracto.edificio.huella;
    if (extracto.coordenadasLocales) {
      const xs = estado.parcela!.contorno.map((p) => p.x);
      const ys = estado.parcela!.contorno.map((p) => p.y);
      const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
      const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
      const hx = h.map((p) => p.x);
      const hy = h.map((p) => p.y);
      const dx = cx - (Math.min(...hx) + Math.max(...hx)) / 2;
      const dy = cy - (Math.min(...hy) + Math.max(...hy)) / 2;
      h = h.map((p) => ({ x: p.x + dx, y: p.y + dy }));
    }
    estado.parcela = { ...estado.parcela!, id: `${estado.parcela!.id}-ifc`, deIFC: true };
    estado.volumenes.push(h);
    estado.ifcVol = estado.volumenes.length - 1;
    estado.activo = estado.ifcVol;
    estado.plantas = extracto.edificio.numeroPlantas;
    estado.altura = extracto.edificio.alturaMaxima;
    const ifcIdx = PARCELAS.findIndex((p) => p.id.endsWith("-ifc"));
    if (ifcIdx !== -1) PARCELAS.splice(ifcIdx, 1);
    PARCELAS.push(estado.parcela!);
    estado.ifcMsg = `IFC cargado: ${extracto.edificio.numeroPlantas} plantas, ${fmt(extracto.edificio.alturaMaxima, 1)} m`;
  } catch {
    estado.ifcMsg = "El lector IFC local no responde. Puedes seguir con la huella dibujada.";
  }
  recalcular();
}

($("btn-informe") as HTMLButtonElement).addEventListener("click", () => {
  if (!estado.parcela) return;
  generarInforme();
});

function croquisSVG(): string {
  const svgPlano = document.getElementById("plano") as unknown as SVGElement | null;
  if (!svgPlano) return "";
  const clon = svgPlano.cloneNode(true) as unknown as SVGElement;
  clon.setAttribute("viewBox", `0 0 ${vistaObj.baseW.toFixed(2)} ${vistaObj.baseH.toFixed(2)}`);
  clon.removeAttribute("id");
  let s = new XMLSerializer().serializeToString(clon);
  const TOKENS: Record<string, string> = {
    "washi": "#F6F4EF", "lamina": "#FBFAF7", "kinari": "#EFECE5", "hilo": "#E2DED5",
    "cota": "#C9C4B8", "vacio": "#D9D5CB", "sumi": "#23221F", "sumi-2": "#57554F",
    "sumi-3": "#6E6B64", "sumi-4": "#8A877F", "ail": "#2F4A6D", "ail-hover": "#1E3350",
    "rojo": "#A23A2C", "rojo-tinte": "#F4E6E1", "rojo-tinta": "#7E2A1F",
    "ambar": "#94600F", "ambar-tinte": "#F5ECDC", "ambar-tinta": "#6B450A",
    "verde": "#3E6A40", "verde-tinte": "#E6EEE2", "verde-tinta": "#2D4F2F",
    "neutro": "#57554F", "neutro-tinte": "#EFECE5",
    "font-ui": "Arial, sans-serif", "font-veredicto": "Georgia, serif", "font-medida": "monospace",
  };
  s = s.replace(/var\(--ml-([a-z0-9-]+)\)/g, (_m, k: string) => TOKENS[k] ?? "#333333");
  const frontal = estado.parcela!.linderos.filter((l) => l.tipo === "frontal");
  if (frontal.length > 0) {
    const f0 = frontal[0];
    const dx0 = f0.b.x - f0.a.x, dy0 = f0.b.y - f0.a.y;
    const len0 = Math.hypot(dx0, dy0) || 1;
    const ux = dx0 / len0, uy = dy0 / len0;
    let tmin = Infinity, tmax = -Infinity;
    for (const l of frontal) {
      const ta = (l.a.x - f0.a.x) * ux + (l.a.y - f0.a.y) * uy;
      const tb = (l.b.x - f0.a.x) * ux + (l.b.y - f0.a.y) * uy;
      tmin = Math.min(tmin, ta, tb);
      tmax = Math.max(tmax, ta, tb);
    }
    const mx = f0.a.x + ux * (tmin + tmax) / 2;
    const my = f0.a.y + uy * (tmin + tmax) / 2;
    const X = (p: Punto) => p.x - vistaObj.minX + vistaObj.m;
    const Y = (p: Punto) => vistaObj.maxY + vistaObj.m - p.y;
    const c = estado.parcela!.contorno;
    const cxp = c.reduce((a, p) => a + p.x, 0) / c.length;
    const cyp = c.reduce((a, p) => a + p.y, 0) / c.length;
    let px = -uy;
    let py = ux;
    if (px * (cxp - mx) + py * (cyp - my) > 0) { px = -px; py = -py; }
    const tx = X({ x: mx + px * 1.3, y: 0 });
    const ty = Y({ x: 0, y: my + py * 1.3 });
    let ang = (Math.atan2(Y(f0.b) - Y(f0.a), X(f0.b) - X(f0.a)) * 180) / Math.PI;
    if (ang > 90) ang -= 180;
    if (ang < -90) ang += 180;
    const texto = `<text x="${tx.toFixed(2)}" y="${ty.toFixed(2)}" font-family="Arial, sans-serif" font-size="1" fill="#A23A2C" letter-spacing="0.05" text-anchor="middle" dominant-baseline="middle" transform="rotate(${ang.toFixed(1)} ${tx.toFixed(2)} ${ty.toFixed(2)})">${t("ley-frente")}</text>`;
    s = s.replace("</svg>", `${texto}</svg>`);
  }
  return s;
}

function generarInforme(): void {
  const ev = evaluar();
  const p = estado.parcela!;
  const al = alturaLegal(estado.plantas);
  const fecha = new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
  const croquis = croquisSVG();
  const estadoTexto: Record<EstadoGlobal, string> = {
    rojo: t("h1-rojo"),
    ambar: t("h1-ambar"),
    verde: t("h1-verde"),
    "sin-envolvente": t("h1-no-cabe"),
    "no-evaluable": getIdioma() === "en" ? `Not evaluable: zone ${estado.calificacion}` : `No evaluable: zona ${estado.calificacion}`,
  };
  const nCumple = ev.resultados.filter((r) => r.cumple).length;
  const filas = ev.resultados.map((r) => {
    const est = r.cumple ? t("inf-cumple") : r.severidad === "bloqueo" ? t("inf-no-cumple") : t("inf-pendiente");
    const col = r.cumple ? "#2f6b3a" : r.severidad === "bloqueo" ? "#a63a3a" : "#9a7b1e";
    return `<tr>
        <td class="art">${r.articulo}</td>
        <td>${r.nombreCorto}</td>
        <td>${r.exige}</td>
        <td><b>${r.valorProyecto}</b></td>
        <td class="estado" style="color:${col}">${est}</td>
      </tr>
      <tr class="norma"><td colspan="5"><b>${t("inf-la-norma")}</b> ${r.textoNorma}<span class="fuente">${r.fuente}</span></td></tr>`;
  }).join("");
  const volsDatos = estado.volumenes.map((vol, i) => {
    const w = Math.max(...vol.map((q) => q.x)) - Math.min(...vol.map((q) => q.x));
    const h = Math.max(...vol.map((q) => q.y)) - Math.min(...vol.map((q) => q.y));
    return `${fmt(w, 1)} × ${fmt(h, 1)} m · ${fmt(areaPoligono(vol))} m²`;
  });
  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>MonoLite · Report · ${p.nombre}</title>
<style>
  body { font: 12pt/1.5 Georgia, serif; color: #1a1a1a; max-width: 720pt; margin: 40pt auto; padding: 0 24pt; }
  header { border-bottom: 2pt solid #1a1a1a; padding-bottom: 10pt; margin-bottom: 18pt; }
  .marca { font-family: Arial, sans-serif; font-size: 9pt; letter-spacing: 2pt; }
  h1 { font: 20pt/1.2 Georgia, serif; margin: 6pt 0 2pt; }
  .meta { font: 9pt Arial, sans-serif; color: #555; }
  .veredicto { border: 1pt solid #1a1a1a; padding: 10pt 14pt; margin: 14pt 0; }
  .veredicto .estado { font: 15pt Georgia, serif; font-weight: bold; }
  .veredicto .cuenta { font: 10pt Arial, sans-serif; color: #555; margin-top: 2pt; }
  h2 { font: bold 10pt Arial, sans-serif; letter-spacing: 1.5pt; text-transform: uppercase; margin: 18pt 0 6pt; }
  .datos { width: 100%; border-collapse: collapse; font: 11pt Georgia, serif; }
  .datos td { padding: 3pt 10pt 3pt 0; vertical-align: top; }
  .datos td.k { font: bold 9pt Arial, sans-serif; color: #555; text-transform: uppercase; width: 150pt; }
  table.articulos { width: 100%; border-collapse: collapse; font: 10pt Arial, sans-serif; }
  table.articulos td { padding: 5pt 8pt; border-bottom: 0.5pt solid #ccc; vertical-align: top; }
  td.art { font-weight: bold; white-space: nowrap; }
  td.estado { font-weight: bold; white-space: nowrap; }
  tr.norma td { font: 9pt Georgia, serif; color: #444; border-bottom: 1.5pt solid #1a1a1a; padding-bottom: 10pt; }
  tr.norma .fuente { display: block; margin-top: 3pt; font: 8pt Arial, sans-serif; color: #777; }
  .croquis { border: 1pt solid #ccc; padding: 8pt; margin: 6pt 0 4pt; background: #FFFFFF; }
  .croquis svg { width: 100%; height: auto; display: block; }
  footer { margin-top: 24pt; padding-top: 8pt; border-top: 1pt solid #1a1a1a; font: 8.5pt Arial, sans-serif; color: #555; }
  @media print { body { margin: 0; max-width: none; } }
</style></head><body>
<header>
  <div class="marca">${t("inf-marca")}</div>
  <h1>${p.nombre}</h1>
  <div class="meta">${p.refCatastral ? `${t("inf-ref")} ${p.refCatastral} · ` : ""}${p.areaCatastral ? `${p.areaCatastral} m² · ` : ""}${t("inf-calificacion")} ${estado.calificacion || t("inf-sin-determ")} · ${fecha}</div>
</header>
<div class="veredicto">
  <div class="estado">${estadoTexto[ev.estado]}</div>
  <div class="cuenta">${t("cumple-de")} ${nCumple} ${t("de-articulos")} ${ev.resultados.length} ${t("evaluados")}${ev.sinEnvolvente ? "" : ` · ${t("inf-huella")} ${fmt(ev.huellaArea)} m²`}</div>
</div>
${croquis ? `<h2>${t("inf-croquis")}</h2><div class="croquis">${croquis}</div>` : ""}
<h2>${t("inf-datos")}</h2>
<table class="datos">
  <tr><td class="k">${t("inf-plantas")}</td><td>${estado.plantas}${p.deIFC === true ? ` ${t("inf-segun-ifc")}` : ""}</td></tr>
  <tr><td class="k">${t("inf-altura")}</td><td>${fmt(estado.altura)} m${al ? ` · ${t("inf-alt-max-legal")} ${fmt(al.valor)} m (art. ${al.articulo})` : ""}</td></tr>
  <tr><td class="k">${t("inf-retranqueo")}</td><td>${t("inf-min-legal")} ${fmt(retranqueoMin(), 2)} m · ${t("inf-dist-proy")} ${ev.dist !== undefined ? `${fmt(ev.dist)} m` : "—"}</td></tr>
  ${volsDatos.length > 0 ? `<tr><td class="k">${t("inf-elementos")} (${volsDatos.length})</td><td>${volsDatos.map((d, i) => `${i + 1}. ${d}`).join("<br>")}${p.deIFC === true ? ` ${t("inf-huella-ifc")}` : ""} · ${t("inf-ocup-total")} ${fmt(ev.huellaArea)} m²</td></tr>` : ""}
</table>
<h2>${t("inf-articulos")}</h2>
<table class="articulos">${filas}</table>
<footer>Informe generado por MonoLite a partir del PGOU de Granada 2001 (Título Séptimo · RUAIS). Verificación automática de parámetros urbanísticos; no sustituye el informe urbanístico municipal.</footer>
</body></html>`;
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const w = window.open(url, "_blank");
  if (!w) {
    URL.revokeObjectURL(url);
    return;
  }
  w.addEventListener("load", () => { w.print(); }, { once: true });
}
($("cargar-ifc") as HTMLButtonElement).addEventListener("click", () => {
  if (!estado.parcela) return;
  ($("ifc-input") as HTMLInputElement).click();
});

/* Idioma */
function aplicarIdiomaEstatica(): void {
  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n!);
  });
  document.querySelectorAll<HTMLElement>("[data-i18n-title]").forEach((el) => {
    const v = t(el.dataset.i18nTitle!);
    el.removeAttribute("title");
    el.setAttribute("data-tt", v);
    el.setAttribute("aria-label", v);
  });
  ($("q") as HTMLInputElement).placeholder = t("placeholder-dir");
  ($("q") as HTMLInputElement).setAttribute("aria-label", t("placeholder-dir"));
  ($("altura") as HTMLInputElement).setAttribute("aria-label", t("aria-altura"));
  ($("plantas") as HTMLSelectElement).setAttribute("aria-label", t("aria-plantas"));
}
(function etiquetasHover() {
  const label = $("tool-label");
  const wrap = label.parentElement as HTMLElement;
  const mostrar = (btn: HTMLButtonElement) => {
    if (btn.disabled || btn.hidden || !btn.getAttribute("data-tt")) return;
    label.textContent = btn.getAttribute("data-tt")!;
    label.hidden = false;
    const r = btn.getBoundingClientRect();
    const w = wrap.getBoundingClientRect();
    label.style.left = `${r.right - w.left + 12}px`;
    label.style.top = `${r.top + r.height / 2 - w.top}px`;
  };
  const ocultar = () => { label.hidden = true; };
  for (const btn of document.querySelectorAll<HTMLButtonElement>(".ml-vol-icono")) {
    btn.addEventListener("pointerenter", () => mostrar(btn));
    btn.addEventListener("pointerleave", ocultar);
    btn.addEventListener("pointerdown", ocultar);
  }
  document.addEventListener("pointermove", (e) => {
    if (label.hidden) return;
    const dentro = (e.target as Element | null)?.closest?.(".ml-vol-icono");
    if (!dentro) ocultar();
  });
})();
($("idioma") as HTMLSelectElement).addEventListener("change", (e) => {
  const v = (e.target as HTMLSelectElement).value as Idioma;
  setIdioma(v);
  try { localStorage.setItem("monolite-idioma", v); } catch { /* sin almacenamiento */ }
  aplicarIdiomaEstatica();
  recalcular();
});

/* Inicio */
try {
  const guardado = localStorage.getItem("monolite-idioma");
  if (guardado === "en" || guardado === "es") {
    setIdioma(guardado);
    ($("idioma") as HTMLSelectElement).value = guardado;
  }
} catch { /* sin almacenamiento */ }
aplicarIdiomaEstatica();
recalcular();
