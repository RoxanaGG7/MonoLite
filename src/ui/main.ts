import type { KernelModel, LinderoTipo, Punto } from "../core/kernel.js";
import { buildModel } from "../core/derive.js";
import { evaluatePack } from "../engine/evaluator.js";
import { generarInforme } from "../engine/informe.js";
import type { PackMetadata, Rule } from "../engine/rule.js";
import pack from "../../tests/fixtures/granada-sample.json" with { type: "json" };

const ANCHO = 20;
const LARGO = 15;
const ESCALA = 26;

const parcelaContorno: Punto[] = [
  { x: 0, y: 0 },
  { x: ANCHO, y: 0 },
  { x: ANCHO, y: LARGO },
  { x: 0, y: LARGO },
];

const linderos = [
  { tipo: "frontal" as LinderoTipo, a: { x: 0, y: 0 }, b: { x: ANCHO, y: 0 } },
  { tipo: "lateral" as LinderoTipo, a: { x: 0, y: 0 }, b: { x: 0, y: LARGO } },
  { tipo: "lateral" as LinderoTipo, a: { x: ANCHO, y: 0 }, b: { x: ANCHO, y: LARGO } },
  { tipo: "testero" as LinderoTipo, a: { x: ANCHO, y: LARGO }, b: { x: 0, y: LARGO } },
];

const COLOR_LINDERO: Record<LinderoTipo, string> = {
  frontal: "#2563eb",
  lateral: "#9ca3af",
  testero: "#7c3aed",
};

const todasReglas = pack.rules as Rule[];
const CALIFICACIONES = [...new Set(todasReglas.filter((r) => r.scope?.calificacion).map((r) => r.scope!.calificacion))];
const REGLAS_GENERALES = todasReglas.filter((r) => !r.scope?.calificacion);

let calificacionActual = CALIFICACIONES[0] ?? "RUAIS";
let margenHuella = 2.5;
let desplazamiento: Punto = { x: 0, y: 0 };
let plantas = 2;
let altura = 8.2;
let superficieEdificada = 300;

function huella(): Punto[] {
  const base = [
    { x: margenHuella, y: margenHuella },
    { x: ANCHO - margenHuella, y: margenHuella },
    { x: ANCHO - margenHuella, y: LARGO - margenHuella },
    { x: margenHuella, y: LARGO - margenHuella },
  ];
  return base.map((p) => ({
    x: Math.max(0.2, Math.min(ANCHO - 0.2, p.x + desplazamiento.x)),
    y: Math.max(0.2, Math.min(LARGO - 0.2, p.y + desplazamiento.y)),
  }));
}

function construirKernel(): KernelModel {
  return {
    parcela: {
      id: "p1",
      type: "parcela",
      crs: "EPSG:25830",
      superficie: 0,
      contorno: parcelaContorno,
      linderos,
      cotaReferencia: 0,
      calificacion: calificacionActual,
    },
    edificio: {
      alturaMaxima: altura,
      numeroPlantas: plantas,
      superficieEdificadaTotal: superficieEdificada,
      superficieOcupadaProyectada: 0,
      huella: huella(),
    },
    entities: [],
  };
}

function puntosSVG(puntos: Punto[]): string {
  return puntos.map((p) => `${p.x * ESCALA},${(LARGO - p.y) * ESCALA}`).join(" ");
}

function renderDibujo(h: Punto[], bloqueado: boolean): void {
  const svg = document.getElementById("plano") as unknown as { innerHTML: string };
  svg.innerHTML = `
    <polygon points="${puntosSVG(parcelaContorno)}" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
    ${linderos
      .map(
        (l) =>
          `<line x1="${l.a.x * ESCALA}" y1="${(LARGO - l.a.y) * ESCALA}" x2="${l.b.x * ESCALA}" y2="${(LARGO - l.b.y) * ESCALA}" stroke="${COLOR_LINDERO[l.tipo]}" stroke-width="3" stroke-dasharray="6 3"/>`
      )
      .join("\n")}
    <polygon id="huella" points="${puntosSVG(h)}" fill="${bloqueado ? "#ef444433" : "#22c55e33"}" stroke="${bloqueado ? "#ef4444" : "#16a34a"}" stroke-width="2" style="cursor: grab;"/>
  `;
}

