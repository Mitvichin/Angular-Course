import { Recipe } from '../recipe.model';
import * as RecipeActions from './recipes.actions';

export interface State {
    recipes: Recipe[],
    editRecipeIndex: number,
}

const initialState: State = {
    recipes: [],
    editRecipeIndex: -1,
}


export function recipesReducer(state = initialState, action: RecipeActions.RecipeActions) {

    switch (action.type) {
        case RecipeActions.ADD_RECIPE:
            return { ...state, recipes: [...state.recipes, action.payload] }
        case RecipeActions.GET_RECIPES:
            console.log({recipes: [...state.recipes, ...action.payload]})
            return { ...state, recipes: [...action.payload] }
        case RecipeActions.UPDATE_RECIPE:
            const updatedRecipes = state.recipes.slice();
            updatedRecipes[state.editRecipeIndex] = { ...state.recipes[state.editRecipeIndex], ...action.payload }
            return { ...state, recipes: updatedRecipes }
        case RecipeActions.DELETE_RECIPE:
            return {
                ...state, recipes: state.recipes.filter((recipe, index) => {
                    return index != state.editRecipeIndex;
                })
            }
        default:
            return state;
    }
}