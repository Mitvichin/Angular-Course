import { Actions, ofType, Effect } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';

@Injectable()
export class AuthEffects {

    private regUrl: string = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=[API_KEY]";
    private logInUrl: string = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=[API_KEY]";
    private myApiKey: string = environment.firebaseApiKey;

    constructor(private actions$: Actions, private http: HttpClient, private router: Router, private authService: AuthService) { }

    @Effect()
    authLogin = this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((authData: AuthActions.LoginStart) => {

            this.logInUrl = this.logInUrl.replace("[API_KEY]", this.myApiKey);
            return this.http.post<AuthResposeData>(this.logInUrl, { ...authData.payload, returnSecureToken: true })
                .pipe(
                    map(resData => {
                        return new AuthActions.AuthSuccess(mapUser(resData, this.authService));
                    }),
                    catchError(error => {
                        return handleError(error);
                    }));
        }));

    @Effect()
    authSignup = this.actions$.pipe(
        ofType(AuthActions.SIGNUP_START),
        switchMap((signupData: AuthActions.SignUpStart) => {
            this.regUrl = this.regUrl.replace("[API_KEY]", this.myApiKey);
            return this.http.post<AuthResposeData>(this.regUrl, { ...signupData.payload, returnSecureToken: true })
                .pipe(
                    map(resData => {
                        return new AuthActions.AuthSuccess(mapUser(resData, this.authService));
                    }),
                    catchError(error => {
                        return handleError(error);
                    }));
        }));

    @Effect()
    appRefreshStart = this.actions$.pipe(
        ofType(AuthActions.APP_REFRESH_START),
        switchMap(() => {
            return handleLoadedUser(this.authService);
        })
    )

    @Effect({ dispatch: false })
    loginSuccRedirect = this.actions$.pipe(
        ofType(AuthActions.AUTH_SUCCESS),
        tap(() => {
            this.router.navigate(['/']);
        })
    );

    @Effect({ dispatch: false })
    logout = this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        tap(() => {
            this.authService.clearAutoLogoutTimer();
            localStorage.removeItem('userData');
            this.router.navigate(['/auth']);
        })
    )
}

function handleErrorMsg(errorRes): string {
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

function mapUser(resData: AuthResposeData, authService: AuthService): User {
    const expirationTime = +resData.expiresIn * 1000;// *1000 to convert to milisecs
    const expirationDate = new Date(new Date().getTime() + expirationTime);
    const user = new User(resData.email, resData.localId, resData.idToken, expirationDate);
    authService.setAutoLogoutTime(expirationTime);
    localStorage.setItem('userData', JSON.stringify(user));
    return user;
}

function handleLoadedUser(authService: AuthService): Observable<any> {
    const loadedUser: {
        email: string, id: string, _token: string, _tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('userData'));

    if (loadedUser) {
        const tokenExpirationDate = new Date(loadedUser._tokenExpirationDate);
        const user = new User(loadedUser.email, loadedUser.id, loadedUser._token, tokenExpirationDate);

        if (user.token) {
            authService.setAutoLogoutTime(tokenExpirationDate.getTime() - new Date().getTime());
            return of(new AuthActions.AuthSuccess(user));
        }
    }

    return of({ type: "DUMMY" });
}

function handleError(error): Observable<AuthActions.AuthFail> {
    const specificError = handleErrorMsg(error);
    return of(new AuthActions.AuthFail(specificError));
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