function renderInforme(informe: ReturnType<typeof generarInforme>, model: Record<string, unknown>): void {
  const estado = document.getElementById("estado")!;
  const lista = document.getElementById("violaciones")!;
  const edificio = model.edificio as Record<string, number>;
  const parcela = model.parcela as Record<string, number>;

  estado.textContent =
    informe.estado === "verde"
      ? "VERDE — TRAMITABLE"
      : `ROJO — ${informe.violaciones.length} BLOQUEO${informe.violaciones.length > 1 ? "S" : ""}`;
  estado.className = informe.estado === "verde" ? "verde" : "rojo";

  lista.innerHTML =
    informe.violaciones.length === 0
      ? "<li class='ok'>Sin tachones. El proyecto cumple las reglas cargadas.</li>"
      : informe.violaciones
          .map(
            (v) =>
              `<li><strong>${v.ruleId}</strong> — ${v.message}<br/><em>Art.: ${v.source.article} (${v.source.document})</em></li>`
          )
          .join("");

  const datos = document.getElementById("datos")!;
  datos.innerHTML = `
    <tr><td>Superficie de parcela (derivada)</td><td>${parcela.superficie.toFixed(2)} m²</td></tr>
    <tr><td>Ocupación proyectada (derivada)</td><td>${edificio.superficieOcupadaProyectada.toFixed(2)} m²</td></tr>
    <tr><td>Distancia mínima a lindero (derivada)</td><td>${edificio.distanciaMinimaLinderos !== undefined ? edificio.distanciaMinimaLinderos.toFixed(2) + " m" : "—"}</td></tr>
    <tr><td>Edificabilidad actual</td><td>${(Number(edificio.superficieEdificadaTotal) / Number(parcela.superficie)).toFixed(2)} m²t/m²s</td></tr>
  `;

  const cobertura = document.getElementById("cobertura")!;
  cobertura.innerHTML = `
    <p><strong>Evalúa:</strong> ${informe.cobertura.articulos.length} artículos — ${informe.cobertura.evalua.join("; ")} · Calificación ${calificacionActual} + reglas generales</p>
    <p><strong>NO evalúa (declaración de cobertura):</strong></p>
    <ul>${(pack.noCubre ?? []).map((n) => `<li>${n}</li>`).join("")}</ul>
  `;
}

function recalcular(): void {
  const reglasCalificacion = todasReglas.filter((r) => r.scope?.calificacion === calificacionActual);
  const kernel = construirKernel();
  const model = buildModel(kernel);
  const informe = generarInforme([...REGLAS_GENERALES, ...reglasCalificacion], evaluatePack([...REGLAS_GENERALES, ...reglasCalificacion], model), pack as unknown as PackMetadata);

  (document.getElementById("valorMargen") as HTMLElement).textContent = margenHuella.toFixed(1) + " m";
  renderDibujo(kernel.edificio.huella, informe.violaciones.length > 0);
  renderInforme(informe, model);
}

function configurarDrag(): void {
  const svg = document.getElementById("plano") as unknown as SVGElement & { innerHTML: string };
  let arrastrando = false;
  let inicio: Punto | null = null;
  let desplazamientoInicial: Punto | null = null;

  svg.addEventListener("pointerdown", (e) => {
    const huellaEl = (e.target as Element).id;
    if (huellaEl !== "huella") return;
    arrastrando = true;
    inicio = { x: e.offsetX, y: e.offsetY };
    desplazamientoInicial = { ...desplazamiento };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  });
  svg.addEventListener("pointermove", (e) => {
    if (!arrastrando || !inicio || !desplazamientoInicial) return;
    desplazamiento = {
      x: desplazamientoInicial.x + (e.offsetX - inicio.x) / ESCALA,
      y: desplazamientoInicial.y - (e.offsetY - inicio.y) / ESCALA,
    };
    recalcular();
  });
  svg.addEventListener("pointerup", () => {
    arrastrando = false;
    inicio = null;
    desplazamientoInicial = null;
  });
}

function inicializarControles(): void {
  const selector = document.getElementById("calificacion") as HTMLSelectElement;
  selector.innerHTML = CALIFICACIONES.map(
    (c) => `<option value="${c}" ${c === calificacionActual ? "selected" : ""}>${c}</option>`
  ).join("");
  selector.addEventListener("change", () => {
    calificacionActual = selector.value;
    recalcular();
  });

  const margen = document.getElementById("margen") as HTMLInputElement;
  margen.addEventListener("input", () => {
    margenHuella = Number(margen.value);
    desplazamiento = { x: 0, y: 0 };
    recalcular();
  });

  const plantasEl = document.getElementById("plantas") as HTMLSelectElement;
  plantasEl.addEventListener("change", () => {
    plantas = Number(plantasEl.value);
    recalcular();
  });

  const alturaEl = document.getElementById("altura") as HTMLInputElement;
  alturaEl.addEventListener("input", () => {
    altura = Number(alturaEl.value);
    recalcular();
  });

  const edificadaEl = document.getElementById("edificada") as HTMLInputElement;
  edificadaEl.addEventListener("input", () => {
    superficieEdificada = Number(edificadaEl.value);
    recalcular();
  });
}

inicializarControles();
configurarDrag();
recalcular();
