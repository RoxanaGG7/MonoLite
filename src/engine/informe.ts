import type { PackMetadata, Rule, RuleViolation } from "./rule.js";

export type EstadoInforme = "verde" | "ambar" | "rojo";

export interface Informe {
  estado: EstadoInforme;
  violaciones: RuleViolation[];
  cobertura: {
    evalua: string[];
    articulos: string[];
    noCubre: string[];
    fechaConsulta?: string;
  };
}

const SEVERIDAD_ORDEN: Record<string, number> = { bloqueo: 2, ambar: 1, aviso: 1 };

export function generarInforme(
  rules: Rule[],
  violations: RuleViolation[],
  metadata?: PackMetadata
): Informe {
  const maxSeveridad = violations.reduce((max, v) => Math.max(max, SEVERIDAD_ORDEN[v.severity] ?? 0), 0);
  const estado: EstadoInforme = maxSeveridad >= 2 ? "rojo" : maxSeveridad === 1 ? "ambar" : "verde";

  const documentos = new Set<string>();
  const articulos = new Set<string>();
  for (const rule of rules) {
    documentos.add(rule.source.document);
    articulos.add(rule.source.article);
  }

  return {
    estado,
    violaciones: violations,
    cobertura: {
      evalua: [...documentos].sort(),
      articulos: [...articulos].sort(),
      noCubre: metadata?.noCubre ?? [],
      fechaConsulta: metadata?.cobertura?.fechaConsulta,
    },
  };
}
