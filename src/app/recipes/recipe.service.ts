import { Injectable } from '@angular/core';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [];

  constructor(private slService: ShoppingListService) {}

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(id: string) {
    return this.recipes.find(recipe => (recipe.id === id));
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next([...this.recipes]);
  }

  updateRecipe(recipe: Recipe) {
    this.recipes = this.recipes.reduce((result, current) => {
      if (current.id === recipe.id) {
        return [ ...result, {
          ...current,
          ...recipe,
        }];
      }
      return [...result, current];
    }, []);
    this.recipesChanged.next([...this.recipes]);
  }

  deleteRecipe(id: string) {
    this.recipes = this.recipes.reduce((result, current) => {
      if (current.id === id) {
        return result;
      }
      return [...result, current];
    }, []);
    this.recipesChanged.next([...this.recipes]);
  }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next([...recipes]);
  }
}
