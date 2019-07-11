import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingService } from 'src/app/Services/shopping.service';
import { NgForm } from '@angular/forms';
import { Subscribable, Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.scss']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: false }) slFrom: NgForm;
  startedEditingSub: Subscription;
  editMode: boolean = false;
  itemSelectedIndex: number;
  itemSelected: Ingredient;

  constructor(private shoppingService: ShoppingService) { }

  ngOnInit() {
    this.startedEditingSub = this.shoppingService.startedEditing.subscribe((index: number) => {
      this.itemSelectedIndex = index;
      this.editMode = true;
      this.itemSelected = this.shoppingService.getIngredient(index);
      this.slFrom.setValue(this.itemSelected);
    });
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const ing = new Ingredient(value.name, value.amount);

    if (this.editMode) {
      this.shoppingService.updateIngredient(this.itemSelectedIndex, ing)
    } else {
      this.shoppingService.addIngredient(ing);
    }

    form.reset();
    this.editMode = false;
  }

  onClear(){
    this.slFrom.reset();
    this.editMode = false;
  }

  onDelete(){
    this.shoppingService.deleteIngredient(this.itemSelectedIndex);
    this.onClear();
  }

  ngOnDestroy(): void {
    this.startedEditingSub.unsubscribe();
  }
}
