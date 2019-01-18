import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import * as appReducers from '../../store/app.reducers';
import * as authReducers from '../../auth/store/auth.reducers';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private store: Store<appReducers.AppState>) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store.select('auth')
    .pipe(take(1))
    .pipe(switchMap((authState: authReducers.State) => {
      const copiedRequest = request.clone({params: request.params.set('auth', authState.token)});
      return next.handle(copiedRequest);
    }));
  }
}
