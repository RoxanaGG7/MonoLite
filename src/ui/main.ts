import type { KernelModel, LinderoTipo, Punto } from "../core/kernel.js";
import { buildModel } from "../core/derive.js";
import { evaluatePack } from "../engine/evaluator.js";
import type { Rule } from "../engine/rule.js";
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

function huella(margen: number): Punto[] {
  return [
    { x: margen, y: margen },
    { x: ANCHO - margen, y: margen },
    { x: ANCHO - margen, y: LARGO - margen },
    { x: margen, y: LARGO - margen },
  ];
}

function construirKernel(margen: number, plantas: number, altura: number, superficieEdificada: number): KernelModel {
  return {
    parcela: {
      id: "p1",
      type: "parcela",
      crs: "EPSG:25830",
      superficie: 0,
      contorno: parcelaContorno,
      linderos,
      cotaReferencia: 0,
      calificacion: "RUAIS",
    },
    edificio: {
      alturaMaxima: altura,
      numeroPlantas: plantas,
      superficieEdificadaTotal: superficieEdificada,
      superficieOcupadaProyectada: 0,
      huella: huella(margen),
    },
    entities: [],
  };
}

function puntosSVG(puntos: Punto[]): string {
  return puntos.map((p) => `${p.x * ESCALA},${LARGO - p.y * ESCALA}`).join(" ");
}

function renderDibujo(margen: number, bloqueado: boolean): void {
  const svg = document.getElementById("plano") as unknown as { innerHTML: string };
  const svgContent = `
    <polygon points="${puntosSVG(parcelaContorno)}" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
    ${linderos
      .map(
        (l) =>
          `<line x1="${l.a.x * ESCALA}" y1="${(LARGO - l.a.y) * ESCALA}" x2="${l.b.x * ESCALA}" y2="${(LARGO - l.b.y) * ESCALA}" stroke="${COLOR_LINDERO[l.tipo]}" stroke-width="3" stroke-dasharray="6 3"/>`
      )
      .join("\n")}
    <polygon points="${puntosSVG(huella(margen))}" fill="${bloqueado ? "#ef444433" : "#22c55e33"}" stroke="${bloqueado ? "#ef4444" : "#16a34a"}" stroke-width="2"/>
  `;
  svg.innerHTML = svgContent;
}

function renderInforme(violaciones: ReturnType<typeof evaluatePack>, model: Record<string, unknown>): void {
  const estado = document.getElementById("estado")!;
  const lista = document.getElementById("violaciones")!;
  const edificio = model.edificio as Record<string, number>;
  const parcela = model.parcela as Record<string, number>;

  if (violaciones.length === 0) {
    estado.textContent = "VERDE — TRAMITABLE";
    estado.className = "verde";
    lista.innerHTML = "<li class='ok'>Sin tachones. El proyecto cumple las reglas cargadas.</li>";
  } else {
    estado.textContent = `ROJO — ${violaciones.length} BLOQUEO${violaciones.length > 1 ? "S" : ""}`;
    estado.className = "rojo";
    lista.innerHTML = violaciones
      .map(
        (v) =>
          `<li><strong>${v.ruleId}</strong> — ${v.message}<br/><em>Art.: ${v.source.article} (${v.source.document})</em></li>`
      )
      .join("");
  }

  const datos = document.getElementById("datos")!;
  datos.innerHTML = `
    <tr><td>Superficie de parcela (derivada)</td><td>${parcela.superficie.toFixed(2)} m²</td></tr>
    <tr><td>Ocupación proyectada (derivada)</td><td>${edificio.superficieOcupadaProyectada.toFixed(2)} m²</td></tr>
    <tr><td>Distancia mínima a lindero (derivada)</td><td>${edificio.distanciaMinimaLinderos !== undefined ? edificio.distanciaMinimaLinderos.toFixed(2) + " m" : "—"}</td></tr>
    <tr><td>Edificabilidad actual</td><td>${(Number(edificio.superficieEdificadaTotal) / Number(parcela.superficie)).toFixed(2)} m²t/m²s</td></tr>
  `;
}

function recalcular(): void {
  const margen = Number((document.getElementById("margen") as HTMLInputElement).value);
  const plantas = Number((document.getElementById("plantas") as HTMLSelectElement).value);
  const altura = Number((document.getElementById("altura") as HTMLInputElement).value);
  const superficieEdificada = Number((document.getElementById("edificada") as HTMLInputElement).value);

  const kernel = construirKernel(margen, plantas, altura, superficieEdificada);
  const model = buildModel(kernel);
  const violaciones = evaluatePack(pack.rules as Rule[], model);

  (document.getElementById("valorMargen") as HTMLElement).textContent = margen.toFixed(1) + " m";
  renderDibujo(margen, violaciones.length > 0);
  renderInforme(violaciones, model);
}

document.addEventListener("input", recalcular);
recalcular();
