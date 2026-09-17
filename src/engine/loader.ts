import { readFileSync } from "node:fs";
import type { ComputationRule, Rule } from "./rule.js";

export interface Pack {
  jurisdiction: string;
  version: string;
  vigencia?: string;
  rules: Rule[];
  computos?: ComputationRule[];
}

export function parsePack(raw: string): Pack {
  const data = JSON.parse(raw) as Pack;
  if (!data.jurisdiction || typeof data.jurisdiction !== "string") {
    throw new Error("Pack inválido: falta 'jurisdiction'");
  }
  if (!Array.isArray(data.rules)) {
    throw new Error("Pack inválido: 'rules' debe ser un array");
  }
  for (const rule of data.rules) {
    if (!rule.id || !rule.conditions || !rule.source?.article) {
      throw new Error(`Pack inválido: regla incompleta (${rule.id ?? "sin id"})`);
    }
  }
  for (const computo of data.computos ?? []) {
    if (!computo.id || !computo.target || !Array.isArray(computo.formula) || computo.formula.length === 0) {
      throw new Error(`Pack inválido: cómputo incompleto (${computo.id ?? "sin id"})`);
    }
  }
  return data;
}

export function loadPack(path: string): Pack {
  return parsePack(readFileSync(path, "utf8"));
}
