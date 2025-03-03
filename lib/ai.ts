import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import type { Recipe } from "@/types/recipe";
import { z } from "zod";

/**
 * The following block follows the Sequential Processing (Chains) pattern.
 */

// Step 1: AI selects the best recipe ID
async function selectBestRecipe(ingredients: string, diet: string, recipes: Recipe[]) {
  if (!recipes || recipes.length === 0) {
    console.log("No recipes provided, returning null");
    return null;
  }

  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key is missing. Please check your environment variables.");
  }

  const prompt = `
    I have the following ingredients: ${ingredients}.
    ${diet ? `I prefer ${diet} recipes.` : ""}
    
    Here are some recipe options:
    ${recipes
      .slice(0, 5)
      .map((recipe) => `- ${recipe.title} (ID: ${recipe.id})`)
      .join("\n")}
    
    Which ONE recipe would you recommend the most? Respond with JSON:
    {
      "recipeId": (the id of the recommended recipe)
    }
  `;

  console.log("Step 1: Selecting best recipe");

  const { object } = await generateObject({
    model: openai("gpt-4-turbo"),
    system: "You are a recipe selection AI.",
    schema: z.object({
      recipeId: z.number(),
    }),
    prompt: prompt,
  });

  console.log("Step 1 - AI selected recipe:", object.recipeId);
  return object.recipeId;
}

// Step 2: AI explains the selection
async function explainSelection(recipe: Recipe, ingredients: string, diet: string) {
  const prompt = `
    I recommended the following recipe: ${recipe.title}.
    
    It has these attributes:
    - Ready in: ${recipe.readyInMinutes} minutes
    - Servings: ${recipe.servings}
    - Diets: ${recipe.diets.join(", ")}
    - Ingredients: ${recipe.ingredients.join(", ")}
    - Summary: ${recipe.summary}
    
    The user has the following ingredients: ${ingredients}.
    ${diet ? `They prefer ${diet} recipes.` : ""}
    
    Why is this the best choice? Consider nutrition, ease of preparation, and how well it uses the available ingredients.
    Respond with JSON:
    {
      "aiReason": (a brief explanation)
    }
  `;

  console.log("Step 2: Generating AI explanation");

  const { object } = await generateObject({
    model: openai("gpt-4-turbo"),
    system: "You are a recipe analysis AI.",
    schema: z.object({
      aiReason: z.string(),
    }),
    prompt: prompt,
  });

  console.log("Step 2 - AI explanation:", object.aiReason);
  return object.aiReason;
}

// Main function: Calls both AI steps
export async function getAIRecommendation(ingredients: string, diet: string, recipes: Recipe[]) {
  try {
    const selectedRecipeId = await selectBestRecipe(ingredients, diet, recipes);

    if (!selectedRecipeId) {
      return null;
    }

    const recommendedRecipe = recipes.find((r) => r.id === selectedRecipeId) || recipes[0];

    const aiReason = await explainSelection(recommendedRecipe, ingredients, diet);

    console.log("Final AI recommendation:", recommendedRecipe.title);
    
    return {
      ...recommendedRecipe,
      aiReason,
    };
  } catch (error) {
    console.error("Error in getAIRecommendation:", error);
    console.log("Falling back to first recipe");
    
    return {
      ...recipes[0],
      aiReason:
        "An error occurred while getting the AI recommendation. Here's a suggested recipe based on your ingredients.",
    };
  }
}
