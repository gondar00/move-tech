import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Clock, Users, Utensils } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getRecipes } from "@/lib/api"
import { getAIRecommendation } from "@/lib/ai"
import type { Recipe } from "@/types/recipe"

export async function RecipeResults({
  searchParams,
}: {
  searchParams?: { ingredients?: string; diet?: string }
}) {
  const ingredients = searchParams?.ingredients || ""
  const diet = searchParams?.diet || ""

  console.log("RecipeResults: Received searchParams:", { ingredients, diet })

  if (!ingredients) {
    console.log("RecipeResults: No ingredients provided")
    return (
      <div className="mt-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">Enter ingredients above to discover delicious recipes</p>
      </div>
    )
  }

  try {
    console.log("RecipeResults: Fetching recipes")
    const recipes = await getRecipes(ingredients, diet)
    console.log(`RecipeResults: Fetched ${recipes.length} recipes`)

    if (!recipes || recipes.length === 0) {
      console.log("RecipeResults: No recipes found")
      return (
        <div className="mt-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No recipes found for these ingredients. Try adding more ingredients or changing your filters.
          </p>
        </div>
      )
    }

    return (
      <div className="mt-12">
        <Suspense fallback={<AIRecommendationSkeleton />}>
          <AIRecommendationWrapper ingredients={ingredients} diet={diet} recipes={recipes} />
        </Suspense>

        <Link href="/" className="inline-block mb-6">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>
        </Link>

        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-10 mb-6">All Recipe Suggestions</h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </div>
    )
  } catch (error) {
    console.error("RecipeResults: Error fetching recipes:", error)
    return (
      <div className="mt-12 text-center">
        <p className="text-red-500">An error occurred while fetching recipes. Please try again later.</p>
        <p className="text-sm text-gray-500 mt-2">Error details: {(error as Error).message}</p>
      </div>
    )
  }
}

async function AIRecommendationWrapper({
  ingredients,
  diet,
  recipes,
}: {
  ingredients: string
  diet: string
  recipes: Recipe[]
}) {
  try {
    const recommendation = await getAIRecommendation(ingredients, diet, recipes)
    return recommendation ? <AIRecommendation recommendation={recommendation} /> : null
  } catch (error) {
    console.error("Error in AIRecommendationWrapper:", error)
    return (
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">AI Recommendation</h2>
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300">
              An error occurred while getting the AI recommendation. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }
}

function AIRecommendation({
  recommendation,
}: {
  recommendation: Recipe & { aiReason: string }
}) {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">AI Recommended Recipe</h2>
      <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800 overflow-hidden">
        <div className="relative h-48 w-full">
          <Image
            src={recommendation.image || `/placeholder.svg?height=192&width=384`}
            alt={recommendation.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-4">
            <h3 className="text-white text-xl font-semibold">{recommendation.title}</h3>
          </div>
        </div>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardDescription className="text-green-700/80 dark:text-green-400/80">
              Perfect match for your ingredients
            </CardDescription>
            <Badge
              variant="outline"
              className="bg-green-100 dark:bg-green-800/50 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700"
            >
              AI Pick
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex items-center text-green-700 dark:text-green-400">
              <Clock className="h-4 w-4 mr-1" />
              <span className="text-sm">{recommendation.readyInMinutes} mins</span>
            </div>
            <div className="flex items-center text-green-700 dark:text-green-400">
              <Users className="h-4 w-4 mr-1" />
              <span className="text-sm">{recommendation.servings} servings</span>
            </div>
            <div className="flex items-center text-green-700 dark:text-green-400">
              <Utensils className="h-4 w-4 mr-1" />
              <span className="text-sm">{recommendation.dishType}</span>
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm">{recommendation.aiReason}</p>
        </CardContent>
        <CardFooter>
          <Button variant="default" className="w-full bg-green-600 hover:bg-green-700">
            View Full Recipe
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

function AIRecommendationSkeleton() {
  return (
    <div className="mb-10">
      <Skeleton className="h-8 w-64 mb-4" />
      <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800 overflow-hidden">
        <Skeleton className="h-48 w-full" />
        <CardHeader>
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-6 w-16" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    </div>
  )
}

function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full">
        <Image
          src={recipe.image || `/placeholder.svg?height=192&width=384`}
          alt={recipe.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white text-lg font-semibold line-clamp-2">{recipe.title}</h3>
        </div>
      </div>
      <CardContent className="flex-grow p-4">
        <div className="flex gap-3 mb-2">
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span className="text-xs">{recipe.readyInMinutes} mins</span>
          </div>
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <Users className="h-3.5 w-3.5 mr-1" />
            <span className="text-xs">{recipe.servings} servings</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
          {recipe.summary?.replace(/<[^>]*>/g, "") || "A delicious recipe using your ingredients."}
        </p>
        <div className="flex flex-wrap gap-1 mt-3">
          {recipe.diets?.slice(0, 3).map((diet: string) => (
            <Badge key={diet} variant="secondary" className="text-xs">
              {diet}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button variant="outline" className="w-full">
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}

