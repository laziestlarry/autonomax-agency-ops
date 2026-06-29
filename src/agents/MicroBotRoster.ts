import { BotTask } from '../types';

export interface Bot {
  id: string;
  name: string;
  description: string;
  run: (input?: any) => Promise<{ output: any; logs: string[] }>;
  status: 'idle' | 'running' | 'completed' | 'failed';
  logs: string[];
}

export class MicroBotRoster {
  private bots: Map<string, Bot> = new Map();
  private taskHistory: BotTask[] = [];

  constructor() {
    this.registerBots();
  }

  private registerBots() {
    // copy_bot
    this.bots.set('copy_bot', {
      id: 'copy_bot',
      name: 'Copy Bot',
      description: 'Generates ad copy, email sequences, and social posts',
      status: 'idle',
      logs: [],
      run: async (input: any) => {
        const logs: string[] = [];
        logs.push(`[${new Date().toISOString()}] 🧠 Copy Bot: Analyzing input...`);
        await this.sleep(400);
        logs.push(`[${new Date().toISOString()}] ✍️ Generating headline variants...`);
        await this.sleep(300);
        logs.push(`[${new Date().toISOString()}] 📝 Drafting body copy...`);
        await this.sleep(400);
        logs.push(`[${new Date().toISOString()}] ✅ Copy generation complete.`);
        return {
          output: {
            headlines: ["The AI Advantage You've Been Missing", 'Scale Revenue Without Scaling Headcount'],
            body: 'Unlock enterprise-grade automation with Autonoma-X. Deploy intelligent agents that work 24/7.',
            cta: 'Claim Your Free Audit →',
          },
          logs,
        };
      },
    });

    // mockup_bot
    this.bots.set('mockup_bot', {
      id: 'mockup_bot',
      name: 'Mockup Bot',
      description: 'Generates product mockups and UI prototypes',
      status: 'idle',
      logs: [],
      run: async (input: any) => {
        const logs: string[] = [];
        logs.push(`[${new Date().toISOString()}] 🎨 Mockup Bot: Initializing design system...`);
        await this.sleep(500);
        logs.push(`[${new Date().toISOString()}] 📐 Generating layout wireframes...`);
        await this.sleep(400);
        logs.push(`[${new Date().toISOString()}] 🖌️ Applying brand palette...`);
        await this.sleep(300);
        logs.push(`[${new Date().toISOString()}] ✅ Mockup generation complete.`);
        return {
          output: { wireframes: ['dashboard.png', 'settings.png', 'analytics.png'], style: 'Cosmic Slate' },
          logs,
        };
      },
    });

    // audit_bot
    this.bots.set('audit_bot', {
      id: 'audit_bot',
      name: 'Audit Bot',
      description: 'Performs comprehensive codebase and infrastructure audits',
      status: 'idle',
      logs: [],
      run: async (input: any) => {
        const logs: string[] = [];
        logs.push(`[${new Date().toISOString()}] 🔍 Audit Bot: Scanning repository...`);
        await this.sleep(600);
        logs.push(`[${new Date().toISOString()}] 📊 Analyzing code quality metrics...`);
        await this.sleep(500);
        logs.push(`[${new Date().toISOString()}] 🔐 Checking security vulnerabilities...`);
        await this.sleep(400);
        logs.push(`[${new Date().toISOString()}] ✅ Audit complete. Score: 86/100`);
        return {
          output: { score: 86, vulnerabilities: 3, recommendations: ['Update dependencies', 'Add logging'] },
          logs,
        };
      },
    });

    // shopify_bot
    this.bots.set('shopify_bot', {
      id: 'shopify_bot',
      name: 'Shopify Bot',
      description: 'Manages product listings, inventory, and orders on Shopify',
      status: 'idle',
      logs: [],
      run: async (input: any) => {
        const logs: string[] = [];
        logs.push(`[${new Date().toISOString()}] 🛒 Shopify Bot: Connecting to store...`);
        await this.sleep(400);
        logs.push(`[${new Date().toISOString()}] 📦 Syncing product catalog...`);
        await this.sleep(500);
        logs.push(`[${new Date().toISOString()}] 💰 Updating pricing & inventory...`);
        await this.sleep(300);
        logs.push(`[${new Date().toISOString()}] ✅ Store sync complete.`);
        return {
          output: { productsSynced: 24, ordersProcessed: 12, revenue: 3470 },
          logs,
        };
      },
    });

    // social_pack_bot
    this.bots.set('social_pack_bot', {
      id: 'social_pack_bot',
      name: 'Social Pack Bot',
      description: 'Creates social media content calendars and posts',
      status: 'idle',
      logs: [],
      run: async (input: any) => {
        const logs: string[] = [];
        logs.push(`[${new Date().toISOString()}] 📱 Social Pack Bot: Building content calendar...`);
        await this.sleep(400);
        logs.push(`[${new Date().toISOString()}] 🖼️ Generating visual assets...`);
        await this.sleep(500);
        logs.push(`[${new Date().toISOString()}] 📝 Writing platform-specific captions...`);
        await this.sleep(300);
        logs.push(`[${new Date().toISOString()}] ✅ Social pack complete.`);
        return {
          output: { posts: 14, platforms: ['X', 'LinkedIn', 'Instagram'], engagement: 3400 },
          logs,
        };
      },
    });

    // pricing_bot
    this.bots.set('pricing_bot', {
      id: 'pricing_bot',
      name: 'Pricing Bot',
      description: 'Analyzes market data to optimize pricing models',
      status: 'idle',
      logs: [],
      run: async (input: any) => {
        const logs: string[] = [];
        logs.push(`[${new Date().toISOString()}] 💹 Pricing Bot: Analyzing market data...`);
        await this.sleep(500);
        logs.push(`[${new Date().toISOString()}] 📊 Running elasticity models...`);
        await this.sleep(400);
        logs.push(`[${new Date().toISOString()}] 🎯 Optimizing tier structure...`);
        await this.sleep(300);
        logs.push(`[${new Date().toISOString()}] ✅ Pricing optimization complete.`);
        return {
          output: { recommendedTiers: ['Starter $49', 'Pro $149', 'Enterprise $499'], elasticity: 0.62 },
          logs,
        };
      },
    });

    // intelligence_bot
    this.bots.set('intelligence_bot', {
      id: 'intelligence_bot',
      name: 'Intelligence Bot',
      description: 'Automated market data scraper and signal processor',
      status: 'idle',
      logs: [],
      run: async (input: any) => {
        const logs: string[] = [];
        logs.push(`[${new Date().toISOString()}] 🌐 Intelligence Bot: Scanning market signals...`);
        await this.sleep(600);
        logs.push(`[${new Date().toISOString()}] 📡 Processing data streams...`);
        await this.sleep(500);
        logs.push(`[${new Date().toISOString()}] 📈 Identifying emerging trends...`);
        await this.sleep(400);
        logs.push(`[${new Date().toISOString()}] ✅ Intelligence gathering complete.`);
        return {
          output: {
            signals: [
              { sector: 'AI Dev Tools', signal: 'Strong growth in autonomous agents', confidence: 92 },
              { sector: 'Micro-SaaS', signal: 'Rising demand for no-code solutions', confidence: 88 },
            ],
            opportunities: 7,
          },
          logs,
        };
      },
    });
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async runBot(botId: string, input?: any): Promise<{ output: any; logs: string[] }> {
    const bot = this.bots.get(botId);
    if (!bot) {
      throw new Error(`Bot "${botId}" not found`);
    }

    bot.status = 'running';
    const result = await bot.run(input);
    bot.status = 'completed';
    bot.logs = result.logs;

    this.taskHistory.push({
      id: botId + '_' + Date.now(),
      name: botId,
      status: 'completed',
      logs: result.logs,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    });

    return result;
  }

  getBotStatus(botId: string): Bot | undefined {
    return this.bots.get(botId);
  }

  getAllBots(): Bot[] {
    return Array.from(this.bots.values());
  }

  getTaskHistory(): BotTask[] {
    return this.taskHistory;
  }

  resetBots() {
    for (const bot of this.bots.values()) {
      bot.status = 'idle';
      bot.logs = [];
    }
  }
}

export const microBotRoster = new MicroBotRoster();
