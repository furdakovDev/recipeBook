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

  private recipes: Recipe[] = [
    new Recipe(
      'Tasty Schnitzel',
      'A super-tasty Schnitzel - just awesome!',
      'https://upload.wikimedia.org/wikipedia/commons/7/72/Schnitzel.JPG',
      [
        new Ingredient('1', 'Meat', 1),
        new Ingredient('2', 'French Fries', 20)
      ],
      '1',
      ),
    new Recipe('Big Fat Burger',
      'What else you need to say?',
      'https://upload.wikimedia.org/wikipedia/commons/b/be/Burger_King_Angus_Bacon_%26_Cheese_Steak_Burger.jpg',
      [
        new Ingredient('3', 'Buns', 2),
        new Ingredient('4', 'Meat', 1)
      ],
      '2',
      )
  ];

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
}
