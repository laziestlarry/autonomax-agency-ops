// ============================================================
// AUTONOMA-X AI INTELLIGENCE LAYER
// Pluggable provider abstraction: OpenAI, custom OpenAI-compatible,
// Ollama (local), or simulation fallback.
// ============================================================

import dotenv from 'dotenv';
dotenv.config();

export type AIProviderType = 'openai' | 'custom' | 'ollama' | 'simulation';

interface AIProviderConfig {
  type: AIProviderType;
  label: string;
  baseUrl: string;
  apiKey: string;
  model: string;
}

interface AIChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AIResponse {
  content: string;
  model: string;
  provider: AIProviderType;
  latencyMs: number;
}

// ============================================================
// Provider resolution
// ============================================================

function detectProvider(): AIProviderConfig {
  // Priority 1: Explicit AI_PROVIDER env var
  const explicit = process.env.AI_PROVIDER?.toLowerCase();
  
  // Priority 2: OLLAMA_BASE_URL signals local Ollama
  const ollamaUrl = process.env.OLLAMA_BASE_URL || process.env.OLLAMA_HOST || 'http://localhost:11434';
  
  // Priority 3: AI_BASE_URL signals custom OpenAI-compatible endpoint
  const customUrl = process.env.AI_BASE_URL || '';
  
  // Priority 4: OpenAI key
  const openaiKey = process.env.OPENAI_API_KEY || '';
  
  // Priority 5: Custom API key
  const customKey = process.env.AI_API_KEY || openaiKey;

  if (explicit === 'ollama') {
    return {
      type: 'ollama',
      label: `Ollama (${ollamaUrl})`,
      baseUrl: ollamaUrl.replace(/\/$/, ''),
      apiKey: 'ollama', // Ollama doesn't need a key by default
      model: process.env.OLLAMA_MODEL || 'llama3',
    };
  }

  if (explicit === 'custom' && customUrl) {
    return {
      type: 'custom',
      label: `Custom API (${customUrl})`,
      baseUrl: customUrl.replace(/\/$/, ''),
      apiKey: customKey,
      model: process.env.AI_MODEL || 'gpt-4o-mini',
    };
  }

  if (openaiKey) {
    return {
      type: 'openai',
      label: 'OpenAI',
      baseUrl: 'https://api.openai.com/v1',
      apiKey: openaiKey,
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    };
  }

  // Fallback: try Ollama if available
  return {
    type: 'simulation',
    label: 'Simulation (no AI key configured)',
    baseUrl: '',
    apiKey: '',
    model: 'simulated',
  };
}

const provider = detectProvider();
export const AI_AVAILABLE = provider.type !== 'simulation';
export const AI_PROVIDER_LABEL = provider.label;
export const AI_PROVIDER_TYPE = provider.type;
export const AI_MODEL = provider.model;

// ============================================================
// Chat completion
// ============================================================

async function chatCompletion(
  messages: AIChatMessage[],
  options?: { temperature?: number; maxTokens?: number; system?: string },
): Promise<AIResponse> {
  const start = Date.now();
  const cfg = detectProvider(); // Re-read to pick up env changes at runtime

  if (cfg.type === 'simulation') {
    await new Promise(r => setTimeout(r, 300 + Math.random() * 200));
    return {
      content: `[Simulated response] Received ${messages.length} message(s). Configure AI_PROVIDER=openai, ollama, or custom with AI_BASE_URL to enable real AI.`,
      model: 'simulated',
      provider: 'simulation',
      latencyMs: Date.now() - start,
    };
  }

  const systemMsg = options?.system || 'You are Autonoma-X Intelligence, an AI business operations engine. Respond concisely and accurately.';

  const body: Record<string, any> = {
    model: options?.system?.includes('gpt-4') ? 'gpt-4o-mini' : cfg.model,
    messages: [
      { role: 'system', content: systemMsg },
      ...messages,
    ],
    temperature: options?.temperature ?? 0.3,
    max_tokens: options?.maxTokens ?? 1000,
    stream: false,
  };

  // Build endpoint URL based on provider
  let endpoint: string;
  let headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  switch (cfg.type) {
    case 'ollama':
      // Ollama uses /api/chat
      endpoint = `${cfg.baseUrl}/api/chat`;
      body.stream = false;
      // Ollama format: model + messages (no system key wrapping needed)
      break;

    case 'custom':
    case 'openai':
    default:
      endpoint = `${cfg.baseUrl}/chat/completions`;
      headers['Authorization'] = `Bearer ${cfg.apiKey}`;
      break;
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => 'Unknown error');
      throw new Error(`AI provider returned ${response.status}: ${errText.slice(0, 200)}`);
    }

    const data = await response.json() as any;

    // Parse response based on provider
    let content = '';
    if (cfg.type === 'ollama') {
      content = data.message?.content || JSON.stringify(data);
    } else {
      content = data.choices?.[0]?.message?.content || '';
    }

    return {
      content,
      model: data.model || cfg.model,
      provider: cfg.type,
      latencyMs: Date.now() - start,
    };
  } catch (err: any) {
    // Fallback to simulation if real provider fails
    console.warn(`⚠️ AI provider (${cfg.type}) failed: ${err.message}. Falling back to simulation.`);
    return {
      content: `[Fallback] AI unavailable: ${err.message}. ${messages.length > 0 ? `Processed ${messages.length} message(s) with rule-based logic.` : ''}`,
      model: 'fallback',
      provider: 'simulation',
      latencyMs: Date.now() - start,
    };
  }
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

// ============================================================
// Provider status endpoint response
// ============================================================

export function getProviderStatus() {
  const cfg = detectProvider();
  return {
    available: cfg.type !== 'simulation',
    provider: cfg.type,
    label: cfg.label,
    model: cfg.model,
    canAutoDetectOllama: cfg.type === 'simulation',
    ollamaAutoDetected: false,
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
