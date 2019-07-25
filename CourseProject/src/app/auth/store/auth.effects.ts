import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { map, take, catchError, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment'
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User } from 'src/app/models/user';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
    private signupUrl: string = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=[API_KEY]";
    private logInUrl: string = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=[API_KEY]";

    constructor(private actions$: Actions, private http: HttpClient, private router: Router) {
        this.signupUrl = this.signupUrl.replace("[API_KEY]", environment.myApiKey);
        this.logInUrl = this.logInUrl.replace("[API_KEY]", environment.myApiKey);
    }

    @Effect()
    loginEffect = this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((authData: AuthActions.LoginStart) => {

            return this.http.post(this.logInUrl, { ...authData.payload, returnSecureToken: true }).pipe(
                map((data: AuthResposeData) => {
                    return new AuthActions.AuthorizeSuccess(mapUser(data));
                }),
                catchError((error: HttpErrorResponse) => {
                    return of(new AuthActions.AuthorizeFail(handleError(error)));
                })
            )
        }));

    @Effect()
    signupEffect = this.actions$.pipe(
        ofType(AuthActions.SIGNUP_START),
        switchMap((signupData: AuthActions.SignupStart) => {
            return this.http.post<AuthResposeData>(this.signupUrl, { ...signupData.payload, returnSecureToken: true }).pipe(
                map((data: AuthResposeData) => {
                    return new AuthActions.AuthorizeSuccess(mapUser(data));
                }),
                catchError((error: HttpErrorResponse) => {
                    return of(new AuthActions.AuthorizeFail(handleError(error)));
                })
            )
        })
    );

    @Effect()
    appRefreshEffect = this.actions$.pipe(
        ofType(AuthActions.APP_REFRESH),
        switchMap(() =>{
            let user:User = JSON.parse(localStorage.getItem('userData'));
            return of(new AuthActions.AuthorizeSuccess(user));
        })
    )

    @Effect({ dispatch: false })
    authorizeEffect = this.actions$.pipe(
        ofType(AuthActions.AUTHORIZE_SUCCESS),
        tap(() => {
            this.router.navigate(['/recipes'])
        })
    )
}

function handleError(errorRes: HttpErrorResponse) {
    let errorMsg = 'An unknown error occured'

    if (!errorRes.error || !errorRes.error.error) {
        return errorMsg;
    }

    switch (errorRes.error.error.message) {
        case 'EMAIL_EXISTS':
            errorMsg = 'This email exist already';
            break;
        case 'EMAIL_NOT_FOUND':
            errorMsg = 'Invalid credentials';
            break;
        case 'INVALID_PASSWORD':
            errorMsg = 'Invalid credentials';
            break;
    }
    return errorMsg;
}

function mapUser(data: AuthResposeData): User {
    let expirationDate = new Date(new Date().getTime() + +data.expiresIn * 1000);
    let user = new User(data.email, data.localId, data.idToken, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));
    return user;
}

export interface AuthResposeData {
    kind: string,
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
    registered?: boolean,
}