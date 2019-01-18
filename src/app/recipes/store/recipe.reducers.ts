import { Recipe } from '../recipes.model';
import { Ingredient } from '../../shared/ingredient.model';

import * as RecipeActions from './recipe.actions';
import * as appReducers from '../../store/app.reducers';

export interface FeatureState extends appReducers.AppState {
  recipes: State;
}

export interface State {
  recipes: Recipe[];
}

const initialState: State = {
  recipes: [
    new Recipe(
      'Tasty Schnitzel',
      'A super-tasty Schnitzel - just awesome!',
      'http://v.img.com.ua/nxs176/b/600x500/9/9b/6c23f6f96b1f54301bf08988f50e39b9.jpg',
      [
        new Ingredient('Meat', 1),
        new Ingredient('French Fries', 20),
      ]),
    new Recipe(
      'Big Burger',
      'What else you need to say?',
      'http://eburger.by/wp-content/uploads/2016/07/11581-800x600-600x600.jpg',
      [
        new Ingredient('Buns', 2),
        new Ingredient('Meat', 2),
      ]),
  ]
};

export function recipeReducer(state = initialState, action: RecipeActions.RecipeActions) {
  switch (action.type) {
    case (RecipeActions.SET_RECIPES):
      return {
        ...state,
        recipes: [...action.payload]
      };
    case (RecipeActions.ADD_RECIPE):
      return {
        ...state,
        recipes: [...state.recipes, action.payload]
      };
    case (RecipeActions.UPDATE_RECIPE):
      const recipe = state.recipes[action.payload.index];
      const updatedRecipe = {
        ...recipe,
        ...action.payload.updatedRecipe
      };
      const recipes = [...state.recipes];
      recipes[action.payload.index] = updatedRecipe;
      return {
        ...state,
        recipes: recipes
      };
    case (RecipeActions.DELETE_RECIPE):
      const newRecipes = [...state.recipes];
      newRecipes.splice(action.payload, 1);
      return {
        ...state,
        recipes: newRecipes
      };
    default: return state;
  }
}
