import { Component, OnInit, OnDestroy } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from 'src/app/Services/recipe.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer'
import * as RecipesAction from '../store/recipes.actions';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.scss']
})
export class RecipesListComponent implements OnInit, OnDestroy {
  recipesSub:Subscription;
  recipes: Recipe[];
  constructor(
    private recipeService: RecipeService,
     private router: Router, 
     private route: ActivatedRoute,
     private store: Store<fromApp.AppState>
     ) { }

  ngOnInit() {
    // this.recipesChangedSub = this.recipeService.recipesChanged.subscribe((recipes: Recipe[]) => {
    //   this.recipes = recipes;
    // });

    this.recipesSub = this.store.select('recipes').subscribe(state =>{
      this.recipes = state.recipes;
    });
    
    //this.recipes = this.recipeService.getRecipes();
  }

  onNewRecipe() {
    this.router.navigate(['new'], { relativeTo: this.route })
  }

  ngOnDestroy(): void {
    this.recipesSub.unsubscribe();
  }
}
