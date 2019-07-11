import { Injectable } from '@angular/core';
import { Recipe } from '../recipes/recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingService } from './shopping.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [
    new Recipe('Tasty Schnitzel', 'A super-tasty Schnitzel - just awesome',
      'https://www.curiouscuisiniere.com/wp-content/uploads/2018/12/Chicken-Schnitzel-7412-1.jpg',
      [new Ingredient('Meat', 1),
      new Ingredient('French Fries', 20)
      ]),
    new Recipe('Big Fat Birger', 'What else you need to say?',
      'https://s3-media2.fl.yelpcdn.com/bphoto/3UU_K0PlmU9tL5I6yHxvxQ/o.jpg',
      [new Ingredient('Meat', 1),
      new Ingredient('Buns', 2),
      ]),
  ];

  constructor(private shoppingService: ShoppingService) { }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes);
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes);
  }

  deleteRecipe(index:number){
    this.recipes.splice(index,1);
    this.recipesChanged.next(this.recipes.slice());
    console.log(index);
  }
}
