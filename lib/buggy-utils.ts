// TODO: This file intentionally contains bugs for debugging demonstration.
// BUGS:
// 1. Inefficient algorithm (O(n²))
// 2. Memory leaks
// 3. No error handling
// 4. Type coercion issues
// 5. Mutation of input parameters
// 6. Missing edge case handling

/**
 * BUG: Poorly written function with multiple issues
 * Supposed to calculate average scores and filter tasks
 */
export function processTaskData(tasks: any) {
  // BUG: No input validation
  // BUG: Using 'any' type

  let totalScore = 0;
  let count = 0;

  // BUG: Inefficient nested loops O(n²)
  for (let i = 0; i < tasks.length; i++) {
    for (let j = 0; j < tasks.length; j++) {
      if (i === j) {
        // BUG: Mutating input array
        tasks[i].processed = true;

        // BUG: Not checking if ai_score exists
        totalScore += tasks[i].ai_score;
        count++;
      }
    }
  }

  // BUG: Division by zero not handled
  const average = totalScore / count;

  // BUG: Using == instead of ===
  const highScorers = tasks.filter((task: any) => task.ai_score == 8); // BUG: Only exact match, not >= 8

  return {
    average: average,
    highScorers: highScorers,
    // BUG: Returning mutated input
    allTasks: tasks,
  };
}

/**
 * BUG: Memory leak - creating new arrays repeatedly
 */
export function formatTasksList(tasks: any[]) {
  let formattedTasks: any[] = [];

  // BUG: This creates a memory leak in certain scenarios
  setInterval(() => {
    formattedTasks = tasks.map((task) => ({
      ...task,
      formattedDate: new Date(task.created_at).toString(),
    }));
  }, 1000); // BUG: Never cleared interval

  return formattedTasks;
}

/**
 * BUG: Type coercion issues and incorrect comparisons
 */
export function validateTaskScore(score: any) {
  // BUG: Using == instead of ===, causes type coercion
  if (score == "10") {
    return "perfect";
  }

  // BUG: Comparing number with string
  if (score > "5") {
    return "good";
  }

  // BUG: Not handling negative numbers or values > 10
  return "poor";
}

/**
 * BUG: Async function without proper error handling
 */
export async function fetchTaskDetails(taskId: string) {
  // BUG: No try-catch
  // BUG: Hardcoded URL
  const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`);

  // BUG: Not checking response.ok
  const data = await response.json();

  // BUG: Assuming data structure without validation
  return data.task.title.toUpperCase(); // Could crash if task or title is undefined
}

/**
 * BUG: Race condition with shared state
 */
let sharedCounter = 0;

export function incrementCounter() {
  // BUG: Not thread-safe, can cause race conditions
  const current = sharedCounter;
  setTimeout(() => {
    sharedCounter = current + 1; // BUG: Multiple calls can overwrite each other
  }, 100);

  return sharedCounter;
}

/**
 * BUG: Incorrect array manipulation
 */
export function removeDuplicateTasks(tasks: any[]) {
  const unique = [];

  // BUG: Inefficient O(n²) algorithm
  for (let i = 0; i < tasks.length; i++) {
    let isDuplicate = false;

    for (let j = 0; j < unique.length; j++) {
      // BUG: Comparing objects by reference, not by id
      if (tasks[i] === unique[j]) {
        isDuplicate = true;
        break;
      }
    }

    if (!isDuplicate) {
      unique.push(tasks[i]);
    }
  }

  // BUG: Not handling null/undefined
  return unique;
}
