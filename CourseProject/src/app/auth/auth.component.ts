import { Component, OnInit, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResposeData } from '../Services/auth.service';
import { Observable, from, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { take, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {

  @ViewChild(PlaceholderDirective, { static: false }) alertHost: PlaceholderDirective
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  authSub: Subscription;
  constructor(
    private authService: AuthService,
    private router: Router,
    private compFactoryResolver: ComponentFactoryResolver,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.authSub = this.store.select('auth').subscribe(state => {
      this.isLoading = state.isLoading;

      if (state.error) {
        this.showError(state.error);
      }
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    this.isLoading = true;
    //let authObs: Observable<AuthResposeData>;

    if (this.isLoginMode) {
      //authObs = this.authService.logIn({ ...form.value, returnSecureToken: true });
      this.store.dispatch(new AuthActions.LoginStart({ ...form.value }));
    } else {
      //authObs = this.authService.signup({ ...form.value, returnSecureToken: true })
      this.store.dispatch(new AuthActions.SignupStart({ ...form.value }));
    }

    // authObs.subscribe((data) => {
    //   this.isLoading = false;
    //   this.router.navigate(['/recipes']);
    // }, errorMessage => {
    //   this.isLoading = false;
    //   this.error = errorMessage;
    //   this.showError(errorMessage);
    // });

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

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }
}
