import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';
import { User } from '../shared/models/user.model';

const API_KEY = 'AIzaSyBQ44CbihbobPb9ROg0T-r7ce6HfVx8es4';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userSubject = new Subject<User>();

  constructor(
    private http: HttpClient,
  ) {}

  private static setError(error: HttpErrorResponse) {
    if (!error.error || !error.error.error) {
      return throwError('An unknown error occurred');
    }
    switch (error.error.error.message) {
      case 'EMAIL_EXISTS':
        return throwError('This email already used');
      case 'EMAIL_NOT_FOUND':
        return throwError('Email not found');
      case 'INVALID_PASSWORD':
        return throwError('Wrong Password');
      default:
        return throwError('An unknown error occurred');
    }
  }

  private handleAuth(resData: AuthResponseData) {
      const expirationDate = new Date(+resData.expiresIn * 1000 + new Date().getTime());
      const user = new User(
        resData.email,
        resData.localId,
        resData.idToken,
        expirationDate,
      );
      this.userSubject.next(user);
  }

  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${API_KEY}`,
      {
        email,
        password,
        returnSecureToken: true,
      })
      .pipe(
        catchError(AuthService.setError),
        tap(resData => this.handleAuth(resData)),
      );
  }

  signIn(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
      {
        email,
        password,
        returnSecureToken: true,
      })
      .pipe(
        catchError(AuthService.setError),
        tap(resData => this.handleAuth(resData)),
      );
  }
}
