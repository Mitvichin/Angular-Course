import { Recipe } from '../recipe.model';
import * as RecipeActions from './recipes.actions';
import { Actions } from '@ngrx/effects';

export interface State {
    recipes: Recipe[],
}

const initialState: State = {
    recipes: [],
}


export function recipesReducer(state = initialState, action: RecipeActions.RecipeActions) {

    switch (action.type) {
        case RecipeActions.ADD_RECIPE:
            return { ...state, recipes: [...state.recipes, action.payload] }
        case RecipeActions.GET_RECIPES:
            return { ...state, recipes: [...action.payload] }
        case RecipeActions.UPDATE_RECIPE:
            const updatedRecipes = state.recipes.slice();
            updatedRecipes[action.payload.index] = { ...state.recipes[action.payload.index], ...action.payload.recipe }
            return { ...state, recipes: updatedRecipes }
        case RecipeActions.DELETE_RECIPE:
            return {
                ...state, recipes: state.recipes.filter((recipe, index) => {
                    return index != action.payload;
                })
            }
        default:
            return state;
    }
}