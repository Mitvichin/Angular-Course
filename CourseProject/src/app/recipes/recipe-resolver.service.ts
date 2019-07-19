import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Recipe } from './recipe.model';
import { DataStorageService } from '../Services/data-storage.service';
import { RecipeService } from '../Services/recipe.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeResolverService implements Resolve<Recipe[]> {

  constructor(private dataService: DataStorageService, private recipeService: RecipeService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    const recipes = this.recipeService.getRecipes();

    if(recipes.length === 0){
      //return this.dataService.fetchRecipes();
    }else{
      return recipes;
    }
  }
}
