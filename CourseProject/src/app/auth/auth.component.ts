import { Component, OnInit, ComponentFactoryResolver, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResposeData } from '../Services/auth.service';
import { Observable, Subscribable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { take } from 'rxjs/operators';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {


  @ViewChild(PlaceholderDirective, { static: true }) alertHost: PlaceholderDirective
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  storeSub: Subscription;
  closeSub: Subscription;
  constructor(private authService: AuthService, private router: Router, private compFactoryResolver: ComponentFactoryResolver,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.storeSub = this.store.select('auth').subscribe(state => {
      this.isLoading = state.isLoading;
      this.error = state.error;
      if (this.error)
        this.showError(this.error);
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
    let authObs: Observable<AuthResposeData>;

    if (this.isLoginMode) {
      //authObs = this.authService.logIn({ ...form.value, returnSecureToken: true });
      this.store.dispatch(new AuthActions.LoginStart({ ...form.value }));
    } else {
      // authObs = this.authService.signup({ ...form.value, returnSecureToken: true });
      // authObs.subscribe((data) => {
      //   this.isLoading = false;
      //   this.router.navigate(['/recipes']);
      // }, errorMessage => {
      //   this.isLoading = false;
      //   this.error = errorMessage;
      //   this.showError(errorMessage);
      // });

      this.store.dispatch(new AuthActions.SignUpStart({ ...form.value }));
    }



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
    this.closeSub = componentRef.instance.close.pipe(take(1)).subscribe(() => {
      this.onHandleError();
      hostViewContainerRef.clear();
    });
  }

  ngOnDestroy(): void {
    if(this.storeSub)
    this.storeSub.unsubscribe();

    if(this.closeSub)
    this.closeSub.unsubscribe();
  }
}
