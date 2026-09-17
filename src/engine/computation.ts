import { resolveParameter } from "./evaluator.js";
import type { ComputationRule } from "./rule.js";

export function compute(computo: ComputationRule, model: Record<string, unknown>): number | undefined {
  const params = computo.formula.map((t) => ({ t, v: resolveParameter(t.param, model) }));
  if (params.every((p) => p.v === undefined)) return undefined;
  return params.reduce((acc, p) => acc + (p.v ?? 0) * p.t.coef, 0);
}

export function applyComputations(
  computos: ComputationRule[] | undefined,
  model: Record<string, unknown>
): Record<string, unknown> {
  if (!computos || computos.length === 0) return model;
  const resultado = { ...model };
  for (const computo of computos) {
    const valor = compute(computo, resultado);
    if (valor === undefined) continue;
    const [root, ...rest] = computo.target.split(".");
    if (rest.length === 0) {
      resultado[root] = valor;
    } else {
      const padre = { ...(resultado[root] as Record<string, unknown>) };
      let actual = padre;
      for (let i = 0; i < rest.length - 1; i++) {
        actual[rest[i]] = { ...(actual[rest[i]] as Record<string, unknown>) };
        actual = actual[rest[i]] as Record<string, unknown>;
      }
      actual[rest[rest.length - 1]] = valor;
      resultado[root] = padre;
    }
  }
  return resultado;
}
