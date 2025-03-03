import { generateText } from "ai"
import { OpenAIClient } from "@ai-sdk/openai"
import type { Recipe } from "@/types/recipe"

const openaiClient = new OpenAIClient({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function getAIRecommendation(ingredients: string, diet: string, recipes: Recipe[]) {
  console.log(
    "Starting getAIRecommendation with ingredients:",
    ingredients,
    "diet:",
    diet,
    "and recipes:",
    recipes.length,
  )

  if (!recipes || recipes.length === 0) {
    console.log("No recipes provided, returning null")
    return null
  }

  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key is missing. Please check your environment variables.")
    }

    const prompt = `
      I have the following ingredients: ${ingredients}.
      ${diet ? `I prefer ${diet} recipes.` : ""}
      
      Here are some recipe options:
      ${recipes
        .slice(0, 5)
        .map(
          (recipe) => `
        - ${recipe.title}
        - Ready in: ${recipe.readyInMinutes} minutes
        - Servings: ${recipe.servings}
        - Diets: ${recipe.diets.join(", ")}
        - Ingredients: ${recipe.ingredients.join(", ")}
        - Summary: ${recipe.summary}
      `,
        )
        .join("\n")}
      
      Based on my ingredients${diet ? ` and ${diet} preference` : ""}, which ONE recipe would you recommend the most and why?
      Respond in JSON format with these fields:
      {
        "recipeId": (the id of the recommended recipe),
        "aiReason": (a brief explanation of why this recipe is recommended, considering nutrition, ease of preparation, and how well it uses the available ingredients)
      }
    `

    console.log("Generating AI recommendation")
    const { text } = await generateText({
      model: openaiClient.chat("gpt-3.5-turbo"),
      prompt: prompt,
    })
    console.log("Received AI response")

    const parsed = JSON.parse(text)
    const recommendedRecipe = recipes.find((r) => r.id === parsed.recipeId) || recipes[0]
    console.log("Parsed AI recommendation:", recommendedRecipe.title)
    return {
      ...recommendedRecipe,
      aiReason: parsed.aiReason,
    }
  } catch (error) {
    console.error("Error in getAIRecommendation:", error)
    console.log("Falling back to first recipe")
    return {
      ...recipes[0],
      aiReason:
        "An error occurred while getting the AI recommendation. Here's a suggested recipe based on your ingredients.",
    }
  }
}

