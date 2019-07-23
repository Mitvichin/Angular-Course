import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingService } from 'src/app/Services/shopping.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import * as fromApp from '../../store/app.reducer';
import * as ShoppingListActions from '../store/shopping-list.actions';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.scss']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: true }) slForm: NgForm;
  startedEditingSub: Subscription;
  editMode: boolean = false;
  itemSelectedIndex: number;
  itemSelected: Ingredient;

  constructor(private shoppingService: ShoppingService, private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    // this.startedEditingSub = this.shoppingService.startedEditing.subscribe((index: number) => {
    //   this.itemSelectedIndex = index;
    //   this.editMode = true;
    //   this.itemSelected = this.shoppingService.getIngredient(index);
    //   this.slForm.setValue(this.itemSelected);
    // });

    this.store.select('shoppingList').subscribe(state => {
      this.itemSelectedIndex = state.selectedIndex;
      
      if (this.itemSelectedIndex != -1) {
        this.editMode = true;
        this.itemSelected = state.editedIngredient;
        this.slForm.setValue(this.itemSelected);
      } else {
        this.editMode = false
      }
    })
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const ing = new Ingredient(value.name, value.amount);

    if (this.editMode) {
      //this.shoppingService.updateIngredient(this.itemSelectedIndex, ing)
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(ing));
    } else {
      //this.shoppingService.addIngredient(ing);
      this.store.dispatch(new ShoppingListActions.AddIngredients(ing));
    }

    form.reset();
    this.editMode = false;
  }

  onClear() {
    this.slForm.reset();
    this.editMode = false;
  }

  onDelete() {
    this.shoppingService.deleteIngredient(this.itemSelectedIndex);
    this.onClear();
  }

  ngOnDestroy(): void {
    //this.startedEditingSub.unsubscribe();
  }
}
