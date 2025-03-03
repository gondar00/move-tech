import type { Recipe } from "@/types/recipe"

const API_KEY = process.env.SPOONACULAR_API_KEY
const BASE_URL = "https://api.spoonacular.com/recipes"

export async function getRecipes(ingredients: string, diet = ""): Promise<Recipe[]> {
  console.log("getRecipes: Starting with ingredients:", ingredients, "and diet:", diet)

  if (!API_KEY) {
    console.error("getRecipes: Spoonacular API key is not set")
    throw new Error("Spoonacular API key is not set")
  }

  const params = new URLSearchParams({
    apiKey: API_KEY,
    ingredients,
    number: "9",
    ranking: "2",
    ignorePantry: "true",
    ...(diet && { diet }),
  })

  try {
    console.log("getRecipes: Fetching recipes from Spoonacular API")
    const response = await fetch(`${BASE_URL}/findByIngredients?${params}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`getRecipes: API request failed with status ${response.status}:`, errorText)
      throw new Error(`API request failed with status ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log("getRecipes: Received initial recipe data:", data.length, "recipes")

    // Fetch additional details for each recipe
    console.log("getRecipes: Fetching additional details for each recipe")
    const detailedRecipes = await Promise.all(
      data.map(async (recipe: Recipe) => {
        const detailsResponse = await fetch(`${BASE_URL}/${recipe.id}/information?apiKey=${API_KEY}`)
        if (!detailsResponse.ok) {
          const errorText = await detailsResponse.text()
          console.error(
            `getRecipes: API request for recipe details failed with status ${detailsResponse.status}:`,
            errorText,
          )
          throw new Error(`API request for recipe details failed with status ${detailsResponse.status}: ${errorText}`)
        }
        const details = await detailsResponse.json()
        return {
          id: recipe.id,
          title: recipe.title,
          image: recipe.image,
          readyInMinutes: details.readyInMinutes,
          servings: details.servings,
          dishType: details.dishTypes[0] || "Main Course",
          diets: details.diets,
          ingredients: details.extendedIngredients.map((ing: { original: string }) => ing.original),
          summary: details.summary,
        }
      }),
    )

    console.log("getRecipes: Finished fetching detailed recipes:", detailedRecipes.length)
    return detailedRecipes
  } catch (error) {
    console.error("getRecipes: Error fetching recipes:", error)
    throw error
  }
}

