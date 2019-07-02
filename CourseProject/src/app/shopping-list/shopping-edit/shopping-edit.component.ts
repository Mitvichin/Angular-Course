import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingService } from 'src/app/Services/shopping.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.scss']
})
export class ShoppingEditComponent implements OnInit {
  @ViewChild('nameInput', { static: false }) nameInput: ElementRef;
  @ViewChild('amountInput', { static: false }) amountInputInput: ElementRef;
  constructor( private shoppingService:ShoppingService) { }

  ngOnInit() {
  }

  onAddItem() {
    const ing = new Ingredient(this.nameInput.nativeElement.value, this.amountInputInput.nativeElement.value);
    this.shoppingService.addIngredient(ing);
  }
}
