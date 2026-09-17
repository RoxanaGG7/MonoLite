import type { Condition, RatioCondition, Rule, RuleViolation, SimpleCondition } from "./rule.js";

const OPERATORS: Record<Condition["operator"], (a: number, b: number) => boolean> = {
  "<": (a, b) => a < b,
  "<=": (a, b) => a <= b,
  ">": (a, b) => a > b,
  ">=": (a, b) => a >= b,
  "==": (a, b) => a === b,
  "!=": (a, b) => a !== b,
};

export function resolveParameter(path: string, model: Record<string, unknown>): number | undefined {
  let current: unknown = model;
  for (const key of path.split(".")) {
    if (current === null || current === undefined) return undefined;
    if (typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === "number" ? current : undefined;
}

export function isRatioCondition(condition: Condition): condition is RatioCondition {
  return "numerator" in condition;
}

export function checkCondition(condition: Condition, model: Record<string, unknown>): boolean {
  if (isRatioCondition(condition)) {
    const numerator = resolveParameter(condition.numerator, model);
    const denominator = resolveParameter(condition.denominator, model);
    if (numerator === undefined || denominator === undefined || denominator === 0) return false;
    return OPERATORS[condition.operator](numerator / denominator, condition.value);
  }
  const value = resolveParameter((condition as SimpleCondition).parameter, model);
  if (value === undefined) return false;
  const thresholdRaw = (condition as SimpleCondition).value;
  const threshold =
    typeof thresholdRaw === "number"
      ? thresholdRaw
      : (resolveParameter(thresholdRaw.param, model) ?? 0) * (thresholdRaw.factor ?? 1);
  if (threshold === undefined) return false;
  return OPERATORS[condition.operator](value, threshold);
}

export function checkGroup(group: Rule["conditions"], model: Record<string, unknown>): Condition[] {
  const results = group.items.map((c) => ({ c, hit: checkCondition(c, model) }));
  const failed = results.filter((r) => r.hit).map((r) => r.c);
  if (group.mode === "all") return failed.length === group.items.length ? failed : [];
  return failed.length > 0 ? failed : [];
}

export function evaluateRule(rule: Rule, model: Record<string, unknown>): RuleViolation | null {
  const failed = checkGroup(rule.conditions, model);
  if (failed.length === 0) return null;
  return {
    ruleId: rule.id,
    severity: rule.severity,
    message: rule.message,
    source: rule.source,
    failed,
  };
}

export function evaluatePack(rules: Rule[], model: Record<string, unknown>): RuleViolation[] {
  return rules
    .map((r) => evaluateRule(r, model))
    .filter((v): v is RuleViolation => v !== null);
}
