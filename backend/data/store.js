const { v4: uuidv4 } = require('uuid');

const store = {
  chatbots: [
    {
      id: uuidv4(),
      name: 'Customer Support Bot',
      description: 'Handles customer support queries with empathy and precision.',
      model: 'gpt-4o',
      status: 'active',
      tags: ['support', 'customer'],
      icon: 'support',
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      name: 'Sales Assistant',
      description: 'Drives conversions by qualifying leads and answering product questions.',
      model: 'claude-3.5-sonnet',
      status: 'active',
      tags: ['sales', 'leads'],
      icon: 'sales',
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      name: 'Legal Advisor',
      description: 'Provides legal document summarization and compliance checks.',
      model: 'gpt-4o-mini',
      status: 'draft',
      tags: ['legal', 'compliance'],
      icon: 'legal',
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      name: 'Code Reviewer',
      description: 'Analyzes code for bugs, security issues, and style violations.',
      model: 'gemini-1.5-pro',
      status: 'active',
      tags: ['code', 'dev'],
      icon: 'code',
      createdAt: new Date().toISOString(),
    },
  ],
  models: [
    { id: uuidv4(), name: 'GPT-4o', provider: 'OpenAI', version: 'gpt-4o', contextWindow: 128000, status: 'active' },
    { id: uuidv4(), name: 'GPT-4o Mini', provider: 'OpenAI', version: 'gpt-4o-mini', contextWindow: 128000, status: 'active' },
    { id: uuidv4(), name: 'Claude 3.5 Sonnet', provider: 'Anthropic', version: 'claude-3.5-sonnet', contextWindow: 200000, status: 'active' },
    { id: uuidv4(), name: 'Gemini 1.5 Pro', provider: 'Google', version: 'gemini-1.5-pro', contextWindow: 1000000, status: 'active' },
    { id: uuidv4(), name: 'Llama 3.1 70B', provider: 'Meta', version: 'llama-3.1-70b', contextWindow: 131072, status: 'active' },
  ],
  guardrails: [
    { id: uuidv4(), name: 'PII Detector', type: 'input', description: 'Detects and masks personally identifiable information.', action: 'mask', status: 'active' },
    { id: uuidv4(), name: 'Toxicity Filter', type: 'output', description: 'Filters toxic or offensive language from responses.', action: 'block', status: 'active' },
    { id: uuidv4(), name: 'Topic Guard', type: 'input', description: 'Prevents off-topic conversations and jailbreak attempts.', action: 'warn', status: 'active' },
    { id: uuidv4(), name: 'Max Token Limit', type: 'output', description: 'Truncates responses that exceed the configured token limit.', action: 'truncate', status: 'active' },
  ],
  prompts: [
    { id: uuidv4(), name: 'Customer Support System', type: 'system', content: 'You are a helpful and empathetic customer support agent. Always be polite, concise, and solution-focused.', version: '1.2', status: 'active' },
    { id: uuidv4(), name: 'Sales Qualifier', type: 'system', content: 'You are a professional sales assistant. Ask qualifying questions to understand customer needs and match them to products.', version: '2.0', status: 'active' },
    { id: uuidv4(), name: 'Code Review Expert', type: 'system', content: 'You are a senior software engineer specializing in code review. Analyze code for bugs, security issues, performance problems, and style violations.', version: '1.0', status: 'active' },
  ],
  tools: [
    { id: uuidv4(), name: 'Web Search', type: 'builtin', description: 'Search the web for up-to-date information.', schema: '{}', status: 'active' },
    { id: uuidv4(), name: 'Calculator', type: 'builtin', description: 'Perform mathematical calculations.', schema: '{}', status: 'active' },
    { id: uuidv4(), name: 'Database Query', type: 'custom', description: 'Query internal databases using natural language.', schema: '{}', status: 'active' },
    { id: uuidv4(), name: 'Email Sender', type: 'custom', description: 'Send emails on behalf of the user.', schema: '{}', status: 'active' },
    { id: uuidv4(), name: 'CRM Connector', type: 'integration', description: 'Read and write CRM records.', schema: '{}', status: 'active' },
  ],
  udfs: [
    { id: uuidv4(), name: 'sentiment_score', language: 'python', description: 'Returns a sentiment score (-1 to 1) for input text.', code: 'def sentiment_score(text):\n    # Implementation here\n    return 0.75', status: 'active' },
    { id: uuidv4(), name: 'normalize_date', language: 'javascript', description: 'Normalizes date strings to ISO 8601 format.', code: 'function normalize_date(dateStr) {\n  return new Date(dateStr).toISOString();\n}', status: 'active' },
    { id: uuidv4(), name: 'extract_entities', language: 'python', description: 'Extracts named entities from text.', code: 'def extract_entities(text):\n    return {"entities": []}', status: 'active' },
  ],
};

module.exports = store;
