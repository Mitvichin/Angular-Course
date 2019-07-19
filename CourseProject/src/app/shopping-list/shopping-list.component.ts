import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingService } from '../Services/shopping.service';
import { Subscription, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import * as fromShoppingList from './store/shopping-list.reducer';
import { mapTo, map, exhaustMap } from 'rxjs/operators';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  ingredients: Observable<Ingredient[]>;

  constructor(private shoppingService: ShoppingService, private store: Store<fromApp.AppState>) { }

   ngOnInit() {
    this.ingredients = this.store.select("shoppingList").pipe(map(state =>{
      return state.ingredients;
    }));
    
    // this.ingredients = this.shoppingService.getIngredients();
    // this.subscription = this.shoppingService.ingredientsChanged.subscribe((ings: Ingredient[]) => {
    //   this.ingredients = ings;
    // });
  }

  onEditItem(index: number) {
    //this.shoppingService.startedEditing.next(index);
    this.store.dispatch(new ShoppingListActions.StartEditing(index));
  }

  ngOnDestroy(): void {
    //this.subscription.unsubscribe();
  }
}
