import { User } from 'src/app/models/user';
import * as AuthActions from '../store/auth.actions';

export interface State {
    user: User,
    isLoading: boolean,
    error: string,
}

const initialState: State = {
    user: null,
    isLoading: false,
    error: null,
}

export function authReducer(state: State = initialState, action: AuthActions.AuthActions) {

    switch (action.type) {
        case AuthActions.LOGIN_START:
        case AuthActions.SIGNUP_START:
            return {
                ...state, isLoading: true, error: null
            }
        case AuthActions.AUTHORIZE_SUCCESS:
            return {
                ...state, isLoading: false, error: null, user: action.payload
            }
        case AuthActions.AUTHORIZE_FAIL:
            return {
                ...state, isLoading: false, error: action.payload
            }
        default:
            return state;
    }

}