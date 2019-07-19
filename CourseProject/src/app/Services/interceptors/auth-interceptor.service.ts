import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpParams } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { exhaustMap, take } from 'rxjs/operators';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

    constructor(private authService: AuthService, private store:Store<fromApp.AppState>) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        // return this.authService.userSub.pipe(
        //     take(1), exhaustMap(user => {
        //         if (!user) {
        //             return next.handle(req);
        //         }
                
        //         const modifedReq = req.clone({ params: new HttpParams().set('auth', user.token) })
        //         return next.handle(modifedReq);
        //     }));
        return this.store.select('auth').pipe(
            take(1), exhaustMap(state => {
                if (!state.user) {
                    return next.handle(req);
                }
                
                const modifedReq = req.clone({ params: new HttpParams().set('auth', state.user.token) })
                return next.handle(modifedReq);
            }));
    }

}