import { Action } from '@ngrx/store';
import { Ingredient } from 'src/app/shared/ingredient.model';


export const STOP_EDITING = '[Shopping List] Stop editing';
export const START_EDITING = '[Shopping List] Start editing';
export const ADD_INGREDIENT = '[Shopping List] Add ingredient';
export const ADD_INGREDIENTS = '[Shopping List] Add ingredients';
export const DELETE_INGREDIENT = '[Shopping List] Delete ingredient';
export const UPDATE_INGREDIENT = '[Shopping List] Update ingredient';

export class AddIngredient implements Action {
    readonly type = ADD_INGREDIENT;

    constructor(public payload: Ingredient) { }
}

export class AddIngredients implements Action {
    readonly type = ADD_INGREDIENTS;

    constructor(public payload: Ingredient[]) { }
}

export class DeleteIngredient implements Action {
    readonly type = DELETE_INGREDIENT;

    constructor() { }
}

export class UpdateIngredient implements Action {
    readonly type = UPDATE_INGREDIENT;

    constructor(public payload: Ingredient) { }
}

export class StartEditing implements Action {
    readonly type = START_EDITING;

    constructor(public payload: number) { }
}

export class StopEditing implements Action {
    readonly type = STOP_EDITING;

    constructor() { }
}

export type ShoppingListActions =
    | StopEditing
    | StartEditing
    | AddIngredient
    | AddIngredients
    | UpdateIngredient
    | DeleteIngredient;