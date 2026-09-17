import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

export function parseEnvFile(path: string): Record<string, string> {
  if (!existsSync(path)) return {};
  const out: Record<string, string> = {};
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (value) out[key] = value;
  }
  return out;
}

export function loadEnv(): Record<string, string> {
  const local = parseEnvFile(resolve(process.cwd(), "Docs-Internal", ".env"));
  const fromProcess: Record<string, string> = {};
  for (const [k, v] of Object.entries(process.env)) {
    if (v !== undefined) fromProcess[k] = v;
  }
  return { ...local, ...fromProcess };
}

export interface Capabilities {
  l2: boolean;
  l3: boolean;
  embeddings: boolean;
  modelL2?: string;
  modelL3?: string;
  baseUrl?: string;
}

export function getCapabilities(env: Record<string, string> = loadEnv()): Capabilities {
  const hasKey = Boolean(env.GPUFLOW_API_KEY);
  const baseUrl = env.GPUFLOW_BASE_URL;
  return {
    l2: hasKey && Boolean(env.GPUFLOW_MODEL_L2) && Boolean(baseUrl),
    l3: hasKey && Boolean(env.GPUFLOW_MODEL_L3) && Boolean(baseUrl),
    embeddings: false,
    modelL2: env.GPUFLOW_MODEL_L2,
    modelL3: env.GPUFLOW_MODEL_L3,
    baseUrl,
  };
}
