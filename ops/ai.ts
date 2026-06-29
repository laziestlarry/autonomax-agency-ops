// ============================================================
// AUTONOMA-X AI INTELLIGENCE LAYER
// Pluggable provider: Groq (free), DeepSeek (cheap), Gemini (free),
// OpenAI, Ollama, or custom OpenAI-compatible endpoints.
// NEVER returns simulated content — falls through providers until one works.
// ============================================================

import dotenv from 'dotenv';
dotenv.config();

export type AIProviderType = 'groq' | 'deepseek' | 'gemini' | 'openai' | 'custom' | 'ollama';

export type AIProviderID = 'groq' | 'deepseek' | 'gemini' | 'openai' | 'custom' | 'ollama';

const PROVIDER_PRIORITY: AIProviderID[] = ['groq', 'deepseek', 'gemini', 'openai', 'ollama', 'custom'];

interface AIProviderConfig {
  id: AIProviderID;
  label: string;
  baseUrl: string;
  apiKey: string;
  model: string;
  /** Whether this provider uses the OpenAI-compatible /chat/completions endpoint */
  openaiCompatible: boolean;
}

// ============================================================
// All known provider configurations
// ============================================================

function buildProviderConfigs(): AIProviderConfig[] {
  const configs: AIProviderConfig[] = [];

  // --- Groq (free tier, fastest inference) ---
  const groqKey = process.env.GROQ_API_KEY || '';
  if (groqKey) {
    configs.push({
      id: 'groq',
      label: 'Groq (free)',
      baseUrl: 'https://api.groq.com/openai/v1',
      apiKey: groqKey,
      model: process.env.GROQ_MODEL || 'llama3-70b-8192',
      openaiCompatible: true,
    });
  }

  // --- DeepSeek (very cheap, ~$0.14/M tokens) ---
  const deepseekKey = process.env.DEEPSEEK_API_KEY || '';
  if (deepseekKey) {
    configs.push({
      id: 'deepseek',
      label: 'DeepSeek',
      baseUrl: 'https://api.deepseek.com',
      apiKey: deepseekKey,
      model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
      openaiCompatible: true,
    });
  }

  // --- Gemini (free tier via API key) ---
  const geminiKey = process.env.GEMINI_API_KEY || '';
  if (geminiKey) {
    configs.push({
      id: 'gemini',
      label: 'Gemini (free)',
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
      apiKey: geminiKey,
      model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
      openaiCompatible: false, // Different API format
    });
  }

  // --- OpenAI ---
  const openaiKey = process.env.OPENAI_API_KEY || '';
  if (openaiKey) {
    configs.push({
      id: 'openai',
      label: 'OpenAI',
      baseUrl: 'https://api.openai.com/v1',
      apiKey: openaiKey,
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      openaiCompatible: true,
    });
  }

  // --- Ollama (local) ---
  const ollamaUrl = process.env.OLLAMA_BASE_URL || process.env.OLLAMA_HOST || '';
  if (ollamaUrl) {
    configs.push({
      id: 'ollama',
      label: `Ollama (${ollamaUrl})`,
      baseUrl: ollamaUrl.replace(/\/$/, ''),
      apiKey: 'ollama',
      model: process.env.OLLAMA_MODEL || 'llama3',
      openaiCompatible: false,
    });
  }

  // --- Custom OpenAI-compatible endpoint ---
  const customUrl = process.env.AI_BASE_URL || '';
  const customKey = process.env.AI_API_KEY || '';
  if (customUrl) {
    configs.push({
      id: 'custom',
      label: `Custom API (${customUrl})`,
      baseUrl: customUrl.replace(/\/$/, ''),
      apiKey: customKey,
      model: process.env.AI_MODEL || 'gpt-4o-mini',
      openaiCompatible: true,
    });
  }

  return configs;
}

// ============================================================
// Active provider resolution
// ============================================================

let _allConfigs = buildProviderConfigs();

function getActiveConfig(): AIProviderConfig | null {
  const explicit = process.env.AI_PROVIDER?.toLowerCase();

  if (explicit) {
    // Find the matching config by id
    const match = _allConfigs.find(c => c.id === explicit);
    if (match) return match;

    // If explicitly asked but not found, build a config anyway
    const providers = _allConfigs.length > 0
      ? _allConfigs.map(c => c.id).join(', ')
      : 'none available';
    console.warn(`⚠️  AI_PROVIDER="${explicit}" requested but no matching key found. Available: ${providers}`);
    return null;
  }

  // Auto-detect: use the first available provider in priority order
  if (_allConfigs.length > 0) {
    return _allConfigs[0];
  }

  return null;
}

