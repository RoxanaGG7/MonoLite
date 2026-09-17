import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const envPath = resolve(process.cwd(), "Docs-Internal", ".env");
const env = {};
for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
  const s = line.trim();
  if (!s || s.startsWith("#")) continue;
  const eq = s.indexOf("=");
  if (eq === -1) continue;
  const k = s.slice(0, eq).trim();
  const v = s.slice(eq + 1).trim();
  if (v) env[k] = v;
}

const imagePath = process.argv[2];
const b64 = readFileSync(imagePath).toString("base64");

const response = await fetch(`${env.GPUFLOW_BASE_URL}/chat/completions`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${env.GPUFLOW_API_KEY}`,
  },
  body: JSON.stringify({
    model: "qwen3-vl-32b-ocr",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Transcribe VERBATIM todo el texto visible en esta imagen de una ficha urbanística del PGOU de Granada, en el orden en que aparece, incluyendo todos los números de las tablas con sus etiquetas. No resumas, no interpretes, solo transcribe.",
          },
          { type: "image_url", image_url: { url: `data:image/gif;base64,${b64}` } },
        ],
      },
    ],
  }),
});

if (!response.ok) {
  console.error("ERROR HTTP", response.status, await response.text());
  process.exit(1);
}
const data = await response.json();
console.log(data.choices[0].message.content);
