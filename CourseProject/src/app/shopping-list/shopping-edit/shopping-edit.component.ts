import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingService } from 'src/app/Services/shopping.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';
@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.scss']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: true }) slForm: NgForm;
  startedEditingSub: Subscription;
  editMode: boolean = false;
  //itemSelectedIndex: number;
  itemSelected: Ingredient;

  constructor(private shoppingService: ShoppingService, private store: Store<fromApp.AppState>) { }

  ngOnInit() {

    this.startedEditingSub = this.store.select('shoppingList').subscribe((state) => {
      if (state.editedIngredientIndex > -1) {
        //this.itemSelectedIndex = state.editedIngredientIndex;
        this.editMode = true;
        this.itemSelected = state.editedIngredient;//this.shoppingService.getIngredient(state.editedIngredientIndex);
        this.slForm.setValue(this.itemSelected);
      } else {
        this.editMode = false;
      }
    });
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const ing = new Ingredient(value.name, value.amount);

    if (this.editMode) {
      //this.shoppingService.updateIngredient(this.itemSelectedIndex, ing)
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(ing));
    } else {
      //this.shoppingService.addIngredient(ing);
      this.store.dispatch(new ShoppingListActions.AddIngredient(ing));
    }

    this.onClear();
  }

  onClear() {
    this.slForm.reset();
    this.editMode = false;
    this.store.dispatch(new ShoppingListActions.StopEditing());

  }

  onDelete() {
    //this.shoppingService.deleteIngredient(this.itemSelectedIndex);
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    this.onClear();
  }

  ngOnDestroy(): void {
    this.startedEditingSub.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEditing());
  }
}
