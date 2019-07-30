import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Route, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { RecipeService } from 'src/app/Services/recipe.service';
import { Recipe } from '../recipe.model';
import { map, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as RecipesActions from '../store/recipes.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.scss']
})
export class RecipeEditComponent implements OnInit, OnDestroy {

  id: number;
  editMode = false;
  recipeForm: FormGroup;
  sub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit() {
    this.sub = this.route.params.pipe(
      switchMap((params: Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null;
        return this.store.select('recipes');
      }),
    ).subscribe(state => {
      if (this.editMode) {
        this.initForm(state.recipes[this.id])
      } else {
        this.initForm();
      }
    });
  }

  onSubmit() {
    const newRecipe = this.recipeForm.value as Recipe;

    if (this.editMode) {
      //this.recipeService.updateRecipe(this.id, newRecipe)
      this.store.dispatch(new RecipesActions.UpdateRecipe({recipe:newRecipe, index:this.id}))
    } else {
      //this.recipeService.addRecipe(newRecipe);
      this.store.dispatch(new RecipesActions.AddRecipe(newRecipe))

    }
    this.onCancel();
  }

  private initForm(selectedRecipe?: Recipe) {
    let recipe = new Recipe('', '', '', null);
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      //recipe = this.recipeService.getRecipe(this.id);
      recipe = selectedRecipe;
      if (recipe['ingredients']) {
        recipe.ingredients.forEach(ing => {
          recipeIngredients.push(
            new FormGroup({
              'name': new FormControl(ing.name, Validators.required),
              'amount': new FormControl(ing.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
            })
          );
        });
      }
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipe.name, Validators.required),
      'description': new FormControl(recipe.description, Validators.required),
      'imagePath': new FormControl(recipe.imagePath, Validators.required),
      'ingredients': recipeIngredients
    });
  }

  onAddIng() {
    (<FormArray>this.recipeForm.get('ingredients')).push(new FormGroup({
      'name': new FormControl(null, Validators.required),
      'amount': new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]),
    }));
  }

  getIngredientControl() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  onRemoveIng(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route })
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }
}
