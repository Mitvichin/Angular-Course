import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { RecipeService } from './recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { map, tap, take, exhaustMap } from 'rxjs/operators'
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  private url: string = "https://angular-course-d7bf8.firebaseio.com/";

  constructor(private http: HttpClient, private recipesService: RecipeService, private authService: AuthService) { }

  storeRecipes() {
    const recipe = this.recipesService.getRecipes();

    this.http.put(`${this.url}recipes.json`, recipe).subscribe();
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>(`${this.url}recipes.json`).pipe(
      map(recipes => {
        return recipes.map(recipe => {
          return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] };
        });
      }), tap(recipes => {
        this.recipesService.setRecipes(recipes);
      }));
  }
}
