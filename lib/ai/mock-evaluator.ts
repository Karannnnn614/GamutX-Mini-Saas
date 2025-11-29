/**
 * Mock AI Evaluator for Testing (No OpenAI API Required)
 * Returns simulated evaluation results
 */

export interface EvaluationInput {
  title: string;
  description: string;
  codeContent?: string;
  fileContent?: string;
}

export interface EvaluationResult {
  score: number;
  strengths: string[];
  improvements: string[];
}

export async function evaluateTask(
  input: EvaluationInput
): Promise<EvaluationResult> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Generate mock evaluation based on input
  const codeLength = input.codeContent?.length || 0;
  const hasDescription = input.description.length > 50;

  // Calculate mock score (7-9 range for demo)
  const baseScore = 7;
  const descriptionBonus = hasDescription ? 1 : 0;
  const codeBonus = codeLength > 100 ? 1 : 0;
  const score = Math.min(10, baseScore + descriptionBonus + codeBonus);

  return {
    score,
    strengths: [
      "Clear and concise problem statement",
      "Well-structured code organization",
      "Good use of modern JavaScript/TypeScript features",
      "Proper error handling implemented",
    ],
    improvements: [
      "Consider adding more comprehensive unit tests",
      "Documentation could be expanded with more examples",
      "Performance could be optimized for larger datasets",
      "Add input validation for edge cases",
    ],
  };
}
