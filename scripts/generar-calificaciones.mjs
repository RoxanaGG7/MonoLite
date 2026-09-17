import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const PACK_PATH = resolve(process.cwd(), "Docs-Internal", "packs", "urbanismo-granada", "granada.json");

const CALIFICACIONES = [
  {
    codigo: "RUMC",
    nombre: "Residencial Unifamiliar en Manzana Cerrada",
    parcela: { superficie: 80, frente: 5 },
    ocupacion: 0.8,
    sotanos: 1,
    alturas: { 1: 4.6, 2: 7.9, 3: 11.2 },
    articuloAltura: "7.9.6.4",
    letrasAltura: ["a", "b", "c"],
    edificabilidades: { 2: 1.5, 3: 2.25 },
    articuloEdificabilidad: "7.9.8.1",
    letrasEdificabilidad: ["a", "b"],
    articuloOcupacion: "7.9.4.1",
    articuloParcela: "7.9.2.1",
    articuloSotanos: "7.9.5.1",
  },
  {
    codigo: "RUAL",
    nombre: "Residencial Unifamiliar en Asociaciones Lineales",
    parcela: { superficie: 120, frente: 6 },
    ocupacion: 0.6,
    sotanos: 1,
    alturas: { 1: 4.6, 2: 7.9, 3: 11.2 },
    articuloAltura: "7.10.6.3",
    letrasAltura: ["a", "b", "c"],
    edificabilidades: { 2: 1.2, 3: 1.8 },
    articuloEdificabilidad: "7.10.9.1",
    letrasEdificabilidad: ["a", "b"],
    articuloOcupacion: "7.10.4.1",
    articuloParcela: "7.10.2.1",
    articuloSotanos: "7.10.5.1",
  },
  {
    codigo: "RUAIS",
    nombre: "Residencial Unifamiliar Aislada",
    parcela: { superficie: 250, frente: 10 },
    ocupacion: 0.3,
    sotanos: 1,
    alturas: { 1: 4.6, 2: 7.9, 3: 11.2 },
    articuloAltura: "7.11.6.2",
    letrasAltura: ["a", "b", "c"],
    edificabilidades: { 1: 0.3, 2: 0.6, 3: 0.9 },
    articuloEdificabilidad: "7.11.8.1",
    letrasEdificabilidad: ["a", "b", "c"],
    articuloOcupacion: "7.11.4.1",
    articuloParcela: "7.11.2.1",
    articuloSotanos: "7.11.5.1",
  },
  {
    codigo: "RPMC",
    nombre: "Residencial Plurifamiliar en Manzana Cerrada",
    parcela: { superficie: 120, frente: 6 },
    ocupacion: 0.8,
    sotanos: 4,
    alturas: { 1: 4.6, 2: 7.9, 3: 11.2, 4: 14.5, 5: 17.8, 6: 21.1, 7: 24.4, 8: 27.7 },
    articuloAltura: "7.12.6",
    letrasAltura: null,
    edificabilidades: { 2: 1.6, 3: 2.4, 4: 3.2, 5: 3.8, 6: 4.4, 7: 4.8, 8: 4.8 },
    articuloEdificabilidad: "7.12.8",
    letrasEdificabilidad: null,
    articuloOcupacion: "7.12.4.1",
    articuloParcela: "7.12.2",
    articuloSotanos: "7.12.5.1",
  },
  {
    codigo: "RPBA",
    nombre: "Residencial Plurifamiliar en Bloques Abiertos",
    parcela: { superficie: 500, frente: null },
    ocupacion: 0.5,
    sotanos: 4,
    alturas: { 1: 4.6, 2: 7.9, 3: 11.2, 4: 14.5, 5: 17.8, 6: 21.1, 7: 24.4, 8: 27.7 },
    articuloAltura: "7.13.8",
    letrasAltura: null,
    edificabilidades: { 2: 1.0, 3: 1.5, 4: 2.0, 5: 2.5, 6: 3.0, 7: 3.4, 8: 3.8 },
    articuloEdificabilidad: "7.13.10",
    letrasEdificabilidad: null,
    articuloOcupacion: "7.13.5.1",
    articuloParcela: "7.13.2",
    articuloSotanos: "7.13.6.1",
  },
  {
    codigo: "PM",
    nombre: "Residencial Plurifamiliar en Patio de Manzana",
    parcela: { superficie: 500, frente: null },
    ocupacion: 0.5,
    sotanos: 4,
    alturas: { 1: 4.6, 2: 7.9, 3: 11.2, 4: 14.5, 5: 17.8, 6: 21.1 },
    articuloAltura: "7.14.6",
    letrasAltura: null,
    edificabilidades: { 2: 1.0, 3: 1.5, 4: 2.0, 5: 2.5, 6: 3.0 },
    articuloEdificabilidad: "7.14.8",
    letrasEdificabilidad: null,
    articuloOcupacion: "7.14.4.1",
    articuloParcela: "7.14.2",
    articuloSotanos: "7.14.5.1",
  },
];

const DOC = "PGOU Granada 2001, Título Séptimo (Continuación)";
const FECHA_CONSULTA = "2026-09-17";
const FUENTE_URL = "https://www.granada.org/inet/wpgo.nsf/xtod/8E5351BBD612227AC1256E27007BB09D?open";

function regla(id, article, conditions, severity, message, codigo, nombre) {
  return {
    id,
    version: "0.1.0",
    jurisdiction: "Granada (PGOU 2001)",
    source: { document: DOC, article, fechaConsulta: FECHA_CONSULTA, fuenteUrl: FUENTE_URL },
    scope: { calificacion: codigo },
    conditions,
    severity,
    message,
  };
}

