import { User } from 'src/app/models/user';
import * as AuthActions from './auth.actions';

export interface State {
    user: User,
    isLoading: boolean,
    error: string,
}

const initialState: State = {
    user: null,
    isLoading: false,
    error: null
}

export function authReducer(state = initialState, action: AuthActions.AuthActions) {

    switch (action.type) {
        case AuthActions.AUTH_SUCCESS:
            return { ...state, user: action.payload, isLoading: false, error: null };
        case AuthActions.LOGOUT:
            return { ...state, user: null };
        case AuthActions.LOGIN_START:
        case AuthActions.SIGNUP_START:
            return { ...state, isLoading: true, error: null };
        case AuthActions.AUTH_FAIL:
            return { ...state, user: null, isLoading: false, error: action.payload };
        default:
            return state;
    }


}