import { Actions, Effect, ofType } from '@ngrx/effects';

import * as RecipeActions from '../store/recipe.actions';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Recipe } from '../recipes.model';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as recipeReducers from '../store/recipe.reducers';
import { Store } from '@ngrx/store';

@Injectable()
export class RecipeEffects {
  @Effect()
  recipeFetch = this.action$
    .pipe(ofType(RecipeActions.FETCH_RECIPES))
    .pipe(switchMap((action: RecipeActions.FetchRecipes) => {
      return this.http.get<Recipe[]>('https://ng-recipe-book-3e84d.firebaseio.com/recipes.json', {
        observe: 'body',
        responseType: 'json',
      });
    }))
    .pipe(map(
      (recipes) => {
        for (const recipe of recipes) {
          if (!recipe['ingredients']) {
            recipe['ingredients'] = [];
          }
        }
        return {
          type: RecipeActions.SET_RECIPES,
          payload: recipes
        };
      }
    ));

  @Effect({dispatch: false})
  recipesStore = this.action$
    .pipe(ofType(RecipeActions.STORE_RECIPES))
    .pipe(withLatestFrom(this.store.select('recipes')))
    .pipe(switchMap(([action, state]) => {
      const req = new HttpRequest('PUT', 'https://ng-recipe-book-3e84d.firebaseio.com/recipes.json',
        state.recipes, { reportProgress: true});
      return this.http.request(req);
    }));

  constructor(private action$: Actions,
              private http: HttpClient,
              private store: Store<recipeReducers.FeatureState>) {}

}
