import { User } from 'src/app/models/user';
import { Action } from '@ngrx/store';

export const LOGIN_START = '[Auth] LOGIN_START'
export const AUTH_FAIL = '[Auth] AUTH_FAIL'
export const AUTH_SUCCESS = '[Auth] AUTH_SUCCESS';
export const LOGOUT = '[Auth] LOGOUT';
export const SIGNUP_START = '[Auth] SIGNUP_START';
export const APP_REFRESH_START = '[Auth] APP_REFRESH_START';

export class AuthSuccess implements Action {
    readonly type = AUTH_SUCCESS;

    constructor(public payload: User) { }
}

export class Logout implements Action {
    readonly type = LOGOUT;

    constructor() { }
}

export class LoginStart implements Action {
    readonly type = LOGIN_START

    constructor(public payload: { email: string, password: string }) { }
}

export class AuthFail implements Action {
    readonly type = AUTH_FAIL;

    constructor(public payload: string) { }
}

export class SignUpStart implements Action {
    readonly type = SIGNUP_START;

    constructor(public payload: { email: string, password: string }) { }
}

export class AppRefreshStart implements Action {
    readonly type = APP_REFRESH_START;

    constructor() { }
}

export type AuthActions =
    | AuthSuccess
    | Logout
    | LoginStart
    | AuthFail
    | SignUpStart
    | AppRefreshStart;