import { Action } from '@ngrx/store';
import { User } from 'src/app/models/user';

export const AUTHORIZE_SUCCESS = '[Auth] Authorize succes';
export const AUTHORIZE_FAIL = '[Auth] Authorize fail';
export const LOGIN_START = '[Auth] Login start';
export const SIGNUP_START = '[Auth] Signup start';

export class AuthorizeSuccess implements Action {
    readonly type = AUTHORIZE_SUCCESS;

    constructor(public payload: User) { }
}

export class AuthorizeFail implements Action {
    readonly type = AUTHORIZE_FAIL;

    constructor(public payload: string) { }
}

export class LoginStart implements Action {
    readonly type = LOGIN_START;

    constructor(public payload: { email: string, password: string }) { }
}

export class SignupStart implements Action {
    readonly type = SIGNUP_START;

    constructor(public payload: { email: string, password: string }) { }
}

export type AuthActions =
    | LoginStart
    | SignupStart
    | AuthorizeFail
    | AuthorizeSuccess;