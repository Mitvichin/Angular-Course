import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../auth.service';
import { map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private store: Store<fromApp.AppState>) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    // return this.authService.userSub.pipe(take(1),map(user => {
    //   const isAuth = user ? true : false;

    //   if(isAuth){
    //     return isAuth;
    //   }

    //   return this.router.createUrlTree(['/auth']);
    //}));
    return this.store.select('auth').pipe(
      take(1),
      map(state => {
        if (state.user) {
          return true
        }
        return this.router.createUrlTree(['/auth']);
      }));
  }
}
