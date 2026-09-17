import { getCapabilities, type Capabilities } from "./capabilities.js";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function chat(tier: "l2" | "l3", messages: ChatMessage[], env: Record<string, string>): Promise<string> {
  const caps: Capabilities = getCapabilities(env);
  if (!caps[tier]) {
    throw new Error(`Capacidad ${tier} no disponible: falta configurar GPU Flow (API key, base URL o modelo). MonoLite funciona sin ella en L0.`);
  }
  const model = tier === "l2" ? caps.modelL2! : caps.modelL3!;
  const response = await fetch(`${caps.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.GPUFLOW_API_KEY}`,
    },
    body: JSON.stringify({ model, messages }),
  });
  if (!response.ok) {
    throw new Error(`GPU Flow respondió ${response.status}: ${await response.text()}`);
  }
  const data = (await response.json()) as { choices: { message: { content: string } }[] };
  return data.choices[0].message.content;
}
