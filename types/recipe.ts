export interface Recipe {
  id: number
  title: string
  image: string
  readyInMinutes: number
  servings: number
  dishType: string
  diets: string[]
  ingredients: string[]
  summary: string
}

