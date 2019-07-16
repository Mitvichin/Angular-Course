import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResposeData } from '../Services/auth.service';
import { from, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    this.isLoading = true;
    let authObs: Observable<AuthResposeData>;

    if (this.isLoginMode) {
      authObs = this.authService.logIn({ ...form.value, returnSecureToken: true });
    } else {
      authObs = this.authService.signup({ ...form.value, returnSecureToken: true })
    }

    authObs.subscribe((data) => {
      this.isLoading = false;
      this.router.navigate(['/recipes']);
    }, errorMessage => {
      this.isLoading = false;
      this.error = errorMessage;
    });

    form.reset();
  }
}
