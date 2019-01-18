import { CanActivate } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as appReducers from '../../store/app.reducers';
import * as authReducers from '../../auth/store/auth.reducers';
import 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private store: Store<appReducers.AppState>) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store.select('auth')
      .pipe(take(1))
      .pipe(map((authState: authReducers.State) => {
      return authState.authenticated;
    }));
    }
}
