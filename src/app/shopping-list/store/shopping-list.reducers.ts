import * as ShoppingListActions from './shopping-list.actions';
import { Ingredient } from 'src/app/shared/ingredient.model';

export interface AppState {
  shoppingList: State
}

export interface State {
  ingredients: Ingredient[];
  editingIngredient: {
    ingredient: Ingredient,
    id: number
  };
}

const initialState: State = {
  ingredients: [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10),
  ],
  editingIngredient: {
    ingredient: null,
    id: null
  }
}

export function shoppingListReducer(state = initialState, action: ShoppingListActions.ShoppingListActions) {
  switch (action.type) {

    case ShoppingListActions.ADD_INGREDIENT: 
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload]
      };

    case ShoppingListActions.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.payload]
      };

    case ShoppingListActions.UPDATE_INGREDIENT:
      const ingredient = state.ingredients[state.editingIngredient.id];
      const updatedIngredient = {
        ...ingredient,
        ...action.payload.ingredient
      };

      const ingredients = [ ...state.ingredients ];
      ingredients[state.editingIngredient.id] = updatedIngredient;
      return {
        ...state,
        ingredients: ingredients,
        editingIngredient: {
          ingredient: null,
          id: null
        }
      };

    case ShoppingListActions.DELETE_INGREDIENT:
      const newIngredients = [ ...state.ingredients ];
      newIngredients.splice(state.editingIngredient.id, 1);
      return {
        ...state,
        ingredients: newIngredients,
        editingIngredient: {
          ingredient: null,
          id: null
        }
      };

    case ShoppingListActions.START_EDIT:
      const editingIngredient = {...state.ingredients[action.payload]};
      return {
        ...state,
        editingIngredient: {
          ingredient: editingIngredient,
          id: action.payload
        }
      };

    case ShoppingListActions.STOP_EDIT:
      return {
        ...state,
        editingIngredient: {
          ingredient: null,
          id: null
        }
      };
      
    default: 
      return state;
  }
}