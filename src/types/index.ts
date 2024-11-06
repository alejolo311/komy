export interface Ingredient {
  id: number;
  name: string;
  price: number;
  unit: string;
}

export interface SubrecipeIngredient {
  ingredientId: number;
  quantity: number;
  ingredient: Ingredient;
}

export interface SubrecipeChild {
  subRecipeId: number;
  quantity: number;
  subRecipe: Subrecipe;
}

export interface Subrecipe {
  id: number;
  name: string;
  yield: number;
  totalCost: number;
  ingredients: SubrecipeIngredient[];
  subRecipes?: SubrecipeChild[];
}

export interface RecipeIngredient {
  ingredientId: number;
  quantity: number;
  ingredient: Ingredient;
}

export interface RecipeSubrecipe {
  subRecipeId: number;
  quantity: number;
  subRecipe: Subrecipe;
}

export interface Recipe {
  id: number;
  name: string;
  salePrice: number;
  foodCostPercentage: number;
  totalCost: number;
  ingredients: RecipeIngredient[];
  subRecipes: RecipeSubrecipe[];
}

export interface Product {
  id: number;
  name: string;
  isFinishedProduct: boolean;
  purchasePrice?: number;
  recipeId?: number;
  recipe?: Recipe;
}

export interface Expense {
  id: number;
  amount: number;
  type: 'OPERATIVE' | 'PERSONNEL' | 'FOOD_COST';
  date: string;
}

export interface Income {
  id: number;
  amount: number;
  date: string;
}

export interface ExpensePercentages {
  foodCost: number;
  operative: number;
  personnel: number;
}

export interface IncomeVsExpenses {
  date: string;
  income: number;
  expenses: number;
}