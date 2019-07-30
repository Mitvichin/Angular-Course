import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from 'src/app/Services/recipe.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';
import * as RecipesActions from '../store/recipes.actions';
import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-recipes-detail',
  templateUrl: './recipes-detail.component.html',
  styleUrls: ['./recipes-detail.component.scss']
})
export class RecipesDetailComponent implements OnInit {
  recipe: Recipe = {} as Recipe;
  id: number;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit() {
    // this.route.params.subscribe((params: Params) => {
    //   this.id = +params['id'];
    //   this.recipe = this.recipeService.getRecipe(this.id);
    // });

    this.route.params.pipe(
      switchMap((params: Params) => {
        this.id = +params['id'];
        return this.store.select('recipes');
      })
    ).subscribe(state => {
      if (state.recipes[this.id]){
        this.recipe = state.recipes[this.id];
      }else{
        this.router.navigate(['/'], {relativeTo: this.route})
      }

    });
  }

  onAddToShoppingList() {
    //this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients)
    this.store.dispatch(new ShoppingListActions.AddIngredients(this.recipe.ingredients));
  }

  onNewRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route })
  }

  onDeleteRecipe() {
    //this.recipeService.deleteRecipe(this.id);
    this.store.dispatch(new RecipesActions.DeleteRecipe(this.id));
    this.router.navigate(['/recipes']);
  }
}
