import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';

import * as appReducers from '../../store/app.reducers';
import * as AuthActions from '../store/auth.actions';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(private store: Store<appReducers.AppState>) { }

  ngOnInit() {
  }

  onSignup(form: NgForm) {
    const email: string = form.value.email;
    const password: string = form.value.password;
    this.store.dispatch(new AuthActions.TrySignup({username: email, password: password}));
    form.resetForm();
  }

}
