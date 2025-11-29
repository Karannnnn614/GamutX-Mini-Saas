import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AIEvaluationResult {
  score: number;
  strengths: string[];
  improvements: string[];
}

export interface EvaluationInput {
  title: string;
  description: string;
  fileContent?: string;
}

const SYSTEM_PROMPT = `You are an expert code reviewer and technical evaluator. 
Analyze the provided coding task and provide constructive feedback.

Return your response as a valid JSON object with this exact structure:
{
  "score": <number between 1 and 10>,
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3"]
}

Evaluation criteria:
- Code quality and best practices
- Problem-solving approach
- Code organization and structure
- Error handling
- Documentation and readability
- Performance considerations

Be specific, constructive, and professional in your feedback.`;

export async function evaluateTask(
  input: EvaluationInput,
  maxRetries = 3
): Promise<AIEvaluationResult> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const userPrompt = buildUserPrompt(input);

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 1000,
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error("No response content from AI");
      }

      const result = JSON.parse(content);

      // Validate the response structure
      validateEvaluationResult(result);

      return {
        score: result.score,
        strengths: result.strengths,
        improvements: result.improvements,
      };
    } catch (error) {
      lastError = error as Error;
      console.error(`AI evaluation attempt ${attempt} failed:`, error);

      if (attempt < maxRetries) {
        // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  throw new Error(
    `Failed to evaluate task after ${maxRetries} attempts: ${lastError?.message}`
  );
}

function buildUserPrompt(input: EvaluationInput): string {
  let prompt = `Task Title: ${input.title}\n\nTask Description:\n${input.description}`;

  if (input.fileContent) {
    prompt += `\n\nSubmitted Code:\n\`\`\`\n${input.fileContent}\n\`\`\``;
  }

  return prompt;
}

function validateEvaluationResult(
  result: any
): asserts result is AIEvaluationResult {
  if (typeof result !== "object" || result === null) {
    throw new Error("Invalid response format: expected object");
  }

  if (
    typeof result.score !== "number" ||
    result.score < 1 ||
    result.score > 10
  ) {
    throw new Error("Invalid score: must be a number between 1 and 10");
  }

  if (!Array.isArray(result.strengths) || result.strengths.length === 0) {
    throw new Error("Invalid strengths: must be a non-empty array");
  }

  if (!Array.isArray(result.improvements) || result.improvements.length === 0) {
    throw new Error("Invalid improvements: must be a non-empty array");
  }

  if (!result.strengths.every((s: any) => typeof s === "string")) {
    throw new Error("Invalid strengths: all items must be strings");
  }

  if (!result.improvements.every((i: any) => typeof i === "string")) {
    throw new Error("Invalid improvements: all items must be strings");
  }
}

// Alternative: Groq implementation (commented out, can be swapped)
/*
import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function evaluateTaskWithGroq(
  input: EvaluationInput
): Promise<AIEvaluationResult> {
  const userPrompt = buildUserPrompt(input)

  const completion = await groq.chat.completions.create({
    model: 'mixtral-8x7b-32768',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 1000,
  })

  const content = completion.choices[0]?.message?.content
  if (!content) {
    throw new Error('No response content from AI')
  }

  const result = JSON.parse(content)
  validateEvaluationResult(result)

  return result
}
*/
