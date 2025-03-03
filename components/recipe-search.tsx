"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

export default function RecipeSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [ingredients, setIngredients] = useState(searchParams.get("ingredients") || "")
  const [diet, setDiet] = useState(searchParams.get("diet") || "any")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const params = new URLSearchParams()
    if (ingredients) params.set("ingredients", ingredients)
    if (diet && diet !== "any") params.set("diet", diet)

    try {
      console.log("Submitting search with params:", params.toString())
      await router.push(`/results?${params.toString()}`)
    } catch (error) {
      console.error("Error during search:", error)
      toast({
        title: "Error",
        description: "An error occurred while searching for recipes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="ingredients" className="text-gray-700 dark:text-gray-300">
            Ingredients
          </Label>
          <div className="mt-1 relative">
            <Input
              id="ingredients"
              placeholder="Enter ingredients (e.g., chicken, rice, tomatoes)"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              className="pl-10"
              required
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Separate multiple ingredients with commas</p>
        </div>

        <div>
          <Label htmlFor="diet" className="text-gray-700 dark:text-gray-300">
            Dietary Preference
          </Label>
          <Select value={diet} onValueChange={setDiet}>
            <SelectTrigger id="diet" className="mt-1">
              <SelectValue placeholder="Any diet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any diet</SelectItem>
              <SelectItem value="vegetarian">Vegetarian</SelectItem>
              <SelectItem value="vegan">Vegan</SelectItem>
              <SelectItem value="gluten-free">Gluten-Free</SelectItem>
              <SelectItem value="keto">Keto</SelectItem>
              <SelectItem value="paleo">Paleo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Finding recipes...
            </>
          ) : (
            "Find Recipes"
          )}
        </Button>
      </div>
    </form>
  )
}

