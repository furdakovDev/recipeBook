import * as shoppingListReducers from '../shopping-list/store/shopping-list.reducers';
import * as authReducers from '../auth/store/auth.reducers';
import { ActionReducerMap } from '@ngrx/store';

export interface AppState {
  shoppingList: shoppingListReducers.State;
  auth: authReducers.State;
}

export const reducers: ActionReducerMap<AppState> = {
  shoppingList: shoppingListReducers.shoppingListReducer,
  auth: authReducers.authReducer
};
