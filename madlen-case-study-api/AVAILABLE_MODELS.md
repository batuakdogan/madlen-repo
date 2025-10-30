# Available OpenRouter Models

This document lists the AI models you can use with this application.

## How to Change Models

Edit the `OPENROUTER_MODEL` value in your `.env` file:

```env
OPENROUTER_MODEL="model-name-here"
```

Then restart the server.

## Free Models (No API Cost)

### Meta Llama 3.2 3B Instruct (Default)
```env
OPENROUTER_MODEL="meta-llama/llama-3.2-3b-instruct:free"
```
- **Best for:** General conversation, quick responses
- **Context:** 128K tokens
- **Cost:** FREE

### Google Gemma 2 9B Instruct
```env
OPENROUTER_MODEL="google/gemma-2-9b-it:free"
```
- **Best for:** Advanced reasoning
- **Context:** 8K tokens
- **Cost:** FREE

### DeepSeek R1
```env
OPENROUTER_MODEL="deepseek/deepseek-r1:free"
```
- **Best for:** Problem-solving, code generation, reasoning
- **Context:** 64K tokens
- **Cost:** FREE

## Paid Models (Better Performance)

### Grok 2 (xAI)
```env
OPENROUTER_MODEL="x-ai/grok-2-1212"
```
- **Best for:** Conversational AI, humor, real-time information
- **Context:** 128K tokens
- **Cost:** Paid

### OpenAI GPT-3.5 Turbo
```env
OPENROUTER_MODEL="openai/gpt-3.5-turbo"
```
- **Best for:** Fast, reliable responses
- **Cost:** Low

### OpenAI GPT-4o Mini
```env
OPENROUTER_MODEL="openai/gpt-4o-mini"
```
- **Best for:** Better reasoning, longer context
- **Cost:** Low

### Anthropic Claude 3 Haiku
```env
OPENROUTER_MODEL="anthropic/claude-3-haiku"
```
- **Best for:** Fast, intelligent responses
- **Cost:** Low

### Anthropic Claude 3.5 Sonnet
```env
OPENROUTER_MODEL="anthropic/claude-3.5-sonnet"
```
- **Best for:** Best quality, complex tasks
- **Cost:** Higher

### Google Gemini Pro 1.5
```env
OPENROUTER_MODEL="google/gemini-pro-1.5"
```
- **Best for:** Multimodal tasks, large context
- **Cost:** Medium

## Testing Different Models

1. Stop your development server (Ctrl+C)
2. Edit `.env` file and change `OPENROUTER_MODEL`
3. Save the file
4. Restart the server: `npm run dev`
5. Test with the same message to compare responses

## Model Selection Tips

- **For Development/Testing:** Use free models
- **For Production:** Consider paid models for better quality
- **For Complex Tasks:** Use Claude 3.5 Sonnet or GPT-4
- **For Speed:** Use GPT-3.5 Turbo or Mistral
- **For Cost Efficiency:** Use free models or GPT-4o Mini

## Checking Available Models

Visit OpenRouter's website for the most up-to-date model list:
https://openrouter.ai/models

## Notes

- Free models may have rate limits
- Paid models require credits in your OpenRouter account
- Model availability may change over time
- Some models support different features (vision, function calling, etc.)

