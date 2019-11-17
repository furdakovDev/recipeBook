import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';

import { map, tap } from 'rxjs/operators';

const API_URL = 'https://ng-recipe-book-3e84d.firebaseio.com';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {

  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
  ) {}

  fetch(url: string) {
    return this.http.get(`${API_URL}/${url}`);
  }

  put(data: any, url: string) {
    return this.http.put(`${API_URL}/${url}`, data);
  }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.put(recipes, 'recipes.json')
      .subscribe(response => {
        console.log(response);
      });
  }

  fetchRecipes() {
    return this.fetch('recipes.json')
      .pipe(map((recipes: Recipe[]) => recipes.map(recipe => {
        return {
          ...recipe,
          ingredients: recipe.ingredients || [],
        };
      })),
      tap((response: Recipe[]) => {
        this.recipeService.setRecipes(response);
      })
      );
  }
}