const activeConfig = getActiveConfig();

export const AI_AVAILABLE = activeConfig !== null;
export const AI_PROVIDER_LABEL = activeConfig?.label || 'None';
export const AI_PROVIDER_TYPE = activeConfig?.id || 'none';
export const AI_MODEL = activeConfig?.model || 'none';

// ============================================================
// Chat completion — tries providers in priority order on failure
// ============================================================

interface AIChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AIResponse {
  content: string;
  model: string;
  provider: AIProviderID;
  latencyMs: number;
}

async function chatCompletion(
  messages: AIChatMessage[],
  options?: { temperature?: number; maxTokens?: number; system?: string },
): Promise<AIResponse> {
  const start = Date.now();
  const systemMsg = options?.system || 'You are Autonoma-X Intelligence, an AI business operations engine. Respond concisely and accurately.';

  // Refresh configs in case env changed at runtime
  _allConfigs = buildProviderConfigs();

  // Determine the list of providers to try
  const explicit = process.env.AI_PROVIDER?.toLowerCase();
  let providersToTry: AIProviderConfig[];

  if (explicit) {
    // Try the explicit provider first, then fall through others
    const explicitCfg = _allConfigs.find(c => c.id === explicit);
    if (explicitCfg) {
      providersToTry = [explicitCfg, ..._allConfigs.filter(c => c.id !== explicit)];
    } else {
      providersToTry = _allConfigs;
    }
  } else {
    // Try all available in priority order
    providersToTry = _allConfigs;
  }

  if (providersToTry.length === 0) {
    throw new Error('No AI providers configured. Set GROQ_API_KEY (free), DEEPSEEK_API_KEY, GEMINI_API_KEY, or another AI provider key in .env');
  }

  // Track errors for reporting
  const errors: string[] = [];

  for (const cfg of providersToTry) {
    try {
      const result = await callProvider(cfg, messages, systemMsg, options);
      return {
        content: result,
        model: cfg.model,
        provider: cfg.id,
        latencyMs: Date.now() - start,
      };
    } catch (err: any) {
      errors.push(`${cfg.id}: ${err.message}`);
      console.warn(`⚠️ AI provider "${cfg.id}" failed: ${err.message}. Trying next provider...`);
      continue;
    }
  }

  // All providers failed — throw a real error
  throw new Error(`All AI providers failed:\n  ${errors.join('\n  ')}`);
}

async function callProvider(
  cfg: AIProviderConfig,
  messages: AIChatMessage[],
  systemMsg: string,
  options?: { temperature?: number; maxTokens?: number },
): Promise<string> {
  if (cfg.openaiCompatible) {
    return callOpenAICompatible(cfg, messages, systemMsg, options);
  } else if (cfg.id === 'gemini') {
    return callGemini(cfg, messages, systemMsg, options);
  } else if (cfg.id === 'ollama') {
    return callOllama(cfg, messages, systemMsg, options);
  }
  throw new Error(`Unknown provider type: ${cfg.id}`);
}

// ============================================================
// OpenAI-compatible (Groq, DeepSeek, OpenAI, custom)
// ============================================================

async function callOpenAICompatible(
  cfg: AIProviderConfig,
  messages: AIChatMessage[],
  systemMsg: string,
  options?: { temperature?: number; maxTokens?: number },
): Promise<string> {
  const body: Record<string, any> = {
    model: cfg.model,
    messages: [
      { role: 'system', content: systemMsg },
      ...messages,
    ],
    temperature: options?.temperature ?? 0.3,
    max_tokens: options?.maxTokens ?? 1000,
    stream: false,
  };

  const response = await fetch(`${cfg.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${cfg.apiKey}`,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30000),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => 'Unknown error');
    throw new Error(`${cfg.id} returned ${response.status}: ${errText.slice(0, 300)}`);
  }

  const data = await response.json() as any;
  const content = data.choices?.[0]?.message?.content || '';
  if (!content) throw new Error(`${cfg.id}: empty response`);

  return content;
}

// ============================================================
// Google Gemini API
// ============================================================

