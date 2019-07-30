import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { map, take, catchError, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment'
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User } from 'src/app/models/user';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';

@Injectable()
export class AuthEffects {
    private signupUrl: string = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=[API_KEY]";
    private logInUrl: string = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=[API_KEY]";

    constructor(private actions$: Actions, private http: HttpClient, private router: Router, private authService: AuthService) {
        this.signupUrl = this.signupUrl.replace("[API_KEY]", environment.myApiKey);
        this.logInUrl = this.logInUrl.replace("[API_KEY]", environment.myApiKey);
    }

    @Effect()
    loginEffect = this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((authData: AuthActions.LoginStart) => {

            return this.http.post(this.logInUrl, { ...authData.payload, returnSecureToken: true }).pipe(
                map((data: AuthResposeData) => {
                    return new AuthActions.AuthorizeSuccess(mapUser(data, this.authService));
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
                    return new AuthActions.AuthorizeSuccess(mapUser(data, this.authService));
                }),
                catchError((error: HttpErrorResponse) => {
                    return of(new AuthActions.AuthorizeFail(handleError(error)));
                })
            )
        }));

    @Effect()
    appRefreshEffect = this.actions$.pipe(
        ofType(AuthActions.APP_REFRESH),
        switchMap(() => {
            return handleLoadedUser(this.authService);
        })
    );

    @Effect({ dispatch: false })
    authorizeSuccRedirectEffect = this.actions$.pipe(
        ofType(AuthActions.AUTHORIZE_SUCCESS),
        tap(() => {
            if (this.router.url === '/auth')
                this.router.navigate(['/recipes'])
        })
    );

    @Effect({ dispatch: false })
    logoutEffect = this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        tap(() => {
            localStorage.removeItem('userData');
            this.router.navigate(['/auth']);
            this.authService.clearAuthoLogoutTimer();
        })
    );
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

function handleLoadedUser(authService: AuthService) {
    const loadedUser: {
        email: string, id: string, _token: string, _tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('userData'));

    if (loadedUser) {
        const expirationDate = new Date(loadedUser._tokenExpirationDate);
        const user = new User(loadedUser.email, loadedUser.id, loadedUser._token, expirationDate);

        if (user.token) {
            authService.setAutoLogoutTimer(expirationDate.getTime() - new Date().getTime());
            return of(new AuthActions.AuthorizeSuccess(user));
        }
    }

    return of({ type: "DUMMY" })
}

function mapUser(data: AuthResposeData, authService: AuthService): User {
    let tokenLifeSpan = +data.expiresIn * 1000;
    let expirationDate = new Date(new Date().getTime() + tokenLifeSpan);
    let user = new User(data.email, data.localId, data.idToken, expirationDate);
    authService.setAutoLogoutTimer(tokenLifeSpan);
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