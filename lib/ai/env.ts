function readEnv(name: string): string {
  const value = process.env[name];
  if (!value) return "";
  return value.trim().replace(/^["']|["']$/g, "");
}

export function getAIApiKey(): string {
  return readEnv("AI_API_KEY") || readEnv("GROQ_API_KEY");
}

export function getAIProviderName(): string {
  return readEnv("AI_PROVIDER").toLowerCase();
}

export function getAIModel(fallback: string): string {
  return readEnv("AI_MODEL") || fallback;
}
