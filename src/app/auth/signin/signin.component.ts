import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';

import * as appReducers from '../../store/app.reducers';
import * as AuthActions from '../store/auth.actions';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  constructor(private store: Store<appReducers.AppState>) { }

  ngOnInit() {
  }

  onSignin(form: NgForm) {
    const email: string = form.value.email;
    const password: string = form.value.password;
    this.store.dispatch(new AuthActions.TrySignin({username: email, password: password}));
    form.resetForm();
  }

}
