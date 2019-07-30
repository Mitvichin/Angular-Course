import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Recipe } from './recipe.model';
import { DataStorageService } from '../Services/data-storage.service';
import { RecipeService } from '../Services/recipe.service';
import * as fromApp from '../store/app.reducer';
import * as RecipesActions from './store/recipes.actions';
import { Store } from '@ngrx/store';
import { take, switchMap } from 'rxjs/operators';
import { Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeResolverService implements Resolve<Recipe[]> {

  constructor(
    private dataService: DataStorageService,
    private recipeService: RecipeService,
    private store: Store<fromApp.AppState>,
    private actions$: Actions) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // const recipes = this.recipeService.getRecipes();

    // if(recipes.length === 0){
    //   return this.dataService.fetchRecipes();
    // }else{
    //   return recipes;
    // }

    return this.store.select('recipes').pipe(
      take(1),
      switchMap(state => {
        if (state.recipes.length === 0) {
          this.store.dispatch(new RecipesActions.FetchRecipes());

          return this.actions$.pipe(
            ofType(RecipesActions.ADD_RECIPES),
            take(1)
          )
        } else {
          return of(state.recipes);
        }
      })
    );
  }
}
