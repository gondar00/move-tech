import { Suspense } from "react"
import { RecipeResults } from "@/components/recipe-results"
import { Skeleton } from "@/components/ui/skeleton"

export default function ResultsPage({
  searchParams,
}: {
  searchParams?: { ingredients?: string; diet?: string }
}) {
  console.log("ResultsPage: Received searchParams:", searchParams)

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-gray-950">
      <div className="container px-4 py-12 mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold tracking-tight text-green-800 dark:text-green-300 mb-8">Recipe Results</h1>
        <Suspense fallback={<SearchResultsSkeleton />}>
          <RecipeResults searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  )
}

function SearchResultsSkeleton() {
  return (
    <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <div className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-5/6 mb-3" />
              <div className="flex gap-2 mt-4">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}

