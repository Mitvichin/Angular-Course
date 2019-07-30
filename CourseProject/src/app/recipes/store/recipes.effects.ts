import * as RecipesActions from './recipes.actions';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';
import { Recipe } from '../recipe.model';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';

@Injectable()
export class RecipesEffects {
    private url: string = "https://angular-course-d7bf8.firebaseio.com/";

    constructor(private actions$: Actions, private http: HttpClient, private store: Store<fromApp.AppState>) { }

    @Effect()
    fetchEffect = this.actions$.pipe(
        ofType(RecipesActions.FETCH_RECIPES),
        switchMap(() => {
            return this.http.get<Recipe[]>(`${this.url}recipes.json`).pipe(
                map((recipes) => {
                    return recipes.map(recipe => {
                        return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] }
                    })
                }),
                map(recipes => {
                    return new RecipesActions.AddRecipes(recipes);
                }),
                catchError(error => {
                    return error;
                })
            );
        })
    );

    @Effect({ dispatch: false })
    saveEffect = this.actions$.pipe(
        ofType(RecipesActions.SAVE_RECIPES),
        withLatestFrom(this.store.select('recipes')),
        switchMap(([saveRecipes, recipesState]) => {
            return this.http.put(`${this.url}recipes.json`, recipesState.recipes)
        })
    )
}