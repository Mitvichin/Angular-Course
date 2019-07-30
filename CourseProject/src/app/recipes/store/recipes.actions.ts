import { Action } from '@ngrx/store';
import { Recipe } from '../recipe.model';

export const ADD_RECIPE = '[Recipes] Add recipe';
export const ADD_RECIPES = '[Recipes] Add recipes';
export const UPDATE_RECIPE = '[Recipes] Update recipe';
export const DELETE_RECIPE = '[Recipes] Delete recipe';
export const FETCH_RECIPES = '[Recipes] Fetch recipes';
export const SAVE_RECIPES = '[Recipes] Save recipes';

export class AddRecipe implements Action {
    readonly type = ADD_RECIPE;

    constructor(public payload: Recipe) { }
}

export class AddRecipes implements Action {
    readonly type = ADD_RECIPES;

    constructor(public payload: Recipe[]) { }
}

export class UpdateRecipe implements Action {
    readonly type = UPDATE_RECIPE;

    constructor(public payload: { recipe: Recipe, index: number }) { }
}

export class DeleteRecipe implements Action {
    readonly type = DELETE_RECIPE;

    constructor(public payload: number) { }
}

export class FetchRecipes implements Action {
    readonly type = FETCH_RECIPES;
}

export class SaveRecipes implements Action {
    readonly type = SAVE_RECIPES;
}

export type RecipesAction =
    | AddRecipe
    | AddRecipes
    | UpdateRecipe
    | DeleteRecipe
    | FetchRecipes
    | SaveRecipes;