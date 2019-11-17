import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  authForm: FormGroup;

  ngOnInit(): void {
    this.authForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    });
  }

  onSubmit() {
    const { value } = this.authForm;
    console.log(value);
    this.authForm.reset();
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }
}