function generar(c) {
  const rules = [];
  const plantasAltura = Object.entries(c.alturas).map(([n, h]) => ({ n: Number(n), h }));
  plantasAltura.forEach(({ n, h }, i) => {
    const article = c.letrasAltura ? `${c.articuloAltura}.${c.letrasAltura[i]}` : c.articuloAltura;
    rules.push(
      regla(
        `GR-${c.codigo}-01${String.fromCharCode(65 + i)}`,
        article,
        {
          mode: "all",
          items: [
            { parameter: "edificio.numeroPlantas", operator: "==", value: n },
            { parameter: "edificio.alturaMaxima", operator: ">", value: h },
          ],
        },
        "bloqueo",
        `Edificio de ${n} planta${n > 1 ? "s" : ""} en calificación ${c.nombre}: la altura máxima es de ${h.toFixed(2).replace(".", ",")} m (art. ${article}).`
      )
    );
  });

  rules.push(
    regla(
      `GR-${c.codigo}-03`,
      c.articuloOcupacion,
      {
        mode: "all",
        items: [
          {
            numerator: "edificio.superficieOcupadaProyectada",
            denominator: "parcela.superficie",
            operator: ">",
            value: c.ocupacion,
          },
        ],
      },
      "bloqueo",
      `La ocupación máxima en calificación ${c.nombre} es del ${(c.ocupacion * 100).toFixed(0)}% de la superficie de parcela por planta (art. ${c.articuloOcupacion}).`
    )
  );

  Object.entries(c.edificabilidades).forEach(([n, v], i) => {
    const article = c.letrasEdificabilidad
      ? `${c.articuloEdificabilidad}.${c.letrasEdificabilidad[i]}`
      : c.articuloEdificabilidad;
    rules.push(
      regla(
        `GR-${c.codigo}-04${String.fromCharCode(65 + i)}`,
        article,
        {
          mode: "all",
          items: [
            { parameter: "edificio.numeroPlantas", operator: "==", value: Number(n) },
            {
              numerator: "edificio.superficieEdificadaTotal",
              denominator: "parcela.superficie",
              operator: ">",
              value: v,
            },
          ],
        },
        "bloqueo",
        `Edificio de ${n} plantas en calificación ${c.nombre}: edificabilidad máxima ${String(v).replace(".", ",")} m²t/m²s (art. ${article}).`
      )
    );
  });

  rules.push(
    regla(
      `GR-${c.codigo}-05`,
      c.articuloParcela,
      {
        mode: "any",
        items: [{ parameter: "parcela.superficie", operator: "<", value: c.parcela.superficie }],
      },
      "bloqueo",
      `Parcela mínima en calificación ${c.nombre}: superficie de ${c.parcela.superficie} m² (art. ${c.articuloParcela}). En suelo urbano ya edificado se considera parcela mínima toda parcela existente.`
    )
  );

  if (c.parcela.frente !== null) {
    rules.push(
      regla(
        `GR-${c.codigo}-06`,
        c.articuloParcela,
        {
          mode: "any",
          items: [{ parameter: "parcela.longitudLinderoFrontal", operator: "<", value: c.parcela.frente }],
        },
        "bloqueo",
        `Parcela mínima en calificación ${c.nombre}: lindero frontal de ${c.parcela.frente} m (art. ${c.articuloParcela}).`
      )
    );
  }

  rules.push(
    regla(
      `GR-${c.codigo}-07`,
      c.articuloSotanos,
      {
        mode: "any",
        items: [{ parameter: "edificio.numeroSotanos", operator: ">", value: c.sotanos }],
      },
      "bloqueo",
      `Máximo ${c.sotanos} planta${c.sotanos > 1 ? "s" : ""} de sótano o semisótano en calificación ${c.nombre} (art. ${c.articuloSotanos}).`
    )
  );

  return rules;
}

const generadas = CALIFICACIONES.flatMap(generar);
const idsGenerados = new Set(generadas.map((r) => r.id));

const pack = JSON.parse(readFileSync(PACK_PATH, "utf8"));
const manuales = pack.rules.filter((r) => !idsGenerados.has(r.id));
pack.rules = [...manuales, ...generadas];
pack.version = "0.7.0";
pack.scope = "Calificaciones RUMC, RUAL, RUAIS, RPMC, RPBA y Patio de Manzana + reglas generales del Título Séptimo";
pack.estado = "vigente";
pack.noCubre = [
  "Normativa sectorial (CTE, REBT, RITE) — pack separado",
  "Catálogos de protección y planes especiales (Alhambra, Albaicín, San Matías)",
  "Condiciones no mecanizadas: separaciones entre edificios de RPBA, frentes máximos de manzana",
  "Normativa de usos (Título Sexto) — en revisión por modificación BOP 230/2024"
];
const articulosMapeados = [...new Set(pack.rules.map((r) => r.source.article))].sort();
pack.cobertura = {
  fuente: "PGOU Granada 2001, Normativa completa del Título Séptimo y ordenanzas por calificación",
  fuenteUrl: FUENTE_URL,
  fechaConsulta: FECHA_CONSULTA,
  articulosMapeados
};

writeFileSync(PACK_PATH, JSON.stringify(pack, null, 2) + "\n", "utf8");
console.log(`Pack generado: ${pack.rules.length} reglas (${manuales.length} manuales + ${generadas.length} generadas de ${CALIFICACIONES.length} calificaciones)`);
console.log(`Cobertura: ${articulosMapeados.length} artículos mapeados | estado: ${pack.estado} | noCubre: ${pack.noCubre.length} exclusiones declaradas`);
