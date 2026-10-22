import type { ResultadoRegla } from "./vista.js";
import { fmt } from "./vista.js";
import { t } from "./i18n.js";

export function esEvaluable(
  rule: { conditions: { mode: string; items: unknown[] } },
  model: Record<string, unknown>
): boolean {
  const resolve = (path: string): unknown => {
    let current: unknown = model;
    for (const key of path.split(".")) {
      if (current === null || current === undefined || typeof current !== "object") return undefined;
      current = (current as Record<string, unknown>)[key];
    }
    return typeof current === "number" ? current : undefined;
  };
  for (const item of rule.conditions.items as Record<string, string>[]) {
    const rutas = item.numerator ? [item.numerator, item.denominator] : [item.parameter];
    if (rutas.some((r) => resolve(r) === undefined)) return false;
  }
  return true;
}

export function sitioLind(linderosRevisados: boolean): ResultadoRegla {
  return {
    id: "SITIO-LIND",
    severidad: "ambar",
    cumple: linderosRevisados,
    nombreCorto: t("sitio-lind-nombre"),
    textoNorma: t("norma-sitio-lind"),
    articulo: t("art-sitio-lind"),
    fuente: "PGOU Granada 2001 · Título Séptimo",
    exige: t("sitio-lind-exige"),
    valorProyecto: linderosRevisados ? t("sitio-lind-conf") : t("sitio-lind-sinconf"),
    accion: t("sitio-lind-accion"),
  };
}

export function sitioCal(confirmada: boolean): ResultadoRegla {
  return {
    id: "SITIO-CAL",
    severidad: "ambar",
    cumple: confirmada,
    nombreCorto: t("sitio-cal-nombre"),
    textoNorma: t("norma-sitio-cal"),
    articulo: t("art-sitio-cal"),
    fuente: "PGOU Granada 2001 · Título Séptimo",
    exige: t("sitio-cal-exige"),
    valorProyecto: confirmada ? t("sitio-cal-ok") : t("sitio-cal-sin"),
    accion: t("sitio-cal-accion"),
  };
}

interface ParamsModel {
  dist: number | undefined;
  altura: number | undefined;
  huella: number | undefined;
  superficie: number | undefined;
  edificada: number | undefined;
  plantas: number;
}

const TEXTO_NORMA: Record<string, { textoKey: string; articulo: string; nombreKey: string }> = {
  "GR-RUAIS-01A": { textoKey: "norma-01A", articulo: "Art. 7.11.6.2.a", nombreKey: "nombre-altura" },
  "GR-RUAIS-01B": { textoKey: "norma-01B", articulo: "Art. 7.11.6.2.b", nombreKey: "nombre-altura" },
  "GR-RUAIS-01C": { textoKey: "norma-01C", articulo: "Art. 7.11.6.2.c", nombreKey: "nombre-altura" },
  "GR-RUAIS-02": { textoKey: "norma-02", articulo: "Art. 7.11.3", nombreKey: "nombre-separacion" },
  "GR-RUAIS-03": { textoKey: "norma-03", articulo: "Art. 7.11.4.1", nombreKey: "nombre-ocupacion" },
  "GR-RUAIS-04B": { textoKey: "norma-04B", articulo: "Art. 7.11.8.1.b", nombreKey: "nombre-edificabilidad" },
  "GR-URB-05": { textoKey: "norma-05", articulo: "Art. 7.3.23.2", nombreKey: "nombre-patio" },
};

export function adaptar(id: string, p: ParamsModel, cumple: boolean, severidad: "bloqueo" | "ambar" | "aviso"): ResultadoRegla | undefined {
  const meta = TEXTO_NORMA[id];
  if (!meta) return undefined;
  const base: ResultadoRegla = {
    id,
    severidad,
    cumple,
    nombreCorto: t(meta.nombreKey),
    textoNorma: t(meta.textoKey),
    articulo: meta.articulo,
    fuente: t("fuente"),
    exige: "",
    valorProyecto: "",
    accion: "",
  };
  if (id === "GR-RUAIS-01A" || id === "GR-RUAIS-01B" || id === "GR-RUAIS-01C") {
    const limite = id.endsWith("A") ? 4.6 : id.endsWith("B") ? 7.9 : 11.2;
    base.exige = `≤ ${fmt(limite)} m`;
    base.valorProyecto = `${fmt(p.altura ?? 0)} m`;
    base.accion = `${t("accion-altura")} ${fmt(Math.max(0, (p.altura ?? 0) - limite))} m`;
  } else if (id === "GR-RUAIS-02") {
    base.exige = "≥ 3,00 m";
    base.valorProyecto = `${fmt(p.dist ?? 0)} m`;
    base.accion = `${t("accion-separar")} ${fmt(Math.max(0, 3 - (p.dist ?? 0)))} ${t("mas-de-cada-lindero")}`;
  } else if (id === "GR-RUAIS-03") {
    const ocup = p.superficie ? (p.huella ?? 0) / p.superficie : 0;
    base.exige = "≤ 30 %";
    base.valorProyecto = `${fmt(ocup * 100, 1)} %`;
    base.accion = `${t("accion-ocupacion")} ${fmt(Math.max(0, (p.huella ?? 0) - 0.3 * (p.superficie ?? 0)), 0)} m²`;
  } else if (id === "GR-RUAIS-04B") {
    const edif = p.edificada ?? 0;
    const lim = 0.6 * (p.superficie ?? 0);
    base.exige = "≤ 0,60 m²t/m²s";
    base.valorProyecto = `${fmt(p.superficie ? edif / p.superficie : 0)} m²t/m²s`;
    base.accion = `${t("accion-edificabilidad")} ${fmt(Math.max(0, edif - lim), 0)} ${t("m2-construidos")}`;
  }
  return base;
}
