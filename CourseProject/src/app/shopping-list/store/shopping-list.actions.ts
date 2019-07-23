import { Action } from '@ngrx/store';
import { Ingredient } from 'src/app/shared/ingredient.model';


export const ADD_INGREDIENT = '[Shopping List] Add ingredient';
export const UPDATE_INGREDIENT = '[Shopping List] Update ingredient';
export const START_EDITING = '[Shopping List] Start editing';

export class AddIngredients implements Action {
    readonly type = ADD_INGREDIENT;

    constructor(public payload: Ingredient) { }
}

export class UpdateIngredient implements Action {
    readonly type = UPDATE_INGREDIENT;

    constructor(public payload: Ingredient) { }
}

export class StartEditing implements Action {
    readonly type = START_EDITING;

    constructor(public payload: number) { }
}

export type ShoppingListActions =
    | AddIngredients
    | UpdateIngredient
    | StartEditing;