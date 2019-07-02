import { Injectable, EventEmitter } from '@angular/core';
import { Recipe } from '../recipes/recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingService } from './shopping.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  recipeSelected = new EventEmitter<Recipe>();

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

  constructor(private shoppingService:ShoppingService) { }

  getRecipes() {
    return this.recipes.slice();
  }

  addIngredientsToShoppingList(ingredients:Ingredient[]){
    this.shoppingService.addIngredients(ingredients);
  }
}
