export type Severity = "bloqueo" | "ambar" | "aviso";

export type Operator = "<" | "<=" | ">" | ">=" | "==" | "!=";

export type ConditionValue = number | { param: string };

export interface SimpleCondition {
  parameter: string;
  operator: Operator;
  value: ConditionValue;
}

export interface RatioCondition {
  numerator: string;
  denominator: string;
  operator: Operator;
  value: number;
}

export type Condition = SimpleCondition | RatioCondition;

export interface ConditionGroup {
  mode: "all" | "any";
  items: Condition[];
}

export interface RuleSource {
  document: string;
  article: string;
  vigencia?: string;
}

export interface Rule {
  id: string;
  version: string;
  jurisdiction: string;
  source: RuleSource;
  scope?: Record<string, string>;
  conditions: ConditionGroup;
  severity: Severity;
  message: string;
}

export interface RuleViolation {
  ruleId: string;
  severity: Severity;
  message: string;
  source: RuleSource;
  failed: Condition[];
}