async function callGemini(
  cfg: AIProviderConfig,
  messages: AIChatMessage[],
  systemMsg: string,
  options?: { temperature?: number; maxTokens?: number },
): Promise<string> {
  // Gemini uses a different API format
  const geminiMessages = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  // Prepend system instruction
  const body: Record<string, any> = {
    systemInstruction: {
      parts: [{ text: systemMsg }],
    },
    contents: geminiMessages,
    generationConfig: {
      temperature: options?.temperature ?? 0.3,
      maxOutputTokens: options?.maxTokens ?? 1000,
    },
  };

  const response = await fetch(
    `${cfg.baseUrl}/models/${cfg.model}:generateContent?key=${cfg.apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30000),
    },
  );

  if (!response.ok) {
    const errText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Gemini returned ${response.status}: ${errText.slice(0, 300)}`);
  }

  const data = await response.json() as any;

  // Check for blocked content
  if (data.promptFeedback?.blockReason) {
    throw new Error(`Gemini: content blocked (${data.promptFeedback.blockReason})`);
  }

  const candidate = data.candidates?.[0];
  if (!candidate) throw new Error('Gemini: no candidates returned');
  if (candidate.finishReason && candidate.finishReason !== 'STOP') {
    throw new Error(`Gemini: generation stopped (${candidate.finishReason})`);
  }

  const text = candidate.content?.parts?.map((p: any) => p.text).join('') || '';
  if (!text) throw new Error('Gemini: empty response');

  return text;
}

// ============================================================
// Ollama (local)
// ============================================================

async function callOllama(
  cfg: AIProviderConfig,
  messages: AIChatMessage[],
  systemMsg: string,
  options?: { temperature?: number; maxTokens?: number },
): Promise<string> {
  const body: Record<string, any> = {
    model: cfg.model,
    messages: [
      { role: 'system', content: systemMsg },
      ...messages,
    ],
    options: {
      temperature: options?.temperature ?? 0.3,
      num_predict: options?.maxTokens ?? 1000,
    },
    stream: false,
  };

  const response = await fetch(`${cfg.baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30000),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Ollama returned ${response.status}: ${errText.slice(0, 300)}`);
  }

  const data = await response.json() as any;
  const content = data.message?.content || '';
  if (!content) throw new Error('Ollama: empty response');

  return content;
}

// ============================================================
// Convenience wrappers
// ============================================================

/** Generate content from a system prompt and user message */
export async function generate(
  systemPrompt: string,
  userMessage: string,
  options?: { temperature?: number; maxTokens?: number },
): Promise<string> {
  const result = await chatCompletion(
    [{ role: 'user', content: userMessage }],
    { ...options, system: systemPrompt },
  );
  return result.content;
}

/** Structured JSON output from AI */
export async function generateJSON<T>(
  systemPrompt: string,
  userMessage: string,
): Promise<T | null> {
  const result = await chatCompletion(
    [{ role: 'user', content: userMessage }],
    {
      system: `${systemPrompt}\n\nIMPORTANT: Your response must be valid JSON only. No markdown, no code fences, just raw JSON.`,
      temperature: 0.1,
      maxTokens: 2000,
    },
  );

  try {
    // Strip any markdown fences
    const cleaned = result.content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    return JSON.parse(cleaned) as T;
  } catch {
    console.warn('⚠️ AI returned non-JSON response, returning null');
    return null;
  }
}

/** Check if Ollama is reachable (useful for auto-detection) */
export async function checkOllama(): Promise<boolean> {
  const url = process.env.OLLAMA_BASE_URL || process.env.OLLAMA_HOST || 'http://localhost:11434';
  try {
    const res = await fetch(`${url}/api/tags`, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}

/** Get provider status for API endpoint */
export function getProviderStatus() {
  const configs = buildProviderConfigs();
  const active = getActiveConfig();
  return {
    available: active !== null,
    primaryProvider: active?.id || 'none',
    primaryLabel: active?.label || 'None configured',
    model: active?.model || 'none',
    configuredProviders: configs.map(c => ({ id: c.id, label: c.label, model: c.model })),
    totalConfigured: configs.length,
    instructions: configs.length === 0
      ? 'Set GROQ_API_KEY for free tier, DEEPSEEK_API_KEY for cheap inference, GEMINI_API_KEY for free Gemini, or any other AI key in .env'
      : '',
  };
}

export default {
  AI_AVAILABLE,
  AI_PROVIDER_LABEL,
  AI_PROVIDER_TYPE,
  AI_MODEL,
  generate,
  generateJSON,
  chatCompletion,
  getProviderStatus,
  checkOllama,
};
