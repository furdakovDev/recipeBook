import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as appReducers from '../../store/app.reducers';
import * as authReducers from '../../auth/store/auth.reducers';
import * as AuthActions from '../../auth/store/auth.actions';
import * as RecipeActions from '../../recipes/store/recipe.actions';


@Component ({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
  authState: Observable<authReducers.State>;

  constructor(private store: Store<appReducers.AppState>) {}

  ngOnInit() {
    this.authState = this.store.select('auth');
  }

  onSaveRecipes() {
    this.store.dispatch(new RecipeActions.StoreRecipes());
  }

  onFetchRecipes() {
    this.store.dispatch(new RecipeActions.FetchRecipes());
  }

  onLogout() {
    this.store.dispatch(new AuthActions.Logout());
  }
}
