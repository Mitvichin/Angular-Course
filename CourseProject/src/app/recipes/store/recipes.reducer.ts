import * as RecipesActions from './recipes.actions';
import { Recipe } from '../recipe.model';

export interface State {
    recipes: Recipe[]
}

const initialState: State = {
    recipes: [],
}


export function recipesReducer(state = initialState, action: RecipesActions.RecipesAction) {

    switch (action.type) {
        case RecipesActions.ADD_RECIPE:
            return {
                ...state, recipes: [...state.recipes, action.payload]
            }
        case RecipesActions.ADD_RECIPES:
            return {
                ...state, recipes: [...state.recipes, ...action.payload]
            }
        case RecipesActions.DELETE_RECIPE:
            let filteredRecipes = state.recipes.filter((x, i) => {
                return i === action.payload;
            });

            return {
                ...state, recipes: filteredRecipes
            }
        case RecipesActions.UPDATE_RECIPE:
            let recipes: Recipe[] = state.recipes.slice();
            recipes[action.payload.index] = action.payload.recipe;

            return {
                ...state, recipes: recipes
            }
        default:
            return state;
    }
}