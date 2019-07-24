import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { map, take, catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment'
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/models/user';
import { of } from 'rxjs';

@Injectable()
export class AuthEffects {
    private regUrl: string = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=[API_KEY]";
    private logInUrl: string = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=[API_KEY]";

    constructor(private actions$: Actions, private http: HttpClient) {
        this.regUrl = this.regUrl.replace("[API_KEY]", environment.myApiKey);
        this.logInUrl = this.logInUrl.replace("[API_KEY]", environment.myApiKey);
    }

    @Effect()
    loginEffect = this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((authData: AuthActions.LoginStart) => {

            return this.http.post(this.logInUrl, { ...authData.payload, returnSecureToken: true }).pipe(
                map((data: AuthResposeData) => {
                    return new AuthActions.AuthorizeSuccess(new User(data.email, data.localId, data.idToken, new Date(new Date().getTime() + +data.expiresIn * 1000)))
                }),
                catchError(error => {
                    return of(new AuthActions.AuthorizeFail(error.error));
                })
            )
        }))
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