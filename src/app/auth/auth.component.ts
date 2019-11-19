import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthResponseData, AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  loading = false;
  error: string = null;
  authForm: FormGroup;

  constructor(
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.authForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    });
  }

  onSubmit() {
    if (!this.authForm.valid) {
      return;
    }
    this.loading = true;
    const { value } = this.authForm;

    let authObs: Observable<AuthResponseData>;

    if (this.isLoginMode) {
      authObs = this.authService.signIn(value.email, value.password);
    } else {
      authObs = this.authService.signUp(value.email, value.password);
    }

    authObs.subscribe(resData => {
        this.loading = false;
        this.resetError();
      },
      error => {
        this.error = error;
        this.loading = false;
      });

    this.authForm.reset();
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  resetError() {
    this.error = null;
  }
}
