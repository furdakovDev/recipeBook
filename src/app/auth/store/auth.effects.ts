import { Effect, Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ofType } from '@ngrx/effects';
import { map, tap, switchMap, mergeMap } from 'rxjs/operators';
import { from } from 'rxjs';
import * as AuthActions from './auth.actions';
import * as firebase from 'firebase';

@Injectable()
export class AuthEffects {

  constructor(private actions$: Actions,
    private router: Router) {}

  @Effect()
  authSignup = this.actions$
    .pipe(ofType(AuthActions.TRY_SIGNUP))
    .pipe(map((action: AuthActions.TrySignup) => {
      return action.payload;
    }))
    .pipe(switchMap((authData: {username: string, password: string}) => {
      return from(firebase.auth().createUserWithEmailAndPassword(authData.username, authData.password));
    }))
    .pipe(switchMap(() => {
      return from(firebase.auth().currentUser.getIdToken());
    }))
    .pipe(mergeMap((token: string) => {
      this.router.navigate(['/']);
      return [
        {
          type: AuthActions.SIGNUP
        },
        {
          type: AuthActions.SET_TOKEN,
          payload: token
        }
      ]
    }));
  
  @Effect()
  authSignin = this.actions$
  .pipe(ofType(AuthActions.TRY_SIGNIN))
  .pipe(map((action: AuthActions.TrySignin) => {
    return action.payload;
  }))
  .pipe(switchMap((authData: {username: string, password: string}) => {
    return from(firebase.auth().signInWithEmailAndPassword(authData.username, authData.password));
  }))
  .pipe(switchMap(() => {
    return from(firebase.auth().currentUser.getIdToken());
  }))
  .pipe(mergeMap((token: string) => {
    this.router.navigate(['/']);
    return [
      {
        type: AuthActions.SIGNIN
      },
      {
        type: AuthActions.SET_TOKEN,
        payload: token
      }
    ]
  }));

  @Effect({dispatch: false})
  authLogout = this.actions$
    .pipe(ofType(AuthActions.LOGOUT))
    .pipe(tap(() => {
      this.router.navigate(['/']);
    }));

}