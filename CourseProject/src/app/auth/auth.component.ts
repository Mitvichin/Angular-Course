import { Component, OnInit, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResposeData } from '../Services/auth.service';
import { from, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  @ViewChild(PlaceholderDirective, { static: false }) alertHost: PlaceholderDirective
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  constructor(private authService: AuthService, private router: Router, private compFactoryResolver: ComponentFactoryResolver) { }

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
      this.showError(errorMessage);
    });

    form.reset();
  }

  onHandleError() {
    this.error = null;
  }

  private showError(error: string) {
    const alertCmpFactory = this.compFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);

    componentRef.instance.message = error;
    componentRef.instance.close.pipe(take(1)).subscribe(() => {
      this.onHandleError();
      hostViewContainerRef.clear();
    });
  }
}
