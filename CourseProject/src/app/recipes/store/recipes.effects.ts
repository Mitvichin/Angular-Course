import { Actions, Effect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import * as RecipesActions from './recipes.actions';
import { switchMap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { Recipe } from '../recipe.model';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';
import { withLatestFrom } from 'rxjs/operators';

@Injectable()
export class RecipesEffects {
    private url: string = "https://angular-course-d7bf8.firebaseio.com/";

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private router: Router,
        private store: Store<fromApp.AppState>
    ) { }

    @Effect()
    getRecipes = this.actions$.pipe(
        ofType(RecipesActions.START_GET_RECIPES),
        switchMap(() => {
            return this.http.get<Recipe[]>(`${this.url}recipes.json`).pipe(
                map(recipes => {
                    return recipes.map(recipe => {
                        return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] };
                    });
                }),
                map(recipes => {
                    return new RecipesActions.GetRecipes(recipes);
                }),
                catchError(error => {
                    return of(error)
                }))
        })
    )

    @Effect({ dispatch: false })
    saveRecipes = this.actions$.pipe(
        ofType(RecipesActions.SAVE_RECIPES),
        withLatestFrom(this.store.select('recipes')),
        switchMap(([saveRecipesData, recipesState]) => {
            return this.http.put(`${this.url}recipes.json`, recipesState.recipes);
        })
    )
}