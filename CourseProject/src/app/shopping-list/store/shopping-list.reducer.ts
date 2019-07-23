import { Ingredient } from 'src/app/shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';

export interface State {
    ingredients: Ingredient[],
    selectedIndex: number,
    editedIngredient: Ingredient,
}

let initialState: State = {
    ingredients: [
        new Ingredient('bread', 2),
        new Ingredient('cheese', 5),
    ],
    selectedIndex: -1,
    editedIngredient: null,
}

export function shoppingListReducer(state: State = initialState, action: ShoppingListActions.ShoppingListActions) {

    switch (action.type) {
        case ShoppingListActions.ADD_INGREDIENT:
            var newIngredients = [...state.ingredients.slice(), action.payload];
            return {
                ...state, ingredients: newIngredients
            }
        case ShoppingListActions.UPDATE_INGREDIENT:
            var updatedIngredient= { ...state.ingredients[state.selectedIndex], ...action.payload };
            var updatedIngredients = [...state.ingredients];
            updatedIngredients[state.selectedIndex] = updatedIngredient;
            return {
                ...state,ingredients: updatedIngredients
            }
        case ShoppingListActions.START_EDITING:
            return {
                ...state, selectedIndex: action.payload, editedIngredient:{...state.ingredients[action.payload]}
            }
        default:
            return state;
    }

}