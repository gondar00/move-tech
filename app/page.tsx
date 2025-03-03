import RecipeSearch from "@/components/recipe-search";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-gray-950">
      <div className="container px-4 py-12 mx-auto max-w-5xl">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold tracking-tight text-green-800 dark:text-green-300 mb-4">
            Pantry to Plate
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Transform your ingredients into delicious meals with AI-powered
            recipe suggestions
          </p>
        </div>

        <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
            Find Recipes
          </h2>
          <Suspense>
            <RecipeSearch />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
