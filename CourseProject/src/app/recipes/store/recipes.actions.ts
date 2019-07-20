import { Action } from '@ngrx/store';
import { Recipe } from '../recipe.model';

export const ADD_RECIPE = '[Recipes] ADD_RECIPE';
export const GET_RECIPES = '[Recipes] GET_RECIPES';
export const UPDATE_RECIPE = '[Recipes] UPDATE_RECIPE';
export const DELETE_RECIPE = '[Recipes] DELETE_RECIPE';
export const START_GET_RECIPES = '[Recipes] START_GET_RECIPES';
export const SAVE_RECIPES = '[Recipes] SAVE_RECIPES';

export class AddRecipe implements Action {
    readonly type = ADD_RECIPE;

    constructor(public payload: Recipe) { }
}

export class GetRecipes implements Action {
    readonly type = GET_RECIPES;

    constructor(public payload: Recipe[]) { }
}

export class UpdateRecipe implements Action {
    readonly type = UPDATE_RECIPE;

    constructor(public payload: { index: number, recipe: Recipe }) { }
}

export class DeleteRecipe implements Action {
    readonly type = DELETE_RECIPE;

    constructor(public payload: number) { }
}

export class StartGetRecipes implements Action {
    readonly type = START_GET_RECIPES;

    constructor() { }
}

export class SaveRecipes implements Action {
    readonly type = SAVE_RECIPES;

    constructor() { }
}

export type RecipeActions =
    | AddRecipe
    | GetRecipes
    | UpdateRecipe
    | DeleteRecipe
    | StartGetRecipes
    | SaveRecipes;